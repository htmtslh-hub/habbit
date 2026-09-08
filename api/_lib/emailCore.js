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

// Bọc nội dung email trong template thương hiệu Habit Mastery (giống hệt api/send-email.js)
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
  <title>${safeTitle}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #060912; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
    .wrapper { width: 100%; max-width: 620px; margin: 0 auto; padding: 32px 16px; box-sizing: border-box; }
    .card { background: linear-gradient(180deg, #162033 0%, #0d1527 100%); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
    .header { padding: 32px 28px 24px; text-align: center; border-bottom: 1px solid rgba(148, 163, 184, 0.12); background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 70%); }
    .logo-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); padding: 8px 18px; border-radius: 999px; color: #34d399; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; }
    .title { margin: 20px 0 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.35; letter-spacing: -0.5px; }
    .body-content { padding: 28px 30px; font-size: 15px; line-height: 1.7; color: #cbd5e1; }
    .body-content p { margin: 0 0 16px; }
    .body-content h2, .body-content h3 { color: #ffffff; margin: 22px 0 10px; }
    .body-content ul { padding-left: 20px; margin: 0 0 18px; }
    .body-content li { margin-bottom: 8px; }
    .highlight-box { background: rgba(59, 130, 246, 0.08); border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #93c5fd; }
    .gold-box { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #fcd34d; }
    .btn-container { text-align: center; margin: 30px 0 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); text-align: center; }
    .footer { padding: 24px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid rgba(148, 163, 184, 0.1); }
    .footer a { color: #94a3b8; text-decoration: underline; }
    .preheader-hidden { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }
  </style>
</head>
<body>
  <span class="preheader-hidden">${safePreheader}</span>
  <div class="wrapper">
    <div class="card">
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
        <p style="margin:0 0 6px;">Email được gửi tự động từ <strong>Ban Quản Trị Habit Mastery</strong>.</p>
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
