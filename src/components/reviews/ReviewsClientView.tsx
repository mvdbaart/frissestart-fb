
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Review, SubRatings } from '@/types/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Send, Star as StarIcon, DatabaseZap, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { seedDatabaseWithJsonReviews } from '@/app/reviews/actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


interface ReviewsClientViewProps {
  initialReviews: Review[];
}

const ITEMS_PER_PAGE = 9;

const subratingSchema = z.number().min(0).max(5).optional().default(0);

const reviewFormSchema = z.object({
  reviewer_name: z.string().min(2, { message: "Naam is verplicht (min. 2 karakters)." }),
  reviewer_type: z.enum(["Cursist", "Opdrachtgever", "Kandidaat"], { required_error: "Selecteer uw type." }),
  title: z.string().min(5, { message: "Titel is verplicht (min. 5 karakters)." }),
  review_text: z.string().min(20, { message: "Reviewtekst is verplicht (min. 20 karakters)." }).max(1000, {message: "Maximale lengte is 1000 karakters."}),
  rating: z.number().min(1,{ message: "Beoordeling is verplicht." }).max(5, { message: "Beoordeling tussen 1 en 5 sterren." }),
  subratings: z.object({
    Begeleiding: subratingSchema,
    "Heldere communicatie": subratingSchema,
    Enthousiasme: subratingSchema,
    Marktkennis: subratingSchema,
  }).optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
}

function StarRatingInput({ value, onChange, maxStars = 5 }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={starValue}
            className={cn(
              "h-7 w-7 cursor-pointer transition-colors",
              value >= starValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300"
            )}
            onClick={() => onChange(starValue)}
          />
        );
      })}
    </div>
  );
}

export function ReviewsClientView({ initialReviews }: ReviewsClientViewProps) {
  const [reviewsToShow, setReviewsToShow] = useState<Review[]>(initialReviews.slice(0, ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false); // Gebruikt voor zowel review formulier als seed knop
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
      subratings: {
        Begeleiding: 0,
        "Heldere communicatie": 0,
        Enthousiasme: 0,
        Marktkennis: 0,
      }
    },
  });

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    setIsSubmittingReview(true);
    try {
      const subratingsToSave: Partial<SubRatings> = {};
      if (data.subratings) {
        for (const key in data.subratings) {
          const typedKey = key as keyof SubRatings;
          if (data.subratings[typedKey] && data.subratings[typedKey]! > 0) {
            subratingsToSave[typedKey] = (data.subratings[typedKey] || 0) * 2; // Schaal 1-5 naar 1-10
          }
        }
      }

      const reviewDataToSave: Omit<Review, 'id' > = {
        reviewer_name: data.reviewer_name,
        reviewer_type: data.reviewer_type,
        title: data.title,
        review_text: data.review_text,
        rating: data.rating * 2, // Schaal 1-5 naar 1-10 voor opslag
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        recommended: data.rating >= 4, // Bepaald o.b.v. 1-5 schaal
        subratings: Object.keys(subratingsToSave).length > 0 ? subratingsToSave : undefined,
      };

      await addDoc(collection(db, "reviews"), reviewDataToSave);

      toast({
        title: "Review Succesvol Ingediend!",
        description: "Bedankt voor uw feedback. Uw review wordt zo snel mogelijk verwerkt.",
      });
      form.reset();
      setIsFormVisible(false);
      // Idealiter zou je de reviewlijst hier refreshen of de nieuwe review optimistisch toevoegen.
      // Voor nu: een refresh van de pagina is nodig om de nieuwe review direct te zien.
    } catch (error) {
      console.error("Error submitting review to Firestore:", error);
      toast({
        variant: "destructive",
        title: "Fout bij indienen review",
        description: "Er is iets misgegaan. Probeer het later opnieuw.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  const handleSeedDatabase = async () => {
    setIsSubmittingReview(true);
    try {
      const result = await seedDatabaseWithJsonReviews();
      if (result.success) {
        toast({
          title: "Database Gevuld!",
          description: result.message + " Refresh de pagina om de wijzigingen te zien.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Database Vullen Mislukt",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        variant: "destructive",
        title: "Fout bij Vullen Database",
        description: "Er is een onbekende fout opgetreden.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
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

  const subratingLabels: (keyof SubRatings)[] = ["Begeleiding", "Heldere communicatie", "Enthousiasme", "Marktkennis"];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button onClick={() => setIsFormVisible(!isFormVisible)} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <PlusCircle className="mr-2 h-5 w-5" />
          {isFormVisible ? 'Sluit Formulier' : 'Review Achterlaten'}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="destructive" className="bg-orange-600 hover:bg-orange-700 text-white">
              <DatabaseZap className="mr-2 h-5 w-5" />
              Seed Database (JSON)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-destructive mr-2 h-6 w-6"/>Database Seeden</AlertDialogTitle>
              <AlertDialogDescription>
                Deze actie zal de database vullen met de reviews uit het JSON-bestand. 
                Als de database al reviews bevat, kunnen er duplicaten ontstaan. 
                Weet u zeker dat u wilt doorgaan? Dit is bedoeld als een eenmalige actie.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSeedDatabase} 
                disabled={isSubmittingReview}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isSubmittingReview ? <Loader2 className="animate-spin" /> : "Ja, Seed Database"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                      <FormLabel>Algemene Beoordeling (1-5 sterren)</FormLabel>
                      <FormControl>
                        <StarRatingInput value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4 pt-4 border-t">
                  <FormLabel className="text-md font-medium">Specifieke Beoordelingen (optioneel, 1-5 sterren)</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {subratingLabels.map((subKey) => (
                      <FormField
                        key={subKey}
                        control={form.control}
                        name={`subratings.${subKey}` as const} // Zorg dat de name correct is voor RHF
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-muted-foreground">{subKey}</FormLabel>
                            <FormControl>
                               <StarRatingInput value={field.value || 0} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

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
          const key = review.id || `${review.date}-${review.reviewer_name}-${index}`;
          if (reviewsToShow.length === index + 1) {
            return (
              <div ref={lastReviewElementRef} key={key}>
                <ReviewCard review={review} />
              </div>
            );
          }
          return <ReviewCard key={key} review={review} />;
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
       {initialReviews.length === 0 && !isLoadingMore && (
        <Card className="text-center py-12 shadow-lg col-span-full">
          <CardHeader>
              <DatabaseZap className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl font-semibold text-foreground">Database is Leeg</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Er zijn nog geen reviews in de database.</p>
            <p className="text-md text-muted-foreground mt-2">Gebruik de "Seed Database (JSON)" knop om de database te vullen met de initiële reviews.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
