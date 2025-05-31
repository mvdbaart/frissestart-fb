
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, collection, writeBatch, Timestamp, getDocs, query, where, limit } from 'firebase/firestore';
import { fetchAndCache } from '@/lib/cache'; // Behoud voor externe data indien nog nodig
import type { Opleiding, CursusDetail, Locatie, GecombineerdeCursus, FirestoreCourseDocument } from '@/types/opleidingen';
import fs from 'fs/promises';
import path from 'path';

const OPLEIDINGEN_CACHE_KEY = 'opleidingen_data_v1'; // Voor externe fetch, indien nog gebruikt
const CURSUS_DETAILS_CACHE_KEY = 'cursus_details_data_v1';
const LOCATIES_CACHE_KEY = 'locaties_data_v1';

// --- Review Actions ---
export async function approveReview(reviewId: string): Promise<{ success: boolean, error?: string }> {
  if (!reviewId) return { success: false, error: "Review ID is required." };
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      isApproved: true,
    });
    return { success: true };
  } catch (e) {
    console.error("Error approving review:", e);
    return { success: false, error: (e instanceof Error ? e.message : String(e)) };
  }
}

export async function rejectReview(reviewId: string): Promise<{ success: boolean, error?: string }> {
  if (!reviewId) return { success: false, error: "Review ID is required." };
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      isApproved: false,
    });
    return { success: true };
  } catch (e) {
    console.error("Error rejecting review:", e);
    return { success: false, error: (e instanceof Error ? e.message : String(e)) };
  }
}

export async function deleteReview(reviewId: string): Promise<{ success: boolean, error?: string }> {
  if (!reviewId) return { success: false, error: "Review ID is required." };
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
    return { success: true };
  } catch (e) {
    console.error("Error deleting review:", e);
    return { success: false, error: (e instanceof Error ? e.message : String(e)) };
  }
}

// --- Course Actions (Firestore based) ---

export async function deleteCourse(courseDocId: string): Promise<{ success: boolean, error?: string }> {
  if (!courseDocId) return { success: false, error: "Course Document ID is required." };
  try {
    const courseRef = doc(db, 'courses', courseDocId);
    await deleteDoc(courseRef);
    return { success: true };
  } catch (e) {
    console.error("Error deleting course:", e);
    return { success: false, error: (e instanceof Error ? e.message : String(e)) };
  }
}


export async function seedCoursesToFirestore(): Promise<{ success: boolean, message: string, count?: number }> {
  try {
    const coursesCollectionRef = collection(db, 'courses');
    const existingCoursesSnapshot = await getDocs(query(coursesCollectionRef, limit(1)));
    if (!existingCoursesSnapshot.empty) {
      return { success: true, message: 'Cursuscollectie lijkt al gevuld. Seeding overgeslagen.', count: 0 };
    }

    const opleidingenPath = path.join(process.cwd(), 'opleidingen.json');
    const cursusDetailsPath = path.join(process.cwd(), 'cursus_details.json');
    const locatiesPath = path.join(process.cwd(), 'locaties.json');

    const [opleidingenJson, cursusDetailsJson, locatiesJson] = await Promise.all([
      fs.readFile(opleidingenPath, 'utf-8'),
      fs.readFile(cursusDetailsPath, 'utf-8'),
      fs.readFile(locatiesPath, 'utf-8'),
    ]);

    const opleidingenData: Opleiding[] = JSON.parse(opleidingenJson);
    const cursusDetailsData: CursusDetail[] = JSON.parse(cursusDetailsJson);
    const locatiesData: Locatie[] = JSON.parse(locatiesJson);

    const cursusDetailsMap = new Map<string, CursusDetail>();
    cursusDetailsData.forEach(detail => cursusDetailsMap.set(detail.id.toString(), detail));

    const locatiesMap = new Map<string, Locatie>();
    locatiesData.forEach(locatie => locatiesMap.set(locatie.id.toString(), locatie));

    const batch = writeBatch(db);
    let importedCount = 0;
    const now = Timestamp.now();

    for (const opl of opleidingenData) {
      const detail = cursusDetailsMap.get(opl.cursus_id);
      const locatie = locatiesMap.get(opl.locatie_id);

      const [year, month, day] = opl.datum.split('-').map(Number);
      const cursusDatum = new Date(year, month - 1, day); // Maand is 0-geïndexeerd

      const firestoreDoc: FirestoreCourseDocument = {
        opleidingId: opl.id,
        datum: Timestamp.fromDate(cursusDatum),
        begintijd: opl.begintijd,
        eindtijd: opl.eindtijd,
        cursusId: opl.cursus_id,
        cursusNaam: detail?.naam,
        cursusLink: detail?.link,
        cursusOmschrijving: detail?.omschrijving,
        locatieId: opl.locatie_id,
        locatieNaam: locatie?.naam,
        opdrachtgeverId: opl.opdrachtgever_id,
        inkoopprijs: parseFloat(opl.inkoopprijs) || undefined,
        verkoopprijs: parseFloat(opl.verkoopprijs) || 0,
        SOOB: parseFloat(opl.SOOB) || undefined,
        puntenCode95: parseFloat(opl.punten_code95) || undefined,
        branche: opl.branche,
        instructeur: opl.instructeur,
        instructeurId: opl.instructeur_id,
        maximumAantal: parseInt(opl.maximum_aantal, 10) || 0,
        aantalGereserveerd: parseInt(opl.aantal_gereserveerd || '0', 10) || 0,
        isPublished: true, // Default to published
        createdAt: now,
        updatedAt: now,
      };
      
      const newCourseRef = doc(coursesCollectionRef); // Auto-generated ID
      batch.set(newCourseRef, firestoreDoc);
      importedCount++;
    }

    if (importedCount === 0) {
      return { success: true, message: 'Geen cursusdata gevonden in JSON bestanden om te importeren.', count: 0 };
    }

    await batch.commit();
    return { success: true, message: `Succesvol ${importedCount} cursussen geïmporteerd naar Firestore.`, count: importedCount };

  } catch (error) {
    console.error("Error seeding courses to Firestore:", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) };
  }
}


// Behoud deze functie voorlopig als de publieke pagina's het nog gebruiken,
// maar de admin sectie zou het niet meer direct moeten aanroepen.
export async function getAdminCourseData(): Promise<{ courses: GecombineerdeCursus[], error?: string }> {
  try {
    const [opleidingenData, cursusDetailsData, locatiesData] = await Promise.all([
      fetchAndCache<Opleiding>('https://opleidingen.frissestart.nl/wp-json/mo/v1/opleidingen', OPLEIDINGEN_CACHE_KEY),
      fetchAndCache<CursusDetail>('https://opleidingen.frissestart.nl/wp-json/mo/v1/cursussen', CURSUS_DETAILS_CACHE_KEY),
      fetchAndCache<Locatie>('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties', LOCATIES_CACHE_KEY),
    ]);

    const cursusDetailsMap = new Map<string, CursusDetail>();
    cursusDetailsData.forEach(detail => cursusDetailsMap.set(detail.id.toString(), detail));

    const locatiesMap = new Map<string, Locatie>();
    locatiesData.forEach(locatie => locatiesMap.set(locatie.id.toString(), locatie));

    const combinedCourses = opleidingenData.map(opleiding => {
      const detail = cursusDetailsMap.get(opleiding.cursus_id);
      const locatie = locatiesMap.get(opleiding.locatie_id);
      const maxAantal = parseInt(opleiding.maximum_aantal, 10);
      const gereserveerd = parseInt(opleiding.aantal_gereserveerd || '0', 10);
      const vrijePlekken = isNaN(maxAantal) || isNaN(gereserveerd) ? undefined : maxAantal - gereserveerd;
      return {
        ...opleiding,
        cursusNaam: detail?.naam || `Cursus ID: ${opleiding.cursus_id}`,
        cursusLink: detail?.link,
        locatieNaam: locatie?.naam || `Locatie ID: ${opleiding.locatie_id}`,
        vrijePlekken,
      };
    }).sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
    
    return { courses: combinedCourses };
  } catch (error) {
    console.error("Error fetching admin course data in server action:", error);
    return { courses: [], error: (error instanceof Error ? error.message : String(error)) };
  }
}
