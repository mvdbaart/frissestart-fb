
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Review } from '@/types/reviews';
import { unstable_noStore as noStore } from 'next/cache';

export async function getReviewsData(): Promise<Review[]> {
  noStore(); // Zorgt ervoor dat deze data niet statisch wordt gecached bij de build.
  
  try {
    const reviewsCol = collection(db, 'reviews');
    // Sorteer op 'createdAt' (server timestamp) als beschikbaar en recent, anders op 'date' string.
    // Voor robuuste sortering is het beter om altijd een server timestamp te gebruiken bij het schrijven.
    const q = query(reviewsCol, orderBy('createdAt', 'desc')); 
    const querySnapshot = await getDocs(q);
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Converteer Firestore Timestamp naar ISO string voor 'date' als 'createdAt' wordt gebruikt voor sortering.
      // Of zorg ervoor dat 'date' ook als een Timestamp wordt opgeslagen.
      // Voor nu, ervan uitgaande dat 'date' al een string is en 'createdAt' een Timestamp.
      let dateString = data.date;
      if (data.createdAt && data.createdAt.toDate) {
        dateString = data.createdAt.toDate().toISOString().split('T')[0];
      }

      reviews.push({
        id: doc.id,
        ...data,
        date: dateString, // Overschrijf met geformatteerde datum indien nodig
      } as Review);
    });
    
    // Als sorteren op 'createdAt' niet werkt omdat het veld niet overal is,
    // fallback naar sorteren op 'date' client-side (minder ideaal).
    if (reviews.length > 0 && !reviews.every(r => r.createdAt)) {
        reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews from Firestore:", error);
    // Fallback naar lokale JSON als Firestore faalt? Voor nu lege array.
    // Afhankelijk van de strategie kun je hier de oude JSON-leeslogica toevoegen als fallback.
    return []; 
  }
}
