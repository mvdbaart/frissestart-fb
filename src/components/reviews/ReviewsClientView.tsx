
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Review } from '@/types/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Send, Star as StarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface ReviewsClientViewProps {
  initialReviews: Review[];
}

const ITEMS_PER_PAGE = 9;

const reviewFormSchema = z.object({
  reviewer_name: z.string().min(2, { message: "Naam is verplicht (min. 2 karakters)." }),
  reviewer_type: z.enum(["Cursist", "Opdrachtgever", "Kandidaat"], { required_error: "Selecteer uw type." }),
  title: z.string().min(5, { message: "Titel is verplicht (min. 5 karakters)." }),
  review_text: z.string().min(20, { message: "Reviewtekst is verplicht (min. 20 karakters)." }).max(1000, {message: "Maximale lengte is 1000 karakters."}),
  rating: z.number().min(1).max(5, { message: "Beoordeling tussen 1 en 5 sterren." }),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export function ReviewsClientView({ initialReviews }: ReviewsClientViewProps) {
  const [reviewsToShow, setReviewsToShow] = useState<Review[]>(initialReviews.slice(0, ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const { toast } = useToast();
  const observer = useRef<IntersectionObserver | null>(null);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewer_name: "",
      reviewer_type: undefined,
      title: "",
      review_text: "",
      rating: 0,
    },
  });

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    setIsSubmittingReview(true);
    // Simulate API call - In a real app, this would send data to a backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Nieuwe review data:", {
      ...data,
      date: new Date().toISOString().split('T')[0], //YYYY-MM-DD
      // subratings: {}, // Voor nu leeg
      // recommended: true, // Standaardwaarde, kan aangepast
    });

    toast({
      title: "Review Ontvangen!",
      description: "Bedankt voor uw review. Deze wordt zo snel mogelijk bekeken.",
    });
    
    form.reset();
    setIsFormVisible(false);
    setIsSubmittingReview(false);
  };

  const loadMoreReviews = useCallback(() => {
    if (isLoadingMore || (currentPage * ITEMS_PER_PAGE) >= initialReviews.length) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newReviews = initialReviews.slice(0, nextPage * ITEMS_PER_PAGE);
      setReviewsToShow(newReviews);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  }, [currentPage, initialReviews, isLoadingMore]);

  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && (currentPage * ITEMS_PER_PAGE) < initialReviews.length) {
          loadMoreReviews();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, loadMoreReviews, currentPage, initialReviews.length]
  );

  useEffect(() => {
    setReviewsToShow(initialReviews.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [initialReviews]);

  return (
    <div>
      <div className="mb-8 text-center">
        <Button onClick={() => setIsFormVisible(!isFormVisible)} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <PlusCircle className="mr-2 h-5 w-5" />
          {isFormVisible ? 'Sluit Formulier' : 'Review Achterlaten'}
        </Button>
      </div>

      {isFormVisible && (
        <Card className="mb-12 shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Deel uw ervaring</CardTitle>
            <CardDescription>We waarderen uw feedback!</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="reviewer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uw Naam</FormLabel>
                        <FormControl>
                          <Input placeholder="Uw volledige naam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reviewer_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ik ben een...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer uw type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cursist">Cursist</SelectItem>
                            <SelectItem value="Opdrachtgever">Opdrachtgever</SelectItem>
                            <SelectItem value="Kandidaat">Kandidaat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titel van uw review</FormLabel>
                        <FormControl>
                          <Input placeholder="Korte samenvatting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="review_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uw Review</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Vertel ons over uw ervaring..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beoordeling (1-5 sterren)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={cn(
                                "h-7 w-7 cursor-pointer transition-colors",
                                field.value >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300"
                              )}
                              onClick={() => field.onChange(star)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmittingReview} size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verzenden...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Verstuur Review
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

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
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3 text-primary" />
          <span>Meer reviews laden...</span>
        </div>
      )}
      {!isLoadingMore && (currentPage * ITEMS_PER_PAGE) >= initialReviews.length && reviewsToShow.length > 0 && (
        <p className="text-center text-muted-foreground mt-12">U heeft alle reviews bekeken.</p>
      )}
    </div>
  );
}

