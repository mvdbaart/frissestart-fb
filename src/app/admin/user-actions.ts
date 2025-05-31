
'use server';

import { getAdminInstances } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { UserRecord } from 'firebase-admin/auth';

// Helper om te checken of de huidige (server-side) actie wordt uitgevoerd door een admin
// Dit is een placeholder; in een echte app zou je de sessie/token van de aanroeper verifiëren.
// Voor nu gaan we ervan uit dat deze acties alleen worden aangeroepen vanuit een beveiligde admin-sectie.
// Een betere check zou zijn:
// import { auth } from '@/lib/firebase'; // Client SDK auth
// const currentUser = auth.currentUser;
// if (!currentUser) throw new Error("Niet geauthenticeerd");
// const idTokenResult = await currentUser.getIdTokenResult(true);
// if (!idTokenResult.claims.admin) throw new Error("Geen admin rechten");
// Voor nu, we vertrouwen erop dat de UI dit afschermt.

async function ensureAdmin() {
    // TODO: Implementeer een robuuste check om te zorgen dat de aanroeper een admin is.
    // Bijvoorbeeld door een ID token te checken die meegegeven wordt vanuit de client,
    // of door de sessie van de gebruiker die de server action aanroept te valideren.
    // Voor nu, voor demo, laten we dit open, maar in productie is dit een MUST.
    console.warn("TODO: Implementeer admin check in user-actions.ts!");
}

export interface AdminUserRepresentation {
  uid: string;
  email?: string;
  displayName?: string;
  disabled: boolean;
  isAdmin: boolean;
  creationTime?: string;
  lastSignInTime?: string;
}

export async function listAllUsers(
  itemsPerPage: number = 20,
  pageToken?: string
): Promise<{ users: AdminUserRepresentation[]; nextPageToken?: string; error?: string }> {
  await ensureAdmin();
  try {
    const { auth } = getAdminInstances();
    const listUsersResult = await auth.listUsers(itemsPerPage, pageToken);
    const users = listUsersResult.users.map((userRecord: UserRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      disabled: userRecord.disabled,
      isAdmin: !!userRecord.customClaims?.admin,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));
    revalidatePath('/admin'); // Herlaad data op de admin pagina
    return { users, nextPageToken: listUsersResult.pageToken };
  } catch (error: any) {
    console.error("Error listing users:", error);
    return { users: [], error: error.message || "Kon gebruikers niet ophalen." };
  }
}

export async function setUserAdminRole(uid: string, isAdmin: boolean): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();
  if (!uid) return { success: false, error: "Gebruiker UID is vereist."};
  try {
    const { auth } = getAdminInstances();
    await auth.setCustomUserClaims(uid, { admin: isAdmin });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error(`Error setting admin role for user ${uid}:`, error);
    return { success: false, error: error.message || "Kon admin rol niet instellen." };
  }
}

export async function toggleUserDisabledStatus(uid: string, disabled: boolean): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();
   if (!uid) return { success: false, error: "Gebruiker UID is vereist."};
  try {
    const { auth } = getAdminInstances();
    await auth.updateUser(uid, { disabled });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating user ${uid} disabled status:`, error);
    return { success: false, error: error.message || "Kon gebruikerstatus niet bijwerken." };
  }
}

export async function deleteFirebaseUser(uid: string): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();
  if (!uid) return { success: false, error: "Gebruiker UID is vereist."};
  try {
    const { auth } = getAdminInstances();
    await auth.deleteUser(uid);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting user ${uid}:`, error);
    return { success: false, error: error.message || "Kon gebruiker niet verwijderen." };
  }
}
