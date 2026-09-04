/**
 * =======================================================================
 * HABIT MASTERY - UNIFIED INTERNATIONALIZATION (i18n) ENGINE
 * Hỗ trợ: Tiếng Việt (vi), English (en), 简体中文 (zh)
 * 
 * Quy tắc tự động nhận diện ngôn ngữ:
 * 1. Tham số test nhanh trên URL (?lang=en | ?lang=zh | ?country=US)
 * 2. Lựa chọn đã lưu thủ công của người dùng (localStorage: 'hm_app_lang' / 'hg_lang')
 * 3. Ngôn ngữ thiết bị / hệ điều hành / trình duyệt (navigator.languages)
 *    - vi* -> Tiếng Việt ('vi')
 *    - zh* -> Tiếng Trung ('zh')
 * 4. Kiểm tra ngầm vị trí địa lý IP (Non-blocking GeoIP check)
 *    - VN -> 'vi', CN -> 'zh'
 * 5. Mặc định toàn cầu (Mỹ, Singapore, Indo, Châu Âu,...) -> Tiếng Anh ('en')
 * =======================================================================
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'hm_app_lang';
    const LEGACY_KEY = 'hg_lang';
    const SUPPORTED_LANGS = ['vi', 'en', 'zh'];
    const DEFAULT_LANG = 'en'; // Mặc định cho toàn bộ người dùng ngoài Việt Nam

    // Dictionary of translations
    const translations = {
        vi: {
    "desktop_app_title": "Ứng dụng Máy tính",
    "desktop_app_badge": "💻 DESKTOP APP",
    "desktop_app_headline": "Tải ứng dụng Máy tính (Windows & Mac)",
    "desktop_app_desc": "Khởi động cùng máy tính, mượt mà & thông báo chuẩn xác không cần mở trình duyệt.",
    "btn_download_setup": "Tải bản Cài đặt (.zip)",
    "btn_download_guide": "Tùy chọn & Bản cho Mac",
    "desktop_quick_text": "Dùng máy tính? Tải ứng dụng cho Windows & macOS",
    "card_dl_title": "Tải ứng dụng cho Máy tính",
    "card_dl_sub": "Windows & macOS • Khởi động cùng máy, mượt mà",
    "card_dl_badge": "Tải về ⬇",
    "modal_download_title": "Tải Ứng Dụng Habit Mastery Cho Máy Tính",
    "modal_download_subtitle": "Trải nghiệm rèn luyện kỷ luật độc lập, mượt mà và tập trung tối đa trên Windows & macOS.",
    "tab_os_win": "🪟 Windows",
    "tab_os_mac": "🍎 macOS (MacBook / iMac)",
    "card_installer_title": "Bản Cài Đặt (Setup .zip)",
    "card_installer_desc": "Tự động tạo biểu tượng trên Desktop, Start Menu & tích hợp thông báo hệ thống Windows.",
    "card_installer_btn": "⬇ Tải HabitMastery-Setup.zip (86 MB)",
    "card_portable_title": "Bản Di Động (Portable .zip)",
    "card_portable_desc": "Không cần cài đặt, tải về bấm chạy ngay lập tức. Thích hợp lưu trữ USB mang đi mọi nơi.",
    "card_portable_btn": "⬇ Tải HabitMastery-Portable.zip (78 MB)",
    "card_mac_pwa_title": "Cài Đặt Nhanh Vào Dock (Khuyên dùng)",
    "card_mac_pwa_desc": "Không cần tải file nặng. Safari: Menu File ➔ Add to Dock. Chrome/Edge: bấm biểu tượng Cài đặt trên thanh URL.",
    "card_mac_pwa_btn": "⭐ Cách cài vào Dock Mac (1 nhấp)",
    "card_mac_dmg_title": "Bản Đóng Gói Cài Đặt (.dmg)",
    "card_mac_dmg_desc": "Bản cài độc lập cho chip Apple Silicon (M1/M2/M3/M4) và chip Intel x64 thông qua GitHub Releases.",
    "card_mac_dmg_btn": "⬇ Tải Bản .DMG (GitHub Releases)",
    "guide_sec_title": "💡 Hướng dẫn mở lần đầu nếu Windows cảnh báo:",
    "guide_step1": "Tải về mở file .zip và chạy file cài đặt. Nếu xuất hiện <em>\"Windows protected your PC\"</em>: Bấm <strong>\"More info\" (Thông tin thêm)</strong> → Chọn <strong>\"Run anyway\" (Vẫn chạy)</strong>.",
    "guide_step2": "Nếu file tải về bị chặn: Chuột phải vào file → chọn <strong>Properties</strong> → tick ô <strong>Unblock</strong> ở dưới cùng → bấm OK.",
    "guide_step3": "Đăng nhập tài khoản của bạn để đồng bộ ngay lập tức toàn bộ thói quen và dữ liệu từ web!",
    "guide_txt_btn": "📄 Tải file hướng dẫn chi tiết (.txt)",
    "mac_guide_title": "💡 Hướng dẫn mở lần đầu nếu macOS chặn file .dmg:",
    "mac_guide_step1": "Mở file .dmg và kéo biểu tượng Habit Mastery vào thư mục <strong>Applications</strong>.",
    "mac_guide_step2": "Nếu hiện cảnh báo nhà phát triển chưa xác định: Nhấn giữ phím <strong>Control</strong> + click vào app (hoặc chuột phải) ➔ Chọn <strong>Open</strong> ➔ Bấm <strong>Open</strong>.",
    "mac_guide_step3": "Hoặc vào <strong>Cài đặt hệ thống (System Settings)</strong> ➔ <strong>Quyền riêng tư & Bảo mật</strong> ➔ cuộn xuống chọn <strong>Open Anyway</strong>.",
    "title": "THEO DÕI THÓI QUEN",
    "calSettings": "CÀI ĐẶT LỊCH",
    "year": "Năm",
    "month": "Tháng",
    "overallStats": "Thống Kê Chung",
    "completed": "Hoàn thành",
    "left": "Còn lại",
    "myHabits": "Thói Quen",
    "target": "Mục tiêu",
    "actual": "Thực tế",
    "leftCol": "Còn",
    "progress": "Tiến độ",
    "top10": "TOP 10 THÓI QUEN",
    "mood": "Tâm trạng",
    "hoursOfSleep": "Giờ ngủ",
    "hrs": "giờ",
    "addHabit": "+ Thêm thói quen",
    "addNewHabit": "Thêm Thói Quen Mới",
    "editHabit": "Sửa Thói Quen",
    "habitNamePh": "Tên thói quen...",
    "cancel": "Hủy",
    "save": "Lưu",
    "deleteConfirm": "Xóa thói quen này?",
    "exportOk": "Đã xuất dữ liệu!",
    "importOk": "Đã nhập dữ liệu!",
    "importFail": "File không hợp lệ!",
    "months": [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
    ],
    "days": [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7"
    ],
    "dailyNotes": "Ghi chú hàng ngày",
    "notesPh": "Nhập ghi chú hôm nay...",
    "heatmap": "Mật độ hoạt động cả năm",
    "less": "Ít",
    "more": "Nhiều",
    "targetLabelModal": "Mục tiêu thói quen",
    "targetHint": "ngày/tháng",
    "dayMon": "T2",
    "dayWed": "T4",
    "dayFri": "T6",
    "tabHabits": "Thói quen",
    "tabStats": "Thống kê",
    "tabCommunity": "Cộng đồng",
    "tabArena": "Đấu trường",
    "tabMore": "Khám phá",
    "tabCharts": "Biểu đồ",
    "tabHeatmap": "Mật độ",
    "tabNotes": "Ghi chú",
    "tabTop10": "Top 10",
    "tabLeaderboard": "BXH",
    "tabQuests": "Nhiệm vụ",
    "tabBackup": "Sao Lưu Dữ Liệu",
    "tabVip": "Nâng Cấp VIP",
    "moreMenuTitle": "TÍNH NĂNG & TIỆN ÍCH",
    "moreQuestsDesc": "Nhiệm vụ ngày, tuần & nhận DP",
    "morePomoDesc": "Đồng hồ Pomodoro & Ambient",
    "moreStreakDesc": "Bình đóng băng & Cứu chuỗi",
    "moreShopDesc": "Danh hiệu, theme & hiệu ứng",
    "moreSquadDesc": "Bang hội kỷ luật & thách đấu",
    "moreRecapDesc": "Thẻ vinh danh Year in Review",
    "moreVipDesc": "Mở khóa toàn bộ tính năng cao cấp",
    "moreBackupDesc": "Xuất & khôi phục file JSON",
    "moreProfileDesc": "Đổi tên, avatar, đăng xuất",
    "freezeCol": "Đóng băng cột (Ghim)",
    "unfreezeCol": "Bỏ đóng băng cột",
    "collapseCol": "Thu gọn cột",
    "expandCol": "Mở rộng cột",
    "lbTitle": "BẢNG XẾP HẠNG CỘNG ĐỒNG",
    "weeklySprint": "Tuần Này",
    "topStreak": "Chuỗi Dài Nhất",
    "topPlayers": "Xếp Hạng Top 50",
    "communityTitle": "CỘNG ĐỒNG RÈN LUYỆN",
    "cmLatest": "Mới nhất",
    "cmTips": "Kinh nghiệm",
    "cmMotivation": "Động lực",
    "rankTiers": "Các Cấp Bậc",
    "editProfileTitle": "HỒ SƠ",
    "displayNameLabel": "Tên hiển thị",
    "displayNamePh": "Nhập tên hiển thị...",
    "avatarUploadLabel": "Hình đại diện",
    "uploadFromDevice": "Tải ảnh từ máy",
    "randomAvatar": "Ảnh ngẫu nhiên",
    "avatarUrlPh": "Hoặc dán URL ảnh (https://...)",
    "selectFrameLabel": "Khung Viền Avatar theo Level",
    "saveProfile": "Lưu thay đổi",
    "yourName": "Tên của bạn",
    "seasonBanner": "MÙA 1: ĐƯỜNG ĐUA KỶ LUẬT",
    "seasonTimer": "Tự động làm mới hàng tuần",
    "currentRank": "Cấp Hiện Tại",
    "rankAchieved": "Đã Đạt",
    "rankLocked": "Chưa Đạt",
    "usingFrame": "Đang dùng",
    "availableFrame": "Khả dụng",
    "lockedFrame": "Cần Level",
    "rankProgressTo": "Còn",
    "rankProgressUp": "DP lên",
    "rankMaxed": "Đã Đạt Cấp Tối Đa",
    "questTitle": "NHIỆM VỤ RÈN LUYỆN",
    "questDaily": "Hàng ngày",
    "questWeekly": "Hàng tuần",
    "questAchievement": "Thành tích",
    "questSurprise": "Đột xuất",
    "questClaimed": "Đã nhận",
    "questClaim": "Nhận thưởng",
    "questLocked": "Chưa hoàn thành",
    "questProgress": "Tiến độ",
    "questReward": "Thưởng",
    "questResetDaily": "Reset hàng ngày",
    "questResetWeekly": "Reset hàng tuần",
    "questPermanent": "Vĩnh viễn",
    "questCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Nhiệm vụ hoàn thành!",
    "questClaimedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Đã nhận thưởng DP!",
    "questReportDone": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Báo hoàn thành",
    "questPending": "Chờ duyệt",
    "questApproved": "Đã duyệt",
    "tabStreakShield": "Bảo vệ chuỗi",
    "streakModalTitle": "BẢO VỆ & CỨU CHUỖI",
    "streakFreeze": "Bình Đóng Băng",
    "streakRepair": "Vá Chuỗi 24h",
    "streakStatus": "Tình trạng chuỗi",
    "streakActive": "Đang duy trì",
    "streakBroken": "Bị đứt hôm qua",
    "streakProtected": "Được bảo vệ bởi Bình Đóng Băng",
    "buyFreeze": "Mua Bình Đóng Băng",
    "repairStreak": "Hồi Sinh Chuỗi",
    "freezeAutoToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> Bình Đóng Băng đã tự động bảo vệ chuỗi của bạn hôm qua!",
    "streakRepairToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> Chuỗi của bạn đã được HỒI SINH thành công!",
    "freezeBoughtToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> Đã mua 1 Bình Đóng Băng thành công!",
    "streakSafeDesc": "Bạn đang có bình đóng băng bảo vệ nếu lỡ quên check-in.",
    "streakDangerDesc": "Bạn chưa có bình đóng băng dự trữ! Hãy mua để tránh đứt chuỗi.",
    "streakBrokenDesc": "Chuỗi của bạn đã bị đứt hôm qua. Bạn có 24h để cứu lại chuỗi!",
    "freezeFlask1": "Bình 1 (Chính)",
    "freezeFlask2": "Bình 2 (Dự phòng)",
    "freezeReady": "Sẵn sàng kích hoạt",
    "freezeEmpty": "Chưa có (Mua thêm)",
    "buyFreezeDesc": "Tự động bảo vệ chuỗi nếu lỡ quên 1 ngày check-in (Tối đa 2 bình).",
    "repairStreakDesc": "Vá lại chuỗi bị đứt trong 24h qua, hồi sinh số ngày chuỗi nguyên vẹn.",
    "historyTitle": "LỊCH SỬ BẢO VỆ CHUỖI",
    "noHistory": "Chưa có lượt bảo vệ nào gần đây.",
    "daysUnit": "ngày",
    "maxStreakLabel": "Kỷ lục",
    "currentStreakLabel": "Chuỗi hiện tại",
    "tabShop": "Cửa hàng",
    "shopModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-market\"></use></svg> CỬA HÀNG KỶ LUẬT",
    "shopTabTitles": "Danh hiệu",
    "shopTabThemes": "Giao diện",
    "shopTabFX": "Hiệu ứng",
    "shopTabItems": "Vật phẩm",
    "shopTabBackpack": "Túi Đồ",
    "shopTabDocs": "Tài liệu",
    "btnBuy": "Mua",
    "btnEquip": "Trang bị",
    "btnEquipped": "Đang dùng",
    "btnUse": "Dùng ngay",
    "btnOpenChest": "Mở Rương",
    "noBackpackItems": "Túi đồ đang trống. Hãy ghé tab Vật phẩm để sở hữu các bùa lợi kỷ luật!",
    "activeBuffsTitle": "BÙA LỢI & HIỆU ỨNG ĐANG HOẠT ĐỘNG",
    "itemBoughtToast": "Đã mua thành công!",
    "itemEquippedToast": "Đã trang bị thành công!",
    "boostActivatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> Đã kích hoạt Vé Nhân Đôi 2X trong 24h!",
    "tabSquad": "Tổ đội",
    "squadHubTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> TỔ ĐỘI & THÁCH ĐẤU 1V1",
    "squadTabGuild": "Tổ Đội Rèn Luyện",
    "squadTabDuel": "Đấu Trường 1v1",
    "btnNudge": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Thúc giục",
    "nudgeSentToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Đã gửi lời thúc giục sấm sét đến đồng đội!",
    "squadCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Đã tạo tổ đội thành công!",
    "squadJoinedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Đã gia nhập tổ đội!",
    "squadLeftToast": "Đã rời tổ đội.",
    "duelCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> Đã tạo phòng thách đấu 7 ngày!",
    "duelAcceptedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> Trận chiến 1v1 chính thức bắt đầu!",
    "duelWonToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-triumph\"></use></svg> Chúc mừng! Bạn đã chiến thắng trận đấu 1v1!",
    "tabRecap": "Tổng kết",
    "tabShareCard": "Khoe thẻ",
    "shareModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> XUẤT ẢNH THẺ KHOE KỶ LUẬT",
    "recapTitle": "Bản Tin Tổng Kết Tuần",
    "cardDownloadedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Đã tải ảnh thẻ về máy!",
    "cardCopiedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Đã sao chép ảnh thẻ vào Clipboard!",
    "tabPomodoro": "Focus",
    "pomoModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-focus\"></use></svg> ĐỒNG HỒ TẬP TRUNG (DEEP WORK)",
    "pomoCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Hoàn thành phiên tập trung! +15 Điểm thưởng Bonus",
    "pomoHabitCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Đã hoàn thành 25p! Thói quen đã tự động check-in (+15 Điểm)",
    "quoteCopiedToast": "Đã sao chép câu trích dẫn!",
    "pomoLinkHabit": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> GẮN VỚI THÓI QUEN:",
    "pomoFreeDeepWork": "-- Tập trung tự do (Deep Work) --",
    "pomoPomodoro": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cycle\"></use></svg> FOCUS · 25m",
    "pomoShortBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> REST · 5m",
    "pomoLongBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-crescent\"></use></svg> RECHARGE · 15m",
    "pomoCustom": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> TÙY CHỈNH",
    "pomoCustomNoDp": "⏱️ Chế độ tự do · Không cộng điểm DP",
    "pomoCustomReady": "Đếm ngược tùy chỉnh",
    "pomoStart": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Bắt Đầu",
    "pomoReset": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-reset\"></use></svg> Đặt Lại",
    "pomoPause": "⏸ Tạm Dừng",
    "pomoContinue": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Tiếp Tục",
    "pomoReady": "Đang sẵn sàng",
    "pomoFocusing": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> Đang tập trung...",
    "pomoResting": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> Đang nghỉ ngơi...",
    "pomoPaused": "Đang tạm dừng",
    "pomoShortRest": "Nghỉ ngơi 5 phút",
    "pomoLongRest": "Nghỉ ngơi 15 phút",
    "pomoRewardHint": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> Thưởng +15 khi hoàn thành",
    "pomoSoundMixerTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-mixer\"></use></svg> BỘ HÒA ÂM TẬP TRUNG (SOUND MIXER):",
    "pomoAmbientLabel": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-mixer\"></use></svg> BỘ HÒA ÂM TẬP TRUNG (SOUND MIXER):",
    "pomoSoundOff": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-mute\"></use></svg> Tắt",
    "pomoSoundRain": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-rain\"></use></svg> Mưa Rơi",
    "pomoSoundOcean": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-tide\"></use></svg> Sóng Biển",
    "pomoSoundNoise": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-static\"></use></svg> Tiếng Ồn Trắng",
    "pomoSoundLofi": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-disc\"></use></svg> Lo-fi Chords",
    "cmPlaceholder": "Chia sẻ câu chuyện, thành tích hoặc động lực rèn luyện của bạn...",
    "cmAttachImage": "Ảnh",
    "cmAttachVideo": "Video",
    "cmSubmitPost": "Đăng bài",
    "cmFeedHeader": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> BÀI VIẾT TỪ CỘNG ĐỒNG",
    "cmRefresh": "Tải lại",
    "streakShopTitle": "CỬA HÀNG CỨU CHUỖI",
    "streakWallet": "Ví",
    "streakBuyBtn": "Mua",
    "streakNoNeed": "Không cần vá",
    "streakAvailable": "CÒN",
    "squadJoinTitle": "Gia Nhập Tổ Đội Rèn Luyện",
    "squadJoinDesc": "Nghiên cứu chỉ ra rằng khi có đồng đội cùng theo dõi và nhắc nhở, tỷ lệ duy trì kỷ luật thói quen tăng tới <b>85%</b>! Hãy tạo hoặc tham gia một tổ đội ngay.",
    "squadCreateTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Tạo Tổ Đội Mới (3-5 Người)",
    "squadNamePh": "Tên tổ đội (VD: Chiến Binh 5H Sáng)...",
    "squadIconLabel": "Biểu tượng:",
    "squadGoalPh": "Mục tiêu chung của đội...",
    "squadCreateBtn": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Tạo Tổ Đội Ngay",
    "squadJoinByCode": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Gia Nhập Bằng Mã Mời",
    "squadCodePh": "Nhập mã mời...",
    "squadJoinBtn": "Gia nhập",
    "shopOwned": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Đã sở hữu",
    "app_name": "Habit Mastery",
    "brand_title": "HABIT<br>MASTERY",
    "brand_subtitle": "Theo dõi thói quen • Xây dựng kỷ luật • Đạt mục tiêu",
    "feature_analytics": "Biểu đồ phân tích chi tiết",
    "feature_streak": "Streak & hệ thống thưởng",
    "feature_cloud": "Dữ liệu đồng bộ đám mây",
    "feature_multilang": "Đa ngôn ngữ (VI/EN/中)",
    "community_badge": "💬 CỘNG ĐỒNG ZALO",
    "community_headline": "Nhóm Kỷ Luật Habit Mastery",
    "community_subtext": "Quét mã QR để giao lưu, chia sẻ thói quen & nhận thông báo hỗ trợ từ Admin.",
    "community_mobile_title": "Nhóm Zalo Cộng Đồng Habit Mastery",
    "community_mobile_sub": "Giao lưu & nhận hỗ trợ từ Admin",
    "community_mobile_btn": "Xem QR",
    "tab_login": "Đăng nhập",
    "tab_register": "Đăng ký",
    "label_email": "Email",
    "placeholder_email": "your@email.com",
    "label_password": "Mật khẩu",
    "placeholder_password": "••••••••",
    "hint_ime": "⚠️ Tắt bộ gõ tiếng Việt (Telex/VNI) khi nhập mật khẩu",
    "remember_me": "Ghi nhớ đăng nhập",
    "remember_hint": "Duy trì phiên đăng nhập trên thiết bị này",
    "btn_login": "Đăng nhập",
    "btn_processing": "⏳ Đang xử lý...",
    "divider_or": "hoặc",
    "btn_google": "Đăng nhập với Google",
    "label_fullname": "Họ và tên",
    "placeholder_fullname": "Nguyễn Văn A",
    "placeholder_reg_pass": "Tối thiểu 6 ký tự",
    "label_confirm_password": "Xác nhận mật khẩu",
    "placeholder_confirm_password": "Nhập lại mật khẩu",
    "btn_register": "✨ Đăng ký tài khoản",
    "btn_registering": "⏳ Đang tạo tài khoản...",
    "otp_title_2fa": "Xác thực 2 bước",
    "otp_title_verify": "Xác minh email",
    "otp_desc_sent": "Mã xác minh 6 số đã gửi đến",
    "otp_expires_prefix": "Mã hết hạn sau",
    "otp_expired": "Hết hạn",
    "btn_verify_login": "✅ Xác minh & Đăng nhập",
    "btn_verify_reg": "✅ Xác minh & Tạo tài khoản",
    "btn_verifying": "⏳ Đang xác minh...",
    "otp_not_received": "Chưa nhận được mã?",
    "btn_resend_with_timer": "Gửi lại ({time}s)",
    "btn_resend_active": "🔄 Gửi lại mã",
    "btn_back": "← Quay lại",
    "desktop_title": "Đăng nhập Habit Mastery",
    "desktop_desc": "Bạn đang đăng nhập vào ứng dụng trên máy tính.",
    "btn_google_continue": "Tiếp tục với Google",
    "external_waiting_title": "Đang chờ đăng nhập",
    "external_waiting_desc": "Vui lòng hoàn tất đăng nhập trên trình duyệt hệ thống...",
    "external_check_browser": "Vui lòng kiểm tra trình duyệt web của bạn",
    "btn_cancel_external": "← Quay lại đăng nhập",
    "policy_privacy": "Quyền riêng tư",
    "policy_security": "Bảo mật",
    "policy_ip": "Sở hữu trí tuệ",
    "policy_disclaimer": "Miễn trừ trách nhiệm",
    "copyright_text": "© 2026 Habit Mastery. Nền tảng rèn luyện kỷ luật bản thân.",
    "modal_policy_title": "ĐIỀU KHOẢN & CHÍNH SÁCH DỊCH VỤ",
    "modal_policy_btn_close": "Đã Hiểu & Đóng",
    "modal_policy_last_updated": "Cập nhật lần cuối: 23/08/2026 • Habit Mastery Team",
    "policy_sec_privacy": "🔒 Chính Sách Quyền Riêng Tư (Privacy Policy)",
    "priv_sec1_title": "📌 1. Thu Thập Dữ Liệu Cá Nhân",
    "priv_sec1_desc": "Habit Mastery chỉ thu thập các thông tin cần thiết tối thiểu nhằm phục vụ trải nghiệm rèn luyện của bạn:",
    "priv_sec1_li1": "<strong>Thông tin tài khoản:</strong> Địa chỉ Email, Tên hiển thị (DisplayName), Ảnh đại diện (Avatar).",
    "priv_sec1_li2": "<strong>Dữ liệu thói quen:</strong> Danh sách thói quen cá nhân, lịch sử check-in hàng ngày, điểm rèn luyện (DP), cấp bậc cảnh giới.",
    "priv_sec1_li3": "<strong>Dữ liệu kỹ thuật:</strong> Thời điểm đăng nhập gần nhất để duy trì phiên làm việc và bảo toàn chuỗi kỷ luật.",
    "priv_sec2_title": "🎯 2. Mục Đích Sử Dụng Dữ Liệu",
    "priv_sec2_desc": "Dữ liệu của bạn được sử dụng độc quyền cho các mục đích:",
    "priv_sec2_li1": "Đồng bộ hóa thói quen tức thì qua đám mây giữa Web, Desktop và Mobile.",
    "priv_sec2_li2": "Tính toán chỉ số Streak, biểu đồ phân tích và bảng xếp hạng rèn luyện Top 50.",
    "priv_sec2_li3": "Gửi thông báo nhắc nhở và mã xác thực bảo mật 2 bước (OTP).",
    "priv_sec3_title": "🤝 3. Cam Kết Bảo Vệ & Không Chia Sẻ",
    "priv_sec3_desc": "Chúng tôi <strong>cam kết 100% không bán, không cho thuê và không chia sẻ</strong> bất kỳ dữ liệu cá nhân hay thói quen riêng tư nào của bạn cho bất kỳ bên thứ ba hay mạng quảng cáo nào.",
    "priv_sec4_title": "🗑️ 4. Quyền Kiểm Soát Của Người Dùng",
    "priv_sec4_desc": "Bạn luôn có toàn quyền xuất bản sao dữ liệu (Backup JSON) hoặc yêu cầu xóa vĩnh viễn toàn bộ tài khoản và thói quen khỏi hệ thống bất kỳ lúc nào.",
    "priv_quote": "✨ <em>\"Kỷ luật của bạn là tài sản quý giá nhất. Chúng tôi cam kết bảo vệ không gian rèn luyện của bạn an toàn và riêng tư tuyệt đối.\"</em>",
    "policy_sec_security": "🛡️ Chính Sách Bảo Mật Dữ Liệu (Security Policy)",
    "sec_sec1_title": "🔐 1. Mã Hóa Đường Truyền & Dữ Liệu",
    "sec_sec1_desc": "Toàn bộ thông tin trao đổi giữa trình duyệt của bạn và máy chủ đều được mã hóa bằng giao thức <strong>SSL/TLS 256-bit cao cấp nhất</strong>.",
    "sec_sec2_title": "🔑 2. Xác Thực 2 Lớp (Two-Factor OTP)",
    "sec_sec2_desc": "Hệ thống hỗ trợ xác minh mã OTP 6 số qua Email với thời hạn hiệu lực nghiêm ngặt 5 phút, ngăn chặn hoàn toàn nguy cơ bị chiếm quyền tài khoản.",
    "sec_sec3_title": "☁️ 3. Hạ Tầng Đám Mây Chuẩn Quốc Tế",
    "sec_sec3_desc": "Dữ liệu được lưu trữ trên nền tảng đám mây phân tán của Google Cloud / Firebase Firestore với sao lưu liên tục, tường lửa Firewall và phân quyền Security Rules nghiêm ngặt.",
    "sec_sec4_title": "🚫 4. Phòng Chống Tấn Công & Spam",
    "sec_sec4_desc": "Hệ thống tự động phát hiện và ngăn chặn các hành vi tấn công dò mật khẩu (Brute Force), giới hạn tần suất gửi yêu cầu và cô lập các phiên truy cập bất thường.",
    "sec_quote": "🛡️ <em>Hệ thống bảo mật hoạt động 24/7 để đảm bảo mọi bước tiến của bạn không bao giờ bị gián đoạn hay thất thoát.</em>",
    "policy_sec_ip": "💎 Quyền Sở Hữu Trí Tuệ (Intellectual Property)",
    "ip_sec1_title": "🏛️ 1. Bản Quyền Nền Tảng & Thiết Kế",
    "ip_sec1_desc": "Mọi nội dung, giao diện đồ họa, bộ icon rune thần thoại, hệ thống 21 cảnh giới tâm thức, biểu tượng Prism Nexus Coin, Sound Mixer âm thanh đa tầng và toàn bộ mã nguồn đều thuộc quyền sở hữu trí tuệ độc quyền của <strong>Habit Mastery</strong>.",
    "ip_sec2_title": "👤 2. Quyền Của Người Dùng",
    "ip_sec2_desc": "Người dùng được cấp quyền truy cập và sử dụng dịch vụ cho mục đích cá nhân phi thương mại. Bạn hoàn toàn sở hữu nội dung thói quen và ghi chú do chính mình tạo ra.",
    "ip_sec3_title": "⛔ 3. Các Hành Vi Bị Nghiêm Cấm",
    "ip_sec3_li1": "Sao chép, nhân bản giao diện hoặc dịch ngược mã nguồn (Reverse Engineering).",
    "ip_sec3_li2": "Sử dụng hình ảnh, âm thanh hoặc tài liệu của Habit Mastery cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.",
    "ip_sec3_li3": "Tạo ra các sản phẩm phái sinh hoặc ứng dụng giả mạo thương hiệu Habit Mastery.",
    "ip_quote": "⚖️ <em>Mọi hành vi xâm phạm quyền sở hữu trí tuệ sẽ được xử lý theo quy định của pháp luật hiện hành.</em>",
    "policy_sec_disclaimer": "📜 Tuyên Bố Miễn Trừ Trách Nhiệm (Disclaimer)",
    "disc_sec1_title": "🎯 1. Bản Chất Của Ứng Dụng",
    "disc_sec1_desc": "Habit Mastery là công cụ hỗ trợ theo dõi thói quen, xây dựng kỷ luật và truyền cảm hứng sống tích cực. Kết quả thực tế hoàn toàn phụ thuộc vào sự kiên trì, nỗ lực và hành động của chính người dùng.",
    "disc_sec2_title": "🩺 2. Không Thay Thế Lời Khuyên Chuyên Khoa",
    "disc_sec2_desc": "Các nội dung trích dẫn triết học Khắc Kỷ, kiến thức tâm lý hay thói quen thể chất trong ứng dụng chỉ mang tính chất tham khảo giáo dục và <strong>không thay thế cho lời khuyên y tế, chuẩn đoán tâm lý trị liệu, tư vấn tài chính hay pháp lý chuyên nghiệp</strong>.",
    "disc_sec3_title": "🌐 3. Kết Nối Mạng & Thiết Bị",
    "disc_sec3_desc": "Chúng tôi luôn nỗ lực tối đa để hệ thống hoạt động liên tục 99.9%, tuy nhiên không chịu trách nhiệm đối với các sự cố bất khả kháng xuất phát từ đường truyền internet của nhà mạng hoặc lỗi phần cứng thiết bị của người dùng.",
    "disc_quote": "🌱 <em>\"Chúng tôi trao cho bạn chiếc la bàn kỷ luật, người bước đi trên hành trình chinh phục chính là bạn.\"</em>",
    "qr_badge": "💬 NHÓM ZALO CHÍNH THỨC",
    "qr_title": "Cộng Đồng Habit Mastery",
    "qr_desc": "Mở ứng dụng Zalo trên điện thoại và quét mã QR bên dưới để tham gia nhóm ngay:",
    "qr_subnote": "Tham gia để kết nối cùng những người bạn đồng hành kỷ luật, chia sẻ mục tiêu & nhận quà tặng độc quyền từ Admin.",
    "qr_btn_done": "Hoàn Tất",
    "err_enter_email_pass": "Vui lòng nhập đầy đủ email và mật khẩu",
    "err_enter_name": "Vui lòng nhập họ và tên",
    "err_enter_email": "Vui lòng nhập email",
    "err_pass_min": "Mật khẩu phải có ít nhất 6 ký tự",
    "err_pass_match": "Mật khẩu xác nhận không khớp",
    "err_otp_expired": "Mã OTP đã hết hạn. Vui lòng gửi mã mới.",
    "err_cannot_open_browser": "Không thể mở trình duyệt hệ thống.",
    "err_login_failed_retry": "Đăng nhập không thành công. Vui lòng thử lại.",
    "err_generic": "Đã xảy ra lỗi. Vui lòng thử lại.",
    "msg_login_success": "✅ Đăng nhập thành công! Đang chuyển hướng...",
    "msg_register_success": "✅ Đăng ký thành công! Đang chuyển hướng...",
    "fb_user_not_found": "Email chưa được đăng ký",
    "fb_wrong_password": "Mật khẩu không đúng",
    "fb_invalid_credential": "Email hoặc mật khẩu không đúng",
    "fb_email_in_use": "Email đã được sử dụng",
    "fb_weak_password": "Mật khẩu phải có ít nhất 6 ký tự",
    "fb_invalid_email": "Địa chỉ email không hợp lệ",
    "fb_too_many_requests": "Quá nhiều lần thử, vui lòng đợi trong giây lát",
    "fb_popup_closed": "Đã đóng cửa sổ đăng nhập Google",
    "fb_network_failed": "Lỗi mạng, vui lòng kiểm tra kết nối internet",
    "lang_select_label": "🌐 Ngôn ngữ:"
},
        en: {
    "desktop_app_title": "Desktop App",
    "desktop_app_badge": "💻 DESKTOP APP",
    "desktop_app_headline": "Download for Desktop (Windows & Mac)",
    "desktop_app_desc": "Auto-starts with your computer, smooth performance & accurate reminders without browser tabs.",
    "btn_download_setup": "Download Installer (.zip)",
    "btn_download_guide": "Options & Mac Version",
    "desktop_quick_text": "Using PC or Mac? Download Habit Mastery for Desktop",
    "card_dl_title": "Download Desktop App",
    "card_dl_sub": "Windows & macOS • Fast & distraction-free",
    "card_dl_badge": "Download ⬇",
    "modal_download_title": "Download Habit Mastery for Desktop",
    "modal_download_subtitle": "Experience distraction-free habit tracking right on your Windows or Mac.",
    "tab_os_win": "🪟 Windows",
    "tab_os_mac": "🍎 macOS (MacBook / iMac)",
    "card_installer_title": "Official Installer (Setup .zip)",
    "card_installer_desc": "Creates Desktop & Start Menu shortcuts, with native Windows notifications.",
    "card_installer_btn": "⬇ Download HabitMastery-Setup.zip (86 MB)",
    "card_portable_title": "Portable Version (.zip)",
    "card_portable_desc": "No installation required. Download and run immediately, perfect for USB drives.",
    "card_portable_btn": "⬇ Download HabitMastery-Portable.zip (78 MB)",
    "card_mac_pwa_title": "Install to Dock (Recommended)",
    "card_mac_pwa_desc": "No large download needed. Safari: File ➔ Add to Dock. Chrome/Edge: click Install icon on the address bar.",
    "card_mac_pwa_btn": "⭐ How to Add to Dock (1-click)",
    "card_mac_dmg_title": "Packaged Installer (.dmg)",
    "card_mac_dmg_desc": "Standalone installer for Apple Silicon (M1/M2/M3/M4) & Intel x64 via GitHub Releases.",
    "card_mac_dmg_btn": "⬇ Download .DMG (GitHub Releases)",
    "guide_sec_title": "💡 3-Step Guide for First Launch on Windows",
    "guide_step1": "Download & open the .zip file, then run the installer. If SmartScreen appears: Click <strong>\"More info\"</strong> → Select <strong>\"Run anyway\"</strong>.",
    "guide_step2": "If the file is blocked: Right-click the file → <strong>Properties</strong> → Check <strong>Unblock</strong> at the bottom → OK.",
    "guide_step3": "Launch and sign in with your registered account to sync all your habits instantly!",
    "guide_txt_btn": "📄 Download Text Guide (.txt)",
    "mac_guide_title": "💡 3-Step Guide for First Launch on macOS:",
    "mac_guide_step1": "Open the .dmg file and drag Habit Mastery into your <strong>Applications</strong> folder.",
    "mac_guide_step2": "If an unidentified developer prompt appears: Hold <strong>Control</strong> and click the app ➔ Click <strong>Open</strong> ➔ Click <strong>Open</strong>.",
    "mac_guide_step3": "Or go to <strong>System Settings</strong> ➔ <strong>Privacy & Security</strong> ➔ scroll down and click <strong>Open Anyway</strong>.",
    "title": "HABIT MASTERY",
    "calSettings": "CALENDAR SETTINGS",
    "year": "Year",
    "month": "Month",
    "overallStats": "Overall Stats",
    "completed": "Completed",
    "left": "Left",
    "myHabits": "My Habits",
    "target": "Target",
    "actual": "Actual",
    "leftCol": "Left",
    "progress": "Progress",
    "top10": "TOP 10 HABITS",
    "mood": "Mood",
    "hoursOfSleep": "Hours of Sleep",
    "hrs": "hrs",
    "addHabit": "+ Add Habit",
    "addNewHabit": "Add New Habit",
    "editHabit": "Edit Habit",
    "habitNamePh": "Habit name...",
    "cancel": "Cancel",
    "save": "Save",
    "deleteConfirm": "Delete this habit?",
    "exportOk": "Exported!",
    "importOk": "Imported!",
    "importFail": "Invalid file!",
    "months": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    "days": [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
    ],
    "dailyNotes": "Daily Notes",
    "notesPh": "Write daily notes...",
    "heatmap": "Annual Activity Heatmap",
    "less": "Less",
    "more": "More",
    "targetLabelModal": "Habit Target",
    "targetHint": "days/month",
    "dayMon": "Mon",
    "dayWed": "Wed",
    "dayFri": "Fri",
    "tabHabits": "Habits",
    "tabStats": "Stats",
    "tabCommunity": "Community",
    "tabArena": "Arena",
    "tabMore": "Explore",
    "tabCharts": "Charts",
    "tabHeatmap": "Heatmap",
    "tabNotes": "Notes",
    "tabTop10": "Top 10",
    "tabLeaderboard": "Rank",
    "tabQuests": "Quests",
    "tabBackup": "Backup & Restore",
    "tabVip": "Upgrade VIP",
    "moreMenuTitle": "FEATURES & TOOLS",
    "moreQuestsDesc": "Daily, weekly quests & DP rewards",
    "morePomoDesc": "Pomodoro & Ambient Audio",
    "moreStreakDesc": "Freeze Flask & Repair",
    "moreShopDesc": "Titles, themes & sound FX",
    "moreSquadDesc": "Guilds & 1v1 Duels",
    "moreRecapDesc": "Year in Review card",
    "moreVipDesc": "Unlock all premium features",
    "moreBackupDesc": "Export & restore JSON backup",
    "moreProfileDesc": "Edit profile & logout",
    "freezeCol": "Freeze column",
    "unfreezeCol": "Unfreeze column",
    "collapseCol": "Collapse column",
    "expandCol": "Expand column",
    "lbTitle": "COMMUNITY LEADERBOARD",
    "weeklySprint": "Weekly Sprint",
    "topStreak": "Top Streak",
    "topPlayers": "Top 50",
    "communityTitle": "COMMUNITY FEED",
    "cmLatest": "Latest",
    "cmTips": "Tips",
    "cmMotivation": "Motivation",
    "rankTiers": "Rank Tiers",
    "editProfileTitle": "PROFILE",
    "displayNameLabel": "Display Name",
    "displayNamePh": "Enter name...",
    "avatarUploadLabel": "Avatar",
    "uploadFromDevice": "Upload",
    "randomAvatar": "Random",
    "avatarUrlPh": "Or paste URL",
    "selectFrameLabel": "Level Frames",
    "saveProfile": "Save",
    "yourName": "Your Name",
    "seasonBanner": "SEASON 1: DISCIPLINE RACE",
    "seasonTimer": "Auto-refresh weekly",
    "currentRank": "Current Rank",
    "rankAchieved": "Achieved",
    "rankLocked": "Not Yet",
    "usingFrame": "Equipped",
    "availableFrame": "Available",
    "lockedFrame": "Requires Lv",
    "rankProgressTo": "Need",
    "rankProgressUp": "DP to",
    "rankMaxed": "Max Rank",
    "questTitle": "TRAINING QUESTS",
    "questDaily": "Daily",
    "questWeekly": "Weekly",
    "questAchievement": "Achievements",
    "questSurprise": "Surprise",
    "questClaimed": "Claimed",
    "questClaim": "Claim",
    "questLocked": "Incomplete",
    "questProgress": "Progress",
    "questReward": "Reward",
    "questResetDaily": "Resets daily",
    "questResetWeekly": "Resets weekly",
    "questPermanent": "Permanent",
    "questCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Quest completed!",
    "questClaimedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> DP claimed!",
    "questReportDone": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Report done",
    "questPending": "Pending",
    "questApproved": "Approved",
    "tabStreakShield": "Streak Shield",
    "streakModalTitle": "STREAK SHIELD & RECOVERY",
    "streakFreeze": "Streak Freeze",
    "streakRepair": "24h Streak Repair",
    "streakStatus": "Streak Status",
    "streakActive": "Active",
    "streakBroken": "Broken Yesterday",
    "streakProtected": "Protected by Streak Freeze",
    "buyFreeze": "Buy Streak Freeze",
    "repairStreak": "Resurrect Streak",
    "freezeAutoToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> Streak Freeze automatically protected your streak yesterday!",
    "streakRepairToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> Your streak has been successfully resurrected!",
    "freezeBoughtToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> Successfully purchased 1 Streak Freeze!",
    "streakSafeDesc": "You have an active freeze bottle protecting your streak if you miss a day.",
    "streakDangerDesc": "No reserve freeze bottle! Buy one to prevent streak loss.",
    "streakBrokenDesc": "Your streak broke yesterday. You have 24h to recover it!",
    "freezeFlask1": "Flask 1 (Primary)",
    "freezeFlask2": "Flask 2 (Reserve)",
    "freezeReady": "Ready to activate",
    "freezeEmpty": "Empty (Buy in shop)",
    "buyFreezeDesc": "Auto-protects streak if you miss 1 day of check-in (Max 2 flasks).",
    "repairStreakDesc": "Repairs a broken streak from the past 24h, fully restoring your streak count.",
    "historyTitle": "PROTECTION HISTORY",
    "noHistory": "No recent protection records.",
    "daysUnit": "days",
    "maxStreakLabel": "Record",
    "currentStreakLabel": "Current Streak",
    "tabShop": "Shop",
    "shopModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-market\"></use></svg> DISCIPLINE SHOP",
    "shopTabTitles": "Titles",
    "shopTabThemes": "Themes",
    "shopTabFX": "FX & Sound",
    "shopTabItems": "Items",
    "shopTabDocs": "Library",
    "btnBuy": "Buy",
    "btnEquip": "Equip",
    "btnEquipped": "Equipped",
    "itemBoughtToast": "Purchased successfully!",
    "itemEquippedToast": "Equipped successfully!",
    "boostActivatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> 2X Boost activated for 24h!",
    "tabSquad": "Squads",
    "squadHubTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> SQUADS & 1V1 DUELS",
    "squadTabGuild": "Discipline Squads",
    "squadTabDuel": "1v1 Arena",
    "btnNudge": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Nudge",
    "nudgeSentToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Thunder poke sent to your teammate!",
    "squadCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Squad created successfully!",
    "squadJoinedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Joined squad successfully!",
    "squadLeftToast": "Left squad.",
    "duelCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> 7-Day Duel created!",
    "duelAcceptedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> 1v1 Duel has begun!",
    "duelWonToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-triumph\"></use></svg> Congratulations! You won the 1v1 duel!",
    "tabRecap": "Recap",
    "tabShareCard": "Share Card",
    "shareModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> SHAREABLE HABIT CARD",
    "recapTitle": "Weekly Habit Recap",
    "cardDownloadedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Card image downloaded!",
    "cardCopiedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> Card image copied to clipboard!",
    "tabPomodoro": "Focus",
    "pomoModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-focus\"></use></svg> FOCUS TIMER (DEEP WORK)",
    "pomoCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Deep work session completed! +15 Bonus",
    "pomoHabitCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 25m Focus done! Habit automatically checked-in (+15)",
    "quoteCopiedToast": "Quote copied to clipboard!",
    "pomoLinkHabit": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> LINK TO HABIT:",
    "pomoFreeDeepWork": "-- Free Focus (Deep Work) --",
    "pomoPomodoro": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cycle\"></use></svg> FOCUS · 25m",
    "pomoShortBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> REST · 5m",
    "pomoLongBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-crescent\"></use></svg> RECHARGE · 15m",
    "pomoCustom": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> CUSTOM",
    "pomoCustomNoDp": "⏱️ Free mode · No DP reward",
    "pomoCustomReady": "Custom countdown",
    "pomoStart": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Start",
    "pomoReset": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-reset\"></use></svg> Reset",
    "pomoPause": "⏸ Pause",
    "pomoContinue": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Resume",
    "pomoReady": "Ready",
    "pomoFocusing": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> Focusing...",
    "pomoResting": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> Resting...",
    "pomoPaused": "Paused",
    "pomoShortRest": "5 min break",
    "pomoLongRest": "15 min break",
    "pomoRewardHint": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> +15 reward on completion",
    "pomoAmbientLabel": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-audio\"></use></svg> AMBIENT SOUND:",
    "pomoSoundOff": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-mute\"></use></svg> Off",
    "pomoSoundRain": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-rain\"></use></svg> Rain",
    "pomoSoundOcean": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-tide\"></use></svg> Ocean",
    "pomoSoundNoise": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-static\"></use></svg> White Noise",
    "pomoSoundLofi": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-disc\"></use></svg> Lo-fi Chords",
    "cmPlaceholder": "Share your story, achievement, or training motivation...",
    "cmAttachImage": "Image",
    "cmAttachVideo": "Video",
    "cmSubmitPost": "Post",
    "cmFeedHeader": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> COMMUNITY POSTS",
    "cmRefresh": "Refresh",
    "streakShopTitle": "STREAK SHOP",
    "streakWallet": "Wallet",
    "streakBuyBtn": "Buy",
    "streakNoNeed": "Not needed",
    "streakAvailable": "AVAILABLE",
    "squadJoinTitle": "Join a Discipline Squad",
    "squadJoinDesc": "Research shows that having teammates to track and remind each other increases habit discipline rate up to <b>85%</b>! Create or join a squad now.",
    "squadCreateTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> Create New Squad (3-5 People)",
    "squadNamePh": "Squad name (e.g., Morning Warriors)...",
    "squadIconLabel": "Icon:",
    "squadGoalPh": "Team shared goal...",
    "squadCreateBtn": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> Create Squad Now",
    "squadJoinByCode": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Join by Invite Code",
    "squadCodePh": "Enter invite code...",
    "squadJoinBtn": "Join",
    "shopOwned": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> Owned",
    "shopTabBackpack": "Backpack",
    "btnUse": "Use Now",
    "btnOpenChest": "Open Chest",
    "noBackpackItems": "Your backpack is empty. Stock up in the Items tab!",
    "activeBuffsTitle": "ACTIVE BUFFS & BOOSTS",
    "app_name": "Habit Mastery",
    "brand_title": "HABIT<br>MASTERY",
    "brand_subtitle": "Track Habits • Build Discipline • Achieve Goals",
    "feature_analytics": "Detailed Performance Analytics",
    "feature_streak": "Streak & Reward System",
    "feature_cloud": "Real-time Cloud Sync",
    "feature_multilang": "Multi-language (VI/EN/中)",
    "community_badge": "💬 GLOBAL COMMUNITY",
    "community_headline": "Habit Mastery Discipline Club",
    "community_subtext": "Scan QR code or join the community to share habits & receive updates from Admin.",
    "community_mobile_title": "Habit Mastery Community Club",
    "community_mobile_sub": "Connect & receive support from Admin",
    "community_mobile_btn": "View QR",
    "tab_login": "Sign In",
    "tab_register": "Sign Up",
    "label_email": "Email",
    "placeholder_email": "your@email.com",
    "label_password": "Password",
    "placeholder_password": "••••••••",
    "hint_ime": "⚠️ Turn off local input method if password contains special symbols",
    "remember_me": "Remember me",
    "remember_hint": "Keep my session signed in on this device",
    "btn_login": "Sign In",
    "btn_processing": "⏳ Processing...",
    "divider_or": "or",
    "btn_google": "Sign in with Google",
    "label_fullname": "Full Name",
    "placeholder_fullname": "Alex Johnson",
    "placeholder_reg_pass": "Minimum 6 characters",
    "label_confirm_password": "Confirm Password",
    "placeholder_confirm_password": "Re-enter your password",
    "btn_register": "✨ Create Account",
    "btn_registering": "⏳ Creating account...",
    "otp_title_2fa": "Two-Factor Verification",
    "otp_title_verify": "Email Verification",
    "otp_desc_sent": "A 6-digit verification code has been sent to",
    "otp_expires_prefix": "Code expires in",
    "otp_expired": "Expired",
    "btn_verify_login": "✅ Verify & Sign In",
    "btn_verify_reg": "✅ Verify & Create Account",
    "btn_verifying": "⏳ Verifying...",
    "otp_not_received": "Didn't receive the code?",
    "btn_resend_with_timer": "Resend ({time}s)",
    "btn_resend_active": "🔄 Resend Code",
    "btn_back": "← Go Back",
    "desktop_title": "Sign in to Habit Mastery",
    "desktop_desc": "You are signing in to the desktop application.",
    "btn_google_continue": "Continue with Google",
    "external_waiting_title": "Waiting for Sign-In",
    "external_waiting_desc": "Please complete sign-in on your system browser...",
    "external_check_browser": "Please check your system web browser",
    "btn_cancel_external": "← Back to Sign In",
    "policy_privacy": "Privacy Policy",
    "policy_security": "Security",
    "policy_ip": "Intellectual Property",
    "policy_disclaimer": "Disclaimer",
    "copyright_text": "© 2026 Habit Mastery. Self-Discipline & Growth Platform.",
    "modal_policy_title": "TERMS & SERVICE POLICIES",
    "modal_policy_btn_close": "Understood & Close",
    "modal_policy_last_updated": "Last updated: August 23, 2026 • Habit Mastery Team",
    "policy_sec_privacy": "🔒 Privacy Policy",
    "priv_sec1_title": "📌 1. Personal Data Collection",
    "priv_sec1_desc": "Habit Mastery only collects the minimum essential information necessary to serve your training experience:",
    "priv_sec1_li1": "<strong>Account information:</strong> Email address, Display name, Avatar photo.",
    "priv_sec1_li2": "<strong>Habit data:</strong> Personal habit list, daily check-in history, discipline points (DP), rank progression.",
    "priv_sec1_li3": "<strong>Technical data:</strong> Timestamp of latest login to maintain sessions and secure streaks.",
    "priv_sec2_title": "🎯 2. Purpose of Data Usage",
    "priv_sec2_desc": "Your data is used exclusively for the following purposes:",
    "priv_sec2_li1": "Instant cloud synchronization between Web, Desktop, and Mobile.",
    "priv_sec2_li2": "Calculating streaks, analytics charts, and Top 50 leaderboards.",
    "priv_sec2_li3": "Sending reminders and two-factor authentication (OTP) codes.",
    "priv_sec3_title": "🤝 3. Commitment to Privacy & Protection",
    "priv_sec3_desc": "We <strong>commit 100% never to sell, rent, or share</strong> any of your personal data or private habits with any third parties or advertising networks.",
    "priv_sec4_title": "🗑️ 4. User Data Ownership & Control",
    "priv_sec4_desc": "You always have the full right to export a data backup (JSON) or permanently delete your entire account and habits at any time.",
    "priv_quote": "✨ <em>\"Your discipline is your most valuable asset. We are committed to protecting your growth space with absolute privacy.\"</em>",
    "policy_sec_security": "🛡️ Data Security Policy",
    "sec_sec1_title": "🔐 1. In-Transit & Data Encryption",
    "sec_sec1_desc": "All communication between your client and our servers is secured using <strong>enterprise-grade 256-bit SSL/TLS encryption</strong>.",
    "sec_sec2_title": "🔑 2. Two-Factor Authentication (OTP)",
    "sec_sec2_desc": "Email-based 6-digit OTP verification with a strict 5-minute expiration safeguards your account from unauthorized access.",
    "sec_sec3_title": "☁️ 3. International Cloud Infrastructure",
    "sec_sec3_desc": "Data is hosted on Google Cloud / Firebase Firestore distributed infrastructure with continuous backup, firewalls, and strict security rules.",
    "sec_sec4_title": "🚫 4. Attack & Spam Prevention",
    "sec_sec4_desc": "Automated rate limiting, brute-force mitigation, and anomaly detection monitor and isolate suspicious access attempts 24/7.",
    "sec_quote": "🛡️ <em>Our security systems run continuously to ensure your progress is never interrupted or compromised.</em>",
    "policy_sec_ip": "💎 Intellectual Property Rights",
    "ip_sec1_title": "🏛️ 1. Platform Copyright & Brand",
    "ip_sec1_desc": "All brand visual designs, mythical runes icon set, 21 Realms system, Prism Nexus Coin insignia, multi-layer Sound Mixer, and source code are the exclusive intellectual property of <strong>Habit Mastery</strong>.",
    "ip_sec2_title": "👤 2. User Rights",
    "ip_sec2_desc": "Users are granted non-exclusive personal access. You retain 100% full ownership of your personal habit names, notes, and records.",
    "ip_sec3_title": "⛔ 3. Prohibited Activities",
    "ip_sec3_li1": "Copying, cloning the UI, or reverse-engineering source code.",
    "ip_sec3_li2": "Commercial exploitation of visual assets or proprietary materials without written permission.",
    "ip_sec3_li3": "Distributing derivative software mimicking the Habit Mastery brand.",
    "ip_quote": "⚖️ <em>Any intellectual property infringements will be subject to applicable legal enforcement.</em>",
    "policy_sec_disclaimer": "📜 Disclaimer",
    "disc_sec1_title": "🎯 1. Purpose of the Platform",
    "disc_sec1_desc": "Habit Mastery is a tool designed to inspire self-discipline, routine tracking, and positive lifestyle habits. Individual results depend entirely on personal consistency and real-life action.",
    "disc_sec2_title": "🩺 2. Not Professional Medical Advice",
    "disc_sec2_desc": "Philosophical reflections, mindfulness exercises, or physical habits shared within the app are for educational purposes and <strong>do not substitute for medical, psychological, financial, or legal advice</strong>.",
    "disc_sec3_title": "🌐 3. Network & Device Availability",
    "disc_sec3_desc": "While we strive for 99.9% service uptime, we are not liable for disruptions resulting from external carrier network issues or local device hardware limitations.",
    "disc_quote": "🌱 <em>\"We provide the compass of discipline; you are the one who walks the path to mastery.\"</em>",
    "qr_badge": "💬 OFFICIAL COMMUNITY",
    "qr_title": "Habit Mastery Community",
    "qr_desc": "Scan the QR code with your camera or supported messaging app to join our community:",
    "qr_subnote": "Join to connect with disciplined peers, share milestones, and receive exclusive resources from our team.",
    "qr_btn_done": "Done",
    "err_enter_email_pass": "Please enter both email and password",
    "err_enter_name": "Please enter your full name",
    "err_enter_email": "Please enter your email",
    "err_pass_min": "Password must be at least 6 characters",
    "err_pass_match": "Passwords do not match",
    "err_otp_expired": "OTP has expired. Please request a new code.",
    "err_cannot_open_browser": "Could not open system browser.",
    "err_login_failed_retry": "Sign in failed. Please try again.",
    "err_generic": "An error occurred. Please try again.",
    "msg_login_success": "✅ Sign in successful! Redirecting...",
    "msg_register_success": "✅ Account created successfully! Redirecting...",
    "fb_user_not_found": "Email is not registered",
    "fb_wrong_password": "Incorrect password",
    "fb_invalid_credential": "Invalid email or password",
    "fb_email_in_use": "This email is already registered",
    "fb_weak_password": "Password should be at least 6 characters",
    "fb_invalid_email": "Invalid email address format",
    "fb_too_many_requests": "Too many attempts, please wait a moment",
    "fb_popup_closed": "Google sign-in popup was closed",
    "fb_network_failed": "Network connection error, please check your internet",
    "lang_select_label": "🌐 Language:"
},
        zh: {
    "desktop_app_title": "电脑客户端",
    "desktop_app_badge": "💻 桌面客户端",
    "desktop_app_headline": "下载 Habit Mastery 电脑版 (Windows & Mac)",
    "desktop_app_desc": "随开机自启、极致流畅、精准桌面提醒，免去繁琐浏览器标签。",
    "btn_download_setup": "下载安装包 (.zip)",
    "btn_download_guide": "选项与 Mac 版",
    "desktop_quick_text": "在电脑上使用？下载 Windows 与 macOS 桌面版",
    "card_dl_title": "下载电脑桌面端",
    "card_dl_sub": "Windows 与 macOS • 独立流畅，专注自律",
    "card_dl_badge": "立即下载 ⬇",
    "modal_download_title": "下载 Habit Mastery 电脑桌面版",
    "modal_download_subtitle": "在 Windows 或 Mac 端体验独立、流畅、无干扰的自律习惯养成之旅。",
    "tab_os_win": "🪟 Windows",
    "tab_os_mac": "🍎 macOS (MacBook / iMac)",
    "card_installer_title": "标准安装包 (Setup .zip)",
    "card_installer_desc": "自动创建桌面与开始菜单快捷方式，原生支持 Windows 系统通知。",
    "card_installer_btn": "⬇ 下载 HabitMastery-Setup.zip (86 MB)",
    "card_portable_title": "便携免安装版 (Portable .zip)",
    "card_portable_desc": "无需安装，双击即可即时运行。适合随身 U 盘使用。",
    "card_portable_btn": "⬇ 下载 HabitMastery-Portable.zip (78 MB)",
    "card_mac_pwa_title": "快捷安装至 Dock (推荐)",
    "card_mac_pwa_desc": "无需下载安装包。Safari：文件菜单 ➔ 添加到程序坞。Chrome/Edge：地址栏点击安装图标。",
    "card_mac_pwa_btn": "⭐ 如何添加到 Dock (一键搞定)",
    "card_mac_dmg_title": "独立安装镜像 (.dmg)",
    "card_mac_dmg_desc": "支持 Apple Silicon (M1/M2/M3/M4) 与 Intel x64 芯片，通过 GitHub Releases 分发。",
    "card_mac_dmg_btn": "⬇ 前往下载 .DMG (GitHub Releases)",
    "guide_sec_title": "💡 首次在 Windows 上打开的 3 步指南",
    "guide_step1": "下载并解压 .zip 压缩包后运行程序。若出现 SmartScreen 提示：点击 <strong>\"更多信息 (More info)\"</strong> → 点击 <strong>\"仍要运行 (Run anyway)\"</strong>。",
    "guide_step2": "若文件被锁定：右键点击安装包 → 选择 <strong>属性 (Properties)</strong> → 勾选底部的 <strong>解除锁定 (Unblock)</strong> → 确定。",
    "guide_step3": "打开应用并使用注册的邮箱登录，即可瞬间同步您的所有打卡习惯与进度！",
    "guide_txt_btn": "📄 下载文本安装指南 (.txt)",
    "mac_guide_title": "💡 首次在 macOS 上打开 .dmg 的 3 步指南:",
    "mac_guide_step1": "打开 .dmg 文件并将 Habit Mastery 图标拖入 <strong>Applications (应用程序)</strong> 文件夹。",
    "mac_guide_step2": "若提示无法打开因为来自未验证的开发者：按住 <strong>Control</strong> 键点击 App ➔ 选择 <strong>打开 (Open)</strong> ➔ 确认 <strong>打开</strong>。",
    "mac_guide_step3": "或前往 <strong>系统设置 (System Settings)</strong> ➔ <strong>隐私与安全性</strong> ➔ 滚动到底部选择 <strong>仍要打开 (Open Anyway)</strong>。",
    "title": "习惯追踪器",
    "calSettings": "日历设置",
    "year": "年",
    "month": "月",
    "overallStats": "总体统计",
    "completed": "已完成",
    "left": "剩余",
    "myHabits": "我的习惯",
    "target": "目标",
    "actual": "实际",
    "leftCol": "剩余",
    "progress": "进度",
    "top10": "TOP 10 习惯",
    "mood": "心情",
    "hoursOfSleep": "睡眠时长",
    "hrs": "小时",
    "addHabit": "+ 添加习惯",
    "addNewHabit": "添加新习惯",
    "editHabit": "编辑习惯",
    "habitNamePh": "习惯名称...",
    "cancel": "取消",
    "save": "保存",
    "deleteConfirm": "确认删除？",
    "exportOk": "导出成功！",
    "importOk": "导入成功！",
    "importFail": "文件无效！",
    "months": [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
    ],
    "days": [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
    ],
    "dailyNotes": "每日随笔",
    "notesPh": "写点什么...",
    "heatmap": "年度活动热力图",
    "less": "少",
    "more": "多",
    "targetLabelModal": "习惯目标",
    "targetHint": "天/月",
    "dayMon": "一",
    "dayWed": "三",
    "dayFri": "五",
    "tabHabits": "习惯",
    "tabStats": "统计",
    "tabCommunity": "社区",
    "tabArena": "竞技场",
    "tabMore": "探索",
    "tabCharts": "图表",
    "tabHeatmap": "热力图",
    "tabNotes": "笔记",
    "tabTop10": "前十",
    "tabLeaderboard": "排行榜",
    "tabQuests": "任务",
    "tabBackup": "数据备份",
    "tabVip": "升级VIP",
    "moreMenuTitle": "功能与实用工具",
    "moreQuestsDesc": "每日、每周任务与DP奖励",
    "morePomoDesc": "番茄钟与白噪音",
    "moreStreakDesc": "连胜冻结与恢复",
    "moreShopDesc": "称号、主题与音效",
    "moreSquadDesc": "战队公会与1v1挑战",
    "moreRecapDesc": "年度成就总结",
    "moreVipDesc": "解锁所有高级专属功能",
    "moreBackupDesc": "导出与恢复JSON文件",
    "moreProfileDesc": "修改资料与登出",
    "freezeCol": "冻结列",
    "unfreezeCol": "解冻列",
    "collapseCol": "折叠列",
    "expandCol": "展开列",
    "lbTitle": "社区排行榜",
    "weeklySprint": "本周冲刺",
    "topStreak": "最长连胜",
    "topPlayers": "前50名",
    "communityTitle": "习惯社区",
    "cmLatest": "最新",
    "cmTips": "经验",
    "cmMotivation": "动力",
    "rankTiers": "等级",
    "editProfileTitle": "个人资料",
    "displayNameLabel": "显示名称",
    "displayNamePh": "输入名称...",
    "avatarUploadLabel": "头像",
    "uploadFromDevice": "上传",
    "randomAvatar": "随机",
    "avatarUrlPh": "或粘贴URL",
    "selectFrameLabel": "等级头像框",
    "saveProfile": "保存",
    "yourName": "你的名字",
    "seasonBanner": "赛季1: 纪律竞赛",
    "seasonTimer": "每周刷新",
    "currentRank": "当前等级",
    "rankAchieved": "已达成",
    "rankLocked": "未达成",
    "usingFrame": "使用中",
    "availableFrame": "可用",
    "lockedFrame": "需要等级",
    "rankProgressTo": "还需",
    "rankProgressUp": "DP升级",
    "rankMaxed": "已达最高等级",
    "questTitle": "训练任务",
    "questDaily": "每日",
    "questWeekly": "每周",
    "questAchievement": "成就",
    "questSurprise": "突发",
    "questClaimed": "已领取",
    "questClaim": "领取",
    "questLocked": "未完成",
    "questProgress": "进度",
    "questReward": "奖励",
    "questResetDaily": "每日重置",
    "questResetWeekly": "每周重置",
    "questPermanent": "永久",
    "questCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 任务完成！",
    "questClaimedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 已领取DP！",
    "questReportDone": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> 报告完成",
    "questPending": "待审核",
    "questApproved": "已审核",
    "tabStreakShield": "连胜保护",
    "streakModalTitle": "连胜保护与恢复",
    "streakFreeze": "连胜冻结瓶",
    "streakRepair": "24小时补签",
    "streakStatus": "连胜状态",
    "streakActive": "进行中",
    "streakBroken": "昨日中断",
    "streakProtected": "受冻结保护",
    "buyFreeze": "购买冻结瓶",
    "repairStreak": "恢复连胜",
    "freezeAutoToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> 冻结瓶已自动保护你昨天的连胜！",
    "streakRepairToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> 你的连胜已成功复活！",
    "freezeBoughtToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-vault\"></use></svg> 已成功购买1个冻结瓶！",
    "streakSafeDesc": "你拥有冻结瓶，若遗漏签到将自动受到保护。",
    "streakDangerDesc": "你暂无备用冻结瓶，建议购买以防连胜中断。",
    "streakBrokenDesc": "你的连胜昨天已中断，24小时内可补救！",
    "freezeFlask1": "瓶1（主）",
    "freezeFlask2": "瓶2（备用）",
    "freezeReady": "就绪",
    "freezeEmpty": "空（可购买）",
    "buyFreezeDesc": "遗漏签到时自动保护连胜（最多储存2瓶）。",
    "repairStreakDesc": "修复过去24小时内中断的连胜，完美复活天数。",
    "historyTitle": "连胜保护历史",
    "noHistory": "近期暂无保护记录。",
    "daysUnit": "天",
    "maxStreakLabel": "最高记录",
    "currentStreakLabel": "当前连胜",
    "tabShop": "商店",
    "shopModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-market\"></use></svg> 自律商店",
    "shopTabTitles": "头衔",
    "shopTabThemes": "主题",
    "shopTabFX": "特效",
    "shopTabItems": "道具",
    "shopTabBackpack": "背包",
    "shopTabDocs": "文档/书阁",
    "btnBuy": "购买",
    "btnEquip": "装备",
    "btnEquipped": "已装备",
    "btnUse": "立即使用",
    "btnOpenChest": "开启宝箱",
    "noBackpackItems": "你的背包空空如也，快去道具商店挑选吧！",
    "activeBuffsTitle": "当前激活的增益效果",
    "itemBoughtToast": "购买成功！",
    "itemEquippedToast": "装备成功！",
    "boostActivatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> 2X 加速卡已激活（24小时）！",
    "tabSquad": "战队",
    "squadHubTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> 战队与1V1对决",
    "squadTabGuild": "自律战队",
    "squadTabDuel": "1V1对决场",
    "btnNudge": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 催促",
    "nudgeSentToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 已向队友发送闪电提醒！",
    "squadCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> 战队创建成功！",
    "squadJoinedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> 成功加入战队！",
    "squadLeftToast": "已退出战队。",
    "duelCreatedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> 已创建7天对决房间！",
    "duelAcceptedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-duel\"></use></svg> 1V1对决正式开启！",
    "duelWonToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-triumph\"></use></svg> 恭喜！你赢得了1V1对决！",
    "tabRecap": "周报",
    "tabShareCard": "分享卡片",
    "shareModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> 导出自律成就卡",
    "recapTitle": "每周自律总结",
    "cardDownloadedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> 成就卡已保存！",
    "cardCopiedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-archive\"></use></svg> 成就卡已复制到剪贴板！",
    "tabPomodoro": "专注",
    "pomoModalTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-focus\"></use></svg> 专注时钟 (DEEP WORK)",
    "pomoCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 专注完成！获得 +15 奖励",
    "pomoHabitCompletedToast": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 25分钟专注完成！习惯已自动打卡 (+15)",
    "quoteCopiedToast": "格言已复制到剪贴板！",
    "pomoLinkHabit": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> 关联习惯:",
    "pomoFreeDeepWork": "-- 自由专注 (Deep Work) --",
    "pomoPomodoro": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cycle\"></use></svg> FOCUS · 25m",
    "pomoShortBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> REST · 5m",
    "pomoLongBreak": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-crescent\"></use></svg> RECHARGE · 15m",
    "pomoCustom": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-target\"></use></svg> 自定义",
    "pomoCustomNoDp": "⏱️ 自由模式 · 不计DP积分",
    "pomoCustomReady": "自定义倒计时",
    "pomoStart": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> 开始",
    "pomoReset": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-reset\"></use></svg> 重置",
    "pomoPause": "⏸ 暂停",
    "pomoContinue": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> 继续",
    "pomoReady": "准备就绪",
    "pomoFocusing": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-streak\"></use></svg> 专注中...",
    "pomoResting": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-cup\"></use></svg> 休息中...",
    "pomoPaused": "已暂停",
    "pomoShortRest": "休息5分钟",
    "pomoLongRest": "休息15分钟",
    "pomoRewardHint": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-coin\"></use></svg> 完成可获得 +15 奖励",
    "pomoAmbientLabel": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-audio\"></use></svg> 专注背景音:",
    "pomoSoundOff": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-mute\"></use></svg> 关闭",
    "pomoSoundRain": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-rain\"></use></svg> 雨声",
    "pomoSoundOcean": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-tide\"></use></svg> 海浪",
    "pomoSoundNoise": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-static\"></use></svg> 白噪声",
    "pomoSoundLofi": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-disc\"></use></svg> Lo-fi和弦",
    "cmPlaceholder": "分享你的故事、成就或训练心得...",
    "cmAttachImage": "图片",
    "cmAttachVideo": "视频",
    "cmSubmitPost": "发布",
    "cmFeedHeader": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 社区动态",
    "cmRefresh": "刷新",
    "streakShopTitle": "连胜商店",
    "streakWallet": "余额",
    "streakBuyBtn": "购买",
    "streakNoNeed": "无需修复",
    "streakAvailable": "可用",
    "squadJoinTitle": "加入自律战队",
    "squadJoinDesc": "研究表明，有队友共同监督和提醒时，习惯坚持率提高至<b>85%</b>！立即创建或加入战队。",
    "squadCreateTitle": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-spark\"></use></svg> 创建新战队 (3-5人)",
    "squadNamePh": "战队名称...",
    "squadIconLabel": "图标:",
    "squadGoalPh": "团队共同目标...",
    "squadCreateBtn": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-ignite\"></use></svg> 立即创建战队",
    "squadJoinByCode": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> 通过邀请码加入",
    "squadCodePh": "输入邀请码...",
    "squadJoinBtn": "加入",
    "shopOwned": "<svg class=\"rune-inline\" viewBox=\"0 0 48 48\"><use href=\"#i-aegis\"></use></svg> 已拥有",
    "app_name": "Habit Mastery",
    "brand_title": "HABIT<br>MASTERY",
    "brand_subtitle": "追踪习惯 • 建立自律 • 达成目标",
    "feature_analytics": "深度习惯分析图表",
    "feature_streak": "连续打卡与等级奖励",
    "feature_cloud": "多端云端实时同步",
    "feature_multilang": "多语言支持 (VI/EN/中)",
    "community_badge": "💬 官方自律社群",
    "community_headline": "Habit Mastery 自律成长营",
    "community_subtext": "扫描二维码加入社群，交流打卡心得并获取官方技术支持。",
    "community_mobile_title": "Habit Mastery 官方自律社群",
    "community_mobile_sub": "连接自律同伴 & 获取官方支持",
    "community_mobile_btn": "查看二维码",
    "tab_login": "登录",
    "tab_register": "注册",
    "label_email": "电子邮箱",
    "placeholder_email": "your@email.com",
    "label_password": "密码",
    "placeholder_password": "••••••••",
    "hint_ime": "⚠️ 输入密码时建议切换为英文输入法",
    "remember_me": "记住登录状态",
    "remember_hint": "在此设备上保持登录会话",
    "btn_login": "立即登录",
    "btn_processing": "⏳ 正在处理...",
    "divider_or": "或",
    "btn_google": "使用 Google 账号登录",
    "label_fullname": "您的姓名",
    "placeholder_fullname": "张小明",
    "placeholder_reg_pass": "至少6位字符",
    "label_confirm_password": "确认密码",
    "placeholder_confirm_password": "请再次输入密码",
    "btn_register": "✨ 注册新账号",
    "btn_registering": "⏳ 正在创建账号...",
    "otp_title_2fa": "双重安全验证",
    "otp_title_verify": "电子邮箱验证",
    "otp_desc_sent": "6位数验证码已发送至",
    "otp_expires_prefix": "验证码过期倒计时",
    "otp_expired": "已过期",
    "btn_verify_login": "✅ 验证并登录",
    "btn_verify_reg": "✅ 验证并创建账号",
    "btn_verifying": "⏳ 正在验证...",
    "otp_not_received": "未收到验证码？",
    "btn_resend_with_timer": "重新发送 ({time}s)",
    "btn_resend_active": "🔄 重新发送验证码",
    "btn_back": "← 返回",
    "desktop_title": "登录 Habit Mastery",
    "desktop_desc": "您正在登录桌面客户端应用。",
    "btn_google_continue": "继续使用 Google 登录",
    "external_waiting_title": "等待登录完成",
    "external_waiting_desc": "请在系统默认浏览器中完成 Google 身份验证...",
    "external_check_browser": "请检查您的网页浏览器窗口",
    "btn_cancel_external": "← 返回登录页",
    "policy_privacy": "隐私政策",
    "policy_security": "数据安全",
    "policy_ip": "知识产权",
    "policy_disclaimer": "免责声明",
    "copyright_text": "© 2026 Habit Mastery. 个人自律与习惯养成平台。",
    "modal_policy_title": "服务条款与隐私政策",
    "modal_policy_btn_close": "已阅读并关闭",
    "modal_policy_last_updated": "最后更新：2026年8月23日 • Habit Mastery 团队",
    "policy_sec_privacy": "🔒 隐私保护政策 (Privacy Policy)",
    "priv_sec1_title": "📌 1. 个人数据收集",
    "priv_sec1_desc": "Habit Mastery 仅收集为您提供自律成长体验所需的最基本信息：",
    "priv_sec1_li1": "<strong>账号信息：</strong> 电子邮箱地址、显示名称、个人头像。",
    "priv_sec1_li2": "<strong>习惯数据：</strong> 自定义习惯列表、每日打卡历史记录、自律点数 (DP)、心智境界等级。",
    "priv_sec1_li3": "<strong>技术参数：</strong> 最近登录时间，用于维持登录会话并保护连续打卡链条。",
    "priv_sec2_title": "🎯 2. 数据使用目的",
    "priv_sec2_desc": "您的数据仅用于以下专属场景：",
    "priv_sec2_li1": "在网页端、桌面端与移动端之间实现即时云端同步。",
    "priv_sec2_li2": "计算连续打卡（Streak）、趋势分析图表与前50名自律排行榜。",
    "priv_sec2_li3": "发送习惯打卡提醒与两步安全验证码 (OTP)。",
    "priv_sec3_title": "🤝 3. 严格隐私承诺",
    "priv_sec3_desc": "我们<strong>100%承诺绝不出售、出租或泄露</strong>您的任何个人资料或隐私打卡记录给任何第三方或广告商。",
    "priv_sec4_title": "🗑️ 4. 用户的完全控制权",
    "priv_sec4_desc": "您拥有随时导出完整数据副本（JSON 备份）或永久注销账号及删除所有习惯记录的完整权利。",
    "priv_quote": "✨ <em>\"您的自律是您最宝贵的财富。我们竭尽全力守护您安全、纯粹的成长空间。\"</em>",
    "policy_sec_security": "🛡️ 数据安全规范 (Security Policy)",
    "sec_sec1_title": "🔐 1. 全程高强度数据加密",
    "sec_sec1_desc": "客户端与云端服务器之间的所有数据传输均经过<strong>企业级 256位 SSL/TLS 协议</strong>严密加密。",
    "sec_sec2_title": "🔑 2. 两步动态验证 (Two-Factor OTP)",
    "sec_sec2_desc": "支持基于邮箱的6位动态验证码，严格限制5分钟有效期，全方位抵御账号被盗风险。",
    "sec_sec3_title": "☁️ 3. 国际高标准云基础架构",
    "sec_sec3_desc": "数据托管于 Google Cloud / Firebase Firestore 分布式云存储体系，配备多重实时备份与安全访问控制规则。",
    "sec_sec4_title": "🚫 4. 暴力破解与异常拦截",
    "sec_sec4_desc": "内置高频请求限流机制与防暴力破解算法，实时监测并阻断任何异常越权访问。",
    "sec_quote": "🛡️ <em>安全防护体系全天候运行，确保您的每一次努力记录永不丢失。</em>",
    "policy_sec_ip": "💎 知识产权归属 (Intellectual Property)",
    "ip_sec1_title": "🏛️ 1. 平台原创性与版权",
    "ip_sec1_desc": "平台UI界面设计、符文图标体系、21重心智境界架构、Prism Nexus Coin徽标、多轨环境音混音器及全部软件源码均归 <strong>Habit Mastery</strong> 独家所有。",
    "ip_sec2_title": "👤 2. 用户数据所有权",
    "ip_sec2_desc": "用户被授予非商业性个人使用许可。您对自己创建的习惯名称、每日笔记与心得享有100%知识产权。",
    "ip_sec3_title": "⛔ 3. 严禁侵权行为",
    "ip_sec3_li1": "严禁逆向工程、反编译或仿冒复制本平台界面。",
    "ip_sec3_li2": "未经正式书面许可，严禁将本平台视觉资产或专有素材用于商业用途。",
    "ip_sec3_li3": "严禁发布侵犯或假冒 Habit Mastery 商标的衍生产品。",
    "ip_quote": "⚖️ <em>任何侵犯平台知识产权的行为将依法追究法律责任。</em>",
    "policy_sec_disclaimer": "📜 免责声明 (Disclaimer)",
    "disc_sec1_title": "🎯 1. 工具辅助性质",
    "disc_sec1_desc": "Habit Mastery 是一款旨在辅助培养自律、记录习惯的数字工具。最终成效完全取决于用户本人的持续实践与行动力。",
    "disc_sec2_title": "🩺 2. 非专业医疗/心理咨询建议",
    "disc_sec2_desc": "应用内引用的斯多葛哲学名言、心理学知识或健康生活习惯仅供自我精进参考，<strong>绝不构成任何专业医疗诊断、心理治疗、财务或法律咨询建议</strong>。",
    "disc_sec3_title": "🌐 3. 网络与硬件环境",
    "disc_sec3_desc": "团队保障 99.9% 云端可用性，但不因第三方电信网络波动或用户个人硬件故障造成的短暂停顿承担不可抗力责任。",
    "disc_quote": "🌱 <em>\"我们为您奉上自律的罗盘，走向卓越的步伐始终在您的脚下。\"</em>",
    "qr_badge": "💬 官方交流社群",
    "qr_title": "Habit Mastery 自律社区",
    "qr_desc": "请使用手机扫一扫下方二维码，即刻加入我们的自律成长圈：",
    "qr_subnote": "加入社群与全国同频自律者共同打卡，分享成长突破并领取专属自律礼包。",
    "qr_btn_done": "完成",
    "err_enter_email_pass": "请输入完整的电子邮箱和登录密码",
    "err_enter_name": "请输入您的真实姓名或昵称",
    "err_enter_email": "请输入电子邮箱",
    "err_pass_min": "密码长度至少需要6位字符",
    "err_pass_match": "两次输入的密码不一致",
    "err_otp_expired": "验证码已失效，请重新获取",
    "err_cannot_open_browser": "无法调起系统浏览器",
    "err_login_failed_retry": "登录未完成，请重试",
    "err_generic": "发生错误，请稍后重试",
    "msg_login_success": "✅ 登录成功！正在跳转...",
    "msg_register_success": "✅ 账号注册成功！正在跳转...",
    "fb_user_not_found": "该邮箱尚未注册账号",
    "fb_wrong_password": "密码错误，请核对后重试",
    "fb_invalid_credential": "邮箱或密码错误",
    "fb_email_in_use": "该邮箱已被其他账号使用",
    "fb_weak_password": "密码安全性较低，至少需6个字符",
    "fb_invalid_email": "邮箱格式不正确",
    "fb_too_many_requests": "操作过于频繁，请稍后再试",
    "fb_popup_closed": "已关闭 Google 登录授权窗口",
    "fb_network_failed": "网络连接失败，请检查网络设置",
    "lang_select_label": "🌐 语言 / Language:"
}
    };

    // Language metadata for selector
    const LANG_OPTIONS = [
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'zh', name: '简体中文', flag: '🇨🇳' }
    ];

    let currentLang = DEFAULT_LANG;

    /**
     * Tự động nhận diện ngôn ngữ
     */
    function detectLanguage() {
        // 0. Hỗ trợ test nhanh trực tiếp qua URL: ?lang=en | ?lang=zh | ?country=US | ?country=CN
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const queryLang = urlParams.get('lang');
            if (queryLang && SUPPORTED_LANGS.includes(queryLang.toLowerCase())) {
                return queryLang.toLowerCase();
            }
            const queryCountry = urlParams.get('country');
            if (queryCountry) {
                const c = queryCountry.toUpperCase();
                if (c === 'VN') return 'vi';
                if (c === 'CN') return 'zh';
                return 'en';
            }
        } catch (e) {}

        // 1. Kiểm tra đã lưu lựa chọn thủ công của user
        try {
            const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
            if (saved && SUPPORTED_LANGS.includes(saved)) {
                return saved;
            }
        } catch (e) {}

        // 2. Kiểm tra ngôn ngữ thiết bị/trình duyệt
        try {
            const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
            for (let lang of navLangs) {
                if (!lang) continue;
                const clean = lang.toLowerCase();
                if (clean.startsWith('vi')) return 'vi';
                if (clean.startsWith('zh')) return 'zh';
            }
        } catch (e) {}

        // 3. Mặc định là Tiếng Anh cho toàn bộ người dùng quốc tế
        return DEFAULT_LANG;
    }

    /**
     * Đăng ký bổ sung khóa dịch từ các module khác
     */
    function registerTranslations(lang, dict) {
        if (!translations[lang]) translations[lang] = {};
        Object.assign(translations[lang], dict);
        if (lang === currentLang) {
            translateDOM();
        }
    }

    /**
     * Lấy chuỗi dịch theo key
     */
    function t(key, fallback = '') {
        const dict = translations[currentLang] || translations[DEFAULT_LANG];
        if (dict && dict[key] !== undefined) {
            return dict[key];
        }
        // Fallback to Vietnamese or English if key is missing
        if (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key] !== undefined) {
            return translations[DEFAULT_LANG][key];
        }
        if (translations.vi && translations.vi[key] !== undefined) {
            return translations.vi[key];
        }
        return fallback || key;
    }

    /**
     * Dịch toàn bộ cây DOM theo các data attributes
     */
    function translateDOM() {
        // Cập nhật thuộc tính lang của <html>
        if (document.documentElement) {
            document.documentElement.setAttribute('lang', currentLang);
        }

        // 1. Dịch text content / html
        const textElements = document.querySelectorAll('[data-i18n]');
        textElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (translation !== key && translation !== '') {
                el.innerHTML = translation;
            }
        });

        // 2. Dịch placeholder
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder], [data-i18n-ph]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder') || el.getAttribute('data-i18n-ph');
            const translation = t(key);
            if (translation !== key && translation !== '') {
                el.placeholder = translation;
            }
        });

        // 3. Dịch title / tooltip
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = t(key);
            if (translation !== key && translation !== '') {
                el.title = translation;
            }
        });

        // Cập nhật trạng thái active trên language switcher
        updateSwitcherUI();
    }

    /**
     * Đổi ngôn ngữ và lưu vào localStorage
     */
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            localStorage.setItem(LEGACY_KEY, lang);
        } catch (e) {}

        translateDOM();

        // Bắn sự kiện để các file script khác (app.js, auth.js) lắng nghe
        window.dispatchEvent(new CustomEvent('hmLanguageChanged', { detail: { lang } }));
    }

    /**
     * Cập nhật UI của nút chọn ngôn ngữ
     */
    function updateSwitcherUI() {
        const currentOption = LANG_OPTIONS.find(o => o.code === currentLang) || LANG_OPTIONS[1];
        
        const currentFlagEl = document.getElementById('hmCurrentLangFlag');
        const currentNameEl = document.getElementById('hmCurrentLangName');
        if (currentFlagEl) currentFlagEl.textContent = currentOption.flag;
        if (currentNameEl) currentNameEl.textContent = currentOption.code.toUpperCase();

        // Cập nhật class active trong dropdown
        document.querySelectorAll('.hm-lang-item').forEach(item => {
            const code = item.getAttribute('data-lang');
            item.classList.toggle('active', code === currentLang);
        });

        // Cập nhật class active trong các pill/button
        document.querySelectorAll('.auth-lang-pill, .hm-lang-pill, .lang-btn').forEach(pill => {
            const code = pill.getAttribute('data-lang');
            pill.classList.toggle('active', code === currentLang);
        });
    }

    /**
     * Gắn sự kiện click cho các nút / pill chọn ngôn ngữ
     */
    function bindLangTriggers() {
        document.querySelectorAll('.auth-lang-pill, .hm-lang-pill, .lang-btn').forEach(btn => {
            if (btn._hmBound) return;
            btn._hmBound = true;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang && SUPPORTED_LANGS.includes(lang)) {
                    setLanguage(lang);
                }
            });
        });
    }

    /**
     * Tự động inject CSS cho floating switcher nếu trang chưa có style
     */
    function injectSwitcherStyles() {
        if (typeof document === 'undefined' || !document.head) return;
        if (document.getElementById('hmLangSwitcherStyles')) return;
        const style = document.createElement('style');
        style.id = 'hmLangSwitcherStyles';
        style.textContent = `
            .hm-lang-switcher {
                position: fixed;
                top: 16px;
                right: 20px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .hm-lang-btn {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                padding: 7px 14px;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 20px;
                color: #f8fafc;
                font-size: 0.85rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                outline: none;
            }
            .hm-lang-btn:hover {
                background: rgba(30, 41, 59, 0.85);
                border-color: rgba(0, 245, 160, 0.4);
                box-shadow: 0 0 15px rgba(0, 245, 160, 0.25);
                transform: translateY(-1px);
            }
            .hm-lang-switcher.open .hm-lang-arrow {
                transform: rotate(180deg);
            }
            .hm-lang-arrow {
                transition: transform 0.25s ease;
                opacity: 0.8;
            }
            .hm-lang-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                min-width: 170px;
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 14px;
                padding: 6px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 160, 0.1);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-8px) scale(0.97);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            .hm-lang-switcher.open .hm-lang-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
                pointer-events: auto;
            }
            .hm-lang-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: transparent;
                border: none;
                border-radius: 8px;
                color: #94a3b8;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                text-align: left;
                outline: none;
            }
            .hm-lang-item:hover {
                background: rgba(255, 255, 255, 0.08);
                color: #ffffff;
            }
            .hm-lang-item.active {
                background: rgba(0, 245, 160, 0.15);
                color: #00f5a0;
            }
            .hm-item-flag { font-size: 1.15rem; line-height: 1; }
            .hm-item-name { flex: 1; }
            .hm-item-check { color: #00f5a0; font-weight: 800; }
            @media (max-width: 768px) {
                .hm-lang-switcher { top: 12px; right: 12px; }
                .hm-lang-btn { padding: 5px 10px; font-size: 0.8rem; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Khởi tạo widget chọn ngôn ngữ (Language Switcher)
     */
    function mountLanguageSwitcher() {
        // Nếu trang đã có bất kỳ nút chuyển đổi ngôn ngữ nào (#navLangSwitch, #authLangPills, .auth-card-lang-bar), KHÔNG mount widget nổi đè lên!
        if (document.getElementById('navLangSwitch') || 
            document.getElementById('authLangPills') || 
            document.querySelector('.auth-card-lang-bar') || 
            document.querySelector('[data-no-floating-lang]')) {
            const existing = document.getElementById('hmLanguageSwitcher');
            if (existing) existing.remove();
            return;
        }

        // Tự động inject CSS cho floating switcher nếu chưa có
        injectSwitcherStyles();

        if (document.getElementById('hmLanguageSwitcher')) return;

        const switcherContainer = document.createElement('div');
        switcherContainer.id = 'hmLanguageSwitcher';
        switcherContainer.className = 'hm-lang-switcher';

        const currentOption = LANG_OPTIONS.find(o => o.code === currentLang) || LANG_OPTIONS[1];

        switcherContainer.innerHTML = `
            <button type="button" class="hm-lang-btn" id="hmLangBtn" aria-label="Select Language">
                <span class="hm-lang-flag" id="hmCurrentLangFlag">${currentOption.flag}</span>
                <span class="hm-lang-code" id="hmCurrentLangName">${currentOption.code.toUpperCase()}</span>
                <svg class="hm-lang-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="hm-lang-dropdown" id="hmLangDropdown">
                ${LANG_OPTIONS.map(opt => `
                    <button type="button" class="hm-lang-item ${opt.code === currentLang ? 'active' : ''}" data-lang="${opt.code}">
                        <span class="hm-item-flag">${opt.flag}</span>
                        <span class="hm-item-name">${opt.name}</span>
                        <span class="hm-item-check">${opt.code === currentLang ? '✓' : ''}</span>
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(switcherContainer);

        const btn = switcherContainer.querySelector('.hm-lang-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                switcherContainer.classList.toggle('open');
            });
        }

        switcherContainer.querySelectorAll('.hm-lang-item').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                setLanguage(lang);
                switcherContainer.classList.remove('open');
            });
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!switcherContainer.contains(e.target)) {
                switcherContainer.classList.remove('open');
            }
        });
    }

    /**
     * Thử kiểm tra vị trí IP ngầm (Non-blocking, không làm chậm ứng dụng)
     */
    function checkGeoIpFallback() {
        // Chỉ chạy nếu người dùng chưa từng chọn ngôn ngữ thủ công
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved) return;

        // Fetch nhanh với timeout 1000ms
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        fetch('https://api.country.is/', { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                clearTimeout(timeoutId);
                if (!data || !data.country) return;
                const country = data.country.toUpperCase();
                let geoLang = null;

                if (country === 'VN') {
                    geoLang = 'vi';
                } else if (country === 'CN') {
                    geoLang = 'zh';
                } else {
                    // Ngoài Việt Nam và Trung Quốc -> Mặc định tiếng Anh
                    geoLang = 'en';
                }

                if (geoLang && geoLang !== currentLang) {
                    setLanguage(geoLang);
                }
            })
            .catch(() => {
                // Thất bại hoặc timeout -> Giữ nguyên ngôn ngữ đã detect ban đầu
            });
    }

    /**
     * Khởi tạo toàn bộ hệ thống i18n
     */
    function init() {
        currentLang = detectLanguage();
        translateDOM();
        bindLangTriggers();
        mountLanguageSwitcher();
        checkGeoIpFallback();

        // Gắn lại triggers nếu DOM thay đổi động (ví dụ modal hoặc tabs mở ra)
        if (typeof MutationObserver !== 'undefined' && document.body) {
            const observer = new MutationObserver(() => {
                bindLangTriggers();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Tự động chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export API toàn cục
    window.I18N = {
        t,
        setLanguage,
        getLanguage: () => currentLang,
        translateDOM,
        registerTranslations,
        SUPPORTED_LANGS,
        LANG_OPTIONS,
        translations
    };

})();
