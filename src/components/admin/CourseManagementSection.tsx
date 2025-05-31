
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Loader2, DatabaseZap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GecombineerdeCursus, FirestoreCourseDocument } from '@/types/opleidingen';
import { collection, getDocs, orderBy, query, Timestamp, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteCourse, seedCoursesToFirestore } from '@/app/admin/actions';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function CourseManagementSection() {
  const [courses, setCourses] = useState<GecombineerdeCursus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const loadCoursesFromFirestore = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesColRef = collection(db, 'courses');
      const q = query(coursesColRef, orderBy('datum', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedCourses: GecombineerdeCursus[] = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as FirestoreCourseDocument;
        const maxAantal = data.maximumAantal;
        const gereserveerd = data.aantalGereserveerd || 0;
        const vrijePlekken = isNaN(maxAantal) || isNaN(gereserveerd) ? undefined : maxAantal - gereserveerd;

        return {
          // Map Firestore document naar GecombineerdeCursus structuur voor de tabel
          firestoreId: docSnap.id,
          id: data.opleidingId, // Behoud originele ID voor consistentie indien nodig
          datum: data.datum.toDate().toISOString().split('T')[0], // Converteer Timestamp naar YYYY-MM-DD string
          begintijd: data.begintijd,
          eindtijd: data.eindtijd,
          cursus_id: data.cursusId,
          locatie_id: data.locatieId,
          opdrachtgever_id: data.opdrachtgeverId || null,
          inkoopprijs: data.inkoopprijs?.toString() || '0',
          verkoopprijs: data.verkoopprijs.toString(),
          SOOB: data.SOOB?.toString() || '0',
          punten_code95: data.puntenCode95?.toString() || '0',
          branche: data.branche || '',
          instructeur: data.instructeur || null,
          instructeur_id: data.instructeurId || null,
          maximum_aantal: data.maximumAantal.toString(),
          aantal_gereserveerd: gereserveerd.toString(),
          cursusNaam: data.cursusNaam,
          cursusLink: data.cursusLink,
          cursusOmschrijving: data.cursusOmschrijving,
          locatieNaam: data.locatieNaam,
          vrijePlekken,
          isPublished: data.isPublished,
        };
      });
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error loading course data from Firestore:", error);
      toast({ variant: "destructive", title: "Fout", description: "Kon cursusdata niet laden vanuit Firestore." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCoursesFromFirestore();
  }, [loadCoursesFromFirestore]);

  const handleAddNewCourse = () => {
    toast({ title: "Info", description: "Functionaliteit 'Nieuwe Cursus Toevoegen' is nog niet geïmplementeerd." });
  };

  const handleEditCourse = (courseId: string) => {
    toast({ title: "Info", description: `Functionaliteit 'Bewerk Cursus ${courseId}' is nog niet geïmplementeerd.` });
  };

  const handleDeleteCourse = async (courseDocId?: string) => {
    if (!courseDocId) {
        toast({variant: "destructive", title: "Fout", description: "Geen Firestore document ID beschikbaar om te verwijderen."});
        return;
    }
    const result = await deleteCourse(courseDocId);
    if (result.success) {
      toast({ title: "Succes", description: "Cursus verwijderd uit Firestore." });
      loadCoursesFromFirestore(); // Herlaad de lijst
    } else {
      toast({ variant: "destructive", title: "Fout bij Verwijderen", description: result.error });
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const result = await seedCoursesToFirestore();
    if (result.success) {
      toast({ title: "Database Seeding Succesvol", description: result.message });
      loadCoursesFromFirestore(); 
    } else {
      toast({ variant: "destructive", title: "Database Seeding Mislukt", description: result.message });
    }
    setIsSeeding(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd-MM-yyyy', { locale: nl });
    } catch (e) { return dateString; }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Cursusdata laden uit Firestore...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <CardTitle>Cursusbeheer (Firestore)</CardTitle>
          <CardDescription>Beheer hier alle cursussen, data en locaties uit de database.</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleAddNewCourse} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Cursus
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary w-full sm:w-auto" disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
                Seed Cursussen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cursus Database Seeden?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deze actie leest data uit de lokale JSON bestanden (opleidingen.json, etc.) en schrijft deze naar de 'courses' collectie in Firestore. 
                  Als de collectie al items bevat, wordt het seeden overgeslagen om duplicaten te voorkomen. Weet u zeker dat u wilt doorgaan?
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
        </div>
      </CardHeader>
      <CardContent>
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cursusnaam</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Locatie</TableHead>
                  <TableHead className="text-right">Prijs (€)</TableHead>
                  <TableHead className="text-right">Vrije Plekken</TableHead>
                  <TableHead className="text-center">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.firestoreId || course.id}>
                    <TableCell className="font-medium">{course.cursusNaam}</TableCell>
                    <TableCell>{formatDate(course.datum)}</TableCell>
                    <TableCell>{course.locatieNaam}</TableCell>
                    <TableCell className="text-right">{parseFloat(course.verkoopprijs).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{course.vrijePlekken ?? 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course.firestoreId || course.id)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cursus Verwijderen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet u zeker dat u de cursus "{course.cursusNaam}" op {formatDate(course.datum)} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course.firestoreId)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
          </div>
        ) : (
           <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-primary/70" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Geen cursussen gevonden in Firestore.</p>
            <p className="text-sm text-muted-foreground">Overweeg de database te seeden met de "Seed Cursussen" knop.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Cursussen worden nu beheerd in Firestore. De "Seed Cursussen" knop importeert data vanuit lokale JSON-bestanden.
        </p>
      </CardFooter>
    </Card>
  );
}
