
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
  omschrijving?: string; // Omschrijving toegevoegd voor potentiele toekomstige data
}

export interface Locatie {
  id: string;
  naam: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
}

export interface GecombineerdeCursus extends Opleiding {
  cursusNaam?: string;
  cursusOmschrijving?: string;
  cursusLink?: string;
  locatieNaam?: string;
  vrijePlekken?: number;
}
