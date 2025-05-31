
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

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
