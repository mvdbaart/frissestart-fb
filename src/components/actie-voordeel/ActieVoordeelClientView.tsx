
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart3, Zap, BookOpen, MapPinIcon, EuroIcon, TagIcon, AlertTriangle } from 'lucide-react';
import type { GecombineerdeCursus } from '@/types/opleidingen';
import { format, parseISO, addDays } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ActieVoordeelClientViewProps {
  initialCourses: GecombineerdeCursus[];
}

export function ActieVoordeelClientView({ initialCourses }: ActieVoordeelClientViewProps) {
  
  const actieCursussen: GecombineerdeCursus[] = useMemo(() => {
    const nu = new Date();
    nu.setHours(0, 0, 0, 0); // Begin van de huidige dag

    const grensDatum = addDays(nu, 31); // Eind van de 31e dag (inclusief vandaag)
    grensDatum.setHours(23, 59, 59, 999);

    return initialCourses
      .map(course => {
        if (!course.verkoopprijs) return { ...course, kortingsPrijs: course.verkoopprijs, originelePrijs: course.verkoopprijs };
        
        const originelePrijs = parseFloat(course.verkoopprijs);
        const kortingsPrijs = !isNaN(originelePrijs) ? (originelePrijs * 0.90).toFixed(2) : course.verkoopprijs;

        return {
          ...course,
          kortingsPrijs: kortingsPrijs,
          originelePrijs: originelePrijs.toFixed(2),
        };
      })
      .filter(course => {
        if (!course.datum) return false;
        let cursusDatum;
        try {
          cursusDatum = parseISO(course.datum); // Verwacht YYYY-MM-DD
          cursusDatum.setHours(0,0,0,0); // Normaliseer naar begin van de dag
        } catch (e) {
          console.error("Ongeldig datumformaat voor actiecursus:", course.datum, e);
          return false;
        }
        return cursusDatum >= nu && cursusDatum <= grensDatum;
      });
      // Sortering gebeurt al server-side in getCourses()
  }, [initialCourses]);

  const getDuration = (start?: string, end?: string): string => {
    if (!start || !end) return 'Tijd onbekend';
    const startTime = start.substring(0, 5);
    const endTime = end.substring(0, 5);
    return `Van ${startTime} tot ${endTime}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Datum onbekend';
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy', { locale: nl });
    } catch (e) {
      return dateString; 
    }
  };

  return (
    <>
      {actieCursussen.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actieCursussen.map((course) => (
            <Card key={course.firestoreId} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card border-primary/30">
              <CardHeader className="p-0 relative">
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10 flex items-center">
                  <TagIcon size={14} className="mr-1.5" /> 10% KORTING
                </div>
                <Image
                  src={`https://placehold.co/400x250.png?text=${encodeURIComponent(course.cursusNaam || 'Actie Cursus')}`}
                  alt={course.cursusNaam || `Opleiding ID ${course.opleidingId}`}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={course.cursusNaam || course.branche || "education training sale"}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <BookOpen size={20} className="mr-2 text-primary" />
                  {course.cursusNaam || `Opleiding ${course.opleidingId}`}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-sm line-clamp-3" title={course.cursusOmschrijving}>
                  {course.cursusOmschrijving || `Gepland op: ${formatDate(course.datum)}. Locatie: ${course.locatieNaam}.`}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.locatieNaam && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center gap-1"><MapPinIcon size={14}/>{course.locatieNaam}</span>
                  )}
                   <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary flex items-center gap-1"><EuroIcon size={18}/>{course.kortingsPrijs}</span>
                    <span className="text-sm text-muted-foreground line-through">€{course.originelePrijs}</span>
                  </div>
                  {course.SOOB && parseFloat(course.SOOB) > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">SOOB: €{course.SOOB}</span>
                  )}
                </div>
                 {course.puntenCode95 && parseFloat(course.puntenCode95) > 0 && (
                    <p className="text-xs text-muted-foreground mb-2">Code 95: {course.puntenCode95} punten</p>
                  )}
              </CardContent>
              <CardFooter className="p-6 border-t bg-muted/30">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {formatDate(course.datum)}, {getDuration(course.begintijd, course.eindtijd)}</span>
                    {course.vrijePlekken !== undefined ? (
                      <span className={`flex items-center gap-1.5 ${course.vrijePlekken > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <BarChart3 size={16} className={course.vrijePlekken > 0 ? 'text-green-600' : 'text-red-600'} />
                        {course.vrijePlekken > 0 ? `${course.vrijePlekken} plekken vrij` : 'Volgeboekt'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5"><BarChart3 size={16} className="text-primary" /> Max: {course.maximumAantal}</span>
                    )}
                  </div>
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                     <Link href={course.cursusLink || `/opleidingsaanbod/${course.opleidingId}`} passHref legacyBehavior>
                        <a>Meer Info & Inschrijven <Zap size={16} className="ml-2"/></a>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
            <CardHeader>
                <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-semibold text-foreground">Geen Actiecursussen Gevonden</CardTitle>
            </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Helaas zijn er momenteel geen cursussen die binnen de komende 31 dagen starten.</p>
            <p className="text-md text-muted-foreground mt-2">Kom binnenkort terug of bekijk ons volledige aanbod.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/opleidingsaanbod" passHref legacyBehavior>
                <a>Bekijk Alle Opleidingen</a>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
