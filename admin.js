(function(){
'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
let currentAdmin = null;
let allUsers = [];
let currentModalUid = null;
let usersUnsubscribe = null; // Real-time listener handle

// ===== HELPERS =====
function formatDate(ts){
    if(!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}) + 
           ' ' + d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
}
function shortDate(ts){
    if(!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function avatarHtml(photoURL, name){
    if(photoURL){
        return `<img src="${photoURL}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover">`;
    }
    const c = (name||'U').charAt(0).toUpperCase();
    return `<div style="width:32px;height:32px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600;flex-shrink:0">${c}</div>`;
}

function isPlanExpired(user){
    if(!user) return false;
    const now = new Date();
    if(user.plan === 'trial'){
        if(!user.trialExpiresAt) return true;
        const exp = user.trialExpiresAt.toDate ? user.trialExpiresAt.toDate() : new Date(user.trialExpiresAt);
        return exp < now;
    }
    if(user.plan === 'premium' || user.plan === 'pro'){
        if(user.planExpiresAt){
            const exp = user.planExpiresAt.toDate ? user.planExpiresAt.toDate() : new Date(user.planExpiresAt);
            return exp < now;
        }
        return false; // Lifetime
    }
    return false;
}

function isTrialExpired(user){
    if(!user || user.plan !== 'trial') return false;
    return isPlanExpired(user);
}

function getEffectivePlan(user){
    if(!user) return 'free';
    if(user.plan === 'premium' && !isPlanExpired(user)) return 'premium';
    if(user.plan === 'pro' && !isPlanExpired(user)) return 'pro';
    if(user.plan === 'trial' && !isPlanExpired(user)) return 'trial';
    return 'free';
}

function isActive30d(user){
    if(!user || !user.lastLoginAt) return false;
    const d = user.lastLoginAt.toDate ? user.lastLoginAt.toDate() : new Date(user.lastLoginAt);
    const diff = Date.now() - d.getTime();
    return diff < 30*24*60*60*1000;
}

// ===== AUTH GUARD =====
function initAuth(){
    const loading = document.getElementById('adminLoading');
    const denied = document.getElementById('accessDenied');
    const app = document.getElementById('adminApp');

    auth.onAuthStateChanged(async (user) => {
        if(!user){
            window.location.href = 'auth.html';
            return;
        }

        // Check admin role
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if(!doc.exists || doc.data().role !== 'admin'){
                loading.style.display = 'none';
                denied.style.display = 'flex';
                return;
            }
            currentAdmin = user;
            loading.style.display = 'none';
            app.style.display = 'flex';

            // Set admin profile
            const av = document.getElementById('adminAvatar');
            if(av && user.photoURL) av.src = user.photoURL;
            const nm = document.getElementById('adminName');
            if(nm) nm.textContent = user.displayName || user.email || 'Admin';

            startRealtimeListener();
            initNavigation();
            initSearch();
            initActions();
            initModal();
            initDeleteConfirmModal();
            initQuestManagement();
            initAdminChatSystem();

            // Initialize Vietnamese Input Method Editor (default to Telex, active on admin management/search fields)
            if(typeof GoTiengViet !== 'undefined' && GoTiengViet.VietnameseInput){
                GoTiengViet.VietnameseInput.getInstance({
                    inputMethod: 'telex',
                    enabled: true
                });
            }
        } catch(err) {
            console.error('Admin auth error:', err);
            loading.style.display = 'none';
            denied.style.display = 'flex';
        }
    });
}

// ===== SOURCE TRACKING METADATA =====
const SOURCE_META = {
    tiktok: { label: 'TikTok', icon: '🎵', badgeClass: 'tiktok' },
    facebook: { label: 'Facebook', icon: '📘', badgeClass: 'facebook' },
    youtube: { label: 'YouTube', icon: '📺', badgeClass: 'youtube' },
    zalo: { label: 'Zalo', icon: '💬', badgeClass: 'zalo' },
    threads: { label: 'Threads', icon: '🧵', badgeClass: 'threads' },
    instagram: { label: 'Instagram', icon: '📷', badgeClass: 'instagram' },
    google: { label: 'Google', icon: '🔍', badgeClass: 'google' },
    twitter: { label: 'Twitter / X', icon: '🐦', badgeClass: 'twitter' },
    telegram: { label: 'Telegram', icon: '✈️', badgeClass: 'telegram' },
    direct: { label: 'Trực tiếp', icon: '🌐', badgeClass: 'direct' }
};

function getSourceInfo(sourceRaw){
    if (!sourceRaw) return { label: 'Trực tiếp', icon: '🌐', badgeClass: 'direct', key: 'direct' };
    const s = String(sourceRaw).toLowerCase().trim();
    if (SOURCE_META[s]) {
        return { ...SOURCE_META[s], key: s };
    }
    return {
        label: s.charAt(0).toUpperCase() + s.slice(1),
        icon: '🏷️',
        badgeClass: 'other',
        key: s
    };
}

function sourceBadgeHtml(sourceRaw){
    const info = getSourceInfo(sourceRaw);
    return `<span class="source-badge ${info.badgeClass}">${info.icon} ${escHtml(info.label)}</span>`;
}

// ===== REAL-TIME LISTENER =====
function startRealtimeListener() {
    // Unsubscribe previous listener if any
    if (usersUnsubscribe) usersUnsubscribe();

    usersUnsubscribe = db.collection('users').onSnapshot((snap) => {
        allUsers = [];
        snap.forEach(doc => {
            allUsers.push({ uid: doc.id, ...doc.data() });
        });
        updateStats();
        renderUsers(
            document.getElementById('filterPlan')?.value,
            document.getElementById('searchInput')?.value?.trim(),
            document.getElementById('filterSource')?.value
        );
        renderPending();

        // Flash the refresh button to indicate live update
        const btn = document.getElementById('btnRefresh');
        if (btn) {
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1000);
        }
    }, (err) => {
        console.error('Real-time listener error:', err);
        // Fallback to one-time load
        loadUsers();
    });
}

// Fallback one-time load
async function loadUsers(){
    try {
        const snap = await db.collection('users').get();
        allUsers = [];
        snap.forEach(doc => {
            allUsers.push({ uid: doc.id, ...doc.data() });
        });
        updateStats();
        renderUsers();
        renderPending();
    } catch(err) {
        console.error('Load users error:', err);
    }
}

// ===== STATS & SOURCE BREAKDOWN =====
function updateStats(){
    document.getElementById('statTotal').textContent = allUsers.length;
    document.getElementById('statActive').textContent = allUsers.filter(u => isActive30d(u)).length;
    document.getElementById('statPremium').textContent = allUsers.filter(u => getEffectivePlan(u) === 'premium').length;
    document.getElementById('statTrial').textContent = allUsers.filter(u => getEffectivePlan(u) === 'trial').length;

    renderSourceStats();
    renderRecentUsers();
}

function renderRecentUsers(){
    const tbody = document.getElementById('recentUsersBody');
    if (!tbody) return;

    const recent = [...allUsers].sort((a,b) => {
        if(a.role === 'admin' && b.role !== 'admin') return -1;
        if(b.role === 'admin' && a.role !== 'admin') return 1;
        const aTime = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0) : 0;
        const bTime = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0) : 0;
        return bTime - aTime;
    }).slice(0, 8);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Chưa có người dùng nào</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(u => {
        const plan = getEffectivePlan(u);
        const planLabel = plan === 'premium' ? '👑 Premium' : plan === 'trial' ? '⏳ Trial' : 'Free';
        const name = u.displayName || u.email?.split('@')[0] || 'Unknown';

        return `<tr>
            <td>
                <div class="user-cell">
                    ${avatarHtml(u.photoURL, name)}
                    <span class="user-cell-name">${escHtml(name)}${u.role==='admin'?' <svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg>':''}</span>
                </div>
            </td>
            <td>${escHtml(u.email||'—')}</td>
            <td><span class="plan-badge ${plan}">${planLabel}</span></td>
            <td>${sourceBadgeHtml(u.registerSource || u.utm_source)}</td>
            <td>${shortDate(u.createdAt)}</td>
            <td>
                <button class="btn-sm chat" onclick="window._adminOpenChat('${u.uid}')" title="Nhắn tin hỗ trợ">💬</button>
                <button class="btn-sm" onclick="window._adminViewUser('${u.uid}')" title="Chi tiết">👁️ Chi tiết</button>
            </td>
        </tr>`;
    }).join('');
}

function renderSourceStats(){
    const container = document.getElementById('sourceStatsGrid');
    const totalEl = document.getElementById('sourceTotalCount');
    if (!container) return;

    const total = allUsers.length || 0;
    if (totalEl) totalEl.textContent = `${total} user`;

    const counts = {};
    allUsers.forEach(u => {
        const info = getSourceInfo(u.registerSource || u.utm_source);
        const key = info.key;
        counts[key] = (counts[key] || 0) + 1;
    });

    const priorityKeys = ['tiktok', 'facebook', 'youtube', 'zalo', 'threads', 'google', 'direct'];
    const allKeys = Array.from(new Set([...priorityKeys, ...Object.keys(counts)]));
    allKeys.sort((a, b) => (counts[b] || 0) - (counts[a] || 0));

    const displayKeys = allKeys.filter(k => (counts[k] || 0) > 0 || ['tiktok', 'facebook', 'youtube', 'zalo', 'direct'].includes(k));

    container.innerHTML = displayKeys.map(key => {
        const info = getSourceInfo(key);
        const count = counts[key] || 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
            <div class="source-stat-item ${info.badgeClass}" onclick="window._adminFilterBySource('${key}')" title="Bấm để lọc danh sách user ${info.label}">
                <div class="source-stat-top">
                    <span class="source-stat-icon">${info.icon}</span>
                    <span class="source-stat-name">${escHtml(info.label)}</span>
                    <span class="source-stat-count">${count}</span>
                </div>
                <div class="source-stat-bar-bg">
                    <div class="source-stat-bar-fill" style="width: ${percent}%;"></div>
                </div>
                <div class="source-stat-bottom">
                    <span class="source-stat-pct">${percent}%</span>
                    <span class="source-stat-hint">Xem danh sách →</span>
                </div>
            </div>
        `;
    }).join('');
}

window._adminFilterBySource = (sourceKey) => {
    const navUsers = document.querySelector('.nav-item[data-section="users"]');
    if (navUsers) navUsers.click();
    const filterSource = document.getElementById('filterSource');
    if (filterSource) {
        let opt = Array.from(filterSource.options).find(o => o.value === sourceKey);
        if (opt) {
            filterSource.value = sourceKey;
        } else {
            filterSource.value = 'all';
        }
    }
    const filterPlan = document.getElementById('filterPlan');
    const searchInput = document.getElementById('searchInput');
    renderUsers(filterPlan ? filterPlan.value : 'all', searchInput ? searchInput.value.trim() : '', sourceKey);
};

// ===== RENDER USERS TABLE =====
function renderUsers(filter, search, filterSource){
    const tbody = document.getElementById('userTableBody');
    const empty = document.getElementById('tableEmpty');
    
    if (filter === undefined) filter = document.getElementById('filterPlan')?.value;
    if (search === undefined) search = document.getElementById('searchInput')?.value?.trim();
    if (filterSource === undefined) filterSource = document.getElementById('filterSource')?.value;

    let filtered = [...allUsers];
    
    // Filter by plan
    if(filter && filter !== 'all'){
        filtered = filtered.filter(u => getEffectivePlan(u) === filter);
    }

    // Filter by source
    if(filterSource && filterSource !== 'all'){
        if(filterSource === 'other'){
            const standardSources = ['tiktok', 'facebook', 'youtube', 'zalo', 'threads', 'instagram', 'google', 'direct', 'twitter', 'telegram'];
            filtered = filtered.filter(u => {
                const s = (u.registerSource || u.utm_source || 'direct').toLowerCase();
                return !standardSources.includes(s);
            });
        } else if (filterSource === 'threads') {
            filtered = filtered.filter(u => {
                const s = (u.registerSource || u.utm_source || '').toLowerCase();
                return s === 'threads' || s === 'instagram';
            });
        } else {
            filtered = filtered.filter(u => {
                const s = (u.registerSource || u.utm_source || 'direct').toLowerCase();
                return s === filterSource;
            });
        }
    }
    
    // Search
    if(search){
        const q = search.toLowerCase();
        filtered = filtered.filter(u => 
            (u.displayName||'').toLowerCase().includes(q) || 
            (u.email||'').toLowerCase().includes(q) ||
            (u.registerSource||'').toLowerCase().includes(q) ||
            (u.utm_campaign||'').toLowerCase().includes(q) ||
            u.uid.toLowerCase().includes(q)
        );
    }

    if(filtered.length === 0){
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    // Sort: admin first, then by createdAt desc
    filtered.sort((a,b) => {
        if(a.role === 'admin' && b.role !== 'admin') return -1;
        if(b.role === 'admin' && a.role !== 'admin') return 1;
        const aTime = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0) : 0;
        const bTime = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0) : 0;
        return bTime - aTime;
    });

    tbody.innerHTML = filtered.map(u => {
        const plan = getEffectivePlan(u);
        const planLabel = plan === 'premium' ? '👑 Premium' : plan === 'trial' ? '⏳ Trial' : 'Free';
        const statusClass = u.disabled ? 'disabled' : isTrialExpired(u) ? 'expired' : 'active';
        const statusLabel = u.disabled ? '🔒 Vô hiệu' : isTrialExpired(u) ? '⚠️ Hết trial' : '✅ Active';
        const name = u.displayName || u.email?.split('@')[0] || 'Unknown';

        return `<tr data-uid="${u.uid}">
            <td>
                <div class="user-cell">
                    ${avatarHtml(u.photoURL, name)}
                    <span class="user-cell-name">${escHtml(name)}${u.role==='admin'?' <svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg>':''}</span>
                </div>
            </td>
            <td>${escHtml(u.email||'—')}</td>
            <td><span class="plan-badge ${plan}">${planLabel}</span></td>
            <td>${sourceBadgeHtml(u.registerSource || u.utm_source)}</td>
            <td>${shortDate(u.createdAt)}</td>
            <td>${shortDate(u.lastLoginAt)}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
            <td>
                <button class="btn-sm chat" onclick="window._adminOpenChat('${u.uid}')" title="Nhắn tin hỗ trợ">💬</button>
                <button class="btn-sm" onclick="window._adminViewUser('${u.uid}')" title="Chi tiết">👁️</button>
                ${plan !== 'premium' ? `<button class="btn-sm upgrade" onclick="window._adminQuickUpgrade('${u.uid}')" title="Upgrade Premium">👑</button>` : ''}
                ${u.role !== 'admin' ? `<button class="btn-sm danger" onclick="window._adminDeleteUser('${u.uid}')" title="Xóa tài khoản">🗑️</button>` : ''}
            </td>
        </tr>`;
    }).join('');
}

function escHtml(s){
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
const escapeHtml = escHtml;

// ===== RENDER PENDING =====
function renderPending(){
    const tbody = document.getElementById('pendingTableBody');
    const empty = document.getElementById('pendingEmpty');
    
    const pending = allUsers.filter(u => u.upgradeRequested === true);
    const badge = document.getElementById('pendingBadge');
    
    if(pending.length > 0){
        badge.style.display = 'inline';
        badge.textContent = pending.length;
    } else {
        badge.style.display = 'none';
    }

    if(pending.length === 0){
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = pending.map(u => {
        const name = u.displayName || u.email?.split('@')[0] || 'Unknown';
        return `<tr>
            <td>
                <div class="user-cell">
                    ${avatarHtml(u.photoURL, name)}
                    <span class="user-cell-name">${escHtml(name)}</span>
                </div>
            </td>
            <td>${escHtml(u.email||'—')}</td>
            <td>${shortDate(u.upgradeRequestedAt)}</td>
            <td>${escHtml(u.upgradeNote||'HABIT_'+u.uid.substring(0,8))}</td>
            <td>
                <button class="btn-sm upgrade" onclick="window._adminApprovePending('${u.uid}')">✅ Duyệt</button>
                <button class="btn-sm danger" onclick="window._adminRejectPending('${u.uid}')">❌ Từ chối</button>
            </td>
        </tr>`;
    }).join('');
}

// ===== NAVIGATION =====
function initNavigation(){
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            // Update nav active state
            document.querySelectorAll('.nav-item[data-section]').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Show/hide sections
            document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
            const target = document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1));
            if(target) target.style.display = 'block';
            
            // Update title
            const titles = { dashboard: 'Dashboard', users: 'Quản lý User', pending: 'Chờ duyệt', quests: 'Nhiệm vụ Đột xuất', messages: 'Hộp Thư Chat & Hỗ Trợ User' };
            document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        };
    });
}

// ===== SEARCH & FILTER =====
function initSearch(){
    const searchInput = document.getElementById('searchInput');
    const filterPlan = document.getElementById('filterPlan');
    const filterSource = document.getElementById('filterSource');
    
    let debounce;
    searchInput.oninput = () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            renderUsers(filterPlan.value, searchInput.value.trim(), filterSource ? filterSource.value : 'all');
        }, 300);
    };
    filterPlan.onchange = () => {
        renderUsers(filterPlan.value, searchInput.value.trim(), filterSource ? filterSource.value : 'all');
    };
    if (filterSource) {
        filterSource.onchange = () => {
            renderUsers(filterPlan.value, searchInput.value.trim(), filterSource.value);
        };
    }
}

// ===== ACTIONS =====
function initActions(){
    document.getElementById('btnRefresh').onclick = async () => {
        await loadUsers();
    };

    const btnGoToUsers = document.getElementById('btnGoToUsers');
    if (btnGoToUsers) {
        btnGoToUsers.onclick = () => {
            const navUsers = document.querySelector('.nav-item[data-section="users"]');
            if (navUsers) navUsers.click();
        };
    }

    document.getElementById('btnExportUsers').onclick = () => {
        const headers = ['UID','Name','Email','Plan','Role','Source','UTM_Source','UTM_Campaign','Referrer','Created','LastLogin','Disabled'];
        const rows = allUsers.map(u => [
            u.uid,
            u.displayName||'',
            u.email||'',
            getEffectivePlan(u),
            u.role||'customer',
            u.registerSource||'direct',
            u.utm_source||'',
            u.utm_campaign||'',
            u.referrer||'',
            shortDate(u.createdAt),
            shortDate(u.lastLoginAt),
            u.disabled?'Yes':'No'
        ]);
        let csv = headers.join(',') + '\n';
        rows.forEach(r => { csv += r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n'; });
        
        const blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-users-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    document.getElementById('adminLogout').onclick = (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem('habitgame_v3');
            localStorage.removeItem('hg_bonus_dp');
        } catch(e) {}
        auth.signOut().then(() => { window.location.href = 'auth.html'; });
    };
}

// ===== MODAL =====
function initModal(){
    const modal = document.getElementById('userModal');
    document.getElementById('modalClose').onclick = () => { modal.style.display = 'none'; };
    modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

    document.getElementById('modalSavePlan').onclick = async () => {
        if(!currentModalUid) return;
        const newPlan = document.getElementById('modalPlanSelect').value;
        const duration = document.getElementById('modalPlanDuration')?.value || 'forever';
        const now = new Date();
        const updates = {
            plan: newPlan,
            planUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            planStartedAt: firebase.firestore.Timestamp.fromDate(now),
            upgradeRequested: false,
        };
        
        if(newPlan === 'trial'){
            updates.trialStartedAt = firebase.firestore.Timestamp.fromDate(now);
            updates.trialExpiresAt = firebase.firestore.Timestamp.fromDate(new Date(now.getTime() + 14*24*60*60*1000));
            updates.planExpiresAt = null;
        } else if(newPlan === 'premium' || newPlan === 'pro'){
            if(duration === 'forever'){
                updates.planExpiresAt = null;
            } else {
                const days = parseInt(duration, 10) || 30;
                updates.planExpiresAt = firebase.firestore.Timestamp.fromDate(new Date(now.getTime() + days*24*60*60*1000));
            }
        } else {
            updates.planExpiresAt = null;
        }

        try {
            await db.collection('users').doc(currentModalUid).update(updates);
            modal.style.display = 'none';
            await loadUsers();
        } catch(err) {
            console.error('Update plan error:', err);
            alert('Lỗi cập nhật: ' + err.message);
        }
    };

    document.getElementById('modalToggleDisable').onclick = async () => {
        if(!currentModalUid) return;
        const user = allUsers.find(u => u.uid === currentModalUid);
        if(!user) return;
        
        const newState = !user.disabled;
        const confirm2 = confirm(newState ? 'Vô hiệu hóa tài khoản này?' : 'Kích hoạt lại tài khoản này?');
        if(!confirm2) return;

        try {
            await db.collection('users').doc(currentModalUid).update({ disabled: newState });
            modal.style.display = 'none';
            await loadUsers();
        } catch(err) {
            console.error('Toggle disable error:', err);
            alert('Lỗi: ' + err.message);
        }
    };

    // DP Grant handler
    document.getElementById('modalGrantDP').onclick = async () => {
        if(!currentModalUid) return;
        const amount = parseInt(document.getElementById('modalDPAmount').value);
        const reason = document.getElementById('modalDPReason').value.trim();
        if(!amount || amount <= 0) { alert('Số DP phải lớn hơn 0'); return; }
        if(!reason) { alert('Vui lòng nhập lý do'); return; }

        try {
            // Update both leaderboard and users document with bonusDP & totalDP
            const batch = db.batch();
            const lbRef = db.collection('leaderboard').doc(currentModalUid);
            const userRef = db.collection('users').doc(currentModalUid);

            batch.set(lbRef, {
                totalDP: firebase.firestore.FieldValue.increment(amount),
                bonusDP: firebase.firestore.FieldValue.increment(amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            batch.set(userRef, {
                bonusDP: firebase.firestore.FieldValue.increment(amount),
                totalDP: firebase.firestore.FieldValue.increment(amount),
            }, { merge: true });

            await batch.commit();

            // Log the grant
            await db.collection('dp_grants').add({
                uid: currentModalUid,
                amount: amount,
                reason: reason,
                grantedBy: firebase.auth().currentUser.uid,
                grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert(`✅ Đã tặng ${amount} DP cho user!`);
            document.getElementById('modalDPAmount').value = '100';
            document.getElementById('modalDPReason').value = '';
        } catch(err) {
            console.error('DP grant error:', err);
            alert('Lỗi: ' + err.message);
        }
    };

    // Delete user button in modal
    document.getElementById('modalDeleteUser').onclick = () => {
        if(!currentModalUid) return;
        openDeleteConfirmModal(currentModalUid);
    };
}

function openUserModal(uid){
    const user = allUsers.find(u => u.uid === uid);
    if(!user) return;
    currentModalUid = uid;

    document.getElementById('modalUserName').textContent = user.displayName || user.email || 'User';
    document.getElementById('detailUid').textContent = uid;
    document.getElementById('detailEmail').textContent = user.email || '—';
    
    const plan = getEffectivePlan(user);
    document.getElementById('detailPlan').innerHTML = `<span class="plan-badge ${plan}">${plan === 'premium' ? '👑 Premium' : plan === 'trial' ? '⏳ Trial' : 'Free'}</span>`;
    document.getElementById('detailRole').textContent = user.role || 'customer';
    
    // Registration Source details
    const detailSourceEl = document.getElementById('detailSource');
    if (detailSourceEl) {
        detailSourceEl.innerHTML = sourceBadgeHtml(user.registerSource || user.utm_source);
    }
    const detailCampaignEl = document.getElementById('detailCampaign');
    if (detailCampaignEl) {
        const camp = user.utm_campaign || user.utm_medium || user.utm_source || '—';
        detailCampaignEl.textContent = camp;
    }
    const detailReferrerEl = document.getElementById('detailReferrer');
    if (detailReferrerEl) {
        if (user.referrer) {
            detailReferrerEl.innerHTML = `<a href="${escHtml(user.referrer)}" target="_blank" rel="noopener" style="color:var(--accent-blue-bright);word-break:break-all;">${escHtml(user.referrer)}</a>`;
        } else {
            detailReferrerEl.textContent = '— (Truy cập trực tiếp)';
        }
    }

    document.getElementById('detailCreated').textContent = formatDate(user.createdAt);
    document.getElementById('detailTrialExp').textContent = formatDate(user.trialExpiresAt);
    document.getElementById('detailPlanExp').textContent = user.planExpiresAt ? formatDate(user.planExpiresAt) : 'Vĩnh viễn';
    document.getElementById('detailLastLogin').textContent = formatDate(user.lastLoginAt);

    document.getElementById('modalPlanSelect').value = user.plan || 'free';

    const toggleBtn = document.getElementById('modalToggleDisable');
    toggleBtn.textContent = user.disabled ? '🔓 Kích hoạt' : '🔒 Vô hiệu hóa';

    // Show/hide delete button based on role
    const deleteBtn = document.getElementById('modalDeleteUser');
    if(deleteBtn){
        deleteBtn.style.display = user.role === 'admin' ? 'none' : 'inline-flex';
    }

    document.getElementById('userModal').style.display = 'flex';
}

// ===== GLOBAL ACTION HANDLERS =====
window._adminViewUser = (uid) => { openUserModal(uid); };

window._adminQuickUpgrade = async (uid) => {
    if(!confirm('Nâng cấp user này lên Premium?')) return;
    try {
        await db.collection('users').doc(uid).update({
            plan: 'premium',
            planUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            planExpiresAt: null,
            upgradeRequested: false,
        });
        await loadUsers();
    } catch(err) {
        alert('Lỗi: ' + err.message);
    }
};

window._adminApprovePending = async (uid) => {
    if(!confirm('Duyệt yêu cầu Premium cho user này?')) return;
    try {
        await db.collection('users').doc(uid).update({
            plan: 'premium',
            planUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            planExpiresAt: null,
            upgradeRequested: false,
            upgradeApprovedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await loadUsers();
    } catch(err) {
        alert('Lỗi: ' + err.message);
    }
};

window._adminRejectPending = async (uid) => {
    if(!confirm('Từ chối yêu cầu này?')) return;
    try {
        await db.collection('users').doc(uid).update({
            upgradeRequested: false,
            upgradeRejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await loadUsers();
    } catch(err) {
        alert('Lỗi: ' + err.message);
    }
};

// ===== DELETE USER =====
let pendingDeleteUid = null;

function openDeleteConfirmModal(uid){
    const user = allUsers.find(u => u.uid === uid);
    if(!user) return;
    if(user.role === 'admin'){
        alert('Không thể xóa tài khoản admin!');
        return;
    }
    pendingDeleteUid = uid;

    document.getElementById('deleteUserName').textContent = user.displayName || user.email?.split('@')[0] || 'Unknown';
    document.getElementById('deleteUserEmail').textContent = user.email || '—';

    const input = document.getElementById('deleteConfirmInput');
    input.value = '';
    document.getElementById('deleteConfirmBtn').disabled = true;

    // Close user modal if open
    document.getElementById('userModal').style.display = 'none';

    document.getElementById('deleteConfirmModal').style.display = 'flex';
    input.focus();
}

function initDeleteConfirmModal(){
    const modal = document.getElementById('deleteConfirmModal');
    const input = document.getElementById('deleteConfirmInput');
    const confirmBtn = document.getElementById('deleteConfirmBtn');
    const cancelBtn = document.getElementById('deleteConfirmCancel');
    const closeBtn = document.getElementById('deleteConfirmClose');

    const closeModal = () => {
        modal.style.display = 'none';
        input.value = '';
        confirmBtn.disabled = true;
        pendingDeleteUid = null;
    };

    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };

    input.oninput = () => {
        const val = input.value.trim().toUpperCase();
        confirmBtn.disabled = (val !== 'XÓA' && val !== 'XOA');
    };

    confirmBtn.onclick = async () => {
        if(!pendingDeleteUid) return;
        const val = input.value.trim().toUpperCase();
        if(val !== 'XÓA' && val !== 'XOA') return;

        confirmBtn.disabled = true;
        confirmBtn.textContent = '⏳ Đang xóa...';

        try {
            const uid = pendingDeleteUid;
            const userRef = db.collection('users').doc(uid);

            // 1. Delete known subcollections under user doc
            const knownSubcollections = ['habits', 'notes', 'tasks', 'journal', 'achievements', 'settings', 'streaks'];
            for(const subName of knownSubcollections){
                try {
                    const subSnap = await userRef.collection(subName).get();
                    const batch = db.batch();
                    subSnap.forEach(doc => batch.delete(doc.ref));
                    if(!subSnap.empty) await batch.commit();
                } catch(e) { /* subcollection might not exist, skip */ }
            }

            // 2. Delete user document
            await userRef.delete();

            // 3. Delete related payments
            try {
                const payments = await db.collection('payments').where('uid', '==', uid).get();
                if(!payments.empty){
                    const batch = db.batch();
                    payments.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                }
            } catch(e) { console.warn('Skip payments delete:', e); }

            // 4. Delete leaderboard entry
            try {
                await db.collection('leaderboard').doc(uid).delete();
            } catch(e) { /* skip */ }

            // 5. Delete community posts
            try {
                const posts = await db.collection('community_posts').where('uid', '==', uid).get();
                if(!posts.empty){
                    const batch = db.batch();
                    posts.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                }
            } catch(e) { console.warn('Skip posts delete:', e); }

            closeModal();
            alert('✅ Đã xóa tài khoản thành công!\n\n⚠️ Lưu ý: Tài khoản đăng nhập (Auth) chỉ xóa được khi nâng lên gói Blaze.');
        } catch(err) {
            console.error('Delete user error:', err);
            alert('❌ Lỗi: ' + (err.message || 'Không thể xóa tài khoản'));
            confirmBtn.disabled = false;
            confirmBtn.textContent = '🗑️ Xóa vĩnh viễn';
        }
    };
}

window._adminDeleteUser = (uid) => { openDeleteConfirmModal(uid); };

// ===== QUEST MANAGEMENT =====
async function initQuestManagement() {
    const btnCreate = document.getElementById('btnCreateQuest');
    if (btnCreate) {
        btnCreate.onclick = async () => {
            const title = document.getElementById('questTitle').value.trim();
            const desc = document.getElementById('questDescription').value.trim();
            const dp = parseInt(document.getElementById('questRewardDP').value) || 100;
            const deadlineStr = document.getElementById('questDeadline').value;

            if (!title) { alert('Vui lòng nhập tên nhiệm vụ'); return; }

            try {
                const questData = {
                    title,
                    description: desc,
                    rewardDP: dp,
                    status: 'active',
                    createdBy: firebase.auth().currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                };
                if (deadlineStr) {
                    questData.deadline = firebase.firestore.Timestamp.fromDate(new Date(deadlineStr));
                }
                await db.collection('surprise_quests').add(questData);
                alert('✅ Đã tạo nhiệm vụ!');
                document.getElementById('questTitle').value = '';
                document.getElementById('questDescription').value = '';
                document.getElementById('questRewardDP').value = '100';
                document.getElementById('questDeadline').value = '';
                loadAdminQuests();
            } catch (e) {
                alert('Lỗi: ' + e.message);
            }
        };
    }
    loadAdminQuests();
}

async function loadAdminQuests() {
    const container = document.getElementById('activeQuestsList');
    const subContainer = document.getElementById('questSubmissionsList');
    if (!container) return;

    try {
        const snap = await db.collection('surprise_quests').orderBy('createdAt', 'desc').limit(20).get();
        if (snap.empty) {
            container.innerHTML = '<p style="color:#94a3b8;padding:16px;font-weight:600;">Chưa có nhiệm vụ nào</p>';
        } else {
            let html = '';
            snap.forEach(doc => {
                const q = doc.data();
                const deadline = q.deadline ? new Date(q.deadline.toDate()).toLocaleDateString('vi-VN') : 'Không';
                const statusColor = q.status === 'active' ? '#34d399' : '#94a3b8';
                html += `<div style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:#1e293b;border:1px solid rgba(148,163,184,0.22);border-radius:12px;margin-bottom:10px;box-shadow:0 4px 16px rgba(0,0,0,0.3);">
                    <div style="flex:1;">
                        <div style="font-weight:700;color:#ffffff;font-size:14.5px;"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-coin"></use></svg> ${escapeHtml(q.title || '')}</div>
                        <div style="font-size:13px;color:#cbd5e1;margin-top:4px;line-height:1.4;">${escapeHtml(q.description || '')} | <strong style="color:#fcd34d;">+${q.rewardDP || 0}</strong> <svg class="rune-inline" style="width:14px;height:14px;vertical-align:-2px;" viewBox="0 0 48 48"><use href="#i-coin"></use></svg> | Hạn: <span style="color:#93c5fd;">${deadline}</span></div>
                    </div>
                    <span style="color:${statusColor};font-size:12.5px;font-weight:700;padding:4px 10px;background:rgba(255,255,255,0.06);border-radius:8px;">${q.status === 'active' ? 'Đang mở' : 'Đã đóng'}</span>
                    ${q.status === 'active' ? `<button onclick="window._deactivateQuest('${doc.id}')" style="background:rgba(244,63,94,0.18);color:#fb7185;border:1px solid rgba(244,63,94,0.4);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;">Đóng</button>` : ''}
                </div>`;
            });
            container.innerHTML = html;
        }

        // Load submissions
        let subHtml = '';
        let pendingCount = 0;
        for (const doc of snap.docs) {
            const q = doc.data();
            if (q.status !== 'active') continue;
            try {
                const subs = await db.collection('surprise_quests').doc(doc.id).collection('submissions')
                    .where('status', '==', 'pending').get();
                subs.forEach(sub => {
                    const s = sub.data();
                    pendingCount++;
                    subHtml += `<div style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:linear-gradient(135deg, rgba(139,92,246,0.18), #1e293b);border:1px solid rgba(139,92,246,0.35);border-radius:12px;margin-bottom:10px;box-shadow:0 4px 16px rgba(0,0,0,0.3);">
                        <div style="flex:1;">
                            <div style="font-weight:700;color:#ffffff;font-size:14.5px;">${escapeHtml(s.displayName || 'User')}</div>
                            <div style="font-size:13px;color:#cbd5e1;margin-top:4px;"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-coin"></use></svg> ${escapeHtml(q.title || '')} | <strong style="color:#fcd34d;">+${q.rewardDP || 0}</strong> <svg class="rune-inline" style="width:14px;height:14px;vertical-align:-2px;" viewBox="0 0 48 48"><use href="#i-coin"></use></svg></div>
                        </div>
                        <button onclick="window._approveSubmission('${doc.id}','${sub.id}','${sub.data().uid}',${q.rewardDP || 0})" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;box-shadow:0 2px 10px rgba(16,185,129,0.35);">✅ Duyệt</button>
                        <button onclick="window._rejectSubmission('${doc.id}','${sub.id}')" style="background:rgba(244,63,94,0.18);color:#fb7185;border:1px solid rgba(244,63,94,0.4);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;">❌ Từ chối</button>
                    </div>`;
                });
            } catch (e) { console.warn('Load submissions error:', e); }
        }

        if (subContainer) {
            subContainer.innerHTML = subHtml || '<p style="color:#94a3b8;padding:16px;font-weight:600;">Không có báo cáo chờ duyệt</p>';
        }

        // Update badge
        const badge = document.getElementById('questBadge');
        if (badge) {
            if (pendingCount > 0) {
                badge.textContent = pendingCount;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('Load quests error:', e);
        container.innerHTML = '<p style="color:#ef4444;">Lỗi tải dữ liệu</p>';
    }
}

window._deactivateQuest = async (questId) => {
    if (!confirm('Đóng nhiệm vụ này?')) return;
    try {
        await db.collection('surprise_quests').doc(questId).update({ status: 'closed' });
        loadAdminQuests();
    } catch (e) { alert('Lỗi: ' + e.message); }
};

window._approveSubmission = async (questId, subId, uid, dp) => {
    try {
        const batch = db.batch();
        const subRef = db.collection('surprise_quests').doc(questId).collection('submissions').doc(subId);
        const lbRef = db.collection('leaderboard').doc(uid);
        const userRef = db.collection('users').doc(uid);

        batch.update(subRef, { status: 'approved' });
        batch.set(lbRef, {
            totalDP: firebase.firestore.FieldValue.increment(dp),
            bonusDP: firebase.firestore.FieldValue.increment(dp),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        batch.set(userRef, {
            bonusDP: firebase.firestore.FieldValue.increment(dp),
            totalDP: firebase.firestore.FieldValue.increment(dp),
        }, { merge: true });

        await batch.commit();

        // Log
        await db.collection('dp_grants').add({
            uid,
            amount: dp,
            reason: 'Nhiệm vụ đột xuất được duyệt',
            questId,
            grantedBy: firebase.auth().currentUser.uid,
            grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert(`✅ Đã duyệt và tặng ${dp} DP!`);
        loadAdminQuests();
    } catch (e) { alert('Lỗi: ' + e.message); }
};

window._rejectSubmission = async (questId, subId) => {
    try {
        await db.collection('surprise_quests').doc(questId).collection('submissions').doc(subId).update({ status: 'rejected' });
        loadAdminQuests();
    } catch (e) { alert('Lỗi: ' + e.message); }
};

// ==========================================================================
// ADMIN DIRECT MESSAGING & SUPPORT ENGINE (HỆ THỐNG HỘP THƯ CHAT ADMIN)
// ==========================================================================

let adminConversations = [];
let activeAdminConvId = null;
let activeAdminTargetUid = null;
let activeAdminTargetUser = null;
let adminMessagesUnsubscribe = null;
let adminConversationsUnsubscribe = null;
let adminChatTab = 'recent'; // 'recent' | 'all'
let adminChatSearchQuery = '';

function formatMsgTime(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    const isThisYear = d.getFullYear() === now.getFullYear();
    if (isThisYear) {
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function initAdminChatSystem() {
    if (!currentAdmin) return;

    // Listen for all conversations real-time
    try {
        if (adminConversationsUnsubscribe) adminConversationsUnsubscribe();
        adminConversationsUnsubscribe = db.collection('conversations')
            .orderBy('updatedAt', 'desc')
            .onSnapshot(snapshot => {
                adminConversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateAdminChatBadges();
                renderAdminChatThreads();
            }, err => {
                console.error('Admin conversations error:', err);
            });
    } catch (e) {
        console.error('initAdminChatSystem error:', e);
    }

    // Bind Enter key on textarea
    const textarea = document.getElementById('adminMessageInput');
    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window._adminHandleSendMessage();
            }
        });
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        });
    }
}

function updateAdminChatBadges() {
    if (!currentAdmin) return;
    let totalUnread = 0;
    adminConversations.forEach(c => {
        const unread = (c.unreadCount && c.unreadCount[currentAdmin.uid]) || 0;
        totalUnread += unread;
    });

    const badge = document.getElementById('adminMsgBadge');
    if (badge) {
        if (totalUnread > 0) {
            badge.style.display = 'inline-block';
            badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
        } else {
            badge.style.display = 'none';
        }
    }

    const tabBadge = document.getElementById('adminTabTotalBadge');
    if (tabBadge) {
        if (totalUnread > 0) {
            tabBadge.style.display = 'inline-block';
            tabBadge.textContent = totalUnread;
        } else {
            tabBadge.style.display = 'none';
        }
    }
}

function renderAdminChatThreads() {
    const listEl = document.getElementById('adminChatThreadsList');
    if (!listEl) return;

    const q = (adminChatSearchQuery || '').toLowerCase().trim();

    if (adminChatTab === 'all') {
        // Render from allUsers list
        let users = [...allUsers].filter(u => u.uid !== currentAdmin.uid);
        if (q) {
            users = users.filter(u => 
                (u.displayName || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q) ||
                u.uid.toLowerCase().includes(q)
            );
        }

        if (users.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;">Không tìm thấy user nào</div>';
            return;
        }

        listEl.innerHTML = users.map(u => {
            const name = u.displayName || u.email?.split('@')[0] || 'Chiến Binh';
            const plan = getEffectivePlan(u);
            const planLabel = plan === 'premium' ? '👑 VIP' : plan === 'trial' ? '⏳ Trial' : 'Free';
            const isActive = activeAdminTargetUid === u.uid;

            return `
                <div class="admin-thread-item ${isActive ? 'active' : ''}" onclick="window._adminOpenChat('${u.uid}')">
                    <div class="admin-thread-avatar">
                        ${u.photoURL ? `<img src="${u.photoURL}" alt="">` : `<div class="avatar-fallback">${escHtml(name.charAt(0).toUpperCase())}</div>`}
                    </div>
                    <div class="admin-thread-info">
                        <div class="admin-thread-top">
                            <span class="admin-thread-name">${escHtml(name)}</span>
                            <span class="plan-badge ${plan}" style="font-size:10px;padding:1px 6px;">${planLabel}</span>
                        </div>
                        <div class="admin-thread-bottom">
                            <span class="admin-thread-preview">${escHtml(u.email || '—')}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        return;
    }

    // Default 'recent' tab
    let convs = [...adminConversations];
    if (q) {
        convs = convs.filter(c => {
            const details = c.participantDetails || {};
            const otherUid = (c.participants || []).find(uid => uid !== currentAdmin.uid);
            const otherInfo = (otherUid && details[otherUid]) || {};
            const name = (otherInfo.displayName || otherInfo.email || '').toLowerCase();
            const lastText = (c.lastMessage && c.lastMessage.text || '').toLowerCase();
            return name.includes(q) || lastText.includes(q);
        });
    }

    if (convs.length === 0) {
        listEl.innerHTML = `
            <div style="text-align:center;padding:32px 16px;color:var(--text-muted);font-size:13px;">
                <div style="font-size:28px;margin-bottom:8px;">📭</div>
                <div>Chưa có hội thoại nào</div>
                <div style="font-size:11.5px;margin-top:6px;color:var(--accent-blue-bright);cursor:pointer;" onclick="window._switchAdminChatTab('all')">👉 Xem danh sách tất cả User để nhắn tin</div>
            </div>
        `;
        return;
    }

    listEl.innerHTML = convs.map(c => {
        const details = c.participantDetails || {};
        const otherUid = (c.participants || []).find(uid => uid !== currentAdmin.uid) || c.participants?.[0];
        const userObj = allUsers.find(u => u.uid === otherUid);
        const otherInfo = (otherUid && details[otherUid]) || userObj || {};
        const name = otherInfo.displayName || otherInfo.email?.split('@')[0] || userObj?.displayName || 'User';
        const photo = otherInfo.photoURL || userObj?.photoURL;
        const lastMsg = c.lastMessage || {};
        const lastText = lastMsg.text || 'Đã bắt đầu hội thoại';
        const isFromAdmin = lastMsg.senderId === currentAdmin.uid;
        const timeStr = formatMsgTime(c.updatedAt || lastMsg.createdAt);
        const unread = (c.unreadCount && c.unreadCount[currentAdmin.uid]) || 0;
        const isActive = activeAdminConvId === c.id;

        return `
            <div class="admin-thread-item ${isActive ? 'active' : ''}" onclick="window._adminSelectConversationById('${c.id}', '${otherUid}')">
                <div class="admin-thread-avatar">
                    ${photo ? `<img src="${photo}" alt="">` : `<div class="avatar-fallback">${escHtml(name.charAt(0).toUpperCase())}</div>`}
                </div>
                <div class="admin-thread-info">
                    <div class="admin-thread-top">
                        <span class="admin-thread-name">${escHtml(name)}</span>
                        <span class="admin-thread-time">${timeStr}</span>
                    </div>
                    <div class="admin-thread-bottom">
                        <span class="admin-thread-preview">${isFromAdmin ? '👑 Bạn: ' : ''}${escHtml(lastText)}</span>
                        ${unread > 0 ? `<span class="admin-thread-badge">${unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window._switchAdminChatTab = function(tab) {
    adminChatTab = tab;
    const btnRecent = document.getElementById('adminChatTabRecent');
    const btnAll = document.getElementById('adminChatTabAll');
    if (tab === 'all') {
        btnAll?.classList.add('active');
        btnRecent?.classList.remove('active');
    } else {
        btnRecent?.classList.add('active');
        btnAll?.classList.remove('active');
    }
    renderAdminChatThreads();
};

window._filterAdminChatList = function(q) {
    adminChatSearchQuery = q;
    renderAdminChatThreads();
};

window._adminOpenChat = async function(targetUid) {
    if (!targetUid || !currentAdmin) return;

    // Switch section to messages
    const navMessages = document.querySelector('.nav-item[data-section="messages"]');
    if (navMessages) navMessages.click();

    let user = allUsers.find(u => u.uid === targetUid);
    if (!user) {
        try {
            const doc = await db.collection('users').doc(targetUid).get();
            if (doc.exists) user = { uid: doc.id, ...doc.data() };
        } catch (e) { console.error(e); }
    }

    const canonicalConvId = [currentAdmin.uid, targetUid].sort().join('_');
    window._adminSelectConversationById(canonicalConvId, targetUid, user);
};

window._adminSelectConversationById = async function(convId, targetUid, preloadedUser) {
    activeAdminConvId = convId;
    activeAdminTargetUid = targetUid;

    let targetUser = preloadedUser || allUsers.find(u => u.uid === targetUid);
    if (!targetUser) {
        try {
            const doc = await db.collection('users').doc(targetUid).get();
            if (doc.exists) targetUser = { uid: doc.id, ...doc.data() };
        } catch (e) { console.error(e); }
    }
    activeAdminTargetUser = targetUser || { uid: targetUid, displayName: 'Chiến Binh' };

    // Update active state in UI
    const placeholder = document.getElementById('adminChatPlaceholder');
    const activeBox = document.getElementById('adminChatActive');
    if (placeholder) placeholder.style.display = 'none';
    if (activeBox) activeBox.style.display = 'flex';

    // Render header user info
    const userInfoEl = document.getElementById('adminChatUserInfo');
    if (userInfoEl) {
        const name = targetUser?.displayName || targetUser?.email?.split('@')[0] || 'User';
        const email = targetUser?.email || '—';
        const plan = getEffectivePlan(targetUser);
        const planLabel = plan === 'premium' ? '👑 Premium' : plan === 'trial' ? '⏳ Trial' : 'Free';
        const totalDP = targetUser?.totalDP || 0;
        const photo = targetUser?.photoURL;

        userInfoEl.innerHTML = `
            ${photo ? `<img src="${photo}" class="admin-chat-user-avatar" alt="">` : `<div class="admin-chat-user-avatar avatar-fallback" style="background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">${escHtml(name.charAt(0).toUpperCase())}</div>`}
            <div class="admin-chat-user-meta">
                <h4>${escHtml(name)} <span class="plan-badge ${plan}" style="font-size:10px;padding:2px 8px;">${planLabel}</span></h4>
                <p>${escHtml(email)} • 🏆 ${totalDP.toLocaleString('vi-VN')} DP • UID: <span class="mono" style="font-size:11px;">${targetUid.substring(0,8)}...</span></p>
            </div>
        `;
    }

    renderAdminChatThreads();

    // Mark as read for admin in Firestore
    try {
        db.collection('conversations').doc(convId).set({
            unreadCount: { [currentAdmin.uid]: 0 }
        }, { merge: true });
    } catch (e) { console.error(e); }

    // Stream messages
    if (adminMessagesUnsubscribe) adminMessagesUnsubscribe();
    const streamEl = document.getElementById('adminMessagesStream');
    if (streamEl) {
        streamEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;">Đang tải tin nhắn...</div>';
    }

    adminMessagesUnsubscribe = db.collection('conversations').doc(convId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .limitToLast(100)
        .onSnapshot(snapshot => {
            if (!streamEl) return;
            if (snapshot.empty) {
                streamEl.innerHTML = `
                    <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
                        <div style="font-size:32px;margin-bottom:8px;">💬</div>
                        <div style="font-weight:700;color:#ffffff;margin-bottom:4px;">Chưa có tin nhắn nào</div>
                        <div style="font-size:13px;">Hãy gửi tin nhắn đầu tiên để hỗ trợ hoặc thông báo cho thành viên này.</div>
                    </div>
                `;
                return;
            }

            streamEl.innerHTML = snapshot.docs.map(doc => {
                const msg = doc.data();
                const isOutgoing = msg.senderId === currentAdmin.uid;
                const timeStr = formatMsgTime(msg.createdAt);

                return `
                    <div class="admin-msg-row ${isOutgoing ? 'outgoing' : 'incoming'}">
                        <div class="admin-msg-bubble">
                            ${isOutgoing ? '<div class="admin-msg-tag">👑 Ban Quản Trị</div>' : ''}
                            <div class="admin-msg-text">${escHtml(msg.text)}</div>
                        </div>
                        <div class="admin-msg-meta">
                            <span>${timeStr}</span>
                            ${isOutgoing ? '<span>✓ Đã gửi</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('');

            streamEl.scrollTop = streamEl.scrollHeight;
        }, err => {
            console.error('Messages stream error:', err);
            if (streamEl) streamEl.innerHTML = `<div style="color:#ef4444;text-align:center;padding:20px;">Lỗi tải tin nhắn: ${err.message}</div>`;
        });
};

window._adminHandleSendMessage = async function(presetText) {
    if (!activeAdminConvId || !activeAdminTargetUid || !currentAdmin) return;

    const input = document.getElementById('adminMessageInput');
    const text = presetText || (input ? input.value.trim() : '');
    if (!text) return;

    const sendBtn = document.getElementById('adminSendBtn');
    if (sendBtn) sendBtn.disabled = true;

    try {
        const convRef = db.collection('conversations').doc(activeAdminConvId);
        const msgRef = convRef.collection('messages').doc();

        const targetUser = activeAdminTargetUser || {};
        const targetName = targetUser.displayName || targetUser.email?.split('@')[0] || 'Chiến Binh';

        const batch = db.batch();

        // 1. Add message doc
        batch.set(msgRef, {
            senderId: currentAdmin.uid,
            senderName: '👑 Ban Quản Trị (Admin)',
            senderPhoto: currentAdmin.photoURL || '',
            senderRankLevel: 10,
            senderRealmName: 'Quản Trị Viên',
            senderStep: 7,
            senderEquippedTitle: 'creator_badge',
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            read: false,
            isAdminMessage: true
        });

        // 2. Set/update parent conversation
        batch.set(convRef, {
            participants: [currentAdmin.uid, activeAdminTargetUid],
            participantDetails: {
                [currentAdmin.uid]: {
                    uid: currentAdmin.uid,
                    displayName: '👑 Ban Quản Trị (Admin)',
                    photoURL: currentAdmin.photoURL || '',
                    rankLevel: 10,
                    realmName: 'Quản Trị Viên',
                    step: 7,
                    equippedTitle: 'creator_badge',
                    isAdmin: true
                },
                [activeAdminTargetUid]: {
                    uid: activeAdminTargetUid,
                    displayName: targetName,
                    photoURL: targetUser.photoURL || '',
                    rankLevel: targetUser.rankLevel || 1,
                    realmName: targetUser.realmName || 'Phàm Nhân',
                    step: targetUser.step || 1,
                    equippedTitle: targetUser.equippedTitle || '',
                    totalDP: targetUser.totalDP || 0
                }
            },
            lastMessage: {
                text: text,
                senderId: currentAdmin.uid,
                senderName: '👑 Ban Quản Trị (Admin)',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                read: false
            },
            lastSenderId: currentAdmin.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            unreadCount: {
                [activeAdminTargetUid]: firebase.firestore.FieldValue.increment(1),
                [currentAdmin.uid]: 0
            }
        }, { merge: true });

        await batch.commit();

        if (!presetText && input) {
            input.value = '';
            input.style.height = 'auto';
        }
    } catch (err) {
        console.error('Admin send message error:', err);
        alert('Lỗi gửi tin nhắn: ' + err.message);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
};

window._adminSendPresetMessage = function(text) {
    window._adminHandleSendMessage(text);
};

window._adminChatQuickVIP = async function() {
    if (!activeAdminTargetUid) return;
    if (!confirm('Nâng cấp gói Premium (1 Năm) cho người dùng này?')) return;
    try {
        const expires = new Date();
        expires.setDate(expires.getDate() + 365);
        await db.collection('users').doc(activeAdminTargetUid).update({
            plan: 'premium',
            planExpiresAt: expires,
            upgradeRequested: false
        });
        window._adminSendPresetMessage('👑 Chúc mừng bạn! Tài khoản của bạn đã được Admin nâng cấp lên gói Premium (1 Năm). Hãy tận hưởng trọn vẹn mọi tính năng cao cấp!');
        await loadUsers();
        if (activeAdminConvId && activeAdminTargetUid) {
            window._adminSelectConversationById(activeAdminConvId, activeAdminTargetUid);
        }
    } catch (e) { alert('Lỗi: ' + e.message); }
};

window._adminChatQuickDP = async function(amount = 100) {
    if (!activeAdminTargetUid) return;
    try {
        const batch = db.batch();
        const lbRef = db.collection('leaderboard').doc(activeAdminTargetUid);
        const userRef = db.collection('users').doc(activeAdminTargetUid);

        batch.set(lbRef, {
            totalDP: firebase.firestore.FieldValue.increment(amount),
            bonusDP: firebase.firestore.FieldValue.increment(amount),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        batch.set(userRef, {
            bonusDP: firebase.firestore.FieldValue.increment(amount),
            totalDP: firebase.firestore.FieldValue.increment(amount),
        }, { merge: true });

        await batch.commit();

        await db.collection('dp_grants').add({
            uid: activeAdminTargetUid,
            amount: amount,
            reason: 'Tặng từ Hộp Thư Chat Admin',
            grantedBy: currentAdmin.uid,
            grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        window._adminSendPresetMessage(`🎁 Admin vừa gửi tặng bạn +${amount} Điểm Kỷ Luật DP khích lệ tinh thần rèn luyện!`);
        await loadUsers();
        if (activeAdminConvId && activeAdminTargetUid) {
            window._adminSelectConversationById(activeAdminConvId, activeAdminTargetUid);
        }
    } catch (e) { alert('Lỗi: ' + e.message); }
};

window._adminChatViewProfile = function() {
    if (activeAdminTargetUid) {
        window._adminViewUser(activeAdminTargetUid);
    }
};

window._adminOpenChatFromModal = function() {
    if (!currentModalUid) return;
    const targetUid = currentModalUid;
    const modal = document.getElementById('userModal');
    if (modal) modal.style.display = 'none';
    window._adminOpenChat(targetUid);
};

// ===== INIT =====
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initAuth) 
    : initAuth();

})();
