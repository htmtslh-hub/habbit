// ============================================================
// REFERRAL — mã mời bạn bè
//
// VÌ SAO PHẢI LÀ ENDPOINT MÁY CHỦ, KHÔNG LÀM Ở CLIENT:
// firestore.rules chỉ cho người dùng ghi vào tài liệu CỦA CHÍNH MÌNH
// (`request.auth.uid == userId`). Thưởng Coins cho người mời là ghi vào
// tài liệu của người KHÁC — client không làm được, mà nếu nới rule ra
// thì ai cũng tự cộng Coins cho mình được. Nên phải qua đây, dùng quyền
// admin và tự kiểm tra điều kiện.
//
// Hai hành động:
//   POST { action: "code" }              -> lấy (tạo nếu chưa có) mã mời của mình
//   POST { action: "claim", code: "..." } -> nhập mã của người khác, thưởng cả hai
//
// Xác thực: header `Authorization: Bearer <Firebase ID token>`.
// ============================================================

const { getFirebaseAdmin } = require("./_lib/emailCore");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { applyCors } = require("./_lib/cors");

// Thưởng: người mời nhiều hơn để tạo động lực đi mời.
const REWARD_REFERRER = 200;
const REWARD_INVITEE = 100;

// Người được mời phải điểm danh ít nhất ngần này lượt thì mới được tính.
// Mục đích: chặn việc lập tài khoản rỗng hàng loạt để cày Coins. Người
// dùng thật có 3 thói quen thì ngay ngày đầu đã đạt, nên không phiền.
const MIN_CHECKINS = 3;

// Bảng chữ cái bỏ các ký tự dễ đọc nhầm: O/0, I/1, L, U/V.
const ALPHABET = "ABCDEFGHJKMNPQRSTWXYZ23456789";
const CODE_LEN = 6;

function randomCode() {
    let s = "";
    for (let i = 0; i < CODE_LEN; i++) {
        s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return s;
}

function countCheckins(habitDataStr) {
    if (!habitDataStr) return 0;
    let state;
    try {
        state = JSON.parse(habitDataStr);
    } catch (e) {
        return 0;
    }
    const c = state && state.c ? state.c : {};
    let n = 0;
    for (const k in c) if (c[k]) n++;
    return n;
}

/** Lấy mã mời của người dùng, tạo mới nếu chưa có. */
async function getOrCreateCode(db, uid) {
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    if (snap.exists && snap.data().inviteCode) {
        return snap.data().inviteCode;
    }

    // Thử tối đa 8 lần để tránh trùng mã. Bảng tra `invite_codes/{CODE}`
    // dùng transaction nên hai người tạo cùng lúc không thể chiếm cùng mã.
    for (let attempt = 0; attempt < 8; attempt++) {
        const code = randomCode();
        const codeRef = db.collection("invite_codes").doc(code);
        try {
            await db.runTransaction(async (tx) => {
                const existing = await tx.get(codeRef);
                if (existing.exists) throw new Error("TRUNG_MA");
                tx.set(codeRef, { uid, createdAt: FieldValue.serverTimestamp() });
                tx.set(userRef, { inviteCode: code }, { merge: true });
            });
            return code;
        } catch (e) {
            if (e.message !== "TRUNG_MA") throw e;
        }
    }
    throw new Error("Không tạo được mã mời, vui lòng thử lại.");
}

module.exports = async function handler(req, res) {
    applyCors(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    const fb = getFirebaseAdmin();
    if (!fb) {
        return res.status(500).json({ success: false, message: "Máy chủ chưa cấu hình đầy đủ." });
    }
    const db = getFirestore();

    // ---- Xác thực người gọi ----
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ success: false, message: "Thiếu thông tin xác thực." });
    }

    let uid;
    try {
        const decoded = await getAuth().verifyIdToken(token);
        uid = decoded.uid;
    } catch (e) {
        return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ." });
    }

    const body = req.body || {};
    const action = body.action;

    try {
        // ================= LẤY MÃ CỦA MÌNH =================
        if (action === "code") {
            const code = await getOrCreateCode(db, uid);
            const snap = await db.collection("users").doc(uid).get();
            const d = snap.exists ? snap.data() : {};
            return res.json({
                success: true,
                code,
                invitedCount: d.invitedCount || 0,
                earnedFromInvites: (d.invitedCount || 0) * REWARD_REFERRER,
                // Đã nhập mã người khác chưa — để client biết có hiện ô
                // nhập mã hay không, khỏi cho bấm rồi mới báo lỗi.
                alreadyClaimed: !!d.referredBy,
                checkins: countCheckins(d.habitData),
                minCheckins: MIN_CHECKINS,
                rewardReferrer: REWARD_REFERRER,
                rewardInvitee: REWARD_INVITEE,
            });
        }

        // ================= NHẬP MÃ NGƯỜI KHÁC =================
        if (action === "claim") {
            const code = String(body.code || "").trim().toUpperCase();
            if (!code || code.length !== CODE_LEN) {
                return res.json({ success: false, reason: "invalid_code", message: "Mã mời không đúng định dạng." });
            }

            const codeSnap = await db.collection("invite_codes").doc(code).get();
            if (!codeSnap.exists) {
                return res.json({ success: false, reason: "not_found", message: "Mã mời không tồn tại." });
            }
            const referrerUid = codeSnap.data().uid;

            if (referrerUid === uid) {
                return res.json({ success: false, reason: "self", message: "Bạn không thể dùng mã mời của chính mình." });
            }

            const meRef = db.collection("users").doc(uid);
            const meSnap = await meRef.get();
            if (!meSnap.exists) {
                return res.json({ success: false, reason: "no_account", message: "Không tìm thấy tài khoản." });
            }
            const me = meSnap.data();

            if (me.referredBy) {
                return res.json({ success: false, reason: "already", message: "Bạn đã nhập mã mời trước đó rồi." });
            }

            const checkins = countCheckins(me.habitData);
            if (checkins < MIN_CHECKINS) {
                return res.json({
                    success: false,
                    reason: "need_checkins",
                    needed: MIN_CHECKINS,
                    current: checkins,
                    message: `Hãy điểm danh ít nhất ${MIN_CHECKINS} lượt rồi quay lại nhập mã nhé.`,
                });
            }

            const refRef = db.collection("users").doc(referrerUid);
            const refSnap = await refRef.get();
            if (!refSnap.exists) {
                return res.json({ success: false, reason: "referrer_gone", message: "Tài khoản người mời không còn tồn tại." });
            }

            // Ghi tất cả trong một transaction: hoặc cả hai bên cùng nhận,
            // hoặc không ai nhận gì — không để lệch một nửa.
            await db.runTransaction(async (tx) => {
                const meNow = await tx.get(meRef);
                if (meNow.data().referredBy) throw new Error("DA_NHAN");

                tx.update(meRef, {
                    referredBy: referrerUid,
                    referredAt: FieldValue.serverTimestamp(),
                    bonusDP: FieldValue.increment(REWARD_INVITEE),
                });
                tx.update(refRef, {
                    invitedCount: FieldValue.increment(1),
                    bonusDP: FieldValue.increment(REWARD_REFERRER),
                });
                // Bảng xếp hạng giữ bản sao bonusDP riêng, phải cộng cả hai
                // nơi nếu không điểm hiển thị sẽ lệch nhau.
                tx.set(db.collection("leaderboard").doc(uid),
                    { bonusDP: FieldValue.increment(REWARD_INVITEE) }, { merge: true });
                tx.set(db.collection("leaderboard").doc(referrerUid),
                    { bonusDP: FieldValue.increment(REWARD_REFERRER) }, { merge: true });

                tx.set(db.collection("referrals").doc(uid), {
                    invitee: uid,
                    referrer: referrerUid,
                    code,
                    rewardInvitee: REWARD_INVITEE,
                    rewardReferrer: REWARD_REFERRER,
                    createdAt: FieldValue.serverTimestamp(),
                });
            });

            return res.json({
                success: true,
                rewardInvitee: REWARD_INVITEE,
                rewardReferrer: REWARD_REFERRER,
                message: `Nhận thành công +${REWARD_INVITEE} Coins! Người mời bạn cũng nhận được +${REWARD_REFERRER} Coins.`,
            });
        }

        return res.status(400).json({ success: false, message: "Hành động không hợp lệ." });

    } catch (err) {
        if (err.message === "DA_NHAN") {
            return res.json({ success: false, reason: "already", message: "Bạn đã nhập mã mời trước đó rồi." });
        }
        console.error("referral:", err);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
};
