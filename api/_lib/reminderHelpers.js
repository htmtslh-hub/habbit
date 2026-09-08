// ============================================================
// REMINDER HELPERS — port từ logic plan/trial trong admin.js (dòng ~33-69)
// và cách app.js đọc trạng thái check-in trong habitData (app.js ck()).
// Tách riêng để cron-daily-reminders.js dùng lại mà không cần load app.js.
// ============================================================

function toDateSafe(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function isPlanExpired(user, now = new Date()) {
  if (!user) return false;
  if (user.plan === "trial") {
    const exp = toDateSafe(user.trialExpiresAt);
    if (!exp) return true;
    return exp < now;
  }
  if (user.plan === "premium" || user.plan === "pro") {
    const exp = toDateSafe(user.planExpiresAt);
    if (exp) return exp < now;
    return false; // lifetime
  }
  return false;
}

function getEffectivePlan(user, now = new Date()) {
  if (!user) return "free";
  if (user.plan === "premium" && !isPlanExpired(user, now)) return "premium";
  if (user.plan === "pro" && !isPlanExpired(user, now)) return "pro";
  if (user.plan === "trial" && !isPlanExpired(user, now)) return "trial";
  return "free";
}

// Số ngày còn lại của trial (làm tròn lên), có thể âm nếu đã hết hạn
function getTrialDaysLeft(user, now = new Date()) {
  const exp = toDateSafe(user.trialExpiresAt);
  if (!exp) return null;
  const diffMs = exp.getTime() - now.getTime();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

// Lấy các thành phần ngày theo giờ Việt Nam (UTC+7, không có DST) mà không
// phụ thuộc timezone của máy chủ Vercel (luôn chạy ở UTC).
function getVietnamDateParts(now = new Date()) {
  const vn = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth(); // 0-indexed, khớp với cM trong app.js
  const d = vn.getUTCDate();
  const hour = vn.getUTCHours();
  const isoKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const monthPrefix = `${y}-${m}-`; // tiền tố năm-tháng dùng để so khớp key check-in ck()
  return { y, m, d, hour, isoKey, monthPrefix };
}

// Kiểm tra user đã tick ít nhất 1 thói quen trong ngày hôm nay (giờ VN) chưa,
// dựa trên chuỗi JSON users/{uid}.habitData (S.c có key dạng `${year}-${monthIndex}-${habitId}-${day}`).
function hasCheckedInToday(habitDataStr, vnParts) {
  if (!habitDataStr) return { checked: false, habitCount: 0 };
  let state;
  try {
    state = JSON.parse(habitDataStr);
  } catch (e) {
    return { checked: false, habitCount: 0 };
  }

  const habitCount = Array.isArray(state.h) ? state.h.length : 0;
  if (habitCount === 0) return { checked: false, habitCount: 0 };

  // Ngày hôm nay đã được bảo vệ bởi Freeze/Repair thì coi như "đã hoàn thành"
  if (Array.isArray(state.frozenDays) && state.frozenDays.includes(vnParts.isoKey)) {
    return { checked: true, habitCount, protectedDay: true };
  }
  if (Array.isArray(state.repairedDays) && state.repairedDays.includes(vnParts.isoKey)) {
    return { checked: true, habitCount, protectedDay: true };
  }

  const c = state.c || {};
  for (const key in c) {
    if (!c[key]) continue;
    // key: `${year}-${monthIndex}-${habitId}-${day}` — chỉ tiền tố năm-tháng cố định,
    // phần còn lại là "${habitId}-${day}" nên phải tách đúng 2 mảnh và so khớp day.
    if (!key.startsWith(vnParts.monthPrefix)) continue;
    const rest = key.slice(vnParts.monthPrefix.length);
    const parts = rest.split("-");
    if (parts.length === 2 && parts[1] === String(vnParts.d)) {
      return { checked: true, habitCount };
    }
  }
  return { checked: false, habitCount };
}

module.exports = {
  toDateSafe,
  isPlanExpired,
  getEffectivePlan,
  getTrialDaysLeft,
  getVietnamDateParts,
  hasCheckedInToday,
};
