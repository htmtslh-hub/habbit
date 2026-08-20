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

function isTrialExpired(user){
    if(user.plan !== 'trial') return false;
    if(!user.trialExpiresAt) return true;
    const exp = user.trialExpiresAt.toDate ? user.trialExpiresAt.toDate() : new Date(user.trialExpiresAt);
    return exp < new Date();
}

function getEffectivePlan(user){
    if(user.plan === 'premium') return 'premium';
    if(user.plan === 'trial' && !isTrialExpired(user)) return 'trial';
    return 'free';
}

function isActive30d(user){
    if(!user.lastLoginAt) return false;
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
            document.getElementById('searchInput')?.value?.trim()
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

// ===== STATS =====
function updateStats(){
    document.getElementById('statTotal').textContent = allUsers.length;
    document.getElementById('statActive').textContent = allUsers.filter(u => isActive30d(u)).length;
    document.getElementById('statPremium').textContent = allUsers.filter(u => getEffectivePlan(u) === 'premium').length;
    document.getElementById('statTrial').textContent = allUsers.filter(u => getEffectivePlan(u) === 'trial').length;
}

// ===== RENDER USERS TABLE =====
function renderUsers(filter, search){
    const tbody = document.getElementById('userTableBody');
    const empty = document.getElementById('tableEmpty');
    
    let filtered = [...allUsers];
    
    // Filter by plan
    if(filter && filter !== 'all'){
        filtered = filtered.filter(u => getEffectivePlan(u) === filter);
    }
    
    // Search
    if(search){
        const q = search.toLowerCase();
        filtered = filtered.filter(u => 
            (u.displayName||'').toLowerCase().includes(q) || 
            (u.email||'').toLowerCase().includes(q) ||
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
            <td>${shortDate(u.createdAt)}</td>
            <td>${shortDate(u.lastLoginAt)}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
            <td>
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
            const titles = { dashboard: 'Dashboard', users: 'Quản lý User', pending: 'Chờ duyệt', quests: 'Nhiệm vụ Đột xuất' };
            document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        };
    });
}

// ===== SEARCH & FILTER =====
function initSearch(){
    const searchInput = document.getElementById('searchInput');
    const filterPlan = document.getElementById('filterPlan');
    
    let debounce;
    searchInput.oninput = () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            renderUsers(filterPlan.value, searchInput.value.trim());
        }, 300);
    };
    filterPlan.onchange = () => {
        renderUsers(filterPlan.value, searchInput.value.trim());
    };
}

// ===== ACTIONS =====
function initActions(){
    document.getElementById('btnRefresh').onclick = async () => {
        await loadUsers();
    };

    document.getElementById('btnExportUsers').onclick = () => {
        const headers = ['UID','Name','Email','Plan','Role','Created','LastLogin','Disabled'];
        const rows = allUsers.map(u => [
            u.uid,
            u.displayName||'',
            u.email||'',
            getEffectivePlan(u),
            u.role||'customer',
            shortDate(u.createdAt),
            shortDate(u.lastLoginAt),
            u.disabled?'Yes':'No'
        ]);
        let csv = headers.join(',') + '\n';
        rows.forEach(r => { csv += r.map(v => `"${v}"`).join(',') + '\n'; });
        
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
        const updates = {
            plan: newPlan,
            planUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            upgradeRequested: false,
        };
        
        if(newPlan === 'trial'){
            const now = new Date();
            updates.trialStartedAt = firebase.firestore.Timestamp.fromDate(now);
            updates.trialExpiresAt = firebase.firestore.Timestamp.fromDate(new Date(now.getTime() + 14*24*60*60*1000));
            updates.planExpiresAt = null;
        } else if(newPlan === 'premium'){
            updates.planExpiresAt = null; // Permanent for now
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
            container.innerHTML = '<p style="color:#64748b;padding:12px;">Chưa có nhiệm vụ nào</p>';
        } else {
            let html = '';
            snap.forEach(doc => {
                const q = doc.data();
                const deadline = q.deadline ? new Date(q.deadline.toDate()).toLocaleDateString('vi-VN') : 'Không';
                const statusColor = q.status === 'active' ? '#10b981' : '#64748b';
                html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;margin-bottom:8px;">
                    <div style="flex:1;">
                        <div style="font-weight:600;color:#f1f5f9;"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> ${escapeHtml(q.title || '')}</div>
                        <div style="font-size:12px;color:#94a3b8;margin-top:2px;">${escapeHtml(q.description || '')} | +${q.rewardDP || 0} DP | Hạn: ${deadline}</div>
                    </div>
                    <span style="color:${statusColor};font-size:12px;font-weight:600;">${q.status === 'active' ? 'Đang mở' : 'Đã đóng'}</span>
                    ${q.status === 'active' ? `<button onclick="window._deactivateQuest('${doc.id}')" style="background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.2);padding:4px 10px;border-radius:8px;cursor:pointer;font-size:11px;">Đóng</button>` : ''}
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
                    subHtml += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.15);border-radius:12px;margin-bottom:8px;">
                        <div style="flex:1;">
                            <div style="font-weight:600;color:#f1f5f9;">${escapeHtml(s.displayName || 'User')}</div>
                            <div style="font-size:12px;color:#94a3b8;"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> ${escapeHtml(q.title || '')} | +${q.rewardDP || 0} DP</div>
                        </div>
                        <button onclick="window._approveSubmission('${doc.id}','${sub.id}','${sub.data().uid}',${q.rewardDP || 0})" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">✅ Duyệt</button>
                        <button onclick="window._rejectSubmission('${doc.id}','${sub.id}')" style="background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.2);padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;">❌ Từ chối</button>
                    </div>`;
                });
            } catch (e) { console.warn('Load submissions error:', e); }
        }

        if (subContainer) {
            subContainer.innerHTML = subHtml || '<p style="color:#64748b;padding:12px;">Không có báo cáo chờ duyệt</p>';
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

// ===== INIT =====
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initAuth) 
    : initAuth();

})();
