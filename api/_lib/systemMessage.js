// ============================================================
// SYSTEM IN-APP MESSAGE — ghi vào collection `conversations` sẵn có
// để tái sử dụng đúng luồng Inbox (toast + badge) mà app.js đã có,
// không cần sửa gì ở client. Dùng chung cho cron nhắc nhở & webhook VIP.
// ============================================================

const SYSTEM_UID = "system_habitmastery";
const SYSTEM_NAME = "Habit Mastery";

async function sendSystemMessage(db, FieldValue, targetUid, targetUser, text) {
  const convId = [SYSTEM_UID, targetUid].sort().join("_");
  const convRef = db.collection("conversations").doc(convId);
  const msgRef = convRef.collection("messages").doc();

  const targetDetails = {
    displayName: (targetUser && (targetUser.displayName || (targetUser.email || "").split("@")[0])) || "Chiến binh kỷ luật",
    photoURL: (targetUser && targetUser.photoURL) || "",
    rankLevel: 1,
  };

  const batch = db.batch();
  batch.set(
    convRef,
    {
      participants: [SYSTEM_UID, targetUid],
      participantDetails: {
        [SYSTEM_UID]: { displayName: SYSTEM_NAME, photoURL: "", rankLevel: 99 },
        [targetUid]: targetDetails,
      },
      lastMessage: text,
      lastSenderId: SYSTEM_UID,
      updatedAt: FieldValue.serverTimestamp(),
      unreadCount: {
        [targetUid]: FieldValue.increment(1),
        [SYSTEM_UID]: 0,
      },
    },
    { merge: true }
  );

  batch.set(msgRef, {
    senderId: SYSTEM_UID,
    senderName: SYSTEM_NAME,
    senderPhoto: "",
    senderRankLevel: 99,
    isAdminMessage: true,
    text,
    createdAt: FieldValue.serverTimestamp(),
    read: false,
  });

  await batch.commit();
}

module.exports = { sendSystemMessage, SYSTEM_UID, SYSTEM_NAME };
