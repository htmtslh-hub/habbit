// ============================================================
// GRANT PREMIUM — nơi DUY NHẤT cấp gói trả phí cho người dùng
//
// Trước đây toàn bộ logic này nằm thẳng trong api/sepay-webhook.js.
// Khi bổ sung cổng thanh toán quốc tế (Paddle) sẽ có thêm một webhook
// thứ hai cũng cần cấp gói y hệt — chép sang đó là chắc chắn hai bên
// lệch nhau theo thời gian (một bên sửa cách tính hạn, bên kia quên).
// Vì vậy tách ra đây để mọi cổng thanh toán gọi chung một hàm.
//
// File nằm trong _lib/ nên Vercel KHÔNG coi đây là một route riêng.
//
// LƯU Ý: admin.js là mã chạy trên trình duyệt nên KHÔNG require() được
// file này. Trang admin vẫn tự cập nhật Firestore theo cách riêng của
// nó. Muốn gom nốt chỗ đó thì phải cho admin gọi qua một API route —
// đó là việc riêng, chưa làm ở đây.
// ============================================================

const { resolveResendConfig, sendBrandedEmail } = require("./emailCore");
const { sendSystemMessage } = require("./systemMessage");

// Thời hạn theo từng gói. Khớp với SEPAY_CONFIG.plans trong app.js.
const PLAN_SPECS = {
    monthly: { addMonths: 1, label: "Premium (1 tháng)" },
    yearly: { addYears: 1, label: "Premium (1 năm)" },
};

/**
 * Tính thời điểm hết hạn mới.
 *
 * Mốc bắt đầu là thời điểm MUỘN HƠN giữa "bây giờ" và "hạn hiện tại".
 * Bản cũ luôn tính từ new Date(), nên người dùng còn 20 ngày mà gia hạn
 * sớm sẽ bị mất trắng 20 ngày đó. Ở đây thời gian còn lại được cộng dồn.
 */
function computeExpiry(plan, currentExpiresAt) {
    const spec = PLAN_SPECS[plan];
    if (!spec) return null;

    const now = new Date();
    let start = now;

    if (currentExpiresAt) {
        const current = currentExpiresAt.toDate
            ? currentExpiresAt.toDate()
            : new Date(currentExpiresAt);
        if (!isNaN(current.getTime()) && current > now) start = current;
    }

    const expires = new Date(start.getTime());
    if (spec.addMonths) expires.setMonth(expires.getMonth() + spec.addMonths);
    if (spec.addYears) expires.setFullYear(expires.getFullYear() + spec.addYears);
    return expires;
}

/**
 * Nâng cấp một tài khoản lên Premium và gửi thông báo chúc mừng.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @param {object} FieldValue  firebase-admin/firestore FieldValue
 * @param {object} Timestamp   firebase-admin/firestore Timestamp
 * @param {object} opts
 * @param {string} opts.uid          UID người dùng
 * @param {string} opts.plan         "monthly" | "yearly"
 * @param {string} opts.orderNumber  Mã đơn hàng để đối chiếu
 * @param {string} [opts.provider]   "sepay" | "paddle" — ghi lại để đối soát
 * @param {boolean} [opts.notify]    Gửi email + tin nhắn (mặc định true)
 * @returns {Promise<{ok: boolean, reason?: string, planLabel?: string, expiresAt?: Date}>}
 */
async function grantPremium(db, FieldValue, Timestamp, opts) {
    const { uid, plan, orderNumber, provider = "sepay", notify = true } = opts || {};

    if (!uid) return { ok: false, reason: "missing_uid" };
    if (!PLAN_SPECS[plan]) return { ok: false, reason: "unknown_plan:" + plan };

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        console.error("grantPremium: user document not found:", uid);
        return { ok: false, reason: "user_not_found" };
    }

    const uData = userDoc.data() || {};
    const now = FieldValue.serverTimestamp();
    const expiresAt = computeExpiry(plan, uData.planExpiresAt);

    const planUpdates = {
        plan: "premium",
        planUpdatedAt: now,
        upgradeRequested: false,
        upgradeApprovedAt: now,
        lastPaymentOrderNumber: orderNumber || null,
        lastPaymentProvider: provider,
        planExpiresAt: Timestamp.fromDate(expiresAt),
    };

    await userRef.update(planUpdates);
    console.log(
        `grantPremium: user ${uid} -> premium (${plan}, via ${provider}) ` +
        `order ${orderNumber}, expires ${expiresAt.toISOString()}`
    );

    if (notify) {
        // Lỗi ở khâu thông báo TUYỆT ĐỐI không được làm hỏng phản hồi trả về
        // cho cổng thanh toán — nếu không họ sẽ coi là thất bại và gửi lại
        // webhook, trong khi gói đã được cấp rồi.
        try {
            await sendActivationNotice(db, FieldValue, {
                uid,
                uData,
                plan,
                orderNumber,
                expiresAt,
            });
        } catch (notifyErr) {
            console.error("grantPremium: notification failed:", notifyErr.message);
        }
    }

    return { ok: true, planLabel: PLAN_SPECS[plan].label, expiresAt };
}

/** Gửi email + tin nhắn trong app báo đã kích hoạt gói. */
async function sendActivationNotice(db, FieldValue, ctx) {
    const { uid, uData, plan, orderNumber, expiresAt } = ctx;

    const name =
        uData.displayName ||
        (uData.email || "").split("@")[0] ||
        "Chiến binh kỷ luật";
    const planLabel = PLAN_SPECS[plan].label;
    const expiresStr = expiresAt
        ? expiresAt.toLocaleDateString("vi-VN")
        : "Vĩnh viễn";

    const subject = "🎉 Chúc mừng! Tài khoản của bạn đã được kích hoạt Premium";
    const contentHtml = `<p>Xin chào <strong>${name}</strong>,</p>
        <p>Thanh toán của bạn đã được xác nhận thành công! Tài khoản Habit Mastery của bạn vừa được nâng cấp lên <strong>${planLabel}</strong>.</p>
        <div class="highlight-box">
          👑 <strong>Gói:</strong> ${planLabel}<br>
          📅 <strong>Hiệu lực đến:</strong> ${expiresStr}<br>
          🧾 <strong>Mã đơn hàng:</strong> ${orderNumber || "—"}
        </div>
        <p>Giờ đây bạn đã có toàn bộ đặc quyền Premium: thống kê nâng cao, huy hiệu độc quyền, Bình Đóng Băng streak và nhiều hơn nữa. Chúc bạn rèn luyện thật kỷ luật!</p>`;
    const inAppText = `🎉 Chúc mừng! Tài khoản của bạn đã được kích hoạt ${planLabel} thành công.`;

    if (uData.email && uData.email.includes("@")) {
        const emailCfg = await resolveResendConfig(db);
        if (emailCfg) {
            await sendBrandedEmail(emailCfg, {
                to: uData.email,
                subject,
                preheader: inAppText,
                contentHtml,
                ctaText: "Mở Ứng Dụng Ngay →",
                ctaUrl: "https://habit-mastery.com",
            });
        }
    }

    await sendSystemMessage(db, FieldValue, uid, uData, inAppText);
}

module.exports = {
    grantPremium,
    computeExpiry,
    PLAN_SPECS,
};
