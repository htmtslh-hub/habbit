const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// ============================================================
// SEPAY WEBHOOK HANDLER
// Endpoint: POST /sepayWebhook
// SePay gửi POST request khi phát hiện giao dịch chuyển khoản
// ============================================================
exports.sepayWebhook = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // 1. Verify SePay Authentication
  const sepayKey = functions.config().sepay?.api_key || process.env.SEPAY_API_KEY;
  if (!sepayKey) {
    console.error("SEPAY_API_KEY not configured!");
    return res.status(500).json({ success: false, message: "Server misconfigured" });
  }

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
      const rawBody = req.rawBody ? req.rawBody.toString("utf8") : "";
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
      ip: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
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
    // Không phải giao dịch của Habit Mastery, bỏ qua
    return res.json({ success: true, message: "Not a Habit Mastery payment, ignored" });
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
      message: "Amount mismatch: expected " + expectedAmount + " but got " + receivedAmount,
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
    console.log(`User ${uid} upgraded to Premium (${plan}) via payment ${orderNumber}`);
  } else {
    console.error("User document not found:", uid);
  }

  // 8. Success response to SePay
  return res.json({
    success: true,
    message: `Payment ${orderNumber} confirmed, user ${uid} upgraded to ${plan}`,
  });
});
