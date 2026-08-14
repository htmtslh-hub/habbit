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
        tabHabits:'Thói quen',tabCharts:'Biểu đồ',tabHeatmap:'Mật độ',tabNotes:'Ghi chú',tabTop10:'Top 10',tabLeaderboard:'BXH',tabQuests:'Nhiệm vụ',
        freezeCol:'Đóng băng cột (Ghim)',unfreezeCol:'Bỏ đóng băng cột',
        collapseCol:'Thu gọn cột',expandCol:'Mở rộng cột',
        lbTitle:'BẢNG XẾP HẠNG CỘNG ĐỒNG',weeklySprint:'Tuần Này',topStreak:'Chuỗi Dài Nhất',topPlayers:'Xếp Hạng Top 50',
        tabCommunity:'Cộng đồng',communityTitle:'CỘNG ĐỒNG RÈN LUYỆN',cmLatest:'Mới nhất',cmTips:'Kinh nghiệm',cmMotivation:'Động lực',rankTiers:'Các Cấp Bậc',
        editProfileTitle:'HỒ SƠ',displayNameLabel:'Tên hiển thị',displayNamePh:'Nhập tên hiển thị...',
        avatarUploadLabel:'Hình đại diện',uploadFromDevice:'Tải ảnh từ máy',randomAvatar:'Ảnh ngẫu nhiên',
        avatarUrlPh:'Hoặc dán URL ảnh (https://...)',selectFrameLabel:'Khung Viền Avatar theo Level',
        saveProfile:'Lưu thay đổi',yourName:'Tên của bạn',
        seasonBanner:'MÙA 1: ĐƯỜNG ĐUA KỶ LUẬT',seasonTimer:'Tự động làm mới hàng tuần',
        currentRank:'Cấp Hiện Tại',rankAchieved:'Đã Đạt',rankLocked:'Chưa Đạt',
        usingFrame:'Đang dùng',availableFrame:'Khả dụng',lockedFrame:'Cần Level',
        rankProgressTo:'Còn',rankProgressUp:'DP lên',rankMaxed:'Đã Đạt Cấp Tối Đa',
        questTitle:'NHIỆM VỤ RÈN LUYỆN',questDaily:'Hàng ngày',questWeekly:'Hàng tuần',questAchievement:'Thành tích',questSurprise:'Đột xuất',
        questClaimed:'Đã nhận',questClaim:'Nhận thưởng',questLocked:'Chưa hoàn thành',
        questProgress:'Tiến độ',questReward:'Thưởng',questResetDaily:'Reset hàng ngày',questResetWeekly:'Reset hàng tuần',questPermanent:'Vĩnh viễn',
        questCompletedToast:'🎉 Nhiệm vụ hoàn thành!',questClaimedToast:'✨ Đã nhận thưởng DP!',
        questReportDone:'📸 Báo hoàn thành',questPending:'Chờ duyệt',questApproved:'Đã duyệt',
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
        tabHabits:'习惯',tabCharts:'图表',tabHeatmap:'热力图',tabNotes:'笔记',tabTop10:'前十',tabLeaderboard:'排行榜',tabQuests:'任务',
        freezeCol:'冻结列',unfreezeCol:'解冻列',
        collapseCol:'折叠列',expandCol:'展开列',
        lbTitle:'社区排行榜',weeklySprint:'本周冲刺',topStreak:'最长连胜',topPlayers:'前50名',
        tabCommunity:'社区',communityTitle:'习惯社区',cmLatest:'最新',cmTips:'经验',cmMotivation:'动力',rankTiers:'等级',
        editProfileTitle:'个人资料',displayNameLabel:'显示名称',displayNamePh:'输入名称...',
        avatarUploadLabel:'头像',uploadFromDevice:'上传',randomAvatar:'随机',
        avatarUrlPh:'或粘贴URL',selectFrameLabel:'等级头像框',
        saveProfile:'保存',yourName:'你的名字',
        seasonBanner:'赛季1: 纪律竞赛',seasonTimer:'每周刷新',
        currentRank:'当前等级',rankAchieved:'已达成',rankLocked:'未达成',
        usingFrame:'使用中',availableFrame:'可用',lockedFrame:'需要等级',
        rankProgressTo:'还需',rankProgressUp:'DP升级',rankMaxed:'已达最高等级',
        questTitle:'训练任务',questDaily:'每日',questWeekly:'每周',questAchievement:'成就',questSurprise:'突发',
        questClaimed:'已领取',questClaim:'领取',questLocked:'未完成',
        questProgress:'进度',questReward:'奖励',questResetDaily:'每日重置',questResetWeekly:'每周重置',questPermanent:'永久',
        questCompletedToast:'🎉 任务完成！',questClaimedToast:'✨ 已领取DP！',
        questReportDone:'📸 报告完成',questPending:'待审核',questApproved:'已审核',
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
        tabHabits:'Habits',tabCharts:'Charts',tabHeatmap:'Heatmap',tabNotes:'Notes',tabTop10:'Top 10',tabLeaderboard:'Rank',tabQuests:'Quests',
        freezeCol:'Freeze column',unfreezeCol:'Unfreeze column',
        collapseCol:'Collapse column',expandCol:'Expand column',
        lbTitle:'COMMUNITY LEADERBOARD',weeklySprint:'Weekly Sprint',topStreak:'Top Streak',topPlayers:'Top 50',
        tabCommunity:'Community',communityTitle:'COMMUNITY FEED',cmLatest:'Latest',cmTips:'Tips',cmMotivation:'Motivation',rankTiers:'Rank Tiers',
        editProfileTitle:'PROFILE',displayNameLabel:'Display Name',displayNamePh:'Enter name...',
        avatarUploadLabel:'Avatar',uploadFromDevice:'Upload',randomAvatar:'Random',
        avatarUrlPh:'Or paste URL',selectFrameLabel:'Level Frames',
        saveProfile:'Save',yourName:'Your Name',
        seasonBanner:'SEASON 1: DISCIPLINE RACE',seasonTimer:'Auto-refresh weekly',
        currentRank:'Current Rank',rankAchieved:'Achieved',rankLocked:'Not Yet',
        usingFrame:'Equipped',availableFrame:'Available',lockedFrame:'Requires Lv',
        rankProgressTo:'Need',rankProgressUp:'DP to',rankMaxed:'Max Rank',
        questTitle:'TRAINING QUESTS',questDaily:'Daily',questWeekly:'Weekly',questAchievement:'Achievements',questSurprise:'Surprise',
        questClaimed:'Claimed',questClaim:'Claim',questLocked:'Incomplete',
        questProgress:'Progress',questReward:'Reward',questResetDaily:'Resets daily',questResetWeekly:'Resets weekly',questPermanent:'Permanent',
        questCompletedToast:'🎉 Quest completed!',questClaimedToast:'✨ DP claimed!',
        questReportDone:'📸 Report done',questPending:'Pending',questApproved:'Approved',
    }
};

let curLang=localStorage.getItem('hg_lang')||'vi';
function t(k){return(I18N[curLang]||I18N.en)[k]||(I18N.en[k])||k}

function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh)});
    const ms=document.querySelector('#monthSel');
    if(ms){ms.innerHTML='';t('months').forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=m;ms.appendChild(o)});ms.value=cM}
    const lBtn = document.querySelector('#langToggleBtn');
    if(lBtn) {
        const labels = { vi: '🌐 VI', zh: '🌐 中', en: '🌐 EN' };
        lBtn.textContent = labels[curLang] || '🌐 VI';
    }
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
    const navFrame = document.querySelector('#navAvatarFrame');
    const dp = S.dp || 0;
    const rank = getRankLevel(dp);
    const imgUrl = user.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(user.displayName||user.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';

    if(name) name.textContent = displayName;
    
    if(navFrame && window.getAvatarHTML) {
        navFrame.innerHTML = window.getAvatarHTML(rank.level, imgUrl, 40);
        navFrame.style.background = 'transparent';
        navFrame.style.border = 'none';
    } else if(avatar) {
        avatar.src = imgUrl;
        avatar.style.display = 'block';
    }
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
function escHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
function dim(m,y){return new Date(y,m+1,0).getDate()}
function ck(id,d){return`${cY}-${cM}-${id}-${d}`}

/* THEME */
let curTheme=localStorage.getItem('hg_theme')||'light';
function updateThemeAvatars() {
    if (typeof currentUser !== 'undefined' && currentUser) {
        const navFrame = document.querySelector('#navAvatarFrame');
        const dp = (typeof S !== 'undefined' && S.dp) ? S.dp : 0;
        const rank = typeof getRankLevel === 'function' ? getRankLevel(dp) : { level: 1 };
        const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
        if (navFrame && window.getAvatarHTML) {
            navFrame.innerHTML = window.getAvatarHTML(rank.level, imgUrl, 40);
        }
        const profileModal = document.getElementById('profileModalBg');
        if (profileModal && profileModal.classList.contains('show') && typeof window.updateProfileModalUI === 'function') {
            window.updateProfileModalUI();
        }
    }
}
function applyTheme(){document.documentElement.setAttribute('data-theme',curTheme);const b=$('#themeBtn');if(b)b.textContent=curTheme==='dark'?'☀️':'🌙';updateThemeAvatars();}
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
function initLang(){
    const btn = $('#langToggleBtn');
    if(btn){
        btn.onclick = () => {
            const nextLang = { vi: 'zh', zh: 'en', en: 'vi' };
            curLang = nextLang[curLang] || 'vi';
            localStorage.setItem('hg_lang', curLang);
            applyI18n();
            renderAll();
        };
    }
}
let vietnameseInput=null;
let curIme='telex';
function initIme(){
    if(typeof GoTiengViet!=='undefined'&&GoTiengViet.VietnameseInput){
        vietnameseInput=GoTiengViet.VietnameseInput.getInstance({
            inputMethod:'telex',
            enabled:true
        });
        vietnameseInput.enable();
    }
}
function applyIme(){
    if(vietnameseInput){
        vietnameseInput.setInputMethod('telex');
        vietnameseInput.enable();
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
            if(typeof syncUserLeaderboard==='function') syncUserLeaderboard();
            if(typeof renderQuestPanel==='function') renderQuestPanel();
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
            
            if (tabId === 'leaderboard') { if(typeof openLeaderboardModal==='function') openLeaderboardModal(); return; }
            if (tabId === 'quests') { if(typeof openQuestModal==='function') openQuestModal(); return; }

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
        initLeaderboard();
        initQuestSystem();
        renderAll();
        syncUserLeaderboard();
        // Apply premium UI
        renderPremiumBanner();
        applyPremiumGate();
        initUniversalSpotlight();
        window.onresize=()=>{renderBar();renderLine()};
    } catch(err) {
        console.error('Init error:', err);
    }
}

// ==================== RANK TIERS & SCORING ====================
const RANK_TIERS = [
    { level:1, name:'Tân Binh', nameEn:'Recruit', nameZh:'新兵', icon:'🌱', minDp:0, maxDp:1500, color:'#94a3b8' },
    { level:2, name:'Chiến Binh', nameEn:'Warrior', nameZh:'战士', icon:'⚔️', minDp:1501, maxDp:4500, color:'#22c55e' },
    { level:3, name:'Dũng Sĩ', nameEn:'Champion', nameZh:'勇士', icon:'🛡️', minDp:4501, maxDp:9000, color:'#3b82f6' },
    { level:4, name:'Kiếm Sĩ', nameEn:'Swordsman', nameZh:'剑士', icon:'⚡', minDp:9001, maxDp:15000, color:'#a855f7' },
    { level:5, name:'Cao Thủ', nameEn:'Expert', nameZh:'高手', icon:'🔥', minDp:15001, maxDp:24000, color:'#f97316' },
    { level:6, name:'Đại Sư', nameEn:'Grand Master', nameZh:'大师', icon:'💎', minDp:24001, maxDp:36000, color:'#06b6d4' },
    { level:7, name:'Chiến Thần', nameEn:'War God', nameZh:'战神', icon:'🌟', minDp:36001, maxDp:54000, color:'#eab308' },
    { level:8, name:'Bất Tử', nameEn:'Immortal', nameZh:'不朽', icon:'👑', minDp:54001, maxDp:75000, color:'#ec4899' },
    { level:9, name:'Huyền Thoại', nameEn:'Legend', nameZh:'传说', icon:'🏆', minDp:75001, maxDp:105000, color:'#ef4444' },
    { level:10, name:'Thần Thoại', nameEn:'Mythic', nameZh:'神话', icon:'✨', minDp:105001, maxDp:Infinity, color:'#fbbf24' },
];

function getRankTierName(tier) {
    if (!tier) return '';
    return curLang === 'en' ? tier.nameEn : (curLang === 'zh' ? tier.nameZh : tier.name);
}

function getRankLevel(dp) {
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
        if (dp >= RANK_TIERS[i].minDp) return RANK_TIERS[i];
    }
    return RANK_TIERS[0];
}

function getRankProgressInfo(dp) {
    const currentTier = getRankLevel(dp);
    const nextIdx = RANK_TIERS.indexOf(currentTier) + 1;
    const nextTier = RANK_TIERS[nextIdx] || null;

    if (!nextTier) {
        return { pct: 100, currentName: getRankTierName(currentTier), nextName: 'Max', dpToNext: 0, tier: currentTier };
    }
    const range = nextTier.minDp - currentTier.minDp;
    const gained = dp - currentTier.minDp;
    const pct = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
    return { pct, currentName: getRankTierName(currentTier), nextName: getRankTierName(nextTier), dpToNext: nextTier.minDp - dp, tier: currentTier };
}

// ==================== SCORING ENGINE ====================
function calculateUserDPAndStreak(sData = S) {
    let totalChecks = 0;
    let weeklyChecks = 0;
    let perfectDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    if (!sData) return { totalDP: 0, weeklyDP: 0, totalChecks: 0, weeklyChecks: 0, currentStreak: 0, maxStreak: 0, perfectDays: 0, questDP: 0 };

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    const thisDay = now.getDate();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    if (weekStart > now) weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    // Parse all checks
    const dailyStats = {}; // 'YYYY-MM-DD' -> { checked, total }
    const habitsList = Array.isArray(sData.h) ? sData.h : [];
    const checkMap = sData.c || {};
    const checkKeys = Object.keys(checkMap).filter(k => checkMap[k]);

    checkKeys.forEach(k => {
        const parts = k.includes('_') ? k.split('_') : k.split('-');
        if (parts.length < 4) return;
        const [yr, mo, hId, dy] = parts.map(Number);
        if (isNaN(yr) || isNaN(mo) || isNaN(dy)) return;

        totalChecks++;
        const dateKey = `${yr}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}`;
        if (!dailyStats[dateKey]) dailyStats[dateKey] = { checked: 0, total: habitsList.length || 1 };
        dailyStats[dateKey].checked++;

        // Weekly check
        const checkDate = new Date(yr, mo, dy);
        if (checkDate >= weekStart && checkDate <= now) weeklyChecks++;
    });

    // Perfect days & streak
    const sortedDays = Object.keys(dailyStats).sort();
    let prevDate = null;
    sortedDays.forEach(dk => {
        const stats = dailyStats[dk];
        if (stats.total > 0 && stats.checked >= stats.total) perfectDays++;
        if (stats.checked > 0) {
            if (prevDate) {
                const prev = new Date(prevDate);
                const curr = new Date(dk);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                currentStreak = diff === 1 ? currentStreak + 1 : 1;
            } else {
                currentStreak = 1;
            }
            maxStreak = Math.max(maxStreak, currentStreak);
            prevDate = dk;
        }
    });

    // Check if streak is still active (last check within 1 day)
    if (prevDate) {
        const lastDay = new Date(prevDate);
        const diff = Math.floor((now - lastDay) / (1000 * 60 * 60 * 24));
        if (diff > 1) currentStreak = 0;
    }

    // Calculate DP
    let totalDP = totalChecks * 10; // Base: 10 DP per check
    totalDP += perfectDays * 30; // Perfect day bonus
    // Streak bonuses
    if (maxStreak >= 7) totalDP += 50;
    if (maxStreak >= 30) totalDP += 500;
    if (maxStreak >= 100) totalDP += 2000;
    // Quest DP
    const questDP = (sData.questData && sData.questData.totalDP) || 0;
    totalDP += questDP;

    // Weekly DP for leaderboard
    let weeklyDP = weeklyChecks * 10;

    return { totalDP, weeklyDP, totalChecks, weeklyChecks, currentStreak, maxStreak, perfectDays, questDP };
}

// ==================== LEADERBOARD ====================
let leaderboardCache = [];
let kudosSet = new Set(JSON.parse(localStorage.getItem('hg_kudos') || '[]'));

async function syncUserLeaderboard() {
    if (!currentUser || !db) return;
    try {
        const stats = calculateUserDPAndStreak();
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const isAdmin = userData.role === 'admin';

        // Admin override: max rank
        const finalDP = isAdmin ? 999999 : stats.totalDP;
        const finalWeekly = isAdmin ? 99999 : stats.weeklyDP;

        const displayName = userData.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        const photoURL = userData.photoURL || currentUser.photoURL || '';

        await db.collection('leaderboard').doc(currentUser.uid).set({
            uid: currentUser.uid,
            displayName: displayName,
            photoURL: photoURL,
            totalDP: finalDP,
            weeklyDP: finalWeekly,
            streak: stats.currentStreak,
            maxStreak: stats.maxStreak,
            totalChecks: stats.totalChecks,
            perfectDays: stats.perfectDays,
            isAdmin: isAdmin || false,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (e) {
        console.warn('Leaderboard sync error:', e);
    }
}

async function loadLeaderboard() {
    if (!db) return [];
    try {
        // Sync current logged in user first
        if (currentUser) {
            await syncUserLeaderboard();
        }

        // Fetch users from users collection and sync any missing or out-of-date users
        const usersSnap = await db.collection('users').get();
        const lbSnap = await db.collection('leaderboard').get();
        const lbMap = {};
        lbSnap.forEach(doc => { lbMap[doc.id] = doc.data(); });

        const syncPromises = [];

        usersSnap.forEach(userDoc => {
            const uid = userDoc.id;
            const uData = userDoc.data() || {};

            if (currentUser && uid === currentUser.uid) return;

            let userDP = 0;
            let userWeekly = 0;
            let userStreak = 0;
            let maxStreak = 0;
            let totalChecks = 0;
            let perfectDays = 0;

            if (uData.habitData) {
                try {
                    const parsed = typeof uData.habitData === 'string' ? JSON.parse(uData.habitData) : uData.habitData;
                    const computed = calculateUserDPAndStreak(parsed);
                    userDP = computed.totalDP;
                    userWeekly = computed.weeklyDP;
                    userStreak = computed.currentStreak;
                    maxStreak = computed.maxStreak;
                    totalChecks = computed.totalChecks;
                    perfectDays = computed.perfectDays;
                } catch (err) {}
            }

            const existingLb = lbMap[uid];
            const isAdmin = uData.role === 'admin';
            
            const displayName = uData.displayName || (existingLb && existingLb.displayName) || uData.email?.split('@')[0] || 'User';
            const photoURL = uData.photoURL || (existingLb && existingLb.photoURL) || '';
            const finalDP = isAdmin ? 999999 : Math.max(existingLb?.totalDP || 0, userDP);
            const finalWeekly = isAdmin ? 99999 : Math.max(existingLb?.weeklyDP || 0, userWeekly);
            const finalStreak = Math.max(existingLb?.streak || 0, userStreak);
            const finalMaxStreak = Math.max(existingLb?.maxStreak || 0, maxStreak);

            if (!existingLb || existingLb.displayName !== displayName || existingLb.photoURL !== photoURL || existingLb.totalDP !== finalDP || existingLb.streak !== finalStreak) {
                syncPromises.push(
                    db.collection('leaderboard').doc(uid).set({
                        uid: uid,
                        displayName: displayName,
                        photoURL: photoURL,
                        totalDP: finalDP,
                        weeklyDP: finalWeekly,
                        streak: finalStreak,
                        maxStreak: finalMaxStreak,
                        totalChecks: totalChecks || existingLb?.totalChecks || 0,
                        perfectDays: perfectDays || existingLb?.perfectDays || 0,
                        isAdmin: isAdmin || false,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true })
                );
            }
        });

        if (syncPromises.length > 0) {
            await Promise.all(syncPromises);
        }

        const snap = await db.collection('leaderboard').orderBy('totalDP', 'desc').limit(50).get();
        leaderboardCache = [];
        snap.forEach(doc => leaderboardCache.push({ uid: doc.id, ...doc.data() }));
        return leaderboardCache;
    } catch (e) {
        console.warn('Load leaderboard error:', e);
        return [];
    }
}

function renderLeaderboard() {
    const container = document.getElementById('lbFeedContainer');
    if (!container) return;
    
    const myStats = calculateUserDPAndStreak();
    const progInfo = getRankProgressInfo(myStats.totalDP);

    // Make sure local current user stats reflect in leaderboardCache
    if (currentUser && leaderboardCache.length > 0) {
        const meIndex = leaderboardCache.findIndex(e => e.uid === currentUser.uid);
        if (meIndex !== -1) {
            const isAdmin = userPlan && userPlan.role === 'admin';
            if (!isAdmin) {
                leaderboardCache[meIndex].totalDP = myStats.totalDP;
                leaderboardCache[meIndex].weeklyDP = myStats.weeklyDP;
                leaderboardCache[meIndex].streak = myStats.currentStreak;
            }
            if (currentUser.displayName) leaderboardCache[meIndex].displayName = currentUser.displayName;
            if (currentUser.photoURL) leaderboardCache[meIndex].photoURL = currentUser.photoURL;
        }
        leaderboardCache.sort((a, b) => (b.totalDP || 0) - (a.totalDP || 0));
    }

    // Summary
    const summary = document.getElementById('lbSummary');
    if (summary) {
        summary.innerHTML = `
            <div class="lb-stat-card">
                <div class="lb-stat-value">${progInfo.currentName}</div>
                <div class="lb-stat-label">${t('currentRank')}</div>
            </div>
            <div class="lb-stat-card">
                <div class="lb-stat-value">${myStats.totalDP.toLocaleString()}</div>
                <div class="lb-stat-label">Total DP</div>
            </div>
            <div class="lb-stat-card">
                <div class="lb-stat-value">${myStats.currentStreak}</div>
                <div class="lb-stat-label">${t('topStreak')}</div>
            </div>
            <div class="lb-rank-progress">
                <div class="lb-rank-bar"><div class="lb-rank-fill" style="width:${progInfo.pct}%;background:${progInfo.tier.color}"></div></div>
                <span class="lb-rank-text">${progInfo.dpToNext > 0 ? `${t('rankProgressTo')} ${progInfo.dpToNext} ${t('rankProgressUp')} ${progInfo.nextName}` : t('rankMaxed')}</span>
            </div>`;
    }

    // Feed
    if (leaderboardCache.length === 0) {
        container.innerHTML = '<div class="lb-empty">Chưa có dữ liệu BXH</div>';
        return;
    }

    container.innerHTML = leaderboardCache.map((entry, i) => {
        const rank = i + 1;
        const tier = getRankLevel(entry.totalDP);
        const isMe = entry.uid === currentUser?.uid;
        const medal = `#${rank}`;
        const hasKudos = kudosSet.has(entry.uid);
        const adminBadge = entry.isAdmin ? ' [Admin]' : '';

        return `<div class="lb-card ${isMe ? 'lb-me' : ''}" style="--rank-color:${tier.color}">
            <div class="lb-rank-num">${medal}</div>
            <img class="lb-avatar" src="${entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.displayName || 'U')}&background=0d1117&color=10b981&bold=true`}" alt="" onerror="this.src='https://ui-avatars.com/api/?name=U&background=0d1117&color=10b981'">
            <div class="lb-info">
                <div class="lb-name">${escHtml(entry.displayName || 'User')}${adminBadge}</div>
                <div class="lb-tier">${getRankTierName(tier)} · ${entry.totalDP?.toLocaleString() || 0} DP</div>
            </div>
            <div class="lb-stats">
                <span class="lb-streak">Streak: ${entry.streak || 0}</span>
                ${!isMe ? `<button class="lb-kudos-btn ${hasKudos ? 'given' : ''}" onclick="window._giveKudos('${entry.uid}')" ${hasKudos ? 'disabled' : ''}>Kudos</button>` : ''}
            </div>
        </div>`;
    }).join('');
}

window._giveKudos = (uid) => {
    kudosSet.add(uid);
    localStorage.setItem('hg_kudos', JSON.stringify([...kudosSet]));
    renderLeaderboard();
};

async function openLeaderboardModal(defaultTab = 'leaderboard') {
    const modal = document.getElementById('lbModalBg');
    if (!modal) return;
    modal.classList.add('show');

    // Switch tab
    document.querySelectorAll('.lb-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === defaultTab);
    });
    document.querySelectorAll('.lb-tab-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`lbPanel${defaultTab.charAt(0).toUpperCase() + defaultTab.slice(1)}`);
    if (panel) panel.style.display = 'block';

    await loadLeaderboard();
    if (defaultTab === 'leaderboard') renderLeaderboard();
    if (defaultTab === 'community') renderCommunity();
    if (defaultTab === 'ranks') renderRankTiersShowcase();
}

function closeLeaderboardModal() {
    const modal = document.getElementById('lbModalBg');
    if (modal) modal.classList.remove('show');
}

function initLeaderboard() {
    const closeBtn = document.getElementById('lbCloseBtn');
    if (closeBtn) closeBtn.onclick = closeLeaderboardModal;

    const bg = document.getElementById('lbModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) closeLeaderboardModal(); };

    const lbBtn = document.getElementById('leaderboardBtn');
    if (lbBtn) lbBtn.onclick = () => openLeaderboardModal('leaderboard');

    const cmBtn = document.getElementById('communityBtn');
    if (cmBtn) cmBtn.onclick = () => openLeaderboardModal('community');

    const mobileCmBtn = document.getElementById('mobileCommunityBtn');
    if (mobileCmBtn) mobileCmBtn.onclick = () => openLeaderboardModal('community');

    // Tab switching
    document.querySelectorAll('.lb-tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.lb-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.querySelectorAll('.lb-tab-panel').forEach(p => p.style.display = 'none');
            const panel = document.getElementById(`lbPanel${tab.charAt(0).toUpperCase()+tab.slice(1)}`);
            if (panel) panel.style.display = 'block';
            if (tab === 'leaderboard') renderLeaderboard();
            if (tab === 'community') renderCommunity();
            if (tab === 'ranks') renderRankTiersShowcase();
        };
    });
}

// ==================== COMMUNITY ====================
async function renderCommunity() {
    const container = document.getElementById('communityFeedContainer');
    if (!container) return;
    try {
        const snap = await db.collection('community_posts').orderBy('createdAt', 'desc').limit(20).get();
        if (snap.empty) {
            container.innerHTML = '<div class="lb-empty">Chưa có bài viết nào</div>';
            return;
        }
        let html = '';
        snap.forEach(doc => {
            const p = doc.data();
            const date = p.createdAt ? new Date(p.createdAt.toDate()).toLocaleDateString('vi-VN') : '';
            html += `<div class="cm-post">
                <div class="cm-post-header">
                    <img class="cm-avatar" src="${p.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.displayName || 'U')}&background=0d1117&color=10b981`}" alt="">
                    <div><strong>${escHtml(p.displayName || 'User')}</strong><span class="cm-date">${date}</span></div>
                </div>
                <div class="cm-post-body">${escHtml(p.content || '')}</div>
                <div class="cm-post-actions">
                    <button class="cm-like-btn" onclick="window._likeCmPost('${doc.id}')">Thích ${p.likes || 0}</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<div class="lb-empty">Lỗi tải cộng đồng</div>';
    }
}

window._likeCmPost = async (postId) => {
    try {
        await db.collection('community_posts').doc(postId).update({
            likes: firebase.firestore.FieldValue.increment(1)
        });
        renderCommunity();
    } catch (e) { console.warn('Like error:', e); }
};

window._submitCmPost = async () => {
    const input = document.getElementById('cmPostInput');
    if (!input || !input.value.trim()) return;
    try {
        await db.collection('community_posts').add({
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || '',
            content: input.value.trim(),
            likes: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        input.value = '';
        renderCommunity();
    } catch (e) { alert('Lỗi đăng bài: ' + e.message); }
};

// ==================== RANK TIERS SHOWCASE ====================
function renderRankTiersShowcase() {
    const container = document.getElementById('rankTiersContainer');
    if (!container) return;
    const myDP = calculateUserDPAndStreak().totalDP;
    const imgUrl = currentUser?.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser?.displayName||currentUser?.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;

    let html = '<div class="rank-showcase-grid" style="display:flex; flex-direction:column; gap:16px; align-items:center;">';
    
    RANK_TIERS.forEach((tier, idx) => {
        const level = idx + 1;
        const achieved = myDP >= tier.minDp;
        const cardHtml = window.getFullRankCardHTML ? window.getFullRankCardHTML(level, imgUrl, 0.65) : '';
        const dpText = `${tier.minDp.toLocaleString()} DP${tier.maxDp !== Infinity ? ` – ${tier.maxDp.toLocaleString()} DP` : '+'}`;
        
        html += `<div class="rank-card-wrapper ${achieved ? 'achieved' : 'locked'}">
            ${cardHtml}
            <div class="rank-card-requirement">
                Yêu cầu: <span style="color:${tier.color}">${dpText}</span> · ${achieved ? '<span style="color:#10b981">Đã đạt</span>' : '<span style="color:#ef4444">Chưa đạt</span>'}
            </div>
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ==================== QUEST SYSTEM ====================
const QUEST_DEFINITIONS = [
    // Daily
    { id:'d_earlybird', type:'daily', icon:'🌅', name:'Chim Sớm', nameEn:'Early Bird', nameZh:'早起鸟', desc:'Check thói quen trước 7h sáng', dp:20,
      check: (ctx) => ctx.firstCheckHour !== null && ctx.firstCheckHour < 7 },
    { id:'d_morning_gold', type:'daily', icon:'⚡', name:'Buổi Sáng Vàng', nameEn:'Golden Morning', nameZh:'黄金早晨', desc:'Hoàn thành ≥3 thói quen trước 9h', dp:40,
      check: (ctx) => ctx.checksBeforeHour9 >= 3 },
    { id:'d_perfect', type:'daily', icon:'🏆', name:'Ngày Không Lùi Bước', nameEn:'No Retreat', nameZh:'不退缩', desc:'100% thói quen hôm nay', dp:50,
      check: (ctx) => ctx.todayPct === 100 && ctx.totalHabits > 0 },
    { id:'d_reflect', type:'daily', icon:'📝', name:'Suy Ngẫm', nameEn:'Reflect', nameZh:'反思', desc:'Viết ghi chú ≥50 chữ', dp:15,
      check: (ctx) => ctx.todayNoteLen >= 50 },
    // Weekly
    { id:'w_weekend', type:'weekly', icon:'🔥', name:'Chiến Binh Cuối Tuần', nameEn:'Weekend Warrior', nameZh:'周末战士', desc:'100% cả T7 và CN', dp:120,
      check: (ctx) => ctx.satPct === 100 && ctx.sunPct === 100 },
    { id:'w_new_habit', type:'weekly', icon:'🧊', name:'Thử Thách Mới', nameEn:'New Challenge', nameZh:'新挑战', desc:'Thêm 1 thói quen mới, hoàn thành ≥3 ngày', dp:100,
      check: (ctx) => ctx.newHabitDays >= 3 },
    { id:'w_steel', type:'weekly', icon:'🎯', name:'Tuần Thép', nameEn:'Steel Week', nameZh:'钢铁周', desc:'Check-in 7/7 ngày', dp:100,
      check: (ctx) => ctx.daysWithChecks >= 7 },
    { id:'w_no_quit', type:'weekly', icon:'🌙', name:'Quy Tắc Không Bỏ Cuộc', nameEn:'No Quit Rule', nameZh:'不放弃', desc:'Duy trì thói quen "Không" 7 ngày', dp:80,
      check: (ctx) => ctx.noHabitStreak >= 7 },
    // Community Weekly
    { id:'w_share', type:'weekly', icon:'📢', name:'Chia Sẻ Hành Trình', nameEn:'Share Journey', nameZh:'分享旅程', desc:'Đăng 1 bài cộng đồng', dp:60,
      check: (ctx) => ctx.weeklyPosts >= 1 },
    { id:'w_kudos', type:'weekly', icon:'👏', name:'Người Truyền Lửa', nameEn:'Fire Starter', nameZh:'传火者', desc:'Tặng Kudos ≥5 người', dp:40,
      check: (ctx) => kudosSet.size >= 5 },
    { id:'w_mentor', type:'weekly', icon:'💡', name:'Mentor', nameEn:'Mentor', nameZh:'导师', desc:'Bình luận ≥3 bài viết', dp:50,
      check: (ctx) => ctx.weeklyComments >= 3 },
    { id:'w_inspire', type:'weekly', icon:'⭐', name:'Người Truyền Cảm Hứng', nameEn:'Inspirator', nameZh:'激励者', desc:'Bài viết nhận ≥5 likes', dp:80,
      check: (ctx) => ctx.maxPostLikes >= 5 },
    // Achievement (permanent)
    { id:'a_first_day', type:'achievement', icon:'🎉', name:'Ngày Đầu Tiên', nameEn:'First Day', nameZh:'第一天', desc:'100% lần đầu tiên', dp:50,
      check: (ctx) => ctx.perfectDays >= 1 },
    { id:'a_streak30', type:'achievement', icon:'🔥', name:'Lửa Không Tắt', nameEn:'Eternal Flame', nameZh:'永恒之火', desc:'Chuỗi 30 ngày', dp:500,
      check: (ctx) => ctx.maxStreak >= 30 },
    { id:'a_streak100', type:'achievement', icon:'💎', name:'Kim Cương', nameEn:'Diamond', nameZh:'钻石', desc:'Chuỗi 100 ngày', dp:2000,
      check: (ctx) => ctx.maxStreak >= 100 },
    { id:'a_1000checks', type:'achievement', icon:'🏆', name:'Huyền Thoại', nameEn:'Legend', nameZh:'传说', desc:'1000 lần check', dp:1000,
      check: (ctx) => ctx.totalChecks >= 1000 },
    { id:'a_multi', type:'achievement', icon:'🌈', name:'Chiến Binh Đa Năng', nameEn:'Versatile', nameZh:'多才多艺', desc:'≥5 thói quen 1 tuần', dp:100,
      check: (ctx) => ctx.totalHabits >= 5 },
    { id:'a_month', type:'achievement', icon:'📅', name:'Tháng Thép', nameEn:'Steel Month', nameZh:'钢铁月', desc:'≥80% cả tháng', dp:300,
      check: (ctx) => ctx.monthPct >= 80 },
    { id:'a_comm10', type:'achievement', icon:'💬', name:'Linh Hồn Cộng Đồng', nameEn:'Community Soul', nameZh:'社区灵魂', desc:'10 bài viết', dp:200,
      check: (ctx) => ctx.totalPosts >= 10 },
    { id:'a_kudos50', type:'achievement', icon:'🤝', name:'Đồng Đội Tuyệt Vời', nameEn:'Great Teammate', nameZh:'好队友', desc:'50 Kudos cho người khác', dp:150,
      check: (ctx) => kudosSet.size >= 50 },
];

function initQuestData() {
    if (!S.questData) S.questData = { claimed: {}, totalDP: 0, lastDailyReset: '', lastWeeklyReset: '' };
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const weekKey = monday.toISOString().slice(0, 10);

    // Auto-reset daily
    if (S.questData.lastDailyReset !== today) {
        QUEST_DEFINITIONS.filter(q => q.type === 'daily').forEach(q => { delete S.questData.claimed[q.id]; });
        S.questData.lastDailyReset = today;
    }
    // Auto-reset weekly
    if (S.questData.lastWeeklyReset !== weekKey) {
        QUEST_DEFINITIONS.filter(q => q.type === 'weekly').forEach(q => { delete S.questData.claimed[q.id]; });
        S.questData.lastWeeklyReset = weekKey;
    }
    sv();
}

function getQuestContext() {
    const stats = calculateUserDPAndStreak();
    const now = new Date();
    const todayKey = `${cY}-${cM}-`;

    // Today pct
    let todayChecked = 0;
    S.h.forEach(h => { if (S.c[ck(h.id, todayD)]) todayChecked++; });
    const todayPct = S.h.length > 0 ? Math.round(todayChecked / S.h.length * 100) : 0;

    // Today note length
    const noteKey = `${cY}-${cM}-${todayD}`;
    const todayNoteLen = (S.notes && S.notes[noteKey]) ? S.notes[noteKey].length : 0;

    // Time-based checks (approximation — we don't store time of each check, so we check current time)
    const currentHour = now.getHours();
    const firstCheckHour = todayChecked > 0 ? currentHour : null; // simplified
    const checksBeforeHour9 = currentHour < 9 ? todayChecked : 0;

    // Weekend pct
    const thisWeekSat = new Date(now); thisWeekSat.setDate(now.getDate() - now.getDay() + 6);
    const thisWeekSun = new Date(now); thisWeekSun.setDate(now.getDate() - now.getDay());
    const satDay = thisWeekSat.getDate(), sunDay = thisWeekSun.getDate();
    const satMonth = thisWeekSat.getMonth(), sunMonth = thisWeekSun.getMonth();
    let satChecked = 0, sunChecked = 0;
    S.h.forEach(h => {
        if (S.c[`${thisWeekSat.getFullYear()}-${satMonth}-${h.id}-${satDay}`]) satChecked++;
        if (S.c[`${thisWeekSun.getFullYear()}-${sunMonth}-${h.id}-${sunDay}`]) sunChecked++;
    });
    const satPct = S.h.length > 0 ? Math.round(satChecked / S.h.length * 100) : 0;
    const sunPct = S.h.length > 0 ? Math.round(sunChecked / S.h.length * 100) : 0;

    // Days with checks this week
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    let daysWithChecks = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        if (d > now) break;
        const dayNum = d.getDate();
        const dayMonth = d.getMonth();
        const dayYear = d.getFullYear();
        let hasCheck = false;
        S.h.forEach(h => {
            if (S.c[`${dayYear}-${dayMonth}-${h.id}-${dayNum}`]) hasCheck = true;
        });
        if (hasCheck) daysWithChecks++;
    }

    // Month pct
    const daysInMonth = dim(cM, cY);
    let monthTotal = 0, monthChecked = 0;
    for (let d = 1; d <= Math.min(todayD, daysInMonth); d++) {
        S.h.forEach(h => {
            monthTotal++;
            if (S.c[ck(h.id, d)]) monthChecked++;
        });
    }
    const monthPct = monthTotal > 0 ? Math.round(monthChecked / monthTotal * 100) : 0;

    return {
        ...stats,
        todayPct, todayChecked, todayNoteLen,
        firstCheckHour, checksBeforeHour9,
        satPct, sunPct, daysWithChecks,
        monthPct,
        totalHabits: S.h.length,
        newHabitDays: 0, noHabitStreak: 0,
        weeklyPosts: 0, weeklyComments: 0, maxPostLikes: 0, totalPosts: 0,
    };
}

function claimQuestReward(questId) {
    if (!S.questData) initQuestData();
    const quest = QUEST_DEFINITIONS.find(q => q.id === questId);
    if (!quest || S.questData.claimed[questId]) return;

    S.questData.claimed[questId] = Date.now();
    S.questData.totalDP = (S.questData.totalDP || 0) + quest.dp;
    sv();

    // Toast celebration
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>${quest.icon}</span> +${quest.dp} DP — ${t('questClaimedToast')}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);

    syncUserLeaderboard();
    renderQuestPanel();
}

// ==================== SURPRISE QUESTS (from Admin) ====================
let surpriseQuests = [];

async function loadSurpriseQuests() {
    if (!db) return;
    try {
        const snap = await db.collection('surprise_quests')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc').limit(10).get();
        surpriseQuests = [];
        snap.forEach(doc => surpriseQuests.push({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn('Load surprise quests error:', e);
    }
}

async function reportSurpriseQuestDone(questId) {
    if (!currentUser || !db) return;
    try {
        await db.collection('surprise_quests').doc(questId).collection('submissions').doc(currentUser.uid).set({
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'User',
            status: 'pending',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        renderQuestPanel();
    } catch (e) { alert('Lỗi: ' + e.message); }
}

window._reportSurpriseQuest = reportSurpriseQuestDone;

// ==================== QUEST PANEL RENDER ====================
let questActiveFilter = 'daily';

function renderQuestPanel() {
    const container = document.getElementById('questFeedContainer');
    if (!container) return;
    if (!S.questData) initQuestData();

    const ctx = getQuestContext();
    const quests = QUEST_DEFINITIONS.filter(q => q.type === questActiveFilter || (questActiveFilter === 'weekly' && q.type === 'weekly'));

    let html = '';

    if (questActiveFilter === 'surprise') {
        // Render surprise quests from admin
        if (surpriseQuests.length === 0) {
            html = '<div class="lb-empty">⚡ Chưa có nhiệm vụ đột xuất nào</div>';
        } else {
            surpriseQuests.forEach(sq => {
                const deadline = sq.deadline ? new Date(sq.deadline.toDate()).toLocaleDateString('vi-VN') : '';
                html += `<div class="quest-card surprise">
                    <div class="quest-card-header">
                        <span class="quest-icon">⚡</span>
                        <div class="quest-card-title">
                            <div class="quest-name">${escHtml(sq.title || 'Nhiệm vụ')}</div>
                            <div class="quest-desc">${escHtml(sq.description || '')}</div>
                        </div>
                        <div class="quest-dp-badge">+${sq.rewardDP || 0} DP</div>
                    </div>
                    ${deadline ? `<div class="quest-deadline">⏰ Hạn: ${deadline}</div>` : ''}
                    <button class="quest-claim-btn surprise-btn" onclick="window._reportSurpriseQuest('${sq.id}')">${t('questReportDone')}</button>
                </div>`;
            });
        }
    } else {
        quests.forEach(q => {
            const completed = q.check(ctx);
            const claimed = !!S.questData.claimed[q.id];
            const qName = curLang === 'en' ? q.nameEn : (curLang === 'zh' ? q.nameZh : q.name);
            const statusClass = claimed ? 'claimed' : completed ? 'ready' : 'locked';

            html += `<div class="quest-card ${statusClass}">
                <div class="quest-card-header">
                    <span class="quest-icon">${q.icon}</span>
                    <div class="quest-card-title">
                        <div class="quest-name">${qName}</div>
                        <div class="quest-desc">${q.desc}</div>
                    </div>
                    <div class="quest-dp-badge">+${q.dp} DP</div>
                </div>
                <div class="quest-card-footer">
                    ${claimed ? `<span class="quest-status-done">✅ ${t('questClaimed')}</span>` :
                      completed ? `<button class="quest-claim-btn" onclick="claimQuestReward('${q.id}')">${t('questClaim')}</button>` :
                      `<span class="quest-status-locked">🔒 ${t('questLocked')}</span>`}
                </div>
            </div>`;
        });
    }

    container.innerHTML = html;

    // Summary
    const summaryEl = document.getElementById('questSummary');
    if (summaryEl) {
        const total = QUEST_DEFINITIONS.length;
        const done = QUEST_DEFINITIONS.filter(q => S.questData.claimed[q.id]).length;
        summaryEl.innerHTML = `<div class="lb-stat-card"><div class="lb-stat-value">${done}/${total}</div><div class="lb-stat-label">${t('questProgress')}</div></div>
            <div class="lb-stat-card"><div class="lb-stat-value">${S.questData.totalDP || 0}</div><div class="lb-stat-label">Quest DP</div></div>`;
    }
}

function openQuestModal() {
    const modal = document.getElementById('questModalBg');
    if (!modal) return;
    modal.classList.add('show');
    initQuestData();
    loadSurpriseQuests().then(() => renderQuestPanel());
}

function closeQuestModal() {
    const modal = document.getElementById('questModalBg');
    if (modal) modal.classList.remove('show');
}

function initQuestSystem() {
    initQuestData();

    const closeBtn = document.getElementById('questCloseBtn');
    if (closeBtn) closeBtn.onclick = closeQuestModal;

    const bg = document.getElementById('questModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) closeQuestModal(); };

    const questBtn = document.getElementById('questBtn');
    if (questBtn) questBtn.onclick = openQuestModal;

    // Tab switching
    document.querySelectorAll('.quest-tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.quest-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            questActiveFilter = btn.dataset.filter;
            renderQuestPanel();
        };
    });
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
    initProfileModal();
}

// ==================== PROFILE MODAL & AVATAR ====================
window._openProfile = () => {
    const modal = document.getElementById('profileModalBg');
    if (!modal) return;
    modal.classList.add('show');
    
    const dp = S.dp || 0;
    const streak = S.streak || 0;
    const rank = getRankLevel(dp);
    
    document.getElementById('profileName').textContent = currentUser.displayName || currentUser.email || 'User';
    document.getElementById('profileLevel').textContent = getRankTierName(rank);
    document.getElementById('profileDP').textContent = dp;
    document.getElementById('profileStreak').textContent = streak;
    
    const pAvatar = document.getElementById('profileAvatar');
    const pFrame = document.getElementById('profileAvatarFrame');
    
    const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const rankTitle = getRankTierName(rank);

    if (window.getFullRankCardHTML) {
        pFrame.innerHTML = window.getFullRankCardHTML(rank.level, imgUrl, 0.7, displayName, rankTitle);
        pFrame.style.background = 'transparent';
        pFrame.style.border = 'none';
    } else {
        pAvatar.src = imgUrl;
        pFrame.dataset.level = rank.level;
    }
    
    renderFramesGrid(rank.level, imgUrl);
};

function initProfileModal() {
    const closeBtn = document.getElementById('profileCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('profileModalBg').classList.remove('show');
    
    const bg = document.getElementById('profileModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) bg.classList.remove('show'); };
    
    const uploadBtn = document.getElementById('avatarUploadBtn');
    const fileInput = document.getElementById('avatarFileInput');
    
    if (uploadBtn && fileInput) {
        uploadBtn.onclick = () => fileInput.click();
        fileInput.onchange = handleAvatarUpload;
    }
}

function renderFramesGrid(currentLevel, imgUrl = '') {
    const grid = document.getElementById('framesGrid');
    if (!grid) return;
    let html = '';
    for (let i = 1; i <= 10; i++) {
        const isUnlocked = currentLevel >= i;
        const isCurrent = currentLevel === i;
        let classes = 'frame-preview';
        if (isUnlocked) classes += ' unlocked';
        if (isCurrent) classes += ' current';
        
        let frameHTML = '';
        if (window.getFullRankCardHTML) {
            frameHTML = window.getFullRankCardHTML(i, imgUrl, 0.5);
        } else if (window.getAvatarHTML) {
            frameHTML = window.getAvatarHTML(i, imgUrl, 56);
        }
        
        html += `<div class="${classes}" onclick="if(${isUnlocked}) window._setProfileFrame(${i})">
            ${frameHTML}
            <div class="frame-lv">Lv ${i}</div>
        </div>`;
    }
    grid.innerHTML = html;
}

window._setProfileFrame = (level) => {
    const dp = S.dp || 0;
    const rank = getRankLevel(dp);
    // Ignore setting if level is locked
    if (level > rank.level) return;

    const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    
    if (window.getAvatarHTML) {
        document.getElementById('profileAvatarFrame').innerHTML = window.getAvatarHTML(level, imgUrl, 120);
        document.getElementById('navAvatarFrame').innerHTML = window.getAvatarHTML(level, imgUrl, 44);
    } else {
        document.getElementById('profileAvatarFrame').dataset.level = level;
        document.getElementById('navAvatarFrame').dataset.level = level;
    }
    
    document.querySelectorAll('.frame-preview').forEach(el => el.classList.remove('current'));
    const allPreviews = document.querySelectorAll('.frame-preview');
    if(allPreviews[level-1]) allPreviews[level-1].classList.add('current');
};

async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadBtn = document.getElementById('avatarUploadBtn');
    uploadBtn.textContent = '⏳ Đang tải...';
    uploadBtn.disabled = true;
    
    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(res => img.onload = res);
        
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 250;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; } }
        else { if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; } }
        
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        
        const base64Str = canvas.toDataURL('image/jpeg', 0.85);
        
        await currentUser.updateProfile({ photoURL: base64Str });
        if (userDocRef) {
            await userDocRef.update({ photoURL: base64Str });
        }
        
        showUserProfile(currentUser);
        if (window._openProfile) window._openProfile();
        uploadBtn.textContent = '✅ Xong';
    } catch (err) {
        console.error(err);
        alert('Lỗi tải ảnh: ' + err.message);
        uploadBtn.textContent = '❌ Lỗi';
    }
    
    setTimeout(() => {
        uploadBtn.textContent = '📷 Đổi ảnh đại diện';
        uploadBtn.disabled = false;
        e.target.value = '';
    }, 2000);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',initAuthGuard):initAuthGuard();
})();

