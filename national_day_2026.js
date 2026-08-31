/**
 * GIAO DIỆN SỰ KIỆN QUỐC KHÁNH VIỆT NAM (2/9)
 * Tự động kích hoạt đến hết 23:59:59 ngày 03/09/2026
 * Thiết kế:
 * - Giữ nguyên 100% màu sắc gốc của ứng dụng (Dark/Light mode)
 * - Bỏ toàn bộ hoa & ruy băng
 * - Chỉ sử dụng họa tiết Cờ đỏ sao vàng Việt Nam to, chìm mờ (watermark) ngẫu nhiên ở nền
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

    // ===== 2. SVG QUỐC KỲ VIỆT NAM =====
    const SVG_FLAG = `
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="20" rx="1.5" fill="#da251d"/>
            <polygon points="15,3.8 17.4,11.2 24.8,11.2 18.8,15.6 21.1,22.8 15,18.4 8.9,22.8 11.2,15.6 5.2,11.2 12.6,11.2" fill="#ffcd00" transform="scale(0.8) translate(3.75, -0.2)"/>
        </svg>
    `;

    // ===== 3. SINH HỌA TIẾT CỜ VIỆT NAM CHÌM MỜ TO Ở BACKGROUND =====
    function generateWatermarkFlags() {
        let container = document.getElementById('vnBackgroundDecorLayer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'vnBackgroundDecorLayer';
            document.body.appendChild(container);
        }
        container.innerHTML = '';

        // Vị trí các vùng phân bố nghệ thuật (tránh giữa màn hình để không đè nội dung chính)
        const quadrants = [
            { left: 3, top: 8, w: 220, rot: -14, delay: 0 },
            { left: 78, top: 12, w: 260, rot: 16, delay: 2 },
            { left: 6, top: 62, w: 240, rot: 12, delay: 4 },
            { left: 76, top: 68, w: 250, rot: -18, delay: 1.5 },
            { left: 42, top: 4, w: 180, rot: -8, delay: 3 },
            { left: 45, top: 80, w: 200, rot: 10, delay: 5 }
        ];

        quadrants.forEach((q, idx) => {
            const el = document.createElement('div');
            el.className = 'vn-bg-flag-watermark';

            // Thêm độ ngẫu nhiên nhẹ cho vị trí & kích thước
            const jitterX = (Math.random() - 0.5) * 6;
            const jitterY = (Math.random() - 0.5) * 6;
            const finalLeft = Math.max(1, Math.min(85, q.left + jitterX));
            const finalTop = Math.max(1, Math.min(85, q.top + jitterY));
            const width = Math.round(q.w * (0.9 + Math.random() * 0.25));
            const height = Math.round(width * (20 / 30));

            el.style.left = `${finalLeft.toFixed(1)}vw`;
            el.style.top = `${finalTop.toFixed(1)}vh`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.setProperty('--rot', `${q.rot}deg`);
            el.style.animationDelay = `${q.delay}s`;
            el.style.animationDuration = `${(10 + idx * 2)}s`;

            el.innerHTML = SVG_FLAG;
            container.appendChild(el);
        });
    }

    // ===== 4. NAVBAR TOGGLE & LOGO DECOR =====
    function injectBrandDecor() {
        const brand = document.querySelector('.nav-brand');
        if (!brand || document.getElementById('vnBrandFlagWrap')) return;

        const wrap = document.createElement('span');
        wrap.id = 'vnBrandFlagWrap';
        wrap.className = 'vn-brand-flag-wrap';
        wrap.innerHTML = `
            <span class="vn-brand-flag" title="Quốc kỳ Việt Nam">${SVG_FLAG}</span>
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

    // ===== 5. HIỆU ỨNG SAO VÀNG KHI CHECK-IN =====
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

    // ===== 6. KHỞI CHẠY =====
    function initNationalDayDecor() {
        const enabled = isDecorEnabled();

        // Xóa bất kỳ phần tử cũ nào
        const oldBanner = document.getElementById('vnNationalBanner');
        if (oldBanner) oldBanner.remove();
        const oldCornerRibbon = document.getElementById('vnCornerRibbon');
        if (oldCornerRibbon) oldCornerRibbon.remove();
        const oldTableRibbon = document.getElementById('vnTableRibbonDecor');
        if (oldTableRibbon) oldTableRibbon.remove();

        generateWatermarkFlags();
        injectBrandDecor();
        injectNavbarToggle();
        applyDecorTheme(enabled);
        attachHabitCheckListener();

        window.addEventListener('resize', () => {
            if (document.documentElement.getAttribute('data-event-decor') === EVENT_CONFIG.eventName) {
                generateWatermarkFlags();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNationalDayDecor);
    } else {
        initNationalDayDecor();
    }

})();
