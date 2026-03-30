import * as admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db   = admin.firestore();

async function deleteCollection(name: string) {
  console.log(`🗑️  Borrando colección: ${name}`);
  const snap = await db.collection(name).get();
  if (snap.empty) { console.log('   ⏭️  Vacía, sin acción.'); return; }
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  console.log(`   ✅ ${snap.size} documentos eliminados`);
}

async function deleteAllAuthUsers() {
  console.log('🗑️  Borrando usuarios de Firebase Auth...');
  let count = 0;
  let pageToken: string | undefined;
  do {
    const result = await auth.listUsers(1000, pageToken);
    if (result.users.length > 0) {
      await auth.deleteUsers(result.users.map(u => u.uid));
      count += result.users.length;
    }
    pageToken = result.pageToken;
  } while (pageToken);
  console.log(`   ✅ ${count} usuarios eliminados`);
}

async function resetAll() {
  console.log('\n🔥 INICIANDO RESET COMPLETO DE FIREBASE...\n');
  await deleteAllAuthUsers();
  await deleteCollection('users');
  await deleteCollection('routines');
  await deleteCollection('injuries');
  await deleteCollection('progress');
  console.log('\n✅ Firebase completamente limpio.\n');
}

resetAll().catch(console.error);
