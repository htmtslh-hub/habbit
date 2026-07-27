(function(){
'use strict';

const SK='habitgame_v3';
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;
let userDocRef = null;
let saveTimer = null;
let userPlan = { plan: 'free', trialExpiresAt: null, disabled: false };
const MAX_FREE_HABITS = 3;
const PREMIUM_FEATURES = ['heatmap','notes','charts','unlimited_habits'];

const I18N = {
    vi: {
        title:'THEO DÕI THÓI QUEN',calSettings:'CÀI ĐẶT LỊCH',
        year:'Năm',month:'Tháng',overallStats:'Thống Kê Chung',
        completed:'Hoàn thành',left:'Còn lại',myHabits:'Thói Quen',
        target:'Mục tiêu',actual:'Thực tế',leftCol:'Còn',progress:'Tiến độ',
        top10:'TOP 10 THÓI QUEN',mood:'Tâm trạng',hoursOfSleep:'Giờ ngủ',hrs:'giờ',
        addHabit:'+ Thêm thói quen',addNewHabit:'Thêm Thói Quen Mới',
        editHabit:'Sửa Thói Quen',
        habitNamePh:'Tên thói quen...',cancel:'Hủy',save:'Lưu',
        deleteConfirm:'Xóa thói quen này?',
        exportOk:'Đã xuất dữ liệu!',importOk:'Đã nhập dữ liệu!',importFail:'File không hợp lệ!',
        months:['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
        days:['CN','T2','T3','T4','T5','T6','T7'],
        dailyNotes:'Ghi chú hàng ngày',notesPh:'Nhập ghi chú hôm nay...',
        heatmap:'Mật độ hoạt động cả năm',less:'Ít',more:'Nhiều',
        targetLabelModal:'Mục tiêu thói quen',targetHint:'ngày/tháng',
        dayMon:'T2',dayWed:'T4',dayFri:'T6',
        tabHabits:'Thói quen',tabCharts:'Biểu đồ',tabHeatmap:'Mật độ',tabNotes:'Ghi chú',tabTop10:'Top 10',
        freezeCol:'Đóng băng cột (Ghim)',unfreezeCol:'Bỏ đóng băng cột',
        collapseCol:'Thu gọn cột',expandCol:'Mở rộng cột',
    },
    zh: {
        title:'习惯追踪器',calSettings:'日历设置',year:'年',month:'月',
        overallStats:'总体统计',completed:'已完成',left:'剩余',myHabits:'我的习惯',
        target:'目标',actual:'实际',leftCol:'剩余',progress:'进度',
        top10:'TOP 10 习惯',mood:'心情',hoursOfSleep:'睡眠时长',hrs:'小时',
        addHabit:'+ 添加习惯',addNewHabit:'添加新习惯',editHabit:'编辑习惯',
        habitNamePh:'习惯名称...',cancel:'取消',save:'保存',
        deleteConfirm:'确认删除？',
        exportOk:'导出成功！',importOk:'导入成功！',importFail:'文件无效！',
        months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        days:['日','一','二','三','四','五','六'],
        dailyNotes:'每日随笔',notesPh:'写点什么...',
        heatmap:'年度活动热力图',less:'少',more:'多',
        targetLabelModal:'习惯目标',targetHint:'天/月',
        dayMon:'一',dayWed:'三',dayFri:'五',
        tabHabits:'习惯',tabCharts:'图表',tabHeatmap:'热力图',tabNotes:'笔记',tabTop10:'前十',
        freezeCol:'冻结列',unfreezeCol:'解冻列',
        collapseCol:'折叠列',expandCol:'展开列',
    },
    en: {
        title:'HABIT MASTERY',calSettings:'CALENDAR SETTINGS',year:'Year',month:'Month',
        overallStats:'Overall Stats',completed:'Completed',left:'Left',myHabits:'My Habits',
        target:'Target',actual:'Actual',leftCol:'Left',progress:'Progress',
        top10:'TOP 10 HABITS',mood:'Mood',hoursOfSleep:'Hours of Sleep',hrs:'hrs',
        addHabit:'+ Add Habit',addNewHabit:'Add New Habit',editHabit:'Edit Habit',
        habitNamePh:'Habit name...',cancel:'Cancel',save:'Save',
        deleteConfirm:'Delete this habit?',
        exportOk:'Exported!',importOk:'Imported!',importFail:'Invalid file!',
        months:['January','February','March','April','May','June','July','August','September','October','November','December'],
        days:['Su','Mo','Tu','We','Th','Fr','Sa'],
        dailyNotes:'Daily Notes',notesPh:'Write daily notes...',
        heatmap:'Annual Activity Heatmap',less:'Less',more:'More',
        targetLabelModal:'Habit Target',targetHint:'days/month',
        dayMon:'Mon',dayWed:'Wed',dayFri:'Fri',
        tabHabits:'Habits',tabCharts:'Charts',tabHeatmap:'Heatmap',tabNotes:'Notes',tabTop10:'Top 10',
        freezeCol:'Freeze column',unfreezeCol:'Unfreeze column',
        collapseCol:'Collapse column',expandCol:'Expand column',
    }
};

let curLang=localStorage.getItem('hg_lang')||'vi';
function t(k){return(I18N[curLang]||I18N.en)[k]||(I18N.en[k])||k}

function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh)});
    const ms=document.querySelector('#monthSel');
    if(ms){ms.innerHTML='';t('months').forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=m;ms.appendChild(o)});ms.value=cM}
    document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.toggle('active',b.dataset.lang===curLang)});
}

const DEF=[
    {id:1,name:'Wake up at 05:00',emoji:'⏰'},{id:2,name:'Gym',emoji:'💪'},
    {id:3,name:'Reading / Learning',emoji:'📖'},{id:4,name:'Day Planning',emoji:'🗓️'},
    {id:5,name:'No Gooning',emoji:'💦'},{id:6,name:'Project Work',emoji:'🎯'},
    {id:7,name:'No Alcohol',emoji:'🍾'},{id:8,name:'Social Media Detox',emoji:'🌿'},
    {id:9,name:'Goal Journaling',emoji:'📔'},{id:10,name:'Cold Shower',emoji:'🚿'},
    {id:11,name:'Learn a skill',emoji:'📈'},{id:12,name:'Meditate',emoji:'🧘'},
    {id:13,name:'Stretching',emoji:'🤸'},
];
let S={h:[...DEF],c:{},mo:{},sl:{},ni:14,notes:{}};
let cM=new Date().getMonth(),cY=new Date().getFullYear(),sE='💪',selectedDay=new Date().getDate();
let isColumnFrozen = localStorage.getItem('hg_col_frozen') !== 'false';
let isColumnCollapsed = localStorage.getItem('hg_col_collapsed') === 'true';
function ld(){try{const r=localStorage.getItem(SK);if(r){const res=JSON.parse(r);res.notes=res.notes||{};return res}}catch(e){}return{h:[...DEF],c:{},mo:{},sl:{},ni:14,notes:{}}}
function sv(){
    localStorage.setItem(SK,JSON.stringify(S));
    // Debounced Firestore save
    if(userDocRef){
        clearTimeout(saveTimer);
        saveTimer = setTimeout(()=>{
            userDocRef.set({habitData:JSON.stringify(S)},{merge:true}).catch(e=>console.warn('Firestore save error:',e));
        }, 1500);
    }
}
async function loadFromFirestore(){
    if(!userDocRef) return false;
    try{
        const doc = await userDocRef.get();
        if(doc.exists && doc.data().habitData){
            const d = JSON.parse(doc.data().habitData);
            if(d && d.h && d.c){ d.notes = d.notes||{}; S = d; localStorage.setItem(SK,JSON.stringify(S)); return true; }
        }
    }catch(e){console.warn('Firestore load error:',e);}
    return false;
}
function showUserProfile(user){
    const avatar = document.querySelector('#userAvatar');
    const name = document.querySelector('#userName');
    if(avatar){
        avatar.src = user.photoURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="%2310b981"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">' + (user.displayName||user.email||'U').charAt(0).toUpperCase() + '</text></svg>';
        avatar.style.display = 'block';
    }
    if(name) name.textContent = user.displayName || user.email || 'User';
}

async function ensureUserProfile(user){
    if(!userDocRef) return;
    try {
        const doc = await userDocRef.get();
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
        
        if(!doc.exists){
            const profileData = {
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                plan: 'trial',
                role: 'customer',
                trialStartedAt: firebase.firestore.Timestamp.fromDate(now),
                trialExpiresAt: firebase.firestore.Timestamp.fromDate(trialEnd),
                planUpdatedAt: firebase.firestore.Timestamp.fromDate(now),
                planExpiresAt: null,
                createdAt: firebase.firestore.Timestamp.fromDate(now),
                lastLoginAt: firebase.firestore.Timestamp.fromDate(now),
                disabled: false,
            };
            await userDocRef.set(profileData);
        } else {
            const data = doc.data();
            const updates = {};
            let needsUpdate = false;
            
            if(!data.email && user.email) { updates.email = user.email; needsUpdate = true; }
            if(!data.displayName && user.displayName) { updates.displayName = user.displayName; needsUpdate = true; }
            if(!data.photoURL && user.photoURL) { updates.photoURL = user.photoURL; needsUpdate = true; }
            
            if(data.plan === undefined) { updates.plan = 'trial'; needsUpdate = true; }
            if(data.role === undefined) { updates.role = 'customer'; needsUpdate = true; }
            if(data.trialExpiresAt === undefined) { 
                updates.trialExpiresAt = firebase.firestore.Timestamp.fromDate(trialEnd); 
                updates.trialStartedAt = firebase.firestore.Timestamp.fromDate(now); 
                needsUpdate = true; 
            }
            if(data.disabled === undefined) { updates.disabled = false; needsUpdate = true; }
            
            updates.lastLoginAt = firebase.firestore.Timestamp.fromDate(now);
            needsUpdate = true;
            
            if(needsUpdate){
                await userDocRef.update(updates);
            }
        }
    } catch(e) {
        console.warn('Ensure profile error:', e);
    }
}

/* ===== PREMIUM PLAN SYSTEM ===== */
async function loadUserPlan(){
    if(!userDocRef) return;
    try {
        const doc = await userDocRef.get();
        if(doc.exists){
            const data = doc.data();
            userPlan = {
                plan: data.plan || 'free',
                trialExpiresAt: data.trialExpiresAt || null,
                planExpiresAt: data.planExpiresAt || null,
                disabled: data.disabled || false,
                role: data.role || 'customer',
            };
        }
    } catch(e){ console.warn('Load plan error:', e); }
}

function getEffectivePlan(){
    if(userPlan.plan === 'premium') return 'premium';
    if(userPlan.plan === 'trial'){
        if(!userPlan.trialExpiresAt) return 'free';
        const exp = userPlan.trialExpiresAt.toDate ? userPlan.trialExpiresAt.toDate() : new Date(userPlan.trialExpiresAt);
        if(exp > new Date()) return 'trial';
        return 'free';
    }
    return 'free';
}

function getTrialDaysLeft(){
    if(!userPlan.trialExpiresAt) return 0;
    const exp = userPlan.trialExpiresAt.toDate ? userPlan.trialExpiresAt.toDate() : new Date(userPlan.trialExpiresAt);
    const diff = exp.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24*60*60*1000)));
}

function isPremiumFeature(feature){
    const plan = getEffectivePlan();
    if(plan === 'premium' || plan === 'trial') return true;
    return false;
}

function canAddHabit(){
    const plan = getEffectivePlan();
    if(plan === 'premium' || plan === 'trial') return true;
    return S.h.length < MAX_FREE_HABITS;
}

function renderPremiumBanner(){
    // Remove old banner
    const old = document.querySelector('#premiumBanner');
    if(old) old.remove();

    const plan = getEffectivePlan();
    if(plan === 'premium') return;

    const banner = document.createElement('div');
    banner.id = 'premiumBanner';
    banner.className = 'premium-banner';

    if(plan === 'trial'){
        const days = getTrialDaysLeft();
        banner.classList.add('trial');
        banner.innerHTML = `
            <span class="pb-icon">⏳</span>
            <span class="pb-text">Dùng thử Premium — Còn <strong>${days} ngày</strong></span>
            <button class="pb-btn" onclick="window._openUpgrade()">Nâng cấp ngay</button>
            <button class="pb-close" onclick="this.parentElement.remove()">✕</button>
        `;
    } else {
        banner.classList.add('free');
        banner.innerHTML = `
            <span class="pb-icon">🔒</span>
            <span class="pb-text">Bạn đang dùng gói <strong>Free</strong> (giới hạn ${MAX_FREE_HABITS} thói quen)</span>
            <button class="pb-btn" onclick="window._openUpgrade()">👑 Nâng cấp Premium</button>
            <button class="pb-close" onclick="this.parentElement.remove()">✕</button>
        `;
    }

    const app = document.querySelector('#mainApp');
    const navbar = document.querySelector('.navbar');
    if(app && navbar) app.insertBefore(banner, navbar.nextSibling);
}

function applyPremiumGate(){
    const plan = getEffectivePlan();
    const isFree = plan === 'free';

    // Heatmap
    const heatmap = document.querySelector('.heatmap-section');
    if(heatmap){
        if(isFree){
            heatmap.classList.add('locked-feature');
            if(!heatmap.querySelector('.lock-overlay')){
                heatmap.insertAdjacentHTML('beforeend', '<div class="lock-overlay" onclick="window._openUpgrade()"><span>🔒</span><p>Premium Feature</p></div>');
            }
        } else {
            heatmap.classList.remove('locked-feature');
            const lo = heatmap.querySelector('.lock-overlay'); if(lo) lo.remove();
        }
    }

    // Notes
    const notes = document.querySelector('.notes-section');
    if(notes){
        if(isFree){
            notes.classList.add('locked-feature');
            if(!notes.querySelector('.lock-overlay')){
                notes.insertAdjacentHTML('beforeend', '<div class="lock-overlay" onclick="window._openUpgrade()"><span>🔒</span><p>Premium Feature</p></div>');
            }
        } else {
            notes.classList.remove('locked-feature');
            const lo = notes.querySelector('.lock-overlay'); if(lo) lo.remove();
        }
    }

    // Charts (line chart)
    const lineBox = document.querySelector('.line-chart-box');
    if(lineBox){
        if(isFree){
            lineBox.classList.add('locked-feature');
            if(!lineBox.querySelector('.lock-overlay')){
                lineBox.insertAdjacentHTML('beforeend', '<div class="lock-overlay" onclick="window._openUpgrade()"><span>🔒</span><p>Premium</p></div>');
            }
        } else {
            lineBox.classList.remove('locked-feature');
            const lo = lineBox.querySelector('.lock-overlay'); if(lo) lo.remove();
        }
    }

    // Add habit button
    const addBtn = document.querySelector('#btnAdd');
    if(addBtn){
        if(!canAddHabit()){
            addBtn.classList.add('btn-locked');
            addBtn.title = `Giới hạn ${MAX_FREE_HABITS} thói quen (Free). Nâng cấp Premium!`;
        } else {
            addBtn.classList.remove('btn-locked');
            addBtn.title = '';
        }
    }

    // Admin link
    if(userPlan.role === 'admin'){
        if(!document.querySelector('#adminLink')){
            const nav = document.querySelector('.nav-controls');
            if(nav){
                const link = document.createElement('a');
                link.id = 'adminLink';
                link.href = 'admin.html';
                link.className = 'nav-action-btn';
                link.title = 'Admin Dashboard';
                link.textContent = '🛡️';
                link.style.textDecoration = 'none';
                nav.insertBefore(link, nav.firstChild);
            }
        }
    }
}

function openUpgradeModal(){
    let modal = document.querySelector('#upgradeModal');
    if(!modal){
        modal = document.createElement('div');
        modal.id = 'upgradeModal';
        modal.className = 'upgrade-modal-bg';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <button class="upgrade-close" onclick="document.querySelector('#upgradeModal').classList.remove('show')">✕</button>
                <div class="upgrade-header">
                    <span class="upgrade-crown">👑</span>
                    <h2>Nâng cấp Premium</h2>
                    <p>Mở khóa toàn bộ tính năng Habit Mastery</p>
                </div>

                <!-- Step indicators -->
                <div class="pay-steps">
                    <div class="pay-step active" id="payStep1"><span class="pay-step-num">1</span> Chọn gói</div>
                    <div class="pay-step-line" id="payLine1"></div>
                    <div class="pay-step" id="payStep2"><span class="pay-step-num">2</span> Thanh toán</div>
                    <div class="pay-step-line" id="payLine2"></div>
                    <div class="pay-step" id="payStep3"><span class="pay-step-num">3</span> Hoàn tất</div>
                </div>

                <!-- STEP 1: Plan Selection -->
                <div id="payView1">
                    <div class="upgrade-compare">
                        <div class="compare-col free-col">
                            <h3>Free</h3>
                            <ul>
                                <li>✅ ${MAX_FREE_HABITS} thói quen</li>
                                <li>✅ Theo dõi hàng ngày</li>
                                <li>✅ Đồng bộ đám mây</li>
                                <li>❌ Biểu đồ phân tích</li>
                                <li>❌ Heatmap năm</li>
                                <li>❌ Ghi chú hàng ngày</li>
                            </ul>
                            <div class="compare-price">0đ</div>
                        </div>
                        <div class="compare-col premium-col">
                            <h3>Premium 👑</h3>
                            <ul>
                                <li>✅ Không giới hạn thói quen</li>
                                <li>✅ Biểu đồ phân tích</li>
                                <li>✅ Heatmap cả năm</li>
                                <li>✅ Ghi chú hàng ngày</li>
                                <li>✅ Ưu tiên hỗ trợ</li>
                            </ul>
                        </div>
                    </div>
                    <div class="plan-selector">
                        <div class="plan-card" data-plan="monthly" onclick="window._selectPlan('monthly')">
                            <span class="plan-check">✅</span>
                            <div class="plan-name">Gói Tháng</div>
                            <div class="plan-price">99.000đ<small>/tháng</small></div>
                        </div>
                        <div class="plan-card" data-plan="yearly" onclick="window._selectPlan('yearly')">
                            <span class="plan-badge">Tiết kiệm 30%</span>
                            <span class="plan-check">✅</span>
                            <div class="plan-name">Gói Năm</div>
                            <div class="plan-price">399.000đ<small>/năm</small></div>
                            <div class="plan-save">~33.250đ/tháng</div>
                        </div>
                    </div>
                    <button class="btn-pay-next" id="btnPayNext" disabled onclick="window._goToPayment()">Tiếp tục thanh toán →</button>
                </div>

                <!-- STEP 2: QR Payment -->
                <div id="payView2" style="display:none">
                    <div class="qr-payment-section">
                        <h3>📱 Quét mã QR để thanh toán</h3>
                        <div class="qr-container">
                            <img id="sepayQrImg" alt="QR Code thanh toán" />
                        </div>
                        <div class="qr-amount" id="qrAmountDisplay"></div>
                        <div class="qr-desc" id="qrDescDisplay"></div>
                        <div class="qr-bank-info">
                            Ngân hàng: <strong>VietinBank</strong><br>
                            STK: <strong>109887120806</strong> — <strong>NGUYEN VAN A</strong>
                        </div>
                    </div>
                    <div class="pay-waiting">
                        <div class="spinner"></div>
                        <span>Đang chờ xác nhận thanh toán...</span>
                    </div>
                    <div class="pay-countdown">
                        <span class="cd-icon">⏱️</span>
                        <span>Hết hạn sau</span>
                        <span class="cd-time" id="payCountdown">15:00</span>
                    </div>
                    <div class="pay-manual-fallback">
                        Đã chuyển khoản? <a onclick="window._manualConfirm()">Xác nhận thủ công</a>
                    </div>
                    <button class="btn-pay-back" onclick="window._backToPlanSelect()">← Quay lại chọn gói</button>
                </div>

                <!-- STEP 3: Success -->
                <div id="payView3" style="display:none">
                    <div class="pay-success">
                        <div class="success-icon">✓</div>
                        <h3>🎉 Thanh toán thành công!</h3>
                        <p>Tài khoản của bạn đã được nâng cấp lên Premium</p>
                        <div class="success-details" id="successDetails"></div>
                    </div>
                    <button class="btn-pay-next" onclick="window._closePaymentSuccess()">Bắt đầu sử dụng Premium →</button>
                </div>

                <!-- EXPIRED -->
                <div id="payViewExpired" style="display:none">
                    <div class="pay-expired">
                        <div class="expired-icon">⏰</div>
                        <h3>Đã hết thời gian thanh toán</h3>
                        <p>Vui lòng tạo đơn thanh toán mới</p>
                    </div>
                    <button class="btn-pay-next" onclick="window._backToPlanSelect()">Thử lại</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.onclick = (e) => { if(e.target === modal) modal.classList.remove('show'); };
    }
    // Reset to step 1
    _payShowStep(1);
    modal.classList.add('show');
}

// ===== SEPAY PAYMENT CONFIG =====
const SEPAY_CONFIG = {
    bank: 'VietinBank',
    bankCode: 'VietinBank',  // Mã ngân hàng VietinBank cho SePay QR
    accountNumber: '109887120806',
    accountName: 'DINH VAN TRIEN',
    plans: {
        monthly: { amount: 99000, label: 'Gói Tháng', duration: '1 tháng' },
        yearly:  { amount: 399000, label: 'Gói Năm', duration: '1 năm' },
    },
    timeoutMinutes: 15,
};

let _selectedPlan = null;
let _currentPaymentOrder = null;
let _paymentListener = null;
let _countdownTimer = null;

function _payShowStep(step){
    ['payView1','payView2','payView3','payViewExpired'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });
    const viewId = step === 'expired' ? 'payViewExpired' : `payView${step}`;
    const view = document.getElementById(viewId);
    if(view) view.style.display = 'block';

    // Update step indicators
    for(let i = 1; i <= 3; i++){
        const s = document.getElementById(`payStep${i}`);
        if(!s) continue;
        s.classList.remove('active','done');
        if(typeof step === 'number'){
            if(i < step) s.classList.add('done');
            else if(i === step) s.classList.add('active');
        }
    }
    const l1 = document.getElementById('payLine1');
    const l2 = document.getElementById('payLine2');
    if(l1) l1.classList.toggle('done', typeof step === 'number' && step > 1);
    if(l2) l2.classList.toggle('done', typeof step === 'number' && step > 2);
}

window._selectPlan = function(plan){
    _selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.plan === plan);
    });
    const btn = document.getElementById('btnPayNext');
    if(btn) btn.disabled = false;
};

window._goToPayment = async function(){
    if(!_selectedPlan || !currentUser) return;

    const planInfo = SEPAY_CONFIG.plans[_selectedPlan];
    if(!planInfo) return;

    // Generate unique order number: HBT + timestamp
    const orderNumber = 'HBT' + Date.now();

    try {
        // Create payment order in Firestore
        const paymentRef = db.collection('payments').doc();
        const orderData = {
            orderNumber: orderNumber,
            uid: currentUser.uid,
            email: currentUser.email || '',
            plan: _selectedPlan,
            amount: planInfo.amount,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            paidAt: null,
            transactionId: null,
        };
        await paymentRef.set(orderData);
        _currentPaymentOrder = { id: paymentRef.id, ...orderData };

        // Generate SePay QR URL
        const transferContent = 'SEVQR ' + orderNumber;
        const params = new URLSearchParams({
            bank: SEPAY_CONFIG.bankCode,
            acc: SEPAY_CONFIG.accountNumber,
            template: 'compact',
            amount: planInfo.amount,
            des: transferContent,
        });
        const qrUrl = 'https://qr.sepay.vn/img?' + params.toString();

        // Update UI
        const qrImg = document.getElementById('sepayQrImg');
        if(qrImg) qrImg.src = qrUrl;
        const amtDisp = document.getElementById('qrAmountDisplay');
        if(amtDisp) amtDisp.textContent = planInfo.amount.toLocaleString('vi-VN') + 'đ';
        const descDisp = document.getElementById('qrDescDisplay');
        if(descDisp) descDisp.textContent = transferContent;

        // Show step 2
        _payShowStep(2);

        // Start real-time listener
        _startPaymentListener(paymentRef.id);

        // Start countdown
        _startCountdown();

    } catch(err) {
        console.error('Payment order creation error:', err);
        alert('Lỗi tạo đơn thanh toán: ' + err.message);
    }
};

function _startPaymentListener(paymentId){
    // Clean up previous listener
    if(_paymentListener) _paymentListener();

    _paymentListener = db.collection('payments').doc(paymentId).onSnapshot(doc => {
        if(!doc.exists) return;
        const data = doc.data();
        if(data.status === 'paid'){
            // Payment confirmed!
            _onPaymentSuccess(data);
        } else if(data.status === 'amount_mismatch'){
            alert('⚠️ Số tiền chuyển khoản không khớp. Vui lòng liên hệ admin.');
        }
    }, err => {
        console.error('Payment listener error:', err);
    });
}

function _onPaymentSuccess(paymentData){
    // Stop listeners and timers
    if(_paymentListener){ _paymentListener(); _paymentListener = null; }
    if(_countdownTimer){ clearInterval(_countdownTimer); _countdownTimer = null; }

    // Update local plan state
    userPlan.plan = 'premium';
    applyPremiumGate();

    // Show success step
    _payShowStep(3);

    const details = document.getElementById('successDetails');
    if(details){
        const planInfo = SEPAY_CONFIG.plans[paymentData.plan] || {};
        details.innerHTML = `
            <div><span>Gói</span><span>${planInfo.label || paymentData.plan}</span></div>
            <div><span>Số tiền</span><span>${(paymentData.amount||0).toLocaleString('vi-VN')}đ</span></div>
            <div><span>Mã đơn</span><span style="font-family:var(--font-mono);font-size:12px">${paymentData.orderNumber}</span></div>
            <div><span>Thời hạn</span><span>${planInfo.duration || ''}</span></div>
        `;
    }

    // Fire confetti!
    if(typeof fireConfetti === 'function') fireConfetti();
}

function _startCountdown(){
    if(_countdownTimer) clearInterval(_countdownTimer);
    let remaining = SEPAY_CONFIG.timeoutMinutes * 60; // seconds
    const cdEl = document.getElementById('payCountdown');

    _countdownTimer = setInterval(() => {
        remaining--;
        if(remaining <= 0){
            clearInterval(_countdownTimer);
            _countdownTimer = null;
            // Expire
            if(_paymentListener){ _paymentListener(); _paymentListener = null; }
            _payShowStep('expired');
            return;
        }
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        if(cdEl) cdEl.textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    }, 1000);
}

window._backToPlanSelect = function(){
    // Clean up
    if(_paymentListener){ _paymentListener(); _paymentListener = null; }
    if(_countdownTimer){ clearInterval(_countdownTimer); _countdownTimer = null; }
    _currentPaymentOrder = null;
    _payShowStep(1);
};

window._manualConfirm = async function(){
    if(!userDocRef || !_currentPaymentOrder) return;
    try {
        await userDocRef.update({
            upgradeRequested: true,
            upgradeRequestedAt: firebase.firestore.FieldValue.serverTimestamp(),
            upgradeNote: _currentPaymentOrder.orderNumber,
        });
        alert('✅ Yêu cầu đã gửi! Admin sẽ xác nhận trong 1-24 giờ.\nMã đơn: ' + _currentPaymentOrder.orderNumber);
    } catch(e){
        alert('Lỗi: ' + e.message);
    }
};

window._closePaymentSuccess = function(){
    const modal = document.querySelector('#upgradeModal');
    if(modal) modal.classList.remove('show');
    // Reload to apply Premium
    location.reload();
};

window._openUpgrade = openUpgradeModal;
window._requestUpgrade = window._manualConfirm;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function dim(m,y){return new Date(y,m+1,0).getDate()}
function ck(id,d){return`${cY}-${cM}-${id}-${d}`}

/* THEME */
let curTheme=localStorage.getItem('hg_theme')||'light';
function applyTheme(){document.documentElement.setAttribute('data-theme',curTheme);const b=$('#themeBtn');if(b)b.textContent=curTheme==='dark'?'☀️':'🌙'}
function toggleTheme(){curTheme=curTheme==='dark'?'light':'dark';localStorage.setItem('hg_theme',curTheme);applyTheme();renderBar();renderLine()}

/* EXPORT/IMPORT */
function exportData(){const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`habit-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u)}
function importData(f){const r=new FileReader();r.onload=e=>{try{const d=JSON.parse(e.target.result);if(d&&d.h&&d.c){S=d;sv();renderAll();alert(t('importOk'))}else{alert(t('importFail'))}}catch(err){alert(t('importFail'))}};r.readAsText(f)}

/* TODAY */
const TODAY=new Date(),todayD=TODAY.getDate(),todayM=TODAY.getMonth(),todayY=TODAY.getFullYear();
function isToday(d){return d===todayD&&cM===todayM&&cY===todayY}

/* STREAK calculator */
function getStreak(hId){
    const days=dim(cM,cY);
    let streak=0;
    // Count backwards from today (or last day of month)
    const end=cM===todayM&&cY===todayY?todayD:days;
    for(let d=end;d>=1;d--){
        if(S.c[ck(hId,d)])streak++;
        else break;
    }
    return streak;
}

/* CONFETTI */
function fireConfetti(){
    const canvas=$('#confettiCanvas');
    if(!canvas)return;
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const particles=[];
    const colors=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#e91e63','#00bcd4'];
    for(let i=0;i<120;i++){
        particles.push({
            x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,
            w:Math.random()*8+3,h:Math.random()*4+2,
            color:colors[Math.floor(Math.random()*colors.length)],
            vy:Math.random()*3+2,vx:(Math.random()-0.5)*2,
            rot:Math.random()*360,rv:(Math.random()-0.5)*8,
            life:1
        });
    }
    let frames=0;
    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let alive=false;
        particles.forEach(p=>{
            if(p.life<=0)return;alive=true;
            p.y+=p.vy;p.x+=p.vx;p.rot+=p.rv;p.life-=0.008;
            ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
            ctx.globalAlpha=Math.max(0,p.life);
            ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
            ctx.restore();
        });
        frames++;
        if(alive&&frames<180)requestAnimationFrame(draw);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    draw();
}

let prevTodayPct=0;
function checkConfetti(){
    const days=dim(cM,cY),hc=S.h.length;if(!hc)return;
    let cnt=0;
    S.h.forEach(h=>{if(S.c[ck(h.id,todayD)])cnt++});
    const pct=Math.round(cnt/hc*100);
    if(pct===100&&prevTodayPct<100&&cM===todayM&&cY===todayY)fireConfetti();
    prevTodayPct=pct;
}

/* EDIT HABIT */
let editId=null;
function openEditModal(id){
    const h=S.h.find(x=>x.id===id);if(!h)return;
    editId=id;
    const bg=$('#modalBg');
    $('#modalTitle').textContent=t('editHabit');
    $('#newName').value=h.name;
    sE=h.emoji;
    $$('#emojiRow span').forEach(s=>{s.classList.toggle('sel',s.dataset.e===sE)});
    const targetVal = h.target !== undefined ? h.target : dim(cM, cY);
    $('#newTarget').value = targetVal;
    bg.classList.add('show');
}

function initCal(){
    const ys=$('#yearSel');
    for(let y=2024;y<=2030;y++){const o=document.createElement('option');o.value=y;o.textContent=y;ys.appendChild(o)}
    ys.value=cY;ys.onchange=()=>{cY=+ys.value;renderAll()};
    $('#monthSel').onchange=()=>{cM=+$('#monthSel').value;renderAll()};
}
function initLang(){$$('.lang-btn').forEach(b=>{b.onclick=()=>{curLang=b.dataset.lang;localStorage.setItem('hg_lang',curLang);applyI18n();applyIme();renderAll()}})}
let vietnameseInput=null;
let curIme=localStorage.getItem('hg_ime')||'telex';
function initIme(){
    if(typeof GoTiengViet!=='undefined'&&GoTiengViet.VietnameseInput){
        vietnameseInput=GoTiengViet.VietnameseInput.getInstance({
            inputMethod:curIme==='off'?'telex':curIme,
            enabled:curLang==='vi'&&curIme!=='off'
        });
    }
    $$('.ime-btn').forEach(b=>{
        b.onclick=()=>{
            curIme=b.dataset.ime;
            localStorage.setItem('hg_ime',curIme);
            applyIme();
        }
    });
    applyIme();
}
function applyIme(){
    const s=$('#imeSwitch');
    if(s)s.style.display=curLang==='vi'?'flex':'none';
    $$('.ime-btn').forEach(b=>{b.classList.toggle('active',b.dataset.ime===curIme)});
    if(vietnameseInput){
        if(curLang==='vi'&&curIme!=='off'){
            vietnameseInput.setInputMethod(curIme);
            vietnameseInput.enable();
        }else{
            vietnameseInput.disable();
        }
    }
}
function initTheme(){applyTheme();const b=$('#themeBtn');if(b)b.onclick=toggleTheme}
function initExportImport(){
    const eb=$('#exportBtn'),ib=$('#importBtn'),f=$('#importFile');
    if(eb)eb.onclick=exportData;
    if(ib)ib.onclick=()=>f.click();
    if(f)f.onchange=e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value=''}
}

function renderStats(){
    const days=dim(cM,cY),hc=S.h.length,tot=hc*days;
    let dn=0;S.h.forEach(h=>{for(let d=1;d<=days;d++)if(S.c[ck(h.id,d)])dn++});
    const lt=tot-dn,pct=tot?Math.round(dn/tot*100):0;
    $('#sDone').textContent=dn;$('#sLeft').textContent=lt;$('#ringPct').textContent=pct+'%';
    $('#ringFg').style.strokeDashoffset=251-(251*pct/100);
}

function renderGrid(){
    const days=dim(cM,cY),DA=t('days');
    selectedDay = Math.min(selectedDay, days);

    const freezeClass = isColumnFrozen ? ' frozen-col' : '';
    const collapseClass = isColumnCollapsed ? ' collapsed-col' : '';

    const freezeIcon = isColumnFrozen ? '❄️' : '🔓';
    const freezeTitle = isColumnFrozen ? t('unfreezeCol') : t('freezeCol');
    const collapseIcon = isColumnCollapsed ? '▶' : '◀';
    const collapseTitle = isColumnCollapsed ? t('expandCol') : t('collapseCol');

    let hh=`<tr><th class="h-name${freezeClass}${collapseClass}">
        <div class="h-name-header">
            <span class="h-name-title">${t('myHabits')}</span>
            <div class="h-name-actions">
                <button type="button" class="btn-col-action btn-freeze-col" title="${freezeTitle}">${freezeIcon}</button>
                <button type="button" class="btn-col-action btn-collapse-col" title="${collapseTitle}">${collapseIcon}</button>
            </div>
        </div>
    </th>`;
    for(let d=1;d<=days;d++){
        const dow=new Date(cY,cM,d).getDay();
        const tc=isToday(d)?' today':'';
        const sc=d===selectedDay?' selected-day':'';
        hh+=`<th class="h-day${tc}${sc}" data-d="${d}"><span class="dn">${DA[dow]}</span><span class="dd">${d}</span></th>`;
    }
    hh+=`<th class="h-an">${t('target')}</th><th class="h-an">${t('actual')}</th><th class="h-an">${t('leftCol')}</th><th class="h-pg">${t('progress')}</th></tr>`;
    $('#thead').innerHTML=hh;

    let bb='';
    S.h.forEach(h=>{
        let dn=0;
        const streak=getStreak(h.id);
        let streakHtml='';
        if(streak>=7) streakHtml=`<span class="streak-badge hot">🔥${streak}</span>`;
        else if(streak>=3) streakHtml=`<span class="streak-badge warm">🔥${streak}</span>`;
        else if(streak>=2) streakHtml=`<span class="streak-badge cool">🔥${streak}</span>`;

        const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        bb+=`<tr draggable="true" data-id="${h.id}">`;
        bb+=`<td class="td-name${freezeClass}${collapseClass}" title="${esc(h.emoji+' '+h.name)}"><div class="td-name-content"><span class="drag-handle">☰</span><span class="hname">${esc(h.emoji)} <span class="hname-text">${esc(h.name)}</span></span>${streakHtml}<button class="he" data-id="${h.id}">✏️</button><button class="hd" data-id="${h.id}">✕</button></div></td>`;
        for(let d=1;d<=days;d++){
            const on=S.c[ck(h.id,d)];if(on)dn++;
            const tc=isToday(d)?' today':'';
            const dateStr = `${d}/${cM+1}/${cY}`;
            bb+=`<td class="td-chk${tc}" data-h="${h.id}" data-d="${d}" title="${esc(h.emoji)} ${esc(h.name)} (${dateStr})"><div class="cb${on?' on':''}"></div></td>`;
        }
        const targetVal = h.target !== undefined ? h.target : days;
        const lt = Math.max(0, targetVal - dn);
        const pct = targetVal ? Math.min(100, Math.round(dn / targetVal * 100)) : 0;
        const pgCls=pct<30?'low':pct<70?'mid':'high';
        bb+=`<td class="td-an">${targetVal}</td><td class="td-an">${dn}</td><td class="td-an">${lt}</td>`;
        bb+=`<td class="td-pg"><div class="pg-wrap"><div class="pg-bar"><div class="pg-fill ${pgCls}" style="width:${pct}%"></div></div><span class="pg-pct">${pct}%</span></div></td>`;
        bb+='</tr>';
    });
    $('#tbody').innerHTML=bb;

    // Freeze & Collapse column button handlers
    const freezeBtn = $('.btn-freeze-col');
    if(freezeBtn){
        freezeBtn.onclick = (e) => {
            e.stopPropagation();
            isColumnFrozen = !isColumnFrozen;
            localStorage.setItem('hg_col_frozen', isColumnFrozen);
            renderGrid();
        };
    }
    const collapseBtn = $('.btn-collapse-col');
    if(collapseBtn){
        collapseBtn.onclick = (e) => {
            e.stopPropagation();
            isColumnCollapsed = !isColumnCollapsed;
            localStorage.setItem('hg_col_collapsed', isColumnCollapsed);
            renderGrid();
        };
    }

    // Click handler for day headers
    $$('.htable th.h-day').forEach(th => {
        th.style.cursor = 'pointer';
        th.onclick = () => {
            selectedDay = parseInt(th.dataset.d);
            renderGrid();
            renderNotes();
        };
    });

    $$('.td-chk').forEach(td=>{
        td.onclick=()=>{
            const k=ck(td.dataset.h,td.dataset.d);S.c[k]=!S.c[k];sv();
            const cb=td.querySelector('.cb');
            if(cb){cb.classList.toggle('on',!!S.c[k]);cb.classList.remove('pop');void cb.offsetWidth;cb.classList.add('pop')}
            renderStats();renderBar();renderLine();renderT10();renderHeatmap();updateAutoMood();
            checkConfetti();
            // Update row stats in-place
            const tr=td.closest('tr');
            if(tr){
                const d2=dim(cM,cY),hId=+td.dataset.h;let dn2=0;
                for(let d=1;d<=d2;d++)if(S.c[ck(hId,d)])dn2++;
                const hVal=S.h.find(x=>x.id===hId);
                const targetVal2 = hVal && hVal.target !== undefined ? hVal.target : d2;
                const lt2=Math.max(0, targetVal2-dn2),p2=targetVal2?Math.min(100, Math.round(dn2/targetVal2*100)):0,pg2=p2<30?'low':p2<70?'mid':'high';
                const tds=tr.querySelectorAll('td.td-an');
                if(tds[1])tds[1].textContent=dn2;if(tds[2])tds[2].textContent=lt2;
                const fill=tr.querySelector('.pg-fill');if(fill){fill.style.width=p2+'%';fill.className='pg-fill '+pg2}
                const ps=tr.querySelector('.pg-pct');if(ps)ps.textContent=p2+'%';
                // Update streak badge
                const streak=getStreak(hId);
                const old=tr.querySelector('.streak-badge');if(old)old.remove();
                if(streak>=2){
                    const cls=streak>=7?'hot':streak>=3?'warm':'cool';
                    const badge=document.createElement('span');
                    badge.className='streak-badge '+cls;badge.textContent='🔥'+streak;
                    const nameCell=tr.querySelector('.td-name-content') || tr.querySelector('.td-name');
                    const editBtn=nameCell.querySelector('.he');
                    if(editBtn) nameCell.insertBefore(badge,editBtn);
                    else nameCell.appendChild(badge);
                }
            }
        };
    });
    $$('.hd').forEach(b=>{b.onclick=e=>{e.stopPropagation();if(confirm(t('deleteConfirm'))){S.h=S.h.filter(h=>h.id!==+b.dataset.id);sv();renderAll()}}});
    $$('.he').forEach(b=>{b.onclick=e=>{e.stopPropagation();openEditModal(+b.dataset.id)}});
}
let barAnimFrame = null;
function renderBar(){
    if(barAnimFrame) cancelAnimationFrame(barAnimFrame);
    const c=$('#barChart');
    if(!c) return;
    const ctx=c.getContext('2d');
    const r=c.parentElement.getBoundingClientRect();
    const W=r.width,H=Math.min(r.height,160);
    c.width=W*2;c.height=H*2;ctx.scale(2,2);
    const days=dim(cM,cY),hc=S.h.length||1,DA=t('days');
    const isDark=curTheme==='dark';
    const p={t:16,r:8,b:14,l:24},cW=W-p.l-p.r,cH=H-p.t-p.b;
    
    const targetHeights = [];
    for(let d=1;d<=days;d++){
        let cnt=0;
        S.h.forEach(h=>{if(S.c[ck(h.id,d)])cnt++});
        targetHeights.push((cnt/hc)*cH);
    }
    
    const currentHeights = new Array(days).fill(0);
    const speed = 0.12;
    
    function animate() {
        ctx.clearRect(0,0,W,H);
        
        // Y-axis Grid lines & Labels
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '500 7px Outfit';
        ctx.textAlign = 'right';
        [0, 50, 100].forEach(v => {
            const y = p.t + cH - (v/100)*cH;
            ctx.fillText(v+'%', p.l-4, y+2.5);
            ctx.strokeStyle = isDark ? '#26264d' : '#e2e8f0';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.l, y);
            ctx.lineTo(W-p.r, y);
            ctx.stroke();
        });
        
        // X-axis Day labels
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '600 6px Outfit';
        ctx.textAlign = 'center';
        const bw = Math.max(2, (cW/days)-1.5);
        for(let d=1;d<=days;d++){
            const dow=new Date(cY,cM,d).getDay();
            const x=p.l+((d-1)/days)*cW+bw/2;
            const lbl=DA[dow].length>2?DA[dow].substring(0,2):DA[dow];
            ctx.fillText(lbl,x,p.t-4);
        }
        
        let done = true;
        for(let d=1;d<=days;d++){
            const target = targetHeights[d-1];
            let current = currentHeights[d-1];
            const diff = target - current;
            if(Math.abs(diff) > 0.2) {
                current += diff * speed;
                done = false;
            } else {
                current = target;
            }
            currentHeights[d-1] = current;
            
            const x=p.l+((d-1)/days)*cW;
            
            // Draw background slot (gray/dark empty space)
            ctx.fillStyle = isToday(d) ? (isDark ? '#1a2e3b' : '#e0f2fe') : (isDark ? '#161630' : '#f1f5f9');
            ctx.fillRect(x, p.t, bw, cH);
            
            // Draw filled progress bar
            if(current > 0) {
                ctx.fillStyle = isToday(d) ? (isDark ? '#00f5a0' : '#10b981') : (isDark ? '#00f5a0' : '#10b981');
                ctx.fillRect(x, p.t+cH-current, bw, current);
            }
        }
        
        if(!done) {
            barAnimFrame = requestAnimationFrame(animate);
        }
    }
    animate();
}

function renderLine(){
    const c=$('#lineChart');
    if(!c) return;
    const ctx=c.getContext('2d');
    const r=c.parentElement.getBoundingClientRect();
    const W=r.width,H=r.height;

    c.width=W*2;c.height=H*2;ctx.scale(2,2);
    const days=dim(cM,cY),hc=S.h.length||1;
    const isDark=curTheme==='dark';
    const p={t:8,r:8,b:8,l:8},cW=W-p.l-p.r,cH=H-p.t-p.b;
    ctx.clearRect(0,0,W,H);
    const pts=[];
    for(let d=1;d<=days;d++){
        let cnt=0;
        S.h.forEach(h=>{if(S.c[ck(h.id,d)])cnt++});
        pts.push({
            x:p.l+((d-1)/(days-1||1))*cW,
            y:p.t+cH-(cnt/hc)*cH,
            d:d
        });
    }
    if(pts.length<2)return;
    
    // Gradient fill under the line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, p.t+cH);
    pts.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(pts[pts.length-1].x, p.t+cH);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, p.t, 0, p.t+cH);
    if(isDark) {
        grad.addColorStop(0, 'rgba(0, 245, 160, 0.25)');
        grad.addColorStop(1, 'rgba(0, 245, 160, 0.0)');
    } else {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    pts.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));
    ctx.strokeStyle = isDark ? '#00f5a0' : '#10b981';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Dots
    pts.forEach(pt=>{
        ctx.beginPath();
        ctx.arc(pt.x,pt.y,2.5,0,Math.PI*2);
        ctx.fillStyle = isToday(pt.d) ? (isDark ? '#ff4b72' : '#f43f5e') : (isDark ? '#00f5a0' : '#10b981');
        ctx.strokeStyle = isDark ? '#131326' : '#ffffff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    });
}

function renderT10(){
    const days=dim(cM,cY);
    const sc=S.h.map(h=>{let d=0;for(let i=1;i<=days;i++)if(S.c[ck(h.id,i)])d++;return{...h,done:d,pct:days?Math.round(d/days*100):0}}).sort((a,b)=>b.pct-a.pct).slice(0,10);
    const el=$('#t10Body');el.innerHTML='';
    const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    sc.forEach((h,i)=>{el.innerHTML+=`<div class="t10-item"><span class="t10-rank">${i+1}</span><span class="t10-name">${esc(h.name)}</span><span class="t10-emoji">${esc(h.emoji)}</span></div>`});
}

function initMood(){
    const key=`m-${cY}-${cM}-${new Date().getDate()}`;
    $$('.mopt').forEach(m=>{
        m.onclick=()=>{
            $$('.mopt').forEach(x=>x.classList.remove('active'));
            m.classList.add('active');
            S.mo[key]=m.dataset.v;
            S.mo[key+'_manual']=true;
            sv();
        };
        if(S.mo[key]===m.dataset.v)m.classList.add('active');
    });
}

function updateAutoMood(){
    // Only auto-update for today's month/year view
    if(cM!==todayM||cY!==todayY){
        const pctEl=$('#moodPct');if(pctEl)pctEl.textContent='';
        return;
    }
    const key=`m-${cY}-${cM}-${todayD}`;
    const hc=S.h.length;
    if(!hc)return;
    let cnt=0;
    S.h.forEach(h=>{if(S.c[ck(h.id,todayD)])cnt++});
    const pct=Math.round(cnt/hc*100);
    // Update percentage display
    const pctEl=$('#moodPct');
    if(pctEl){
        pctEl.textContent=`${cnt}/${hc} (${pct}%)`;
        pctEl.className='mood-pct'+(pct>=90?' mood-great':pct>=60?' mood-good':pct>=30?' mood-ok':' mood-low');
    }
    // If user manually selected mood today, don't override emoji
    if(S.mo[key+'_manual'])return;
    // Map percentage to mood value (7=best, 1=worst)
    let moodVal;
    if(pct>=90) moodVal='7';
    else if(pct>=75) moodVal='6';
    else if(pct>=60) moodVal='5';
    else if(pct>=45) moodVal='4';
    else if(pct>=30) moodVal='3';
    else if(pct>=15) moodVal='2';
    else moodVal='1';
    S.mo[key]=moodVal;
    sv();
    // Update UI
    $$('.mopt').forEach(m=>{
        m.classList.toggle('active',m.dataset.v===moodVal);
    });
}

function initSleep(){
    const inp=$('#sleepH');if(!inp)return;
    const key=`s-${cY}-${cM}-${new Date().getDate()}`;
    if(S.sl[key]!==undefined)inp.value=S.sl[key];
    inp.onchange=inp.oninput=()=>{S.sl[key]=+inp.value;sv()};
}

function initModal(){
    const bg=$('#modalBg');
    $('#btnAdd').onclick=()=>{
        if(!canAddHabit()){
            openUpgradeModal();
            return;
        }
        editId=null;
        $('#modalTitle').textContent=t('addNewHabit');
        $('#newName').value='';
        $$('#emojiRow span').forEach(x=>x.classList.remove('sel'));
        sE='💪';
        $('#newTarget').value = dim(cM, cY);
        bg.classList.add('show');
    };
    $('#mCancel').onclick=()=>bg.classList.remove('show');
    bg.onclick=e=>{if(e.target===bg)bg.classList.remove('show')};
    $$('#emojiRow span').forEach(s=>{s.onclick=()=>{$$('#emojiRow span').forEach(x=>x.classList.remove('sel'));s.classList.add('sel');sE=s.dataset.e}});
    $('#mSave').onclick=()=>{
        const n=$('#newName').value.trim();if(!n)return;
        const targetVal = parseInt($('#newTarget').value) || dim(cM, cY);
        if(editId!==null){
            const h=S.h.find(x=>x.id===editId);
            if(h){h.name=n;h.emoji=sE;h.target=targetVal}
            editId=null;
        } else {
            S.h.push({id:S.ni++,name:n,emoji:sE,target:targetVal});
        }
        sv();bg.classList.remove('show');$('#newName').value='';renderAll();
    };
}

function renderNotes() {
    const dateLabel = $('#notesDate');
    const textarea = $('#dailyNotesText');
    if (!dateLabel || !textarea) return;
    dateLabel.textContent = `${selectedDay.toString().padStart(2, '0')}/${(cM + 1).toString().padStart(2, '0')}/${cY}`;
    const key = `n-${cY}-${cM}-${selectedDay}`;
    textarea.value = S.notes[key] || '';
}

function initNotes() {
    const textarea = $('#dailyNotesText');
    if (!textarea) return;
    textarea.oninput = () => {
        const key = `n-${cY}-${cM}-${selectedDay}`;
        S.notes[key] = textarea.value;
        sv();
    };
}

function getLevel(pct) {
    if (pct === 0) return 0;
    if (pct <= 0.25) return 1;
    if (pct <= 0.5) return 2;
    if (pct <= 0.75) return 3;
    return 4;
}

function renderHeatmap() {
    const gridEl = $('#hmGrid');
    const monthsEl = $('#hmMonths');
    if (!gridEl || !monthsEl) return;

    const startDate = new Date(cY, 0, 1);
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    const endDate = new Date(cY, 11, 31);
    const endDay = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - endDay));

    const weeks = [];
    let currentWeek = [];
    let curr = new Date(startDate);
    while (curr <= endDate) {
        currentWeek.push(new Date(curr));
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        curr.setDate(curr.getDate() + 1);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    monthsEl.innerHTML = '';
    monthsEl.style.position = 'relative';
    monthsEl.style.height = '15px';
    const monthAdded = {};
    weeks.forEach((week, weekIdx) => {
        const firstDay = week.find(d => d.getDate() === 1 && d.getFullYear() === cY);
        if (firstDay) {
            const m = firstDay.getMonth();
            if (!monthAdded[m]) {
                monthAdded[m] = true;
                const mName = t('months')[m];
                const displaymName = curLang === 'en' ? mName.substring(0, 3) : mName;
                const span = document.createElement('span');
                span.style.position = 'absolute';
                span.style.left = `${weekIdx * 14}px`;
                span.textContent = displaymName;
                monthsEl.appendChild(span);
            }
        }
    });

    gridEl.innerHTML = '';
    const hc = S.h.length;
    weeks.forEach(week => {
        const weekCol = document.createElement('div');
        weekCol.className = 'hm-week';
        
        week.forEach(d => {
            const cell = document.createElement('div');
            cell.className = 'hm-cell';
            
            if (d.getFullYear() === cY) {
                let completed = 0;
                S.h.forEach(h => {
                    const key = `${cY}-${d.getMonth()}-${h.id}-${d.getDate()}`;
                    if (S.c[key]) completed++;
                });
                const pct = hc ? Math.round(completed / hc * 100) : 0;
                const level = hc ? getLevel(completed / hc) : 0;
                cell.dataset.level = level;
                
                const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${cY}`;
                const tooltip = document.createElement('span');
                tooltip.className = 'hm-tooltip';
                tooltip.textContent = `${dateStr}: ${completed}/${hc} (${pct}%)`;
                cell.appendChild(tooltip);
            } else {
                cell.style.opacity = '0';
                cell.style.pointerEvents = 'none';
            }
            weekCol.appendChild(cell);
        });
        gridEl.appendChild(weekCol);
    });
}

function initDragAndDrop() {
    const tbody = $('#tbody');
    let dragSrcEl = null;

    tbody.addEventListener('mousedown', (e) => {
        const tr = e.target.closest('tr');
        const isBtn = e.target.closest('.he, .hd, .btn-col-action');
        const tdName = e.target.closest('.td-name, .drag-handle');
        if (tr) {
            if (tdName && !isBtn) {
                tr.setAttribute('draggable', 'true');
            } else {
                tr.setAttribute('draggable', 'false');
            }
        }
    });

    tbody.addEventListener('dragstart', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        dragSrcEl = tr;
        tr.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tr.dataset.id);
    });

    tbody.addEventListener('dragover', (e) => {
        e.preventDefault();
        const tr = e.target.closest('tr');
        if (!tr || tr === dragSrcEl) return;
        
        $$('#tbody tr').forEach(row => row.classList.remove('drag-over'));
        tr.classList.add('drag-over');
    });

    tbody.addEventListener('dragleave', (e) => {
        const tr = e.target.closest('tr');
        if (tr) tr.classList.remove('drag-over');
    });

    tbody.addEventListener('dragend', () => {
        $$('#tbody tr').forEach(row => {
            row.classList.remove('dragging');
            row.classList.remove('drag-over');
        });
    });

    tbody.addEventListener('drop', (e) => {
        e.preventDefault();
        const tr = e.target.closest('tr');
        if (!tr || tr === dragSrcEl) return;

        const srcId = parseInt(dragSrcEl.dataset.id);
        const targetId = parseInt(tr.dataset.id);

        const srcIdx = S.h.findIndex(h => h.id === srcId);
        const targetIdx = S.h.findIndex(h => h.id === targetId);

        if (srcIdx !== -1 && targetIdx !== -1) {
            const [moved] = S.h.splice(srcIdx, 1);
            S.h.splice(targetIdx, 0, moved);
            sv();
            renderAll();
        }
    });
}

function initMobileTabs() {
    const mainApp = document.getElementById('mainApp');
    const navItems = document.querySelectorAll('.mobile-nav-bar .mobile-nav-item');
    
    if (!mainApp.getAttribute('data-active-tab')) {
        mainApp.setAttribute('data-active-tab', 'habits');
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            navItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            
            mainApp.setAttribute('data-active-tab', tabId);
            
            if (tabId === 'charts') {
                requestAnimationFrame(() => {
                    renderBar();
                    renderLine();
                });
            }
        });
    });
}

function renderAll(){
    applyTheme();
    applyI18n();
    renderStats();
    renderGrid();
    renderBar();
    renderLine();
    renderT10();
    renderNotes();
    renderHeatmap();
    updateAutoMood();
}

async function startApp(user){
    currentUser = user;
    userDocRef = db.collection('users').doc(user.uid);
    showUserProfile(user);
    // Ensure profile exists and is populated
    await ensureUserProfile(user);
    // Load user plan
    await loadUserPlan();
    // Check if disabled
    if(userPlan.disabled){
        document.getElementById('authLoading').style.display = 'none';
        document.getElementById('mainApp').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;color:#94a3b8;font-family:Outfit,sans-serif;"><span style="font-size:64px">🚫</span><h2 style="color:#ef4444">Tài khoản bị vô hiệu hóa</h2><p>Liên hệ admin để được hỗ trợ.</p><button onclick="firebase.auth().signOut().then(()=>location.href=\'auth.html\')" style="padding:8px 20px;border-radius:8px;border:1px solid #64748b;background:transparent;color:#f1f5f9;cursor:pointer;font-size:14px">Đăng xuất</button></div>';
        return;
    }
    // Try load from Firestore first, fallback to localStorage
    const loaded = await loadFromFirestore();
    if(!loaded){
        S = ld();
        // Migrate localStorage data to Firestore on first login
        if(S.h && S.h.length > 0){
            userDocRef.set({habitData:JSON.stringify(S)},{merge:true}).catch(e=>console.warn('Migration error:',e));
        }
    }
    try {
        const hc=S.h.length;
        if(hc){
            let cnt=0;
            S.h.forEach(h=>{if(S.c[ck(h.id,todayD)])cnt++});
            prevTodayPct=Math.round(cnt/hc*100);
        }
        selectedDay = (cM === todayM && cY === todayY) ? todayD : 1;
        initCal();
        initLang();
        initIme();
        initTheme();
        initExportImport();
        initModal();
        initMood();
        initSleep();
        initNotes();
        initDragAndDrop();
        initMobileTabs();
        renderAll();
        // Apply premium UI
        renderPremiumBanner();
        applyPremiumGate();
        initUniversalSpotlight();
        window.onresize=()=>{renderBar();renderLine()};
    } catch(err) {
        console.error('Init error:', err);
    }
}

// ==================== UNIVERSAL MOUSE SPOTLIGHT EFFECT ====================
function initUniversalSpotlight() {
    const selector = '.cal-card, .chart-card, .stats-card, .bot-left, .bot-right, .ms-cell, .notes-section, .heatmap-section, .price-card, .testimonial-card, .option-card, .user-profile, .btn-add, .nav-brand, .lang-btn, .ime-btn, .tab-btn, .step-box';
    
    document.querySelectorAll(selector).forEach(el => {
        if (el.dataset.spotlightInit) return;
        el.dataset.spotlightInit = 'true';

        let glow = el.querySelector('.spotlight-glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.className = 'spotlight-glow';
            el.appendChild(glow);
        }

        let bounds;
        el.addEventListener('mouseenter', () => {
            bounds = el.getBoundingClientRect();
            glow.style.opacity = '1';
        });

        el.addEventListener('mousemove', (e) => {
            if (!bounds) bounds = el.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            glow.style.setProperty('--mouse-x', `${x}px`);
            glow.style.setProperty('--mouse-y', `${y}px`);
        });

        el.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    });
}

function initAuthGuard(){
    const loading = document.getElementById('authLoading');
    const app = document.getElementById('mainApp');
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.onclick = () => { auth.signOut().then(()=>{ window.location.href='auth.html'; }); };
    auth.onAuthStateChanged(user => {
        if(user){
            if(loading) loading.style.display = 'none';
            if(app) app.style.display = 'block';
            startApp(user);
            setTimeout(initUniversalSpotlight, 200);
            setTimeout(initUniversalSpotlight, 1000);
        } else {
            window.location.href = 'auth.html';
        }
    });
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',initAuthGuard):initAuthGuard();
})();
