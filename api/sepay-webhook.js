// ============================================================
// SEPAY WEBHOOK HANDLER — Vercel Serverless Function
// Endpoint: POST /api/sepayWebhook
// SePay gửi POST request khi phát hiện giao dịch chuyển khoản
// ============================================================

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (chỉ khởi tạo 1 lần)
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

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // 1. Verify SePay API Key
  const sepayKey = process.env.SEPAY_API_KEY;
  const incomingKey =
    req.headers["authorization"]?.replace("Bearer ", "") ||
    req.headers["x-api-key"] ||
    req.query.api_key;

  if (!sepayKey) {
    console.error("SEPAY_API_KEY not configured!");
    return res.status(500).json({ success: false, message: "Server misconfigured" });
  }

  if (incomingKey !== sepayKey) {
    console.warn("Unauthorized webhook attempt:", {
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      headers: Object.keys(req.headers),
    });
    return res.status(401).json({ success: false, message: "Unauthorized" });
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
  const match = content.match(/HBT\d{10,}/i);
  if (!match) {
    console.warn("No order number found in content:", content);
    return res.json({
      success: true,
      message: "Not a Habit Tracker payment, ignored",
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
      webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  const now = admin.firestore.FieldValue.serverTimestamp();
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
      planUpdates.planExpiresAt = admin.firestore.Timestamp.fromDate(expires);
    } else if (plan === "yearly") {
      const expires = new Date(startDate);
      expires.setFullYear(expires.getFullYear() + 1);
      planUpdates.planExpiresAt = admin.firestore.Timestamp.fromDate(expires);
    }

    await userRef.update(planUpdates);
    console.log(
      `User ${uid} upgraded to Premium (${plan}) via payment ${orderNumber}`
    );
  } else {
    console.error("User document not found:", uid);
  }

  // 8. Success response to SePay
  return res.json({
    success: true,
    message: `Payment ${orderNumber} confirmed, user ${uid} upgraded to ${plan}`,
  });
};
