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
    // ===== RATE LIMITING =====
    // Max 3 OTP per email in 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await db
      .collection("otp_codes")
      .where("email", "==", normalizedEmail)
      .where("createdAt", ">", admin.firestore.Timestamp.fromDate(tenMinutesAgo))
      .get();

    if (recentOtps.size >= 3) {
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
      subject: "🔐 Mã xác minh Habit Mastery - " + otp,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#0a0a1a;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a1a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#111128 0%,#0d1b2a 100%);border-radius:16px;border:1px solid rgba(0,245,160,0.15);overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px 20px;text-align:center;background:linear-gradient(135deg,rgba(0,245,160,0.08) 0%,rgba(0,217,245,0.05) 100%);">
                      <div style="font-size:40px;margin-bottom:8px;">✦</div>
                      <h1 style="color:#00f5a0;font-size:22px;font-weight:800;letter-spacing:3px;margin:0;">HABIT MASTERY</h1>
                      <p style="color:#8b8baf;font-size:13px;margin:8px 0 0;">Xác minh tài khoản</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:30px 40px;">
                      <p style="color:#f0f0ff;font-size:15px;line-height:1.6;margin:0 0 24px;">
                        Xin chào! 👋<br><br>
                        Mã xác minh của bạn là:
                      </p>
                      <!-- OTP Code -->
                      <div style="text-align:center;margin:0 0 24px;">
                        <div style="display:inline-block;background:rgba(0,245,160,0.08);border:2px solid rgba(0,245,160,0.3);border-radius:12px;padding:16px 32px;letter-spacing:12px;font-size:36px;font-weight:900;color:#00f5a0;font-family:'Courier New',monospace;">
                          ${otp}
                        </div>
                      </div>
                      <p style="color:#8b8baf;font-size:13px;line-height:1.6;margin:0 0 8px;">
                        ⏱️ Mã có hiệu lực trong <strong style="color:#f0f0ff;">5 phút</strong>
                      </p>
                      <p style="color:#5a5a7a;font-size:12px;line-height:1.6;margin:0;">
                        Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
                      <p style="color:#5a5a7a;font-size:11px;margin:0;">
                        © 2026 Habit Mastery. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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
