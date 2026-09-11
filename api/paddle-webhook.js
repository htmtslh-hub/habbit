// ============================================================
// PADDLE WEBHOOK HANDLER — Vercel Serverless Function
// Endpoint: POST /api/paddle-webhook
//
// Paddle gọi endpoint này khi có giao dịch hoàn tất hoặc hoàn tiền.
// Việc cấp gói dùng chung `_lib/grantPremium.js` với webhook SePay để
// hai cổng không bao giờ tính hạn khác nhau.
//
// HỢP ĐỒNG GIAO NHẬN CỦA PADDLE — quyết định toàn bộ thiết kế bên dưới:
//   • CHỈ mã 2xx trong vòng 5 giây mới được tính là đã nhận. Mọi mã khác
//     (400, 401, 500, chuyển hướng, timeout) đều bị coi là thất bại và
//     Paddle sẽ gửi lại. Không có mã nào nghĩa là "đừng gửi nữa".
//   • Sandbox gửi lại 3 lần trong ~15 phút. Live gửi lại 60 lần trong
//     ~3 ngày. Hết ngần ấy lượt mà vẫn lỗi thì sự kiện MẤT HẲN.
//   • Mỗi lần gửi lại đều mang ĐÚNG `event_id` cũ -> đó là khoá chống trùng.
//
// Vì vậy: lỗi tạm thời thì trả về 5xx để Paddle thử lại; xử lý xong xuôi
// thì luôn trả 200 kể cả khi sự kiện không liên quan tới mình.
// ============================================================

const admin = require("firebase-admin");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const crypto = require("crypto");
const { grantPremium, PLAN_SPECS } = require("./_lib/grantPremium");

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

// Cửa sổ chấp nhận chênh lệch thời gian của chữ ký.
//
// Tài liệu Paddle nói mặc định là 5 GIÂY. Con số đó quá hẹp cho hàm
// serverless: cold start cộng với lệch đồng hồ giữa hai máy dễ vượt 5s,
// và khi ấy MỌI webhook đều bị từ chối — gửi lại cũng hỏng nốt vì lệch
// đồng hồ không tự hết. Hỏng kiểu này im lặng và mất tiền thật.
// 5 phút vẫn chặn được tấn công phát lại (kẻ tấn công phải có chữ ký
// hợp lệ chưa quá 5 phút) mà không tự bắn vào chân mình.
const SIGNATURE_TOLERANCE_SECONDS = Number(process.env.PADDLE_SIGNATURE_TOLERANCE || 300);

// Chặn IP là lớp phòng thủ THỨ HAI, không phải lớp chính — chữ ký HMAC
// mới là thứ thực sự bảo vệ endpoint này. Bật chặn sai thì webhook hợp lệ
// bị vứt và tiền đã thu mà gói không được cấp, nên mặc định chỉ GHI LOG.
// Xem log thấy IP khớp đều đặn rồi hãy đặt PADDLE_ENFORCE_IP=true.
const ENFORCE_IP = String(process.env.PADDLE_ENFORCE_IP || "").toLowerCase() === "true";
// Sandbox va live dung HAI dai IP khac nhau, o hai endpoint khac nhau.
// Lay hop cua ca hai: nho vay viec chan IP chay dung o ca hai moi truong
// ma khong phu thuoc vao viec dat dung mot bien moi truong — dat sai bien
// se chan sach webhook that, tuc la thu tien roi khong cap goi.
const PADDLE_IPS_URLS = [
  "https://api.paddle.com/ips",
  "https://sandbox-api.paddle.com/ips",
];
const IP_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 tiếng

let ipCache = { cidrs: null, fetchedAt: 0 };

/** Đọc toàn bộ body ở dạng thô. BẮT BUỘC cho việc xác thực chữ ký:
 *  chỉ cần JSON.parse rồi stringify lại là chữ ký sai ngay. */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Lấy danh sách dải IP hiện hành của Paddle. Không hard-code vì Paddle
 *  có thể đổi bất cứ lúc nào — endpoint kia mới là nguồn đúng. */
async function getPaddleCidrs() {
  const now = Date.now();
  if (ipCache.cidrs && now - ipCache.fetchedAt < IP_CACHE_TTL_MS) {
    return ipCache.cidrs;
  }
  const collected = [];
  const errors = [];

  // Goi song song; mot endpoint sap thi van dung duoc danh sach con lai.
  const results = await Promise.allSettled(
    PADDLE_IPS_URLS.map(async (url) => {
      const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!resp.ok) throw new Error(url + " -> HTTP " + resp.status);
      const json = await resp.json();
      const cidrs = json && json.data && json.data.ipv4_cidrs;
      if (!Array.isArray(cidrs) || cidrs.length === 0) {
        throw new Error(url + " -> danh sach rong");
      }
      return cidrs;
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled") collected.push(...r.value);
    else errors.push(r.reason && r.reason.message ? r.reason.message : String(r.reason));
  }

  if (errors.length) {
    console.warn("paddle-webhook: khong lay duoc mot phan danh sach IP:", errors.join(" | "));
  }

  if (collected.length === 0) {
    // Khong lay duoc gi: dung cache cu neu co, khong co thi tra null de BO QUA
    // buoc nay. Endpoint IP cua Paddle sap khong phai ly do de ngung nhan tien
    // — chu ky van dang canh cua.
    return ipCache.cidrs;
  }

  const cidrs = Array.from(new Set(collected));
  ipCache = { cidrs, fetchedAt: now };
  return cidrs;
}

function ipv4ToInt(ip) {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = (n << 8) | v;
  }
  return n >>> 0;
}

function ipInCidrs(ip, cidrs) {
  const addr = ipv4ToInt(ip);
  if (addr === null) return false;
  for (const cidr of cidrs) {
    const [base, bitsRaw] = cidr.split("/");
    const baseInt = ipv4ToInt(base);
    if (baseInt === null) continue;
    const bits = bitsRaw === undefined ? 32 : Number(bitsRaw);
    if (!Number.isInteger(bits) || bits < 0 || bits > 32) continue;
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    if ((addr & mask) >>> 0 === (baseInt & mask) >>> 0) return true;
  }
  return false;
}

/** IP thật của bên gọi. Vercel đứng sau proxy nên x-forwarded-for là một
 *  chuỗi, phần tử ĐẦU mới là client gốc. */
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  if (Array.isArray(xff) && xff.length) return String(xff[0]).split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

/** Xác thực header `Paddle-Signature: ts=<unix>;h1=<hex>`.
 *  Chuỗi được ký là `<ts>:<raw body>`, HMAC-SHA256 bằng secret của
 *  notification destination (dạng `pdl_ntfset_...`). */
function verifySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || typeof signatureHeader !== "string") {
    return { ok: false, reason: "thiếu header chữ ký" };
  }

  let ts = null;
  let h1 = null;
  for (const part of signatureHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === "ts") ts = v;
    else if (k === "h1") h1 = v;
  }

  if (!ts || !h1) return { ok: false, reason: "header chữ ký sai định dạng" };

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false, reason: "timestamp không hợp lệ" };

  const ageSeconds = Math.abs(Date.now() / 1000 - tsNum);
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, reason: `timestamp lệch ${Math.round(ageSeconds)}s` };
  }

  const computed = crypto
    .createHmac("sha256", secret)
    .update(`${ts}:${rawBody}`, "utf8")
    .digest("hex");

  // timingSafeEqual ném lỗi nếu hai buffer khác độ dài -> kiểm tra trước.
  if (computed.length !== h1.length) return { ok: false, reason: "chữ ký không khớp" };
  const match = crypto.timingSafeEqual(
    Buffer.from(computed, "utf8"),
    Buffer.from(h1, "utf8")
  );
  return match ? { ok: true } : { ok: false, reason: "chữ ký không khớp" };
}

/** Tìm ra gói ("monthly" | "yearly") của một giao dịch.
 *  Thứ tự ưu tiên: custom_data của giao dịch (do checkout truyền lên) ->
 *  custom_data của price trong catalog -> biến môi trường ánh xạ price ID. */
function resolvePlan(data) {
  const direct = data?.custom_data?.plan;
  if (direct && PLAN_SPECS[direct]) return direct;

  const envMap = {
    [process.env.PADDLE_PRICE_MONTHLY || "__none_m"]: "monthly",
    [process.env.PADDLE_PRICE_YEARLY || "__none_y"]: "yearly",
  };

  for (const item of data?.items || []) {
    const fromPrice = item?.price?.custom_data?.plan;
    if (fromPrice && PLAN_SPECS[fromPrice]) return fromPrice;

    const priceId = item?.price?.id || item?.price_id;
    if (priceId && envMap[priceId]) return envMap[priceId];
  }
  return null;
}

/** Giao dịch hoàn tất -> cấp gói. */
async function handleTransactionCompleted(data) {
  const uid = data?.custom_data?.uid;
  const plan = resolvePlan(data);
  const orderNumber = data?.id || null;

  if (!uid) {
    // Không có uid thì không biết cấp cho ai. Đây là lỗi ở phía checkout
    // (quên truyền customData), không phải lỗi của Paddle — gửi lại cũng
    // không cứu được, nên ghi log rồi ack để khỏi nghẽn hàng đợi.
    console.error("paddle-webhook: giao dịch thiếu custom_data.uid:", orderNumber);
    return { handled: false, reason: "missing_uid" };
  }
  if (!plan) {
    console.error("paddle-webhook: không xác định được gói cho giao dịch:", orderNumber);
    return { handled: false, reason: "unknown_plan" };
  }

  const result = await grantPremium(db, FieldValue, Timestamp, {
    uid,
    plan,
    orderNumber,
    provider: "paddle",
  });

  if (!result.ok) {
    // user_not_found là dữ liệu sai, gửi lại không giúp gì.
    if (result.reason === "user_not_found") {
      console.error("paddle-webhook: không tìm thấy user", uid, "cho đơn", orderNumber);
      return { handled: false, reason: result.reason };
    }
    throw new Error("grantPremium thất bại: " + result.reason);
  }

  return { handled: true, uid, plan, expiresAt: result.expiresAt };
}

/** Hoàn tiền -> hạ về gói Miễn phí.
 *  `refund.html` đã hứa hoàn đầy đủ trong 14 ngày, nên phần này bắt buộc
 *  phải có, nếu không người được hoàn tiền vẫn giữ nguyên quyền Premium. */
async function handleRefund(data) {
  if (data?.action !== "refund") return { handled: false, reason: "not_a_refund" };
  // Live phải duyệt tay nên trạng thái ban đầu có thể là "pending_approval";
  // chỉ hạ cấp khi đã thực sự được duyệt.
  if (data?.status && data.status !== "approved") {
    return { handled: false, reason: "refund_" + data.status };
  }

  const transactionId = data?.transaction_id || null;
  let uid = data?.custom_data?.uid || null;

  // Adjustment thường KHÔNG mang theo custom_data của giao dịch gốc, nên
  // tra ngược qua đơn hàng đã lưu lúc cấp gói.
  if (!uid && transactionId) {
    const snap = await db
      .collection("users")
      .where("lastPaymentOrderNumber", "==", transactionId)
      .limit(1)
      .get();
    if (!snap.empty) uid = snap.docs[0].id;
  }

  if (!uid) {
    console.error("paddle-webhook: hoàn tiền nhưng không tìm ra user, giao dịch:", transactionId);
    return { handled: false, reason: "refund_user_not_found" };
  }

  await db.collection("users").doc(uid).update({
    plan: "free",
    planExpiresAt: null,
    planUpdatedAt: FieldValue.serverTimestamp(),
    lastRefundAt: FieldValue.serverTimestamp(),
    lastRefundTransactionId: transactionId,
  });

  console.log(`paddle-webhook: đã hạ ${uid} về gói free sau hoàn tiền ${transactionId}`);
  return { handled: true, uid, transactionId };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET;
  if (!secret) {
    console.error("paddle-webhook: chưa đặt PADDLE_NOTIFICATION_WEBHOOK_SECRET");
    // 500 để Paddle gửi lại — cấu hình xong là sự kiện tự chảy vào.
    return res.status(500).json({ success: false, message: "Server misconfigured" });
  }

  // ----- Lớp 1: IP -----
  const ip = clientIp(req);
  const cidrs = await getPaddleCidrs();
  if (cidrs) {
    const allowed = ipInCidrs(ip, cidrs);
    if (!allowed) {
      if (ENFORCE_IP) {
        console.warn("paddle-webhook: từ chối IP ngoài danh sách:", ip);
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      console.warn("paddle-webhook: IP không khớp danh sách Paddle (chỉ ghi log):", ip);
    }
  }

  // ----- Lớp 2: chữ ký -----
  let rawBody;
  try {
    rawBody = (await getRawBody(req)).toString("utf8");
  } catch (err) {
    console.error("paddle-webhook: không đọc được body:", err.message);
    return res.status(400).json({ success: false, message: "Cannot read body" });
  }

  if (!rawBody) {
    return res.status(400).json({ success: false, message: "Empty body" });
  }

  const sig = verifySignature(rawBody, req.headers["paddle-signature"], secret);
  if (!sig.ok) {
    console.warn("paddle-webhook: chữ ký không hợp lệ —", sig.reason, "| IP:", ip);
    return res.status(401).json({ success: false, message: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("paddle-webhook: body không phải JSON hợp lệ");
    return res.status(400).json({ success: false, message: "Invalid JSON" });
  }

  const eventId = event?.event_id;
  const eventType = event?.event_type;
  if (!eventId || !eventType) {
    return res.status(400).json({ success: false, message: "Missing event_id or event_type" });
  }

  // ----- Lớp 3: chống xử lý trùng -----
  //
  // Paddle gửi lại y nguyên event_id cho tới khi nhận được 2xx. Không chặn
  // thì một người mua có thể được cộng hạn nhiều lần.
  //
  // `.create()` ném lỗi nếu tài liệu đã tồn tại -> đó là một phép kiểm tra
  // NGUYÊN TỬ, chắc hơn hẳn get-rồi-set (hai lần gửi lại chạy song song
  // đều thấy "chưa có" rồi cùng cấp gói).
  const guardRef = db.collection("paddleEvents").doc(eventId);
  try {
    await guardRef.create({
      eventType,
      status: "processing",
      receivedAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    if (err.code === 6 || String(err.message || "").includes("ALREADY_EXISTS")) {
      console.log("paddle-webhook: bỏ qua sự kiện đã xử lý:", eventId);
      return res.status(200).json({ success: true, message: "Duplicate ignored" });
    }
    console.error("paddle-webhook: lỗi ghi chốt chống trùng:", err.message);
    return res.status(500).json({ success: false, message: "Guard write failed" });
  }

  // ----- Xử lý -----
  try {
    const data = event.data || {};
    let outcome;

    switch (eventType) {
      case "transaction.completed":
        outcome = await handleTransactionCompleted(data);
        break;
      case "adjustment.created":
      case "adjustment.updated":
        outcome = await handleRefund(data);
        break;
      default:
        outcome = { handled: false, reason: "không quan tâm sự kiện này" };
    }

    await guardRef.update({
      status: "done",
      outcome: outcome.reason || "ok",
      processedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ success: true, ...outcome });
  } catch (err) {
    // Xoá chốt để lần Paddle gửi lại còn xử lý được. Giữ lại thì sự kiện
    // vĩnh viễn bị coi là trùng và không bao giờ được cấp gói.
    console.error("paddle-webhook: xử lý thất bại", eventId, err);
    try {
      await guardRef.delete();
    } catch (delErr) {
      console.error("paddle-webhook: KHÔNG xoá được chốt", eventId, "-", delErr.message);
    }
    return res.status(500).json({ success: false, message: "Processing failed" });
  }
};
