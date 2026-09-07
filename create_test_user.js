const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

async function main() {
  const email = 'testuser@habitmastery.com';
  const password = 'TestUser123!';
  const displayName = 'Test User';

  let user;
  try {
    user = await getAuth().getUserByEmail(email);
    console.log(`User ${email} already exists (UID: ${user.uid}). Updating password and profile...`);
    await getAuth().updateUser(user.uid, {
      password: password,
      displayName: displayName,
      emailVerified: true,
      disabled: false
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`Creating new user ${email}...`);
      user = await getAuth().createUser({
        email: email,
        password: password,
        displayName: displayName,
        emailVerified: true
      });
      console.log(`User created with UID: ${user.uid}`);
    } else {
      throw error;
    }
  }

  const db = getFirestore();
  const now = new Date();
  const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

  const userRef = db.collection('users').doc(user.uid);
  const profileData = {
    email: email,
    displayName: displayName,
    photoURL: '',
    plan: 'vip',
    role: 'customer',
    trialStartedAt: Timestamp.fromDate(now),
    trialExpiresAt: Timestamp.fromDate(futureDate),
    planUpdatedAt: Timestamp.fromDate(now),
    planExpiresAt: Timestamp.fromDate(futureDate),
    createdAt: Timestamp.fromDate(now),
    lastLoginAt: Timestamp.fromDate(now),
    disabled: false,
  };

  await userRef.set(profileData, { merge: true });
  console.log('User profile created/updated in Firestore successfully.');

  console.log('\n--- TEST USER CREDENTIALS ---');
  console.log('Email:    ', email);
  console.log('Password: ', password);
  console.log('UID:      ', user.uid);
  console.log('Plan:     ', profileData.plan);
  console.log('-------------------------------\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
