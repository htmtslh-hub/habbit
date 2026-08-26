const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json');

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function verify() {
  const db = admin.firestore();
  console.log('=== TOP 5 LEADERBOARD ===');
  const lbSnap = await db.collection('leaderboard').orderBy('totalDP', 'desc').limit(5).get();
  lbSnap.forEach((d, i) => {
    const data = d.data();
    console.log(`${i+1}. ${data.displayName} | DP: ${data.totalDP} | Streak: ${data.streak} | Title: ${data.equippedTitle || 'None'}`);
  });

  console.log('\n=== LATEST COMMUNITY POSTS ===');
  const cpSnap = await db.collection('community_posts').orderBy('createdAt', 'desc').limit(3).get();
  cpSnap.forEach(d => {
    const data = d.data();
    console.log(`[${data.displayName} - Level ${data.rankLevel}] ${data.content.slice(0, 70)}... (${data.likes} likes, ${data.comments ? data.comments.length : 0} comments)`);
  });
}

verify().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
