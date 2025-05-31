
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ReviewsClientView } from '@/components/reviews/ReviewsClientView';
import { getReviewsData } from '@/lib/review-data'; // Gewijzigde import
import type { Review } from '@/types/reviews';

export default async function ReviewsPage() {
  const reviews = await getReviewsData(); // Gebruik de nieuwe functie

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
