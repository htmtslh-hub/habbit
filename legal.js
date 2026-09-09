// ============================================================
// LEGAL PAGES — chuyển ngôn ngữ
// Dùng chung cho terms.html, privacy.html, refund.html.
//
// Việc ĐẶT ngôn ngữ ban đầu nằm trong thẻ <script> inline ở <head>
// của từng trang, chạy trước khi trình duyệt vẽ để tránh nháy nội
// dung. File này chỉ lo phần tương tác sau khi trang đã hiển thị.
// ============================================================

(function () {
    'use strict';

    var STORAGE_KEY = 'hm_app_lang';   // trùng key với i18n.js của app
    var LEGACY_KEY = 'hg_lang';

    function markActiveButton(lang) {
        var buttons = document.querySelectorAll('[data-btn]');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-btn') === lang ? 'true' : 'false');
        }
    }

    window.setLang = function (lang) {
        if (lang !== 'vi' && lang !== 'en' && lang !== 'zh') lang = 'en';

        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
        markActiveButton(lang);

        // Ghi lại cùng key với app để người dùng đi tới/lui giữa trang
        // pháp lý và ứng dụng không bị đổi ngôn ngữ giữa chừng.
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            localStorage.setItem(LEGACY_KEY, lang);
        } catch (e) {
            // Chế độ ẩn danh hoặc trình duyệt chặn lưu trữ: bỏ qua,
            // ngôn ngữ vẫn đổi đúng cho phiên hiện tại.
        }
    };

    markActiveButton(document.documentElement.getAttribute('data-lang') || 'en');
})();
