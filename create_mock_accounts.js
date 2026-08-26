const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const auth = admin.auth();
const db = admin.firestore();

const mockAccounts = [
  {
    displayName: 'Trần Minh Quang',
    email: 'minhquang.tran89@gmail.com',
    password: 'MinhQuang@2026!',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    plan: 'pro',
    level: 2,
    totalDP: 3450,
    weeklyDP: 420,
    streak: 14,
    maxStreak: 16,
    totalChecks: 112,
    perfectDays: 8,
    equippedTitle: 'Tập Sự Kỷ Luật',
    postContent: 'Ngày thứ 14 kiên trì đọc sách và chạy bộ 5km mỗi sáng. Bắt đầu cảm nhận được sự thay đổi rõ rệt trong năng lượng và tinh thần làm việc mỗi ngày! Chúc mọi người luôn giữ vững ngọn lửa kỷ luật nhé! 💪🔥'
  },
  {
    displayName: 'Lê Hoàng Yến Nhi',
    email: 'yennhi.lehoang96@gmail.com',
    password: 'YenNhiLe@2026!',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    plan: 'premium',
    level: 3,
    totalDP: 7850,
    weeklyDP: 680,
    streak: 28,
    maxStreak: 30,
    totalChecks: 245,
    perfectDays: 19,
    equippedTitle: 'Bậc Thầy Tập Trung',
    postContent: 'Chuỗi 28 ngày Deep Work và thức dậy lúc 5h30. Không còn cảm giác overthinking hay trì hoãn nữa, cứ đúng giờ là mở app và bắt tay vào việc thôi! ✨🎯'
  },
  {
    displayName: 'Nguyễn Quốc Bảo',
    email: 'quocbao.nguyen92@gmail.com',
    password: 'QuocBao@2026!',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    plan: 'premium',
    level: 5,
    totalDP: 18900,
    weeklyDP: 1150,
    streak: 56,
    maxStreak: 60,
    totalChecks: 480,
    perfectDays: 42,
    equippedTitle: 'Chiến Thần Kỷ Luật',
    postContent: '56 ngày duy trì 6 thói quen cốt lõi: Đọc sách 30p, Thiền 15p, Gym, Học kỹ năng mới. Kỷ luật không phải là sự gò bó, mà là chiếc chìa khóa duy nhất để đạt được tự do đích thực! Chúc anh em tuần mới tràn đầy năng lượng! 🚀🏆'
  }
];

async function createOrUpdateUser(acc) {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(acc.email);
    console.log(`User ${acc.email} exists (UID: ${userRecord.uid}). Updating Auth profile...`);
    await auth.updateUser(userRecord.uid, {
      displayName: acc.displayName,
      photoURL: acc.photoURL,
      password: acc.password,
      emailVerified: true,
      disabled: false
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`Creating new Auth user: ${acc.email}...`);
      userRecord = await auth.createUser({
        email: acc.email,
        password: acc.password,
        displayName: acc.displayName,
        photoURL: acc.photoURL,
        emailVerified: true
      });
      console.log(`Created Auth user ${acc.email} (UID: ${userRecord.uid})`);
    } else {
      throw error;
    }
  }

  const uid = userRecord.uid;
  const now = new Date();
  const createdAt = new Date(now.getTime() - (acc.streak + 5) * 24 * 60 * 60 * 1000);
  const futureYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  // 1. Save to users collection
  const userRef = db.collection('users').doc(uid);
  const profileData = {
    email: acc.email,
    displayName: acc.displayName,
    photoURL: acc.photoURL,
    plan: acc.plan,
    role: 'customer',
    equippedTitle: acc.equippedTitle,
    bonusDP: acc.totalDP,
    trialStartedAt: admin.firestore.Timestamp.fromDate(createdAt),
    trialExpiresAt: admin.firestore.Timestamp.fromDate(futureYear),
    planUpdatedAt: admin.firestore.Timestamp.fromDate(createdAt),
    planExpiresAt: admin.firestore.Timestamp.fromDate(futureYear),
    createdAt: admin.firestore.Timestamp.fromDate(createdAt),
    lastLoginAt: admin.firestore.Timestamp.fromDate(now),
    disabled: false,
  };
  await userRef.set(profileData, { merge: true });
  console.log(`Saved Firestore users/${uid}`);

  // 2. Save to leaderboard collection
  const lbRef = db.collection('leaderboard').doc(uid);
  const lbData = {
    uid: uid,
    displayName: acc.displayName,
    photoURL: acc.photoURL,
    equippedTitle: acc.equippedTitle,
    totalDP: acc.totalDP,
    bonusDP: acc.totalDP,
    weeklyDP: acc.weeklyDP,
    streak: acc.streak,
    maxStreak: acc.maxStreak,
    totalChecks: acc.totalChecks,
    perfectDays: acc.perfectDays,
    isAdmin: false,
    updatedAt: admin.firestore.Timestamp.fromDate(now)
  };
  await lbRef.set(lbData, { merge: true });
  console.log(`Saved Firestore leaderboard/${uid}`);

  return { ...acc, uid };
}

async function createCommunityInteraction(createdUsers) {
  const [quang, yennhi, bao] = createdUsers;
  const now = Date.now();

  console.log('Creating community posts and comments...');

  // Post 1 by Quang (Level 2)
  const postQuangRef = await db.collection('community_posts').add({
    uid: quang.uid,
    displayName: quang.displayName,
    photoURL: quang.photoURL,
    equippedTitle: quang.equippedTitle,
    userDP: quang.totalDP,
    rankLevel: quang.level,
    content: quang.postContent,
    mediaUrl: null,
    mediaType: null,
    likes: 3,
    likedBy: [yennhi.uid, bao.uid],
    comments: [
      {
        id: 'c_' + (now - 120000),
        uid: bao.uid,
        displayName: bao.displayName,
        photoURL: bao.photoURL,
        equippedTitle: bao.equippedTitle,
        rankLevel: bao.level,
        content: 'Tuyệt vời lắm anh Quang! Giữ vững chuỗi và năng lượng nhé! 💪',
        createdAt: new Date(now - 120000).toISOString()
      },
      {
        id: 'c_' + (now - 60000),
        uid: yennhi.uid,
        displayName: yennhi.displayName,
        photoURL: yennhi.photoURL,
        equippedTitle: yennhi.equippedTitle,
        rankLevel: yennhi.level,
        content: 'Cùng cố gắng nha anh Quang ơi, chạy bộ buổi sáng đã lắm ✨🏃‍♂️',
        createdAt: new Date(now - 60000).toISOString()
      }
    ],
    createdAt: admin.firestore.Timestamp.fromDate(new Date(now - 3 * 3600 * 1000))
  });

  // Post 2 by Yen Nhi (Level 3)
  const postYenNhiRef = await db.collection('community_posts').add({
    uid: yennhi.uid,
    displayName: yennhi.displayName,
    photoURL: yennhi.photoURL,
    equippedTitle: yennhi.equippedTitle,
    userDP: yennhi.totalDP,
    rankLevel: yennhi.level,
    content: yennhi.postContent,
    mediaUrl: null,
    mediaType: null,
    likes: 5,
    likedBy: [quang.uid, bao.uid],
    comments: [
      {
        id: 'c_' + (now - 180000),
        uid: quang.uid,
        displayName: quang.displayName,
        photoURL: quang.photoURL,
        equippedTitle: quang.equippedTitle,
        rankLevel: quang.level,
        content: 'Ngưỡng mộ chuỗi 28 ngày của Yến Nhi quá, mình đang bám sát phía sau đây! 🔥',
        createdAt: new Date(now - 180000).toISOString()
      },
      {
        id: 'c_' + (now - 90000),
        uid: bao.uid,
        displayName: bao.displayName,
        photoURL: bao.photoURL,
        equippedTitle: bao.equippedTitle,
        rankLevel: bao.level,
        content: 'Đúng phương pháp rồi Nhi ơi, cứ duy trì nhịp độ này là tiến bộ vượt bậc.',
        createdAt: new Date(now - 90000).toISOString()
      }
    ],
    createdAt: admin.firestore.Timestamp.fromDate(new Date(now - 6 * 3600 * 1000))
  });

  // Post 3 by Quoc Bao (Level 5)
  const postBaoRef = await db.collection('community_posts').add({
    uid: bao.uid,
    displayName: bao.displayName,
    photoURL: bao.photoURL,
    equippedTitle: bao.equippedTitle,
    userDP: bao.totalDP,
    rankLevel: bao.level,
    content: bao.postContent,
    mediaUrl: null,
    mediaType: null,
    likes: 8,
    likedBy: [quang.uid, yennhi.uid],
    comments: [
      {
        id: 'c_' + (now - 300000),
        uid: yennhi.uid,
        displayName: yennhi.displayName,
        photoURL: yennhi.photoURL,
        equippedTitle: yennhi.equippedTitle,
        rankLevel: yennhi.level,
        content: 'Bác Bảo leo rank Level 5 đỉnh thật sự, đúng là tấm gương kỷ luật để noi theo 👏🏆',
        createdAt: new Date(now - 300000).toISOString()
      },
      {
        id: 'c_' + (now - 240000),
        uid: quang.uid,
        displayName: quang.displayName,
        photoURL: quang.photoURL,
        equippedTitle: quang.equippedTitle,
        rankLevel: quang.level,
        content: 'Chuỗi 56 ngày quá khủng! Đọc bài của bác lại có thêm động lực không dám lười!',
        createdAt: new Date(now - 240000).toISOString()
      }
    ],
    createdAt: admin.firestore.Timestamp.fromDate(new Date(now - 10 * 3600 * 1000))
  });

  console.log('Created 3 interactive community posts successfully!');
}

async function main() {
  console.log('=== STARTING MOCK ACCOUNT CREATION ON FIREBASE ===\n');
  const createdUsers = [];
  for (const acc of mockAccounts) {
    const res = await createOrUpdateUser(acc);
    createdUsers.push(res);
  }

  await createCommunityInteraction(createdUsers);

  console.log('\n=== COMPLETED SUCCESSFULLY ===');
  console.log('Created 3 mock accounts with levels 2, 3, and 5:');
  createdUsers.forEach(u => {
    console.log(`- ${u.displayName} | Level ${u.level} | DP: ${u.totalDP} | Streak: ${u.streak}d | Email: ${u.email} | Pass: ${u.password}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
