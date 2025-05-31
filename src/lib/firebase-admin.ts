
'use server';

import * as admin from 'firebase-admin';

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

function initializeFirebaseAdmin(params: FirebaseAdminAppParams): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: formatPrivateKey(params.privateKey),
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
  });
}

// Helper function om de admin SDK te initialiseren vanuit een Base64 service account string
function initializeAdminAppFromBase64(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;

  if (!serviceAccountBase64) {
    throw new Error('De omgevingsvariabele FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 is niet ingesteld. Kan Admin SDK niet initialiseren.');
  }

  try {
    const serviceAccountJsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccountCredentials = JSON.parse(serviceAccountJsonString);
    
    const credential = admin.credential.cert(serviceAccountCredentials);

    return admin.initializeApp({
      credential,
      projectId: serviceAccountCredentials.project_id,
    });

  } catch (error) {
    console.error("Fout bij het parsen of initialiseren van Firebase Admin SDK met Base64 service account:", error);
    throw new Error('Kon Firebase Admin SDK niet correct initialiseren met de Base64 service account string.');
  }
}


// Gebruik de Base64 initialisatie methode
// const adminApp = initializeAdminAppFromBase64();
// export const adminAuth = adminApp.auth();
// export const adminDb = adminApp.firestore();

// Dynamische initialisatie om problemen tijdens build/import te voorkomen als env var niet direct beschikbaar is
let adminAuthInstance: admin.auth.Auth;
let adminDbInstance: admin.firestore.Firestore;

function getAdminInstances() {
  if (!adminAuthInstance || !adminDbInstance) {
    const app = initializeAdminAppFromBase64();
    adminAuthInstance = app.auth();
    adminDbInstance = app.firestore();
  }
  return { auth: adminAuthInstance, db: adminDbInstance };
}

export { getAdminInstances };
