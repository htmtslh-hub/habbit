// ============================================================
// VERIFY OTP API — Vercel Serverless Function
// Endpoint: POST /api/verify-otp
// Kiểm tra mã OTP có khớp + chưa hết hạn
// ============================================================

const admin = require("firebase-admin");

function getDb() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey ? rawKey.replace(/\\n/g, "\n") : undefined;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin credentials not fully configured in environment variables.");
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return admin.firestore();
}

module.exports = async function handler(req, res) {
  // CORS with origin restriction
  const origin = req.headers.origin;
  const allowed = !origin || origin.endsWith(".web.app") || origin.endsWith(".vercel.app") || origin.includes("localhost");
  res.setHeader("Access-Control-Allow-Origin", allowed ? (origin || "https://habitmastery.web.app") : "https://habitmastery.web.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Thiếu email hoặc mã OTP",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOtp = otp.trim();

  // Validate OTP format (6 digits)
  if (!/^\d{6}$/.test(normalizedOtp)) {
    return res.status(400).json({
      success: false,
      message: "Mã OTP phải là 6 chữ số",
    });
  }

  try {
    const db = getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Hệ thống máy chủ chưa cấu hình xác thực OTP.",
      });
    }

    // ===== BRUTE FORCE PROTECTION =====
    // Max 5 failed attempts per email in 15 minutes
    const failedAttemptsQuery = await db
      .collection("otp_attempts")
      .where("email", "==", normalizedEmail)
      .where("success", "==", false)
      .get();

    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    const failedAttempts = failedAttemptsQuery.docs.filter(doc => {
      const data = doc.data();
      return data.attemptedAt && data.attemptedAt.toDate().getTime() > fifteenMinutesAgo;
    });

    if (failedAttempts.length >= 5) {
      return res.status(429).json({
        success: false,
        message: "Quá nhiều lần thử sai. Vui lòng đợi 15 phút.",
      });
    }

    // ===== FIND MATCHING OTP =====
    const now = new Date();
    const otpQuery = await db
      .collection("otp_codes")
      .where("email", "==", normalizedEmail)
      .where("otp", "==", normalizedOtp)
      .where("used", "==", false)
      .where("verified", "==", false)
      .get();

    if (otpQuery.empty) {
      // Log failed attempt
      await db.collection("otp_attempts").add({
        email: normalizedEmail,
        success: false,
        attemptedAt: admin.firestore.Timestamp.fromDate(now),
      });

      return res.status(400).json({
        success: false,
        message: "Mã OTP không đúng hoặc đã được sử dụng",
      });
    }

    // Sort in memory to get the latest one just in case
    const otpDocs = [...otpQuery.docs].sort((a, b) => {
      const timeA = a.data().createdAt ? a.data().createdAt.toDate().getTime() : 0;
      const timeB = b.data().createdAt ? b.data().createdAt.toDate().getTime() : 0;
      return timeB - timeA;
    });

    const otpDoc = otpDocs[0];
    const otpData = otpDoc.data();

    // ===== CHECK EXPIRY =====
    const expiresAt = otpData.expiresAt.toDate();
    if (now > expiresAt) {
      // Mark as used so it can't be tried again
      await otpDoc.ref.update({ used: true });

      // Log failed attempt
      await db.collection("otp_attempts").add({
        email: normalizedEmail,
        success: false,
        attemptedAt: admin.firestore.Timestamp.fromDate(now),
      });

      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn. Vui lòng gửi mã mới.",
        expired: true,
      });
    }

    // ===== SUCCESS: Mark OTP as verified & used =====
    await otpDoc.ref.update({
      verified: true,
      used: true,
      verifiedAt: admin.firestore.Timestamp.fromDate(now),
    });

    // Log successful attempt
    await db.collection("otp_attempts").add({
      email: normalizedEmail,
      success: true,
      attemptedAt: admin.firestore.Timestamp.fromDate(now),
    });

    console.log(`OTP verified for ${normalizedEmail}`);

    return res.json({
      success: true,
      message: "Xác minh thành công!",
      verified: true,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác minh: " + (err.message || "Vui lòng thử lại."),
    });
  }
};
