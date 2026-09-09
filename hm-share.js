// ============================================================
// HM-SHARE — Thẻ khoe thành tích
//
// Vẽ một tấm ảnh 1080×1350 (tỉ lệ 4:5, khổ đẹp nhất cho bảng tin
// Facebook/Threads/Instagram) gồm: cảnh giới, chuỗi ngày, danh hiệu và
// ảnh đại diện của người dùng — rồi chia sẻ thẳng qua trình duyệt hoặc
// tải về.
//
// MỤC ĐÍCH: biến mỗi người dùng có chuỗi dài thành một người quảng cáo.
// Hoạt ảnh và hệ thống cảnh giới vốn là thứ đẹp nhất của app nhưng chỉ
// người đang dùng mới thấy. Thẻ này đưa nó ra ngoài.
//
// Toàn bộ vẽ bằng canvas, KHÔNG phụ thuộc thư viện ngoài.
// ============================================================

(function () {
    'use strict';

    if (window.hmShareAchievement) return;

    const W = 1080;
    const H = 1350;

    const TEXT = {
        vi: {
            btn: 'Khoe thành tích',
            streakLabel: 'NGÀY LIÊN TIẾP',
            record: 'Kỷ lục',
            totalDp: 'Tổng điểm',
            checks: 'Lượt điểm danh',
            days: 'ngày',
            caption: (realm, streak) =>
                `Tôi đang ở cảnh giới "${realm}" với chuỗi ${streak} ngày liên tiếp 🔥\n` +
                `Rèn kỷ luật như tu luyện — habit-mastery.com`,
            saved: 'Đã tải ảnh về máy. Giờ bạn có thể đăng lên trang cá nhân!',
            copied: 'Đã chép nội dung kèm theo vào bộ nhớ tạm.',
            failed: 'Không tạo được ảnh. Vui lòng thử lại.',
        },
        en: {
            btn: 'Share achievement',
            streakLabel: 'DAY STREAK',
            record: 'Record',
            totalDp: 'Total points',
            checks: 'Check-ins',
            days: 'days',
            caption: (realm, streak) =>
                `I've reached "${realm}" with a ${streak}-day streak 🔥\n` +
                `Discipline as cultivation — habit-mastery.com`,
            saved: 'Image saved. You can post it now!',
            copied: 'Caption copied to clipboard.',
            failed: 'Could not create the image. Please try again.',
        },
        zh: {
            btn: '晒出成就',
            streakLabel: '连续天数',
            record: '最高记录',
            totalDp: '总积分',
            checks: '打卡次数',
            days: '天',
            caption: (realm, streak) =>
                `我已达到「${realm}」境界，连续坚持 ${streak} 天 🔥\n` +
                `以修炼之心自律 — habit-mastery.com`,
            saved: '图片已保存，现在可以发布了！',
            copied: '文案已复制到剪贴板。',
            failed: '生成图片失败，请重试。',
        },
    };

    function lang() {
        let l = null;
        try { l = localStorage.getItem('hm_app_lang') || localStorage.getItem('hg_lang'); } catch (e) {}
        if (!l) l = (navigator.language || 'vi').slice(0, 2).toLowerCase();
        return TEXT[l] ? l : 'vi';
    }
    const t = () => TEXT[lang()];

    // ---------- Tiện ích vẽ ----------
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    // Chữ dài quá thì thu nhỏ cỡ chữ cho vừa, thay vì để tràn ra ngoài thẻ.
    function fitText(ctx, text, maxWidth, startSize, weight, family) {
        let size = startSize;
        do {
            ctx.font = `${weight} ${size}px ${family}`;
            if (ctx.measureText(text).width <= maxWidth) break;
            size -= 2;
        } while (size > 16);
        return size;
    }

    const FONT = `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif`;

    // Ảnh đại diện có thể nằm ở tên miền khác (Google). Không đặt
    // crossOrigin thì canvas bị "nhiễm bẩn" và toBlob() ném lỗi bảo mật.
    // Tải được thì dùng, không thì vẽ vòng tròn chữ cái đầu.
    function loadAvatar(url) {
        return new Promise((resolve) => {
            if (!url) return resolve(null);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = url;
            // Ảnh treo quá lâu thì bỏ qua, không để người dùng chờ mãi.
            setTimeout(() => resolve(null), 4000);
        });
    }

    /**
     * Vẽ thẻ và trả về Blob PNG.
     * data: { displayName, avatarUrl, realmName, stepName, title,
     *         streak, maxStreak, totalDp, totalChecks }
     */
    async function buildCard(data) {
        const cv = document.createElement('canvas');
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext('2d');
        const L = t();

        // ----- Nền -----
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#0b1220');
        bg.addColorStop(0.55, '#111c2e');
        bg.addColorStop(1, '#0a1a16');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Quầng sáng sau con số chuỗi ngày
        const glow = ctx.createRadialGradient(W / 2, 640, 40, W / 2, 640, 460);
        glow.addColorStop(0, 'rgba(16,185,129,0.30)');
        glow.addColorStop(1, 'rgba(16,185,129,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 180, W, 940);

        // Viền trong
        ctx.strokeStyle = 'rgba(255,255,255,0.10)';
        ctx.lineWidth = 2;
        roundRect(ctx, 32, 32, W - 64, H - 64, 40);
        ctx.stroke();

        ctx.textAlign = 'center';

        // ----- Thương hiệu -----
        ctx.fillStyle = '#34d399';
        ctx.font = `800 30px ${FONT}`;
        ctx.letterSpacing = '6px';
        ctx.fillText('✦ HABIT MASTERY', W / 2, 118);
        ctx.letterSpacing = '0px';

        // ----- Ảnh đại diện -----
        const avaY = 210;
        const avaR = 74;
        const img = await loadAvatar(data.avatarUrl);

        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, avaY + avaR, avaR, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        if (img) {
            ctx.drawImage(img, W / 2 - avaR, avaY, avaR * 2, avaR * 2);
        } else {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(W / 2 - avaR, avaY, avaR * 2, avaR * 2);
            ctx.fillStyle = '#04140d';
            ctx.font = `800 68px ${FONT}`;
            ctx.textBaseline = 'middle';
            ctx.fillText((data.displayName || 'U').trim().charAt(0).toUpperCase(), W / 2, avaY + avaR + 4);
            ctx.textBaseline = 'alphabetic';
        }
        ctx.restore();

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(W / 2, avaY + avaR, avaR + 4, 0, Math.PI * 2);
        ctx.stroke();

        // ----- Tên -----
        let y = avaY + avaR * 2 + 66;
        const nameSize = fitText(ctx, data.displayName || '', W - 200, 46, '800', FONT);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = `800 ${nameSize}px ${FONT}`;
        ctx.fillText(data.displayName || '', W / 2, y);

        // ----- Danh hiệu -----
        if (data.title) {
            y += 54;
            ctx.font = `700 25px ${FONT}`;
            const tw = ctx.measureText(data.title).width;
            ctx.fillStyle = 'rgba(251,191,36,0.14)';
            roundRect(ctx, W / 2 - tw / 2 - 24, y - 30, tw + 48, 46, 23);
            ctx.fill();
            ctx.strokeStyle = 'rgba(251,191,36,0.45)';
            ctx.lineWidth = 2;
            roundRect(ctx, W / 2 - tw / 2 - 24, y - 30, tw + 48, 46, 23);
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(data.title, W / 2, y);
        }

        // ----- Cảnh giới -----
        y += 96;
        ctx.fillStyle = 'rgba(226,232,240,0.55)';
        ctx.font = `600 24px ${FONT}`;
        ctx.letterSpacing = '4px';
        ctx.fillText((data.stepName || '').toUpperCase(), W / 2, y);
        ctx.letterSpacing = '0px';

        y += 62;
        const realmSize = fitText(ctx, data.realmName || '', W - 160, 62, '800', FONT);
        const rg = ctx.createLinearGradient(W / 2 - 300, y, W / 2 + 300, y);
        rg.addColorStop(0, '#fbbf24');
        rg.addColorStop(0.5, '#fde68a');
        rg.addColorStop(1, '#fbbf24');
        ctx.fillStyle = rg;
        ctx.font = `800 ${realmSize}px ${FONT}`;
        ctx.fillText(data.realmName || '', W / 2, y);

        // ----- Chuỗi ngày (phần chính) -----
        // Ngọn lửa và con số phải được căn giữa NHƯ MỘT CỤM, không phải
        // căn giữa riêng con số rồi đẩy lửa sang trái — làm vậy thì số
        // càng nhiều chữ cụm càng lệch.
        y += 150;
        const streakStr = String(data.streak ?? 0);
        ctx.font = `800 190px ${FONT}`;
        const numW = ctx.measureText(streakStr).width;
        ctx.font = `400 104px ${FONT}`;
        const fireW = ctx.measureText('🔥').width;
        const gapFN = 26;
        const groupW = fireW + gapFN + numW;
        const groupL = (W - groupW) / 2;

        ctx.textAlign = 'left';
        ctx.font = `400 104px ${FONT}`;
        ctx.fillStyle = '#f97316';
        ctx.fillText('🔥', groupL, y - 18);

        ctx.font = `800 190px ${FONT}`;
        ctx.fillStyle = '#10b981';
        ctx.fillText(streakStr, groupL + fireW + gapFN, y);
        ctx.textAlign = 'center';

        y += 52;
        ctx.fillStyle = 'rgba(226,232,240,0.72)';
        ctx.font = `700 30px ${FONT}`;
        ctx.letterSpacing = '7px';
        ctx.fillText(L.streakLabel, W / 2, y);
        ctx.letterSpacing = '0px';

        // ----- Ba ô chỉ số -----
        y += 78;
        const stats = [
            [L.record, `${data.maxStreak ?? 0} ${L.days}`],
            [L.totalDp, String(data.totalDp ?? 0)],
            [L.checks, String(data.totalChecks ?? 0)],
        ];
        const boxW = 276, boxH = 132, gap = 22;
        const totalW = boxW * 3 + gap * 2;
        let bx = (W - totalW) / 2;
        stats.forEach(([label, val]) => {
            ctx.fillStyle = 'rgba(255,255,255,0.045)';
            roundRect(ctx, bx, y, boxW, boxH, 20);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.09)';
            ctx.lineWidth = 2;
            roundRect(ctx, bx, y, boxW, boxH, 20);
            ctx.stroke();

            ctx.fillStyle = 'rgba(226,232,240,0.55)';
            ctx.font = `600 23px ${FONT}`;
            ctx.fillText(label, bx + boxW / 2, y + 46);

            const vs = fitText(ctx, val, boxW - 40, 42, '800', FONT);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = `800 ${vs}px ${FONT}`;
            ctx.fillText(val, bx + boxW / 2, y + 100);

            bx += boxW + gap;
        });

        // ----- Chân thẻ -----
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = `600 27px ${FONT}`;
        ctx.fillText('habit-mastery.com', W / 2, H - 74);

        return new Promise((resolve, reject) => {
            cv.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob rỗng'))), 'image/png');
        });
    }

    // ---------- Chia sẻ ----------
    async function shareAchievement(data) {
        const L = t();
        let blob;
        try {
            blob = await buildCard(data);
        } catch (err) {
            console.error('hm-share: vẽ thẻ lỗi', err);
            if (window.hmAlert) hmAlert(L.failed); else alert(L.failed);
            return;
        }

        const fileName = `habit-mastery-${data.streak ?? 0}-days.png`;
        const file = new File([blob], fileName, { type: 'image/png' });
        const caption = L.caption(data.realmName || '', data.streak ?? 0);

        // Điện thoại: mở bảng chia sẻ của hệ điều hành, đăng thẳng lên
        // Facebook/Zalo/Threads mà không phải tải về rồi tự chọn ảnh.
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], text: caption });
                return;
            } catch (err) {
                // Người dùng bấm huỷ thì im lặng, không rơi xuống nhánh tải về.
                if (err && err.name === 'AbortError') return;
            }
        }

        // Máy tính: tải ảnh về và chép sẵn nội dung kèm theo.
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);

        let msg = L.saved;
        try {
            await navigator.clipboard.writeText(caption);
            msg += '\n\n' + L.copied;
        } catch (e) { /* trình duyệt chặn clipboard: bỏ qua, ảnh vẫn tải được */ }

        if (window.hmAlert) hmAlert(msg); else alert(msg);
    }

    window.hmShareAchievement = shareAchievement;
    window.hmShareButtonLabel = () => t().btn;
    window.hmBuildShareCard = buildCard;   // để kiểm thử
})();
