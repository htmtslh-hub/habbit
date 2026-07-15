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
                    <span class="user-cell-name">${escHtml(name)}${u.role==='admin'?' 🛡️':''}</span>
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
            const titles = { dashboard: 'Dashboard', users: 'Quản lý User', pending: 'Chờ duyệt' };
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

// ===== INIT =====
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initAuth) 
    : initAuth();

})();
