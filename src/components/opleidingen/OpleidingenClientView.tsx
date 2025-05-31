
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart3, Zap, BookOpen, CheckCircle, MapPinIcon, EuroIcon, AwardIcon, FilterIcon, CalendarDays, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { GecombineerdeCursus } from '@/types/opleidingen';
import { format, parseISO, getYear, getMonth } from 'date-fns';
import { nl } from 'date-fns/locale';

interface OpleidingenClientViewProps {
  initialCourses: GecombineerdeCursus[];
}

const ITEMS_PER_PAGE = 9;

const voordelen = [
  { text: "Jouw certificeringsdata op orde", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Kies zelf je datum & cursuslocatie (ook op zaterdag)", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Ervaren trainers uit de praktijk", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Wij verzorgen jouw cursussen in meerdere talen", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Alles goed geregeld", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
];

export function OpleidingenClientView({ initialCourses }: OpleidingenClientViewProps) {
  const [selectedCursus, setSelectedCursus] = useState<string>('');
  const [selectedLocatie, setSelectedLocatie] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showCode95Only, setShowCode95Only] = useState<boolean>(false);
  const [showSoobOnly, setShowSoobOnly] = useState<boolean>(false);
  const [visibleCoursesCount, setVisibleCoursesCount] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const uniqueCursusNamen = useMemo(() => {
    const namen = new Set<string>();
    initialCourses.forEach(course => {
      if (course.cursusNaam && course.cursusNaam.trim().length > 0) {
        namen.add(course.cursusNaam.trim());
      }
    });
    return Array.from(namen).sort();
  }, [initialCourses]);

  const uniqueLocatieNamen = useMemo(() => {
    const namen = new Set<string>();
    initialCourses.forEach(course => {
      if (course.locatieNaam && course.locatieNaam.trim().length > 0) {
        namen.add(course.locatieNaam.trim());
      }
    });
    return Array.from(namen).sort();
  }, [initialCourses]);

  const uniqueMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    const nu = new Date();
    nu.setHours(0,0,0,0);

    initialCourses.forEach(course => {
      if (!course.datum) return;
      try {
        const cursusDatum = parseISO(course.datum); // Datum is al YYYY-MM-DD
         if (cursusDatum >= nu) {
            const monthYear = format(cursusDatum, 'LLLL yyyy', { locale: nl });
            const value = `${getYear(cursusDatum)}-${String(getMonth(cursusDatum) + 1).padStart(2, '0')}`;
            monthsSet.add(JSON.stringify({label: monthYear.charAt(0).toUpperCase() + monthYear.slice(1), value: value }));
        }
      } catch (e) {
        console.error("Error parsing date for month filter:", course.datum, e);
      }
    });
    
    return Array.from(monthsSet)
      .map(m => JSON.parse(m) as {label: string, value: string})
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [initialCourses]);
  
  const resetVisibleCount = () => {
    setVisibleCoursesCount(ITEMS_PER_PAGE);
     if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    resetVisibleCount();
  }, [selectedCursus, selectedLocatie, selectedMonth, showCode95Only, showSoobOnly]);


  const combinedAndFilteredCourses: GecombineerdeCursus[] = useMemo(() => {
    return initialCourses
      .filter(course => {
        if (selectedCursus && course.cursusNaam !== selectedCursus) return false;
        if (selectedLocatie && course.locatieNaam !== selectedLocatie) return false;
        if (showCode95Only && (!course.puntenCode95 || parseFloat(course.puntenCode95) <= 0)) return false;
        if (showSoobOnly && (!course.SOOB || parseFloat(course.SOOB) <= 0)) return false;
        
        if (selectedMonth && course.datum) {
          const [selectedYear, selectedMon] = selectedMonth.split('-');
          const courseDate = parseISO(course.datum);
          if (getYear(courseDate) !== parseInt(selectedYear) || (getMonth(courseDate) + 1) !== parseInt(selectedMon)) {
            return false;
          }
        }
        return true;
      });
      // Sortering gebeurt al in de getCourses functie (server-side)
  }, [initialCourses, selectedCursus, selectedLocatie, selectedMonth, showCode95Only, showSoobOnly]);

  const coursesToDisplay = useMemo(() => {
    return combinedAndFilteredCourses.slice(0, visibleCoursesCount);
  }, [combinedAndFilteredCourses, visibleCoursesCount]);

  const loadMoreCourses = useCallback(() => {
    if (isLoadingMore || visibleCoursesCount >= combinedAndFilteredCourses.length) return;

    setIsLoadingMore(true);
    setTimeout(() => { 
      setVisibleCoursesCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300); 
  }, [isLoadingMore, visibleCoursesCount, combinedAndFilteredCourses.length]);

  const lastCourseElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCoursesCount < combinedAndFilteredCourses.length) {
        loadMoreCourses();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, loadMoreCourses, visibleCoursesCount, combinedAndFilteredCourses.length]);


  const getDuration = (start: string, end: string): string => {
    if (!start || !end) return 'Tijd onbekend';
    const startTime = start.substring(0, 5);
    const endTime = end.substring(0, 5);
    return `Van ${startTime} tot ${endTime}`;
  };

  const formatDateDisplay = (dateString: string) => {
    try {
        return format(parseISO(dateString), 'dd-MM-yyyy', { locale: nl });
    } catch (e) {
        return dateString; 
    }
  };

  return (
    <>
      <div className="mb-12 md:mb-16 bg-muted p-6 md:p-8 rounded-lg shadow">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">Waarom kiezen voor FrisseStart?</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-4xl mx-auto">
          {voordelen.map((voordeel, index) => (
            <li key={index} className="flex items-start text-muted-foreground">
              {voordeel.icon}
              <span>{voordeel.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card className="mb-8 md:mb-12 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-foreground"><FilterIcon className="text-primary" /> Filters</CardTitle>
          <CardDescription>Verfijn uw zoekopdracht naar de perfecte cursus.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="filter-cursusnaam" className="font-medium">Cursusnaam</Label>
            <Select value={selectedCursus} onValueChange={(value) => setSelectedCursus(value === '_all_courses_' ? '' : value)}>
              <SelectTrigger id="filter-cursusnaam">
                <SelectValue placeholder="Alle cursussen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all_courses_">Alle cursussen</SelectItem>
                {uniqueCursusNamen.map(naam => (
                  <SelectItem key={naam} value={naam}>{naam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-locatie" className="font-medium">Locatie</Label>
            <Select value={selectedLocatie} onValueChange={(value) => setSelectedLocatie(value === '_all_locations_' ? '' : value)}>
              <SelectTrigger id="filter-locatie">
                <SelectValue placeholder="Alle locaties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all_locations_">Alle locaties</SelectItem>
                {uniqueLocatieNamen.map(naam => (
                  <SelectItem key={naam} value={naam}>{naam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="filter-maand" className="font-medium">Maand</Label>
            <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value === '_all_months_' ? '' : value)}>
              <SelectTrigger id="filter-maand">
                <SelectValue placeholder="Alle maanden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all_months_">Alle maanden</SelectItem>
                {uniqueMonths.map(monthObj => (
                  <SelectItem key={monthObj.value} value={monthObj.value}>{monthObj.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6 sm:col-span-1 lg:col-auto">
            <Switch id="filter-code95" checked={showCode95Only} onCheckedChange={setShowCode95Only} />
            <Label htmlFor="filter-code95" className="font-medium text-sm">Alleen Code 95</Label>
          </div>
          <div className="flex items-center space-x-2 pt-6 sm:col-span-1 lg:col-auto">
            <Switch id="filter-soob" checked={showSoobOnly} onCheckedChange={setShowSoobOnly} />
            <Label htmlFor="filter-soob" className="font-medium text-sm">Alleen met SOOB Subsidie</Label>
          </div>
        </CardContent>
      </Card>

      {coursesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesToDisplay.map((course, index) => (
             <Card 
                key={course.firestoreId} 
                className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card"
                ref={index === coursesToDisplay.length - 1 ? lastCourseElementRef : null}
              >
              <CardHeader className="p-0 relative">
                <Image
                  src={`https://placehold.co/400x250.png?text=${encodeURIComponent(course.cursusNaam || 'Cursus')}`}
                  alt={course.cursusNaam || `Opleiding ID ${course.opleidingId}`}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={course.cursusNaam || course.branche || "education training"}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <BookOpen size={20} className="mr-2 text-primary" />
                  {course.cursusNaam || `Opleiding ${course.opleidingId}`}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-sm line-clamp-3" title={course.cursusOmschrijving}>
                  {course.cursusOmschrijving || `Gepland op: ${formatDateDisplay(course.datum)}. Locatie: ${course.locatieNaam}.`}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.branche && (
                    <span className="text-xs bg-accent/80 text-accent-foreground px-2 py-1 rounded-full flex items-center gap-1"><AwardIcon size={14}/>{course.branche}</span>
                  )}
                  {course.locatieNaam && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center gap-1"><MapPinIcon size={14}/>{course.locatieNaam}</span>
                  )}
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1"><EuroIcon size={14}/>{course.verkoopprijs}</span>
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
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {formatDateDisplay(course.datum)}, {getDuration(course.begintijd, course.eindtijd)}</span>
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
                <CalendarDays className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl font-semibold text-foreground">Geen Cursussen Gevonden</CardTitle>
            </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">Er zijn momenteel geen aankomende opleidingen die aan uw filtercriteria voldoen.</p>
            <p className="text-md text-muted-foreground mt-2">Pas uw filters aan of kom binnenkort terug voor updates.</p>
          </CardContent>
        </Card>
      )}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3 text-primary" />
          <span>Meer cursussen laden...</span>
        </div>
      )}
       {!isLoadingMore && visibleCoursesCount >= combinedAndFilteredCourses.length && combinedAndFilteredCourses.length > ITEMS_PER_PAGE && (
        <p className="text-center text-muted-foreground mt-12">U heeft alle relevante cursussen bekeken.</p>
      )}
       <div className="mt-12 md:mt-16 text-center">
        <p className="text-lg text-muted-foreground mb-4">Kunt u niet vinden wat u zoekt?</p>
        <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/#course-recommender" passHref legacyBehavior>
            <a>Gebruik onze Slimme Cursus Recommender</a>
          </Link>
        </Button>
      </div>
    </>
  );
}
