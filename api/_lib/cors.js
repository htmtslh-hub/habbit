// ============================================================
// CORS — danh sách origin được phép gọi API, khai báo MỘT chỗ duy nhất
//
// LÝ DO RA ĐỜI (09/09/2026): mỗi endpoint tự viết một biểu thức kiểu
//     origin.endsWith(".web.app") || origin.endsWith(".vercel.app")
// nên khi gắn tên miền riêng habit-mastery.com thì origin đó không khớp
// mẫu nào -> header trả về sai origin -> trình duyệt chặn -> XÁC THỰC 2
// LỚP OTP HỎNG HOÀN TOÀN trên tên miền chính. Kiểu lỗi này rất khó thấy
// vì server vẫn trả 200, chỉ có trình duyệt lặng lẽ chặn ở phía client.
//
// Đồng thời siết luôn một lỗ hổng: `.endsWith(".web.app")` cho phép BẤT
// KỲ site Firebase nào trên thế giới gọi endpoint gửi OTP của mình —
// tức là ai cũng mượn được để bắn email. Nay liệt kê đích danh.
// ============================================================

// Các origin cố định được phép.
const ALLOWED_ORIGINS = [
    "https://habit-mastery.com",          // tên miền chuẩn
    "https://www.habit-mastery.com",
    "https://habitmastery.web.app",       // site Firebase 1
    "https://habitmastery.firebaseapp.com",
    "https://sonnhai-2600f.web.app",      // site Firebase 2
    "https://sonnhai-2600f.firebaseapp.com",
];

// Origin mặc định khi request không kèm Origin, hoặc khi bị từ chối.
const DEFAULT_ORIGIN = "https://habit-mastery.com";

function isAllowedOrigin(origin) {
    if (!origin) return true;                       // gọi từ server, curl, app native
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    // Bản xem trước của Vercel: https://<gì đó>.vercel.app
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
    // Môi trường phát triển
    if (/^https?:\/\/localhost(:\d+)?$/i.test(origin)) return true;
    if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin)) return true;
    return false;
}

/**
 * Gắn header CORS vào response.
 * @returns {boolean} origin có được phép hay không (để endpoint tự quyết
 *                    có chặn request hay chỉ ghi log).
 */
function applyCors(req, res, { methods = "POST, OPTIONS", headers = "Content-Type" } = {}) {
    const origin = req.headers.origin;
    const allowed = isAllowedOrigin(origin);

    res.setHeader("Access-Control-Allow-Origin", allowed ? (origin || DEFAULT_ORIGIN) : DEFAULT_ORIGIN);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", methods);
    res.setHeader("Access-Control-Allow-Headers", headers);

    if (!allowed) {
        console.warn("CORS: origin bị từ chối:", origin);
    }
    return allowed;
}

module.exports = {
    ALLOWED_ORIGINS,
    DEFAULT_ORIGIN,
    isAllowedOrigin,
    applyCors,
};
