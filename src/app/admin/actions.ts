
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { fetchAndCache } from '@/lib/cache';
import type { Opleiding, CursusDetail, Locatie, GecombineerdeCursus } from '@/types/opleidingen';

const OPLEIDINGEN_CACHE_KEY = 'opleidingen_data_v1';
const CURSUS_DETAILS_CACHE_KEY = 'cursus_details_data_v1';
const LOCATIES_CACHE_KEY = 'locaties_data_v1';

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
