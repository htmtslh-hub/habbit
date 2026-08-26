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

const updatedMockUsers = [
  {
    email: 'minhquang.tran89@gmail.com',
    displayName: 'Trần Minh Quang',
    // Avatar: Đỉnh núi hùng vĩ đón ánh bình minh (Biểu tượng cho tinh thần bứt phá, leo núi rèn luyện)
    photoURL: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=256&q=80',
    concept: 'Phong cảnh Đỉnh núi bình minh (Chinh phục mục tiêu)'
  },
  {
    email: 'yennhi.lehoang96@gmail.com',
    displayName: 'Lê Hoàng Yến Nhi',
    // Avatar: Chú mèo chill đáng yêu (Gần gũi, ấm áp, tự nhiên)
    photoURL: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=256&q=80',
    concept: 'Mèo cưng thư thái (Chill & Bình yên)'
  },
  {
    email: 'quocbao.nguyen92@gmail.com',
    displayName: 'Nguyễn Quốc Bảo',
    // Avatar: Quả cầu năng lượng lăng kính 3D công nghệ cao (Tập trung, kỷ luật thép)
    photoURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
    concept: 'Lăng kính 3D Neon Obsidian (Kỷ luật & Tập trung cao độ)'
  }
];

async function updateAvatars() {
  console.log('=== UPDATING MOCK USER AVATARS ON FIREBASE ===\n');

  for (const item of updatedMockUsers) {
    try {
      const user = await auth.getUserByEmail(item.email);
      const uid = user.uid;

      // 1. Update Auth
      await auth.updateUser(uid, {
        photoURL: item.photoURL
      });
      console.log(`[Auth] Updated photoURL for ${item.displayName} (${item.email})`);

      // 2. Update Firestore users collection
      await db.collection('users').doc(uid).set({
        photoURL: item.photoURL
      }, { merge: true });
      console.log(`[Firestore users] Updated ${uid}`);

      // 3. Update Firestore leaderboard collection
      await db.collection('leaderboard').doc(uid).set({
        photoURL: item.photoURL
      }, { merge: true });
      console.log(`[Firestore leaderboard] Updated ${uid}`);

    } catch (err) {
      console.error(`Error updating user ${item.email}:`, err.message);
    }
  }

  // 4. Update community posts and comments
  console.log('\nUpdating community_posts author avatars and comments...');
  const postsSnap = await db.collection('community_posts').get();
  
  for (const doc of postsSnap.docs) {
    const post = doc.data();
    let isModified = false;
    let newPostData = {};

    // Check if author is one of our mock users
    const matchedUser = updatedMockUsers.find(u => u.displayName === post.displayName);
    if (matchedUser && post.photoURL !== matchedUser.photoURL) {
      newPostData.photoURL = matchedUser.photoURL;
      isModified = true;
    }

    // Check comments
    if (Array.isArray(post.comments)) {
      let commentsChanged = false;
      const updatedComments = post.comments.map(c => {
        const matchedCommenter = updatedMockUsers.find(u => u.displayName === c.displayName);
        if (matchedCommenter && c.photoURL !== matchedCommenter.photoURL) {
          commentsChanged = true;
          return { ...c, photoURL: matchedCommenter.photoURL };
        }
        return c;
      });

      if (commentsChanged) {
        newPostData.comments = updatedComments;
        isModified = true;
      }
    }

    if (isModified) {
      await db.collection('community_posts').doc(doc.id).update(newPostData);
      console.log(`[Firestore community_posts] Updated post ${doc.id}`);
    }
  }

  console.log('\n=== ALL AVATARS UPDATED SUCCESSFULLY! ===');
}

updateAvatars().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
