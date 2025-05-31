
import type { Timestamp } from 'firebase/firestore';

export interface Opleiding {
  id: string;
  datum: string; 
  begintijd: string;
  eindtijd: string;
  cursus_id: string;
  locatie_id: string;
  opdrachtgever_id: string | null;
  inkoopprijs: string; 
  verkoopprijs: string; 
  SOOB: string; 
  punten_code95: string; 
  branche: string;
  instructeur: string | null;
  instructeur_id: string | null;
  maximum_aantal: string; 
  aantal_gereserveerd?: string; 
}

export interface CursusDetail {
  id: string;
  naam: string;
  link?: string;
  max_deelnemers?: string;
  omschrijving?: string;
}

export interface Locatie {
  id: string;
  naam: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
}

export interface GecombineerdeCursus extends Opleiding {
  firestoreId?: string; 
  cursusNaam?: string;
  cursusOmschrijving?: string;
  cursusLink?: string;
  locatieNaam?: string;
  vrijePlekken?: number;
  kortingsPrijs?: string;
  originelePrijs?: string;
  datumTimestamp?: Timestamp; 
  isPublished?: boolean; 
}

// Type voor het nieuwe JSON formaat
export interface PlanningEntry {
  Datum: string;
  Begin: string;
  Eind: string;
  Cursus: string;
  Locatie: string;
  Inkoopprijs: string;
  VerkoopPrijs: string;
  SOOB: string;
  "Punten Code95": number; // Key met spatie
  Branche: string;
  Instructeur: string;
  maximum_aantal: number;
  aantal_gereserveerd: number;
}

export interface FirestoreCourseDocument {
  opleidingId: string; // Uniek ID per cursus-event, gegenereerd als het niet in bron zit
  datum: Timestamp;
  begintijd: string;
  eindtijd: string;
  cursusId?: string; // Optioneel als het niet direct uit de nieuwe bron komt
  cursusNaam?: string;
  cursusLink?: string;
  cursusOmschrijving?: string;
  locatieId?: string; // Optioneel
  locatieNaam?: string;
  opdrachtgeverId?: string | null;
  inkoopprijs?: number;
  verkoopprijs: number;
  SOOB?: number;
  puntenCode95?: number;
  branche?: string;
  instructeur?: string | null;
  instructeurId?: string | null;
  maximumAantal: number;
  aantalGereserveerd?: number;
  isPublished: boolean; 
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
