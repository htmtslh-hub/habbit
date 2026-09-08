// ============================================================
// SEPAY WEBHOOK HANDLER — Vercel Serverless Function
// Endpoint: POST /api/sepayWebhook
// SePay gửi POST request khi phát hiện giao dịch chuyển khoản
// ============================================================

const admin = require("firebase-admin");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const crypto = require("crypto");
const { resolveResendConfig, sendBrandedEmail } = require("./_lib/emailCore");
const { sendSystemMessage } = require("./_lib/systemMessage");

// Initialize Firebase Admin SDK (chỉ khởi tạo 1 lần)
if (!admin.getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  admin.initializeApp({
    credential: admin.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

// Helper to buffer the request body stream
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(body));
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key, x-sepay-signature, x-sepay-timestamp"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // 1. Verify SePay Authentication
  const sepayKey = process.env.SEPAY_API_KEY;
  if (!sepayKey) {
    console.error("SEPAY_API_KEY not configured!");
    return res.status(500).json({ success: false, message: "Server misconfigured" });
  }

  // Buffer and read raw body (required for HMAC signature verification)
  let rawBodyBuffer;
  try {
    rawBodyBuffer = await getRawBody(req);
  } catch (err) {
    console.error("Error reading raw body:", err);
    return res.status(400).json({ success: false, message: "Error reading request body" });
  }

  const rawBody = rawBodyBuffer.toString("utf8");

  // Parse raw body to JSON
  let body = {};
  if (rawBody) {
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error("Error parsing JSON body:", err, "Raw body was:", rawBody);
      return res.status(400).json({ success: false, message: "Invalid JSON body" });
    }
  }
  req.body = body; // Keep backward compatibility for subsequent code

  const signatureHeader = req.headers["x-sepay-signature"];
  const timestampHeader = req.headers["x-sepay-timestamp"];

  let isAuthenticated = false;
  let authMethodAttempted = "none";
  let incomingKeyForLog = "none";

  const maskKey = (key) => {
    if (!key) return "undefined/empty";
    if (key.length <= 6) return "***";
    return `${key.slice(0, 3)}...${key.slice(-3)} (len: ${key.length})`;
  };

  if (signatureHeader && timestampHeader) {
    authMethodAttempted = "signature";
    // Perform HMAC-SHA256 signature verification
    try {
      const dataToSign = `${timestampHeader}.${rawBody}`;
      const hmac = crypto.createHmac("sha256", sepayKey);
      hmac.update(dataToSign);
      const computedHash = hmac.digest("hex");
      
      // SePay signature can be "sha256={hash}" or just "{hash}"
      let receivedHash = signatureHeader;
      if (receivedHash.toLowerCase().startsWith("sha256=")) {
        receivedHash = receivedHash.slice(7);
      }

      if (
        receivedHash.length === computedHash.length &&
        crypto.timingSafeEqual(
          Buffer.from(receivedHash, "utf8"),
          Buffer.from(computedHash, "utf8")
        )
      ) {
        isAuthenticated = true;
      } else {
        console.warn("Signature verification failed.", {
          receivedHashMasked: maskKey(receivedHash),
          computedHashMasked: maskKey(computedHash),
          configuredKeyMasked: maskKey(sepayKey),
          timestampHeader,
        });
      }
    } catch (err) {
      console.error("Error verifying signature:", err);
    }
  } else {
    authMethodAttempted = "api-key";
    // Fallback to static API key verification
    let incomingKey = req.headers["authorization"];
    if (incomingKey) {
      incomingKey = incomingKey.trim();
      const parts = incomingKey.split(/\s+/);
      if (parts.length === 2 && (parts[0].toLowerCase() === "bearer" || parts[0].toLowerCase() === "apikey")) {
        incomingKey = parts[1];
      }
    } else {
      incomingKey = req.headers["x-api-key"] || req.query?.api_key;
    }

    incomingKeyForLog = incomingKey;

    if (incomingKey && incomingKey === sepayKey) {
      isAuthenticated = true;
    } else {
      console.warn("API Key comparison failed.", {
        incomingKeyMasked: maskKey(incomingKey),
        expectedKeyMasked: maskKey(sepayKey),
      });
    }
  }

  if (!isAuthenticated) {
    console.warn("Unauthorized webhook attempt:", {
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      headers: Object.keys(req.headers),
      authMethodAttempted,
    });
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      diagnostics: {
        authMethod: authMethodAttempted,
        configuredKeyConfigured: !!sepayKey,
      }
    });
  }

  // 2. Parse transaction data from SePay
  const {
    transferAmount,
    content,
    transactionDate,
    referenceCode,
    id: transactionId,
    gateway,
    accountNumber,
  } = req.body;

  console.log("SePay webhook received:", {
    transferAmount,
    content,
    transactionDate,
    referenceCode,
    transactionId,
  });

  if (!content || !transferAmount) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: content, transferAmount",
    });
  }

  // 3. Extract order number from transfer content
  // Format: "SEVQR HBTxxxxxxxxxx" hoặc chứa "HBTxxxxxxxxxx"
  // Remove all spaces to handle manual typing or bank spacing discrepancies, then match HBT followed by exactly 13 digits of Date.now()
  const cleanContent = content.replace(/\s+/g, "");
  const match = cleanContent.match(/HBT\d{13}/i);
  if (!match) {
    console.warn("No order number found in content:", content);
    return res.json({
      success: true,
      message: "Not a Habit Mastery payment, ignored",
    });
  }

  const orderNumber = match[0].toUpperCase();
  console.log("Order number extracted:", orderNumber);

  // 4. Find payment order in Firestore
  const paymentsRef = db.collection("payments");
  const snapshot = await paymentsRef
    .where("orderNumber", "==", orderNumber)
    .where("status", "==", "pending")
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.warn("No pending payment found for order:", orderNumber);
    return res.json({
      success: false,
      message: "No pending payment found for " + orderNumber,
    });
  }

  const paymentDoc = snapshot.docs[0];
  const paymentData = paymentDoc.data();

  // 5. Verify amount matches (cho phép sai lệch ±1000đ do phí)
  const expectedAmount = paymentData.amount;
  const receivedAmount = parseInt(transferAmount, 10);
  const tolerance = 1000; // 1,000 VND tolerance

  if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
    console.warn("Amount mismatch!", {
      expected: expectedAmount,
      received: receivedAmount,
      order: orderNumber,
    });

    // Vẫn ghi nhận giao dịch nhưng đánh dấu amount_mismatch
    await paymentDoc.ref.update({
      status: "amount_mismatch",
      receivedAmount: receivedAmount,
      transactionId: transactionId || null,
      transactionDate: transactionDate || null,
      gateway: gateway || null,
      webhookReceivedAt: FieldValue.serverTimestamp(),
    });

    return res.json({
      success: false,
      message:
        "Amount mismatch: expected " +
        expectedAmount +
        " but got " +
        receivedAmount,
    });
  }

  // 6. Update payment status → paid
  const now = FieldValue.serverTimestamp();
  await paymentDoc.ref.update({
    status: "paid",
    receivedAmount: receivedAmount,
    transactionId: transactionId || null,
    referenceCode: referenceCode || null,
    transactionDate: transactionDate || null,
    gateway: gateway || null,
    paidAt: now,
    webhookReceivedAt: now,
  });

  // 7. Upgrade user to Premium
  const uid = paymentData.uid;
  const plan = paymentData.plan; // "monthly" or "yearly"

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const planUpdates = {
      plan: "premium",
      planUpdatedAt: now,
      upgradeRequested: false,
      upgradeApprovedAt: now,
      lastPaymentOrderNumber: orderNumber,
    };

    // Set plan expiration
    const startDate = new Date();
    if (plan === "monthly") {
      const expires = new Date(startDate);
      expires.setMonth(expires.getMonth() + 1);
      planUpdates.planExpiresAt = Timestamp.fromDate(expires);
    } else if (plan === "yearly") {
      const expires = new Date(startDate);
      expires.setFullYear(expires.getFullYear() + 1);
      planUpdates.planExpiresAt = Timestamp.fromDate(expires);
    }

    await userRef.update(planUpdates);
    console.log(
      `User ${uid} upgraded to Premium (${plan}) via payment ${orderNumber}`
    );

    // 7b. Gửi chúc mừng kích hoạt VIP (email + tin nhắn trong app) — không
    // để lỗi ở bước này làm hỏng phản hồi xác nhận thanh toán cho SePay.
    try {
      const uData = userDoc.data() || {};
      const name = uData.displayName || (uData.email || "").split("@")[0] || "Chiến binh kỷ luật";
      const planLabel = plan === "yearly" ? "Premium (1 năm)" : "Premium (1 tháng)";
      const expiresStr = planUpdates.planExpiresAt
        ? planUpdates.planExpiresAt.toDate().toLocaleDateString("vi-VN")
        : "Vĩnh viễn";

      const subject = "🎉 Chúc mừng! Tài khoản của bạn đã được kích hoạt Premium";
      const contentHtml = `<p>Xin chào <strong>${name}</strong>,</p>
        <p>Thanh toán của bạn đã được xác nhận thành công! Tài khoản Habit Mastery của bạn vừa được nâng cấp lên <strong>${planLabel}</strong>.</p>
        <div class="highlight-box">
          👑 <strong>Gói:</strong> ${planLabel}<br>
          📅 <strong>Hiệu lực đến:</strong> ${expiresStr}<br>
          🧾 <strong>Mã đơn hàng:</strong> ${orderNumber}
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
            ctaUrl: "https://habitmastery.web.app",
          });
        }
      }
      await sendSystemMessage(db, FieldValue, uid, uData, inAppText);
    } catch (notifyErr) {
      console.error("Could not send VIP activation notification:", notifyErr.message);
    }
  } else {
    console.error("User document not found:", uid);
  }

  // 8. Success response to SePay
  return res.json({
    success: true,
    message: `Payment ${orderNumber} confirmed, user ${uid} upgraded to ${plan}`,
  });
};

// Export config to disable Vercel's default body parsing
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
