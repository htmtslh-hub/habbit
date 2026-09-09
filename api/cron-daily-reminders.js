// ============================================================
// CRON: NHẮC NHỞ TỰ ĐỘNG HÀNG NGÀY — Vercel Serverless Function
// Endpoint: GET/POST /api/cron-daily-reminders
// Được Vercel Cron gọi 1 lần/ngày (xem vercel.json). Cũng có thể gọi
// thủ công bằng tài khoản Admin (Bearer Firebase ID token) để test.
//
// Gửi 2 loại nhắc nhở (qua Email + Tin nhắn trong app):
//   1. Chưa hoàn thành nhiệm vụ hôm nay (ưu tiên "cứu chuỗi" nếu đang có streak)
//   2. Trial sắp hết hạn / vừa hết hạn (còn 3 ngày, còn 1 ngày, hết hạn hôm nay,
//      vừa hết hạn trong vòng 24h qua)
//
// Việc "Kích hoạt VIP" được gửi ngay lúc thanh toán thành công trong
// api/sepay-webhook.js (event-driven), KHÔNG nằm trong cron này.
// ============================================================

const { getFirebaseAdmin, resolveResendConfig, sendBrandedEmail } = require("./_lib/emailCore");
const { sendSystemMessage } = require("./_lib/systemMessage");
const { getEffectivePlan, getTrialDaysLeft, getVietnamDateParts, hasCheckedInToday, toDateSafe } = require("./_lib/reminderHelpers");
const { FieldValue } = require("firebase-admin/firestore");

const CHUNK_SIZE = 6;
const APP_URL = "https://habit-mastery.com";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function displayNameOf(u) {
  return u.displayName || (u.email || "").split("@")[0] || "Chiến binh kỷ luật";
}

async function verifyAdminToken(fb, db, token) {
  try {
    const decoded = await fb.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const fb = getFirebaseAdmin();
  if (!fb) {
    return res.status(500).json({ success: false, message: "Firebase Admin chưa được cấu hình biến môi trường." });
  }
  const db = fb.firestore();

  // ---- Xác thực: Vercel Cron (CRON_SECRET tự động) HOẶC Admin đăng nhập ----
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  let authorized = false;
  let triggeredBy = "cron";

  if (cronSecret && token === cronSecret) {
    authorized = true;
  } else if (token) {
    const admin = await verifyAdminToken(fb, db, token);
    if (admin) {
      authorized = true;
      triggeredBy = "admin:" + (admin.email || admin.uid);
    }
  } else if (!cronSecret) {
    // Chưa cấu hình CRON_SECRET trên Vercel: tạm cho phép qua để cron không bị chặn,
    // nhưng cảnh báo trong log để admin sớm bổ sung biến môi trường CRON_SECRET.
    authorized = true;
    console.warn("[cron-daily-reminders] CRON_SECRET chưa được cấu hình — endpoint đang chạy KHÔNG có xác thực bí mật.");
  }

  if (!authorized) {
    return res.status(401).json({ success: false, message: "Không có quyền truy cập." });
  }

  const query = req.query || {};
  const dryRun = query.dryRun === "1" || query.dryRun === "true";
  const testUid = query.testUid || null; // chỉ xử lý 1 user, bỏ qua dedupe, để admin test thủ công

  const emailCfg = await resolveResendConfig(db);
  if (!emailCfg && !dryRun) {
    console.warn("[cron-daily-reminders] Chưa cấu hình Resend — chỉ gửi tin nhắn trong app, bỏ qua email.");
  }

  const now = new Date();
  const vnParts = getVietnamDateParts(now);

  // ---- Lấy danh sách user ----
  let usersSnap;
  if (testUid) {
    const doc = await db.collection("users").doc(testUid).get();
    usersSnap = { docs: doc.exists ? [doc] : [] };
  } else {
    usersSnap = await db.collection("users").get();
  }

  const candidates = [];
  usersSnap.docs.forEach((doc) => {
    const u = doc.data() || {};
    if (u.disabled) return;
    if (!u.email || !u.email.includes("@")) return;
    candidates.push({ uid: doc.id, ...u });
  });

  const summary = {
    triggeredBy,
    dryRun,
    totalUsersScanned: candidates.length,
    dailyReminders: { sent: 0, streakSave: 0, generic: 0, skipped: 0 },
    trialReminders: { d3: 0, d1: 0, d0: 0, expired: 0 },
    errors: [],
  };

  const tasks = [];

  for (const u of candidates) {
    const uid = u.uid;
    const name = displayNameOf(u);
    const effectivePlan = getEffectivePlan(u, now);

    // ============ 1. NHẮC NHỞ NHIỆM VỤ HÔM NAY / CỨU CHUỖI ============
    // Chỉ nhắc từ 19h giờ VN trở đi (cron mặc định chạy 20h — điều kiện này
    // chỉ là lớp an toàn nếu ai đó gọi tay endpoint sớm hơn).
    const isSameDayAsSignup = (() => {
      const created = toDateSafe(u.createdAt);
      if (!created) return false;
      const createdParts = getVietnamDateParts(created);
      return createdParts.isoKey === vnParts.isoKey;
    })();

    const alreadyRemindedToday = u.lastDailyReminderDate === vnParts.isoKey;

    if ((testUid || vnParts.hour >= 19) && !isSameDayAsSignup && (testUid || !alreadyRemindedToday)) {
      const { checked, habitCount } = hasCheckedInToday(u.habitData, vnParts);
      if (habitCount > 0 && !checked) {
        tasks.push(async () => {
          try {
            let streak = 0;
            try {
              const lbDoc = await db.collection("leaderboard").doc(uid).get();
              if (lbDoc.exists) streak = lbDoc.data().streak || 0;
            } catch (e) {
              /* bỏ qua, coi như streak = 0 */
            }

            const isStreakSave = streak > 0;
            const subject = isStreakSave
              ? `🔥 Chuỗi ${streak} ngày của bạn sắp đứt — Cứu ngay!`
              : `⏰ Hôm nay bạn chưa hoàn thành nhiệm vụ nào!`;
            const contentHtml = isStreakSave
              ? `<p>Xin chào <strong>${name}</strong>,</p>
                 <p>Bạn đang giữ một chuỗi <strong>${streak} ngày liên tiếp</strong> — thành quả rất đáng tự hào! Nhưng hôm nay bạn vẫn chưa tick nhiệm vụ nào.</p>
                 <div class="gold-box">🔥 Đừng để công sức bấy lâu tan biến chỉ vì quên một ngày. Vào app ngay để giữ chuỗi!</div>
                 <p>Nếu không kịp hoàn thành, bạn có thể dùng <strong>Bình Đóng Băng (Freeze)</strong> trong kho đồ để bảo vệ chuỗi của mình.</p>`
              : `<p>Xin chào <strong>${name}</strong>,</p>
                 <p>Đã đến tối rồi mà bạn vẫn chưa tick nhiệm vụ nào trong hôm nay. Đừng để một ngày trôi qua vô nghĩa!</p>
                 <div class="highlight-box">💡 Chỉ cần 2 phút để hoàn thành thói quen và giữ vững kỷ luật của bạn.</div>
                 <p>Vào ứng dụng ngay để hoàn thành nhiệm vụ trước khi ngày kết thúc nhé.</p>`;
            const inAppText = isStreakSave
              ? `🔥 Chuỗi ${streak} ngày của bạn sắp đứt! Vào app tick nhiệm vụ hoặc dùng Freeze để cứu chuỗi nhé.`
              : `⏰ Bạn chưa hoàn thành nhiệm vụ nào hôm nay. Vào app tick ngay trước khi hết ngày nhé!`;

            if (!dryRun) {
              if (emailCfg) {
                await sendBrandedEmail(emailCfg, {
                  to: u.email,
                  subject,
                  preheader: inAppText,
                  contentHtml,
                  ctaText: isStreakSave ? "Cứu Chuỗi Ngay →" : "Hoàn Thành Ngay →",
                  ctaUrl: APP_URL,
                });
              }
              await sendSystemMessage(db, FieldValue, uid, u, inAppText);
              if (!testUid) {
                await db.collection("users").doc(uid).update({ lastDailyReminderDate: vnParts.isoKey });
              }
              await db.collection("email_logs").add({
                type: "auto_reminder",
                templateId: isStreakSave ? "auto_streak_save" : "auto_daily_incomplete",
                subject,
                from: emailCfg ? emailCfg.resolvedFrom : "(chỉ tin nhắn trong app)",
                fromName: emailCfg ? emailCfg.fromName : "",
                fromEmail: emailCfg ? emailCfg.fromEmail : "",
                recipients: [{ email: u.email, name }],
                totalRecipients: 1,
                successCount: 1,
                failedCount: 0,
                status: "success",
                sentBy: "system-cron",
                createdAt: FieldValue.serverTimestamp(),
              });
            }

            summary.dailyReminders.sent++;
            if (isStreakSave) summary.dailyReminders.streakSave++;
            else summary.dailyReminders.generic++;
          } catch (err) {
            summary.errors.push({ uid, stage: "daily", message: err.message });
          }
        });
      } else {
        summary.dailyReminders.skipped++;
      }
    }

    // ============ 2. NHẮC NHỞ TRIAL SẮP / VỪA HẾT HẠN ============
    if (effectivePlan === "trial") {
      const daysLeft = getTrialDaysLeft(u, now);
      if (daysLeft !== null) {
        const sentMap = u.trialRemindersSent || {};
        let thresholdKey = null;
        if (daysLeft === 3) thresholdKey = "3";
        else if (daysLeft === 1) thresholdKey = "1";
        else if (daysLeft === 0) thresholdKey = "0";

        if (thresholdKey && (testUid || !sentMap[thresholdKey])) {
          tasks.push(async () => {
            try {
              const label = thresholdKey === "3" ? "còn 3 ngày" : thresholdKey === "1" ? "còn 1 ngày (hết hạn vào ngày mai)" : "hết hạn NGAY HÔM NAY";
              const subject =
                thresholdKey === "3"
                  ? "⏳ Còn 3 ngày dùng thử Premium"
                  : thresholdKey === "1"
                  ? "⚠️ Trial của bạn hết hạn vào ngày mai!"
                  : "🚨 Hôm nay là ngày cuối cùng dùng thử Premium!";
              const contentHtml = `<p>Xin chào <strong>${name}</strong>,</p>
                <p>Gói dùng thử Premium của bạn <strong>${label}</strong>.</p>
                <div class="highlight-box">✨ Nâng cấp ngay hôm nay để không bị gián đoạn trải nghiệm Premium: thống kê nâng cao, huy hiệu độc quyền, Bình Đóng Băng streak và nhiều đặc quyền khác.</div>`;
              const inAppText = `${subject} Nâng cấp ngay để không bị mất quyền lợi Premium nhé!`;

              if (!dryRun) {
                if (emailCfg) {
                  await sendBrandedEmail(emailCfg, {
                    to: u.email,
                    subject,
                    preheader: inAppText,
                    contentHtml,
                    ctaText: "Nâng Cấp Premium →",
                    ctaUrl: APP_URL,
                  });
                }
                await sendSystemMessage(db, FieldValue, uid, u, inAppText);
                if (!testUid) {
                  await db.collection("users").doc(uid).update({ [`trialRemindersSent.${thresholdKey}`]: true });
                }
                await db.collection("email_logs").add({
                  type: "auto_reminder",
                  templateId: "auto_trial_ending_" + thresholdKey,
                  subject,
                  from: emailCfg ? emailCfg.resolvedFrom : "(chỉ tin nhắn trong app)",
                  fromName: emailCfg ? emailCfg.fromName : "",
                  fromEmail: emailCfg ? emailCfg.fromEmail : "",
                  recipients: [{ email: u.email, name }],
                  totalRecipients: 1,
                  successCount: 1,
                  failedCount: 0,
                  status: "success",
                  sentBy: "system-cron",
                  createdAt: FieldValue.serverTimestamp(),
                });
              }
              summary.trialReminders["d" + thresholdKey]++;
            } catch (err) {
              summary.errors.push({ uid, stage: "trial", message: err.message });
            }
          });
        }
      }
    } else if (effectivePlan === "free" && u.plan === "trial") {
      // Trial vừa hết hạn trong vòng 48h qua (chuyển sang free) — nhắc 1 lần duy nhất
      const exp = toDateSafe(u.trialExpiresAt);
      const sentMap = u.trialRemindersSent || {};
      if (exp && !sentMap.expired && now.getTime() - exp.getTime() < 48 * 60 * 60 * 1000) {
        tasks.push(async () => {
          try {
            const subject = "💔 Trial đã kết thúc — Đừng bỏ lỡ ưu đãi nâng cấp!";
            const contentHtml = `<p>Xin chào <strong>${name}</strong>,</p>
              <p>Gói dùng thử Premium của bạn đã kết thúc. Tài khoản của bạn hiện đang ở gói Miễn phí.</p>
              <div class="gold-box">🎁 Nâng cấp ngay hôm nay để lấy lại toàn bộ đặc quyền Premium và tiếp tục hành trình rèn luyện không gián đoạn.</div>`;
            const inAppText = "💔 Trial của bạn đã kết thúc. Nâng cấp Premium ngay để không bỏ lỡ đặc quyền nhé!";

            if (!dryRun) {
              if (emailCfg) {
                await sendBrandedEmail(emailCfg, {
                  to: u.email,
                  subject,
                  preheader: inAppText,
                  contentHtml,
                  ctaText: "Nâng Cấp Ngay →",
                  ctaUrl: APP_URL,
                });
              }
              await sendSystemMessage(db, FieldValue, uid, u, inAppText);
              if (!testUid) {
                await db.collection("users").doc(uid).update({ "trialRemindersSent.expired": true });
              }
              await db.collection("email_logs").add({
                type: "auto_reminder",
                templateId: "auto_trial_expired",
                subject,
                from: emailCfg ? emailCfg.resolvedFrom : "(chỉ tin nhắn trong app)",
                fromName: emailCfg ? emailCfg.fromName : "",
                fromEmail: emailCfg ? emailCfg.fromEmail : "",
                recipients: [{ email: u.email, name }],
                totalRecipients: 1,
                successCount: 1,
                failedCount: 0,
                status: "success",
                sentBy: "system-cron",
                createdAt: FieldValue.serverTimestamp(),
              });
            }
            summary.trialReminders.expired++;
          } catch (err) {
            summary.errors.push({ uid, stage: "trial_expired", message: err.message });
          }
        });
      }
    }
  }

  // ---- Thực thi theo lô để tránh timeout & tránh vượt rate-limit Resend ----
  for (const group of chunk(tasks, CHUNK_SIZE)) {
    await Promise.all(group.map((fn) => fn()));
  }

  return res.json({ success: true, summary });
};
