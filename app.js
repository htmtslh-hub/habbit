(function(){
'use strict';

// ==================== GLOBAL MODAL SCROLL LOCK ====================
// Automatically lock body scroll when any modal is visible
(function initModalScrollLock() {
    function checkModals() {
        const anyModalOpen = document.querySelector('.modal-bg.show, .upgrade-modal-bg.show, .recap-modal-bg.show');
        document.body.classList.toggle('modal-open', !!anyModalOpen);
    }
    const observer = new MutationObserver(checkModals);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
})();

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
    // Rune Icon helper — returns inline SVG markup for i18n strings
    _ri: function(name, cls) { return '<svg class="rune-inline'+(cls?' '+cls:'')+'" viewBox="0 0 48 48"><use href="#i-'+name+'"></use></svg>'; },

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
        questCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Nhiệm vụ hoàn thành!',questClaimedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Đã nhận thưởng DP!',
        questReportDone:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Báo hoàn thành',questPending:'Chờ duyệt',questApproved:'Đã duyệt',
        tabStreakShield:'Bảo vệ chuỗi',streakModalTitle:'BẢO VỆ & CỨU CHUỖI',
        streakFreeze:'Bình Đóng Băng',streakRepair:'Vá Chuỗi 24h',
        streakStatus:'Tình trạng chuỗi',streakActive:'Đang duy trì',streakBroken:'Bị đứt hôm qua',
        streakProtected:'Được bảo vệ bởi Bình Đóng Băng',buyFreeze:'Mua Bình Đóng Băng',repairStreak:'Hồi Sinh Chuỗi',
        freezeAutoToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Bình Đóng Băng đã tự động bảo vệ chuỗi của bạn hôm qua!',
        streakRepairToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> Chuỗi của bạn đã được HỒI SINH thành công!',
        freezeBoughtToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Đã mua 1 Bình Đóng Băng thành công!',
        streakSafeDesc:'Bạn đang có bình đóng băng bảo vệ nếu lỡ quên check-in.',
        streakDangerDesc:'Bạn chưa có bình đóng băng dự trữ! Hãy mua để tránh đứt chuỗi.',
        streakBrokenDesc:'Chuỗi của bạn đã bị đứt hôm qua. Bạn có 24h để cứu lại chuỗi!',
        freezeFlask1:'Bình 1 (Chính)',freezeFlask2:'Bình 2 (Dự phòng)',
        freezeReady:'Sẵn sàng kích hoạt',freezeEmpty:'Chưa có (Mua thêm)',
        buyFreezeDesc:'Tự động bảo vệ chuỗi nếu lỡ quên 1 ngày check-in (Tối đa 2 bình).',
        repairStreakDesc:'Vá lại chuỗi bị đứt trong 24h qua, hồi sinh số ngày chuỗi nguyên vẹn.',
        historyTitle:'LỊCH SỬ BẢO VỆ CHUỖI',noHistory:'Chưa có lượt bảo vệ nào gần đây.',
        daysUnit:'ngày',maxStreakLabel:'Kỷ lục',currentStreakLabel:'Chuỗi hiện tại',
        tabShop:'Cửa hàng',shopModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-market"></use></svg> CỬA HÀNG KỶ LUẬT',
        shopTabTitles:'Danh hiệu',shopTabThemes:'Giao diện',shopTabFX:'Hiệu ứng',shopTabItems:'Vật phẩm',
        btnBuy:'Mua',btnEquip:'Trang bị',btnEquipped:'Đang dùng',
        itemBoughtToast:'Đã mua thành công!',itemEquippedToast:'Đã trang bị thành công!',
        boostActivatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> Đã kích hoạt Vé Nhân Đôi 2X DP trong 24h!',
        tabSquad:'Tổ đội',squadHubTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> TỔ ĐỘI & THÁCH ĐẤU 1V1',
        squadTabGuild:'Tổ Đội Rèn Luyện',squadTabDuel:'Đấu Trường 1v1',
        btnNudge:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> Thúc giục',nudgeSentToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> Đã gửi lời thúc giục sấm sét đến đồng đội!',
        squadCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Đã tạo tổ đội thành công!',squadJoinedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Đã gia nhập tổ đội!',
        squadLeftToast:'Đã rời tổ đội.',duelCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> Đã tạo phòng thách đấu 7 ngày!',
        duelAcceptedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> Trận chiến 1v1 chính thức bắt đầu!',duelWonToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg> Chúc mừng! Bạn đã chiến thắng trận đấu 1v1!',
        tabRecap:'Tổng kết',tabShareCard:'Khoe thẻ',shareModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> XUẤT ẢNH THẺ KHOE KỶ LUẬT',
        recapTitle:'Bản Tin Tổng Kết Tuần',cardDownloadedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Đã tải ảnh thẻ về máy!',
        cardCopiedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Đã sao chép ảnh thẻ vào Clipboard!',
        tabPomodoro:'Focus',pomoModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-focus"></use></svg> ĐỒNG HỒ TẬP TRUNG (DEEP WORK)',
        pomoCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Hoàn thành phiên tập trung! +15 DP Deep Work Bonus',
        pomoHabitCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Đã hoàn thành 25p! Thói quen đã tự động check-in (+15 DP)',
        quoteCopiedToast:'Đã sao chép câu trích dẫn!',
        pomoLinkHabit:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-target"></use></svg> GẮN VỚI THÓI QUEN:',pomoFreeDeepWork:'-- Tập trung tự do (Deep Work) --',
        pomoPomodoro:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cycle"></use></svg> Pomodoro (25m)',pomoShortBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> Nghỉ ngắn (5m)',pomoLongBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-crescent"></use></svg> Nghỉ dài (15m)',
        pomoStart:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Bắt Đầu',pomoReset:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-reset"></use></svg> Đặt Lại',pomoPause:'⏸ Tạm Dừng',pomoContinue:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Tiếp Tục',
        pomoReady:'Đang sẵn sàng',pomoFocusing:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> Đang tập trung...',pomoResting:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> Đang nghỉ ngơi...',
        pomoPaused:'Đang tạm dừng',pomoShortRest:'Nghỉ ngơi 5 phút',pomoLongRest:'Nghỉ ngơi 15 phút',
        pomoRewardHint:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Thưởng +15 DP khi hoàn thành',
        pomoAmbientLabel:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-audio"></use></svg> NHẠC NỀN TẬP TRUNG (AMBIENT SOUND):',
        pomoSoundOff:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-mute"></use></svg> Tắt',pomoSoundRain:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-rain"></use></svg> Mưa Rơi',pomoSoundOcean:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-tide"></use></svg> Sóng Biển',
        pomoSoundNoise:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-static"></use></svg> Tiếng Ồn Trắng',pomoSoundLofi:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-disc"></use></svg> Lo-fi Chords',
        cmPlaceholder:'Chia sẻ câu chuyện, thành tích hoặc động lực rèn luyện của bạn...',
        cmAttachImage:'Ảnh',cmAttachVideo:'Video',cmSubmitPost:'Đăng bài',
        cmFeedHeader:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> BÀI VIẾT TỪ CỘNG ĐỒNG',cmRefresh:'Tải lại',
        streakShopTitle:'CỬA HÀNG CỨU CHUỖI',streakWallet:'Ví',
        streakBuyBtn:'Mua',streakNoNeed:'Không cần vá',
        streakAvailable:'CÒN',
        squadJoinTitle:'Gia Nhập Tổ Đội Rèn Luyện',
        squadJoinDesc:'Nghiên cứu chỉ ra rằng khi có đồng đội cùng theo dõi và nhắc nhở, tỷ lệ duy trì kỷ luật thói quen tăng tới <b>85%</b>! Hãy tạo hoặc tham gia một tổ đội ngay.',
        squadCreateTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Tạo Tổ Đội Mới (3-5 Người)',
        squadNamePh:'Tên tổ đội (VD: Chiến Binh 5H Sáng)...',
        squadIconLabel:'Biểu tượng:',squadGoalPh:'Mục tiêu chung của đội...',
        squadCreateBtn:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Tạo Tổ Đội Ngay',
        squadJoinByCode:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Gia Nhập Bằng Mã Mời',
        squadCodePh:'Nhập mã mời...',squadJoinBtn:'Gia nhập',
        shopOwned:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Đã sở hữu',
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
        questCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 任务完成！',questClaimedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 已领取DP！',
        questReportDone:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> 报告完成',questPending:'待审核',questApproved:'已审核',
        tabStreakShield:'连胜保护',streakModalTitle:'连胜保护与恢复',
        streakFreeze:'连胜冻结瓶',streakRepair:'24小时补签',
        streakStatus:'连胜状态',streakActive:'进行中',streakBroken:'昨日中断',
        streakProtected:'受冻结保护',buyFreeze:'购买冻结瓶',repairStreak:'恢复连胜',
        freezeAutoToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> 冻结瓶已自动保护你昨天的连胜！',
        streakRepairToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> 你的连胜已成功复活！',
        freezeBoughtToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> 已成功购买1个冻结瓶！',
        streakSafeDesc:'你拥有冻结瓶，若遗漏签到将自动受到保护。',
        streakDangerDesc:'你暂无备用冻结瓶，建议购买以防连胜中断。',
        streakBrokenDesc:'你的连胜昨天已中断，24小时内可补救！',
        freezeFlask1:'瓶1（主）',freezeFlask2:'瓶2（备用）',
        freezeReady:'就绪',freezeEmpty:'空（可购买）',
        buyFreezeDesc:'遗漏签到时自动保护连胜（最多储存2瓶）。',
        repairStreakDesc:'修复过去24小时内中断的连胜，完美复活天数。',
        historyTitle:'连胜保护历史',noHistory:'近期暂无保护记录。',
        daysUnit:'天',maxStreakLabel:'最高记录',currentStreakLabel:'当前连胜',
        tabShop:'商店',shopModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-market"></use></svg> 自律商店',
        shopTabTitles:'头衔',shopTabThemes:'主题',shopTabFX:'特效',shopTabItems:'道具',
        btnBuy:'购买',btnEquip:'装备',btnEquipped:'已装备',
        itemBoughtToast:'购买成功！',itemEquippedToast:'装备成功！',
        boostActivatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> 2X DP加速卡已激活（24小时）！',
        tabSquad:'战队',squadHubTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> 战队与1V1对决',
        squadTabGuild:'自律战队',squadTabDuel:'1V1对决场',
        btnNudge:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> 催促',nudgeSentToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> 已向队友发送闪电提醒！',
        squadCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> 战队创建成功！',squadJoinedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> 成功加入战队！',
        squadLeftToast:'已退出战队。',duelCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> 已创建7天对决房间！',
        duelAcceptedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> 1V1对决正式开启！',duelWonToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg> 恭喜！你赢得了1V1对决！',
        tabRecap:'周报',tabShareCard:'分享卡片',shareModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> 导出自律成就卡',
        recapTitle:'每周自律总结',cardDownloadedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> 成就卡已保存！',
        cardCopiedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> 成就卡已复制到剪贴板！',
        tabPomodoro:'专注',pomoModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-focus"></use></svg> 专注时钟 (DEEP WORK)',
        pomoCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 专注完成！获得 +15 DP 奖励',
        pomoHabitCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 25分钟专注完成！习惯已自动打卡 (+15 DP)',
        quoteCopiedToast:'格言已复制到剪贴板！',
        pomoLinkHabit:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-target"></use></svg> 关联习惯:',pomoFreeDeepWork:'-- 自由专注 (Deep Work) --',
        pomoPomodoro:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cycle"></use></svg> 番茄钟 (25m)',pomoShortBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> 短休 (5m)',pomoLongBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-crescent"></use></svg> 长休 (15m)',
        pomoStart:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> 开始',pomoReset:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-reset"></use></svg> 重置',pomoPause:'⏸ 暂停',pomoContinue:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> 继续',
        pomoReady:'准备就绪',pomoFocusing:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> 专注中...',pomoResting:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> 休息中...',
        pomoPaused:'已暂停',pomoShortRest:'休息5分钟',pomoLongRest:'休息15分钟',
        pomoRewardHint:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 完成可获得 +15 DP',
        pomoAmbientLabel:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-audio"></use></svg> 专注背景音:',
        pomoSoundOff:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-mute"></use></svg> 关闭',pomoSoundRain:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-rain"></use></svg> 雨声',pomoSoundOcean:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-tide"></use></svg> 海浪',
        pomoSoundNoise:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-static"></use></svg> 白噪声',pomoSoundLofi:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-disc"></use></svg> Lo-fi和弦',
        cmPlaceholder:'分享你的故事、成就或训练心得...',
        cmAttachImage:'图片',cmAttachVideo:'视频',cmSubmitPost:'发布',
        cmFeedHeader:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 社区动态',cmRefresh:'刷新',
        streakShopTitle:'连胜商店',streakWallet:'余额',
        streakBuyBtn:'购买',streakNoNeed:'无需修复',
        streakAvailable:'可用',
        squadJoinTitle:'加入自律战队',
        squadJoinDesc:'研究表明，有队友共同监督和提醒时，习惯坚持率提高至<b>85%</b>！立即创建或加入战队。',
        squadCreateTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 创建新战队 (3-5人)',
        squadNamePh:'战队名称...',
        squadIconLabel:'图标:',squadGoalPh:'团队共同目标...',
        squadCreateBtn:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> 立即创建战队',
        squadJoinByCode:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> 通过邀请码加入',
        squadCodePh:'输入邀请码...',squadJoinBtn:'加入',
        shopOwned:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> 已拥有',
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
        questCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Quest completed!',questClaimedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> DP claimed!',
        questReportDone:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Report done',questPending:'Pending',questApproved:'Approved',
        tabStreakShield:'Streak Shield',streakModalTitle:'STREAK SHIELD & RECOVERY',
        streakFreeze:'Streak Freeze',streakRepair:'24h Streak Repair',
        streakStatus:'Streak Status',streakActive:'Active',streakBroken:'Broken Yesterday',
        streakProtected:'Protected by Streak Freeze',buyFreeze:'Buy Streak Freeze',repairStreak:'Resurrect Streak',
        freezeAutoToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Streak Freeze automatically protected your streak yesterday!',
        streakRepairToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> Your streak has been successfully resurrected!',
        freezeBoughtToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Successfully purchased 1 Streak Freeze!',
        streakSafeDesc:'You have an active freeze bottle protecting your streak if you miss a day.',
        streakDangerDesc:'No reserve freeze bottle! Buy one to prevent streak loss.',
        streakBrokenDesc:'Your streak broke yesterday. You have 24h to recover it!',
        freezeFlask1:'Flask 1 (Primary)',freezeFlask2:'Flask 2 (Reserve)',
        freezeReady:'Ready to activate',freezeEmpty:'Empty (Buy in shop)',
        buyFreezeDesc:'Auto-protects streak if you miss 1 day of check-in (Max 2 flasks).',
        repairStreakDesc:'Repairs a broken streak from the past 24h, fully restoring your streak count.',
        historyTitle:'PROTECTION HISTORY',noHistory:'No recent protection records.',
        daysUnit:'days',maxStreakLabel:'Record',currentStreakLabel:'Current Streak',
        tabShop:'Shop',shopModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-market"></use></svg> DISCIPLINE SHOP',
        shopTabTitles:'Titles',shopTabThemes:'Themes',shopTabFX:'FX & Sound',shopTabItems:'Items',
        btnBuy:'Buy',btnEquip:'Equip',btnEquipped:'Equipped',
        itemBoughtToast:'Purchased successfully!',itemEquippedToast:'Equipped successfully!',
        boostActivatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> 2X DP Boost activated for 24h!',
        tabSquad:'Squads',squadHubTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> SQUADS & 1V1 DUELS',
        squadTabGuild:'Discipline Squads',squadTabDuel:'1v1 Arena',
        btnNudge:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> Nudge',nudgeSentToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg> Thunder poke sent to your teammate!',
        squadCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Squad created successfully!',squadJoinedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Joined squad successfully!',
        squadLeftToast:'Left squad.',duelCreatedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> 7-Day Duel created!',
        duelAcceptedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg> 1v1 Duel has begun!',duelWonToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg> Congratulations! You won the 1v1 duel!',
        tabRecap:'Recap',tabShareCard:'Share Card',shareModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> SHAREABLE HABIT CARD',
        recapTitle:'Weekly Habit Recap',cardDownloadedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Card image downloaded!',
        cardCopiedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> Card image copied to clipboard!',
        tabPomodoro:'Focus',pomoModalTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-focus"></use></svg> FOCUS TIMER (DEEP WORK)',
        pomoCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Deep work session completed! +15 DP Bonus',
        pomoHabitCompletedToast:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> 25m Focus done! Habit automatically checked-in (+15 DP)',
        quoteCopiedToast:'Quote copied to clipboard!',
        pomoLinkHabit:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-target"></use></svg> LINK TO HABIT:',pomoFreeDeepWork:'-- Free Focus (Deep Work) --',
        pomoPomodoro:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cycle"></use></svg> Pomodoro (25m)',pomoShortBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> Short Break (5m)',pomoLongBreak:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-crescent"></use></svg> Long Break (15m)',
        pomoStart:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Start',pomoReset:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-reset"></use></svg> Reset',pomoPause:'⏸ Pause',pomoContinue:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Resume',
        pomoReady:'Ready',pomoFocusing:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg> Focusing...',pomoResting:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-cup"></use></svg> Resting...',
        pomoPaused:'Paused',pomoShortRest:'5 min break',pomoLongRest:'15 min break',
        pomoRewardHint:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> +15 DP reward on completion',
        pomoAmbientLabel:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-audio"></use></svg> AMBIENT SOUND:',
        pomoSoundOff:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-mute"></use></svg> Off',pomoSoundRain:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-rain"></use></svg> Rain',pomoSoundOcean:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-tide"></use></svg> Ocean',
        pomoSoundNoise:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-static"></use></svg> White Noise',pomoSoundLofi:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-disc"></use></svg> Lo-fi Chords',
        cmPlaceholder:'Share your story, achievement, or training motivation...',
        cmAttachImage:'Image',cmAttachVideo:'Video',cmSubmitPost:'Post',
        cmFeedHeader:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> COMMUNITY POSTS',cmRefresh:'Refresh',
        streakShopTitle:'STREAK SHOP',streakWallet:'Wallet',
        streakBuyBtn:'Buy',streakNoNeed:'Not needed',
        streakAvailable:'AVAILABLE',
        squadJoinTitle:'Join a Discipline Squad',
        squadJoinDesc:'Research shows that having teammates to track and remind each other increases habit discipline rate up to <b>85%</b>! Create or join a squad now.',
        squadCreateTitle:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Create New Squad (3-5 People)',
        squadNamePh:'Squad name (e.g., Morning Warriors)...',
        squadIconLabel:'Icon:',squadGoalPh:'Team shared goal...',
        squadCreateBtn:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Create Squad Now',
        squadJoinByCode:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Join by Invite Code',
        squadCodePh:'Enter invite code...',squadJoinBtn:'Join',
        shopOwned:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Owned',
    }
};

let curLang=localStorage.getItem('hg_lang')||'vi';
function t(k){return(I18N[curLang]||I18N.en)[k]||(I18N.en[k])||k}

function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=t(el.dataset.i18n)});
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh)});
    const ms=document.querySelector('#monthSel');
    if(ms){ms.innerHTML='';t('months').forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=m;ms.appendChild(o)});ms.value=cM}
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
// ==================== WEB AUDIO API SYNTHESIZER ====================
let _audioCtx = null;
function getAudioCtx() {
    try {
        if (!_audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) _audioCtx = new AC();
        }
        if (_audioCtx && _audioCtx.state === 'suspended') {
            _audioCtx.resume();
        }
        return _audioCtx;
    } catch(e) { return null; }
}

function playCheckSound() {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const soundType = (typeof S !== 'undefined' && S && S.inventory && S.inventory.soundFx) ? S.inventory.soundFx : 'default';

        if (soundType === 'katana') {
            // Katana slash: Metallic burst + resonant filter sweep
            const bufferSize = ctx.sampleRate * 0.08;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3200, now);
            filter.frequency.exponentialRampToValueAtTime(700, now + 0.08);
            filter.Q.setValueAtTime(8, now);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);

            // Metallic tone
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
            oscGain.gain.setValueAtTime(0.12, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (soundType === 'rpg') {
            // RPG Level-Up fanfare
            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(f, now + i * 0.04);
                gain.gain.setValueAtTime(0.07, now + i * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.14);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.04);
                osc.stop(now + i * 0.04 + 0.14);
            });
        } else if (soundType === 'mechanical') {
            // Mechanical switch thock
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.045);
        } else if (soundType === 'bubble') {
            // Water drop / bubble
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } else if (soundType === 'laser') {
            // Laser zap
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1800, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } else {
            // Default Chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch(e) {}
}

function triggerVisualFx(el) {
    if (!el) return;
    const vType = (typeof S !== 'undefined' && S && S.inventory && S.inventory.visualFx) ? S.inventory.visualFx : 'default';
    if (vType === 'default') return;

    if (vType === 'laser') {
        const sweep = document.createElement('div');
        sweep.className = 'vfx-laser-sweep';
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(sweep);
        setTimeout(() => sweep.remove(), 450);
    } else if (vType === 'gold_aura') {
        const aura = document.createElement('div');
        aura.className = 'vfx-gold-expand';
        el.style.position = 'relative';
        el.appendChild(aura);
        setTimeout(() => aura.remove(), 550);
    } else if (vType === 'fireworks') {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const colors = ['#ff007f', '#00f0ff', '#f59e0b', '#10b981', '#a855f7', '#ec4899'];
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            dot.className = 'vfx-burst';
            dot.style.position = 'fixed';
            dot.style.left = `${centerX}px`;
            dot.style.top = `${centerY}px`;
            dot.style.width = '6px';
            dot.style.height = '6px';
            dot.style.borderRadius = '50%';
            dot.style.background = colors[i % colors.length];
            dot.style.boxShadow = `0 0 6px ${colors[i % colors.length]}`;
            dot.style.transition = 'all 0.5s cubic-bezier(0.1, 0.9, 0.2, 1)';
            document.body.appendChild(dot);
            
            const angle = (i / 10) * Math.PI * 2;
            const dist = 22 + Math.random() * 18;
            const targetX = centerX + Math.cos(angle) * dist;
            const targetY = centerY + Math.sin(angle) * dist;

            requestAnimationFrame(() => {
                dot.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`;
                dot.style.opacity = '0';
            });
            setTimeout(() => dot.remove(), 520);
        }
    } else if (vType === 'sakura') {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        for (let i = 0; i < 6; i++) {
            const petal = document.createElement('div');
            petal.className = 'vfx-burst';
            petal.innerHTML = '🌸';
            petal.style.position = 'fixed';
            petal.style.left = `${centerX + (Math.random() * 20 - 10)}px`;
            petal.style.top = `${centerY}px`;
            petal.style.fontSize = '12px';
            petal.style.transition = 'all 0.6s ease-out';
            document.body.appendChild(petal);

            const dx = (Math.random() - 0.5) * 30;
            const dy = 18 + Math.random() * 26;

            requestAnimationFrame(() => {
                petal.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 180}deg) scale(0.4)`;
                petal.style.opacity = '0';
            });
            setTimeout(() => petal.remove(), 620);
        }
    }
}

function playFreezeSound() {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        [1200, 1600, 2400].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);
            gain.gain.setValueAtTime(0.09, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.25);
        });
    } catch(e) {}
}

function playResurrectSound() {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);
            gain.gain.setValueAtTime(0.14, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.32);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.32);
        });
    } catch(e) {}
}

function playNudgeSound() {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    } catch(e) {}
}

function playDuelGongSound() {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
    } catch(e) {}
}

let S={
    h:[...DEF],
    c:{},
    mo:{},
    sl:{},
    ni:14,
    notes:{},
    freezes:1,
    frozenDays:[],
    repairedDays:[],
    lastStreakBreak:null,
    squadId:'',
    activeDuelId:'',
    inventory:{
        titles:[],
        equippedTitle:'',
        soundFx:'default',
        soundFxOwned:['default'],
        visualFx:'default',
        visualFxOwned:['default'],
        themes:['dark','light'],
        equippedTheme:localStorage.getItem('hg_theme')||'dark',
        boost2xExpiresAt:0
    }
};
let cM=new Date().getMonth(),cY=new Date().getFullYear(),sE='💪',selectedDay=new Date().getDate();
let isColumnFrozen = localStorage.getItem('hg_col_frozen') !== 'false';
let isColumnCollapsed = localStorage.getItem('hg_col_collapsed') === 'true';

function sanitizeInventory(inv) {
    const defaultInv = {
        titles:[],
        equippedTitle:'',
        soundFx:'default',
        soundFxOwned:['default'],
        visualFx:'default',
        visualFxOwned:['default'],
        themes:['dark','light'],
        equippedTheme:localStorage.getItem('hg_theme')||'dark',
        boost2xExpiresAt:0
    };
    if (!inv || typeof inv !== 'object') return defaultInv;
    return {
        titles: Array.isArray(inv.titles) ? inv.titles : [],
        equippedTitle: typeof inv.equippedTitle === 'string' ? inv.equippedTitle : '',
        soundFx: typeof inv.soundFx === 'string' ? inv.soundFx : 'default',
        soundFxOwned: Array.isArray(inv.soundFxOwned) ? inv.soundFxOwned : ['default'],
        visualFx: typeof inv.visualFx === 'string' ? inv.visualFx : 'default',
        visualFxOwned: Array.isArray(inv.visualFxOwned) ? inv.visualFxOwned : ['default'],
        themes: Array.isArray(inv.themes) ? inv.themes : ['dark','light'],
        equippedTheme: typeof inv.equippedTheme === 'string' ? inv.equippedTheme : (localStorage.getItem('hg_theme')||'dark'),
        boost2xExpiresAt: typeof inv.boost2xExpiresAt === 'number' ? inv.boost2xExpiresAt : 0
    };
}

function ld(){
    try{
        const r=localStorage.getItem(SK);
        if(r){
            const res=JSON.parse(r);
            res.notes=res.notes||{};
            if(res.freezes === undefined) res.freezes = 1;
            if(!Array.isArray(res.frozenDays)) res.frozenDays = [];
            if(!Array.isArray(res.repairedDays)) res.repairedDays = [];
            res.squadId = typeof res.squadId === 'string' ? res.squadId : '';
            res.activeDuelId = typeof res.activeDuelId === 'string' ? res.activeDuelId : '';
            res.inventory = sanitizeInventory(res.inventory);
            return res;
        }
    }catch(e){}
    return{
        h:[...DEF],c:{},mo:{},sl:{},ni:14,notes:{},freezes:1,frozenDays:[],repairedDays:[],lastStreakBreak:null,
        squadId:'',activeDuelId:'',
        inventory: sanitizeInventory(null)
    };
}

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
            if(d && d.h && d.c){ 
                d.notes = d.notes||{}; 
                if(d.freezes === undefined) d.freezes = 1;
                if(!Array.isArray(d.frozenDays)) d.frozenDays = [];
                if(!Array.isArray(d.repairedDays)) d.repairedDays = [];
                d.squadId = typeof d.squadId === 'string' ? d.squadId : '';
                d.activeDuelId = typeof d.activeDuelId === 'string' ? d.activeDuelId : '';
                d.inventory = sanitizeInventory(d.inventory);
                S = d; 
                localStorage.setItem(SK,JSON.stringify(S)); 
                if (S.inventory.equippedTheme && S.inventory.equippedTheme !== curTheme) {
                    curTheme = S.inventory.equippedTheme;
                    localStorage.setItem('hg_theme', curTheme);
                    applyTheme();
                }
                return true; 
            }
        }
    }catch(e){console.warn('Firestore load error:',e);}
    return false;
}

// ==================== TRỤ CỘT 2: CỬA HÀNG KỶ LUẬT & NỀN KINH TẾ DP (DISCIPLINE POINT SHOP) ====================

const SHOP_CATALOG = {
    titles: [
        { id: 'early_bird', name: 'Chim Sớm', nameEn: 'Early Bird', nameZh: '早起鸟', icon: '🌅', desc: 'Dành cho những người dậy sớm làm chủ bình minh.', descEn: 'For those who wake up early to conquer dawn.', descZh: '献给早起掌控清晨的人。', price: 300 },
        { id: 'night_owl', name: 'Kẻ Thức Khuya', nameEn: 'Night Owl', nameZh: '夜猫子', icon: '🦉', desc: 'Dành cho những cú đêm miệt mài rèn luyện.', descEn: 'For dedicated night owls forging habits.', descZh: '献给深夜不辍前行的人。', price: 300 },
        { id: 'warrior', name: 'Chiến Binh Kỷ Luật', nameEn: 'Discipline Warrior', nameZh: '自律战士', icon: '⚔️', desc: 'Ý chí kiên cường không ngại gian khó.', descEn: 'Unbreakable willpower against all odds.', descZh: '坚韧不拔，无惧困难。', price: 500 },
        { id: 'alpha_wolf', name: 'Sói Đầu Đàn', nameEn: 'Alpha Wolf', nameZh: '头狼领袖', icon: '🐺', desc: 'Dẫn đầu bầy đàn, kỷ luật thép đỉnh cao.', descEn: 'Leading the pack with apex discipline.', descZh: '领航团队，钢铁意志。', price: 800 },
        { id: 'invincible', name: 'Bất Khả Xâm Phạm', nameEn: 'Invincible', nameZh: '坚不可摧', icon: '🛡️', desc: 'Thành trì bất hoại trước mọi cám dỗ.', descEn: 'An impenetrable fortress against temptations.', descZh: '百毒不侵，坚如磐石。', price: 1200 },
        { id: 'conqueror', name: 'Kẻ Chinh Phục Thói Quen', nameEn: 'Habit Conqueror', nameZh: '习惯征服者', icon: '👑', desc: 'Bá chủ kỷ luật, chinh phục mọi giới hạn.', descEn: 'Absolute master conquering all limits.', descZh: '自律霸主，征服极限。', price: 2000 },
        { id: 'flash_will', name: 'Thần Tốc Kỷ Luật', nameEn: 'Flash of Will', nameZh: '极速意志', icon: '⚡', desc: 'Check-in nhanh như chớp, hành động dứt khoát.', descEn: 'Lightning-fast execution & instant check-ins.', descZh: '闪电自律，雷厉风行。', price: 600 },
        { id: 'zen_master', name: 'Tâm Bất Biến', nameEn: 'Zen Master', nameZh: '禅心大师', icon: '🧘', desc: 'Tĩnh lặng trong tâm hồn, bền bỉ mỗi ngày.', descEn: 'Inner calm with relentless daily focus.', descZh: '宁静致远，持之以恒。', price: 500 }
    ],
    themes: [
        { id: 'dark', name: 'Dark Mode', desc: 'Giao diện tối cổ điển huyền bí.', price: 0, free: true, bg: '#0f172a', accent: '#10b981' },
        { id: 'light', name: 'Light Mode', desc: 'Giao diện sáng sủa tươi mới.', price: 0, free: true, bg: '#f8fafc', accent: '#059669' },
        { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Thế giới tương lai rực rỡ tím & hồng cyan.', price: 600, bg: '#0d0221', accent: '#ff007f' },
        { id: 'luxury', name: 'Gold Luxury', desc: 'Vàng kim hoàng gia quý phái obsidian.', price: 800, bg: '#0b0b0e', accent: '#d4af37' },
        { id: 'sakura', name: 'Minimalist Sakura', desc: 'Hồng hoa anh đào thanh tao Nhật Bản.', price: 500, bg: '#fcf5f8', accent: '#ec4899' },
        { id: 'matrix', name: 'Midnight Matrix', desc: 'Xanh terminal hacker thế giới ma trận.', price: 600, bg: '#000c04', accent: '#00ff66' },
        { id: 'forest', name: 'Forest Zen', desc: 'Rừng ngọc bích thiên nhiên dịu mát an lành.', price: 500, bg: '#081711', accent: '#10b981' }
    ],
    soundFx: [
        { id: 'default', name: 'Chime Mặc Định', desc: 'Âm thanh trong trẻo êm tai.', price: 0, free: true },
        { id: 'katana', name: 'Katana Slash', desc: 'Tiếng chém kiếm sắc bén dứt khoát.', price: 350 },
        { id: 'rpg', name: 'RPG Level-Up', desc: 'Hợp âm chiến thắng thăng cấp nhập vai.', price: 400 },
        { id: 'mechanical', name: 'Phím Cơ Thocky', desc: 'Âm switch phím cơ êm ái gây nghiện.', price: 350 },
        { id: 'bubble', name: 'Bong Bóng Nước', desc: 'Tiếng giọt nước bùng nổ tươi mát.', price: 250 },
        { id: 'laser', name: 'Laser Beam Zap', desc: 'Tia năng lượng viễn tưởng siêu tốc.', price: 300 }
    ],
    visualFx: [
        { id: 'default', name: 'Pop Nhẹ Mặc Định', desc: 'Hiệu ứng phóng to nhẹ nhàng.', price: 0, free: true },
        { id: 'fireworks', name: 'Pháo Hoa Mini', desc: 'Hạt pháo hoa lung linh bùng nổ từ ô check.', price: 400 },
        { id: 'laser', name: 'Tia Laser Neon', desc: 'Vệt sáng laser quét ngang rực rỡ.', price: 400 },
        { id: 'gold_aura', name: 'Hào Quang Vàng Kim', desc: 'Vòng sáng hoàng kim tỏa rộng đẳng cấp.', price: 450 },
        { id: 'sakura', name: 'Cánh Hoa Bay', desc: 'Cánh hoa anh đào rơi lãng mạn.', price: 350 }
    ],
    items: [
        { id: 'freeze', name: 'Bình Đóng Băng Chuỗi', icon: '🧊', desc: 'Tự động bảo vệ chuỗi khi quên check-in (Tối đa 2 bình).', price: 200 },
        { id: 'boost2x', name: 'Vé Nhân Đôi Điểm (2X DP 24h)', icon: '⚡', desc: 'Nhân đôi tất cả điểm thưởng DP khi check-in trong suốt 24 giờ!', price: 300 }
    ]
};
window.SHOP_CATALOG = SHOP_CATALOG;

function getUserTitleBadgeHTML(titleId = null) {
    const id = titleId || (typeof S !== 'undefined' && S && S.inventory && S.inventory.equippedTitle);
    if (!id) return '';
    if (typeof SHOP_CATALOG === 'undefined' || !Array.isArray(SHOP_CATALOG.titles)) return '';
    const titleObj = SHOP_CATALOG.titles.find(t => t.id === id);
    if (!titleObj) return '';
    const tName = curLang === 'en' ? titleObj.nameEn : (curLang === 'zh' ? titleObj.nameZh : titleObj.name);
    return `<span class="user-title-badge">${escHtml(tName)}</span>`;
}
window.getUserTitleBadgeHTML = getUserTitleBadgeHTML;

function showUserProfile(user){
    const userProfileEl = document.querySelector('#userProfile');
    const computed = (typeof calculateUserDPAndStreak === 'function') ? calculateUserDPAndStreak(S) : { totalDP: 0 };
    const dp = (typeof S !== 'undefined' && S && typeof S.dp === 'number') ? S.dp : (computed.totalDP + (typeof userBonusDP !== 'undefined' ? userBonusDP : 0));
    const rank = getRankLevel(dp);
    const imgUrl = user.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(user.displayName||user.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const subText = getRankTierName(rank);

    if(userProfileEl) {
        if(typeof window.getNameplateCardHTML === 'function') {
            userProfileEl.innerHTML = window.getNameplateCardHTML(rank.level, imgUrl, 0.36, displayName, subText);
        } else if(typeof window.getAvatarHTML === 'function') {
            userProfileEl.innerHTML = `<div style="display:flex;align-items:center;gap:6px;">${window.getAvatarHTML(rank.level, imgUrl, 40)}<span style="font-weight:700;font-size:0.85rem;">${escHtml(displayName)}</span></div>`;
        }
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

    // Admin link — show in profile modal instead of navbar
    const adminSection = document.getElementById('profileAdminSection');
    if (adminSection) {
        adminSection.style.display = userPlan.role === 'admin' ? 'block' : 'none';
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
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> ${MAX_FREE_HABITS} thói quen</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Theo dõi hàng ngày</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Đồng bộ đám mây</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-close"></use></svg> Biểu đồ phân tích</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-close"></use></svg> Heatmap năm</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-close"></use></svg> Ghi chú hàng ngày</li>
                            </ul>
                            <div class="compare-price">0đ</div>
                        </div>
                        <div class="compare-col premium-col">
                            <h3>Premium <svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg></h3>
                            <ul>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Không giới hạn thói quen</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Biểu đồ phân tích</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Heatmap cả năm</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Ghi chú hàng ngày</li>
                                <li><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Ưu tiên hỗ trợ</li>
                            </ul>
                        </div>
                    </div>
                    <div class="plan-selector">
                        <div class="plan-card" data-plan="monthly" onclick="window._selectPlan('monthly')">
                            <span class="plan-check"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg></span>
                            <div class="plan-name">Gói Tháng</div>
                            <div class="plan-price">99.000đ<small>/tháng</small></div>
                        </div>
                        <div class="plan-card" data-plan="yearly" onclick="window._selectPlan('yearly')">
                            <span class="plan-badge">Tiết kiệm 30%</span>
                            <span class="plan-check"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg></span>
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
        alert('Yêu cầu đã gửi! Admin sẽ xác nhận trong 1-24 giờ.\nMã đơn: ' + _currentPaymentOrder.orderNumber);
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
        showUserProfile(currentUser);
        const profileModal = document.getElementById('profileModalBg');
        if (profileModal && profileModal.classList.contains('show') && typeof window._updateProfileModalUI === 'function') {
            window._updateProfileModalUI();
        }
    }
}
function applyTheme(){document.documentElement.setAttribute('data-theme',curTheme);updateThemeAvatars();}
function toggleTheme(){curTheme=curTheme==='dark'?'light':'dark';localStorage.setItem('hg_theme',curTheme);applyTheme();renderBar();renderLine()}

function switchToTheme(themeId) {
    curTheme = themeId;
    localStorage.setItem('hg_theme', curTheme);
    if (!S.inventory) S.inventory = sanitizeInventory ? sanitizeInventory(null) : {};
    S.inventory.equippedTheme = themeId;
    sv();
    applyTheme();
    renderBar();
    renderLine();
}
window._switchToTheme = switchToTheme;

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
        const dateKey = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isFrozen = Array.isArray(S.frozenDays) && S.frozenDays.includes(dateKey);
        const isRepaired = Array.isArray(S.repairedDays) && S.repairedDays.includes(dateKey);
        if(S.c[ck(hId,d)] || isFrozen || isRepaired){
            streak++;
        } else {
            break;
        }
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
    // Language switching now handled in Profile Modal via initProfileModal
}
function switchLang(lang) {
    curLang = lang;
    localStorage.setItem('hg_lang', curLang);
    applyI18n();
    renderAll();
    if (window._updateProfileModalUI) window._updateProfileModalUI();
}
window._switchLang = switchLang;
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
function initTheme(){applyTheme();}
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
        const dateKey = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isFrozen = Array.isArray(S.frozenDays) && S.frozenDays.includes(dateKey);
        const isRepaired = Array.isArray(S.repairedDays) && S.repairedDays.includes(dateKey);
        const frozenClass = isFrozen ? ' frozen-day' : (isRepaired ? ' repaired-day' : '');
        const freezeBadge = isFrozen ? '<span class="day-freeze-icon" title="Ngày đã đóng băng chuỗi">🧊</span>' : (isRepaired ? '<span class="day-freeze-icon" title="Ngày đã hồi sinh chuỗi">⚡</span>' : '');
        hh+=`<th class="h-day${tc}${sc}${frozenClass}" data-d="${d}"><span class="dn">${DA[dow]}</span><span class="dd">${d}${freezeBadge}</span></th>`;
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
            const dateKey = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isFrozen = Array.isArray(S.frozenDays) && S.frozenDays.includes(dateKey);
            const isRepaired = Array.isArray(S.repairedDays) && S.repairedDays.includes(dateKey);
            const frozenClass = isFrozen ? ' frozen-day' : (isRepaired ? ' repaired-day' : '');

            let cellInner = `<div class="cb${on?' on':''}"></div>`;
            if(!on && isFrozen){
                cellInner = `<div class="cb-frozen" title="🧊 Đã đóng băng chuỗi">🧊</div>`;
            } else if(!on && isRepaired){
                cellInner = `<div class="cb-repaired" title="⚡ Đã hồi sinh chuỗi">⚡</div>`;
            }

            bb+=`<td class="td-chk${tc}${frozenClass}" data-h="${h.id}" data-d="${d}" title="${esc(h.emoji)} ${esc(h.name)} (${dateStr})">${cellInner}</td>`;
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
            if(S.c[k]) {
                if(typeof playCheckSound === 'function') playCheckSound();
                if(typeof triggerVisualFx === 'function') triggerVisualFx(td);
            }
            const cb=td.querySelector('.cb');
            if(cb){cb.classList.toggle('on',!!S.c[k]);cb.classList.remove('pop');void cb.offsetWidth;cb.classList.add('pop')}
            renderStats();renderBar();renderLine();renderT10();renderHeatmap();updateAutoMood();
            checkConfetti();
            if(typeof updateUserDPState==='function') updateUserDPState(true);
            if(typeof renderQuestPanel==='function') renderQuestPanel();
            if(typeof onHabitCheckedSyncSquadAndDuel==='function') onHabitCheckedSyncSquadAndDuel();
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
                const dKey = `${cY}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const isFrozen = Array.isArray(S.frozenDays) && S.frozenDays.includes(dKey);
                const isRepaired = Array.isArray(S.repairedDays) && S.repairedDays.includes(dKey);

                const pct = hc ? Math.round(completed / hc * 100) : 0;
                const level = hc ? getLevel(completed / hc) : 0;
                cell.dataset.level = level;
                
                if (isFrozen) cell.classList.add('hm-frozen');
                if (isRepaired) cell.classList.add('hm-repaired');

                const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${cY}`;
                const tooltip = document.createElement('span');
                tooltip.className = 'hm-tooltip';
                if (isFrozen) {
                    tooltip.textContent = `${dateStr}: 🧊 Đã Đóng Băng Chuỗi (${completed}/${hc})`;
                } else if (isRepaired) {
                    tooltip.textContent = `${dateStr}: ⚡ Đã Hồi Sinh Chuỗi (${completed}/${hc})`;
                } else {
                    tooltip.textContent = `${dateStr}: ${completed}/${hc} (${pct}%)`;
                }
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
            
            if (tabId === 'community') { if(typeof window._openCommunity==='function') window._openCommunity(); return; }
            if (tabId === 'leaderboard') { if(typeof openLeaderboardModal==='function') openLeaderboardModal('leaderboard'); return; }
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
        initCommunity();
        initQuestSystem();
        renderAll();
        if(typeof updateUserDPState==='function') updateUserDPState(true);
        else syncUserLeaderboard();
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
    { level:1, name:'Tân Binh', nameEn:'Recruit', nameZh:'新兵', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg>', minDp:0, maxDp:1500, color:'#94a3b8' },
    { level:2, name:'Chiến Binh', nameEn:'Warrior', nameZh:'战士', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg>', minDp:1501, maxDp:4500, color:'#22c55e' },
    { level:3, name:'Dũng Sĩ', nameEn:'Champion', nameZh:'勇士', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg>', minDp:4501, maxDp:9000, color:'#3b82f6' },
    { level:4, name:'Kiếm Sĩ', nameEn:'Swordsman', nameZh:'剑士', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg>', minDp:9001, maxDp:15000, color:'#a855f7' },
    { level:5, name:'Cao Thủ', nameEn:'Expert', nameZh:'高手', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg>', minDp:15001, maxDp:24000, color:'#f97316' },
    { level:6, name:'Đại Sư', nameEn:'Grand Master', nameZh:'大师', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>', minDp:24001, maxDp:36000, color:'#06b6d4' },
    { level:7, name:'Chiến Thần', nameEn:'War God', nameZh:'战神', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', minDp:36001, maxDp:54000, color:'#eab308' },
    { level:8, name:'Bất Tử', nameEn:'Immortal', nameZh:'不朽', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg>', minDp:54001, maxDp:75000, color:'#ec4899' },
    { level:9, name:'Huyền Thoại', nameEn:'Legend', nameZh:'传说', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg>', minDp:75001, maxDp:105000, color:'#ef4444' },
    { level:10, name:'Thần Thoại', nameEn:'Mythic', nameZh:'神话', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', minDp:105001, maxDp:Infinity, color:'#fbbf24' },
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
let userBonusDP = 0;
let _hasShownAutoFreezeToast = false;

function calculateUserDPAndStreak(sData = S) {
    let totalChecks = 0;
    let weeklyChecks = 0;
    let perfectDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    if (!sData) return { totalDP: 0, weeklyDP: 0, totalChecks: 0, weeklyChecks: 0, currentStreak: 0, maxStreak: 0, perfectDays: 0, questDP: 0 };

    if (sData.freezes === undefined) sData.freezes = 1;
    if (!Array.isArray(sData.frozenDays)) sData.frozenDays = [];
    if (!Array.isArray(sData.repairedDays)) sData.repairedDays = [];

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayMidnight = todayMidnight - 24 * 60 * 60 * 1000;
    const yObj = new Date(yesterdayMidnight);
    const yesterdayKey = `${yObj.getFullYear()}-${String(yObj.getMonth() + 1).padStart(2, '0')}-${String(yObj.getDate()).padStart(2, '0')}`;
    const dayMs = 24 * 60 * 60 * 1000;

    // Week start (Monday 00:00 local time)
    const dayOfWeek = now.getDay();
    const daysSinceMon = (dayOfWeek + 6) % 7;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMon, 0, 0, 0, 0);

    // Parse all checks
    const dailyStats = {}; // 'YYYY-MM-DD' -> { yr, mo, dy, checked, total, timestamp, isFrozen, isRepaired }
    const habitsList = Array.isArray(sData.h) ? sData.h : [];
    const checkMap = sData.c || {};
    const checkKeys = Object.keys(checkMap).filter(k => checkMap[k]);

    checkKeys.forEach(k => {
        const parts = k.includes('_') ? k.split('_') : k.split('-');
        if (parts.length < 4) return;
        const [yr, mo, hId, dy] = parts.map(Number);
        if (isNaN(yr) || isNaN(mo) || isNaN(dy)) return;

        totalChecks++;
        const dateKey = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(dy).padStart(2, '0')}`;
        if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = {
                yr, mo, dy,
                checked: 0,
                total: habitsList.length || 1,
                timestamp: new Date(yr, mo, dy).getTime(),
                isFrozen: false,
                isRepaired: false
            };
        }
        dailyStats[dateKey].checked++;

        // Weekly check
        const checkDate = new Date(yr, mo, dy);
        if (checkDate >= weekStart && checkDate <= now) weeklyChecks++;
    });

    // Merge frozen days
    (sData.frozenDays || []).forEach(fKey => {
        if (!dailyStats[fKey]) {
            const parts = fKey.split('-').map(Number);
            if (parts.length === 3) {
                dailyStats[fKey] = {
                    yr: parts[0], mo: parts[1] - 1, dy: parts[2],
                    checked: 0, total: habitsList.length || 1,
                    timestamp: new Date(parts[0], parts[1] - 1, parts[2]).getTime(),
                    isFrozen: true, isRepaired: false
                };
            }
        } else {
            dailyStats[fKey].isFrozen = true;
        }
    });

    // Merge repaired days
    (sData.repairedDays || []).forEach(rKey => {
        if (!dailyStats[rKey]) {
            const parts = rKey.split('-').map(Number);
            if (parts.length === 3) {
                dailyStats[rKey] = {
                    yr: parts[0], mo: parts[1] - 1, dy: parts[2],
                    checked: 0, total: habitsList.length || 1,
                    timestamp: new Date(parts[0], parts[1] - 1, parts[2]).getTime(),
                    isFrozen: false, isRepaired: true
                };
            }
        } else {
            dailyStats[rKey].isRepaired = true;
        }
    });

    // Perfect days & streak calculation
    const sortedDays = Object.values(dailyStats).sort((a, b) => a.timestamp - b.timestamp);
    let prevTimestamp = null;
    let runningStreak = 0;

    sortedDays.forEach(item => {
        if (item.total > 0 && item.checked >= item.total) perfectDays++;
        if (item.checked > 0 || item.isFrozen || item.isRepaired) {
            if (prevTimestamp !== null) {
                const diffDays = Math.round((item.timestamp - prevTimestamp) / dayMs);
                if (diffDays === 1) {
                    runningStreak += 1;
                } else if (diffDays > 1) {
                    runningStreak = 1;
                }
            } else {
                runningStreak = 1;
            }
            maxStreak = Math.max(maxStreak, runningStreak);
            prevTimestamp = item.timestamp;
        }
    });

    currentStreak = runningStreak;

    // Check if streak is still active
    let triggeredAutoFreeze = false;
    if (prevTimestamp !== null) {
        const daysDiffFromToday = Math.round((todayMidnight - prevTimestamp) / dayMs);
        if (daysDiffFromToday === 1) {
            // Checked yesterday, active today
        } else if (daysDiffFromToday > 1) {
            // Missed yesterday!
            if (daysDiffFromToday === 2 && !sData.frozenDays.includes(yesterdayKey) && !sData.repairedDays.includes(yesterdayKey)) {
                if (sData.freezes > 0 && runningStreak >= 1) {
                    // Auto-freeze!
                    sData.freezes--;
                    sData.frozenDays.push(yesterdayKey);
                    triggeredAutoFreeze = true;
                    if (!_hasShownAutoFreezeToast) {
                        _hasShownAutoFreezeToast = true;
                        setTimeout(() => {
                            if (typeof playFreezeSound === 'function') playFreezeSound();
                            alert(t('freezeAutoToast') || '🧊 Bình Đóng Băng đã tự động bảo vệ chuỗi của bạn hôm qua!');
                        }, 500);
                    }
                    return calculateUserDPAndStreak(sData);
                } else if (runningStreak >= 1) {
                    // Streak broke without freeze -> Record for 24h repair
                    if (!sData.lastStreakBreak || sData.lastStreakBreak.date !== yesterdayKey) {
                        sData.lastStreakBreak = {
                            date: yesterdayKey,
                            streakBeforeBreak: runningStreak,
                            timestamp: Date.now(),
                            repaired: false
                        };
                    }
                }
            }
            currentStreak = 0;
        }
    } else {
        currentStreak = 0;
    }

    // Calculate Base DP & Bonuses (with 2X Booster support)
    const isBoostActive = sData.inventory && sData.inventory.boost2xExpiresAt && Date.now() < sData.inventory.boost2xExpiresAt;
    const checkMultiplier = isBoostActive ? 2 : 1;
    let totalDP = totalChecks * 10 * checkMultiplier;
    totalDP += perfectDays * 30;
    if (maxStreak >= 7) totalDP += 50;
    if (maxStreak >= 30) totalDP += 500;
    if (maxStreak >= 100) totalDP += 2000;
    const questDP = (sData.questData && sData.questData.totalDP) || 0;
    totalDP += questDP;

    let weeklyDP = weeklyChecks * 10 * checkMultiplier;

    return { 
        totalDP, weeklyDP, totalChecks, weeklyChecks, currentStreak, maxStreak, perfectDays, questDP,
        freezes: sData.freezes || 0,
        frozenDays: sData.frozenDays || [],
        repairedDays: sData.repairedDays || [],
        lastStreakBreak: sData.lastStreakBreak || null
    };
}
window.calculateUserDPAndStreak = calculateUserDPAndStreak;
window._calculateUserDPAndStreak = calculateUserDPAndStreak;

function updateUserDPState(forceSync = false) {
    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const totalDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const streak = computed.currentStreak;
    const maxStreak = computed.maxStreak;
    const rank = getRankLevel(totalDP);

    S.dp = totalDP;
    S.streak = streak;
    S.maxStreak = maxStreak;
    S.rankLevel = rank.level;
    sv();

    if (currentUser) {
        showUserProfile(currentUser);
    }

    renderStreakShieldNavbar();
    renderStreakBanner();

    if (typeof updateBoost2xTimer === 'function') updateBoost2xTimer();

    const pModal = document.getElementById('profileModalBg');
    if (pModal && pModal.classList.contains('show') && window._updateProfileModalUI) {
        window._updateProfileModalUI();
    }

    const sModal = document.getElementById('streakModalBg');
    if (sModal && sModal.classList.contains('show') && typeof renderStreakProtectionUI === 'function') {
        renderStreakProtectionUI();
    }

    const shopModal = document.getElementById('shopModalBg');
    if (shopModal && shopModal.classList.contains('show') && typeof renderShopUI === 'function') {
        renderShopUI();
    }

    if (forceSync && typeof syncUserLeaderboard === 'function') {
        syncUserLeaderboard();
    }

    return { totalDP, streak, maxStreak, rank, stats: computed };
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

        // Check for existing bonus DP in users collection and leaderboard
        const lbDoc = await db.collection('leaderboard').doc(currentUser.uid).get();
        const lbData = lbDoc.exists ? lbDoc.data() : {};
        
        userBonusDP = userData.bonusDP || lbData.bonusDP || 0;

        const baseTotalDP = stats.totalDP + userBonusDP;
        const finalDP = isAdmin ? 999999 : baseTotalDP;
        const finalWeekly = isAdmin ? 99999 : stats.weeklyDP;

        S.dp = finalDP;
        S.streak = stats.currentStreak;
        S.maxStreak = stats.maxStreak;

        const displayName = userData.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        const photoURL = userData.photoURL || currentUser.photoURL || '';

        await db.collection('leaderboard').doc(currentUser.uid).set({
            uid: currentUser.uid,
            displayName: displayName,
            photoURL: photoURL,
            equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
            totalDP: finalDP,
            bonusDP: userBonusDP,
            weeklyDP: finalWeekly,
            streak: stats.currentStreak,
            maxStreak: stats.maxStreak,
            totalChecks: stats.totalChecks,
            perfectDays: stats.perfectDays,
            isAdmin: isAdmin || false,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        // Update UI
        showUserProfile(currentUser);
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
    
    const computed = calculateUserDPAndStreak();
    const isAdmin = userPlan && userPlan.role === 'admin';
    const totalDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const myStats = { ...computed, totalDP };
    const progInfo = getRankProgressInfo(myStats.totalDP);

    // Make sure local current user stats reflect in leaderboardCache
    if (currentUser && leaderboardCache.length > 0) {
        const meIndex = leaderboardCache.findIndex(e => e.uid === currentUser.uid);
        if (meIndex !== -1) {
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

    const top3 = leaderboardCache.slice(0, 3);
    const rest = leaderboardCache.slice(3);

    // Helper for rendering a single podium slot
    const renderPodiumSlot = (entry, rank) => {
        if (!entry) return `<div class="lb-podium-col rank-${rank} empty"></div>`;
        const tier = getRankLevel(entry.totalDP);
        const frameLevel = tier.level || 1;
        const isMe = entry.uid === currentUser?.uid;
        const hasKudos = kudosSet.has(entry.uid);
        const adminBadge = entry.isAdmin ? ' [Admin]' : '';
        const meBadge = isMe ? ' (Bạn)' : '';
        const avatarSrc = entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.displayName || 'U')}&background=0d1117&color=10b981&bold=true`;
        
        let crownOrBadge = `<div class="lb-crown">👑</div><div class="lb-podium-badge rank-1">1</div>`;
        if (rank === 2) {
            crownOrBadge = `<div class="lb-podium-badge rank-2">2</div>`;
        } else if (rank === 3) {
            crownOrBadge = `<div class="lb-podium-badge rank-3">3</div>`;
        }

        const avatarSize = rank === 1 ? 72 : (rank === 2 ? 62 : 56);
        const avatarHtml = window.getAvatarHTML ? window.getAvatarHTML(frameLevel, avatarSrc, avatarSize) : `<img class="lb-podium-avatar" src="${avatarSrc}" alt="" onerror="this.src='https://ui-avatars.com/api/?name=U&background=0d1117&color=10b981'">`;

        return `
            <div class="lb-podium-col rank-${rank} ${isMe ? 'lb-me-podium' : ''}" style="--rank-color:${tier.color}">
                <div class="lb-podium-user">
                    <div class="lb-avatar-wrap rank-${rank}">
                        ${crownOrBadge}
                        ${avatarHtml}
                    </div>
                    <div class="lb-podium-name" title="${escHtml(entry.displayName || 'User')}">${escHtml(entry.displayName || 'User')}${getUserTitleBadgeHTML(entry.equippedTitle)}${adminBadge}${meBadge}</div>
                    <div class="lb-podium-tier" style="color:${tier.color}">${getRankTierName(tier)}</div>
                    <div class="lb-podium-dp">${(entry.totalDP || 0).toLocaleString()} DP</div>
                    <div class="lb-podium-streak">🔥 ${entry.streak || 0}</div>
                    ${!isMe ? `<button class="lb-kudos-btn lb-podium-kudos ${hasKudos ? 'given' : ''}" onclick="window._giveKudos('${entry.uid}')" ${hasKudos ? 'disabled' : ''} title="Kudos">${hasKudos ? '❤️' : '👏'}</button>` : ''}
                </div>
                <div class="lb-podium-step rank-${rank}">
                    <div class="lb-step-glow"></div>
                    <span class="lb-step-num">${rank}</span>
                </div>
            </div>`;
    };

    // Render podium order: Rank 2 (Left), Rank 1 (Center, highest), Rank 3 (Right, lowest)
    const rank1 = top3[0] || null;
    const rank2 = top3[1] || null;
    const rank3 = top3[2] || null;

    let podiumHtml = `
        <div class="lb-podium-wrap">
            ${rank2 ? renderPodiumSlot(rank2, 2) : (top3.length > 1 ? renderPodiumSlot(null, 2) : '')}
            ${rank1 ? renderPodiumSlot(rank1, 1) : ''}
            ${rank3 ? renderPodiumSlot(rank3, 3) : (top3.length > 2 ? renderPodiumSlot(null, 3) : '')}
        </div>`;

    // Render bottom list for Top 4+
    let listHtml = '';
    if (rest.length > 0) {
        listHtml = `
            <div class="lb-list-wrap">
                <div class="lb-list-header">
                    <span>XẾP HẠNG TOP 4 - 50</span>
                </div>
                <div class="lb-list-items">
                    ${rest.map((entry, idx) => {
                        const rank = idx + 4;
                        const tier = getRankLevel(entry.totalDP);
                        const frameLevel = tier.level || 1;
                        const isMe = entry.uid === currentUser?.uid;
                        const medal = `#${rank}`;
                        const hasKudos = kudosSet.has(entry.uid);
                        const adminBadge = entry.isAdmin ? ' [Admin]' : '';
                        const meBadge = isMe ? ' (Bạn)' : '';
                        const avatarSrc = entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.displayName || 'U')}&background=0d1117&color=10b981&bold=true`;
                        const avatarHtml = window.getAvatarHTML ? window.getAvatarHTML(frameLevel, avatarSrc, 48) : `<img class="lb-avatar" src="${avatarSrc}" alt="" onerror="this.src='https://ui-avatars.com/api/?name=U&background=0d1117&color=10b981'">`;

                        return `<div class="lb-card ${isMe ? 'lb-me' : ''}" style="--rank-color:${tier.color}">
                            <div class="lb-rank-num">${medal}</div>
                            <div class="lb-card-avatar-wrap">
                                ${avatarHtml}
                            </div>
                            <div class="lb-info">
                                <div class="lb-name">${escHtml(entry.displayName || 'User')}${getUserTitleBadgeHTML(entry.equippedTitle)}${adminBadge}${meBadge}</div>
                                <div class="lb-tier">${getRankTierName(tier)} · ${(entry.totalDP || 0).toLocaleString()} DP</div>
                            </div>
                            <div class="lb-stats">
                                <span class="lb-streak">🔥 ${entry.streak || 0}</span>
                                ${!isMe ? `<button class="lb-kudos-btn ${hasKudos ? 'given' : ''}" onclick="window._giveKudos('${entry.uid}')" ${hasKudos ? 'disabled' : ''}>Kudos</button>` : ''}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
    }

    container.innerHTML = podiumHtml + listHtml;
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
    document.querySelectorAll('#lbModalBg .lb-tab-btn:not(.shop-tab-btn):not(.quest-tab-btn):not(.squad-tab-btn)').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === defaultTab);
    });
    document.querySelectorAll('.lb-tab-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`lbPanel${defaultTab.charAt(0).toUpperCase() + defaultTab.slice(1)}`);
    if (panel) panel.style.display = 'block';

    await loadLeaderboard();
    if (defaultTab === 'leaderboard') renderLeaderboard();
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

    const mobileLbBtn = document.getElementById('mobileLbBtn');
    if (mobileLbBtn) mobileLbBtn.onclick = () => openLeaderboardModal('leaderboard');

    // Tab switching
    document.querySelectorAll('#lbModalBg .lb-tab-btn:not(.shop-tab-btn):not(.quest-tab-btn):not(.squad-tab-btn)').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#lbModalBg .lb-tab-btn:not(.shop-tab-btn):not(.quest-tab-btn):not(.squad-tab-btn)').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.querySelectorAll('.lb-tab-panel').forEach(p => p.style.display = 'none');
            const panel = document.getElementById(`lbPanel${tab.charAt(0).toUpperCase()+tab.slice(1)}`);
            if (panel) panel.style.display = 'block';
            if (tab === 'leaderboard') renderLeaderboard();
            if (tab === 'ranks') renderRankTiersShowcase();
        };
    });
}

// ==================== STANDALONE COMMUNITY ====================
let currentMediaAttached = null; // { type: 'image' | 'video', dataUrl: string }
let communityPostsCache = [];
let openedCommentsSet = new Set();

function formatDetailedPostTime(ts) {
    if (!ts) return 'Vừa xong';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(date.getTime())) return 'Vừa xong';
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const timeOfDay = `${hours}:${mins}`;
    
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const fullDate = `${d}/${m}/${y}`;

    if (diffSec < 60) return `Vừa xong • ${timeOfDay}`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước • ${timeOfDay}`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24 && date.getDate() === now.getDate()) {
        return `${diffHour} giờ trước • ${timeOfDay}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
        return `Hôm qua lúc ${timeOfDay}`;
    }

    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) {
        return `${diffDay} ngày trước • ${fullDate} (${timeOfDay})`;
    }
    
    return `${fullDate} lúc ${timeOfDay}`;
}

window._openLightbox = function(url) {
    const modal = document.getElementById('cmLightboxModal');
    const img = document.getElementById('cmLightboxImg');
    if (modal && img) {
        img.src = url;
        modal.style.display = 'flex';
    }
};

window._openCommunity = async function() {
    const modal = document.getElementById('communityModalBg');
    if (!modal) return;
    modal.classList.add('show');
    
    // Update current user info in creator card
    if (currentUser) {
        const nameEl = document.getElementById('cmUserName');
        const badgeEl = document.getElementById('cmUserBadge');
        const avatarMini = document.getElementById('cmUserAvatarMini');
        const computed = calculateUserDPAndStreak();
        const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (currentUser && currentUser.email === 'admin@gmail.com');
        const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
        const rank = getRankLevel(dp);
        const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Chiến Binh';
        
        if (nameEl) nameEl.textContent = displayName;
        if (badgeEl) badgeEl.textContent = getRankTierName(rank);
        if (avatarMini && window.getAvatarHTML) {
            const imgUrl = currentUser.photoURL || `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>`;
            avatarMini.innerHTML = window.getAvatarHTML(rank.level, imgUrl, 36);
        }
    }
    await renderCommunity();
};

function closeCommunityModal() {
    const modal = document.getElementById('communityModalBg');
    if (modal) modal.classList.remove('show');
}

window._toggleComments = function(postId) {
    if (openedCommentsSet.has(postId)) {
        openedCommentsSet.delete(postId);
    } else {
        openedCommentsSet.add(postId);
    }
    const section = document.getElementById(`comments-${postId}`);
    const toggleBtn = document.getElementById(`cmCommentBtn-${postId}`);
    if (section) {
        const isShown = openedCommentsSet.has(postId);
        section.style.display = isShown ? 'flex' : 'none';
        if (toggleBtn) toggleBtn.classList.toggle('active', isShown);
        if (isShown) {
            const input = document.getElementById(`cmCommentInput-${postId}`);
            if (input) input.focus();
        }
    }
};

window._submitComment = async function(postId) {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để bình luận!');
        return;
    }
    const input = document.getElementById(`cmCommentInput-${postId}`);
    if (!input) return;
    const content = input.value.trim();
    if (!content) return;
    
    input.value = '';
    const computed = calculateUserDPAndStreak();
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (currentUser && currentUser.email === 'admin@gmail.com');
    const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const rank = getRankLevel(dp);
    
    const newComment = {
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        photoURL: currentUser.photoURL || '',
        equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
        rankLevel: rank.level,
        content: content,
        createdAt: new Date().toISOString()
    };
    
    try {
        openedCommentsSet.add(postId);
        await db.collection('community_posts').doc(postId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment)
        });
        await renderCommunity(false);
    } catch (e) {
        alert('Lỗi gửi bình luận: ' + e.message);
    }
};

window._deleteComment = async function(postId, commentId) {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
        const postRef = db.collection('community_posts').doc(postId);
        const doc = await postRef.get();
        if (!doc.exists) return;
        const p = doc.data();
        const currentComments = Array.isArray(p.comments) ? p.comments : [];
        const filtered = currentComments.filter(c => c.id !== commentId);
        
        await postRef.update({
            comments: filtered
        });
        await renderCommunity(false);
    } catch (e) {
        alert('Lỗi xóa bình luận: ' + e.message);
    }
};

async function renderCommunity(forceReload = false) {
    const container = document.getElementById('communityFeedContainer');
    if (!container) return;
    try {
        if (forceReload || !container.children.length) {
            container.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:13px;">⏳ Đang tải bài viết cộng đồng...</div>';
        }
        const snap = await db.collection('community_posts').orderBy('createdAt', 'desc').limit(40).get();
        communityPostsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (snap.empty) {
            container.innerHTML = '<div class="lb-empty">💬 Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ hành trình rèn luyện!</div>';
            return;
        }
        
        const currentUid = currentUser ? currentUser.uid : null;
        const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (currentUser && currentUser.email === 'admin@gmail.com');
        
        let html = '';
        snap.forEach(doc => {
            const p = doc.data();
            const timeStr = formatDetailedPostTime(p.createdAt);
            const rankLvl = p.rankLevel || (p.userDP ? getRankLevel(p.userDP).level : 1);
            const rankTier = RANK_TIERS[rankLvl - 1] || RANK_TIERS[0];
            const rankName = getRankTierName(rankTier);
            const avatarSrc = p.photoURL || `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>`;
            const avatarHtml = window.getAvatarHTML ? window.getAvatarHTML(rankLvl, avatarSrc, 38) : `<img class="cm-avatar" src="${avatarSrc}" alt="">`;
            
            const isLiked = currentUid && Array.isArray(p.likedBy) && p.likedBy.includes(currentUid);
            const canDelete = currentUid && (p.uid === currentUid || isAdmin);
            
            const comments = Array.isArray(p.comments) ? p.comments : [];
            const isCommentsOpen = openedCommentsSet.has(doc.id);
            
            let mediaHtml = '';
            if (p.mediaUrl) {
                if (p.mediaType === 'video') {
                    mediaHtml = `<div class="cm-post-media"><video class="cm-post-video" src="${p.mediaUrl}" controls playsinline preload="metadata"></video></div>`;
                } else {
                    mediaHtml = `<div class="cm-post-media"><img class="cm-post-img" src="${p.mediaUrl}" alt="Ảnh đính kèm" onclick="window._openLightbox('${p.mediaUrl}')" loading="lazy"></div>`;
                }
            }
            
            // Comments list HTML
            let commentsHtml = '';
            if (comments.length > 0) {
                comments.forEach(c => {
                    const cRankLvl = c.rankLevel || 1;
                    const cRankTier = RANK_TIERS[cRankLvl - 1] || RANK_TIERS[0];
                    const cRankName = getRankTierName(cRankTier);
                    const cTimeStr = formatDetailedPostTime(c.createdAt);
                    const cAvatarSrc = c.photoURL || `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>`;
                    const canDeleteComment = currentUid && (c.uid === currentUid || p.uid === currentUid || isAdmin);
                    
                    commentsHtml += `<div class="cm-comment-item">
                        <img class="cm-comment-avatar" src="${cAvatarSrc}" alt="">
                        <div class="cm-comment-bubble">
                            <div class="cm-comment-header">
                                <div class="cm-comment-author-name">
                                    <span>${escHtml(c.displayName || 'User')}</span>
                                    ${getUserTitleBadgeHTML(c.equippedTitle)}
                                    <span class="cm-comment-rank-badge">${cRankName}</span>
                                </div>
                                <span class="cm-comment-time">${cTimeStr}</span>
                            </div>
                            <div class="cm-comment-content">${escHtml(c.content || '')}</div>
                            ${canDeleteComment ? `<button class="cm-comment-delete-btn" onclick="window._deleteComment('${doc.id}', '${c.id}')" title="Xóa bình luận">✕</button>` : ''}
                        </div>
                    </div>`;
                });
            } else {
                commentsHtml = '<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:6px 0;">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>';
            }
            
            html += `<div class="cm-post-card" id="post-${doc.id}">
                <div class="cm-post-author">
                    <div class="cm-post-author-left">
                        <div class="cm-post-avatar-wrap">${avatarHtml}</div>
                        <div class="cm-post-author-info">
                            <div class="cm-post-author-name">
                                <span>${escHtml(p.displayName || 'User')}</span>
                                ${getUserTitleBadgeHTML(p.equippedTitle)}
                                <span class="cm-post-author-rank">${rankName}</span>
                            </div>
                            <span class="cm-post-time">📅 ${timeStr}</span>
                        </div>
                    </div>
                    ${canDelete ? `<button class="cm-delete-btn" onclick="window._deleteCmPost('${doc.id}')" title="Xóa bài viết">🗑️</button>` : ''}
                </div>
                ${p.content ? `<div class="cm-post-text">${escHtml(p.content)}</div>` : ''}
                ${mediaHtml}
                <div class="cm-post-actions">
                    <div class="cm-post-actions-left">
                        <button class="cm-like-btn ${isLiked ? 'liked' : ''}" onclick="window._likeCmPost('${doc.id}')">
                            ${isLiked ? '❤️' : '🤍'} <span>${p.likes || (Array.isArray(p.likedBy) ? p.likedBy.length : 0) || 0} Thích</span>
                        </button>
                        <button class="cm-comment-toggle-btn ${isCommentsOpen ? 'active' : ''}" id="cmCommentBtn-${doc.id}" onclick="window._toggleComments('${doc.id}')">
                            💬 <span>${comments.length} Bình luận</span>
                        </button>
                    </div>
                </div>
                <div class="cm-comments-section" id="comments-${doc.id}" style="display:${isCommentsOpen ? 'flex' : 'none'};">
                    <div class="cm-comment-input-box">
                        <input type="text" id="cmCommentInput-${doc.id}" class="cm-comment-input" placeholder="Viết bình luận của bạn..." maxlength="500" onkeydown="if(event.key==='Enter') window._submitComment('${doc.id}')">
                        <button type="button" class="cm-comment-send-btn" onclick="window._submitComment('${doc.id}')">Gửi 💬</button>
                    </div>
                    <div class="cm-comment-list">${commentsHtml}</div>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    } catch (e) {
        console.error('Community load error:', e);
        container.innerHTML = '<div class="lb-empty">Lỗi tải cộng đồng: ' + (e.message || e) + '</div>';
    }
}

window._likeCmPost = async (postId) => {
    if (!currentUser) return;
    try {
        const postRef = db.collection('community_posts').doc(postId);
        const doc = await postRef.get();
        if (!doc.exists) return;
        const p = doc.data();
        let likedBy = Array.isArray(p.likedBy) ? [...p.likedBy] : [];
        const idx = likedBy.indexOf(currentUser.uid);
        let newLikes = p.likes || 0;
        
        if (idx === -1) {
            likedBy.push(currentUser.uid);
            newLikes += 1;
        } else {
            likedBy.splice(idx, 1);
            newLikes = Math.max(0, newLikes - 1);
        }
        
        await postRef.update({
            likes: newLikes,
            likedBy: likedBy
        });
        renderCommunity();
    } catch (e) { console.warn('Like error:', e); }
};

window._deleteCmPost = async (postId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
        await db.collection('community_posts').doc(postId).delete();
        renderCommunity(true);
    } catch (e) {
        alert('Lỗi xóa bài: ' + e.message);
    }
};

window._submitCmPost = async () => {
    const input = document.getElementById('cmPostInput');
    const submitBtn = document.getElementById('cmSubmitBtn');
    const content = input ? input.value.trim() : '';
    
    if (!content && !currentMediaAttached) {
        alert('Vui lòng nhập nội dung hoặc đính kèm ảnh/video trước khi đăng bài!');
        return;
    }
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ <span>Đang đăng...</span>';
    }
    
    try {
        const computed = calculateUserDPAndStreak();
        const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (currentUser && currentUser.email === 'admin@gmail.com');
        const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
        const rank = getRankLevel(dp);
        
        await db.collection('community_posts').add({
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || '',
            equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
            userDP: dp,
            rankLevel: rank.level,
            content: content,
            mediaUrl: currentMediaAttached ? currentMediaAttached.dataUrl : null,
            mediaType: currentMediaAttached ? currentMediaAttached.type : null,
            likes: 0,
            likedBy: [],
            comments: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        if (input) input.value = '';
        currentMediaAttached = null;
        const preview = document.getElementById('cmMediaPreview');
        const container = document.getElementById('cmMediaContainer');
        if (preview) preview.style.display = 'none';
        if (container) container.innerHTML = '';
        
        // Reset file inputs
        const imgInput = document.getElementById('cmImageFileInput');
        const vidInput = document.getElementById('cmVideoFileInput');
        if (imgInput) imgInput.value = '';
        if (vidInput) vidInput.value = '';
        
        await renderCommunity(true);
        
        // Update quest progress for community post if needed
        if (typeof updateUserDPState === 'function') {
            updateUserDPState(true);
        }
    } catch (e) {
        alert('Lỗi đăng bài: ' + e.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> <span>Đăng bài</span>';
        }
    }
};

function initCommunity() {
    const closeBtn = document.getElementById('communityCloseBtn');
    if (closeBtn) closeBtn.onclick = closeCommunityModal;
    
    const bg = document.getElementById('communityModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) closeCommunityModal(); };
    
    const cmBtn = document.getElementById('communityBtn');
    if (cmBtn) cmBtn.onclick = () => window._openCommunity();
    
    const mobileCmBtn = document.getElementById('mobileCommunityBtn');
    if (mobileCmBtn) mobileCmBtn.onclick = () => window._openCommunity();
    
    // Image attachment
    const attachImgBtn = document.getElementById('cmAttachImageBtn');
    const imgFileInput = document.getElementById('cmImageFileInput');
    if (attachImgBtn && imgFileInput) {
        attachImgBtn.onclick = () => imgFileInput.click();
        imgFileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                await new Promise(res => img.onload = res);
                
                const canvas = document.createElement('canvas');
                const MAX_DIM = 1200;
                let w = img.width, h = img.height;
                if (w > h) { if (w > MAX_DIM) { h *= MAX_DIM / w; w = MAX_DIM; } }
                else { if (h > MAX_DIM) { w *= MAX_DIM / h; h = MAX_DIM; } }
                
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
                
                currentMediaAttached = { type: 'image', dataUrl: compressedDataUrl };
                
                const preview = document.getElementById('cmMediaPreview');
                const container = document.getElementById('cmMediaContainer');
                if (preview && container) {
                    container.innerHTML = `<img src="${compressedDataUrl}" alt="Preview" style="max-width:100%; max-height:270px; object-fit:contain;">`;
                    preview.style.display = 'flex';
                }
            } catch (err) {
                console.error('Image process error:', err);
                alert('Lỗi xử lý ảnh: ' + err.message);
            }
        };
    }
    
    // Video attachment
    const attachVidBtn = document.getElementById('cmAttachVideoBtn');
    const vidFileInput = document.getElementById('cmVideoFileInput');
    if (attachVidBtn && vidFileInput) {
        attachVidBtn.onclick = () => vidFileInput.click();
        vidFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 15 * 1024 * 1024) {
                alert('Vui lòng chọn video có dung lượng dưới 15MB để đảm bảo tải nhanh!');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                currentMediaAttached = { type: 'video', dataUrl: dataUrl };
                
                const preview = document.getElementById('cmMediaPreview');
                const container = document.getElementById('cmMediaContainer');
                if (preview && container) {
                    container.innerHTML = `<video src="${dataUrl}" controls playsinline style="max-height:270px; width:100%;"></video>`;
                    preview.style.display = 'flex';
                }
            };
            reader.readAsDataURL(file);
        };
    }
    
    // Remove media attachment
    const removeMediaBtn = document.getElementById('cmRemoveMediaBtn');
    if (removeMediaBtn) {
        removeMediaBtn.onclick = () => {
            currentMediaAttached = null;
            const preview = document.getElementById('cmMediaPreview');
            const container = document.getElementById('cmMediaContainer');
            if (preview) preview.style.display = 'none';
            if (container) container.innerHTML = '';
            if (imgFileInput) imgFileInput.value = '';
            if (vidFileInput) vidFileInput.value = '';
        };
    }
}

// ==================== RANK TIERS SHOWCASE ====================
function renderRankTiersShowcase() {
    const container = document.getElementById('rankTiersContainer');
    if (!container) return;
    const computed = calculateUserDPAndStreak();
    const isAdmin = userPlan && userPlan.role === 'admin';
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const imgUrl = currentUser?.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser?.displayName||currentUser?.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;

    let html = '<div class="rank-showcase-grid" style="display:flex; flex-direction:column; gap:16px; align-items:center;">';
    
    RANK_TIERS.forEach((tier, idx) => {
        const level = idx + 1;
        const achieved = myDP >= tier.minDp;
        const cardHtml = window.getFullRankCardHTML ? window.getFullRankCardHTML(level, imgUrl, 0.65, currentUser?.displayName || 'User', getRankTierName(tier)) : '';
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
    { id:'d_earlybird', type:'daily', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', name:'Chim Sớm', nameEn:'Early Bird', nameZh:'早起鸟', desc:'Check thói quen trước 7h sáng', dp:20,
      check: (ctx) => ctx.firstCheckHour !== null && ctx.firstCheckHour < 7 },
    { id:'d_morning_gold', type:'daily', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg>', name:'Buổi Sáng Vàng', nameEn:'Golden Morning', nameZh:'黄金早晨', desc:'Hoàn thành ≥3 thói quen trước 9h', dp:40,
      check: (ctx) => ctx.checksBeforeHour9 >= 3 },
    { id:'d_perfect', type:'daily', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg>', name:'Ngày Không Lùi Bước', nameEn:'No Retreat', nameZh:'不退缩', desc:'100% thói quen hôm nay', dp:50,
      check: (ctx) => ctx.todayPct === 100 && ctx.totalHabits > 0 },
    { id:'d_reflect', type:'daily', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg>', name:'Suy Ngẫm', nameEn:'Reflect', nameZh:'反思', desc:'Viết ghi chú ≥50 chữ', dp:15,
      check: (ctx) => ctx.todayNoteLen >= 50 },
    // Weekly
    { id:'w_weekend', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg>', name:'Chiến Binh Cuối Tuần', nameEn:'Weekend Warrior', nameZh:'周末战士', desc:'100% cả T7 và CN', dp:120,
      check: (ctx) => ctx.satPct === 100 && ctx.sunPct === 100 },
    { id:'w_new_habit', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>', name:'Thử Thách Mới', nameEn:'New Challenge', nameZh:'新挑战', desc:'Thêm 1 thói quen mới, hoàn thành ≥3 ngày', dp:100,
      check: (ctx) => ctx.newHabitDays >= 3 },
    { id:'w_steel', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-target"></use></svg>', name:'Tuần Thép', nameEn:'Steel Week', nameZh:'钢铁周', desc:'Check-in 7/7 ngày', dp:100,
      check: (ctx) => ctx.daysWithChecks >= 7 },
    { id:'w_no_quit', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-crescent"></use></svg>', name:'Quy Tắc Không Bỏ Cuộc', nameEn:'No Quit Rule', nameZh:'不放弃', desc:'Duy trì thói quen "Không" 7 ngày', dp:80,
      check: (ctx) => ctx.noHabitStreak >= 7 },
    // Community Weekly
    { id:'w_share', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-echo"></use></svg>', name:'Chia Sẻ Hành Trình', nameEn:'Share Journey', nameZh:'分享旅程', desc:'Đăng 1 bài cộng đồng', dp:60,
      check: (ctx) => ctx.weeklyPosts >= 1 },
    { id:'w_kudos', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', name:'Người Truyền Lửa', nameEn:'Fire Starter', nameZh:'传火者', desc:'Tặng Kudos ≥5 người', dp:40,
      check: (ctx) => kudosSet.size >= 5 },
    { id:'w_mentor', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-dp"></use></svg>', name:'Mentor', nameEn:'Mentor', nameZh:'导师', desc:'Bình luận ≥3 bài viết', dp:50,
      check: (ctx) => ctx.weeklyComments >= 3 },
    { id:'w_inspire', type:'weekly', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', name:'Người Truyền Cảm Hứng', nameEn:'Inspirator', nameZh:'激励者', desc:'Bài viết nhận ≥5 likes', dp:80,
      check: (ctx) => ctx.maxPostLikes >= 5 },
    // Achievement (permanent)
    { id:'a_first_day', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', name:'Ngày Đầu Tiên', nameEn:'First Day', nameZh:'第一天', desc:'100% lần đầu tiên', dp:50,
      check: (ctx) => ctx.perfectDays >= 1 },
    { id:'a_streak30', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-streak"></use></svg>', name:'Lửa Không Tắt', nameEn:'Eternal Flame', nameZh:'永恒之火', desc:'Chuỗi 30 ngày', dp:500,
      check: (ctx) => ctx.maxStreak >= 30 },
    { id:'a_streak100', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>', name:'Kim Cương', nameEn:'Diamond', nameZh:'钻石', desc:'Chuỗi 100 ngày', dp:2000,
      check: (ctx) => ctx.maxStreak >= 100 },
    { id:'a_1000checks', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg>', name:'Huyền Thoại', nameEn:'Legend', nameZh:'传说', desc:'1000 lần check', dp:1000,
      check: (ctx) => ctx.totalChecks >= 1000 },
    { id:'a_multi', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg>', name:'Chiến Binh Đa Năng', nameEn:'Versatile', nameZh:'多才多艺', desc:'≥5 thói quen 1 tuần', dp:100,
      check: (ctx) => ctx.totalHabits >= 5 },
    { id:'a_month', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-metric"></use></svg>', name:'Tháng Thép', nameEn:'Steel Month', nameZh:'钢铁月', desc:'≥80% cả tháng', dp:300,
      check: (ctx) => ctx.monthPct >= 80 },
    { id:'a_comm10', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-echo"></use></svg>', name:'Linh Hồn Cộng Đồng', nameEn:'Community Soul', nameZh:'社区灵魂', desc:'10 bài viết', dp:200,
      check: (ctx) => ctx.totalPosts >= 10 },
    { id:'a_kudos50', type:'achievement', icon:'<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-duel"></use></svg>', name:'Đồng Đội Tuyệt Vời', nameEn:'Great Teammate', nameZh:'好队友', desc:'50 Kudos cho người khác', dp:150,
      check: (ctx) => kudosSet.size >= 50 },
];

function getLocalDateKey(d = new Date()) {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
}

function getLocalMondayKey(d = new Date()) {
    const day = d.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
    return getLocalDateKey(monday);
}

function initQuestData() {
    if (!S.questData) S.questData = { claimed: {}, totalDP: 0, lastDailyReset: '', lastWeeklyReset: '' };
    const todayKey = getLocalDateKey();
    const weekKey = getLocalMondayKey();

    // Auto-reset daily at 00:00 local time
    if (S.questData.lastDailyReset !== todayKey) {
        QUEST_DEFINITIONS.filter(q => q.type === 'daily').forEach(q => { delete S.questData.claimed[q.id]; });
        S.questData.lastDailyReset = todayKey;
    }
    // Auto-reset weekly at Monday 00:00 local time
    if (S.questData.lastWeeklyReset !== weekKey) {
        QUEST_DEFINITIONS.filter(q => q.type === 'weekly').forEach(q => { delete S.questData.claimed[q.id]; });
        S.questData.lastWeeklyReset = weekKey;
    }
    sv();
}

function getQuestContext() {
    const stats = calculateUserDPAndStreak();
    const now = new Date();

    // Today pct
    let todayChecked = 0;
    S.h.forEach(h => { if (S.c[ck(h.id, todayD)]) todayChecked++; });
    const todayPct = S.h.length > 0 ? Math.round(todayChecked / S.h.length * 100) : 0;

    // Today note length
    const noteKey = `${cY}-${cM}-${todayD}`;
    const todayNoteLen = (S.notes && S.notes[noteKey]) ? S.notes[noteKey].length : 0;

    // Time-based checks
    const currentHour = now.getHours();
    const firstCheckHour = todayChecked > 0 ? currentHour : null;
    const checksBeforeHour9 = currentHour < 9 ? todayChecked : 0;

    // Weekend pct (Saturday & Sunday of this current week)
    const dayOfWeek = now.getDay();
    const daysSinceMon = (dayOfWeek + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMon);
    const thisWeekSat = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5);
    const thisWeekSun = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

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
    let daysWithChecks = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
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
        weeklyPosts: (typeof communityPostsCache !== 'undefined' && currentUser) ? communityPostsCache.filter(p => p.uid === currentUser.uid).length : 0,
        weeklyComments: 0, maxPostLikes: 0, totalPosts: 0,
    };
}

window.claimQuestReward = async function(questId) {
    if (!S.questData) initQuestData();
    if (!S.questData.claimed) S.questData.claimed = {};
    const quest = QUEST_DEFINITIONS.find(q => q.id === questId);
    if (!quest) return;
    if (S.questData.claimed[questId]) return;

    // Check if criteria still met
    const ctx = getQuestContext();
    if (!quest.check(ctx)) {
        alert('Nhiệm vụ chưa đủ điều kiện nhận thưởng!');
        return;
    }

    S.questData.claimed[questId] = Date.now();
    S.questData.totalDP = (S.questData.totalDP || 0) + quest.dp;
    sv();

    // Toast celebration
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>${quest.icon}</span> +${quest.dp} DP — ${t('questClaimedToast') || 'Đã nhận thưởng DP!'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

    // Fire celebratory confetti!
    if (typeof fireConfetti === 'function') fireConfetti();

    // Sync leaderboard & rank calculations
    if (typeof syncUserLeaderboard === 'function') {
        await syncUserLeaderboard();
    }

    // Update Profile Nameplate & Modal
    if (currentUser) {
        showUserProfile(currentUser);
        if (window._updateProfileModalUI) window._updateProfileModalUI();
    }

    // Re-render quest panel
    renderQuestPanel();
};
window._claimQuestReward = window.claimQuestReward;

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
                    ${claimed ? `<span class="quest-status-done"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> ${t('questClaimed')}</span>` :
                      completed ? `<button class="quest-claim-btn" onclick="window.claimQuestReward('${q.id}')">${t('questClaim')}</button>` :
                      `<span class="quest-status-locked"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-close"></use></svg> ${t('questLocked')}</span>`}
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
    initStreakModal();
    initShopModal();
    initSquadHubModal();
    initRecapAndShareModals();
    initPomodoroModal();
    renderDailyQuoteWidget();
    checkWeeklyRecapAutoPrompt();
    startBoostCountdown();
}

// ==================== PROFILE MODAL & AVATAR ====================
window._updateProfileModalUI = () => {
    if (!currentUser) return;
    const computed = calculateUserDPAndStreak();
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const streak = computed.currentStreak;
    const rank = getRankLevel(dp);

    S.dp = dp;
    S.streak = streak;

    const pName = document.getElementById('profileName');
    const pLevel = document.getElementById('profileLevel');
    const pDP = document.getElementById('profileDP');
    const pStreak = document.getElementById('profileStreak');

    const titleBadge = getUserTitleBadgeHTML();
    if (pName) pName.innerHTML = `${escHtml(currentUser.displayName || currentUser.email || 'User')}${titleBadge}`;
    if (pLevel) pLevel.textContent = getRankTierName(rank);
    if (pDP) pDP.textContent = dp.toLocaleString();
    if (pStreak) pStreak.textContent = streak;

    const pAvatar = document.getElementById('profileAvatar');
    const pFrame = document.getElementById('profileAvatarFrame');
    
    const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const rankTitle = getRankTierName(rank);

    if (pFrame && window.getAvatarHTML) {
        pFrame.innerHTML = window.getAvatarHTML(rank.level, imgUrl, 90);
        pFrame.style.background = 'transparent';
        pFrame.style.border = 'none';
    } else if (pAvatar) {
        pAvatar.src = imgUrl;
        if (pFrame) pFrame.dataset.level = rank.level;
    }
    
    renderFramesGrid(rank.level, imgUrl);

    // === RENDER OWNED THEMES IN PROFILE ===
    const themeGrid = document.getElementById('profileThemeGrid');
    if (themeGrid && typeof SHOP_CATALOG !== 'undefined') {
        const ownedThemes = S.inventory?.themes || ['dark', 'light'];
        const equippedTheme = curTheme || 'light';
        let themeHtml = '';
        SHOP_CATALOG.themes.forEach(item => {
            const isOwned = item.free || ownedThemes.includes(item.id);
            if (!isOwned) return; // Only show owned themes
            const isActive = (equippedTheme === item.id);
            themeHtml += `
                <div class="profile-theme-card ${isActive ? 'active' : ''}" data-theme-id="${item.id}" onclick="window._switchToTheme('${item.id}'); if(window._updateProfileModalUI) window._updateProfileModalUI();">
                    <div class="ptc-preview" style="background: linear-gradient(135deg, ${item.bg}, ${item.accent});"></div>
                    <div class="ptc-info">
                        <div class="ptc-name">${item.name}</div>
                        <div class="ptc-status">${isActive ? 'Đang dùng' : 'Áp dụng'}</div>
                    </div>
                </div>
            `;
        });
        themeGrid.innerHTML = themeHtml;
    }

    // === RENDER LANGUAGE ACTIVE STATE ===
    const langBtns = document.querySelectorAll('#profileLangRow .profile-lang-pill');
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === curLang);
    });
};

window._openProfile = () => {
    const modal = document.getElementById('profileModalBg');
    if (!modal) return;
    modal.classList.add('show');
    window._updateProfileModalUI();
};

// === ORBITAL SUB-POPUP SYSTEM ===

/**
 * Compute the pixel position of an orbital button (data-pos 1–6)
 * within the 280×280 orbital ring, then decide where to anchor the popup.
 */
function getOrbitalBtnCenter(pos) {
    // data-pos angles: 1→-90°, 2→-30°, 3→30°, 4→90°, 5→150°, 6→210°
    const angleMap = { 1: -90, 2: -30, 3: 30, 4: 90, 5: 150, 6: 210 };
    const angleDeg = angleMap[pos] || 0;
    const rad = angleDeg * Math.PI / 180;
    const radius = 110;
    const cx = 140 + radius * Math.cos(rad);
    const cy = 140 + radius * Math.sin(rad);
    return { x: cx, y: cy, angleDeg };
}

let _activeOrbPopup = null;
let _activeOrbBtn = null;
let _activeOrbBackdrop = null;

function closeOrbitalPopup(immediate) {
    if (_activeOrbBackdrop) {
        _activeOrbBackdrop.remove();
        _activeOrbBackdrop = null;
    }

    const existing = _activeOrbPopup;
    if (!existing) return;

    if (_activeOrbBtn) {
        _activeOrbBtn.classList.remove('orb-active');
        _activeOrbBtn = null;
    }

    if (immediate) {
        existing.remove();
        _activeOrbPopup = null;
        return;
    }

    existing.classList.add('closing');
    _activeOrbPopup = null;
    setTimeout(() => existing.remove(), 200);
}

/**
 * Show a floating popup panel next to the clicked orbital button.
 * Uses position:fixed + getBoundingClientRect for screen-accurate placement.
 * @param {HTMLElement} btnEl - The orbital button element
 * @param {string} title - Header label for the popup
 * @param {Array} items - Array of { icon, label, desc?, action, danger? }
 */
function showOrbitalPopup(btnEl, title, items) {
    // If same button clicked again, toggle off
    if (_activeOrbBtn === btnEl) {
        closeOrbitalPopup();
        return;
    }

    // Close any existing popup first
    closeOrbitalPopup(true);

    // Build popup HTML
    let html = `<div class="orbital-popup-header">${title}</div>`;
    items.forEach((item, idx) => {
        if (idx > 0) html += '<div class="orbital-popup-divider"></div>';
        const dangerClass = item.danger ? ' danger' : '';
        const descHtml = item.desc ? `<div class="orbital-popup-item-desc">${item.desc}</div>` : '';
        html += `
            <div class="orbital-popup-item${dangerClass}" data-idx="${idx}">
                <div class="orbital-popup-item-icon">${item.icon}</div>
                <div>
                    <div class="orbital-popup-item-label">${item.label}</div>
                    ${descHtml}
                </div>
            </div>`;
    });

    const popup = document.createElement('div');
    popup.className = 'orbital-popup';
    popup.innerHTML = html;

    // Get button screen position
    const rect = btnEl.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let popupLeft, popupTop, originX, originY;
    const popupW = 200; // approximate popup width

    // Determine best placement based on button position on screen
    if (btnCx < vw / 2) {
        // Button on left half → show popup to the right
        popupLeft = rect.right + 8;
        originX = '0';
    } else {
        // Button on right half → show popup to the left
        popupLeft = rect.left - popupW - 8;
        originX = '100%';
    }

    if (btnCy < vh / 2) {
        // Button in top half → align popup top with button
        popupTop = rect.top - 10;
        originY = '20px';
    } else {
        // Button in bottom half → align popup bottom with button
        popupTop = rect.bottom - 140; // rough popup height offset
        originY = 'calc(100% - 20px)';
    }

    // Clamp to viewport
    popupLeft = Math.max(8, Math.min(popupLeft, vw - popupW - 8));
    popupTop = Math.max(8, popupTop);

    popup.style.left = popupLeft + 'px';
    popup.style.top = popupTop + 'px';
    popup.style.setProperty('--popup-origin', `${originX} ${originY}`);

    // Create invisible backdrop for click-outside
    const backdrop = document.createElement('div');
    backdrop.className = 'orbital-popup-backdrop';
    backdrop.onclick = () => closeOrbitalPopup();
    document.body.appendChild(backdrop);
    _activeOrbBackdrop = backdrop;

    // Append popup to body (fixed position, no clipping)
    document.body.appendChild(popup);

    popup.querySelectorAll('.orbital-popup-item').forEach(el => {
        const idx = parseInt(el.dataset.idx);
        el.onclick = (e) => {
            e.stopPropagation();
            closeOrbitalPopup();
            if (items[idx] && items[idx].action) {
                items[idx].action();
            }
        };
    });

    // Mark button as active
    btnEl.classList.add('orb-active');
    _activeOrbBtn = btnEl;
    _activeOrbPopup = popup;
}

// Close popup when profile modal closes
const _origProfileModalObserver = new MutationObserver(() => {
    const modal = document.getElementById('profileModalBg');
    if (modal && !modal.classList.contains('show')) {
        closeOrbitalPopup(true);
    }
});
setTimeout(() => {
    const modal = document.getElementById('profileModalBg');
    if (modal) _origProfileModalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
}, 500);

// === ORBITAL CONTENT POPUP (Second-level for rich content) ===
let _activeContentOverlay = null;

function closeOrbitalContentPopup() {
    if (!_activeContentOverlay) return;
    _activeContentOverlay.classList.add('closing');
    const ref = _activeContentOverlay;
    _activeContentOverlay = null;
    setTimeout(() => ref.remove(), 250);
}

/**
 * Show a centered overlay popup with rich content (theme grid, lang, name, frames).
 * @param {string} title - Header title
 * @param {Function} renderContent - Returns HTML string for the body
 * @param {Function} initCallback - Called with (bodyEl) after DOM insert to bind events
 */
function showOrbitalContentPopup(title, renderContent, initCallback) {
    // Close any existing
    if (_activeContentOverlay) {
        _activeContentOverlay.remove();
        _activeContentOverlay = null;
    }

    // Also close the orbital popup
    closeOrbitalPopup(true);

    const overlay = document.createElement('div');
    overlay.className = 'orbital-content-overlay';
    overlay.innerHTML = `
        <div class="orbital-content-popup">
            <div class="ocp-header">
                <div class="ocp-header-title">${title}</div>
                <button class="ocp-close-btn">✕</button>
            </div>
            <div class="ocp-body"></div>
        </div>`;

    const body = overlay.querySelector('.ocp-body');
    body.innerHTML = renderContent();

    // Close button
    overlay.querySelector('.ocp-close-btn').onclick = () => closeOrbitalContentPopup();
    // Click overlay background to close
    overlay.onclick = (e) => { if (e.target === overlay) closeOrbitalContentPopup(); };

    document.body.appendChild(overlay);
    _activeContentOverlay = overlay;

    // Init event handlers
    if (initCallback) initCallback(body);
}


function initProfileModal() {
    const closeBtn = document.getElementById('profileCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('profileModalBg').classList.remove('show');
    
    const bg = document.getElementById('profileModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) bg.classList.remove('show'); };

    // --- Helper ---
    const closeProfile = () => document.getElementById('profileModalBg').classList.remove('show');
    const fileInput = document.getElementById('avatarFileInput');
    if (fileInput) fileInput.onchange = handleAvatarUpload;

    // --- Orbital Popup Definitions ---

    // 🛒 Cửa hàng (pos 1)
    const orbShop = document.getElementById('orbShopBtn');
    if (orbShop) orbShop.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbShop, 'Cửa hàng', [
            { icon: '<svg class="rune-icon rune-stat" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg>', label: 'Danh hiệu', desc: 'Mua danh hiệu độc quyền', action: () => { closeProfile(); if (window._openShopModal) window._openShopModal('titles'); } },
            { icon: '<svg class="rune-icon rune-nav" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', label: 'Giao diện', desc: 'Chủ đề màu sắc', action: () => { closeProfile(); if (window._openShopModal) window._openShopModal('themes'); } },
            { icon: '<svg class="rune-icon rune-sound" viewBox="0 0 48 48"><use href="#i-disc"></use></svg>', label: 'Hiệu ứng', desc: 'Âm thanh & hình ảnh', action: () => { closeProfile(); if (window._openShopModal) window._openShopModal('fx'); } },
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>', label: 'Vật phẩm', desc: 'Freeze, Boost 2X...', action: () => { closeProfile(); if (window._openShopModal) window._openShopModal('items'); } },
        ]);
    };

    // 🧊 Bảo vệ chuỗi (pos 2)
    const orbStreak = document.getElementById('orbStreakBtn');
    if (orbStreak) orbStreak.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbStreak, 'Bảo vệ chuỗi', [
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>', label: 'Bình đóng băng', desc: 'Xem & kích hoạt Freeze', action: () => { closeProfile(); if (window._openStreakModal) window._openStreakModal(); } },
            { icon: '<svg class="rune-icon rune-stat" viewBox="0 0 48 48"><use href="#i-streak"></use></svg>', label: 'Cứu chuỗi ngay', desc: 'Hồi sinh chuỗi trong 24h', action: () => { closeProfile(); if (window._openStreakModal) window._openStreakModal(); } },
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-metric"></use></svg>', label: 'Lịch sử chuỗi', desc: 'Xem heatmap thói quen', action: () => {
                closeProfile();
                const hm = document.getElementById('heatmapGrid') || document.getElementById('streakSection');
                if (hm) hm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }},
        ]);
    };

    // 📊 Tổng kết (pos 3)
    const orbRecap = document.getElementById('orbRecapBtn');
    if (orbRecap) orbRecap.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbRecap, 'Tổng kết & Thống kê', [
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-metric"></use></svg>', label: 'Tổng kết tuần', desc: 'Weekly Recap Infographic', action: () => { closeProfile(); if (window._openWeeklyRecapModal) window._openWeeklyRecapModal(); } },
            { icon: '<svg class="rune-icon rune-stat" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg>', label: 'Thống kê chi tiết', desc: 'Biểu đồ & dữ liệu', action: () => {
                closeProfile();
                const statsEl = document.getElementById('statsSection') || document.querySelector('.top-right');
                if (statsEl) statsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }},
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-archive"></use></svg>', label: 'Sao chép thống kê', desc: 'Copy vào clipboard', action: () => {
                const computed = typeof calculateUserDPAndStreak === 'function' ? calculateUserDPAndStreak() : {};
                const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
                const text = `${name} — Habit Mastery\nDP: ${(computed.totalDP || 0).toLocaleString()}\nStreak: ${computed.currentStreak || 0} ngày\nMax Streak: ${computed.maxStreak || 0} ngày\nTổng check-in: ${computed.totalChecks || 0}`;
                navigator.clipboard.writeText(text).then(() => {
                    const toast = document.createElement('div');
                    toast.className = 'quest-toast';
                    toast.innerHTML = '<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg></span> Đã sao chép thống kê!';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.classList.add('show'), 10);
                    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
                });
            }},
        ]);
    };

    // 📸 Chia sẻ (pos 4)
    const orbShare = document.getElementById('orbShareBtn');
    if (orbShare) orbShare.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbShare, 'Chia sẻ & Khoe', [
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-lens"></use></svg>', label: 'Khoe thẻ Rank', desc: 'Xuất ảnh Story 9:16', action: () => { closeProfile(); if (window._openShareCardModal) window._openShareCardModal(); } },
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-metric"></use></svg>', label: 'Khoe tổng kết tuần', desc: 'Weekly Recap → Share', action: () => { closeProfile(); if (window._openWeeklyRecapModal) window._openWeeklyRecapModal(); } },
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-archive"></use></svg>', label: 'Sao chép thành tích', desc: 'Copy text thành tích', action: () => {
                const computed = typeof calculateUserDPAndStreak === 'function' ? calculateUserDPAndStreak() : {};
                const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
                const text = `${name} đang trên chuỗi ${computed.currentStreak || 0} ngày liên tiếp!\nTổng DP: ${(computed.totalDP || 0).toLocaleString()}\nMax Streak: ${computed.maxStreak || 0} ngày\n— Habit Mastery`;
                navigator.clipboard.writeText(text).then(() => {
                    const toast = document.createElement('div');
                    toast.className = 'quest-toast';
                    toast.innerHTML = '<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg></span> Đã sao chép thành tích!';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.classList.add('show'), 10);
                    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
                });
            }},
        ]);
    };

    // 📷 Avatar (pos 5)
    const orbAvatar = document.getElementById('orbAvatarBtn');
    if (orbAvatar) orbAvatar.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbAvatar, 'Ảnh đại diện', [
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-lens"></use></svg>', label: 'Tải ảnh lên', desc: 'Chọn ảnh từ thiết bị', action: () => { if (fileInput) fileInput.click(); } },
            { icon: '<svg class="rune-icon rune-nav" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg>', label: 'Chọn khung Rank', desc: 'Đổi khung cấp bậc', action: () => {
                showOrbitalContentPopup('<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg> Chọn khung Rank', () => {
                    const computed = calculateUserDPAndStreak();
                    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (currentUser && currentUser.email === 'admin@gmail.com');
                    const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
                    const rank = getRankLevel(dp);
                    const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                    let html = '<div class="ocp-frames-grid">';
                    for (let i = 1; i <= 10; i++) {
                        const isUnlocked = rank.level >= i;
                        const isCurrent = rank.level === i;
                        let cls = 'ocp-frame-item';
                        if (isCurrent) cls += ' current';
                        if (!isUnlocked) cls += ' locked';
                        let frameHTML = '';
                        if (window.getAvatarHTML) frameHTML = window.getAvatarHTML(i, imgUrl, 56);
                        html += `<div class="${cls}" data-level="${i}">
                            ${!isUnlocked ? '<div class="ocp-frame-lock"><svg class="rune-icon rune-xs" viewBox="0 0 48 48"><use href="#i-close"></use></svg></div>' : ''}
                            ${frameHTML}
                            <div class="ocp-frame-lv">${isCurrent ? 'Đang dùng' : isUnlocked ? 'Lv ' + i : 'Lv ' + i}</div>
                        </div>`;
                    }
                    html += '</div>';
                    return html;
                }, (body) => {
                    body.querySelectorAll('.ocp-frame-item:not(.locked)').forEach(el => {
                        el.onclick = () => {
                            const level = parseInt(el.dataset.level);
                            if (window._setProfileFrame) window._setProfileFrame(level);
                            closeOrbitalContentPopup();
                        };
                    });
                });
            }},
            { icon: '<svg class="rune-icon" style="color:#f87171" viewBox="0 0 48 48"><use href="#i-close"></use></svg>', label: 'Xóa ảnh đại diện', desc: 'Về avatar mặc định', danger: true, action: async () => {
                if (!confirm('Bạn có chắc muốn xóa ảnh đại diện?')) return;
                try {
                    if (currentUser) await currentUser.updateProfile({ photoURL: '' });
                    if (userDocRef) await userDocRef.update({ photoURL: '' });
                    showUserProfile(currentUser);
                    if (window._updateProfileModalUI) window._updateProfileModalUI();
                    const toast = document.createElement('div');
                    toast.className = 'quest-toast';
                    toast.innerHTML = '<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg></span> Đã xóa ảnh đại diện!';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.classList.add('show'), 10);
                    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
                } catch (err) {
                    console.error('Remove avatar error:', err);
                    alert('Lỗi xóa ảnh: ' + (err.message || err));
                }
            }},
        ]);
    };

    // ⚙️ Cài đặt (pos 6) — all content is shown inside content popups
    const orbSettings = document.getElementById('orbSettingsBtn');
    if (orbSettings) orbSettings.onclick = (e) => {
        e.stopPropagation();
        showOrbitalPopup(orbSettings, 'Cài đặt', [
            { icon: '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-core"></use></svg>', label: 'Đổi tên hiển thị', desc: 'Thay đổi tên nhân vật', action: () => {
                showOrbitalContentPopup('<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-core"></use></svg> Đổi tên hiển thị', () => {
                    const curName = currentUser?.displayName || currentUser?.email?.split('@')[0] || '';
                    return `<div class="ocp-name-section">
                        <div class="ocp-name-current">Tên hiện tại: <strong>${escHtml(curName)}</strong></div>
                        <input type="text" class="ocp-name-input" id="ocpNameInput" placeholder="Nhập tên mới (2 - 30 ký tự)..." maxlength="30" value="${escHtml(curName)}">
                        <div class="ocp-name-error" id="ocpNameError"></div>
                        <button class="ocp-name-save-btn" id="ocpNameSaveBtn"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Lưu tên mới</button>
                    </div>`;
                }, (body) => {
                    const inp = body.querySelector('#ocpNameInput');
                    const errEl = body.querySelector('#ocpNameError');
                    const saveBtn = body.querySelector('#ocpNameSaveBtn');
                    if (inp) setTimeout(() => inp.focus(), 100);
                    const doSave = async () => {
                        const val = inp.value.trim();
                        if (!val) { errEl.textContent = 'Vui lòng nhập tên hiển thị!'; errEl.style.display = 'block'; return; }
                        if (val.length < 2 || val.length > 30) { errEl.textContent = 'Tên phải từ 2 đến 30 ký tự!'; errEl.style.display = 'block'; return; }
                        if (val === currentUser?.displayName) { closeOrbitalContentPopup(); return; }
                        saveBtn.textContent = '⏳...'; saveBtn.disabled = true; errEl.style.display = 'none';
                        try {
                            if (currentUser) await currentUser.updateProfile({ displayName: val });
                            if (userDocRef) await userDocRef.update({ displayName: val });
                            if (db && currentUser) await db.collection('leaderboard').doc(currentUser.uid).set({ displayName: val }, { merge: true });
                            showUserProfile(currentUser);
                            if (window._updateProfileModalUI) window._updateProfileModalUI();
                            closeOrbitalContentPopup();
                            const toast = document.createElement('div'); toast.className = 'quest-toast';
                            toast.innerHTML = '<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-sigil"></use></svg></span> Đã đổi tên thành công!';
                            document.body.appendChild(toast);
                            setTimeout(() => toast.classList.add('show'), 10);
                            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
                        } catch (err) {
                            errEl.textContent = 'Lỗi: ' + (err.message || err); errEl.style.display = 'block';
                            saveBtn.innerHTML = '<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> Lưu tên mới'; saveBtn.disabled = false;
                        }
                    };
                    if (saveBtn) saveBtn.onclick = doSave;
                    if (inp) inp.onkeydown = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); doSave(); } };
                });
            }},
            { icon: '<svg class="rune-icon rune-stat" viewBox="0 0 48 48"><use href="#i-spark"></use></svg>', label: 'Đổi giao diện', desc: 'Chọn theme yêu thích', action: () => {
                showOrbitalContentPopup('<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Đổi giao diện', () => {
                    if (typeof SHOP_CATALOG === 'undefined') return '<p>Không tìm thấy danh sách giao diện.</p>';
                    const ownedThemes = (S.inventory?.themes) || ['dark', 'light'];
                    const equippedTheme = curTheme || 'light';
                    let html = '<div class="ocp-theme-grid">';
                    SHOP_CATALOG.themes.forEach(item => {
                        const isOwned = item.free || ownedThemes.includes(item.id);
                        if (!isOwned) return;
                        const isActive = (equippedTheme === item.id);
                        html += `<div class="ocp-theme-card ${isActive ? 'active' : ''}" data-theme-id="${item.id}">
                            <div class="ocp-theme-preview" style="background: linear-gradient(135deg, ${item.bg}, ${item.accent});"></div>
                            <div class="ocp-theme-info">
                                <div class="ocp-theme-name">${item.name}</div>
                                <div class="ocp-theme-status">${isActive ? 'Đang dùng' : 'Áp dụng'}</div>
                            </div>
                        </div>`;
                    });
                    html += '</div>';
                    html += '<div style="margin-top:12px;text-align:center;"><button class="ocp-name-save-btn" id="ocpBrowseShopBtn" style="background:rgba(255,255,255,0.08);color:var(--text-main);font-size:12px;padding:10px;"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-market"></use></svg> Mua thêm trong Cửa hàng</button></div>';
                    return html;
                }, (body) => {
                    body.querySelectorAll('.ocp-theme-card').forEach(card => {
                        card.onclick = () => {
                            const themeId = card.dataset.themeId;
                            if (window._switchToTheme) window._switchToTheme(themeId);
                            if (window._updateProfileModalUI) window._updateProfileModalUI();
                            closeOrbitalContentPopup();
                        };
                    });
                    const shopBtn = body.querySelector('#ocpBrowseShopBtn');
                    if (shopBtn) shopBtn.onclick = () => {
                        closeOrbitalContentPopup();
                        closeProfile();
                        if (window._openShopModal) window._openShopModal('themes');
                    };
                });
            }},
            { icon: '<svg class="rune-icon rune-nav" viewBox="0 0 48 48"><use href="#i-echo"></use></svg>', label: 'Ngôn ngữ', desc: 'Việt / 中文 / English', action: () => {
                showOrbitalContentPopup('<svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-echo"></use></svg> Ngôn ngữ', () => {
                    const langs = [
                        { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
                        { code: 'zh', flag: '🇨🇳', name: '中文 (Chinese)' },
                        { code: 'en', flag: '🇬🇧', name: 'English' }
                    ];
                    let html = '<div class="ocp-lang-grid">';
                    langs.forEach(l => {
                        const isActive = (typeof curLang !== 'undefined' && curLang === l.code);
                        html += `<div class="ocp-lang-item ${isActive ? 'active' : ''}" data-lang="${l.code}">
                            <span class="ocp-lang-flag">${l.flag}</span>
                            <span class="ocp-lang-label">${l.name}</span>
                            <span class="ocp-lang-check">✓</span>
                        </div>`;
                    });
                    html += '</div>';
                    return html;
                }, (body) => {
                    body.querySelectorAll('.ocp-lang-item').forEach(item => {
                        item.onclick = () => {
                            const lang = item.dataset.lang;
                            if (window._switchLang) window._switchLang(lang);
                            if (window._updateProfileModalUI) window._updateProfileModalUI();
                            closeOrbitalContentPopup();
                        };
                    });
                });
            }},
            { icon: '<svg class="rune-icon" style="color:#f87171" viewBox="0 0 48 48"><use href="#i-close"></use></svg>', label: 'Đăng xuất', danger: true, action: () => {
                if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản không?')) {
                    auth.signOut().then(() => {
                        window.location.href = 'auth.html';
                    });
                }
            }},
        ]);
    };

    // Profile Logout Handler (keep existing button in settings panel)
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');
    if (profileLogoutBtn) {
        profileLogoutBtn.onclick = () => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản không?')) {
                auth.signOut().then(() => {
                    window.location.href = 'auth.html';
                });
            }
        };
    }

    // Hide settings panel and logout from profile body (now accessible via orbital popups)
    const settingsPanel = document.getElementById('profileSettingsPanel');
    if (settingsPanel) settingsPanel.style.display = 'none';
    const logoutWrap = document.querySelector('.profile-logout-wrap');
    if (logoutWrap) logoutWrap.style.display = 'none';
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
            frameHTML = window.getFullRankCardHTML(i, imgUrl, 0.5, currentUser?.displayName || 'User', getRankTierName(RANK_TIERS[i-1]));
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
    const computed = calculateUserDPAndStreak();
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const dp = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const rank = getRankLevel(dp);
    // Ignore setting if level is locked
    if (level > rank.level) return;

    const imgUrl = currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2310b981'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(currentUser.displayName||currentUser.email||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const selectedRank = RANK_TIERS[level - 1] || rank;
    const rankTitle = getRankTierName(selectedRank);
    
    if (window.getAvatarHTML) {
        document.getElementById('profileAvatarFrame').innerHTML = window.getAvatarHTML(level, imgUrl, 90);
        document.getElementById('navAvatarFrame').innerHTML = window.getAvatarHTML(level, imgUrl, 40);
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
        uploadBtn.textContent = 'Xong';
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

// ==================== TRỤ CỘT 1: STREAK SHIELD & RECOVERY MODAL ====================

function renderStreakShieldNavbar() {
    const badge = document.getElementById('navFreezeCount');
    const pqaBadge = document.getElementById('orbFreezeCount');
    const freezeCount = (typeof S !== 'undefined' && S && typeof S.freezes === 'number') ? S.freezes : 0;
    if (badge) badge.textContent = `${freezeCount}/2`;
    if (pqaBadge) pqaBadge.textContent = `${freezeCount}/2`;
}

function renderStreakBanner() {
    const banner = document.getElementById('streakEmergencyBanner');
    if (!banner) return;
    const sBreak = (typeof S !== 'undefined' && S && S.lastStreakBreak) ? S.lastStreakBreak : null;
    const now = Date.now();
    const isWithin48h = sBreak && !sBreak.repaired && (now - (sBreak.timestamp || 0) < 48 * 60 * 60 * 1000);
    
    if (isWithin48h) {
        banner.style.display = 'block';
        const titleEl = document.getElementById('sebTitle');
        const descEl = document.getElementById('sebDesc');
        if (titleEl) {
            titleEl.textContent = `🚨 ${t('streakBroken')} - ${sBreak.streakBeforeBreak || ''} ${t('daysUnit')}!`;
        }
        if (descEl) {
            descEl.textContent = t('streakBrokenDesc');
        }
    } else {
        banner.style.display = 'none';
    }
}

function openStreakModal() {
    const modal = document.getElementById('streakModalBg');
    if (!modal) return;
    modal.classList.add('show');
    renderStreakProtectionUI();
}

window._openStreakModal = openStreakModal;

function renderStreakProtectionUI() {
    const body = document.getElementById('streakModalBody');
    if (!body) return;

    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));
    const streak = computed.currentStreak;
    const maxStreak = computed.maxStreak;
    const freezes = S.freezes || 0;
    const sBreak = S.lastStreakBreak;
    const hasBrokenStreak = sBreak && !sBreak.repaired && (Date.now() - (sBreak.timestamp || 0) < 48 * 60 * 60 * 1000);

    let statusBadgeHtml = '';
    let statusDescText = '';
    if (hasBrokenStreak) {
        statusBadgeHtml = `<span class="sm-status-badge danger">🚨 ${t('streakBroken')}</span>`;
        statusDescText = t('streakBrokenDesc');
    } else if (freezes > 0) {
        statusBadgeHtml = `<span class="sm-status-badge safe">🛡️ ${t('streakProtected')} (x${freezes})</span>`;
        statusDescText = t('streakSafeDesc');
    } else {
        statusBadgeHtml = `<span class="sm-status-badge warning">⚠️ ${t('streakDangerDesc')}</span>`;
        statusDescText = t('streakDangerDesc');
    }

    // Flask 1 & Flask 2
    const flask1Filled = freezes >= 1;
    const flask2Filled = freezes >= 2;

    // Shop buttons availability
    const canBuyFreeze = freezes < 2 && (myDP >= 200 || isAdmin);
    const canRepairStreak = hasBrokenStreak && (myDP >= 150 || isAdmin);

    // History items
    const frozenDays = Array.isArray(S.frozenDays) ? S.frozenDays : [];
    const repairedDays = Array.isArray(S.repairedDays) ? S.repairedDays : [];
    const allHistory = [
        ...frozenDays.map(d => ({ date: d, type: 'freeze' })),
        ...repairedDays.map(d => ({ date: d, type: 'repair' }))
    ].sort((a, b) => b.date.localeCompare(a.date));

    let historyHtml = '';
    if (allHistory.length === 0) {
        historyHtml = `<div class="sm-history-row" style="justify-content:center; opacity:0.6;">${t('noHistory')}</div>`;
    } else {
        allHistory.slice(0, 5).forEach(h => {
            const parts = h.date.split('-');
            const dateStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : h.date;
            const badge = h.type === 'freeze' ? 
                `<span style="color:#0284c7; font-weight:700;">🧊 ${t('streakFreeze')}</span>` : 
                `<span style="color:#f59e0b; font-weight:700;">⚡ ${t('repairStreak')}</span>`;
            historyHtml += `<div class="sm-history-row"><span>📅 ${dateStr}</span>${badge}</div>`;
        });
    }

    body.innerHTML = `
        <!-- STATUS CARD -->
        <div class="sm-status-card">
            <div class="sm-streak-main">
                <div class="sm-fire-icon">🔥</div>
                <div>
                    <div class="sm-streak-num">${streak} <span style="font-size:15px; font-weight:600; color:var(--text-muted);">${t('daysUnit')}</span></div>
                    <div class="sm-streak-label">${t('currentStreakLabel')} · ${t('maxStreakLabel')}: ${maxStreak} ${t('daysUnit')}</div>
                </div>
            </div>
            <div>
                ${statusBadgeHtml}
            </div>
        </div>
        <div style="font-size:12.5px; color:var(--text-muted); margin-top:-6px; text-align:center;">${statusDescText}</div>

        <!-- FLASKS INVENTORY -->
        <div>
            <div class="sm-section-title">
                <span>🎒 ${t('streakFreeze')}</span>
                <span>${freezes}/2 ${t('streakAvailable')}</span>
            </div>
            <div class="sm-flasks-grid">
                <div class="sm-flask-card ${flask1Filled ? 'filled' : 'empty'}">
                    <div class="sm-flask-art">${flask1Filled ? '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>' : '<svg class="rune-icon" style="color:var(--text-muted)" viewBox="0 0 48 48"><use href="#i-close"></use></svg>'}</div>
                    <div class="sm-flask-meta">
                        <div class="sm-flask-name">${t('freezeFlask1')}</div>
                        <div class="sm-flask-status">${flask1Filled ? '<svg class="rune-inline rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> ' + t('freezeReady') : '⚪ ' + t('freezeEmpty')}</div>
                    </div>
                </div>
                <div class="sm-flask-card ${flask2Filled ? 'filled' : 'empty'}">
                    <div class="sm-flask-art">${flask2Filled ? '<svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg>' : '<svg class="rune-icon" style="color:var(--text-muted)" viewBox="0 0 48 48"><use href="#i-close"></use></svg>'}</div>
                    <div class="sm-flask-meta">
                        <div class="sm-flask-name">${t('freezeFlask2')}</div>
                        <div class="sm-flask-status">${flask2Filled ? '<svg class="rune-inline rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg> ' + t('freezeReady') : '⚪ ' + t('freezeEmpty')}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SHOP & REPAIR ACTIONS -->
        <div>
            <div class="sm-section-title">
                <span><svg class="rune-inline rune-nav" viewBox="0 0 48 48"><use href="#i-market"></use></svg> CỬA HÀNG CỨU CHUỖI</span>
                <span style="font-size:12px; color:var(--accent); font-weight:700;">Ví: ${myDP.toLocaleString()} DP</span>
            </div>
            <div class="sm-shop-grid">
                <!-- BUY FREEZE -->
                <div class="sm-shop-item">
                    <div class="sm-item-left">
                        <div class="sm-item-icon"><svg class="rune-icon rune-sys" viewBox="0 0 48 48"><use href="#i-vault"></use></svg></div>
                        <div>
                            <div class="sm-item-title">${t('buyFreeze')}</div>
                            <div class="sm-item-desc">${t('buyFreezeDesc')}</div>
                        </div>
                    </div>
                    <button class="sm-item-btn btn-buy-freeze" onclick="window._buyStreakFreeze()" ${!canBuyFreeze ? 'disabled' : ''}>
                        ${freezes >= 2 ? t('freezeReady') + ' (2/2)' : t('streakBuyBtn') + ' (200 DP)'}
                    </button>
                </div>

                <!-- REPAIR STREAK -->
                <div class="sm-shop-item" style="${hasBrokenStreak ? 'border-color:rgba(239,68,68,0.5); background:linear-gradient(135deg, rgba(239,68,68,0.06), var(--bg-card));' : ''}">
                    <div class="sm-item-left">
                        <div class="sm-item-icon" style="color:#ef4444;"><svg class="rune-icon" style="color:#ef4444" viewBox="0 0 48 48"><use href="#i-dp"></use></svg></div>
                        <div>
                            <div class="sm-item-title">${t('repairStreak')} (24h)</div>
                            <div class="sm-item-desc">${t('repairStreakDesc')}</div>
                        </div>
                    </div>
                    <button class="sm-item-btn btn-repair-streak" onclick="window._repairStreakWithDP()" ${!canRepairStreak ? 'disabled' : ''}>
                        ${hasBrokenStreak ? t('repairStreak') + ' (150 DP)' : t('streakNoNeed')}
                    </button>
                </div>
            </div>
        </div>

        <!-- HISTORY -->
        <div>
            <div class="sm-section-title">
                <span><svg class="rune-inline rune-sys" viewBox="0 0 48 48"><use href="#i-archive"></use></svg> ${t('historyTitle')}</span>
            </div>
            <div class="sm-history-list">
                ${historyHtml}
            </div>
        </div>
    `;
}

async function buyStreakFreeze(cost = 200) {
    if (S.freezes >= 2) {
        alert('Bạn đã sở hữu tối đa 2 bình đóng băng!');
        return;
    }
    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (myDP < cost && !isAdmin) {
        alert(`Bạn cần ít nhất ${cost} DP để mua bình đóng băng (Hiện có: ${myDP} DP)!`);
        return;
    }

    if (!confirm(`Xác nhận dùng ${cost} DP để mua 1 Bình Đóng Băng Chuỗi?`)) return;

    if (!isAdmin) {
        userBonusDP = (userBonusDP || 0) - cost;
        if (currentUser && db) {
            try {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            } catch(e) { console.warn(e); }
        }
    }

    S.freezes = (S.freezes || 0) + 1;
    sv();

    if (typeof playFreezeSound === 'function') playFreezeSound();
    if (typeof fireConfetti === 'function') fireConfetti();

    // Show Toast
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>🧊</span> ${t('freezeBoughtToast') || 'Đã mua Bình Đóng Băng!'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

    updateUserDPState(true);
    renderStreakProtectionUI();
}
window._buyStreakFreeze = buyStreakFreeze;

async function repairStreakWithDP(cost = 150) {
    const sBreak = S.lastStreakBreak;
    if (!sBreak || sBreak.repaired) {
        alert('Không có chuỗi nào cần cứu lúc này!');
        return;
    }

    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (myDP < cost && !isAdmin) {
        alert(`Bạn cần ít nhất ${cost} DP để Hồi sinh chuỗi (Hiện có: ${myDP} DP)!`);
        return;
    }

    if (!confirm(`Xác nhận dùng ${cost} DP để Hồi sinh chuỗi ngày bị đứt hôm qua?`)) return;

    if (!isAdmin) {
        userBonusDP = (userBonusDP || 0) - cost;
        if (currentUser && db) {
            try {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            } catch(e) { console.warn(e); }
        }
    }

    if (!Array.isArray(S.repairedDays)) S.repairedDays = [];
    if (sBreak.date && !S.repairedDays.includes(sBreak.date)) {
        S.repairedDays.push(sBreak.date);
    }
    S.lastStreakBreak.repaired = true;
    sv();

    if (typeof playResurrectSound === 'function') playResurrectSound();
    if (typeof fireConfetti === 'function') fireConfetti();

    // Show Toast
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>🔥</span> ${t('streakRepairToast') || 'Chuỗi đã được Hồi sinh thành công!'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

    updateUserDPState(true);
    renderGrid();
    renderHeatmap();
    renderStreakProtectionUI();
    renderStreakBanner();
}
window._repairStreakWithDP = repairStreakWithDP;

function initStreakModal() {
    const shieldBtn = document.getElementById('streakShieldBtn');
    if (shieldBtn) shieldBtn.onclick = openStreakModal;

    const mobileBtn = document.getElementById('mobileStreakBtn');
    if (mobileBtn) mobileBtn.onclick = openStreakModal;

    const closeBtn = document.getElementById('streakCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('streakModalBg').classList.remove('show');

    const bg = document.getElementById('streakModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) bg.classList.remove('show'); };
}

let shopActiveTab = 'titles';
let boostIntervalId = null;

function updateBoost2xTimer() {
    const badge = document.getElementById('navBoostBadge');
    const countdownEl = document.getElementById('navBoostCountdown');
    if (!badge || !countdownEl) return;

    const expiresAt = (typeof S !== 'undefined' && S && S.inventory && S.inventory.boost2xExpiresAt) ? S.inventory.boost2xExpiresAt : 0;
    const now = Date.now();
    const remainingMs = expiresAt - now;

    if (remainingMs > 0) {
        badge.style.display = 'inline-flex';
        const totalSecs = Math.floor(remainingMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        countdownEl.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
        badge.style.display = 'none';
    }
}

function startBoostCountdown() {
    if (boostIntervalId) clearInterval(boostIntervalId);
    updateBoost2xTimer();
    boostIntervalId = setInterval(updateBoost2xTimer, 1000);
}

function openShopModal(tab = 'titles') {
    const modal = document.getElementById('shopModalBg');
    if (!modal) return;
    modal.classList.add('show');
    renderShopUI(tab);
}
window._openShopModal = openShopModal;

function renderShopUI(targetTab = null) {
    if (targetTab) shopActiveTab = targetTab;
    const container = document.getElementById('shopFeedContainer');
    const walletDP = document.getElementById('shopWalletDP');
    const extraEl = document.getElementById('shopWalletExtra');
    if (!container) return;

    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (walletDP) walletDP.textContent = `${myDP.toLocaleString()} DP`;
    
    // Check 2x boost active
    const isBoostActive = S.inventory && S.inventory.boost2xExpiresAt && Date.now() < S.inventory.boost2xExpiresAt;
    if (extraEl) {
        if (isBoostActive) {
            extraEl.innerHTML = '<span style="font-size:12px; color:#ef4444; font-weight:800;">⚡ 2X DP ĐANG KÍCH HOẠT</span>';
        } else {
            extraEl.innerHTML = '';
        }
    }

    // Update active tab buttons
    document.querySelectorAll('.shop-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === shopActiveTab);
    });

    let html = '';

    if (shopActiveTab === 'titles') {
        const owned = S.inventory?.titles || [];
        const equipped = S.inventory?.equippedTitle || '';

        SHOP_CATALOG.titles.forEach(item => {
            const isOwned = owned.includes(item.id);
            const isEquipped = equipped === item.id;
            const tName = curLang === 'en' ? item.nameEn : (curLang === 'zh' ? item.nameZh : item.name);
            const tDesc = curLang === 'en' ? (item.descEn || item.desc) : (curLang === 'zh' ? (item.descZh || item.desc) : item.desc);
            const canAfford = myDP >= item.price || isAdmin;

            html += `
                <div class="shop-card ${isEquipped ? 'equipped' : ''}">
                    <div class="shop-card-header">
                        <div class="shop-card-art">${item.icon}</div>
                        <div class="shop-card-meta">
                            <div class="shop-card-title">${tName}</div>
                            <div class="shop-card-desc">${tDesc}</div>
                        </div>
                    </div>
                    <div class="shop-card-footer">
                        <div class="shop-card-price">
                            ${isOwned ? `<span style="color:#10b981;">${t('shopOwned')}</span>` : `${item.price} DP`}
                        </div>
                        <div>
                            ${isEquipped ? `<button class="shop-action-btn btn-equipped" onclick="window._unequipShopItem('titles', '${item.id}')">${t('btnEquipped') || 'Đang dùng'}</button>` :
                              isOwned ? `<button class="shop-action-btn btn-equip" onclick="window._equipShopItem('titles', '${item.id}')">${t('btnEquip') || 'Trang bị'}</button>` :
                              `<button class="shop-action-btn btn-buy" onclick="window._buyShopItem('titles', '${item.id}', ${item.price})" ${!canAfford ? 'disabled' : ''}>${t('btnBuy') || 'Mua'}</button>`}
                        </div>
                    </div>
                </div>
            `;
        });
    } else if (shopActiveTab === 'themes') {
        const owned = S.inventory?.themes || ['dark', 'light'];
        const equipped = S.inventory?.equippedTheme || curTheme || 'dark';

        SHOP_CATALOG.themes.forEach(item => {
            const isOwned = item.free || owned.includes(item.id);
            const isEquipped = (equipped === item.id || curTheme === item.id);
            const canAfford = myDP >= item.price || isAdmin;

            html += `
                <div class="shop-card ${isEquipped ? 'equipped' : ''}">
                    <div class="shop-card-header">
                        <div class="shop-card-art" style="background:${item.bg}; color:${item.accent}; border:1px solid ${item.accent};">🎨</div>
                        <div class="shop-card-meta">
                            <div class="shop-card-title">${item.name}</div>
                            <div class="shop-card-desc">${item.desc}</div>
                            <div class="shop-card-preview" style="background:linear-gradient(90deg, ${item.bg}, ${item.accent});"></div>
                        </div>
                    </div>
                    <div class="shop-card-footer">
                        <div class="shop-card-price">
                            ${item.free ? '<span style="color:#10b981;">Miễn phí</span>' : isOwned ? '<span style="color:#10b981;">Đã sở hữu</span>' : `${item.price} DP`}
                        </div>
                        <div>
                            ${isEquipped ? `<button class="shop-action-btn btn-equipped">${t('btnEquipped') || 'Đang dùng'}</button>` :
                              isOwned ? `<button class="shop-action-btn btn-equip" onclick="window._equipShopItem('themes', '${item.id}')">${t('btnEquip') || 'Áp dụng'}</button>` :
                              `<button class="shop-action-btn btn-buy" onclick="window._buyShopItem('themes', '${item.id}', ${item.price})" ${!canAfford ? 'disabled' : ''}>${t('btnBuy') || 'Mở khóa'}</button>`}
                        </div>
                    </div>
                </div>
            `;
        });
    } else if (shopActiveTab === 'fx') {
        const soundOwned = S.inventory?.soundFxOwned || ['default'];
        const visualOwned = S.inventory?.visualFxOwned || ['default'];
        const soundEquipped = S.inventory?.soundFx || 'default';
        const visualEquipped = S.inventory?.visualFx || 'default';

        html += `<div style="grid-column:1/-1;font-family:var(--font-heading);font-size:13px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:-6px;">Gói Âm Thanh Check-in</div>`;
        SHOP_CATALOG.soundFx.forEach(item => {
            const isOwned = item.free || soundOwned.includes(item.id);
            const isEquipped = soundEquipped === item.id;
            const canAfford = myDP >= item.price || isAdmin;

            html += `
                <div class="shop-card ${isEquipped ? 'equipped' : ''}">
                    <div class="shop-card-header">
                        <div class="shop-card-art">🔊</div>
                        <div class="shop-card-meta">
                            <div class="shop-card-title">${item.name}</div>
                            <div class="shop-card-desc">${item.desc}</div>
                        </div>
                    </div>
                    <div class="shop-card-footer">
                        <div class="shop-card-price">
                            ${item.free ? '<span style="color:#10b981;">Mặc định</span>' : isOwned ? '<span style="color:#10b981;">Đã sở hữu</span>' : `${item.price} DP`}
                        </div>
                        <div>
                            ${isEquipped ? `<button class="shop-action-btn btn-equipped">${t('btnEquipped') || 'Đang dùng'}</button>` :
                              isOwned ? `<button class="shop-action-btn btn-equip" onclick="window._equipShopItem('soundFx', '${item.id}')">${t('btnEquip') || 'Trang bị'}</button>` :
                              `<button class="shop-action-btn btn-buy" onclick="window._buyShopItem('soundFx', '${item.id}', ${item.price})" ${!canAfford ? 'disabled' : ''}>${t('btnBuy') || 'Mua'}</button>`}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `<div style="grid-column:1/-1;font-family:var(--font-heading);font-size:13px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin:12px 0 -6px;">Gói Thị Giác Check-in</div>`;
        SHOP_CATALOG.visualFx.forEach(item => {
            const isOwned = item.free || visualOwned.includes(item.id);
            const isEquipped = visualEquipped === item.id;
            const canAfford = myDP >= item.price || isAdmin;

            html += `
                <div class="shop-card ${isEquipped ? 'equipped' : ''}">
                    <div class="shop-card-header">
                        <div class="shop-card-art"><svg class="rune-icon rune-xl" viewBox="0 0 48 48"><use href="#i-spark"></use></svg></div>
                        <div class="shop-card-meta">
                            <div class="shop-card-title">${item.name}</div>
                            <div class="shop-card-desc">${item.desc}</div>
                        </div>
                    </div>
                    <div class="shop-card-footer">
                        <div class="shop-card-price">
                            ${item.free ? '<span style="color:#10b981;">Mặc định</span>' : isOwned ? '<span style="color:#10b981;">Đã sở hữu</span>' : `${item.price} DP`}
                        </div>
                        <div>
                            ${isEquipped ? `<button class="shop-action-btn btn-equipped">${t('btnEquipped') || 'Đang dùng'}</button>` :
                              isOwned ? `<button class="shop-action-btn btn-equip" onclick="window._equipShopItem('visualFx', '${item.id}')">${t('btnEquip') || 'Trang bị'}</button>` :
                              `<button class="shop-action-btn btn-buy" onclick="window._buyShopItem('visualFx', '${item.id}', ${item.price})" ${!canAfford ? 'disabled' : ''}>${t('btnBuy') || 'Mua'}</button>`}
                        </div>
                    </div>
                </div>
            `;
        });
    } else if (shopActiveTab === 'items') {
        const freezes = S.freezes || 0;
        const isBoostActive = S.inventory && S.inventory.boost2xExpiresAt && Date.now() < S.inventory.boost2xExpiresAt;

        SHOP_CATALOG.items.forEach(item => {
            const canAfford = myDP >= item.price || isAdmin;
            let statusText = '';
            let btnDisabled = false;
            let btnText = `Mua (${item.price} DP)`;

            if (item.id === 'freeze') {
                statusText = `Hiện có: ${freezes}/2 bình`;
                if (freezes >= 2) {
                    btnDisabled = true;
                    btnText = 'Đầy túi (2/2)';
                }
            } else if (item.id === 'boost2x') {
                if (isBoostActive) {
                    statusText = '⚡ Đang kích hoạt';
                    btnText = 'Gia hạn (+24h)';
                } else {
                    statusText = 'Chưa kích hoạt';
                }
            }

            html += `
                <div class="shop-card">
                    <div class="shop-card-header">
                        <div class="shop-card-art">${item.icon}</div>
                        <div class="shop-card-meta">
                            <div class="shop-card-title">${item.name}</div>
                            <div class="shop-card-desc">${item.desc}</div>
                        </div>
                    </div>
                    <div class="shop-card-footer">
                        <div class="shop-card-price">
                            <div>${item.price} DP</div>
                            <div style="font-size:11.5px;color:var(--text-muted);font-weight:600;">${statusText}</div>
                        </div>
                        <div>
                            <button class="shop-action-btn btn-buy" onclick="window._buyShopItem('items', '${item.id}', ${item.price})" ${btnDisabled || (!canAfford && !isAdmin) ? 'disabled' : ''}>
                                ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

async function buyShopItem(type, itemId, cost) {
    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (myDP < cost && !isAdmin) {
        alert(`Bạn cần ít nhất ${cost} DP để mua vật phẩm này! (Hiện có: ${myDP} DP)`);
        return;
    }

    if (!confirm(`Xác nhận dùng ${cost} DP để mua vật phẩm này?`)) return;

    if (!isAdmin) {
        userBonusDP = (userBonusDP || 0) - cost;
        if (currentUser && db) {
            try {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            } catch(e) { console.warn(e); }
        }
    }

    if (!S.inventory) S.inventory = sanitizeInventory(null);

    if (type === 'titles') {
        if (!S.inventory.titles.includes(itemId)) S.inventory.titles.push(itemId);
        S.inventory.equippedTitle = itemId;
    } else if (type === 'themes') {
        if (!S.inventory.themes.includes(itemId)) S.inventory.themes.push(itemId);
        S.inventory.equippedTheme = itemId;
        curTheme = itemId;
        localStorage.setItem('hg_theme', curTheme);
        applyTheme();
    } else if (type === 'soundFx') {
        if (!S.inventory.soundFxOwned.includes(itemId)) S.inventory.soundFxOwned.push(itemId);
        S.inventory.soundFx = itemId;
        playCheckSound();
    } else if (type === 'visualFx') {
        if (!S.inventory.visualFxOwned.includes(itemId)) S.inventory.visualFxOwned.push(itemId);
        S.inventory.visualFx = itemId;
    } else if (type === 'items') {
        if (itemId === 'freeze') {
            S.freezes = (S.freezes || 0) + 1;
            if (typeof playFreezeSound === 'function') playFreezeSound();
        } else if (itemId === 'boost2x') {
            const currentExp = Math.max(Date.now(), S.inventory.boost2xExpiresAt || 0);
            S.inventory.boost2xExpiresAt = currentExp + 24 * 60 * 60 * 1000;
            if (typeof playResurrectSound === 'function') playResurrectSound();
        }
    }

    sv();

    if (typeof fireConfetti === 'function') fireConfetti();

    // Show Toast
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg></span> ${t('itemBoughtToast') || 'Đã mua thành công!'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

    updateUserDPState(true);
    if (typeof syncUserLeaderboard === 'function') syncUserLeaderboard();
    showUserProfile(currentUser);
    renderShopUI();
}
window._buyShopItem = buyShopItem;

async function equipShopItem(type, itemId) {
    if (!S.inventory) S.inventory = sanitizeInventory(null);

    if (type === 'titles') {
        S.inventory.equippedTitle = itemId;
    } else if (type === 'themes') {
        S.inventory.equippedTheme = itemId;
        curTheme = itemId;
        localStorage.setItem('hg_theme', curTheme);
        applyTheme();
    } else if (type === 'soundFx') {
        S.inventory.soundFx = itemId;
        playCheckSound();
    } else if (type === 'visualFx') {
        S.inventory.visualFx = itemId;
    }

    sv();

    if (typeof syncUserLeaderboard === 'function') syncUserLeaderboard();
    showUserProfile(currentUser);
    renderShopUI();
}
window._equipShopItem = equipShopItem;

async function unequipShopItem(type, itemId) {
    if (!S.inventory) return;
    if (type === 'titles' && S.inventory.equippedTitle === itemId) {
        S.inventory.equippedTitle = '';
    }
    sv();
    if (typeof syncUserLeaderboard === 'function') syncUserLeaderboard();
    showUserProfile(currentUser);
    renderShopUI();
}
window._unequipShopItem = unequipShopItem;

function initShopModal() {
    const shopBtn = document.getElementById('shopBtn');
    if (shopBtn) shopBtn.onclick = () => openShopModal();

    const navShopBtn = document.getElementById('navShopBtn');
    if (navShopBtn) navShopBtn.onclick = () => openShopModal();

    const mobileBtn = document.getElementById('mobileShopBtn');
    if (mobileBtn) mobileBtn.onclick = () => openShopModal();

    const closeBtn = document.getElementById('shopCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('shopModalBg').classList.remove('show');

    const bg = document.getElementById('shopModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) bg.classList.remove('show'); };

    // Tab buttons
    document.querySelectorAll('.shop-tab-btn').forEach(btn => {
        btn.onclick = () => {
            renderShopUI(btn.dataset.tab);
        };
    });
}

// ==================== TRỤ CỘT 3: TỔ ĐỘI RÈN LUYỆN & ĐẤU TRƯỜNG THÁCH ĐẤU 1V1 ====================

let squadHubActiveTab = 'squads';
let localSquadCache = null;
let localDuelCache = null;

function getSquadLevelInfo(totalDP = 0) {
    if (totalDP >= 7000) return { level: 5, name: 'Huyền Thoại (Lv.5)', max: 10000, current: totalDP, pct: 100 };
    if (totalDP >= 3500) return { level: 4, name: 'Bậc Thầy (Lv.4)', max: 7000, current: totalDP, pct: Math.round((totalDP - 3500) / 3500 * 100) };
    if (totalDP >= 1500) return { level: 3, name: 'Chiến Tinh (Lv.3)', max: 3500, current: totalDP, pct: Math.round((totalDP - 1500) / 2000 * 100) };
    if (totalDP >= 500) return { level: 2, name: 'Tiên Phong (Lv.2)', max: 1500, current: totalDP, pct: Math.round((totalDP - 500) / 1000 * 100) };
    return { level: 1, name: 'Tân Binh (Lv.1)', max: 500, current: totalDP, pct: Math.round(totalDP / 500 * 100) };
}
window.getSquadLevelInfo = getSquadLevelInfo;

function openSquadModal(tab = 'squads') {
    const modal = document.getElementById('squadModalBg');
    if (!modal) return;
    modal.classList.add('show');
    renderSquadHubUI(tab);
}
window._openSquadModal = openSquadModal;

async function renderSquadHubUI(targetTab = null) {
    if (targetTab) squadHubActiveTab = targetTab;
    const container = document.getElementById('squadFeedContainer');
    if (!container) return;

    // Update tab buttons
    document.querySelectorAll('.squad-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === squadHubActiveTab);
    });

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    const myUid = currentUser ? currentUser.uid : 'local_user';
    const myName = currentUser ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'User') : 'User';
    const myAvatar = currentUser ? (currentUser.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%236366f1'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(myName||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`) : '';

    if (squadHubActiveTab === 'squads') {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">⏳ Đang tải dữ liệu Tổ Đội...</div>';
        
        let squadData = null;
        if (S.squadId && db) {
            try {
                const sDoc = await db.collection('squads').doc(S.squadId).get();
                if (sDoc.exists) squadData = { id: sDoc.id, ...sDoc.data() };
            } catch(e) { console.warn(e); }
        }

        if (squadData) {
            const members = Array.isArray(squadData.members) ? squadData.members : [];
            const checkedCount = members.filter(m => m.todayChecked || m.lastCheckedDate === todayKey).length;
            const completionPct = members.length ? Math.round((checkedCount / members.length) * 100) : 0;
            const lvlInfo = getSquadLevelInfo(squadData.totalDP || 0);
            const isLeader = squadData.createdBy === myUid;

            let membersHtml = '';
            members.forEach(m => {
                const isMe = m.uid === myUid;
                const isChecked = m.todayChecked || m.lastCheckedDate === todayKey;
                const titleHtml = getUserTitleBadgeHTML(m.equippedTitle);
                const mAvatar = m.photoURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%236366f1'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18' font-family='sans-serif'%3E${(m.displayName||'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;

                membersHtml += `
                    <div class="squad-member-card">
                        <div class="squad-member-left">
                            <img class="squad-member-avatar" src="${mAvatar}" alt="">
                            <div class="squad-member-info">
                                <div class="squad-member-name">
                                    <span>${escHtml(m.displayName || 'Member')}</span>
                                    ${titleHtml}
                                    ${isMe ? '<span style="font-size:10.5px;padding:1px 6px;border-radius:10px;background:#6366f1;color:#fff;">Bạn</span>' : ''}
                                </div>
                                <div class="squad-member-status ${isChecked ? 'checked' : 'pending'}">
                                    ${isChecked ? 'Đã check-in hôm nay' : 'Chưa hoàn thành'}
                                </div>
                            </div>
                        </div>
                        <div>
                            ${!isChecked && !isMe ? `
                                <button class="squad-nudge-btn" onclick="window._nudgeMember('${m.uid}', '${escHtml(m.displayName)}')">
                                    ${t('btnNudge') || '⚡ Thúc giục'}
                                </button>
                            ` : isChecked ? '<span style="font-size:12px;color:#10b981;font-weight:700;">+10 DP</span>' : ''}
                        </div>
                    </div>
                `;
            });

            let logHtml = '';
            const nudges = Array.isArray(squadData.nudges) ? squadData.nudges.slice(-8).reverse() : [];
            if (nudges.length > 0) {
                nudges.forEach(n => {
                    logHtml += `
                        <div class="squad-log-item">
                            <span>⚡</span>
                            <span><strong>${escHtml(n.fromName)}</strong> đã gửi lời thúc giục tới <strong>${escHtml(n.toName)}</strong>!</span>
                        </div>
                    `;
                });
            } else {
                logHtml = '<div style="font-size:12px;color:var(--text-muted);padding:4px 0;">Chưa có hoạt động thúc giục nào hôm nay.</div>';
            }

            container.innerHTML = `
                <div class="squad-hero">
                    <div class="squad-hero-top">
                        <div class="squad-hero-title-wrap">
                            <div class="squad-hero-icon">${squadData.icon || '🛡️'}</div>
                            <div>
                                <div class="squad-hero-name">
                                    ${escHtml(squadData.name || 'Tổ Đội Kỷ Luật')}
                                    <span class="squad-level-badge">${lvlInfo.name}</span>
                                </div>
                                <div class="squad-hero-desc">${escHtml(squadData.description || 'Cùng nhau rèn luyện thói quen mỗi ngày!')}</div>
                            </div>
                        </div>
                        <div>
                            <div class="squad-code-pill" onclick="window._copySquadCode('${squadData.code}')" title="Bấm để sao chép mã mời">
                                <span>🔑 MÃ MỜI: ${squadData.code}</span>
                                <span>📋</span>
                            </div>
                        </div>
                    </div>

                    <div class="squad-progress-section">
                        <div class="squad-progress-header">
                            <span>Tiến độ hoàn thành hôm nay: ${checkedCount}/${members.length} thành viên (${completionPct}%)</span>
                            <span>Tổng EXP: ${(squadData.totalDP || 0).toLocaleString()} DP</span>
                        </div>
                        <div class="squad-progress-track">
                            <div class="squad-progress-fill" style="width:${completionPct}%;"></div>
                        </div>
                    </div>
                </div>

                <div class="squad-members-title">
                    <span>Thành viên tổ đội (${members.length}/5)</span>
                    <button style="background:none;border:none;color:#ef4444;font-size:12px;font-weight:700;cursor:pointer;" onclick="window._leaveSquad()">Rời đội 🚪</button>
                </div>
                <div class="squad-members-grid">${membersHtml}</div>

                <div class="squad-log-box">
                    <div class="squad-log-header">⚡ Nhật ký Thúc Giục & Hoạt Động</div>
                    <div class="squad-log-list">${logHtml}</div>
                </div>
            `;
        } else {
            // No squad -> Show Welcome / Create & Join
            container.innerHTML = `
                <div class="squad-welcome-card">
                    <div class="squad-welcome-title">🛡️ Gia Nhập Tổ Đội Rèn Luyện</div>
                    <div class="squad-welcome-desc">
                        Nghiên cứu chỉ ra rằng khi có đồng đội cùng theo dõi và nhắc nhở, tỷ lệ duy trì kỷ luật thói quen tăng tới <strong>85%</strong>! Hãy tạo hoặc tham gia một tổ đội ngay.
                    </div>
                </div>

                <div class="squad-actions-row">
                    <div class="squad-action-card">
                        <h3><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-spark"></use></svg> Tạo Tổ Đội Mới (3-5 Người)</h3>
                        <input type="text" id="squadNewName" class="squad-input" placeholder="Tên tổ đội (VD: Chiến Binh 5H Sáng)..." maxlength="30">
                        <div style="display:flex;gap:8px;align-items:center;">
                            <label style="font-size:12px;font-weight:700;color:var(--text-muted);">Biểu tượng:</label>
                            <select id="squadNewIcon" class="squad-input" style="width:auto;">
                                <option value="⚔️">⚔️ Kiếm Tiên Phong</option>
                                <option value="🐺">🐺 Sói Đầu Đàn</option>
                                <option value="🦁">🦁 Sư Tử Kỷ Luật</option>
                                <option value="🔥">🔥 Ngọn Lửa Bền Bỉ</option>
                                <option value="🏆">🏆 Nhà Vô Địch</option>
                                <option value="⚡">⚡ Tia Chớp Thần Tốc</option>
                                <option value="🛡️">🛡️ Khiên Bất Hoại</option>
                            </select>
                        </div>
                        <input type="text" id="squadNewDesc" class="squad-input" placeholder="Mục tiêu chung của đội..." maxlength="80">
                        <button class="squad-btn-primary" onclick="window._createSquad()"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-ignite"></use></svg> Tạo Tổ Đội Ngay</button>
                    </div>

                    <div class="squad-action-card">
                        <h3>🔑 Gia Nhập Bằng Mã Mời</h3>
                        <p style="font-size:12.5px;color:var(--text-muted);margin:0;">Nhập mã mời 6 ký tự do đội trưởng hoặc bạn bè gửi cho bạn:</p>
                        <input type="text" id="squadJoinCode" class="squad-input" placeholder="VD: SD8921" maxlength="10" style="text-transform:uppercase;font-family:monospace;font-weight:800;">
                        <button class="squad-btn-primary" style="background:linear-gradient(135deg,#10b981,#059669);" onclick="window._joinSquadByCode()"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-aegis"></use></svg> Gia Nhập Đội</button>
                    </div>
                </div>
            `;
        }
    } else if (squadHubActiveTab === 'duels') {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">⏳ Đang tải Đấu Trường 1v1...</div>';

        let activeDuel = null;
        let openDuels = [];

        if (db) {
            try {
                if (S.activeDuelId) {
                    const dDoc = await db.collection('duels').doc(S.activeDuelId).get();
                    if (dDoc.exists) activeDuel = { id: dDoc.id, ...dDoc.data() };
                }
                const snap = await db.collection('duels').where('status', '==', 'open').limit(10).get();
                openDuels = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch(e) { console.warn(e); }
        }

        const computed = calculateUserDPAndStreak(S);
        const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
        const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

        let html = '';

        if (activeDuel && (activeDuel.status === 'active' || activeDuel.status === 'finished')) {
            const p1 = activeDuel.challenger || {};
            const p2 = activeDuel.opponent || {};
            const isP1 = p1.uid === myUid;
            const pot = (activeDuel.betDP || 50) * 2;
            const remainingMs = Math.max(0, (activeDuel.endDate || Date.now()) - Date.now());
            const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

            let p1Dots = '';
            for (let i = 1; i <= 7; i++) {
                p1Dots += `<div class="duel-day-dot ${(p1.daysChecked || 0) >= i ? 'done' : ''}">${i}</div>`;
            }
            let p2Dots = '';
            for (let i = 1; i <= 7; i++) {
                p2Dots += `<div class="duel-day-dot ${(p2.daysChecked || 0) >= i ? 'done' : ''}">${i}</div>`;
            }

            const isFinished = activeDuel.status === 'finished' || remainingMs <= 0;
            let resultHtml = '';
            if (isFinished) {
                const p1Score = p1.daysChecked || 0;
                const p2Score = p2.daysChecked || 0;
                let won = false;
                let draw = false;
                if (p1Score === p2Score) draw = true;
                else if (isP1 && p1Score > p2Score) won = true;
                else if (!isP1 && p2Score > p1Score) won = true;

                resultHtml = `
                    <div style="background:rgba(0,0,0,0.3);border:1px solid #f59e0b;padding:12px;border-radius:8px;text-align:center;margin-top:14px;">
                        <div style="font-size:16px;font-weight:900;color:#f59e0b;">
                            ${draw ? 'KẾT QUẢ HÒA CÂN NÃO (7/7)!' : won ? 'BẠN ĐÃ CHIẾN THẮNG TRẬN ĐẤU!' : 'BẠN ĐÃ THUA TRẬN ĐẤU!'}
                        </div>
                        <button class="squad-btn-primary" style="margin-top:10px;" onclick="window._claimDuelReward('${activeDuel.id}')">
                            ${won ? `Nhận Thưởng ${pot} DP 💎` : 'Đóng trận đấu & Nhận kết quả'}
                        </button>
                    </div>
                `;
            }

            html += `
                <div class="duel-vs-banner">
                    <div class="duel-vs-header">
                        <span class="duel-badge-live">${isFinished ? '🏁 ĐÃ KẾT THÚC' : '🔥 ĐANG TRANH TÀI 7 NGÀY'}</span>
                        <span style="font-size:12.5px;color:var(--text-secondary);font-weight:700;">⏳ Còn lại: ${daysLeft} ngày</span>
                    </div>

                    <div class="duel-vs-stage">
                        <div class="duel-fighter challenger">
                            <img class="duel-fighter-avatar" src="${p1.photoURL || myAvatar}" alt="">
                            <div class="duel-fighter-name">${escHtml(p1.displayName || 'P1')}${getUserTitleBadgeHTML(p1.equippedTitle)}</div>
                            <div style="font-size:12px;color:var(--text-muted);">Đạt: <strong>${p1.daysChecked || 0}/7 ngày</strong></div>
                            <div class="duel-7day-track">${p1Dots}</div>
                        </div>

                        <div class="duel-vs-center">
                            <div class="duel-vs-text">VS</div>
                            <div class="duel-pot-pill"><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg> HŨ THƯỞNG: ${pot} DP</div>
                        </div>

                        <div class="duel-fighter opponent">
                            <img class="duel-fighter-avatar" src="${p2.photoURL || myAvatar}" alt="">
                            <div class="duel-fighter-name">${escHtml(p2.displayName || 'P2')}${getUserTitleBadgeHTML(p2.equippedTitle)}</div>
                            <div style="font-size:12px;color:var(--text-muted);">Đạt: <strong>${p2.daysChecked || 0}/7 ngày</strong></div>
                            <div class="duel-7day-track">${p2Dots}</div>
                        </div>
                    </div>

                    ${resultHtml}
                </div>
            `;
        } else if (activeDuel && activeDuel.status === 'open') {
            html += `
                <div class="duel-vs-banner">
                    <div class="duel-vs-header">
                        <span class="duel-badge-live" style="background:#f59e0b;">⏳ ĐANG CHỜ ĐỐI THỦ NHẬN KÈO</span>
                        <button style="background:none;border:none;color:#ef4444;font-size:12px;font-weight:700;cursor:pointer;" onclick="window._cancelDuel('${activeDuel.id}', ${activeDuel.betDP || 50})">Hủy thách đấu (Hoàn lại ${activeDuel.betDP} DP) ✕</button>
                    </div>
                    <div style="text-align:center;padding:16px;">
                        <div style="font-size:24px;margin-bottom:6px;">⚔️</div>
                        <div style="font-size:16px;font-weight:800;color:var(--text-primary);">Phòng thách đấu cược ${activeDuel.betDP || 50} DP của bạn đã sẵn sàng!</div>
                        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">Hũ thưởng: <strong>${(activeDuel.betDP || 50) * 2} DP</strong> đang chờ một đấu thủ vào nhận kèo.</div>
                    </div>
                </div>
            `;
        } else {
            // Create duel & Lobby
            html += `
                <div class="squad-welcome-card" style="background:radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.85)); border-color:rgba(239, 68, 68, 0.35);">
                    <div class="squad-welcome-title" style="color:#ef4444;">⚔️ Đấu Trường Thách Đấu 1v1 (7-Day Streak Duel)</div>
                    <div class="squad-welcome-desc">
                        Đặt cược điểm rèn luyện DP và so tài kỷ luật trong 7 ngày liên tiếp không đứt chuỗi! Người chiến thắng sẽ ăn trọn toàn bộ hũ thưởng DP.
                    </div>

                    <div style="background:rgba(0,0,0,0.3);padding:14px;border-radius:10px;display:inline-block;border:1px solid rgba(255,255,255,0.08);">
                        <div style="font-size:12.5px;font-weight:800;color:var(--text-muted);margin-bottom:6px;">CHỌN MỨC CƯỢC DP:</div>
                        <div class="bet-chips-row" style="justify-content:center;">
                            <div class="bet-chip active" onclick="window._selectBet(this, 50)">💎 50 DP</div>
                            <div class="bet-chip" onclick="window._selectBet(this, 100)">💎 100 DP</div>
                            <div class="bet-chip" onclick="window._selectBet(this, 200)">💎 200 DP</div>
                            <div class="bet-chip" onclick="window._selectBet(this, 500)">💎 500 DP</div>
                        </div>
                        <button class="squad-btn-primary" style="background:linear-gradient(135deg,#ef4444,#dc2626);margin-top:10px;" onclick="window._createDuel()">
                            ⚔️ Tạo Phòng Thách Đấu Mới
                        </button>
                    </div>
                </div>

                <div class="squad-members-title">
                    <span>Phòng chờ thách đấu công khai (${openDuels.length})</span>
                </div>
            `;

            if (openDuels.length > 0) {
                openDuels.forEach(od => {
                    const isMyOwn = od.challenger && od.challenger.uid === myUid;
                    const canAfford = myDP >= (od.betDP || 50) || isAdmin;

                    html += `
                        <div class="duel-lobby-card">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <img style="width:38px;height:38px;border-radius:50%;border:2px solid #ef4444;" src="${od.challenger?.photoURL || myAvatar}" alt="">
                                <div>
                                    <div style="font-weight:800;font-size:13.5px;color:var(--text-primary);">
                                        ${escHtml(od.challenger?.displayName || 'Challenger')}
                                        ${getUserTitleBadgeHTML(od.challenger?.equippedTitle)}
                                    </div>
                                    <div style="font-size:12px;color:#f59e0b;font-weight:700;">Cược: ${od.betDP} DP · Hũ: ${od.betDP * 2} DP</div>
                                </div>
                            </div>
                            <div>
                                ${isMyOwn ? '<span style="font-size:12px;color:var(--text-muted);font-weight:700;">Phòng của bạn</span>' : `
                                    <button class="squad-btn-primary" style="background:linear-gradient(135deg,#ef4444,#b91c1c);font-size:12px;padding:6px 14px;" onclick="window._acceptDuel('${od.id}', ${od.betDP})" ${!canAfford ? 'disabled' : ''}>
                                        Nhận Kèo ⚔️
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Hiện chưa có phòng thách đấu nào đang mở. Hãy là người đầu tiên tạo kèo!</div>';
            }
        }

        container.innerHTML = html;
    }
}

let currentSelectedBet = 50;
window._selectBet = function(el, amount) {
    document.querySelectorAll('.bet-chip').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    currentSelectedBet = amount;
};

async function createSquad() {
    if (!currentUser) { alert('Vui lòng đăng nhập để tạo tổ đội!'); return; }
    const nameInput = document.getElementById('squadNewName');
    const iconSelect = document.getElementById('squadNewIcon');
    const descInput = document.getElementById('squadNewDesc');

    const name = nameInput ? nameInput.value.trim() : '';
    const icon = iconSelect ? iconSelect.value : '🛡️';
    const desc = descInput ? descInput.value.trim() : '';

    if (!name || name.length < 3) { alert('Vui lòng nhập tên tổ đội có ít nhất 3 ký tự!'); return; }

    const code = 'SQ' + Math.floor(1000 + Math.random() * 9000);
    const myName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';

    const newSquad = {
        name: name,
        icon: icon,
        code: code,
        description: desc,
        createdBy: currentUser.uid,
        leaderName: myName,
        members: [{
            uid: currentUser.uid,
            displayName: myName,
            photoURL: currentUser.photoURL || '',
            equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
            todayChecked: false,
            lastCheckedDate: '',
            contributedDP: 0
        }],
        totalDP: 0,
        level: 1,
        nudges: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('squads').add(newSquad);
        S.squadId = docRef.id;
        sv();
        if (typeof playResurrectSound === 'function') playResurrectSound();
        if (typeof fireConfetti === 'function') fireConfetti();

        const toast = document.createElement('div');
        toast.className = 'quest-toast';
        toast.innerHTML = `<span>🛡️</span> ${t('squadCreatedToast') || 'Đã tạo tổ đội thành công!'}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

        renderSquadHubUI('squads');
    } catch(e) {
        alert('Lỗi tạo tổ đội: ' + e.message);
    }
}
window._createSquad = createSquad;

async function joinSquadByCode() {
    if (!currentUser) { alert('Vui lòng đăng nhập để gia nhập tổ đội!'); return; }
    const codeInput = document.getElementById('squadJoinCode');
    const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

    if (!code) { alert('Vui lòng nhập mã mời tổ đội!'); return; }

    try {
        const snap = await db.collection('squads').where('code', '==', code).limit(1).get();
        if (snap.empty) { alert('Không tìm thấy tổ đội với mã mời này!'); return; }

        const doc = snap.docs[0];
        const data = doc.data();
        const members = Array.isArray(data.members) ? data.members : [];

        if (members.length >= 5) { alert('Tổ đội này đã đầy (tối đa 5 thành viên)!'); return; }
        if (members.some(m => m.uid === currentUser.uid)) { alert('Bạn đã là thành viên của tổ đội này!'); S.squadId = doc.id; sv(); renderSquadHubUI('squads'); return; }

        const myName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        const newMember = {
            uid: currentUser.uid,
            displayName: myName,
            photoURL: currentUser.photoURL || '',
            equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
            todayChecked: false,
            lastCheckedDate: '',
            contributedDP: 0
        };

        await db.collection('squads').doc(doc.id).update({
            members: firebase.firestore.FieldValue.arrayUnion(newMember)
        });

        S.squadId = doc.id;
        sv();
        if (typeof playResurrectSound === 'function') playResurrectSound();
        if (typeof fireConfetti === 'function') fireConfetti();

        const toast = document.createElement('div');
        toast.className = 'quest-toast';
        toast.innerHTML = `<span>🛡️</span> ${t('squadJoinedToast') || 'Đã gia nhập tổ đội thành công!'}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

        renderSquadHubUI('squads');
    } catch(e) {
        alert('Lỗi gia nhập tổ đội: ' + e.message);
    }
}
window._joinSquadByCode = joinSquadByCode;

async function leaveSquad() {
    if (!confirm('Bạn có chắc chắn muốn rời tổ đội này?')) return;
    if (!S.squadId || !currentUser) { S.squadId = ''; sv(); renderSquadHubUI('squads'); return; }

    try {
        const sDoc = await db.collection('squads').doc(S.squadId).get();
        if (sDoc.exists) {
            const data = sDoc.data();
            const updatedMembers = (data.members || []).filter(m => m.uid !== currentUser.uid);
            await db.collection('squads').doc(S.squadId).update({ members: updatedMembers });
        }
    } catch(e) { console.warn(e); }

    S.squadId = '';
    sv();
    renderSquadHubUI('squads');
}
window._leaveSquad = leaveSquad;

async function nudgeMember(toUid, toName) {
    if (!currentUser || !S.squadId) return;
    playNudgeSound();

    const myName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const nudgeObj = {
        fromUid: currentUser.uid,
        fromName: myName,
        toUid: toUid,
        toName: toName,
        emoji: '⚡',
        timestamp: Date.now()
    };

    try {
        await db.collection('squads').doc(S.squadId).update({
            nudges: firebase.firestore.FieldValue.arrayUnion(nudgeObj)
        });
    } catch(e) { console.warn(e); }

    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>⚡</span> Đã gửi lời thúc giục sấm sét tới <strong>${escHtml(toName)}</strong>!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);

    renderSquadHubUI('squads');
}
window._nudgeMember = nudgeMember;

function copySquadCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            alert(`Đã sao chép mã mời: ${code}! Hãy gửi cho bạn bè của bạn.`);
        });
    } else {
        prompt('Sao chép mã mời này:', code);
    }
}
window._copySquadCode = copySquadCode;

async function createDuel() {
    if (!currentUser) { alert('Vui lòng đăng nhập để tạo phòng thách đấu!'); return; }
    const cost = currentSelectedBet || 50;

    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (myDP < cost && !isAdmin) {
        alert(`Bạn cần ít nhất ${cost} DP để đặt cược cho trận đấu này! (Hiện có: ${myDP} DP)`);
        return;
    }

    if (!confirm(`Xác nhận đặt cược ${cost} DP vào Hũ thưởng để tạo phòng thách đấu 7 ngày?`)) return;

    if (!isAdmin) {
        userBonusDP = (userBonusDP || 0) - cost;
        if (currentUser && db) {
            try {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            } catch(e) {}
        }
    }

    const myName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const newDuel = {
        challenger: {
            uid: currentUser.uid,
            displayName: myName,
            photoURL: currentUser.photoURL || '',
            rankLevel: S.rankLevel || 1,
            equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
            daysChecked: 0,
            lastCheckedDate: ''
        },
        opponent: null,
        betDP: cost,
        status: 'open',
        startDate: Date.now(),
        endDate: Date.now() + 7 * 86400000,
        winnerUid: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('duels').add(newDuel);
        S.activeDuelId = docRef.id;
        sv();
        playDuelGongSound();
        updateUserDPState(true);
        renderSquadHubUI('duels');
    } catch(e) {
        alert('Lỗi tạo thách đấu: ' + e.message);
    }
}
window._createDuel = createDuel;

async function acceptDuel(duelId, cost) {
    if (!currentUser) { alert('Vui lòng đăng nhập để nhận kèo thách đấu!'); return; }
    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const myDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    if (myDP < cost && !isAdmin) {
        alert(`Bạn cần ít nhất ${cost} DP để nhận kèo thách đấu này! (Hiện có: ${myDP} DP)`);
        return;
    }

    if (!confirm(`Xác nhận đặt cược ${cost} DP để tham gia trận đấu 1v1 7 ngày?`)) return;

    if (!isAdmin) {
        userBonusDP = (userBonusDP || 0) - cost;
        if (currentUser && db) {
            try {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            } catch(e) {}
        }
    }

    const myName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const opponentData = {
        uid: currentUser.uid,
        displayName: myName,
        photoURL: currentUser.photoURL || '',
        rankLevel: S.rankLevel || 1,
        equippedTitle: (S.inventory && S.inventory.equippedTitle) || '',
        daysChecked: 0,
        lastCheckedDate: ''
    };

    try {
        await db.collection('duels').doc(duelId).update({
            opponent: opponentData,
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + 7 * 86400000
        });

        S.activeDuelId = duelId;
        sv();
        playDuelGongSound();
        if (typeof fireConfetti === 'function') fireConfetti();
        updateUserDPState(true);
        renderSquadHubUI('duels');
    } catch(e) {
        alert('Lỗi nhận thách đấu: ' + e.message);
    }
}
window._acceptDuel = acceptDuel;

async function cancelDuel(duelId, cost) {
    if (!confirm(`Xác nhận hủy thách đấu và nhận lại ${cost} DP?`)) return;
    try {
        await db.collection('duels').doc(duelId).delete();
    } catch(e) {}

    userBonusDP = (userBonusDP || 0) + cost;
    if (currentUser && db) {
        try {
            await userDocRef.update({ bonusDP: userBonusDP });
            await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
        } catch(e) {}
    }

    S.activeDuelId = '';
    sv();
    updateUserDPState(true);
    renderSquadHubUI('duels');
}
window._cancelDuel = cancelDuel;

async function claimDuelReward(duelId) {
    if (!db || !S.activeDuelId) return;
    try {
        const dDoc = await db.collection('duels').doc(duelId).get();
        if (dDoc.exists) {
            const data = dDoc.data();
            const p1 = data.challenger || {};
            const p2 = data.opponent || {};
            const myUid = currentUser ? currentUser.uid : '';
            const isP1 = p1.uid === myUid;
            const p1Score = p1.daysChecked || 0;
            const p2Score = p2.daysChecked || 0;

            if (p1Score === p2Score) {
                // Draw -> Refund bet
                userBonusDP = (userBonusDP || 0) + (data.betDP || 50);
            } else if ((isP1 && p1Score > p2Score) || (!isP1 && p2Score > p1Score)) {
                // Winner -> Full pot
                const winAmount = (data.betDP || 50) * 2;
                userBonusDP = (userBonusDP || 0) + winAmount;
                if (typeof playResurrectSound === 'function') playResurrectSound();
                if (typeof fireConfetti === 'function') fireConfetti();
            }

            if (currentUser && db) {
                await userDocRef.update({ bonusDP: userBonusDP });
                await db.collection('leaderboard').doc(currentUser.uid).set({ bonusDP: userBonusDP }, { merge: true });
            }
        }
    } catch(e) { console.warn(e); }

    S.activeDuelId = '';
    sv();
    updateUserDPState(true);
    renderSquadHubUI('duels');
}
window._claimDuelReward = claimDuelReward;

async function onHabitCheckedSyncSquadAndDuel() {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    const myUid = currentUser ? currentUser.uid : null;
    if (!myUid || !db) return;

    // 1. Sync Squad
    if (S.squadId) {
        try {
            const sDoc = await db.collection('squads').doc(S.squadId).get();
            if (sDoc.exists) {
                const sData = sDoc.data();
                const members = Array.isArray(sData.members) ? sData.members : [];
                let memberUpdated = false;
                const updatedMembers = members.map(m => {
                    if (m.uid === myUid && m.lastCheckedDate !== todayKey) {
                        memberUpdated = true;
                        return {
                            ...m,
                            todayChecked: true,
                            lastCheckedDate: todayKey,
                            contributedDP: (m.contributedDP || 0) + 10
                        };
                    }
                    return m;
                });

                if (memberUpdated) {
                    await db.collection('squads').doc(S.squadId).update({
                        members: updatedMembers,
                        totalDP: firebase.firestore.FieldValue.increment(10)
                    });
                }
            }
        } catch(e) { console.warn('Squad sync error:', e); }
    }

    // 2. Sync Duel
    if (S.activeDuelId) {
        try {
            const dDoc = await db.collection('duels').doc(S.activeDuelId).get();
            if (dDoc.exists && dDoc.data().status === 'active') {
                const dData = dDoc.data();
                const isP1 = dData.challenger && dData.challenger.uid === myUid;
                const fighter = isP1 ? dData.challenger : dData.opponent;

                if (fighter && fighter.lastCheckedDate !== todayKey) {
                    const newDaysChecked = (fighter.daysChecked || 0) + 1;
                    const updatePayload = {};
                    if (isP1) {
                        updatePayload['challenger.daysChecked'] = newDaysChecked;
                        updatePayload['challenger.lastCheckedDate'] = todayKey;
                    } else {
                        updatePayload['opponent.daysChecked'] = newDaysChecked;
                        updatePayload['opponent.lastCheckedDate'] = todayKey;
                    }

                    // Check if 7 days completed
                    if (newDaysChecked >= 7 || Date.now() >= dData.endDate) {
                        updatePayload['status'] = 'finished';
                    }

                    await db.collection('duels').doc(S.activeDuelId).update(updatePayload);
                }
            }
        } catch(e) { console.warn('Duel sync error:', e); }
    }
}

function initSquadHubModal() {
    const hubBtn = document.getElementById('squadHubBtn');
    if (hubBtn) hubBtn.onclick = () => openSquadModal();

    const mobileBtn = document.getElementById('mobileSquadBtn');
    if (mobileBtn) mobileBtn.onclick = () => openSquadModal();

    const closeBtn = document.getElementById('squadCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('squadModalBg').classList.remove('show');

    const bg = document.getElementById('squadModalBg');
    if (bg) bg.onclick = (e) => { if (e.target === bg) bg.classList.remove('show'); };

    document.querySelectorAll('.squad-tab-btn').forEach(btn => {
        btn.onclick = () => {
            renderSquadHubUI(btn.dataset.tab);
        };
    });
}

// ==================== TRỤ CỘT 4: BÁO CÁO TỔNG KẾT & XUẤT ẢNH STORY (WEEKLY RECAP & SHARE CARDS) ====================

function calculateWeeklyRecapData() {
    const habits = Array.isArray(S.h) ? S.h : [];
    const numHabits = habits.length || 1;
    const now = new Date();
    
    // Check the last 7 days (today down to 6 days ago)
    let totalChecks = 0;
    let habitCheckMap = {};
    habits.forEach(h => { habitCheckMap[h.id] = 0; });
    let perfectDays = 0;

    for (let offset = 0; offset < 7; offset++) {
        const d = new Date(now);
        d.setDate(now.getDate() - offset);
        const y = d.getFullYear();
        const m = d.getMonth();
        const day = d.getDate();
        let dayChecks = 0;

        habits.forEach(h => {
            const k = ck(h.id, day);
            // Also handle if month matched
            if (m === cM && y === cY && S.c && S.c[k]) {
                totalChecks++;
                dayChecks++;
                habitCheckMap[h.id] = (habitCheckMap[h.id] || 0) + 1;
            }
        });

        if (dayChecks === numHabits && numHabits > 0) {
            perfectDays++;
        }
    }

    const targetChecks = numHabits * 7;
    const completionPct = targetChecks > 0 ? Math.min(100, Math.round((totalChecks / targetChecks) * 100)) : 0;

    // Find top and least habit
    let bestHabit = null;
    let leastHabit = null;
    let maxChecks = -1;
    let minChecks = 999;

    habits.forEach(h => {
        const count = habitCheckMap[h.id] || 0;
        if (count > maxChecks) {
            maxChecks = count;
            bestHabit = { ...h, checksInWeek: count };
        }
        if (count < minChecks) {
            minChecks = count;
            leastHabit = { ...h, checksInWeek: count };
        }
    });

    const isBoostActive = S.inventory && S.inventory.boost2xExpiresAt && Date.now() < S.inventory.boost2xExpiresAt;
    const checkMultiplier = isBoostActive ? 2 : 1;
    const weeklyDP = totalChecks * 10 * checkMultiplier + perfectDays * 30;

    let gradeTitle = 'Chiến Binh Tiên Phong';
    if (completionPct >= 90) gradeTitle = 'Huyền Thoại Kỷ Luật';
    else if (completionPct >= 75) gradeTitle = 'Chiến Binh Bất Bại';
    else if (completionPct >= 50) gradeTitle = 'Kỷ Luật Vàng';
    else if (completionPct >= 30) gradeTitle = 'Kiên Trì Bền Bỉ';

    const computed = calculateUserDPAndStreak(S);
    const isAdmin = (typeof userPlan !== 'undefined' && userPlan && userPlan.role === 'admin') || (typeof currentUser !== 'undefined' && currentUser && currentUser.email === 'admin@gmail.com');
    const finalDP = isAdmin ? 999999 : (computed.totalDP + (userBonusDP || 0));

    return {
        totalChecks,
        targetChecks,
        completionPct,
        perfectDays,
        weeklyDP,
        bestHabit,
        leastHabit,
        gradeTitle,
        streak: computed.currentStreak,
        totalDP: finalDP,
        rank: getRankLevel(finalDP)
    };
}
window.calculateWeeklyRecapData = calculateWeeklyRecapData;

let recapCurrentSlide = 0;
const RECAP_TOTAL_SLIDES = 5;
let recapTimerId = null;

function openWeeklyRecapModal() {
    const modal = document.getElementById('recapModalBg');
    if (!modal) return;
    modal.classList.add('show');
    recapCurrentSlide = 0;
    renderRecapSlide();
    if (typeof playResurrectSound === 'function') playResurrectSound();
    if (typeof fireConfetti === 'function') fireConfetti();
}
window._openWeeklyRecapModal = openWeeklyRecapModal;

function renderRecapSlide() {
    const body = document.getElementById('recapSlideBody');
    const barsContainer = document.getElementById('recapProgressBars');
    if (!body || !barsContainer) return;

    // Render bars
    let barsHtml = '';
    for (let i = 0; i < RECAP_TOTAL_SLIDES; i++) {
        const cls = i < recapCurrentSlide ? 'done' : (i === recapCurrentSlide ? 'active' : '');
        barsHtml += `<div class="recap-bar-segment ${cls}"><div class="recap-bar-fill" style="${i === recapCurrentSlide ? 'width:100%;' : ''}"></div></div>`;
    }
    barsContainer.innerHTML = barsHtml;

    const data = calculateWeeklyRecapData();
    let html = '';

    if (recapCurrentSlide === 0) {
        html = `
            <div class="recap-slide-icon"><svg class="rune-icon rune-xl" viewBox="0 0 48 48"><use href="#i-triumph"></use></svg></div>
            <div class="recap-slide-title">KỶ LUẬT TUẦN QUA</div>
            <div class="recap-slide-value">${data.completionPct}%</div>
            <div class="recap-slide-subtitle">Bạn đã hoàn thành <strong>${data.totalChecks}/${data.targetChecks}</strong> mục tiêu thói quen trong 7 ngày gần nhất.</div>
            <div class="recap-slide-pill">${data.gradeTitle}</div>
        `;
    } else if (recapCurrentSlide === 1) {
        html = `
            <div class="recap-slide-icon">⚡</div>
            <div class="recap-slide-title">NĂNG LƯỢNG DP THU VỀ</div>
            <div class="recap-slide-value">+${data.weeklyDP} DP</div>
            <div class="recap-slide-subtitle">Bao gồm điểm tick thói quen và thưởng <strong>${data.perfectDays} ngày rèn luyện hoàn hảo</strong> (100%).</div>
            <div class="recap-slide-pill">💎 Ví hiện có: ${data.totalDP.toLocaleString()} DP</div>
        `;
    } else if (recapCurrentSlide === 2) {
        html = `
            <div class="recap-slide-icon">🔥</div>
            <div class="recap-slide-title">CHUỖI NGÀY BÙNG CHÁY</div>
            <div class="recap-slide-value">${data.streak} NGÀY</div>
            <div class="recap-slide-subtitle">Kỷ luật không phải là cảm xúc nhất thời, đó là sự bền bỉ được chứng minh qua chuỗi ngày liên tiếp!</div>
            <div class="recap-slide-pill">🧊 Bình Freeze dự phòng: ${S.freezes || 0}/2</div>
        `;
    } else if (recapCurrentSlide === 3) {
        const bestName = data.bestHabit ? `${data.bestHabit.emoji || '✨'} ${data.bestHabit.name}` : 'Chưa có';
        const bestCount = data.bestHabit ? `${data.bestHabit.checksInWeek}/7 ngày` : '0';
        html = `
            <div class="recap-slide-icon"><svg class="rune-icon rune-xl" viewBox="0 0 48 48"><use href="#i-spark"></use></svg></div>
            <div class="recap-slide-title">THÓI QUEN QUÁN QUÂN</div>
            <div class="recap-slide-value" style="font-size:32px;">${escHtml(bestName)}</div>
            <div class="recap-slide-subtitle">Thói quen được rèn luyện xuất sắc nhất với <strong>${bestCount}</strong> hoàn thành trong tuần!</div>
            <div class="recap-slide-pill">💪 Tiếp tục phát huy tuần tới!</div>
        `;
    } else if (recapCurrentSlide === 4) {
        html = `
            <div class="recap-slide-icon">📸</div>
            <div class="recap-slide-title">KHOE THÀNH QUẢ KỶ LUẬT</div>
            <div class="recap-slide-subtitle" style="margin:16px 0;">Hãy tự hào về hành trình kiên trì của bạn! Xuất bức ảnh thẻ Story 9:16 tuyệt đẹp để chia sẻ lên mạng xã hội.</div>
            <button class="recap-share-btn" style="pointer-events:auto;margin-top:12px;" onclick="window._openShareCardModal()">
                📸 Mở Bộ Tạo Ảnh Thẻ Story
            </button>
        `;
    }

    body.innerHTML = html;
}

function nextRecapSlide() {
    if (recapCurrentSlide < RECAP_TOTAL_SLIDES - 1) {
        recapCurrentSlide++;
        renderRecapSlide();
    } else {
        const modal = document.getElementById('recapModalBg');
        if (modal) modal.classList.remove('show');
    }
}
window._nextRecapSlide = nextRecapSlide;

function prevRecapSlide() {
    if (recapCurrentSlide > 0) {
        recapCurrentSlide--;
        renderRecapSlide();
    }
}
window._prevRecapSlide = prevRecapSlide;

// --- SHARE CARD CANVAS GENERATOR ---

let shareSelectedRatio = 'story'; // 'story' (9:16) | 'square' (1:1)
let shareSelectedTheme = 'cyberpunk'; // 'cyberpunk' | 'luxury' | 'sakura'

const STOIC_QUOTES = [
    { text: "Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu.", author: "Jim Rohn" },
    { text: "Chúng ta là những gì chúng ta lặp đi lặp lại mỗi ngày.", author: "Aristotle" },
    { text: "Chiến thắng vĩ đại nhất là chiến thắng chính bản thân mình.", author: "Plato" },
    { text: "Kỷ luật hôm nay là tự do của ngày mai.", author: "Seneca" },
    { text: "Không có sự vĩ đại nào đạt được mà thiếu đi sự rèn luyện kiên định.", author: "Marcus Aurelius" }
];

function openShareCardModal() {
    const recapModal = document.getElementById('recapModalBg');
    if (recapModal) recapModal.classList.remove('show');

    const modal = document.getElementById('shareCardModalBg');
    if (!modal) return;
    modal.classList.add('show');
    renderShareCardToCanvas();
}
window._openShareCardModal = openShareCardModal;

function renderShareCardToCanvas(ratio = null, theme = null) {
    if (ratio) shareSelectedRatio = ratio;
    if (theme) shareSelectedTheme = theme;

    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const isStory = shareSelectedRatio === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    const data = calculateWeeklyRecapData();
    const myName = currentUser ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'User') : 'Chiến Binh Kỷ Luật';
    const titleObj = (SHOP_CATALOG && S.inventory && S.inventory.equippedTitle) ? SHOP_CATALOG.titles.find(t => t.id === S.inventory.equippedTitle) : null;
    const titleName = titleObj ? titleObj.name : '';
    const rankName = getRankTierName(data.rank);

    // 1. BACKGROUND GRADIENT
    if (shareSelectedTheme === 'luxury') {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0c0a06');
        bgGrad.addColorStop(0.5, '#191408');
        bgGrad.addColorStop(1, '#060503');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Gold border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 45, width - 90, height - 90);
    } else if (shareSelectedTheme === 'sakura') {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#2d0f1f');
        bgGrad.addColorStop(0.5, '#1c0813');
        bgGrad.addColorStop(1, '#0f0209');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 10;
        ctx.strokeRect(30, 30, width - 60, height - 60);
    } else {
        // Cyberpunk Neon
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0d0221');
        bgGrad.addColorStop(0.45, '#150630');
        bgGrad.addColorStop(1, '#020b1e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Neon cyber grid lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 2;
        for (let x = 60; x < width; x += 100) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 60; y < height; y += 100) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, width - 60, height - 60);
    }

    // 2. HEADER LOGO & BRAND
    ctx.textAlign = 'center';
    let currentY = isStory ? 150 : 110;

    ctx.font = '900 48px sans-serif';
    ctx.fillStyle = shareSelectedTheme === 'luxury' ? '#d4af37' : (shareSelectedTheme === 'sakura' ? '#f472b6' : '#00f0ff');
    ctx.fillText('✦ HABIT MASTERY ✦', width / 2, currentY);

    currentY += 45;
    ctx.font = '700 22px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('MASTER YOUR HABITS · MASTER YOUR LIFE', width / 2, currentY);

    // 3. PROFILE CARD
    currentY += isStory ? 100 : 70;
    const cardH = isStory ? 240 : 180;
    const cardW = width - 160;
    const cardX = 80;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(cardX, currentY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // User Avatar Circle
    const avatarCenterX = cardX + 90;
    const avatarCenterY = currentY + (cardH / 2);
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, 50, 0, Math.PI * 2);
    ctx.fillStyle = shareSelectedTheme === 'luxury' ? '#d4af37' : '#6366f1';
    ctx.fill();
    ctx.font = '900 40px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(myName.charAt(0).toUpperCase(), avatarCenterX, avatarCenterY + 14);

    // User Name & Rank
    ctx.textAlign = 'left';
    const textX = avatarCenterX + 75;
    ctx.font = '900 38px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(myName, textX, avatarCenterY - 14);

    ctx.font = '700 24px sans-serif';
    ctx.fillStyle = shareSelectedTheme === 'luxury' ? '#fbbf24' : '#a78bfa';
    let subInfo = `${rankName}`;
    if (titleName) subInfo += ` · ${titleName}`;
    ctx.fillText(subInfo, textX, avatarCenterY + 28);

    // 4. BIG METRIC BADGES
    currentY += cardH + (isStory ? 80 : 50);
    const badgeW = (cardW - 40) / 3;
    const badgeH = isStory ? 200 : 150;

    // Badge 1: Streak
    drawMetricBox(ctx, cardX, currentY, badgeW, badgeH, '🔥 CHUỖI STREAK', `${data.streak} NGÀY`, '#ef4444');
    // Badge 2: DP
    drawMetricBox(ctx, cardX + badgeW + 20, currentY, badgeW, badgeH, '💎 TỔNG ĐIỂM DP', `${data.totalDP.toLocaleString()}`, '#10b981');
    // Badge 3: Rate
    drawMetricBox(ctx, cardX + (badgeW + 20) * 2, currentY, badgeW, badgeH, '🎯 KỶ LUẬT TUẦN', `${data.completionPct}%`, '#06b6d4');

    // 5. HABIT WEEKLY SUMMARY LIST
    currentY += badgeH + (isStory ? 80 : 50);
    if (isStory) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(cardX, currentY, cardW, 360, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.font = '800 24px sans-serif';
        ctx.fillStyle = '#f472b6';
        ctx.fillText('⚡ THÀNH TÍCH RÈN LUYỆN 7 NGÀY QUA', cardX + 36, currentY + 54);

        const habits = (S.h || []).slice(0, 4);
        let itemY = currentY + 115;
        habits.forEach((h, idx) => {
            const hEmoji = h.emoji || '✨';
            const hName = h.name || 'Habit';
            ctx.font = '700 26px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${hEmoji}  ${hName}`, cardX + 36, itemY);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#10b981';
            ctx.fillText('Đã hoàn thành', cardX + cardW - 36, itemY);
            ctx.textAlign = 'left';

            itemY += 56;
        });

        currentY += 360 + 60;
    }

    // 6. STOIC QUOTE
    const quote = STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)];
    ctx.textAlign = 'center';
    ctx.font = 'italic 700 24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(`"${quote.text}"`, width / 2, currentY + 30);
    ctx.font = '600 20px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(`— ${quote.author}`, width / 2, currentY + 66);

    // 7. FOOTER
    const footerY = height - 80;
    ctx.font = '700 20px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('habit-mastery.web.app', width / 2, footerY);
}

function drawMetricBox(ctx, x, y, w, h, label, val, color) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '800 18px sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(label, x + w / 2, y + 42);

    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(val, x + w / 2, y + (h / 2) + 24);
}

function downloadShareCard() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `habit-mastery-${shareSelectedRatio}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span><svg class="rune-inline" viewBox="0 0 48 48"><use href="#i-archive"></use></svg></span> ${t('cardDownloadedToast') || 'Đã tải ảnh thẻ về máy!'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
}
window._downloadShareCard = downloadShareCard;

async function shareViaWebShareApi() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;

    if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], 'habit-mastery-story.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Thành Tích Kỷ Luật Habit Mastery',
                        text: 'Cùng tôi rèn luyện thói quen và duy trì kỷ luật tại Habit Mastery!'
                    });
                } catch(e) {}
            } else {
                downloadShareCard();
            }
        });
    } else {
        downloadShareCard();
    }
}
window._shareViaWebShareApi = shareViaWebShareApi;

async function copyShareCardImage() {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
            if (navigator.clipboard && navigator.clipboard.write) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                const toast = document.createElement('div');
                toast.className = 'quest-toast';
                toast.innerHTML = `<span>📋</span> ${t('cardCopiedToast') || 'Đã sao chép ảnh thẻ vào Clipboard!'}`;
                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('show'), 10);
                setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
            } else {
                downloadShareCard();
            }
        } catch(e) {
            downloadShareCard();
        }
    });
}
window._copyShareCardImage = copyShareCardImage;

function checkWeeklyRecapAutoPrompt() {
    const now = new Date();
    // Monday is day 1
    if (now.getDay() === 1) {
        const weekKey = `recap_${now.getFullYear()}_${now.getMonth()}_${Math.floor(now.getDate() / 7)}`;
        const lastSeen = localStorage.getItem('hg_last_recap_prompt');
        if (lastSeen !== weekKey) {
            localStorage.setItem('hg_last_recap_prompt', weekKey);
            setTimeout(() => {
                openWeeklyRecapModal();
            }, 1200);
        }
    }
}

function initRecapAndShareModals() {
    // Recap triggers
    const recapBtn = document.getElementById('recapBtn');
    if (recapBtn) recapBtn.onclick = () => openWeeklyRecapModal();

    const mobileRecapBtn = document.getElementById('mobileRecapBtn');
    if (mobileRecapBtn) mobileRecapBtn.onclick = () => openWeeklyRecapModal();

    const recapCloseBtn = document.getElementById('recapCloseBtn');
    if (recapCloseBtn) recapCloseBtn.onclick = () => document.getElementById('recapModalBg').classList.remove('show');

    const recapBg = document.getElementById('recapModalBg');
    if (recapBg) recapBg.onclick = (e) => { if (e.target === recapBg) recapBg.classList.remove('show'); };

    const tapLeft = document.getElementById('recapTapLeft');
    if (tapLeft) tapLeft.onclick = prevRecapSlide;

    const tapRight = document.getElementById('recapTapRight');
    if (tapRight) tapRight.onclick = nextRecapSlide;

    const prevBtn = document.getElementById('recapPrevBtn');
    if (prevBtn) prevBtn.onclick = prevRecapSlide;

    const nextBtn = document.getElementById('recapNextBtn');
    if (nextBtn) nextBtn.onclick = nextRecapSlide;

    const toShareBtn = document.getElementById('recapToShareBtn');
    if (toShareBtn) toShareBtn.onclick = openShareCardModal;

    // Share triggers
    const shareCardBtn = document.getElementById('shareCardBtn');
    if (shareCardBtn) shareCardBtn.onclick = () => openShareCardModal();

    const shareCloseBtn = document.getElementById('shareCardCloseBtn');
    if (shareCloseBtn) shareCloseBtn.onclick = () => document.getElementById('shareCardModalBg').classList.remove('show');

    const shareBg = document.getElementById('shareCardModalBg');
    if (shareBg) shareBg.onclick = (e) => { if (e.target === shareBg) shareBg.classList.remove('show'); };

    // Ratio buttons
    const optStory = document.getElementById('optRatioStory');
    const optSquare = document.getElementById('optRatioSquare');
    if (optStory && optSquare) {
        optStory.onclick = () => {
            optStory.classList.add('active');
            optSquare.classList.remove('active');
            renderShareCardToCanvas('story', null);
        };
        optSquare.onclick = () => {
            optSquare.classList.add('active');
            optStory.classList.remove('active');
            renderShareCardToCanvas('square', null);
        };
    }

    // Theme buttons
    const optCyber = document.getElementById('optThemeCyber');
    const optLuxury = document.getElementById('optThemeLuxury');
    const optSakura = document.getElementById('optThemeSakura');
    if (optCyber && optLuxury && optSakura) {
        optCyber.onclick = () => {
            optCyber.classList.add('active');
            optLuxury.classList.remove('active');
            optSakura.classList.remove('active');
            renderShareCardToCanvas(null, 'cyberpunk');
        };
        optLuxury.onclick = () => {
            optLuxury.classList.add('active');
            optCyber.classList.remove('active');
            optSakura.classList.remove('active');
            renderShareCardToCanvas(null, 'luxury');
        };
        optSakura.onclick = () => {
            optSakura.classList.add('active');
            optCyber.classList.remove('active');
            optLuxury.classList.remove('active');
            renderShareCardToCanvas(null, 'sakura');
        };
    }

    // Download & Share
    const dlBtn = document.getElementById('shareDownloadBtn');
    if (dlBtn) dlBtn.onclick = downloadShareCard;

    const nativeBtn = document.getElementById('shareNativeBtn');
    if (nativeBtn) nativeBtn.onclick = shareViaWebShareApi;

    const copyBtn = document.getElementById('shareCopyBtn');
    if (copyBtn) copyBtn.onclick = copyShareCardImage;
}

// ==================== TRỤ CỘT 5: CÔNG CỤ HỖ TRỢ TRỰC TIẾP (POMODORO & DAILY STOIC QUOTES) ====================

// --- 1. WEB AUDIO API AMBIENT SOUNDSCAPE SYNTHESIZER ---

let currentAmbientType = 'none';
let ambientNodes = null;
let ambientGainNode = null;
let ambientMasterVolume = 0.5;

function stopAmbientSound() {
    if (ambientGainNode && audioCtx) {
        try {
            ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, audioCtx.currentTime);
            ambientGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        } catch(e){}
    }
    setTimeout(() => {
        if (ambientNodes) {
            try {
                if (ambientNodes.source) ambientNodes.source.stop();
                if (ambientNodes.lfo) ambientNodes.lfo.stop();
                if (ambientNodes.interval) clearInterval(ambientNodes.interval);
            } catch(e){}
            ambientNodes = null;
        }
        currentAmbientType = 'none';
    }, 320);
}

function playAmbientSound(type, volume = 0.5) {
    ambientMasterVolume = volume;
    if (type === 'none') {
        stopAmbientSound();
        return;
    }
    stopAmbientSound();

    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        currentAmbientType = type;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume * 0.35), ctx.currentTime + 0.5);
        masterGain.connect(ctx.destination);
        ambientGainNode = masterGain;

        if (type === 'rain') {
            // Rain generator: Pink noise buffer with lowpass
            const bufferSize = ctx.sampleRate * 3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(950, ctx.currentTime);

            noise.connect(filter);
            filter.connect(masterGain);
            noise.start();
            ambientNodes = { source: noise };
        } else if (type === 'ocean') {
            // Ocean generator: filtered noise with slow wave LFO
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.28;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(360, ctx.currentTime);
            filter.Q.setValueAtTime(1.2, ctx.currentTime);

            const lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(220, ctx.currentTime);
            lfo.connect(filter.frequency);

            noise.connect(filter);
            filter.connect(masterGain);
            noise.start();
            lfo.start();
            ambientNodes = { source: noise, lfo: lfo };
        } else if (type === 'noise') {
            // White Noise Focus
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1800, ctx.currentTime);

            noise.connect(filter);
            filter.connect(masterGain);
            noise.start();
            ambientNodes = { source: noise };
        } else if (type === 'lofi') {
            // Lo-fi Rhodes Chords
            const chords = [
                [261.63, 329.63, 392.00, 493.88], // Cmaj7
                [220.00, 261.63, 329.63, 392.00], // Am7
                [174.61, 220.00, 261.63, 329.63], // Fmaj7
                [196.00, 246.94, 293.66, 349.23]  // G7
            ];
            let chordIdx = 0;
            const playNextChord = () => {
                if (currentAmbientType !== 'lofi' || !audioCtx) return;
                const chord = chords[chordIdx % chords.length];
                chordIdx++;
                chord.forEach((freq) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    g.gain.setValueAtTime(0.0001, ctx.currentTime);
                    g.gain.linearRampToValueAtTime(0.025 * volume, ctx.currentTime + 0.3);
                    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start();
                    osc.stop(ctx.currentTime + 3.2);
                });
            };
            playNextChord();
            const interval = setInterval(playNextChord, 3400);
            ambientNodes = { interval: interval };
        }
    } catch(e) { console.warn('Ambient sound error:', e); }
}

function playPomodoroEndChime() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.15);
            g.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.15);
            g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.15 + 0.05);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 2.5);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.15);
            osc.stop(ctx.currentTime + idx * 0.15 + 2.6);
        });
    } catch(e){}
}

// --- 2. POMODORO TIMER ENGINE ---

let pomoState = {
    mode: 'pomodoro', // 'pomodoro' | 'short' | 'long'
    totalSeconds: 25 * 60,
    secondsLeft: 25 * 60,
    isRunning: false,
    intervalId: null,
    selectedHabitId: null,
    ambientType: 'none',
    volume: 0.5
};

function openPomodoroModal(habitId = null) {
    const modal = document.getElementById('pomodoroModalBg');
    if (!modal) return;
    modal.classList.add('show');

    // Populate habit selector
    const sel = document.getElementById('pomoHabitSelect');
    if (sel) {
        let optHtml = `<option value="">${t('pomoFreeDeepWork')}</option>`;
        (S.h || []).forEach(h => {
            optHtml += `<option value="${h.id}">${h.emoji || '✨'} ${h.name}</option>`;
        });
        sel.innerHTML = optHtml;
        if (habitId) {
            sel.value = habitId;
            pomoState.selectedHabitId = habitId;
        } else if (pomoState.selectedHabitId) {
            sel.value = pomoState.selectedHabitId;
        }
    }

    updatePomoDisplay();
}
window._openPomodoroModal = openPomodoroModal;

function switchPomoMode(mode) {
    pomoState.mode = mode;
    if (mode === 'pomodoro') pomoState.totalSeconds = 25 * 60;
    else if (mode === 'short') pomoState.totalSeconds = 5 * 60;
    else if (mode === 'long') pomoState.totalSeconds = 15 * 60;

    pausePomodoroTimer();
    pomoState.secondsLeft = pomoState.totalSeconds;

    document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    const statusEl = document.getElementById('pomoStatusLabel');
    if (statusEl) {
        statusEl.textContent = mode === 'pomodoro' ? t('pomoReady') : (mode === 'short' ? t('pomoShortRest') : t('pomoLongRest'));
    }

    updatePomoDisplay();
}

function startPomodoroTimer() {
    if (pomoState.isRunning) {
        pausePomodoroTimer();
        return;
    }

    pomoState.isRunning = true;
    const startBtn = document.getElementById('pomoStartBtn');
    if (startBtn) {
        startBtn.textContent = t('pomoPause');
        startBtn.classList.add('running');
    }

    const statusEl = document.getElementById('pomoStatusLabel');
    if (statusEl) statusEl.textContent = pomoState.mode === 'pomodoro' ? t('pomoFocusing') : t('pomoResting');

    // Start ambient sound if selected
    if (pomoState.ambientType !== 'none') {
        playAmbientSound(pomoState.ambientType, pomoState.volume);
    }

    pomoState.intervalId = setInterval(() => {
        if (pomoState.secondsLeft > 0) {
            pomoState.secondsLeft--;
            updatePomoDisplay();
        } else {
            onPomodoroFinished();
        }
    }, 1000);
}

function pausePomodoroTimer() {
    pomoState.isRunning = false;
    if (pomoState.intervalId) {
        clearInterval(pomoState.intervalId);
        pomoState.intervalId = null;
    }

    const startBtn = document.getElementById('pomoStartBtn');
    if (startBtn) {
        startBtn.textContent = t('pomoContinue');
        startBtn.classList.remove('running');
    }

    const statusEl = document.getElementById('pomoStatusLabel');
    if (statusEl) statusEl.textContent = t('pomoPaused');

    stopAmbientSound();
}

function resetPomodoroTimer() {
    pausePomodoroTimer();
    pomoState.secondsLeft = pomoState.totalSeconds;
    const startBtn = document.getElementById('pomoStartBtn');
    if (startBtn) startBtn.textContent = t('pomoStart');
    const statusEl = document.getElementById('pomoStatusLabel');
    if (statusEl) statusEl.textContent = t('pomoReady');
    updatePomoDisplay();
}

function updatePomoDisplay() {
    const mins = Math.floor(pomoState.secondsLeft / 60);
    const secs = pomoState.secondsLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const display = document.getElementById('pomoTimeDisplay');
    if (display) display.textContent = formatted;

    // Update circular progress SVG
    const circle = document.getElementById('pomoCircleProgress');
    if (circle) {
        const circumference = 804.25; // 2 * PI * 128
        const progress = pomoState.secondsLeft / pomoState.totalSeconds;
        const offset = circumference * (1 - progress);
        circle.style.strokeDashoffset = offset;
    }
}

async function onPomodoroFinished() {
    pausePomodoroTimer();
    playPomodoroEndChime();
    if (typeof fireConfetti === 'function') fireConfetti();

    let toastMsg = t('pomoCompletedToast') || '🎉 Hoàn thành phiên tập trung! +15 DP';

    // If pomodoro mode and habit was selected -> auto check-in!
    const sel = document.getElementById('pomoHabitSelect');
    const habitId = sel ? sel.value : null;

    if (pomoState.mode === 'pomodoro' && habitId) {
        const now = new Date();
        const k = ck(habitId, now.getDate());
        if (!S.c[k]) {
            S.c[k] = true;
            save();
            render();
            if (typeof onHabitCheckedSyncSquadAndDuel === 'function') {
                onHabitCheckedSyncSquadAndDuel();
            }
            toastMsg = t('pomoHabitCompletedToast') || '🎉 Đã hoàn thành 25p! Thói quen đã tự động check-in (+15 DP)';
        }
    }

    // Award bonus 15 DP
    userBonusDP = (userBonusDP || 0) + 15;
    localStorage.setItem('hg_bonus_dp', userBonusDP);
    updateUserDPState(true);
    if (typeof syncUserLeaderboard === 'function') syncUserLeaderboard();

    // Show Toast
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<span>⏱️</span> ${toastMsg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3200);

    resetPomodoroTimer();
}

function initPomodoroModal() {
    const pomoBtn = document.getElementById('pomodoroBtn');
    if (pomoBtn) pomoBtn.onclick = () => openPomodoroModal();

    const mobileBtn = document.getElementById('mobilePomodoroBtn');
    if (mobileBtn) mobileBtn.onclick = () => openPomodoroModal();

    const closeBtn = document.getElementById('pomoCloseBtn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('pomodoroModalBg').classList.remove('show');
            if (pomoState.ambientType !== 'none' && !pomoState.isRunning) stopAmbientSound();
        };
    }

    const bg = document.getElementById('pomodoroModalBg');
    if (bg) {
        bg.onclick = (e) => {
            if (e.target === bg) {
                bg.classList.remove('show');
                if (pomoState.ambientType !== 'none' && !pomoState.isRunning) stopAmbientSound();
            }
        };
    }

    const startBtn = document.getElementById('pomoStartBtn');
    if (startBtn) startBtn.onclick = startPomodoroTimer;

    const resetBtn = document.getElementById('pomoResetBtn');
    if (resetBtn) resetBtn.onclick = resetPomodoroTimer;

    // Mode buttons
    const m25 = document.getElementById('pomoMode25');
    const m5 = document.getElementById('pomoMode5');
    const m15 = document.getElementById('pomoMode15');
    if (m25) m25.onclick = () => switchPomoMode('pomodoro');
    if (m5) m5.onclick = () => switchPomoMode('short');
    if (m15) m15.onclick = () => switchPomoMode('long');

    // Ambient sound buttons
    document.querySelectorAll('.pomo-sound-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.pomo-sound-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pomoState.ambientType = btn.dataset.sound;
            playAmbientSound(pomoState.ambientType, pomoState.volume);
        };
    });

    const volSlider = document.getElementById('pomoVolumeSlider');
    if (volSlider) {
        volSlider.oninput = (e) => {
            pomoState.volume = parseFloat(e.target.value);
            if (ambientGainNode && audioCtx) {
                ambientGainNode.gain.setValueAtTime(pomoState.volume * 0.35, audioCtx.currentTime);
            }
        };
    }
}

// --- 3. DAILY STOIC & MINDSET QUOTES ENGINE ---

const DAILY_STOIC_QUOTES = [
    { vi: "Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu.", zh: "自律是连接目标与成就的桥梁。", en: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { vi: "Chúng ta là những gì chúng ta lặp đi lặp lại mỗi ngày. Sự xuất sắc không phải là hành động mà là thói quen.", zh: "我们日复一日做的事情决定了我们。优秀不是一种行为，而是一种习惯。", en: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { vi: "Chiến thắng vĩ đại nhất là chiến thắng chính bản thân mình.", zh: "最伟大的胜利就是战胜自我。", en: "The first and greatest victory is to conquer yourself.", author: "Plato" },
    { vi: "Kỷ luật hôm nay là tự do của ngày mai.", zh: "今日的自律，铸就明日的自由。", en: "Discipline today equals freedom tomorrow.", author: "Jocko Willink" },
    { vi: "Bạn có quyền kiểm soát tâm trí của mình, chứ không phải các sự kiện bên ngoài. Hãy nhận ra điều này, và bạn sẽ tìm thấy sức mạnh.", zh: "你能掌控自己的心灵，而非外在事件。明白这一点，你将所向披靡。", en: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
    { vi: "Chúng ta đau khổ trong trí tưởng tượng nhiều hơn là trong thực tế.", zh: "我们在想象中所受的苦，远多于在现实中所受的。", en: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { vi: "Đừng đòi hỏi sự việc phải diễn ra theo ý bạn, hãy mong muốn chúng diễn ra đúng như thực tế, và cuộc đời bạn sẽ an yên.", zh: "不要要求事情按你的期望发生，而是顺应事情原本的样子，你就会生活得平静。", en: "Don't demand that things happen as you wish, but wish them to happen as they do, and you will go on well.", author: "Epictetus" },
    { vi: "Người chịu được những điều người khác không chịu được sẽ làm được những việc người khác không làm được.", zh: "能忍常人所不能忍者，必能成常人所不能成之事。", en: "He who can endure what others cannot will achieve what others never can.", author: "David Goggins" },
    { vi: "Mỗi hành động bạn thực hiện là một lá phiếu cho kiểu người bạn muốn trở thành.", zh: "你的每一次行动，都是对你想成为的那种人投下的一票。", en: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
    { vi: "Kẻ thắng người là có sức, kẻ thắng mình là người mạnh.", zh: "胜人者有力，自胜者强。", en: "He who overcomes others has strength; he who overcomes himself is mighty.", author: "Lão Tử (Lao Tzu)" }
];

let curQuoteIndex = 0;

function getRandomStoicQuote() {
    const d = new Date();
    const daySeed = d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate();
    return DAILY_STOIC_QUOTES[daySeed % DAILY_STOIC_QUOTES.length];
}

function renderDailyQuoteWidget() {
    const quote = DAILY_STOIC_QUOTES[curQuoteIndex % DAILY_STOIC_QUOTES.length] || getRandomStoicQuote();
    const textEl = document.getElementById('dqwText');
    const authorEl = document.getElementById('dqwAuthor');

    if (textEl && authorEl) {
        const lang = curLang || 'vi';
        const txt = quote[lang] || quote.vi || quote.en;
        textEl.textContent = `"${txt}"`;
        authorEl.textContent = `— ${quote.author}`;
    }

    const refreshBtn = document.getElementById('dqwRefreshBtn');
    if (refreshBtn && !refreshBtn.dataset.bound) {
        refreshBtn.dataset.bound = 'true';
        refreshBtn.onclick = () => {
            curQuoteIndex = (curQuoteIndex + 1 + Math.floor(Math.random() * (DAILY_STOIC_QUOTES.length - 1))) % DAILY_STOIC_QUOTES.length;
            renderDailyQuoteWidget();
        };
    }

    const copyBtn = document.getElementById('dqwCopyBtn');
    if (copyBtn && !copyBtn.dataset.bound) {
        copyBtn.dataset.bound = 'true';
        copyBtn.onclick = () => {
            const txt = textEl ? `${textEl.textContent} ${authorEl.textContent}` : '';
            navigator.clipboard.writeText(txt).then(() => {
                const toast = document.createElement('div');
                toast.className = 'quest-toast';
                toast.innerHTML = `<span>📜</span> ${t('quoteCopiedToast') || 'Đã sao chép câu trích dẫn!'}`;
                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('show'), 10);
                setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
            });
        };
    }

    const shareBtn = document.getElementById('dqwShareBtn');
    if (shareBtn && !shareBtn.dataset.bound) {
        shareBtn.dataset.bound = 'true';
        shareBtn.onclick = () => {
            if (typeof openShareCardModal === 'function') openShareCardModal();
        };
    }
}
window.renderDailyQuoteWidget = renderDailyQuoteWidget;

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',initAuthGuard):initAuthGuard();
})();

