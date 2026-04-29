import * as admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

function parseServiceAccount(): admin.ServiceAccount {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountRaw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is missing');
  }

  let serviceAccount: admin.ServiceAccount;

  try {
    serviceAccount = JSON.parse(serviceAccountRaw) as admin.ServiceAccount;
  } catch {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
  }

  if (!serviceAccount.projectId && (serviceAccount as any).project_id) {
    serviceAccount = {
      ...serviceAccount,
      projectId: (serviceAccount as any).project_id,
      privateKey: (serviceAccount as any).private_key,
      clientEmail: (serviceAccount as any).client_email,
    };
  }

  if (serviceAccount.privateKey) {
    serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
  }

  return serviceAccount;
}

export function getFirebaseAdminApp(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  const serviceAccount = parseServiceAccount();

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return firebaseApp;
}

export function getFirebaseAuth() {
  return getFirebaseAdminApp().auth();
}

export function getFirebaseMessaging() {
  return getFirebaseAdminApp().messaging();
}