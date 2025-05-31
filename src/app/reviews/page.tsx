
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ReviewsClientView } from '@/components/reviews/ReviewsClientView';
import type { Review } from '@/types/reviews';
import fs from 'fs/promises';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

async function getReviews(): Promise<Review[]> {
  noStore(); // Zorgt ervoor dat deze data niet statisch wordt gecached bij de build.
  try {
    const filePath = path.join(process.cwd(), 'reviews_20250530_115234.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const reviews = JSON.parse(jsonData) as Review[];
    // Sorteer reviews op datum, nieuwste eerst
    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to read or parse reviews.json:", error);
    return []; // Geef een lege array terug bij een fout
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <SectionContainer className="py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Wat Onze <span className="text-primary">Klanten Zeggen</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Lees de ervaringen van cursisten, opdrachtgevers en kandidaten die voor FrisseStart hebben gekozen.
        </p>
      </div>
      {reviews.length > 0 ? (
        <ReviewsClientView initialReviews={reviews} />
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-xl">Er zijn momenteel geen reviews beschikbaar.</p>
          <p>Kom later terug of neem contact op als u uw ervaring wilt delen!</p>
        </div>
      )}
    </SectionContainer>
  );
}
