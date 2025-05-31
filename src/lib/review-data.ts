
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import type { Review } from '@/types/reviews';
import { unstable_noStore as noStore } from 'next/cache';
import { format } from 'date-fns';

interface GetReviewsDataOptions {
  forAdmin?: boolean;
}

export async function getReviewsData(options: GetReviewsDataOptions = {}): Promise<Review[]> {
  noStore(); 
  const { forAdmin = false } = options;
  
  try {
    const reviewsCol = collection(db, 'reviews');
    let q;

    if (forAdmin) {
      // Admins zien alle reviews, gesorteerd op aanmaakdatum (nieuwste eerst)
      // Ze hebben rechten om alles te lezen via security rules (request.auth.token.admin == true)
      q = query(reviewsCol, orderBy('createdAt', 'desc'));
    } else {
      // Publieke gebruikers zien alleen goedgekeurde reviews
      q = query(reviewsCol, where("isApproved", "==", true), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let dateString = data.date;
      if (data.createdAt && data.createdAt.toDate) {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      }

      reviews.push({
        id: doc.id,
        ...data,
        date: dateString,
      } as Review);
    });
    
    // Als sorteren op 'createdAt' niet werkt omdat het veld niet overal is (oude data),
    // fallback naar sorteren op 'date' client-side (minder ideaal).
    // Dit zou minder nodig moeten zijn als alle data 'createdAt' heeft.
    if (reviews.length > 0 && !reviews.every(r => r.createdAt)) {
        console.warn("[Review Data] Niet alle reviews hebben een 'createdAt' timestamp, fallback naar sorteren op 'date' string.");
        reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews from Firestore:", error);
    return []; 
  }
}

