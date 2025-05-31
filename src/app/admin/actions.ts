
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, collection, writeBatch, Timestamp, getDocs, query, where, limit } from 'firebase/firestore';
import type { FirestoreCourseDocument, PlanningEntry, GecombineerdeCursus } from '@/types/opleidingen'; // GecombineerdeCursus toegevoegd
import fs from 'fs/promises';
import path from 'path';

// Review Actions
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
      isApproved: false, // Expliciet op false zetten bij afkeuren
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


// Course Actions (Firestore based)

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

function parseFloatFromCurrencyString(currencyString: string): number | undefined {
  if (currencyString === null || currencyString === undefined || typeof currencyString !== 'string') return undefined;
  const cleanedString = currencyString.replace(/€\s?/g, '').replace(',', '.').trim();
  if (cleanedString === '' || cleanedString.toLowerCase() === 'nvt') return undefined;
  const value = parseFloat(cleanedString);
  return isNaN(value) ? undefined : value;
}

function parseDdMmYyyyToTimestamp(dateString: string): Timestamp | undefined {
  if (!dateString || typeof dateString !== 'string') return undefined;
  const parts = dateString.split('-');
  if (parts.length !== 3) return undefined;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Maanden zijn 0-geïndexeerd
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1900 || year > 2100) {
    console.warn(`[SEED] Ongeldige datum (dd-mm-yyyy) voor parsing: ${dateString}`);
    return undefined;
  }
  try {
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        console.warn(`[SEED] Datum parsing resulteerde in NaN voor: ${dateString}`);
        return undefined;
    }
    return Timestamp.fromDate(date);
  } catch (e) {
    console.error(`[SEED] Fout bij parsen van datum ${dateString}:`, e);
    return undefined;
  }
}


export async function seedCoursesToFirestore(): Promise<{ success: boolean, message: string, count?: number }> {
  try {
    const coursesCollectionRef = collection(db, 'courses');
    const existingCoursesSnapshot = await getDocs(query(coursesCollectionRef, limit(1)));
    if (!existingCoursesSnapshot.empty) {
      return { success: true, message: 'Cursuscollectie lijkt al gevuld. Seeding overgeslagen.', count: 0 };
    }

    const planningJsonPath = path.join(process.cwd(), 'Planning_OI_2025_import.json');
    const planningJsonContent = await fs.readFile(planningJsonPath, 'utf-8');
    const planningData: PlanningEntry[] = JSON.parse(planningJsonContent);

    if (!Array.isArray(planningData) || planningData.length === 0) {
      return { success: false, message: 'Geen cursusdata gevonden in Planning_OI_2025_import.json of het formaat is incorrect.', count: 0 };
    }
    
    const batch = writeBatch(db);
    let importedCount = 0;
    const now = Timestamp.now();

    planningData.forEach((entry, index) => {
      const datumTimestamp = parseDdMmYyyyToTimestamp(entry.Datum);
      if (!datumTimestamp) {
        console.warn(`[SEED] Datum kon niet worden geparsed voor entry ${index}, item overgeslagen:`, entry.Cursus, entry.Datum);
        return; 
      }

      const firestoreDoc: FirestoreCourseDocument = {
        opleidingId: `planning_item_${index}_${entry.Cursus.replace(/\W/g, '')}_${entry.Datum.replace(/-/g, '')}`, 
        datum: datumTimestamp,
        begintijd: entry.Begin,
        eindtijd: entry.Eind,
        cursusNaam: entry.Cursus,
        locatieNaam: entry.Locatie,
        inkoopprijs: parseFloatFromCurrencyString(entry.Inkoopprijs) ?? null,
        verkoopprijs: parseFloatFromCurrencyString(entry.VerkoopPrijs) ?? 0, // Default naar 0 als parsen mislukt
        SOOB: parseFloatFromCurrencyString(entry.SOOB) ?? null,
        puntenCode95: typeof entry["Punten Code95"] === 'number' ? entry["Punten Code95"] : null,
        branche: entry.Branche,
        instructeur: entry.Instructeur === "Nvt" ? null : entry.Instructeur,
        maximumAantal: entry.maximum_aantal || 0,
        aantalGereserveerd: entry.aantal_gereserveerd || 0,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      };
      
      const newCourseRef = doc(coursesCollectionRef); 
      batch.set(newCourseRef, firestoreDoc);
      importedCount++;
    });

    if (importedCount === 0) {
      return { success: true, message: 'Geen geldige cursusdata gevonden in JSON bestand om te importeren na filtering.', count: 0 };
    }

    await batch.commit();
    return { success: true, message: `Succesvol ${importedCount} cursussen geïmporteerd naar Firestore vanuit Planning_OI_2025_import.json.`, count: importedCount };

  } catch (error) {
    console.error("Error seeding courses to Firestore:", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) };
  }
}
