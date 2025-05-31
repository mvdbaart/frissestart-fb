
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, writeBatch, getDocs, query, where, limit } from 'firebase/firestore';
import type { Review, SubRatings } from '@/types/reviews';

// Deze data is gebaseerd op de structuur van reviews_20250530_115234.json
// Voor een productie-oplossing zou je dit bestand direct inlezen.
// Hier wordt een subset of de volledige data hardcoded voor de AI Prototyper.
const reviewsSeedData: Omit<Review, 'id' | 'createdAt'>[] = [
  // !!BELANGRIJK!! Vervang deze voorbeelddata met de VOLLEDIGE inhoud van je reviews_20250530_115234.json bestand
  {
    "date": "2024-11-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Fabian",
    "title": "Positieve dag",
    "review_text": "Erg aandachtig naar ons geweest goed met zijn werk bezig",
    "response": "Hartelijk dank voor je reactie en wat fijn dat je het zo positief hebt ervaren. Hopelijk tot de volgende keer!",
    "recommended": true
  },
  {
    "date": "2024-11-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Koopman",
    "title": "Goede uitleg voor theorie en leuke oefenjngen in de praktijk",
    "review_text": "Toffe instructeur met humor! Goede en krachtige uitleg. Na de praktijk oefeningen was een toelichting misschien nog goed geweest om kennis overdracht nog beter over te laten komen. Dit bedoel ik eerder als een toevoeging dan een min punt.",
    "response": "Hartelijk dank voor je reactie en je toevoeging, uiteraard nemen we deze mee voor de volgende keer!",
    "recommended": true
  },
  // ... (Voeg hier AL je andere review objecten uit de JSON toe) ...
  {
    "date": "2021-01-18",
    "rating": 10,
    "reviewer_name": "Aanhef", // "Aanhef" wordt vaak "Anoniem" of de echte naam
    "title": "Guido vd Velden",
    "review_text": "Frisse start heeft mij als werkgever al meerdere malen bewezen dat zij de juiste mensen op de juiste plek krijgen. Helder in de commicatie en duidelijke afspraken.",
    "recommended": true
    // subratings en response kunnen optioneel zijn
  }
];

export async function seedDatabaseWithJsonReviews(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const reviewsCollection = collection(db, 'reviews');
    // Doe een snelle check om te zien of er al veel data is.
    // Dit is niet waterdicht tegen duplicaten bij herhaaldelijk uitvoeren, maar een simpele preventie.
    const quickCheckQuery = query(reviewsCollection, limit(reviewsSeedData.length > 0 ? Math.min(10, reviewsSeedData.length) : 1));
    const snapshot = await getDocs(quickCheckQuery);

    if (!snapshot.empty && snapshot.docs.length >= Math.min(5, reviewsSeedData.length)) { // Als er al een paar items zijn, en de seed data is niet leeg.
      console.log('[SEED] Database lijkt al gevuld te zijn. Seeding overgeslagen om significante duplicatie te voorkomen.');
      return { success: false, message: 'Database lijkt al gevuld te zijn. Seeding niet opnieuw uitgevoerd.' };
    }

    const batch = writeBatch(db);
    let importedCount = 0;

    for (const review of reviewsSeedData) {
      const { date, rating, subratings, reviewer_type, reviewer_name, title, review_text, response, recommended } = review;
      
      let createdAtTimestamp: Timestamp;
      try {
        // Probeer de datum te parsen. Wees flexibel met het formaat als nodig.
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Ongeldige datum: ${date}`);
        }
        createdAtTimestamp = Timestamp.fromDate(parsedDate);
      } catch (e) {
        console.warn(`[SEED] Ongeldig datumformaat voor review "${title}": ${date}. Huidige datum wordt gebruikt. Error: ${(e as Error).message}`);
        createdAtTimestamp = Timestamp.now();
      }

      const reviewDocRef = collection(db, 'reviews').doc(); 

      const subratingsToStore: Partial<SubRatings> = {}; // Gebruik Partial omdat niet alle subratings aanwezig hoeven te zijn
      if (subratings) {
        if (subratings.Begeleiding !== undefined) subratingsToStore.Begeleiding = subratings.Begeleiding;
        if (subratings["Heldere communicatie"] !== undefined) subratingsToStore["Heldere communicatie"] = subratings["Heldere communicatie"];
        if (subratings.Enthousiasme !== undefined) subratingsToStore.Enthousiasme = subratings.Enthousiasme;
        if (subratings.Marktkennis !== undefined) subratingsToStore.Marktkennis = subratings.Marktkennis;
      }
      
      batch.set(reviewDocRef, {
        date, 
        rating, 
        subratings: Object.keys(subratingsToStore).length > 0 ? subratingsToStore : null,
        reviewer_type: reviewer_type || "Anoniem",
        reviewer_name: reviewer_name || "Anoniem",
        title,
        review_text,
        response: response || null,
        recommended: recommended !== undefined ? recommended : (typeof rating === 'number' && rating >= 7), // Rating is 1-10
        createdAt: createdAtTimestamp,
      });
      importedCount++;
    }

    if (importedCount === 0 && reviewsSeedData.length > 0) {
      console.warn("[SEED] Geen reviews om te importeren uit de seed data, of de data was leeg.");
      return { success: false, message: "Geen reviews gevonden in de seed data om te importeren."};
    }
    if (importedCount === 0 && reviewsSeedData.length === 0) {
      console.warn("[SEED] Seed data is leeg, geen actie ondernomen.");
       return { success: true, message: "Seed data was leeg. Geen reviews geïmporteerd.", count: 0 };
    }


    await batch.commit();
    console.log(`[SEED] Succesvol ${importedCount} reviews geïmporteerd in Firestore.`);
    return { success: true, message: `Succesvol ${importedCount} reviews geïmporteerd in de database.`, count: importedCount };
  } catch (error) {
    console.error("[SEED] Error seeding database with JSON reviews:", error);
    let errorMessage = "Fout bij het importeren van reviews.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Specifieke foutmelding voor permissies
    if (errorMessage.includes("PERMISSION_DENIED")) {
        errorMessage = "Permission denied. Controleer uw Firestore security rules. Schrijfacties zijn mogelijk niet toegestaan. Details: " + errorMessage;
    }
    return { success: false, message: errorMessage };
  }
}
