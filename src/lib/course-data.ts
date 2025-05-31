
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import type { FirestoreCourseDocument, GecombineerdeCursus } from '@/types/opleidingen';
import { unstable_noStore as noStore } from 'next/cache';
import { format } from 'date-fns';

export async function getCourses(): Promise<GecombineerdeCursus[]> {
  noStore(); // Voorkom statische caching van deze data request
  try {
    const coursesColRef = collection(db, 'courses');
    const nu = Timestamp.now();
    
    // Query voor cursussen die vandaag of in de toekomst plaatsvinden
    // en die gepubliceerd zijn (indien isPublished veld consistent wordt gebruikt)
    const q = query(
        coursesColRef, 
        where('datum', '>=', nu), // Alleen toekomstige/huidige data
        // where('isPublished', '==', true), // Optioneel: als je ongepubliceerde cursussen wilt uitsluiten
        orderBy('datum', 'asc')
    );
    
    const querySnapshot = await getDocs(q);

    const courses: GecombineerdeCursus[] = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data() as FirestoreCourseDocument;
      
      const maxAantal = data.maximumAantal;
      const gereserveerd = data.aantalGereserveerd || 0;
      const vrijePlekken = isNaN(maxAantal) || isNaN(gereserveerd) ? undefined : maxAantal - gereserveerd;

      let datumString = '';
      let datumTimestamp: Timestamp | undefined;
      if (data.datum instanceof Timestamp) {
        const dateObj = data.datum.toDate();
        datumString = format(dateObj, 'yyyy-MM-dd');
        datumTimestamp = data.datum;
      } else {
        // Fallback als datum niet correct is opgeslagen (zou niet moeten gebeuren met de seed)
        console.warn(`[Course Data] Ongeldig datum formaat voor firestoreId ${docSnap.id}`);
        datumString = new Date().toISOString().split('T')[0]; // Gebruik huidige datum als fallback
      }
      
      return {
        firestoreId: docSnap.id,
        opleidingId: data.opleidingId,
        datum: datumString,
        begintijd: data.begintijd,
        eindtijd: data.eindtijd,
        cursusNaam: data.cursusNaam || 'Onbekende Cursus',
        cursusLink: data.cursusLink,
        cursusOmschrijving: data.cursusOmschrijving,
        locatieNaam: data.locatieNaam || 'Onbekende Locatie',
        inkoopprijs: data.inkoopprijs?.toString(),
        verkoopprijs: data.verkoopprijs.toString(),
        SOOB: data.SOOB?.toString(),
        puntenCode95: data.puntenCode95?.toString(),
        branche: data.branche,
        instructeur: data.instructeur,
        maximumAantal: data.maximumAantal.toString(),
        aantalGereserveerd: gereserveerd.toString(),
        vrijePlekken: vrijePlekken,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        datumTimestamp: datumTimestamp,
      };
    });
    return courses;
  } catch (error) {
    console.error("Error fetching courses from Firestore:", error);
    return [];
  }
}

