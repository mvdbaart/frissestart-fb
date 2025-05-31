
export interface SubRatings {
  Begeleiding?: number; // Schaal 1-10 in JSON, formulier input is 1-5
  "Heldere communicatie"?: number; // Schaal 1-10 in JSON, formulier input is 1-5
  Enthousiasme?: number; // Schaal 1-10 in JSON, formulier input is 1-5
  Marktkennis?: number; // Schaal 1-10 in JSON, formulier input is 1-5
}

export interface Review {
  date: string;
  rating: number; 
  subratings?: SubRatings;
  reviewer_type?: "Cursist" | "Opdrachtgever" | "Kandidaat" | string; 
  reviewer_name: string;
  title: string;
  review_text: string;
  response?: string;
  recommended?: boolean;
}

