
import type { Timestamp } from 'firebase/firestore';

export interface Opleiding {
  // Deze interface is nu minder relevant voor de hoofddataflow,
  // maar kan nog gebruikt worden als type voor de externe API indien nodig.
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

// Herziene GecombineerdeCursus voor data uit Firestore
export interface GecombineerdeCursus {
  firestoreId: string; 
  opleidingId: string; 
  datum: string; // YYYY-MM-DD string
  begintijd: string;
  eindtijd: string;
  cursusNaam?: string;
  cursusLink?: string;
  cursusOmschrijving?: string;
  locatieNaam?: string;
  inkoopprijs?: string;
  verkoopprijs: string;
  SOOB?: string;
  puntenCode95?: string;
  branche?: string;
  instructeur?: string | null;
  maximumAantal: string;
  aantalGereserveerd?: string;
  vrijePlekken?: number;
  isPublished?: boolean;
  // Velden die specifiek van Firestore komen en nuttig kunnen zijn:
  datumTimestamp?: Timestamp; // De originele Firestore Timestamp voor preciezere filtering/sortering
}

export interface PlanningEntry {
  Datum: string;
  Begin: string;
  Eind: string;
  Cursus: string;
  Locatie: string;
  Inkoopprijs: string;
  VerkoopPrijs: string;
  SOOB: string;
  "Punten Code95": number;
  Branche: string;
  Instructeur: string;
  maximum_aantal: number;
  aantal_gereserveerd: number;
}

export interface FirestoreCourseDocument {
  opleidingId: string; 
  datum: Timestamp;
  begintijd: string;
  eindtijd: string;
  cursusId?: string; 
  cursusNaam?: string;
  cursusLink?: string;
  cursusOmschrijving?: string;
  locatieId?: string; 
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

