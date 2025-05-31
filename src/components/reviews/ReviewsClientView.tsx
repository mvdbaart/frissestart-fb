
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Review } from '@/types/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ReviewsClientViewProps {
  initialReviews: Review[];
}

const ITEMS_PER_PAGE = 9;

export function ReviewsClientView({ initialReviews }: ReviewsClientViewProps) {
  const [reviewsToShow, setReviewsToShow] = useState<Review[]>(initialReviews.slice(0, ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreReviews = useCallback(() => {
    if (isLoading || (currentPage * ITEMS_PER_PAGE) >= initialReviews.length) return;

    setIsLoading(true);
    setTimeout(() => { // Simulate network delay for UX
      const nextPage = currentPage + 1;
      const newReviews = initialReviews.slice(0, nextPage * ITEMS_PER_PAGE);
      setReviewsToShow(newReviews);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 500);
  }, [currentPage, initialReviews, isLoading]);

  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && (currentPage * ITEMS_PER_PAGE) < initialReviews.length) {
          loadMoreReviews();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreReviews, currentPage, initialReviews.length]
  );

  useEffect(() => {
    // Reset when initialReviews change, though not expected in this setup
    setReviewsToShow(initialReviews.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [initialReviews]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {reviewsToShow.map((review, index) => {
          if (reviewsToShow.length === index + 1) {
            return (
              <div ref={lastReviewElementRef} key={review.date + review.reviewer_name + index}>
                <ReviewCard review={review} />
              </div>
            );
          }
          return <ReviewCard key={review.date + review.reviewer_name + index} review={review} />;
        })}
      </div>
      {isLoading && (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3 text-primary" />
          <span>Meer reviews laden...</span>
        </div>
      )}
      {!isLoading && (currentPage * ITEMS_PER_PAGE) >= initialReviews.length && reviewsToShow.length > 0 && (
        <p className="text-center text-muted-foreground mt-12">U heeft alle reviews bekeken.</p>
      )}
    </div>
  );
}
