
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAndCache } from '@/lib/cache';
import type { Opleiding, CursusDetail, Locatie, GecombineerdeCursus } from '@/types/opleidingen';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OPLEIDINGEN_CACHE_KEY = 'opleidingen_data_v1';
const CURSUS_DETAILS_CACHE_KEY = 'cursus_details_data_v1';
const LOCATIES_CACHE_KEY = 'locaties_data_v1';

export function CourseManagementSection() {
  const [courses, setCourses] = useState<GecombineerdeCursus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      try {
        const [opleidingenData, cursusDetailsData, locatiesData] = await Promise.all([
          fetchAndCache<Opleiding>('https://opleidingen.frissestart.nl/wp-json/mo/v1/opleidingen', OPLEIDINGEN_CACHE_KEY),
          fetchAndCache<CursusDetail>('https://opleidingen.frissestart.nl/wp-json/mo/v1/cursussen', CURSUS_DETAILS_CACHE_KEY),
          fetchAndCache<Locatie>('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties', LOCATIES_CACHE_KEY),
        ]);

        const tempCursusDetailsMap = new Map<string, CursusDetail>();
        cursusDetailsData.forEach(detail => tempCursusDetailsMap.set(detail.id.toString(), detail));

        const tempLocatiesMap = new Map<string, Locatie>();
        locatiesData.forEach(locatie => tempLocatiesMap.set(locatie.id.toString(), locatie));

        const combined = opleidingenData.map(opleiding => {
          const detail = tempCursusDetailsMap.get(opleiding.cursus_id);
          const locatie = tempLocatiesMap.get(opleiding.locatie_id);
          const maxAantal = parseInt(opleiding.maximum_aantal, 10);
          const gereserveerd = parseInt(opleiding.aantal_gereserveerd || '0', 10);
          const vrijePlekken = isNaN(maxAantal) || isNaN(gereserveerd) ? undefined : maxAantal - gereserveerd;
          return {
            ...opleiding,
            cursusNaam: detail?.naam || `Cursus ID: ${opleiding.cursus_id}`,
            cursusLink: detail?.link,
            locatieNaam: locatie?.naam || `Locatie ID: ${opleiding.locatie_id}`,
            vrijePlekken,
          };
        }).sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
        setCourses(combined);
      } catch (error) {
        console.error("Error loading course data for admin:", error);
        toast({ variant: "destructive", title: "Fout", description: "Kon cursusdata niet laden." });
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [toast]);

  const handleAddNewCourse = () => {
    toast({ title: "Info", description: "Functionaliteit 'Nieuwe Cursus Toevoegen' is nog niet geïmplementeerd." });
  };

  const handleEditCourse = (courseId: string) => {
    toast({ title: "Info", description: `Functionaliteit 'Bewerk Cursus ${courseId}' is nog niet geïmplementeerd.` });
  };

  const handleDeleteCourse = (courseId: string) => {
    toast({ title: "Info", description: `Functionaliteit 'Verwijder Cursus ${courseId}' is nog niet geïmplementeerd.` });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Cursusdata laden...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Cursusbeheer</CardTitle>
          <CardDescription>Beheer hier alle cursussen, data en locaties.</CardDescription>
        </div>
        <Button onClick={handleAddNewCourse} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Cursus
        </Button>
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
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.cursusNaam}</TableCell>
                    <TableCell>{new Date(course.datum).toLocaleDateString('nl-NL')}</TableCell>
                    <TableCell>{course.locatieNaam}</TableCell>
                    <TableCell className="text-right">{parseFloat(course.verkoopprijs).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{course.vrijePlekken ?? 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course.id)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">Geen cursussen gevonden of data kon niet geladen worden.</p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Let op: Het direct bewerken of verwijderen van cursussen via deze interface is nog niet geïmplementeerd.
          De cursusdata wordt momenteel extern beheerd.
        </p>
      </CardFooter>
    </Card>
  );
}
