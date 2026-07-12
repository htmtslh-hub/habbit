// ============================================================
// SEND OTP API — Vercel Serverless Function
// Endpoint: POST /api/send-otp
// Tạo mã OTP 6 số, lưu Firestore, gửi email qua Gmail SMTP
// ============================================================

const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin SDK (singleton)
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

// Gmail SMTP transporter (singleton)
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Email không hợp lệ" });
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const recentOtpsQuery = await db
      .collection("otp_codes")
      .where("email", "==", normalizedEmail)
      .get();

    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentOtps = recentOtpsQuery.docs.filter(doc => {
      const data = doc.data();
      return data.createdAt && data.createdAt.toDate().getTime() > tenMinutesAgo;
    });

    if (recentOtps.length >= 3) {
      return res.status(429).json({
        success: false,
        message: "Bạn đã gửi quá nhiều mã OTP. Vui lòng đợi 10 phút.",
      });
    }

    // ===== GENERATE & STORE OTP =====
    const otp = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    await db.collection("otp_codes").add({
      email: normalizedEmail,
      otp: otp,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      verified: false,
      used: false,
    });

    // ===== SEND EMAIL =====
    const mailTransporter = getTransporter();

    const mailOptions = {
      from: `"Habit Mastery" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "[Habit Mastery] Mã xác thực tài khoản",
      text: `Chào bạn,\n\nĐể hoàn tất đăng ký hoặc đăng nhập vào Habit Mastery, vui lòng sử dụng mã xác thực dưới đây:\n\n${otp}\n\nMã xác thực này có hiệu lực trong vòng 5 phút.\n\nNếu bạn không yêu cầu mã này, bạn có thể an toàn bỏ qua email này.\n\nTrân trọng,\nHabit Mastery Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0;">
          <div style="max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025); overflow: hidden;">
            <div style="padding: 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <h1 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">Habit Mastery</h1>
            </div>
            <div style="padding: 32px 24px;">
              <p style="font-size: 15px; line-height: 1.5; color: #1e293b; margin: 0 0 16px; font-weight: 600;">Xác thực tài khoản của bạn</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">Chào bạn, vui lòng sử dụng mã xác thực gồm 6 chữ số dưới đây để hoàn tất quá trình xác minh tại Habit Mastery:</p>
              <div style="text-align: center; margin: 28px 0;">
                <span style="display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; color: #0f172a; background-color: #f1f5f9; padding: 12px 28px; border-radius: 8px; letter-spacing: 6px; border: 1px solid #e2e8f0; text-indent: 6px;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 24px;">Mã này có hiệu lực trong vòng 5 phút. Để bảo mật tài khoản, vui lòng tuyệt đối không chia sẻ mã này với bất kỳ ai.</p>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;">
              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin: 0;">Email này được gửi tự động bởi hệ thống Habit Mastery. Nếu bạn không yêu cầu mã này, bạn có thể an tâm bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    console.log(`OTP sent to ${normalizedEmail}`);

    return res.json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn",
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Không thể gửi mã OTP. Vui lòng thử lại.",
    });
  }
};
