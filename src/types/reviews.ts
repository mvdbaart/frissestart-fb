
export interface SubRatings {
  Begeleiding?: number;
  "Heldere communicatie"?: number;
  Enthousiasme?: number;
  Marktkennis?: number; // Toegevoegd op basis van data
}

export interface Review {
  date: string;
  rating: number;
  subratings?: SubRatings; // Optioneel gemaakt
  reviewer_type?: string; // Optioneel gemaakt
  reviewer_name: string;
  title: string;
  review_text: string;
  response?: string; // Optioneel gemaakt
  recommended?: boolean; // Optioneel gemaakt
}
