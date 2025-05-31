
import type { Timestamp } from 'firebase/firestore';

export interface Opleiding {
  id: string;
  datum: string; // Blijft string voor JSON parsing, wordt Timestamp in Firestore
  begintijd: string;
  eindtijd: string;
  cursus_id: string;
  locatie_id: string;
  opdrachtgever_id: string | null;
  inkoopprijs: string; // Wordt number in Firestore
  verkoopprijs: string; // Wordt number in Firestore
  SOOB: string; // Wordt number in Firestore
  punten_code95: string; // Wordt number in Firestore
  branche: string;
  instructeur: string | null;
  instructeur_id: string | null;
  maximum_aantal: string; // Wordt number in Firestore
  aantal_gereserveerd?: string; // Wordt number in Firestore
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

// Dit type blijft nuttig voor de weergave, ook met Firestore data
export interface GecombineerdeCursus extends Opleiding {
  firestoreId?: string; // ID van het document in Firestore
  cursusNaam?: string;
  cursusOmschrijving?: string;
  cursusLink?: string;
  locatieNaam?: string;
  vrijePlekken?: number;
  // Velden die mogelijk als Timestamp in Firestore staan, maar als string of Date object hier
  datumTimestamp?: Timestamp; // Voor interne verwerking indien nodig
  isPublished?: boolean; // Voor beheer
}

// Nieuw type voor Firestore documenten
export interface FirestoreCourseDocument {
  opleidingId: string; // Oorspronkelijke ID uit opleidingen.json
  datum: Timestamp;
  begintijd: string;
  eindtijd: string;
  cursusId: string;
  cursusNaam?: string;
  cursusLink?: string;
  cursusOmschrijving?: string;
  locatieId: string;
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
  // vrijePlekken wordt idealiter dynamisch berekend of is een veld dat je expliciet update
  isPublished: boolean; // Standaardwaarde in seed functie
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

