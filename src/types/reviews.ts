
export interface SubRatings {
  Begeleiding?: number; 
  "Heldere communicatie"?: number; 
  Enthousiasme?: number; 
  Marktkennis?: number; 
}

export interface Review {
  id?: string; // Firestore document ID (optioneel, wordt automatisch gegenereerd)
  date: string; // Blijft string voor consistentie met form & JSON, kan Firestore Timestamp zijn
  rating: number; // Schaal 1-10
  subratings?: SubRatings; // Schaal 1-10
  reviewer_type?: "Cursist" | "Opdrachtgever" | "Kandidaat" | string;
  reviewer_name: string;
  title: string;
  review_text: string;
  response?: string;
  recommended?: boolean;
  createdAt?: any; // Voor Firestore serverTimestamp
}
