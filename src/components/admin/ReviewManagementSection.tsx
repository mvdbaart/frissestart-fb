
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Trash2, Loader2, DatabaseZap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getReviewsData } from '@/lib/review-data';
import { approveReview, rejectReview, deleteReview } from '@/app/admin/actions';
import { seedDatabaseWithJsonReviews } from '@/app/reviews/actions';
import type { Review } from '@/types/reviews';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

const ITEMS_PER_PAGE = 10;

export function ReviewManagementSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const { toast } = useToast();

  const observer = useRef<IntersectionObserver | null>(null);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReviews = await getReviewsData();
      setReviews(fetchedReviews);
      setVisibleReviewsCount(ITEMS_PER_PAGE); 
    } catch (error) {
      console.error("Error loading reviews for admin:", error);
      toast({ variant: "destructive", title: "Fout", description: "Kon reviewdata niet laden." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const loadMoreReviews = useCallback(() => {
    if (isLoadingMore || visibleReviewsCount >= reviews.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleReviewsCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, visibleReviewsCount, reviews.length]);
  
  const lastReviewElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleReviewsCount < reviews.length) {
        loadMoreReviews();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, loadMoreReviews, visibleReviewsCount, reviews.length]);

  const handleAction = async (action: () => Promise<any>, successMessage: string, errorMessage: string) => {
    try {
      await action();
      toast({ title: "Succes", description: successMessage });
      loadReviews(); 
    } catch (error) {
      console.error(errorMessage, error);
      toast({ variant: "destructive", title: "Fout", description: "Actie mislukt. Controleer console voor details." });
    }
  };

  const handleApprove = (id: string) => handleAction(() => approveReview(id), "Review goedgekeurd.", "Fout bij goedkeuren review:");
  const handleReject = (id: string) => handleAction(() => rejectReview(id), "Review afgekeurd.", "Fout bij afkeuren review:");
  const handleDelete = (id: string) => handleAction(() => deleteReview(id), "Review verwijderd.", "Fout bij verwijderen review:");

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const result = await seedDatabaseWithJsonReviews();
    if (result.success) {
      toast({ title: "Database Gevuld", description: result.message });
      loadReviews(); 
    } else {
      toast({ variant: "destructive", title: "Seed Mislukt", description: result.message });
    }
    setIsSeeding(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy', { locale: nl });
    } catch (e) { return dateString; }
  };

  const getStatusBadge = (isApproved?: boolean) => {
    if (isApproved === true) {
      return <Badge variant="secondary" className="bg-green-100 text-green-700">Goedgekeurd</Badge>;
    }
    if (isApproved === false) {
      return <Badge variant="destructive" className="bg-red-100 text-red-700">Afgekeurd</Badge>;
    }
    return <Badge variant="outline">Nieuw</Badge>;
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Reviewdata laden...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Reviewbeheer</CardTitle>
          <CardDescription>Modereer en beheer ingediende reviews.</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary" disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
              Seed Database (JSON)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Database Seeden?</AlertDialogTitle>
              <AlertDialogDescription>
                Deze actie voegt reviews vanuit de JSON-configuratie toe aan de database.
                Dit is bedoeld als een eenmalige actie of voor testdoeleinden. 
                Herhaaldelijk uitvoeren kan leiden tot dubbele entries. Weet u zeker dat u wilt doorgaan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction onClick={handleSeedDatabase} disabled={isSeeding} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Ja, Seed Database
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Titel</TableHead>
                  <TableHead className="w-[15%]">Reviewer</TableHead>
                  <TableHead className="w-[10%] text-center">Datum</TableHead>
                  <TableHead className="w-[10%] text-center">Rating</TableHead>
                  <TableHead className="w-[15%] text-center">Status</TableHead>
                  <TableHead className="w-[25%] text-center">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.slice(0, visibleReviewsCount).map((review, index) => (
                  <TableRow 
                    key={review.id || `review-${index}`} 
                    ref={index === visibleReviewsCount - 1 ? lastReviewElementRef : null}
                  >
                    <TableCell className="font-medium">{review.title}</TableCell>
                    <TableCell>{review.reviewer_name}</TableCell>
                    <TableCell className="text-center">{formatDate(review.date)}</TableCell>
                    <TableCell className="text-center">{review.rating / 2}/5</TableCell>
                    <TableCell className="text-center">{getStatusBadge(review.isApproved)}</TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleApprove(review.id!)} title="Goedkeuren" className="text-green-600 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleReject(review.id!)} title="Afkeuren" className="text-orange-500 hover:text-orange-600">
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Verwijderen" className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Review Verwijderen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet u zeker dat u de review "{review.title}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(review.id!)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                              Ja, Verwijder
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isLoadingMore && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Meer reviews laden...</span>
              </div>
            )}
          </div>
        ) : (
           <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-primary/70" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Geen reviews gevonden.</p>
            <p className="text-sm text-muted-foreground">De database is leeg of er zijn geen reviews die aan de huidige criteria voldoen.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Beheer hier de zichtbaarheid en inhoud van gebruikersreviews. De "Seed Database" knop is voor initiële data-import.
        </p>
      </CardFooter>
    </Card>
  );
}
