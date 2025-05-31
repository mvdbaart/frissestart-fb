
export interface SubRatings {
  Begeleiding?: number;
  "Heldere communicatie"?: number;
  Enthousiasme?: number;
  Marktkennis?: number;
}

export interface Review {
  date: string;
  rating: number; // Gaat 1-10 zijn, omzetten naar 1-5 voor sterren.
  subratings?: SubRatings;
  reviewer_type?: "Cursist" | "Opdrachtgever" | "Kandidaat" | string; // Specifiekere types + fallback
  reviewer_name: string;
  title: string;
  review_text: string;
  response?: string;
  recommended?: boolean;
}

