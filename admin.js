(function(){
'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
let currentAdmin = null;
let allUsers = [];
let currentModalUid = null;
let usersUnsubscribe = null; // Real-time listener handle
let selectedUserUids = new Set();
let currentFilteredUsersList = [];

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
            const mobileAv = document.getElementById('mobileAdminAvatar');
            if(mobileAv && user.photoURL) mobileAv.src = user.photoURL;
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
            initUserSelectionSystem();
            initEmailManagement();

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
                <button class="btn-sm email" onclick="window._adminOpenEmailComposer('${u.uid}')" title="Gửi email (Resend)">📧</button>
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

    currentFilteredUsersList = filtered;

    if(filtered.length === 0){
        tbody.innerHTML = '';
        empty.style.display = 'block';
        updateSelectionUI();
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
        const isSelected = selectedUserUids.has(u.uid);

        return `<tr data-uid="${u.uid}" class="${isSelected ? 'selected-row' : ''}">
            <td style="width:44px;text-align:center;">
                <input type="checkbox" class="user-row-chk admin-custom-chk" data-uid="${u.uid}" ${isSelected ? 'checked' : ''} onchange="window._adminToggleUserSelection('${u.uid}', event)" title="Chọn user ${escHtml(name)}">
            </td>
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
                <button class="btn-sm email" onclick="window._adminOpenEmailComposer('${u.uid}')" title="Gửi email (Resend)">📧</button>
                <button class="btn-sm" onclick="window._adminViewUser('${u.uid}')" title="Chi tiết">👁️</button>
                ${plan !== 'premium' ? `<button class="btn-sm upgrade" onclick="window._adminQuickUpgrade('${u.uid}')" title="Upgrade Premium">👑</button>` : ''}
                ${u.role !== 'admin' ? `<button class="btn-sm danger" onclick="window._adminDeleteUser('${u.uid}')" title="Xóa tài khoản">🗑️</button>` : ''}
            </td>
        </tr>`;
    }).join('');

    updateSelectionUI();
}

function escHtml(s){
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
const escapeHtml = escHtml;

// ===== RENDER PENDING =====
function renderPending(){
    const tbody = document.getElementById('pendingTableBody');
    const empty = document.getElementById('pendingEmpty');
    
    const pending = allUsers.filter(u => u.upgradeRequested === true);
    const badge = document.getElementById('pendingBadge');
    const bottomBadge = document.getElementById('bottomPendingBadge');
    const count = pending.length;
    
    [badge, bottomBadge].forEach(b => {
        if (b) {
            if (count > 0) {
                b.style.display = 'inline-block';
                b.textContent = count > 99 ? '99+' : count;
            } else {
                b.style.display = 'none';
            }
        }
    });

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

// ===== NAVIGATION & MOBILE DRAWER =====
function openMobileDrawer(){
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
}

function closeMobileDrawer(){
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
}

function switchSection(section){
    if (!section) return;

    // Update nav active state (both sidebar and bottom nav)
    document.querySelectorAll('.nav-item[data-section], .bottom-nav-item[data-section]').forEach(n => {
        if (n.dataset.section === section) {
            n.classList.add('active');
        } else {
            n.classList.remove('active');
        }
    });

    // Show/hide sections
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const target = document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1));
    if (target) target.style.display = 'block';

    // Update titles
    const titles = { 
        dashboard: 'Dashboard', 
        users: 'Quản lý User', 
        pending: 'Chờ duyệt', 
        quests: 'Nhiệm vụ & Zalo Code', 
        messages: 'Hộp Thư Chat & Hỗ Trợ User',
        emails: 'Gửi Email (Resend)'
    };
    const titleText = titles[section] || 'Dashboard';
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = titleText;
    const mobilePageTitle = document.getElementById('mobilePageTitle');
    if (mobilePageTitle) mobilePageTitle.textContent = titleText;

    if (section === 'quests') {
        loadZaloSecretCode();
    }
    if (section === 'emails') {
        if (typeof window._adminOnSwitchToEmails === 'function') {
            window._adminOnSwitchToEmails();
        }
    }

    // Close mobile drawer if open
    closeMobileDrawer();

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation(){
    // Sidebar nav items
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        };
    });

    // Bottom nav items
    document.querySelectorAll('.bottom-nav-item[data-section]').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        };
    });

    // Mobile drawer toggle buttons
    const btnToggle = document.getElementById('btnMobileNavToggle');
    if (btnToggle) {
        btnToggle.onclick = (e) => {
            e.preventDefault();
            const sidebar = document.getElementById('adminSidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        };
    }

    const btnClose = document.getElementById('btnSidebarClose');
    if (btnClose) {
        btnClose.onclick = (e) => {
            e.preventDefault();
            closeMobileDrawer();
        };
    }

    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
        backdrop.onclick = (e) => {
            e.preventDefault();
            closeMobileDrawer();
        };
    }
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

// ===== USER SELECTION & BULK ACTIONS SYSTEM =====
function updateSelectionUI() {
    const count = selectedUserUids.size;
    const total = currentFilteredUsersList.length;

    // Update Counter texts
    const countEl = document.getElementById('selectedUsersCount');
    if (countEl) countEl.textContent = count;

    const totalEl = document.getElementById('totalUsersFilteredCount');
    if (totalEl) totalEl.textContent = total;

    // Toggle Deselect button and action button group
    const deselectBtn = document.getElementById('btnDeselectAll');
    if (deselectBtn) deselectBtn.style.display = count > 0 ? 'inline-flex' : 'none';

    const groupEl = document.getElementById('bulkActionButtonsGroup');
    if (groupEl) groupEl.style.display = count > 0 ? 'flex' : 'none';

    const barEl = document.getElementById('bulkActionsBar');
    if (barEl) {
        if (count > 0) barEl.classList.add('active');
        else barEl.classList.remove('active');
    }

    // Sync header check-all checkbox states
    const headerChk = document.getElementById('selectAllUsersHeader');
    const tableChk = document.getElementById('userTableCheckAll');
    const isAllChecked = total > 0 && count === total;
    const isIndeterminate = count > 0 && count < total;

    [headerChk, tableChk].forEach(chk => {
        if (chk) {
            chk.checked = isAllChecked;
            chk.indeterminate = isIndeterminate;
        }
    });

    // Update row highlights and checkboxes
    document.querySelectorAll('#userTableBody tr[data-uid]').forEach(tr => {
        const uid = tr.getAttribute('data-uid');
        const chk = tr.querySelector('.user-row-chk');
        if (selectedUserUids.has(uid)) {
            tr.classList.add('selected-row');
            if (chk) chk.checked = true;
        } else {
            tr.classList.remove('selected-row');
            if (chk) chk.checked = false;
        }
    });
}

window._adminToggleUserSelection = function(uid, event) {
    if (event) event.stopPropagation();
    if (selectedUserUids.has(uid)) {
        selectedUserUids.delete(uid);
    } else {
        selectedUserUids.add(uid);
    }
    updateSelectionUI();
};

window._adminSelectAllFiltered = function(shouldSelect) {
    if (shouldSelect) {
        currentFilteredUsersList.forEach(u => selectedUserUids.add(u.uid));
    } else {
        selectedUserUids.clear();
    }
    updateSelectionUI();
};

window._adminDeselectAll = function() {
    selectedUserUids.clear();
    updateSelectionUI();
};

function initUserSelectionSystem() {
    // Bind Header Checkboxes
    const headerChk = document.getElementById('selectAllUsersHeader');
    if (headerChk) {
        headerChk.onchange = (e) => window._adminSelectAllFiltered(e.target.checked);
    }

    const tableChk = document.getElementById('userTableCheckAll');
    if (tableChk) {
        tableChk.onchange = (e) => window._adminSelectAllFiltered(e.target.checked);
    }

    // Bind Deselect All
    const deselectBtn = document.getElementById('btnDeselectAll');
    if (deselectBtn) {
        deselectBtn.onclick = () => window._adminDeselectAll();
    }

    // 1. Bulk VIP Upgrade
    const bulkUpgradeBtn = document.getElementById('bulkBtnUpgrade');
    if (bulkUpgradeBtn) {
        bulkUpgradeBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            if (!confirm(`Xác nhận nâng cấp gói 👑 PREMIUM (1 Năm) cho ${count} user đã chọn?`)) return;

            try {
                const batch = db.batch();
                const now = new Date();
                const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
                selectedUserUids.forEach(uid => {
                    const userRef = db.collection('users').doc(uid);
                    batch.set(userRef, {
                        plan: 'premium',
                        role: 'customer',
                        planUpdatedAt: firebase.firestore.Timestamp.fromDate(now),
                        planExpiresAt: firebase.firestore.Timestamp.fromDate(nextYear)
                    }, { merge: true });
                });
                await batch.commit();
                alert(`🎉 Đã nâng cấp Premium (1 Năm) thành công cho ${count} user!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(err) {
                alert('Lỗi nâng cấp hàng loạt: ' + err.message);
            }
        };
    }

    // 2. Bulk Extend Trial
    const bulkTrialBtn = document.getElementById('bulkBtnExtendTrial');
    if (bulkTrialBtn) {
        bulkTrialBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            if (!confirm(`Gia hạn thêm 14 ngày dùng thử (Trial) cho ${count} user đã chọn?`)) return;

            try {
                const batch = db.batch();
                const now = new Date();
                const trialExp = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                selectedUserUids.forEach(uid => {
                    const userRef = db.collection('users').doc(uid);
                    batch.set(userRef, {
                        trialExpiresAt: firebase.firestore.Timestamp.fromDate(trialExp)
                    }, { merge: true });
                });
                await batch.commit();
                alert(`⏳ Đã gia hạn 14 ngày Trial thành công cho ${count} user!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(err) {
                alert('Lỗi gia hạn hàng loạt: ' + err.message);
            }
        };
    }

    // 3. Bulk Gift DP
    const bulkGiftDPBtn = document.getElementById('bulkBtnGiftDP');
    if (bulkGiftDPBtn) {
        bulkGiftDPBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            const val = prompt(`Nhập số điểm Tu Vi DP muốn tặng cho ${count} user đã chọn:`, "100");
            if (!val) return;
            const amount = parseInt(val);
            if (isNaN(amount) || amount <= 0) {
                alert('Vui lòng nhập số DP hợp lệ > 0');
                return;
            }
            try {
                const promises = Array.from(selectedUserUids).map(uid => {
                    return db.collection('user_items').doc(uid).set({
                        bonusDP: firebase.firestore.FieldValue.increment(amount)
                    }, { merge: true });
                });
                await Promise.all(promises);
                alert(`🎁 Đã tặng +${amount} DP thành công cho ${count} user!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(err) {
                alert('Lỗi tặng DP hàng loạt: ' + err.message);
            }
        };
    }

    // 4. Bulk Broadcast Message Modal
    const bulkBroadcastBtn = document.getElementById('bulkBtnBroadcast');
    const broadcastModal = document.getElementById('bulkBroadcastModal');
    const broadcastTargetCount = document.getElementById('broadcastTargetCount');
    const broadcastClose = document.getElementById('bulkBroadcastClose');
    const broadcastCancel = document.getElementById('bulkBroadcastCancel');
    const broadcastSendBtn = document.getElementById('bulkBroadcastSendBtn');

    if (bulkBroadcastBtn && broadcastModal) {
        bulkBroadcastBtn.onclick = () => {
            if (selectedUserUids.size === 0) return;
            if (broadcastTargetCount) broadcastTargetCount.textContent = selectedUserUids.size;
            broadcastModal.style.display = 'flex';
        };

        const closeBroadcastModal = () => { broadcastModal.style.display = 'none'; };
        if (broadcastClose) broadcastClose.onclick = closeBroadcastModal;
        if (broadcastCancel) broadcastCancel.onclick = closeBroadcastModal;
        broadcastModal.onclick = (e) => { if (e.target === broadcastModal) closeBroadcastModal(); };

        if (broadcastSendBtn) {
            broadcastSendBtn.onclick = async () => {
                const input = document.getElementById('broadcastMessageInput');
                const text = (input ? input.value : '').trim();
                if (!text) {
                    alert('Vui lòng nhập nội dung tin nhắn!');
                    return;
                }
                const count = selectedUserUids.size;
                broadcastSendBtn.disabled = true;
                broadcastSendBtn.textContent = 'Đang gửi...';

                try {
                    const now = new Date();
                    const sendPromises = Array.from(selectedUserUids).map(async (targetUid) => {
                        const convId = [currentAdmin.uid, targetUid].sort().join('_');
                        const convRef = db.collection('conversations').doc(convId);
                        const targetUser = allUsers.find(u => u.uid === targetUid) || {};
                        
                        const targetDetails = {
                            displayName: targetUser.displayName || targetUser.email?.split('@')[0] || 'User',
                            photoURL: targetUser.photoURL || '',
                            rankLevel: 1
                        };
                        const adminDetails = {
                            displayName: currentAdmin.displayName || 'Ban Quản Trị',
                            photoURL: currentAdmin.photoURL || '',
                            rankLevel: 99
                        };

                        const batch = db.batch();
                        batch.set(convRef, {
                            participants: [currentAdmin.uid, targetUid],
                            participantDetails: {
                                [currentAdmin.uid]: adminDetails,
                                [targetUid]: targetDetails
                            },
                            lastMessage: text,
                            lastSenderId: currentAdmin.uid,
                            updatedAt: firebase.firestore.Timestamp.fromDate(now),
                            unreadCount: {
                                [targetUid]: firebase.firestore.FieldValue.increment(1),
                                [currentAdmin.uid]: 0
                            }
                        }, { merge: true });

                        const msgRef = convRef.collection('messages').doc();
                        batch.set(msgRef, {
                            senderId: currentAdmin.uid,
                            senderName: currentAdmin.displayName || 'Ban Quản Trị (Admin)',
                            senderPhoto: currentAdmin.photoURL || '',
                            senderRankLevel: 99,
                            isAdminMessage: true,
                            text: text,
                            createdAt: firebase.firestore.Timestamp.fromDate(now),
                            read: false
                        });

                        return batch.commit();
                    });

                    await Promise.all(sendPromises);
                    alert(`💬 Đã gửi tin nhắn đồng loạt thành công đến ${count} user!`);
                    closeBroadcastModal();
                    if (input) input.value = '';
                    selectedUserUids.clear();
                    updateSelectionUI();
                } catch(err) {
                    alert('Lỗi gửi tin nhắn hàng loạt: ' + err.message);
                } finally {
                    broadcastSendBtn.disabled = false;
                    broadcastSendBtn.textContent = '🚀 Gửi hàng loạt';
                }
            };
        }
    }

    // 4b. Bulk Send Email (Resend)
    const bulkEmailBtn = document.getElementById('bulkBtnEmail');
    if (bulkEmailBtn) {
        bulkEmailBtn.onclick = () => {
            if (selectedUserUids.size === 0) {
                alert('Vui lòng tích chọn ít nhất 1 người dùng để gửi email!');
                return;
            }
            switchSection('emails');
            if (typeof window._adminSelectEmailTargetMode === 'function') {
                window._adminSelectEmailTargetMode('selected');
            }
        };
    }

    // 5. Bulk Disable
    const bulkDisableBtn = document.getElementById('bulkBtnDisable');
    if (bulkDisableBtn) {
        bulkDisableBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            if (!confirm(`Xác nhận KHÓA tài khoản của ${count} user đã chọn?`)) return;
            try {
                const batch = db.batch();
                selectedUserUids.forEach(uid => {
                    batch.update(db.collection('users').doc(uid), { disabled: true });
                });
                await batch.commit();
                alert(`🔒 Đã khóa ${count} tài khoản!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(e) { alert('Lỗi: ' + e.message); }
        };
    }

    // 6. Bulk Enable
    const bulkEnableBtn = document.getElementById('bulkBtnEnable');
    if (bulkEnableBtn) {
        bulkEnableBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            if (!confirm(`Xác nhận MỞ KHÓA tài khoản cho ${count} user đã chọn?`)) return;
            try {
                const batch = db.batch();
                selectedUserUids.forEach(uid => {
                    batch.update(db.collection('users').doc(uid), { disabled: false });
                });
                await batch.commit();
                alert(`🔓 Đã mở khóa ${count} tài khoản!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(e) { alert('Lỗi: ' + e.message); }
        };
    }

    // 7. Bulk Export CSV
    const bulkExportBtn = document.getElementById('bulkBtnExport');
    if (bulkExportBtn) {
        bulkExportBtn.onclick = () => {
            if (selectedUserUids.size === 0) return;
            const selectedUsers = allUsers.filter(u => selectedUserUids.has(u.uid));
            const headers = ['UID','Name','Email','Plan','Role','Source','UTM_Source','UTM_Campaign','Referrer','Created','LastLogin','Disabled'];
            const rows = selectedUsers.map(u => [
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
            a.download = `habit-selected-users-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        };
    }

    // 8. Bulk Delete
    const bulkDeleteBtn = document.getElementById('bulkBtnDelete');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.onclick = async () => {
            if (selectedUserUids.size === 0) return;
            const count = selectedUserUids.size;
            const promptVal = prompt(`⚠️ CẢNH BÁO NGUY HIỂM:\nBạn sắp XÓA VĨNH VIỄN ${count} tài khoản đã chọn khỏi hệ thống.\nNhập "XÓA HẾT" để xác nhận:`);
            if (promptVal !== 'XÓA HẾT') {
                alert('Hủy thao tác xóa hàng loạt.');
                return;
            }
            try {
                const promises = Array.from(selectedUserUids).map(uid => {
                    return db.collection('users').doc(uid).delete();
                });
                await Promise.all(promises);
                alert(`🗑️ Đã xóa vĩnh viễn ${count} tài khoản!`);
                selectedUserUids.clear();
                updateSelectionUI();
            } catch(e) { alert('Lỗi xóa hàng loạt: ' + e.message); }
        };
    }
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

        const grantBtn = document.getElementById('modalGrantDP');
        grantBtn.disabled = true;
        grantBtn.textContent = '⏳ Đang xử lý...';

        try {
            const targetUser = allUsers.find(u => u.uid === currentModalUid) || {};
            const displayName = targetUser.displayName || targetUser.email?.split('@')[0] || 'Chiến Binh';
            const photoURL = targetUser.photoURL || '';
            const isAdmin = targetUser.role === 'admin';

            const lbRef = db.collection('leaderboard').doc(currentModalUid);
            const userRef = db.collection('users').doc(currentModalUid);

            // Fetch existing leaderboard data to compute accurate total
            const lbSnap = await lbRef.get();
            const lbData = lbSnap.exists ? lbSnap.data() : {};

            let currentBaseDP = 0;
            if (targetUser.habitData) {
                try {
                    const s = typeof targetUser.habitData === 'string' ? JSON.parse(targetUser.habitData) : targetUser.habitData;
                    if (s && s.c) currentBaseDP = Object.keys(s.c).length * 10;
                } catch(e){}
            }

            const prevBonus = targetUser.bonusDP || lbData.bonusDP || 0;
            const newBonus = prevBonus + amount;
            const prevTotal = (lbData.totalDP !== undefined) ? lbData.totalDP : (currentBaseDP + prevBonus);
            const newTotal = prevTotal + amount;

            const batch = db.batch();

            // Set/merge into leaderboard collection
            batch.set(lbRef, {
                uid: currentModalUid,
                displayName: displayName,
                photoURL: photoURL,
                totalDP: newTotal,
                bonusDP: newBonus,
                streak: targetUser.streak || lbData.streak || 0,
                maxStreak: targetUser.maxStreak || lbData.maxStreak || 0,
                weeklyDP: (lbData.weeklyDP || 0) + amount,
                isAdmin: isAdmin,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            // Set/merge into users collection
            batch.set(userRef, {
                bonusDP: newBonus,
                totalDP: newTotal,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            await batch.commit();

            // Update local memory
            targetUser.bonusDP = newBonus;
            targetUser.totalDP = newTotal;

            // Log the grant
            await db.collection('dp_grants').add({
                uid: currentModalUid,
                amount: amount,
                reason: reason,
                grantedBy: currentAdmin?.uid || 'admin',
                grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert(`✅ Đã tặng thành công +${amount} DP cho user (${displayName})!\nTổng DP mới trên BXH: ${newTotal.toLocaleString()} DP`);
            document.getElementById('modalDPAmount').value = '100';
            document.getElementById('modalDPReason').value = '';
            
            // Reload user list in admin
            await loadUsers();
        } catch(err) {
            console.error('DP grant error:', err);
            alert('Lỗi tặng điểm: ' + err.message);
        } finally {
            grantBtn.disabled = false;
            grantBtn.textContent = '🎁 Tặng DP';
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
window._adminOpenChatFromModal = () => {
    if(!currentModalUid) return;
    const uid = currentModalUid;
    document.getElementById('userModal').style.display = 'none';
    window._adminOpenChat(uid);
};
window._adminOpenEmailFromModal = () => {
    if(!currentModalUid) return;
    const uid = currentModalUid;
    document.getElementById('userModal').style.display = 'none';
    if(typeof window._adminOpenEmailComposer === 'function') {
        window._adminOpenEmailComposer(uid);
    }
};

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

        // Update badges
        const badge = document.getElementById('questBadge');
        const bottomBadge = document.getElementById('bottomQuestBadge');
        [badge, bottomBadge].forEach(b => {
            if (b) {
                if (pendingCount > 0) {
                    b.textContent = pendingCount > 99 ? '99+' : pendingCount;
                    b.style.display = 'inline-flex';
                } else {
                    b.style.display = 'none';
                }
            }
        });
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
let lastKnownAdminUnreadTotal = 0;
let isAdminChatInitialSnapshot = true;

function playAdminMessageSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.09); // B5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    } catch(e) {}
}

function showAdminMessageToast(senderName, messageText, photoURL, userUid) {
    try {
        let container = document.getElementById('adminMsgToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'adminMsgToastContainer';
            container.className = 'admin-msg-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'admin-msg-toast-card';

        const initial = (senderName || 'U').charAt(0).toUpperCase();
        const avatarHtml = photoURL
            ? `<img src="${photoURL}" class="admin-msg-toast-avatar" alt="${escapeHtml(senderName)}" onerror="this.outerHTML='<div class=\\'admin-msg-toast-avatar-fallback\\'>${initial}</div>'">`
            : `<div class="admin-msg-toast-avatar-fallback">${initial}</div>`;

        toast.innerHTML = `
            ${avatarHtml}
            <div class="admin-msg-toast-body">
                <div class="admin-msg-toast-title">
                    <span>${escapeHtml(senderName)}</span>
                    <span class="admin-msg-toast-badge">💬 Tin nhắn mới</span>
                </div>
                <div class="admin-msg-toast-text">${escapeHtml(messageText || 'Đã gửi một tin nhắn...')}</div>
            </div>
        `;

        toast.onclick = () => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
            
            // Switch to Messages section and open chat
            const navItem = document.querySelector('.nav-item[data-section="messages"]');
            if (navItem) navItem.click();
            window._openAdminChatWithUser(userUid);
        };

        container.appendChild(toast);

        // Native notification if browser in background
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.hidden) {
            try {
                new Notification(`Habit Admin - ${senderName}`, {
                    body: messageText || 'User vừa gửi tin nhắn hỗ trợ',
                    icon: photoURL || '/favicon.ico'
                });
            } catch(e) {}
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }
        }, 6000);
    } catch(err) {
        console.warn('Admin Toast display error:', err);
    }
}

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

    // Request notification permission smoothly if supported
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        try {
            document.addEventListener('click', function reqAdminNotif() {
                Notification.requestPermission().catch(() => {});
                document.removeEventListener('click', reqAdminNotif);
            }, { once: true });
        } catch(e) {}
    }

    // Listen for all conversations real-time
    try {
        isAdminChatInitialSnapshot = true;
        if (adminConversationsUnsubscribe) adminConversationsUnsubscribe();
        adminConversationsUnsubscribe = db.collection('conversations')
            .orderBy('updatedAt', 'desc')
            .onSnapshot(snapshot => {
                const newConversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                let totalUnread = 0;
                newConversations.forEach(c => {
                    const unread = (c.unreadCount && c.unreadCount[currentAdmin.uid]) || 0;
                    totalUnread += unread;
                });

                // Audio and Floating Toast Notification for admin
                if (!isAdminChatInitialSnapshot && totalUnread > lastKnownAdminUnreadTotal) {
                    playAdminMessageSound();

                    // Find newest unread conversation
                    const unreadConv = newConversations.find(conv => 
                        (conv.unreadCount && conv.unreadCount[currentAdmin.uid] > 0) &&
                        conv.lastSenderId !== currentAdmin.uid
                    );

                    if (unreadConv) {
                        const userUid = (unreadConv.participants || []).find(p => p !== currentAdmin.uid);
                        const userDetails = (unreadConv.participantDetails && userUid && unreadConv.participantDetails[userUid]) || {};
                        const senderName = userDetails.displayName || 'Khách hàng';
                        const photoURL = userDetails.photoURL || '';
                        const msgPreview = unreadConv.lastMessage || 'Đã gửi một tin nhắn...';

                        // Show floating toast if not actively chatting with this user
                        if (activeAdminTargetUid !== userUid) {
                            showAdminMessageToast(senderName, msgPreview, photoURL, userUid);
                        }
                    }
                }

                isAdminChatInitialSnapshot = false;
                lastKnownAdminUnreadTotal = totalUnread;
                adminConversations = newConversations;

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
    const bottomBadge = document.getElementById('bottomMsgBadge');
    const mobileDot = document.getElementById('mobileUnreadDot');

    [badge, bottomBadge].forEach(b => {
        if (b) {
            if (totalUnread > 0) {
                b.style.display = 'inline-block';
                b.textContent = totalUnread > 99 ? '99+' : totalUnread;
            } else {
                b.style.display = 'none';
            }
        }
    });

    if (mobileDot) {
        mobileDot.style.display = totalUnread > 0 ? 'block' : 'none';
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

window._adminChatBackToList = function() {
    const layout = document.getElementById('adminChatLayout');
    if (layout) layout.classList.remove('in-chat');
};

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

    // Toggle mobile layout view to active chat pane
    const layout = document.getElementById('adminChatLayout');
    if (layout) layout.classList.add('in-chat');

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
                    realmName: targetUser.realmName || 'Vô minh',
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
        const targetUser = allUsers.find(u => u.uid === activeAdminTargetUid) || {};
        const displayName = targetUser.displayName || targetUser.email?.split('@')[0] || 'Chiến Binh';
        const photoURL = targetUser.photoURL || '';
        const isAdmin = targetUser.role === 'admin';

        const lbRef = db.collection('leaderboard').doc(activeAdminTargetUid);
        const userRef = db.collection('users').doc(activeAdminTargetUid);

        const lbSnap = await lbRef.get();
        const lbData = lbSnap.exists ? lbSnap.data() : {};

        let currentBaseDP = 0;
        if (targetUser.habitData) {
            try {
                const s = typeof targetUser.habitData === 'string' ? JSON.parse(targetUser.habitData) : targetUser.habitData;
                if (s && s.c) currentBaseDP = Object.keys(s.c).length * 10;
            } catch(e){}
        }

        const prevBonus = targetUser.bonusDP || lbData.bonusDP || 0;
        const newBonus = prevBonus + amount;
        const prevTotal = (lbData.totalDP !== undefined) ? lbData.totalDP : (currentBaseDP + prevBonus);
        const newTotal = prevTotal + amount;

        const batch = db.batch();

        batch.set(lbRef, {
            uid: activeAdminTargetUid,
            displayName: displayName,
            photoURL: photoURL,
            totalDP: newTotal,
            bonusDP: newBonus,
            streak: targetUser.streak || lbData.streak || 0,
            maxStreak: targetUser.maxStreak || lbData.maxStreak || 0,
            weeklyDP: (lbData.weeklyDP || 0) + amount,
            isAdmin: isAdmin,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        batch.set(userRef, {
            bonusDP: newBonus,
            totalDP: newTotal,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        await batch.commit();

        targetUser.bonusDP = newBonus;
        targetUser.totalDP = newTotal;

        await db.collection('dp_grants').add({
            uid: activeAdminTargetUid,
            amount: amount,
            reason: 'Tặng từ Hộp Thư Chat Admin',
            grantedBy: currentAdmin?.uid || 'admin',
            grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        window._adminSendPresetMessage(`🎁 Admin vừa gửi tặng bạn +${amount} Điểm Kỷ Luật DP khích lệ tinh thần rèn luyện! (Tổng tích lũy: ${newTotal.toLocaleString()} DP)`);
        await loadUsers();
        if (activeAdminConvId && activeAdminTargetUid) {
            window._adminSelectConversationById(activeAdminConvId, activeAdminTargetUid);
        }
    } catch (e) { 
        console.error('Chat quick DP error:', e);
        alert('Lỗi tặng điểm: ' + e.message); 
    }
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

// ===== ZALO QUEST SECRET CODE MANAGEMENT =====
async function loadZaloSecretCode() {
    const input = document.getElementById('adminZaloSecretCode');
    const status = document.getElementById('zaloSecretCodeStatus');
    if (!input || !db) return;
    try {
        const doc = await db.collection('system_config').doc('zalo_quest').get();
        if (doc.exists && doc.data() && doc.data().secretCode) {
            input.value = doc.data().secretCode;
        } else {
            input.value = 'HABIT2026';
        }
    } catch(e) {
        console.warn('Load Zalo secret code error:', e);
        input.value = 'HABIT2026';
    }
}
window._loadZaloSecretCode = loadZaloSecretCode;

window._saveZaloSecretCode = async function() {
    const input = document.getElementById('adminZaloSecretCode');
    const status = document.getElementById('zaloSecretCodeStatus');
    const btn = document.getElementById('btnSaveZaloSecretCode');
    if (!input || !db) return;
    const newCode = input.value.trim().toUpperCase();
    if (!newCode) {
        alert('Vui lòng nhập mã bí mật Zalo!');
        return;
    }
    try {
        if (btn) btn.disabled = true;
        await db.collection('system_config').doc('zalo_quest').set({
            secretCode: newCode,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentAdmin?.email || currentAdmin?.uid || 'admin'
        }, { merge: true });
        if (status) {
            status.style.color = '#10b981';
            status.innerHTML = `✓ Đã lưu mã bí mật mới: <strong>${newCode}</strong>. Thành viên nhập mã này sẽ nhận 1.000 DP!`;
            setTimeout(() => { if (status) status.innerHTML = ''; }, 6000);
        }
    } catch(e) {
        alert('Lỗi lưu mã Zalo: ' + e.message);
    } finally {
        if (btn) btn.disabled = false;
    }
};

// ============================================================
// ===== RESEND EMAIL MANAGEMENT SYSTEM =====
// ============================================================
function initEmailManagement() {
    // --- State ---
    let resendConfig = {
        apiKey: '',
        fromName: 'Habit Mastery',
        fromEmail: 'onboarding@resend.dev',
        replyTo: 'htmt.slh@gmail.com'
    };
    const EMAIL_API_BASE = (window.location.hostname.includes('vercel.app'))
        ? '/api'
        : 'https://habbit-opal.vercel.app/api';
    let currentTargetMode = 'all'; // 'all' | 'filter' | 'custom' | 'selected'
    let emailLogsUnsubscribe = null;
    let cachedEmailLogs = [];

    // --- Templates Catalog ---
    /* [v5.10.10] Khoá của object này PHẢI khớp đúng thuộc tính data-template
       trên các nút .template-chip trong admin.html (7 nút: vip, trial_ending,
       streak_restore, gift_dp, update, announcement, custom) -- trước đây bộ
       khoá ở đây (welcome/vipGift/feature/weekly/custom) hoàn toàn không khớp
       với HTML nên applyTemplate() không bao giờ tìm thấy nút để gắn onclick,
       khiến các mẫu email "có tồn tại" nhưng bấm vào không có phản ứng gì. */
    const EMAIL_TEMPLATES = {
        vip: {
            subject: '👑 Quà Tặng Đặc Quyền: Kích Hoạt VIP Premium Miễn Phí Cho Bạn!',
            preheader: 'Ban quản trị Habit Mastery xin gửi tặng bạn đặc quyền VIP Premium hoàn toàn miễn phí!',
            content: `Chào <strong>{name}</strong>,\n\nBan quản trị Habit Mastery xin gửi lời tri ân sâu sắc vì sự đồng hành kiên trì của bạn trong thời gian qua!\n\nĐể tiếp thêm động lực cho chặng đường rèn luyện sắp tới, chúng tôi xin dành tặng bạn <strong>Đặc Quyền VIP Premium</strong> hoàn toàn miễn phí.\n\n<div class="gold-box">👑 <strong>Đặc quyền mở khóa của bạn bao gồm:</strong>\n<ul>\n  <li>Không giới hạn số lượng thói quen theo dõi.</li>\n  <li>Mở khóa hệ thống Báo Cáo Phân Tích Chuyên Sâu & Ma Trận Eisenhower.</li>\n  <li>Nhân đôi Điểm Tu Vi (DP) khi hoàn thành thói quen.</li>\n  <li>Danh hiệu VIP Vàng hiển thị nổi bật trên Bảng Xếp Hạng.</li>\n</ul></div>\n\nHãy đăng nhập ngay hôm nay để tận hưởng trọn vẹn đặc quyền của bạn nhé!`,
            ctaText: 'Nhận Đặc Quyền VIP Ngay 👑',
            ctaUrl: 'https://habitmastery.web.app'
        },
        trial_ending: {
            subject: '⏳ Gói Dùng Thử của bạn sắp kết thúc — đừng bỏ lỡ đặc quyền Premium!',
            preheader: 'Chỉ còn ít ngày trải nghiệm Premium miễn phí, nâng cấp ngay để không bị gián đoạn.',
            content: `Chào <strong>{name}</strong>,\n\nGói <strong>Dùng Thử Premium</strong> của bạn sắp hết hạn! Đây là lúc để quyết định giữ lại toàn bộ đặc quyền đã giúp bạn duy trì kỷ luật suốt thời gian qua.\n\n<div class="highlight-box">⏳ <strong>Nếu không nâng cấp</strong>, tài khoản của bạn sẽ tự động chuyển về gói Free và mất quyền truy cập các tính năng Premium (Báo Cáo Chuyên Sâu, Ma Trận Eisenhower, nhân đôi Tu Vi...).</div>\n\nNâng cấp ngay hôm nay để tiếp tục hành trình rèn luyện không gián đoạn!`,
            ctaText: 'Nâng Cấp Premium Ngay ⏳',
            ctaUrl: 'https://habitmastery.web.app'
        },
        streak_restore: {
            subject: '❄️ Chuỗi Streak của bạn đang gặp nguy hiểm — quay lại ngay!',
            preheader: 'Chuỗi ngày kỷ luật bạn dày công xây dựng sắp bị đứt gãy, đừng để công sức đổ sông đổ bể.',
            content: `Chào <strong>{name}</strong>,\n\nChúng tôi nhận thấy bạn đã vắng bóng vài ngày qua, và <strong>chuỗi Streak {streak} ngày</strong> bạn dày công xây dựng đang có nguy cơ bị đứt gãy!\n\n<div class="highlight-box">❄️ <strong>Đừng để công sức đổ sông đổ bể!</strong> Chỉ cần quay lại hoàn thành 1 thói quen bất kỳ hôm nay là đủ để cứu vãn chuỗi ngày kỷ luật của bạn.</div>\n\nMọi hành trình vĩ đại đều bắt đầu từ một bước chân nhỏ — hãy quay lại ngay hôm nay nhé!`,
            ctaText: 'Cứu Chuỗi Streak Ngay ❄️',
            ctaUrl: 'https://habitmastery.web.app'
        },
        gift_dp: {
            subject: '🎁 Bạn vừa nhận được một món quà Tu Vi (DP) đặc biệt!',
            preheader: 'Ban quản trị vừa gửi tặng bạn một lượng Tu Vi (DP) đặc biệt, đăng nhập để nhận ngay.',
            content: `Chào <strong>{name}</strong>,\n\nĐể tri ân sự đồng hành của bạn, Ban quản trị Habit Mastery xin gửi tặng bạn một món quà nhỏ!\n\n<div class="gold-box">🎁 <strong>Phần quà của bạn:</strong> Một lượng <strong>Điểm Tu Vi (DP)</strong> đặc biệt đã được cộng thẳng vào tài khoản. Số dư hiện tại của bạn là <strong>{dp} Tu Vi</strong>.</div>\n\nHãy đăng nhập để kiểm tra và tiếp tục dùng số Tu Vi này để thăng cấp Cảnh Giới của mình nhé!`,
            ctaText: 'Kiểm Tra Quà Tặng Ngay 🎁',
            ctaUrl: 'https://habitmastery.web.app'
        },
        update: {
            subject: '⚡ Cập Nhật Mới: Khám phá các tính năng đột phá vừa ra mắt!',
            preheader: 'Nhiều nâng cấp giá trị vừa ra mắt để nâng tầm trải nghiệm rèn luyện của bạn.',
            content: `Chào <strong>{name}</strong>,\n\nĐội ngũ phát triển Habit Mastery vừa hoàn thành bản cập nhật mới với nhiều nâng cấp cực kỳ giá trị để nâng tầm trải nghiệm của bạn:\n\n<ul>\n  <li><strong>Ma Trận Thời Gian Eisenhower:</strong> Giúp bạn phân loại nhiệm vụ khẩn cấp & quan trọng chuẩn khoa học.</li>\n  <li><strong>Đồng bộ thời gian thực siêu tốc:</strong> Dữ liệu thói quen luôn được bảo toàn an toàn trên mọi thiết bị.</li>\n  <li><strong>Hộp thư hỗ trợ trực tuyến:</strong> Kết nối trực tiếp với ban quản trị để giải đáp mọi thắc mắc trong tích tắc.</li>\n</ul>\n\n<div class="highlight-box">Trải nghiệm ngay bản cập nhật mới nhất và chia sẻ cảm nhận cho chúng mình biết nhé!</div>`,
            ctaText: 'Khám Phá Tính Năng Mới ⚡',
            ctaUrl: 'https://habitmastery.web.app'
        },
        announcement: {
            subject: '📢 Thông báo từ Ban Quản Trị Habit Mastery',
            preheader: 'Một thông báo quan trọng từ Ban Quản Trị Habit Mastery.',
            content: `Chào <strong>{name}</strong>,\n\nBan Quản Trị Habit Mastery xin gửi đến bạn một thông báo quan trọng:\n\n<div class="highlight-box">📢 <strong>Nội dung thông báo:</strong> Nhập nội dung chi tiết cần thông báo tới người dùng tại đây...</div>\n\nCảm ơn bạn đã luôn đồng hành cùng chúng tôi trên hành trình rèn luyện kỷ luật bản thân!`,
            ctaText: 'Vào Ứng Dụng Ngay →',
            ctaUrl: 'https://habitmastery.web.app'
        },
        custom: {
            subject: '',
            preheader: '',
            content: `Chào <strong>{name}</strong>,\n\nNhập nội dung thông điệp của bạn tại đây...`,
            ctaText: 'Truy Cập Ứng Dụng',
            ctaUrl: 'https://habitmastery.web.app'
        }
    };

    // --- DOM Elements Cache ---
    // [v5.10.11] HTML tách 1 khối "resendStatusIndicator" cũ thành 2 phần tử
    // riêng: pill bao ngoài (resendStatusPill) và đoạn chữ trạng thái
    // (resendStatusText) -- id cũ không tồn tại nên banner luôn kẹt ở
    // "Đang kiểm tra kết nối..." tĩnh.
    const resendStatusPill = document.getElementById('resendStatusPill');
    const resendStatusText = document.getElementById('resendStatusText');
    const resendSenderDisplay = document.getElementById('resendSenderDisplay');
    const btnQuickTestEmail = document.getElementById('btnQuickTestEmail');
    const btnOpenResendConfigModal = document.getElementById('btnOpenResendConfigModal');
    const btnOpenResendConfigModal2 = document.getElementById('btnOpenResendConfigModal2');

    // Config Modal
    const resendConfigModal = document.getElementById('resendConfigModal');
    const resendConfigClose = document.getElementById('resendConfigClose');
    const resendConfigCancel = document.getElementById('resendConfigCancel');
    const cfgResendApiKey = document.getElementById('cfgResendApiKey');
    const btnToggleApiKeyVisibility = document.getElementById('btnToggleApiKeyVisibility');
    const cfgResendFromName = document.getElementById('cfgResendFromName');
    const cfgResendFromEmail = document.getElementById('cfgResendFromEmail');
    const cfgResendReplyTo = document.getElementById('cfgResendReplyTo');
    const cfgTestEmailAddress = document.getElementById('cfgTestEmailAddress');
    const btnTestResendModal = document.getElementById('btnTestResendModal');
    const cfgTestResultBox = document.getElementById('cfgTestResultBox');
    const btnSaveResendConfig = document.getElementById('btnSaveResendConfig');

    // Composer Targeting
    // [v5.10.11] admin.html dùng mô hình 3 chế độ (single/segment/selected)
    // qua các nút .target-tab[data-mode] -- bộ ID cũ (tabTargetAll/Filter/
    // Custom/Selected, targetAllPanel/FilterPanel/CustomPanel/SelectedPanel,
    // targetFilterPlan/Status, targetCustomEmails, composerRecipientCount,
    // btnViewTargetList, selectedUsersSummaryCount) không còn tồn tại trong
    // HTML, khiến toàn bộ khối "Đối tượng người nhận" không bấm được gì.
    const targetPanelSingle = document.getElementById('targetPanelSingle');
    const targetPanelSegment = document.getElementById('targetPanelSegment');
    const targetPanelSelected = document.getElementById('targetPanelSelected');

    const emailUserDropdown = document.getElementById('emailUserDropdown');
    const emailDirectInput = document.getElementById('emailDirectInput');
    const emailSegmentSelect = document.getElementById('emailSegmentSelect');

    const targetCountBadge = document.getElementById('targetCountBadge');
    const selectedUsersCountLabel = document.getElementById('selectedUsersCountLabel');
    const selectedUsersSummaryBox = document.getElementById('selectedUsersSummaryBox');

    // Composer Fields
    const emailSubject = document.getElementById('emailSubject');
    // [v5.10.10] ID thật trong admin.html là "emailContentTextarea", không phải
    // "emailContent" -- sai ID này khiến toàn bộ composer (mẫu email, chèn
    // biến, toolbar định dạng, xem trước, gửi thật) đọc/ghi vào `null`.
    const emailContent = document.getElementById('emailContentTextarea');
    const emailPreheader = document.getElementById('emailPreheader');
    const emailCtaText = document.getElementById('emailCtaText');
    const emailCtaUrl = document.getElementById('emailCtaUrl');
    const btnResetEmailForm = document.getElementById('btnResetEmailForm');
    // [v5.10.11] Nút gửi thật có id "btnSendCampaignEmail" trong HTML, không
    // phải "btnSubmitSendEmail" -- sai id nay khien nut Gui Email Ngay khong
    // co phan ung khi bam.
    const btnSubmitSendEmail = document.getElementById('btnSendCampaignEmail');
    const btnSendTestEmail = document.getElementById('btnSendTestEmail');
    const emailSendStatusBox = document.getElementById('emailSendStatusBox');

    // Preview Elements
    // [v5.10.11] Khung xem trước thật dùng bộ id khác hẳn (không còn
    // btnPreviewDesktop/Mobile -- tính năng đó đã bị bỏ khỏi giao diện mới).
    const emailClientMockup = document.getElementById('emailClientMockup');
    const previewSubjectTitle = document.getElementById('prevTemplateTitle');
    const previewSubjectMeta = document.getElementById('prevSubjectVal');
    const previewFromMeta = document.getElementById('prevFromVal');
    const previewToMeta = document.getElementById('prevToVal');
    const previewGreetingName = document.getElementById('prevGreetingName');
    const previewContent = document.getElementById('prevRenderedContent');
    const previewCtaBtn = document.getElementById('prevCtaBtn');

    // Logs Table & Modal
    const emailLogsTableBody = document.getElementById('emailLogsTableBody');
    const emailLogDetailModal = document.getElementById('emailLogDetailModal');
    const emailLogDetailClose = document.getElementById('emailLogDetailClose');
    const emailLogDetailDismiss = document.getElementById('emailLogDetailDismiss');
    const emailLogDetailContent = document.getElementById('emailLogDetailContent');

    // ============================================================
    // 1. CẤU HÌNH RESEND (LOAD / SAVE / TEST)
    // ============================================================
    async function loadResendConfig() {
        try {
            const doc = await db.collection('system_config').doc('resend_email').get();
            if (doc.exists) {
                const data = doc.data() || {};
                resendConfig.apiKey = data.apiKey || '';
                resendConfig.fromName = data.fromName || 'Habit Mastery';
                resendConfig.fromEmail = data.fromEmail || 'onboarding@resend.dev';
                resendConfig.replyTo = data.replyTo || 'htmt.slh@gmail.com';
            }
        } catch (e) {
            console.warn('Load resend config warning:', e);
        }
        updateStatusBanner();
        updateLivePreview();
    }

    function updateStatusBanner() {
        if (!resendStatusPill || !resendStatusText || !resendSenderDisplay) return;
        const hasKey = Boolean(resendConfig.apiKey && resendConfig.apiKey.trim().length > 5);

        if (hasKey) {
            resendStatusPill.className = 'resend-indicator';
            resendStatusText.textContent = 'Đang Hoạt Động (Resend Ready)';
            resendSenderDisplay.innerHTML = `<strong>${escHtml(resendConfig.fromName)}</strong> &lt;${escHtml(resendConfig.fromEmail)}&gt;`;
        } else {
            resendStatusPill.className = 'resend-indicator inactive';
            resendStatusText.textContent = 'Chưa Cấu Hình API Key';
            resendSenderDisplay.innerHTML = '<span style="color:var(--accent-red-bright);">CẢNH BÁO:</span> Bấm "Cấu Hình API Key" để kích hoạt gửi email';
        }
    }

    function openConfigModal() {
        if (!resendConfigModal) return;
        if (cfgResendApiKey) cfgResendApiKey.value = resendConfig.apiKey || '';
        if (cfgResendFromName) cfgResendFromName.value = resendConfig.fromName || 'Habit Mastery';
        if (cfgResendFromEmail) cfgResendFromEmail.value = resendConfig.fromEmail || 'onboarding@resend.dev';
        if (cfgResendReplyTo) cfgResendReplyTo.value = resendConfig.replyTo || 'htmt.slh@gmail.com';
        if (cfgTestEmailAddress) cfgTestEmailAddress.value = currentAdmin?.email || '';
        if (cfgTestResultBox) {
            cfgTestResultBox.style.display = 'none';
            cfgTestResultBox.innerHTML = '';
        }
        resendConfigModal.style.display = 'flex';
    }

    function closeConfigModal() {
        if (resendConfigModal) resendConfigModal.style.display = 'none';
    }

    if (btnOpenResendConfigModal) btnOpenResendConfigModal.onclick = openConfigModal;
    if (btnOpenResendConfigModal2) btnOpenResendConfigModal2.onclick = openConfigModal;
    if (resendConfigClose) resendConfigClose.onclick = closeConfigModal;
    if (resendConfigCancel) resendConfigCancel.onclick = closeConfigModal;
    if (resendConfigModal) {
        resendConfigModal.onclick = (e) => { if (e.target === resendConfigModal) closeConfigModal(); };
    }

    if (btnToggleApiKeyVisibility && cfgResendApiKey) {
        btnToggleApiKeyVisibility.onclick = () => {
            const isPassword = cfgResendApiKey.type === 'password';
            cfgResendApiKey.type = isPassword ? 'text' : 'password';
            btnToggleApiKeyVisibility.textContent = isPassword ? '🔒' : '👁️';
        };
    }

    if (btnSaveResendConfig) {
        btnSaveResendConfig.onclick = async () => {
            const apiKey = (cfgResendApiKey ? cfgResendApiKey.value : '').trim();
            const fromName = (cfgResendFromName ? cfgResendFromName.value : '').trim() || 'Habit Mastery';
            const fromEmail = (cfgResendFromEmail ? cfgResendFromEmail.value : '').trim() || 'onboarding@resend.dev';
            const replyTo = (cfgResendReplyTo ? cfgResendReplyTo.value : '').trim() || 'htmt.slh@gmail.com';

            if (!apiKey) {
                alert('Vui lòng nhập Resend API Key (dạng re_xxxx)!');
                if (cfgResendApiKey) cfgResendApiKey.focus();
                return;
            }

            btnSaveResendConfig.disabled = true;
            btnSaveResendConfig.textContent = 'Đang lưu...';

            try {
                await db.collection('system_config').doc('resend_email').set({
                    apiKey,
                    fromName,
                    fromEmail,
                    replyTo,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedBy: currentAdmin?.email || currentAdmin?.uid || 'admin'
                }, { merge: true });

                resendConfig = { apiKey, fromName, fromEmail, replyTo };
                updateStatusBanner();
                updateLivePreview();
                closeConfigModal();
                alert('✓ Đã lưu cấu hình Resend Email thành công!');
            } catch (err) {
                alert('Lỗi lưu cấu hình: ' + err.message);
            } finally {
                btnSaveResendConfig.disabled = false;
                btnSaveResendConfig.textContent = '💾 Lưu Cấu Hình';
            }
        };
    }

    if (btnTestResendModal) {
        btnTestResendModal.onclick = async () => {
            const apiKey = (cfgResendApiKey ? cfgResendApiKey.value : '').trim();
            const fromName = (cfgResendFromName ? cfgResendFromName.value : '').trim() || 'Habit Mastery';
            const fromEmail = (cfgResendFromEmail ? cfgResendFromEmail.value : '').trim() || 'onboarding@resend.dev';
            const replyTo = (cfgResendReplyTo ? cfgResendReplyTo.value : '').trim() || 'htmt.slh@gmail.com';
            const targetEmail = (cfgTestEmailAddress ? cfgTestEmailAddress.value : '').trim() || currentAdmin?.email;

            if (!apiKey) {
                alert('Vui lòng nhập Resend API Key trước khi thử!');
                return;
            }
            if (!targetEmail || !targetEmail.includes('@')) {
                alert('Vui lòng nhập một địa chỉ email nhận thử hợp lệ!');
                return;
            }

            btnTestResendModal.disabled = true;
            btnTestResendModal.textContent = 'Đang gửi...';
            if (cfgTestResultBox) {
                cfgTestResultBox.style.display = 'block';
                cfgTestResultBox.style.color = '#94a3b8';
                cfgTestResultBox.innerHTML = `⏳ Đang gửi email kiểm tra tới <strong>${escHtml(targetEmail)}</strong> qua Resend...`;
            }

            try {
                const idToken = await auth.currentUser.getIdToken(true);
                const resp = await fetch(`${EMAIL_API_BASE}/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        targetMode: 'custom',
                        subject: '🧪 Kiểm Tra Kết Nối Resend - Habit Mastery',
                        content: 'Xin chào Admin,\n\nĐây là email kiểm tra kết nối dịch vụ Resend tự động từ bảng điều khiển quản trị Habit Mastery.\n\nNếu bạn nhận được email này, cấu hình API Key và Sender của bạn đã hoàn toàn hợp lệ và sẵn sàng gửi chiến dịch!',
                        ctaText: 'Đăng Nhập Quản Trị',
                        ctaUrl: 'https://habit-tracker-six-delta.vercel.app/admin.html',
                        recipients: [{
                            email: targetEmail,
                            name: currentAdmin?.displayName || 'Admin',
                            plan: 'premium',
                            dp: 9999
                        }],
                        sendOptions: { apiKey, fromName, fromEmail, replyTo }
                    })
                });

                const data = await resp.json();
                if (!resp.ok || !data.success) {
                    throw new Error(data.message || data.error || 'Gửi thất bại');
                }

                if (cfgTestResultBox) {
                    cfgTestResultBox.style.color = '#10b981';
                    cfgTestResultBox.innerHTML = `✓ Kết nối thành công! Đã gửi email thử nghiệm tới <strong>${escHtml(targetEmail)}</strong>. Vui lòng kiểm tra Hộp thư đến (hoặc thư rác Spam).`;
                }
            } catch (err) {
                if (cfgTestResultBox) {
                    cfgTestResultBox.style.color = '#f43f5e';
                    cfgTestResultBox.innerHTML = `✕ Thất bại: ${escHtml(err.message)}<br><small style="color:#cbd5e1;">Lưu ý: Nếu dùng domain mặc định <code>onboarding@resend.dev</code>, Resend chỉ cho phép gửi tới email mà bạn đã dùng để đăng ký tài khoản Resend.</small>`;
                }
            } finally {
                btnTestResendModal.disabled = false;
                btnTestResendModal.textContent = '⚡ Gửi thử';
            }
        };
    }

    // ============================================================
    // 2. RECIPIENT RESOLUTION & TARGETING TABS
    // ============================================================
    // [v5.10.11] HTML dùng 3 chế độ single/segment/selected (không phải
    // all/filter/custom/selected như trước) -- viết lại toàn bộ cho khớp.
    function toRecipient(u) {
        return {
            uid: u.uid,
            email: u.email.trim(),
            name: u.displayName || u.name || u.email.split('@')[0],
            plan: getEffectivePlan(u),
            dp: u.tuviPoints || u.dp || 0
        };
    }

    function populateSingleUserDropdown() {
        if (!emailUserDropdown || !Array.isArray(allUsers)) return;
        const currentVal = emailUserDropdown.value;
        const options = allUsers
            .filter(u => u && u.email && u.email.includes('@'))
            .slice()
            .sort((a, b) => (a.displayName || a.email).localeCompare(b.displayName || b.email))
            .map(u => `<option value="${u.uid}">${escHtml(u.displayName || u.name || u.email)} — ${escHtml(u.email)}</option>`)
            .join('');
        emailUserDropdown.innerHTML = '<option value="">-- Chọn thành viên từ danh sách --</option>' + options;
        if (currentVal) emailUserDropdown.value = currentVal;
    }

    function getResolvedRecipients() {
        if (!Array.isArray(allUsers)) return [];

        const validUsersWithEmail = allUsers.filter(u => u && u.email && u.email.includes('@'));

        if (currentTargetMode === 'single') {
            const directEmail = (emailDirectInput ? emailDirectInput.value : '').trim();
            if (directEmail && directEmail.includes('@')) {
                const match = validUsersWithEmail.find(u => (u.email || '').toLowerCase() === directEmail.toLowerCase());
                if (match) return [toRecipient(match)];
                return [{ uid: null, email: directEmail, name: directEmail.split('@')[0], plan: 'free', dp: 0 }];
            }
            const selectedUid = emailUserDropdown ? emailUserDropdown.value : '';
            if (!selectedUid) return [];
            const match = validUsersWithEmail.find(u => u.uid === selectedUid);
            return match ? [toRecipient(match)] : [];
        }

        if (currentTargetMode === 'segment') {
            const segVal = emailSegmentSelect ? emailSegmentSelect.value : 'all';
            return validUsersWithEmail.filter(u => {
                if (u.disabled) return false;
                switch (segVal) {
                    case 'premium': return ['premium', 'pro'].includes(getEffectivePlan(u));
                    case 'trial': return getEffectivePlan(u) === 'trial';
                    case 'trial_expired': return isTrialExpired(u);
                    case 'free': return getEffectivePlan(u) === 'free';
                    case 'active_30d': return isActive30d(u);
                    case 'all':
                    default: return true;
                }
            }).map(toRecipient);
        }

        if (currentTargetMode === 'selected') {
            if (!selectedUserUids || selectedUserUids.size === 0) return [];
            const list = [];
            selectedUserUids.forEach(uid => {
                const match = validUsersWithEmail.find(u => u.uid === uid);
                if (match) list.push(toRecipient(match));
            });
            return list;
        }

        return [];
    }

    function setTargetMode(mode) {
        currentTargetMode = mode;

        document.querySelectorAll('.target-tab[data-mode]').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-mode') === mode);
        });
        if (targetPanelSingle) targetPanelSingle.style.display = mode === 'single' ? 'block' : 'none';
        if (targetPanelSegment) targetPanelSegment.style.display = mode === 'segment' ? 'block' : 'none';
        if (targetPanelSelected) targetPanelSelected.style.display = mode === 'selected' ? 'block' : 'none';

        if (mode === 'single') populateSingleUserDropdown();

        updateRecipientCountDisplay();
        updateLivePreview();
    }

    function updateRecipientCountDisplay() {
        const recipients = getResolvedRecipients();
        const count = recipients.length;
        if (targetCountBadge) {
            targetCountBadge.textContent = `Sẽ gửi đến: ${count.toLocaleString('vi-VN')} người nhận`;
        }
        if (selectedUsersCountLabel) {
            selectedUsersCountLabel.textContent = (selectedUserUids ? selectedUserUids.size : 0).toString();
        }
        if (selectedUsersSummaryBox) {
            const n = selectedUserUids ? selectedUserUids.size : 0;
            selectedUsersSummaryBox.innerHTML = n > 0
                ? `<span>✅ Đã chọn <strong>${n}</strong> user từ bảng quản lý. Chuyển sang tab <strong>Users</strong> để thay đổi lựa chọn.</span>`
                : `<span>Chưa có user nào được chọn từ bảng quản lý. Hãy sang tab <strong>Users</strong> và tích chọn vào ô checkbox.</span>`;
        }
    }

    document.querySelectorAll('.target-tab[data-mode]').forEach(tab => {
        tab.onclick = () => setTargetMode(tab.getAttribute('data-mode'));
    });

    if (emailUserDropdown) emailUserDropdown.onchange = () => { updateRecipientCountDisplay(); updateLivePreview(); };
    if (emailDirectInput) emailDirectInput.oninput = () => { updateRecipientCountDisplay(); updateLivePreview(); };
    if (emailSegmentSelect) emailSegmentSelect.onchange = () => { updateRecipientCountDisplay(); updateLivePreview(); };

    // ============================================================
    // 3. TEMPLATES CHIPS & EDITOR TOOLBAR
    // ============================================================
    function applyTemplate(key) {
        const tpl = EMAIL_TEMPLATES[key];
        if (!tpl) return;

        document.querySelectorAll('.template-chip').forEach(c => c.classList.remove('active'));
        const chip = document.querySelector(`.template-chip[data-template="${key}"]`);
        if (chip) chip.classList.add('active');

        if (emailSubject) emailSubject.value = tpl.subject;
        if (emailPreheader) emailPreheader.value = tpl.preheader || '';
        if (emailContent) emailContent.value = tpl.content;
        if (emailCtaText) emailCtaText.value = tpl.ctaText;
        if (emailCtaUrl) emailCtaUrl.value = tpl.ctaUrl;

        updateLivePreview();
    }

    document.querySelectorAll('.template-chip[data-template]').forEach(el => {
        const key = el.getAttribute('data-template');
        el.onclick = () => applyTemplate(key);
    });

    // Merge Tags Insertion
    document.querySelectorAll('.tag-chip[data-tag]').forEach(chip => {
        chip.onclick = () => {
            const tag = chip.getAttribute('data-tag');
            if (!emailContent || !tag) return;

            const start = emailContent.selectionStart || 0;
            const end = emailContent.selectionEnd || 0;
            const val = emailContent.value;
            emailContent.value = val.substring(0, start) + tag + val.substring(end);
            emailContent.selectionStart = emailContent.selectionEnd = start + tag.length;
            emailContent.focus();
            updateLivePreview();
        };
    });

    // Editor Toolbar Formatting
    // [v5.10.10] HTML dùng thuộc tính "data-action" (bold/italic/h2/h3/highlight/
    // gold/list) chứ không phải "data-format" -- selector cũ không khớp nút nào
    // nên toàn bộ toolbar định dạng trước đây không có phản ứng khi bấm.
    document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
        btn.onclick = () => {
            const format = btn.getAttribute('data-action');
            if (!emailContent) return;

            const start = emailContent.selectionStart || 0;
            const end = emailContent.selectionEnd || 0;
            const selectedText = emailContent.value.substring(start, end);
            let replacement = '';

            switch (format) {
                case 'bold':
                    replacement = `<strong>${selectedText || 'Văn bản in đậm'}</strong>`;
                    break;
                case 'italic':
                    replacement = `<em>${selectedText || 'Văn bản in nghiêng'}</em>`;
                    break;
                case 'h2':
                    replacement = `<h2>${selectedText || 'Tiêu đề đề mục'}</h2>`;
                    break;
                case 'h3':
                    replacement = `<h3>${selectedText || 'Tiêu đề phụ'}</h3>`;
                    break;
                case 'list':
                    replacement = `<ul>\n  <li>${selectedText || 'Nội dung mục 1'}</li>\n  <li>Nội dung mục 2</li>\n</ul>`;
                    break;
                case 'highlight':
                    replacement = `<div class="highlight-box">💡 <strong>Lưu ý:</strong> ${selectedText || 'Nội dung thông báo nổi bật...'}</div>`;
                    break;
                case 'gold':
                    replacement = `<div class="gold-box">👑 <strong>Đặc quyền:</strong> ${selectedText || 'Nội dung thông báo VIP...'}</div>`;
                    break;
                default:
                    return;
            }

            const val = emailContent.value;
            emailContent.value = val.substring(0, start) + replacement + val.substring(end);
            emailContent.selectionStart = emailContent.selectionEnd = start + replacement.length;
            emailContent.focus();
            updateLivePreview();
        };
    });

    // Form Reset
    if (btnResetEmailForm) {
        btnResetEmailForm.onclick = () => {
            if (confirm('Bạn có chắc chắn muốn làm mới và xóa nội dung soạn thảo hiện tại?')) {
                applyTemplate('custom');
                if (emailSendStatusBox) emailSendStatusBox.style.display = 'none';
            }
        };
    }

    // ============================================================
    // 4. LIVE EMAIL CLIENT PREVIEW MOCKUP
    // ============================================================
    function formatContentForEmail(content) {
        if (!content) return '';
        // If content already contains HTML block tags, don't over-process
        if (/<(p|div|ul|ol|table|h1|h2|h3|h4)/i.test(content)) {
            return content.replace(/\n\n/g, '<br><br>');
        }
        return content.split('\n\n').map(p => `<p style="margin:0 0 14px;line-height:1.68;">${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    function updateLivePreview() {
        const recipients = getResolvedRecipients();
        const sample = recipients[0] || {
            name: currentAdmin?.displayName || 'Nguyễn Văn A',
            email: currentAdmin?.email || 'nguyenvana@gmail.com',
            plan: 'VIP Premium',
            dp: '1.500'
        };

        const planLabel = sample.plan === 'premium' ? 'VIP Premium' : (sample.plan === 'trial' ? 'Dùng thử' : 'Thành viên Free');
        const dpDisplay = Number(sample.dp || 0).toLocaleString('vi-VN');

        const replaceVars = (str) => {
            if (!str) return '';
            return str
                .replace(/{name}/g, sample.name || 'Bạn')
                .replace(/{email}/g, sample.email || '')
                .replace(/{plan}/g, planLabel)
                .replace(/{dp}/g, dpDisplay);
        };

        const rawSubject = (emailSubject ? emailSubject.value : '').trim();
        const rawContent = (emailContent ? emailContent.value : '').trim();
        const rawCtaText = (emailCtaText ? emailCtaText.value : '').trim();
        const rawCtaUrl = (emailCtaUrl ? emailCtaUrl.value : '').trim();

        const renderedSubject = replaceVars(rawSubject) || '(Chưa có tiêu đề email)';
        const renderedContent = formatContentForEmail(replaceVars(rawContent)) || '<p style="color:#94a3b8;font-style:italic;">Nội dung email sẽ hiển thị trực quan tại đây...</p>';

        if (previewSubjectTitle) previewSubjectTitle.textContent = renderedSubject;
        if (previewSubjectMeta) previewSubjectMeta.textContent = renderedSubject;
        if (previewFromMeta) previewFromMeta.textContent = `${resendConfig.fromName || 'Habit Mastery'} <${resendConfig.fromEmail || 'onboarding@resend.dev'}>`;

        if (previewToMeta) {
            const moreCount = recipients.length > 1 ? ` (+ ${recipients.length - 1} người nhận khác)` : '';
            previewToMeta.textContent = `${sample.name} <${sample.email}>${moreCount}`;
        }

        if (previewGreetingName) {
            previewGreetingName.textContent = sample.name || 'Bạn';
        }
        if (previewContent) {
            previewContent.innerHTML = renderedContent;
        }

        if (previewCtaBtn) {
            const ctaWrap = previewCtaBtn.closest('.email-tpl-cta-wrap');
            if (rawCtaText) {
                if (ctaWrap) ctaWrap.style.display = '';
                previewCtaBtn.textContent = rawCtaText;
                previewCtaBtn.href = rawCtaUrl || '#';
            } else if (ctaWrap) {
                ctaWrap.style.display = 'none';
            }
        }
    }

    [emailSubject, emailPreheader, emailContent, emailCtaText, emailCtaUrl].forEach(el => {
        if (el) {
            el.addEventListener('input', updateLivePreview);
            el.addEventListener('change', updateLivePreview);
        }
    });

    // ============================================================
    // 5. GỬI EMAIL CHÍNH THỨC & GỬI THỬ NGHIỆM
    // ============================================================
    async function executeSendEmail({ isTestOnly = false } = {}) {
        if (!resendConfig.apiKey || resendConfig.apiKey.trim().length < 5) {
            alert('Bạn chưa cấu hình Resend API Key! Vui lòng bấm vào nút "Cấu Hình API Key" để kích hoạt.');
            openConfigModal();
            return;
        }

        const subject = (emailSubject ? emailSubject.value : '').trim();
        const preheader = (emailPreheader ? emailPreheader.value : '').trim();
        const content = (emailContent ? emailContent.value : '').trim();
        const ctaText = (emailCtaText ? emailCtaText.value : '').trim();
        const ctaUrl = (emailCtaUrl ? emailCtaUrl.value : '').trim();

        if (!subject) {
            alert('Vui lòng nhập tiêu đề email!');
            if (emailSubject) emailSubject.focus();
            return;
        }
        if (!content) {
            alert('Vui lòng nhập nội dung email!');
            if (emailContent) emailContent.focus();
            return;
        }

        let recipientsToSend = [];
        if (isTestOnly) {
            const adminEmail = currentAdmin?.email;
            if (!adminEmail) {
                alert('Không xác định được email của tài khoản admin hiện tại!');
                return;
            }
            recipientsToSend = [{
                uid: currentAdmin.uid,
                email: adminEmail,
                name: currentAdmin.displayName || 'Admin',
                plan: 'premium',
                dp: 9999
            }];
        } else {
            recipientsToSend = getResolvedRecipients();
            if (recipientsToSend.length === 0) {
                alert('Danh sách người nhận mục tiêu đang trống! Vui lòng kiểm tra lại chế độ gửi.');
                return;
            }

            const confirmMsg = `🚀 XÁC NHẬN GỬI CHIẾN DỊCH EMAIL:\n\n` +
                `• Số lượng người nhận: ${recipientsToSend.length} thành viên\n` +
                `• Tiêu đề: "${subject}"\n` +
                `• Người gửi: ${resendConfig.fromName} <${resendConfig.fromEmail}>\n\n` +
                `Bạn có chắc chắn muốn phát lệnh gửi hàng loạt ngay bây giờ?`;

            if (!confirm(confirmMsg)) return;
        }

        const activeBtn = isTestOnly ? btnSendTestEmail : btnSubmitSendEmail;
        if (activeBtn) {
            activeBtn.disabled = true;
            activeBtn.textContent = isTestOnly ? '⏳ Đang gửi thử...' : `🚀 Đang gửi (${recipientsToSend.length} email)...`;
        }

        if (emailSendStatusBox) {
            emailSendStatusBox.style.display = 'block';
            emailSendStatusBox.className = 'email-send-status';
            emailSendStatusBox.style.color = '#94a3b8';
            emailSendStatusBox.innerHTML = `⏳ Đang gửi chiến dịch email tới <strong>${recipientsToSend.length}</strong> người nhận qua Resend...`;
        }

        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const resp = await fetch(`${EMAIL_API_BASE}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    targetMode: isTestOnly ? 'test' : currentTargetMode,
                    subject,
                    preheader,
                    content,
                    ctaText,
                    ctaUrl,
                    recipients: recipientsToSend,
                    sendOptions: {
                        apiKey: resendConfig.apiKey,
                        fromName: resendConfig.fromName,
                        fromEmail: resendConfig.fromEmail,
                        replyTo: resendConfig.replyTo
                    }
                })
            });

            const result = await resp.json();

            if (!resp.ok || !result.success) {
                throw new Error(result.message || result.error || 'Gửi thất bại qua Resend API');
            }

            const successCount = result.summary ? result.summary.successCount : recipientsToSend.length;
            const failedCount = result.summary ? result.summary.failedCount : 0;

            if (emailSendStatusBox) {
                emailSendStatusBox.className = failedCount > 0 ? 'email-send-status status-error' : 'email-send-status status-success';
                emailSendStatusBox.innerHTML = `🎉 <strong>Hoàn tất:</strong> Đã gửi thành công <strong>${successCount}</strong>/${recipientsToSend.length} email.` +
                    (failedCount > 0 ? ` (Thất bại: ${failedCount} email - xem chi tiết tại bảng Lịch Sử bên dưới)` : '');
            }

            alert(isTestOnly
                ? `✓ Đã gửi email thử nghiệm thành công tới ${recipientsToSend[0].email}!`
                : `🎉 Chiến dịch đã gửi thành công tới ${successCount} người nhận!`);

        } catch (err) {
            console.error('Send email error:', err);
            if (emailSendStatusBox) {
                emailSendStatusBox.className = 'email-send-status status-error';
                emailSendStatusBox.innerHTML = `✕ <strong>Lỗi gửi email:</strong> ${escHtml(err.message)}<br><small style="color:#cbd5e1;">Gợi ý: Kiểm tra lại Resend API Key hoặc Domain người gửi trong phần Cấu hình.</small>`;
            }
            alert('Lỗi gửi email: ' + err.message);
        } finally {
            if (activeBtn) {
                activeBtn.disabled = false;
                activeBtn.textContent = isTestOnly ? '📨 Gửi Thử Cho Tôi' : '🚀 Phát Lệnh Gửi Email';
            }
        }
    }

    if (btnSubmitSendEmail) {
        btnSubmitSendEmail.onclick = () => executeSendEmail({ isTestOnly: false });
    }
    if (btnSendTestEmail) {
        btnSendTestEmail.onclick = () => executeSendEmail({ isTestOnly: true });
    }
    // [v5.10.11] Nút "⚡ Gửi Thử (Admin)" ở banner trên cùng chưa từng được
    // gắn sự kiện -- dùng lại đúng luồng gửi thử như btnSendTestEmail.
    if (btnQuickTestEmail) {
        btnQuickTestEmail.onclick = () => executeSendEmail({ isTestOnly: true });
    }

    // ============================================================
    // 6. REALTIME EMAIL LOGS & DETAIL MODAL
    // ============================================================
    function startEmailLogsListener() {
        if (emailLogsUnsubscribe) emailLogsUnsubscribe();

        emailLogsUnsubscribe = db.collection('email_logs')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .onSnapshot((snapshot) => {
                cachedEmailLogs = [];
                snapshot.forEach(doc => {
                    cachedEmailLogs.push({ id: doc.id, ...doc.data() });
                });
                renderEmailLogsTable(cachedEmailLogs);
            }, (err) => {
                console.warn('Email logs listener error:', err);
            });
    }

    function renderEmailLogsTable(logs) {
        if (!emailLogsTableBody) return;
        if (!logs || logs.length === 0) {
            emailLogsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px;">Chưa có lịch sử gửi email nào.</td></tr>`;
            return;
        }

        emailLogsTableBody.innerHTML = logs.map(log => {
            const timeStr = formatDate(log.createdAt);
            const total = log.totalRecipients || 0;
            const success = log.successCount || 0;
            const status = log.status || 'success';

            let statusPill = `<span class="status-pill-log success">✓ Thành công (${success}/${total})</span>`;
            if (status === 'failed') {
                statusPill = `<span class="status-pill-log failed">✕ Thất bại</span>`;
            } else if (status === 'partial') {
                statusPill = `<span class="status-pill-log partial">⚠ Một phần (${success}/${total})</span>`;
            }

            const senderStr = `${escHtml(log.fromName || '')} &lt;${escHtml(log.fromEmail || '')}&gt;`;

            return `<tr>
                <td style="font-size:12px;color:var(--text-secondary);white-space:nowrap;">${timeStr}</td>
                <td style="font-weight:700;color:#ffffff;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escHtml(log.subject||'')}">${escHtml(log.subject || '—')}</td>
                <td style="font-size:12px;color:var(--text-muted);">${senderStr}</td>
                <td style="font-weight:700;color:var(--accent-blue-bright);">${total.toLocaleString('vi-VN')}</td>
                <td>${statusPill}</td>
                <td>
                    <button class="btn-sm" onclick="window._adminViewEmailLogDetail('${log.id}')" title="Xem chi tiết log">👁️ Chi tiết</button>
                </td>
            </tr>`;
        }).join('');
    }

    window._adminViewEmailLogDetail = (logId) => {
        const log = cachedEmailLogs.find(l => l.id === logId);
        if (!log || !emailLogDetailModal || !emailLogDetailContent) return;

        const timeStr = formatDate(log.createdAt);
        const total = log.totalRecipients || 0;
        const success = log.successCount || 0;
        const failed = log.failedCount || 0;

        let sampleRecipientsHtml = '';
        if (Array.isArray(log.results) && log.results.length > 0) {
            sampleRecipientsHtml = `<div style="max-height:160px;overflow-y:auto;background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;font-family:monospace;font-size:11.5px;margin-top:6px;">` +
                log.results.map((r, i) => `<div style="margin-bottom:3px;color:${r.success ? '#34d399' : '#f43f5e'};">${i+1}. ${escHtml(r.email)} - ${r.success ? '✓ ID: ' + (r.id || 'OK') : '✕ ' + escHtml(r.error || '')}</div>`).join('') +
                `</div>`;
        }

        emailLogDetailContent.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;font-size:13px;">
                <div><strong style="color:var(--text-secondary);">Tiêu đề:</strong> <span style="font-weight:700;color:#fff;">${escHtml(log.subject || '—')}</span></div>
                <div><strong style="color:var(--text-secondary);">Thời gian:</strong> ${timeStr}</div>
                <div><strong style="color:var(--text-secondary);">Admin gửi:</strong> ${escHtml(log.sentByEmail || log.sentBy || 'Admin')}</div>
                <div><strong style="color:var(--text-secondary);">Người gửi:</strong> ${escHtml(log.fromName || '')} &lt;${escHtml(log.fromEmail || '')}&gt;</div>
                <div><strong style="color:var(--text-secondary);">Kết quả:</strong> <span style="color:#10b981;font-weight:700;">${success} thành công</span> / <span style="color:#f43f5e;font-weight:700;">${failed} thất bại</span> (Tổng ${total})</div>
                <div>
                    <strong style="color:var(--text-secondary);">Chi tiết người nhận & Resend IDs:</strong>
                    ${sampleRecipientsHtml || '<div style="color:var(--text-muted);font-style:italic;">Không có dữ liệu chi tiết</div>'}
                </div>
            </div>
        `;

        emailLogDetailModal.style.display = 'flex';
    };

    if (emailLogDetailClose) emailLogDetailClose.onclick = () => { if (emailLogDetailModal) emailLogDetailModal.style.display = 'none'; };
    if (emailLogDetailDismiss) emailLogDetailDismiss.onclick = () => { if (emailLogDetailModal) emailLogDetailModal.style.display = 'none'; };
    if (emailLogDetailModal) {
        emailLogDetailModal.onclick = (e) => { if (e.target === emailLogDetailModal) emailLogDetailModal.style.display = 'none'; };
    }

    // ============================================================
    // 7. GLOBAL HOOKS & COMPOSER SHORTCUTS
    // ============================================================
    window._adminOpenEmailComposer = (targetUid) => {
        switchSection('emails');
        if (targetUid && Array.isArray(allUsers)) {
            const user = allUsers.find(u => u.uid === targetUid);
            if (user && user.email) {
                setTargetMode('single');
                if (emailDirectInput) emailDirectInput.value = user.email;
                if (emailUserDropdown) emailUserDropdown.value = '';
                updateRecipientCountDisplay();
                updateLivePreview();
            }
        }
        const composerEl = document.getElementById('sectionEmails');
        if (composerEl) composerEl.scrollIntoView({ behavior: 'smooth' });
    };

    window._adminSelectEmailTargetMode = (mode) => {
        setTargetMode(mode);
    };

    window._adminOnSwitchToEmails = () => {
        updateRecipientCountDisplay();
        updateLivePreview();
    };

    // --- Init Sequence ---
    loadResendConfig();
    applyTemplate('vip');
    setTargetMode('single');
    startEmailLogsListener();
}

// ===== INIT =====
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initAuth) 
    : initAuth();

})();
