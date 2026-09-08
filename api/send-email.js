// ============================================================
// SEND EMAIL API (RESEND) — Vercel Serverless Function
// Endpoint: POST /api/send-email
// Hỗ trợ gửi email qua Resend API: đơn lẻ, theo nhóm, kiểm tra kết nối
// ============================================================

const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
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
      credential: admin.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return { firestore: getFirestore, auth: getAuth };
}

// Template email dùng chung với cron nhắc nhở & webhook VIP — định nghĩa duy
// nhất ở api/_lib/emailCore.js để 2 nơi không bị lệch thiết kế theo thời gian.
const { wrapEmailTemplate } = require("./_lib/emailCore");

// Replace template variables - supports both {var} and {{var}}
function interpolateVariables(text, vars = {}) {
  if (!text) return "";
  let result = text;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`\\{+\\s*${key}\\s*\\}+`, "g");
    result = result.replace(regex, val !== undefined && val !== null ? String(val) : "");
  }
  return result;
}

module.exports = async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin;
  const allowed = !origin || origin.endsWith(".web.app") || origin.endsWith(".vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("habit-mastery.com");
  res.setHeader("Access-Control-Allow-Origin", allowed ? (origin || "*") : "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const fb = getFirebaseAdmin();
  if (!fb) {
    return res.status(500).json({
      success: false,
      message: "Máy chủ chưa cấu hình Firebase Admin SDK trong biến môi trường.",
    });
  }

  const db = fb.firestore();

  // 1. Verify Admin Authentication via Bearer token
  let adminUid = null;
  let adminEmail = null;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (token) {
    try {
      const decoded = await fb.auth().verifyIdToken(token);
      adminUid = decoded.uid;
      adminEmail = decoded.email;

      // Verify Admin role in Firestore
      const userDoc = await db.collection("users").doc(adminUid).get();
      if (!userDoc.exists || userDoc.data().role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Quyền truy cập bị từ chối. Tài khoản của bạn không phải Quản trị viên (Admin).",
        });
      }
    } catch (authErr) {
      console.error("Token verification failed:", authErr.message);
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng tải lại trang và đăng nhập lại.",
      });
    }
  } else {
    // If no token, check if client provided valid admin secret or return 401
    return res.status(401).json({
      success: false,
      message: "Thiếu mã xác thực (Authorization Bearer Token).",
    });
  }

  const body = req.body || {};
  const sendOpts = body.sendOptions || {};

  const action = body.action || "send";
  const providedApiKey = body.apiKey || sendOpts.apiKey || null;
  const providedFromName = body.fromName || sendOpts.fromName || null;
  const providedFromEmail = body.fromEmail || sendOpts.fromEmail || null;
  const replyTo = body.replyTo || sendOpts.replyTo || null;
  const recipients = body.recipients || [];
  const subject = body.subject || "";
  const preheader = body.preheader || "";
  const contentHtml = body.contentHtml || body.content || "";
  const ctaText = body.ctaText || "Mở Ứng Dụng Ngay →";
  const ctaUrl = body.ctaUrl || "https://habitmastery.web.app";
  const templateId = body.templateId || "custom";
  const rawHtml = Boolean(body.rawHtml);

  // 2. Resolve Resend API Key: ENV -> Firestore system_config/resend_email -> Firestore system_config/resend -> req.body
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
    console.warn("Could not read system_config/resend_email:", cfgErr.message);
  }

  if (providedApiKey && typeof providedApiKey === "string" && providedApiKey.trim().length > 5) {
    resolvedApiKey = providedApiKey.trim();
  }

  if (!resolvedApiKey) {
    return res.status(400).json({
      success: false,
      message: "Chưa cấu hình Resend API Key! Vui lòng nhập API Key dạng 're_...' trong phần Cấu hình Resend hoặc thiết lập biến môi trường RESEND_API_KEY trên Vercel.",
      needConfig: true,
    });
  }

  // 3. Resolve Sender Address
  // Format: "Sender Name <email@domain.com>"
  const defaultFromName = providedFromName || storedConfig.fromName || "Habit Mastery";
  const defaultFromEmail = providedFromEmail || storedConfig.fromEmail || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const resolvedFrom = defaultFromEmail.includes("<")
    ? defaultFromEmail
    : `${defaultFromName} <${defaultFromEmail}>`;

  const resolvedReplyTo = replyTo || storedConfig.replyTo || "htmt.slh@gmail.com";

  // Instantiate Resend client
  const resend = new Resend(resolvedApiKey);

  // ACTION: TEST CONNECTION
  if (action === "test_connection") {
    const targetEmail = (req.body.testEmail || adminEmail || defaultFromEmail).trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Email nhận kiểm tra không hợp lệ." });
    }

    try {
      const testHtml = wrapEmailTemplate({
        title: "⚡ Kiểm tra kết nối Resend thành công!",
        preheader: "Hệ thống email Resend của Habit Mastery đã hoạt động chuẩn xác.",
        contentHtml: `
          <p>Xin chào <strong>${adminEmail || "Quản trị viên"}</strong>,</p>
          <p>Đây là email kiểm tra được gửi tự động từ <strong>Habit Mastery Admin Dashboard</strong> thông qua dịch vụ <strong>Resend API</strong>.</p>
          <div class="highlight-box">
            ✅ <strong>Trạng thái kết nối:</strong> Hoạt động hoàn hảo<br>
            🔑 <strong>API Key:</strong> ${resolvedApiKey.substring(0, 6)}...${resolvedApiKey.substring(resolvedApiKey.length - 4)}<br>
            📤 <strong>Người gửi (From):</strong> ${resolvedFrom}<br>
            🕒 <strong>Thời gian kiểm tra:</strong> ${new Date().toLocaleString("vi-VN")}
          </div>
          <p>Giờ đây bạn có thể gửi email thông báo, kích hoạt VIP, và chăm sóc người dùng một cách chuyên nghiệp.</p>
        `,
        ctaText: "Vào Bảng Quản Trị →",
        ctaUrl: "https://habitmastery.web.app/admin.html",
      });

      const sendResult = await resend.emails.send({
        from: resolvedFrom,
        to: [targetEmail],
        reply_to: resolvedReplyTo,
        subject: "⚡ [Habit Mastery] Kiểm tra kết nối Email Resend thành công",
        html: testHtml,
      });

      if (sendResult.error) {
        return res.status(400).json({
          success: false,
          message: "Resend trả về lỗi: " + (sendResult.error.message || JSON.stringify(sendResult.error)),
          error: sendResult.error,
        });
      }

      // Log test email
      await db.collection("email_logs").add({
        type: "test",
        templateId: "test_connection",
        subject: "⚡ [Habit Mastery] Kiểm tra kết nối Email Resend thành công",
        from: resolvedFrom,
        recipients: [targetEmail],
        recipientCount: 1,
        status: "success",
        resendId: sendResult.data?.id || null,
        sentBy: adminEmail,
        adminUid,
        createdAt: FieldValue.serverTimestamp(),
      });

      return res.json({
        success: true,
        message: `Đã gửi email kiểm tra thành công tới ${targetEmail}!`,
        id: sendResult.data?.id,
      });
    } catch (testErr) {
      console.error("Test connection error:", testErr);
      return res.status(500).json({
        success: false,
        message: "Lỗi kết nối Resend: " + (testErr.message || "Unknown error"),
      });
    }
  }

  // ACTION: SEND CAMPAIGN / BATCH EMAILS
  if (!subject.trim()) {
    return res.status(400).json({ success: false, message: "Tiêu đề email (Subject) không được để trống." });
  }

  if (!contentHtml.trim()) {
    return res.status(400).json({ success: false, message: "Nội dung email không được để trống." });
  }

  // Normalize recipients list
  let recipientList = [];
  if (Array.isArray(recipients)) {
    recipientList = recipients.map(r => {
      if (typeof r === "string") return { email: r.trim().toLowerCase(), name: r.split("@")[0] };
      return {
        email: (r.email || "").trim().toLowerCase(),
        name: r.name || r.displayName || (r.email || "").split("@")[0] || "Chiến binh kỷ luật",
        plan: r.plan || "free",
        dp: r.dp || 0,
        streak: r.streak || 0,
      };
    }).filter(r => r.email && r.email.includes("@"));
  } else if (typeof recipients === "string" && recipients.includes("@")) {
    recipientList = [{
      email: recipients.trim().toLowerCase(),
      name: recipients.split("@")[0],
      plan: "free",
      dp: 0,
    }];
  }

  if (recipientList.length === 0) {
    return res.status(400).json({ success: false, message: "Không tìm thấy người nhận hợp lệ." });
  }

  // Limit per request to prevent serverless function timeout (max 100 per call)
  const MAX_RECIPIENTS = 100;
  if (recipientList.length > MAX_RECIPIENTS) {
    return res.status(400).json({
      success: false,
      message: `Mỗi đợt gửi tối đa ${MAX_RECIPIENTS} email để đảm bảo tốc độ và tránh timeout serverless. Danh sách hiện tại có ${recipientList.length} người nhận.`,
    });
  }

  const results = [];
  let sentCount = 0;
  let failedCount = 0;

  // Process sending in batches of 5 concurrent requests
  const CHUNK_SIZE = 5;
  for (let i = 0; i < recipientList.length; i += CHUNK_SIZE) {
    const chunk = recipientList.slice(i, i + CHUNK_SIZE);
    const promises = chunk.map(async (rcp) => {
      const vars = {
        name: rcp.name || "Chiến binh kỷ luật",
        email: rcp.email,
        plan: rcp.plan === "premium" ? "👑 Premium" : rcp.plan === "trial" ? "⏳ Trial" : "🌱 Free",
        dp: rcp.dp || 0,
        streak: rcp.streak || 0,
        app_url: ctaUrl || "https://habitmastery.web.app",
      };

      const personalizedSubject = interpolateVariables(subject, vars);
      const personalizedPreheader = interpolateVariables(preheader, vars);
      const personalizedBody = interpolateVariables(contentHtml, vars);

      const finalHtml = rawHtml
        ? personalizedBody
        : wrapEmailTemplate({
            title: personalizedSubject,
            preheader: personalizedPreheader,
            contentHtml: personalizedBody,
            ctaText,
            ctaUrl,
          });

      try {
        const sendResult = await resend.emails.send({
          from: resolvedFrom,
          to: [rcp.email],
          reply_to: resolvedReplyTo,
          subject: personalizedSubject,
          html: finalHtml,
        });

        if (sendResult.error) {
          failedCount++;
          return {
            email: rcp.email,
            success: false,
            error: sendResult.error.message || JSON.stringify(sendResult.error),
          };
        }

        sentCount++;
        return {
          email: rcp.email,
          success: true,
          id: sendResult.data?.id,
        };
      } catch (err) {
        failedCount++;
        return {
          email: rcp.email,
          success: false,
          error: err.message || "Lỗi không xác định",
        };
      }
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  }

  const overallStatus = failedCount === 0 ? "success" : sentCount > 0 ? "partial" : "failed";

  // Log dispatch to Firestore
  try {
    await db.collection("email_logs").add({
      type: "campaign",
      templateId,
      subject,
      from: resolvedFrom,
      fromName: defaultFromName,
      fromEmail: defaultFromEmail,
      recipientCount: recipientList.length,
      totalRecipients: recipientList.length,
      sentCount,
      successCount: sentCount,
      failedCount,
      status: overallStatus,
      recipients: recipientList.slice(0, 50).map(r => ({ email: r.email, name: r.name })),
      sampleResults: results.slice(0, 20),
      results: results.slice(0, 50),
      sentBy: adminEmail,
      sentByEmail: adminEmail,
      adminUid,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (logErr) {
    console.error("Could not record email log to Firestore:", logErr.message);
  }

  return res.json({
    success: sentCount > 0,
    status: overallStatus,
    sentCount,
    successCount: sentCount,
    failedCount,
    total: recipientList.length,
    totalRecipients: recipientList.length,
    summary: {
      totalRecipients: recipientList.length,
      successCount: sentCount,
      failedCount: failedCount
    },
    results,
    message: failedCount === 0
      ? `Đã gửi thành công ${sentCount} email!`
      : `Đã gửi ${sentCount}/${recipientList.length} email (${failedCount} thất bại). Xem chi tiết kết quả.`,
  });
};
