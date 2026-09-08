// ============================================================
// SHARED EMAIL CORE — dùng chung bởi send-email.js, sepay-webhook.js
// và cron-daily-reminders.js. File nằm trong _lib/ nên Vercel KHÔNG
// coi đây là 1 route/serverless function riêng.
// ============================================================

const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { Resend } = require("resend");

function getFirebaseAdmin() {
  if (!admin.getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey ? rawKey.replace(/\\n/g, "\n") : undefined;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin credentials not fully configured in environment variables.");
      return null;
    }

    admin.initializeApp({
      credential: admin.cert({ projectId, clientEmail, privateKey }),
    });
  }
  return { firestore: getFirestore, auth: getAuth };
}

// Bọc nội dung người dùng trong template thương hiệu Habit Mastery.
//
// [v5.11.1] Thiết kế lại từ NỀN TỐI sang NỀN SÁNG. Bản cũ dùng nền #060912 với
// chữ #cbd5e1: đọc trong hộp thư rất mỏi mắt, và nhiều client (Gmail, Outlook)
// xử lý email nền tối rất tệ — Outlook bỏ qua gradient/rgba nên chữ nhạt rơi
// xuống nền trắng mặc định thành gần như vô hình. Nền sáng là chuẩn chung của
// email marketing vì lý do đó. Giữ NGUYÊN tên các class (.highlight-box,
// .gold-box...) vì thanh công cụ soạn thảo trong admin chèn đúng các class này.
function wrapEmailTemplate({ title, preheader, contentHtml, ctaText, ctaUrl }) {
  const safeTitle = title || "Thông báo từ Habit Mastery";
  const safePreheader = preheader || safeTitle;
  const appUrl = ctaUrl || "https://habitmastery.web.app";
  const btnText = ctaText || "Vào Ứng Dụng Ngay →";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${safeTitle}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 620px; margin: 0 auto; padding: 28px 16px; box-sizing: border-box; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); }
    .accent-bar { height: 4px; background: #10b981; font-size: 0; line-height: 0; }
    .header { padding: 30px 28px 22px; text-align: center; border-bottom: 1px solid #edf1f6; background: #f7fdfb; }
    .logo-badge { display: inline-block; background: #e7f8f1; border: 1px solid #a7e3cd; padding: 7px 18px; border-radius: 999px; color: #047857; font-weight: 700; font-size: 12.5px; letter-spacing: 1.4px; text-transform: uppercase; }
    .title { margin: 18px 0 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.35; letter-spacing: -0.4px; }
    .body-content { padding: 28px 30px; font-size: 15.5px; line-height: 1.75; color: #374151; }
    .body-content p { margin: 0 0 16px; }
    .body-content strong { color: #0f172a; }
    .body-content a { color: #047857; }
    .body-content h2, .body-content h3 { color: #0f172a; margin: 22px 0 10px; }
    .body-content ul { padding-left: 20px; margin: 0 0 18px; }
    .body-content li { margin-bottom: 8px; }
    .highlight-box { background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 20px 0; font-size: 14.5px; color: #1e40af; }
    .gold-box { background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 20px 0; font-size: 14.5px; color: #92400e; }
    .btn-container { text-align: center; margin: 30px 0 8px; }
    /* #047857 chứ không phải #059669: chữ trắng trên #059669 chỉ đạt 3.77:1, dưới chuẩn AA 4.5:1 */
    .btn { display: inline-block; background: #047857; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-align: center; }
    .footer { padding: 22px 28px; text-align: center; font-size: 12px; line-height: 1.6; color: #6b7280; border-top: 1px solid #edf1f6; background: #fafbfc; }
    .footer a { color: #047857; text-decoration: underline; }
    .preheader-hidden { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
  </style>
</head>
<body>
  <span class="preheader-hidden">${safePreheader}</span>
  <div class="wrapper">
    <div class="card">
      <div class="accent-bar">&nbsp;</div>
      <div class="header">
        <div class="logo-badge">✦ HABIT MASTERY</div>
        <h1 class="title">${safeTitle}</h1>
      </div>
      <div class="body-content">
        ${contentHtml}
        <div class="btn-container">
          <a href="${appUrl}" target="_blank" class="btn">${btnText}</a>
        </div>
      </div>
      <div class="footer">
        <p style="margin:0 0 6px;">Email được gửi tự động từ <strong style="color:#374151;">Ban Quản Trị Habit Mastery</strong>.</p>
        <p style="margin:0;">Rèn luyện thói quen • Thắp sáng kỷ luật • Thăng cấp tâm thức</p>
        <p style="margin:12px 0 0;"><a href="https://habitmastery.web.app">habitmastery.web.app</a> | Hỗ trợ: htmt.slh@gmail.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Đọc cấu hình Resend từ ENV / Firestore system_config (giống api/send-email.js)
async function resolveResendConfig(db) {
  let resolvedApiKey = process.env.RESEND_API_KEY || null;
  let storedConfig = {};

  try {
    let configDoc = await db.collection("system_config").doc("resend_email").get();
    if (!configDoc.exists) {
      configDoc = await db.collection("system_config").doc("resend").get();
    }
    if (configDoc.exists) {
      storedConfig = configDoc.data() || {};
      if (!resolvedApiKey && storedConfig.apiKey) {
        resolvedApiKey = storedConfig.apiKey;
      }
    }
  } catch (cfgErr) {
    console.warn("resolveResendConfig: could not read system_config:", cfgErr.message);
  }

  if (!resolvedApiKey) return null;

  const fromName = storedConfig.fromName || "Habit Mastery";
  const fromEmail = storedConfig.fromEmail || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const resolvedFrom = fromEmail.includes("<") ? fromEmail : `${fromName} <${fromEmail}>`;
  const resolvedReplyTo = storedConfig.replyTo || "htmt.slh@gmail.com";

  return {
    resend: new Resend(resolvedApiKey),
    resolvedFrom,
    resolvedReplyTo,
    fromName,
    fromEmail,
  };
}

async function sendBrandedEmail(cfg, { to, subject, preheader, contentHtml, ctaText, ctaUrl }) {
  const html = wrapEmailTemplate({ title: subject, preheader, contentHtml, ctaText, ctaUrl });
  return cfg.resend.emails.send({
    from: cfg.resolvedFrom,
    to: [to],
    reply_to: cfg.resolvedReplyTo,
    subject,
    html,
  });
}

module.exports = {
  getFirebaseAdmin,
  wrapEmailTemplate,
  resolveResendConfig,
  sendBrandedEmail,
};
