// ============================================================
// HM-DIALOG — hộp thoại thay cho alert() / confirm() / prompt() của trình duyệt
//
// LÝ DO: hộp thoại gốc của trình duyệt hiện sát mép trên màn hình, mang
// nhãn "habit-mastery.com cho biết", dùng font và nút hệ thống — lạc hẳn
// so với giao diện ứng dụng, và không đổi theo theme người dùng chọn.
//
// File này CỐ TÌNH tự chèn CSS của chính nó thay vì viết vào style.css:
// nó được dùng chung bởi index.html, admin.html và auth.html — mà ba trang
// đó đặt tên biến CSS khác nhau (style.css dùng --text-main, admin.css dùng
// --text-primary, auth.css không có :root). Nên mọi màu ở đây đều đi kèm
// chuỗi dự phòng để hiển thị đúng ở cả ba nơi.
//
// API (đều trả về Promise):
//     await hmAlert('Xong rồi')                 -> undefined
//     await hmConfirm('Chắc chưa?')             -> true | false
//     await hmPrompt('Nhập tên', 'mặc định')    -> chuỗi | null
//
// window.alert cũng được thay luôn để 100+ lời gọi cũ tự đẹp theo mà
// không phải sửa từng chỗ. confirm/prompt KHÔNG thay được kiểu đó vì
// chúng chạy đồng bộ, còn hộp thoại tự vẽ thì không — các chỗ gọi
// confirm/prompt phải chuyển sang await hmConfirm/hmPrompt.
// ============================================================

(function () {
    'use strict';

    if (window.hmConfirm) return;   // đã nạp rồi thì thôi

    // ---------- Nhãn nút theo ngôn ngữ ----------
    var LABELS = {
        vi: { ok: 'OK', cancel: 'Huỷ', confirm: 'Xác nhận', notice: 'Thông báo', ask: 'Xác nhận' },
        en: { ok: 'OK', cancel: 'Cancel', confirm: 'Confirm', notice: 'Notice', ask: 'Confirm' },
        zh: { ok: '确定', cancel: '取消', confirm: '确认', notice: '提示', ask: '确认' },
    };

    function lang() {
        var l = null;
        try { l = localStorage.getItem('hm_app_lang') || localStorage.getItem('hg_lang'); } catch (e) {}
        if (!l) l = (navigator.language || 'vi').slice(0, 2).toLowerCase();
        return LABELS[l] ? l : 'vi';
    }
    function t(key) { return LABELS[lang()][key]; }

    // ---------- CSS ----------
    var CSS = [
        '.hm-dlg-bg{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;',
        'justify-content:center;padding:20px;box-sizing:border-box;',
        'background:rgba(8,12,20,.66);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);',
        'animation:hmDlgFade .16s ease-out}',

        '.hm-dlg{width:400px;max-width:100%;box-sizing:border-box;',
        'background:var(--bg-card,#111a2b);',
        'border:1px solid var(--border-color,rgba(255,255,255,.14));',
        'border-radius:18px;padding:26px 26px 22px;text-align:center;',
        'box-shadow:0 24px 60px rgba(0,0,0,.55);',
        'font-family:inherit;color:var(--text-main,var(--text-primary,#e8edf5));',
        'animation:hmDlgPop .22s cubic-bezier(.34,1.56,.64,1);',
        'max-height:calc(100vh - 40px);overflow-y:auto}',

        '.hm-dlg-icon{font-size:34px;line-height:1;margin-bottom:12px}',

        '.hm-dlg-title{margin:0 0 10px;font-size:17.5px;font-weight:800;letter-spacing:-.2px;',
        'color:var(--text-main,var(--text-primary,#f1f5f9))}',

        '.hm-dlg-msg{margin:0;font-size:14.8px;line-height:1.62;white-space:pre-wrap;',
        'word-break:break-word;color:var(--text-muted,var(--text-secondary,#a8b3c4))}',

        '.hm-dlg-input{width:100%;box-sizing:border-box;margin-top:16px;padding:11px 13px;',
        'font:inherit;font-size:14.5px;border-radius:10px;',
        'background:rgba(127,140,160,.12);',
        'border:1px solid var(--border-color,rgba(255,255,255,.16));',
        'color:var(--text-main,var(--text-primary,#e8edf5));outline:none}',
        '.hm-dlg-input:focus{border-color:var(--accent,var(--accent-green,#10b981))}',

        '.hm-dlg-btns{display:flex;gap:10px;justify-content:center;margin-top:22px}',

        '.hm-dlg-btn{flex:1;max-width:160px;padding:11px 18px;font:inherit;font-size:14.5px;',
        'font-weight:700;border-radius:11px;cursor:pointer;border:1px solid transparent;',
        'transition:transform .12s ease,filter .12s ease}',
        '.hm-dlg-btn:hover{filter:brightness(1.1)}',
        '.hm-dlg-btn:active{transform:scale(.97)}',
        // Viền tiêu điểm màu trung tính: nếu dùng chính màu accent thì trên
        // nút primary (vốn đã là màu accent) sẽ gần như không nhìn thấy.
        '.hm-dlg-btn:focus-visible{outline:2px solid rgba(148,163,184,.9);outline-offset:3px}',

        // Màu chữ nút primary do JS tính lúc chạy (xem pickTextOnAccent):
        // 12 theme có accent sáng tối rất khác nhau, để cố định một màu là
        // chắc chắn có theme bị chữ chìm vào nền nút.
        '.hm-dlg-btn.primary{background:var(--accent,var(--accent-green,#10b981));color:#04140d}',
        '.hm-dlg-btn.danger{background:#dc2626;color:#fff}',
        '.hm-dlg-btn.ghost{background:transparent;color:var(--text-muted,var(--text-secondary,#9aa6b8));',
        'border-color:var(--border-color,rgba(255,255,255,.18))}',
        '.hm-dlg-btn.ghost:hover{color:var(--text-main,var(--text-primary,#e8edf5))}',

        '@keyframes hmDlgFade{from{opacity:0}to{opacity:1}}',
        '@keyframes hmDlgPop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}',
        '@media (max-width:480px){.hm-dlg{padding:22px 18px 18px}.hm-dlg-btns{flex-direction:column-reverse}',
        '.hm-dlg-btn{max-width:none}}',
        // Người dùng bật "giảm chuyển động" trong hệ điều hành thì bỏ hiệu ứng.
        '@media (prefers-reduced-motion:reduce){.hm-dlg,.hm-dlg-bg{animation:none}}',
    ].join('');

    function injectCss() {
        if (document.getElementById('hmDialogStyles')) return;
        var s = document.createElement('style');
        s.id = 'hmDialogStyles';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    }

    // Đoán biểu tượng từ nội dung, để hộp thoại có sắc thái đúng mà chỗ
    // gọi không phải truyền thêm tham số gì.
    function guessIcon(msg, kind) {
        var m = (msg || '').toLowerCase();
        if (/xoá|xóa|delete|xoa|删除|rời|thoát|đăng xuất/.test(m)) return '🗑️';
        if (/lỗi|error|thất bại|không thể|sai|错误|失败/.test(m)) return '⚠️';
        if (/thành công|xong|đã |success|完成|成功/.test(m)) return '✅';
        if (/dp|coins|mua|thanh toán|nâng cấp|购买/.test(m)) return '💎';
        return kind === 'confirm' ? '❓' : 'ℹ️';
    }

    // Chọn màu chữ (đen hay trắng) cho nút primary dựa trên độ sáng THỰC TẾ
    // của màu nền nút sau khi trình duyệt đã resolve biến CSS.
    //
    // Cần thiết vì 12 theme có accent trải từ rất sáng (#22e07a của Matrix)
    // tới khá tối (#9c6434 của Mocha). Để cố định chữ đen thì trên Mocha chỉ
    // đạt 3.9:1 — dưới chuẩn AA 4.5:1 và đọc rất mệt.
    function pickTextOnAccent(el) {
        var bg;
        try { bg = getComputedStyle(el).backgroundColor; } catch (e) { return null; }
        var m = bg && bg.match(/[\d.]+/g);
        if (!m || m.length < 3) return null;

        function lin(v) {
            v = v / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }
        var L = 0.2126 * lin(+m[0]) + 0.7152 * lin(+m[1]) + 0.0722 * lin(+m[2]);

        var vsWhite = 1.05 / (L + 0.05);   // tỉ lệ tương phản với chữ trắng
        var vsBlack = (L + 0.05) / 0.05;   // với chữ gần đen
        return vsWhite > vsBlack ? '#ffffff' : '#04140d';
    }

    var openCount = 0;

    /**
     * Lõi dựng hộp thoại. kind: 'alert' | 'confirm' | 'prompt'
     */
    function build(kind, message, opts) {
        opts = opts || {};
        injectCss();

        return new Promise(function (resolve) {
            var bg = document.createElement('div');
            bg.className = 'hm-dlg-bg';

            var box = document.createElement('div');
            box.className = 'hm-dlg';
            box.setAttribute('role', kind === 'alert' ? 'alertdialog' : 'dialog');
            box.setAttribute('aria-modal', 'true');

            // Biểu tượng
            var icon = document.createElement('div');
            icon.className = 'hm-dlg-icon';
            icon.textContent = opts.icon || guessIcon(message, kind);
            box.appendChild(icon);

            // Tiêu đề
            var title = document.createElement('h3');
            title.className = 'hm-dlg-title';
            title.textContent = opts.title || (kind === 'alert' ? t('notice') : t('ask'));
            box.appendChild(title);

            // Nội dung — dùng textContent nên nội dung do người dùng nhập
            // (tên thói quen, biệt danh...) không thể chèn HTML vào đây.
            var msg = document.createElement('p');
            msg.className = 'hm-dlg-msg';
            msg.textContent = message == null ? '' : String(message);
            box.appendChild(msg);

            // Ô nhập cho prompt
            var input = null;
            if (kind === 'prompt') {
                input = document.createElement('input');
                input.className = 'hm-dlg-input';
                input.type = 'text';
                input.value = opts.defaultValue == null ? '' : String(opts.defaultValue);
                box.appendChild(input);
            }

            // Nút
            var btns = document.createElement('div');
            btns.className = 'hm-dlg-btns';

            var btnCancel = null;
            if (kind !== 'alert') {
                btnCancel = document.createElement('button');
                btnCancel.type = 'button';
                btnCancel.className = 'hm-dlg-btn ghost';
                btnCancel.textContent = opts.cancelText || t('cancel');
                btns.appendChild(btnCancel);
            }

            var btnOk = document.createElement('button');
            btnOk.type = 'button';
            btnOk.className = 'hm-dlg-btn ' + (opts.danger ? 'danger' : 'primary');
            btnOk.textContent = opts.okText || (kind === 'alert' ? t('ok') : t('confirm'));
            btns.appendChild(btnOk);

            box.appendChild(btns);
            bg.appendChild(box);
            document.body.appendChild(bg);

            // Phải gọi SAU khi đã gắn vào DOM thì getComputedStyle mới đọc
            // được màu accent đã resolve từ biến CSS của theme đang dùng.
            if (!opts.danger) {
                var onAccent = pickTextOnAccent(btnOk);
                if (onAccent) btnOk.style.color = onAccent;
            }

            // Khoá cuộn nền khi có hộp thoại. Đếm số hộp đang mở để hộp này
            // đóng không mở khoá nhầm khi vẫn còn hộp khác chồng lên.
            openCount++;
            var prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            var prevFocus = document.activeElement;
            var done = false;

            function close(value) {
                if (done) return;
                done = true;
                document.removeEventListener('keydown', onKey, true);
                bg.remove();
                openCount--;
                if (openCount <= 0) {
                    openCount = 0;
                    document.body.style.overflow = prevOverflow;
                }
                try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
                resolve(value);
            }

            var CANCEL_VALUE = kind === 'confirm' ? false : (kind === 'prompt' ? null : undefined);

            function onKey(e) {
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(CANCEL_VALUE); }
                else if (e.key === 'Enter' && kind !== 'prompt') { e.preventDefault(); e.stopPropagation(); btnOk.click(); }
                else if (e.key === 'Tab') {
                    // Giữ tiêu điểm bên trong hộp thoại.
                    var f = box.querySelectorAll('button, input');
                    if (!f.length) return;
                    var first = f[0], last = f[f.length - 1];
                    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
            document.addEventListener('keydown', onKey, true);

            btnOk.onclick = function () {
                if (kind === 'confirm') close(true);
                else if (kind === 'prompt') close(input.value);
                else close(undefined);
            };
            if (btnCancel) btnCancel.onclick = function () { close(CANCEL_VALUE); };

            // Bấm ra ngoài = huỷ. Chỉ tính khi bấm đúng lớp nền, không phải
            // khi kéo chuột từ trong hộp ra ngoài rồi mới thả.
            bg.addEventListener('mousedown', function (e) {
                if (e.target === bg) bg._fromBg = true;
            });
            bg.addEventListener('click', function (e) {
                if (e.target === bg && bg._fromBg) close(CANCEL_VALUE);
                bg._fromBg = false;
            });

            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') { e.preventDefault(); close(input.value); }
                });
                setTimeout(function () { input.focus(); input.select(); }, 30);
            } else {
                setTimeout(function () { btnOk.focus(); }, 30);
            }
        });
    }

    window.hmAlert = function (message, opts) { return build('alert', message, opts); };
    window.hmConfirm = function (message, opts) { return build('confirm', message, opts); };
    window.hmPrompt = function (message, defaultValue, opts) {
        opts = opts || {};
        opts.defaultValue = defaultValue;
        return build('prompt', message, opts);
    };

    // Thay luôn alert của trình duyệt: nó không trả về giá trị nên việc
    // chuyển từ chặn-luồng sang không-chặn hầu như vô hại, mà đổi lại
    // toàn bộ lời gọi alert() cũ tự khớp giao diện, không phải sửa gì.
    window.__nativeAlert = window.alert;
    window.alert = function (message) { build('alert', message); };
})();
