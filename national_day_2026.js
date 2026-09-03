/**
 * GIAO DIỆN SỰ KIỆN QUỐC KHÁNH VIỆT NAM (2/9)
 * Tự động kích hoạt đến hết 23:59:59 ngày 03/09/2026
 * Thiết kế:
 * - Hiệu ứng lá cờ đỏ sao vàng bằng lụa uốn lượn mềm mại như ảnh mẫu
 * - Nền chìm mờ (watermark), giữ 100% màu sắc gốc của ứng dụng (Dark/Light mode)
 * - Tự động tắt sau ngày 03/09/2026
 */

(function() {
    'use strict';

    // ===== 1. CẤU HÌNH THỜI GIAN SỰ KIỆN =====
    const EVENT_CONFIG = {
        eventName: 'national-day-2026',
        startDate: new Date('2026-08-25T00:00:00+07:00'),
        endDate: new Date('2026-09-03T23:59:59+07:00'),
        storageKeys: {
            enabled: 'hm_national_day_2026_enabled'
        }
    };

    // Kiểm tra thời gian sự kiện
    function isEventPeriod() {
        const now = new Date();
        return now >= EVENT_CONFIG.startDate && now <= EVENT_CONFIG.endDate;
    }

    // Kiểm tra trạng thái bật/tắt (Mặc định BẬT trong thời gian sự kiện nếu chưa tắt)
    function isDecorEnabled() {
        const stored = localStorage.getItem(EVENT_CONFIG.storageKeys.enabled);
        if (stored === 'false') return false;
        if (stored === 'true') return true;
        return isEventPeriod();
    }

    function applyDecorTheme(enabled) {
        if (enabled) {
            document.documentElement.setAttribute('data-event-decor', EVENT_CONFIG.eventName);
            localStorage.setItem(EVENT_CONFIG.storageKeys.enabled, 'true');
        } else {
            document.documentElement.removeAttribute('data-event-decor');
            localStorage.setItem(EVENT_CONFIG.storageKeys.enabled, 'false');
        }
        updateDecorVisibility(enabled);
    }

    function toggleDecorTheme() {
        const currentlyEnabled = document.documentElement.getAttribute('data-event-decor') === EVENT_CONFIG.eventName;
        const nextState = !currentlyEnabled;
        applyDecorTheme(nextState);

        if (nextState) {
            triggerSparkles(window.innerWidth / 2, window.innerHeight / 3, 20);
        }
    }
    window._toggleNationalDayTheme = toggleDecorTheme;

    // ===== 2. TẠO LỚP NỀN CỜ LỤA SÓNG NƯỚC CHÌM MỜ =====
    function generateSilkFlagBackground() {
        let container = document.getElementById('vnBackgroundDecorLayer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'vnBackgroundDecorLayer';
            document.body.appendChild(container);
        }
        container.innerHTML = `
            <div class="vn-silk-flag-bg" title="Quốc kỳ Việt Nam"></div>
        `;
    }

    // ===== 3. NAVBAR TOGGLE & LOGO DECOR =====
    function injectBrandDecor() {
        const brand = document.querySelector('.nav-brand');
        if (!brand || document.getElementById('vnBrandFlagWrap')) return;

        const wrap = document.createElement('span');
        wrap.id = 'vnBrandFlagWrap';
        wrap.className = 'vn-brand-flag-wrap';
        wrap.innerHTML = `
            <span class="vn-brand-flag" title="Quốc kỳ Việt Nam">
                <img src="assets/vietnam_flag.svg" alt="🇻🇳">
            </span>
        `;
        brand.appendChild(wrap);
    }

    function injectNavbarToggle() {
        const navControls = document.querySelector('.navbar .nav-controls');
        if (!navControls || document.getElementById('vnNavToggleBtn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'vnNavToggleBtn';
        toggleBtn.className = 'vn-nav-toggle-btn';
        toggleBtn.title = 'Họa tiết Quốc Khánh 2/9 (Đến hết 03/09/2026)';
        toggleBtn.onclick = toggleDecorTheme;
        toggleBtn.innerHTML = `
            <span class="vn-nav-toggle-flag">🇻🇳</span>
            <span class="vn-nav-toggle-text">2/9</span>
        `;

        navControls.insertBefore(toggleBtn, navControls.firstChild);
    }

    function updateDecorVisibility(enabled) {
        const container = document.getElementById('vnBackgroundDecorLayer');
        const btn = document.getElementById('vnNavToggleBtn');
        const brandWrap = document.getElementById('vnBrandFlagWrap');

        if (container) container.style.display = enabled ? 'block' : 'none';
        if (brandWrap) brandWrap.style.display = enabled ? 'inline-flex' : 'none';
        if (btn) {
            btn.style.opacity = enabled ? '1' : '0.55';
            btn.style.borderColor = enabled ? '#ffd700' : 'rgba(255,255,255,0.3)';
        }
    }

    // ===== 4. HIỆU ỨNG SAO VÀNG KHI CHECK-IN =====
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationFrameId = null;

    function initCanvas() {
        if (canvas) return;
        canvas = document.createElement('canvas');
        canvas.id = 'vnFireworksCanvas';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

        function resize() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }
        resize();
        window.addEventListener('resize', resize);
    }

    function triggerSparkles(x = window.innerWidth / 2, y = window.innerHeight / 3, count = 20) {
        initCanvas();
        const colors = ['#ffd700', '#ffcd00', '#ef4444', '#ffffff'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                radius: Math.random() * 2.5 + 1.5,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                gravity: 0.08
            });
        }

        if (!animationFrameId) {
            renderSparkles();
        }
    }

    function renderSparkles() {
        if (!ctx || particles.length === 0) {
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameId = null;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
        }

        animationFrameId = requestAnimationFrame(renderSparkles);
    }

    function attachHabitCheckListener() {
        document.addEventListener('click', function(e) {
            const isDecorOn = document.documentElement.getAttribute('data-event-decor') === EVENT_CONFIG.eventName;
            if (!isDecorOn) return;

            const cbox = e.target.closest('.cbox');
            if (cbox) {
                const rect = cbox.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                setTimeout(() => {
                    triggerSparkles(x, y, 12);
                }, 50);
            }
        });
    }

    // ===== 5. KHỞI CHẠY =====
    function initNationalDayDecor() {
        const enabled = isDecorEnabled();

        // Xóa các phần tử cũ nếu có
        const oldBanner = document.getElementById('vnNationalBanner');
        if (oldBanner) oldBanner.remove();
        const oldCornerRibbon = document.getElementById('vnCornerRibbon');
        if (oldCornerRibbon) oldCornerRibbon.remove();
        const oldTableRibbon = document.getElementById('vnTableRibbonDecor');
        if (oldTableRibbon) oldTableRibbon.remove();

        generateSilkFlagBackground();
        injectBrandDecor();
        injectNavbarToggle();
        applyDecorTheme(enabled);
        attachHabitCheckListener();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNationalDayDecor);
    } else {
        initNationalDayDecor();
    }

})();
