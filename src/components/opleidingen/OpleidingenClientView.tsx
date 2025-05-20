
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart3, Zap, BookOpen, CheckCircle, MapPinIcon, EuroIcon, AwardIcon, FilterIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Opleiding, CursusDetail, Locatie, GecombineerdeCursus } from '@/types/opleidingen';

interface OpleidingenClientViewProps {
  initialOpleidingenData: Opleiding[];
  initialCursusDetailsData: CursusDetail[];
  initialLocatiesData: Locatie[];
}

const voordelen = [
  { text: "Jouw certificeringsdata op orde", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Kies zelf je datum & cursuslocatie (ook op zaterdag)", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Ervaren trainers uit de praktijk", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Wij verzorgen jouw cursussen in meerdere talen", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Alles goed geregeld", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
];

export function OpleidingenClientView({
  initialOpleidingenData,
  initialCursusDetailsData,
  initialLocatiesData,
}: OpleidingenClientViewProps) {
  const [selectedCursus, setSelectedCursus] = useState<string>('_all_courses_');
  const [selectedLocatie, setSelectedLocatie] = useState<string>('_all_locations_');
  const [showCode95Only, setShowCode95Only] = useState<boolean>(false);
  const [showSoobOnly, setShowSoobOnly] = useState<boolean>(false);

  const cursusDetailsMap = useMemo(() => {
    const map = new Map<string, CursusDetail>();
    initialCursusDetailsData.forEach(detail => map.set(detail.id.toString(), detail));
    return map;
  }, [initialCursusDetailsData]);

  const locatiesMap = useMemo(() => {
    const map = new Map<string, Locatie>();
    initialLocatiesData.forEach(locatie => map.set(locatie.id.toString(), locatie));
    return map;
  }, [initialLocatiesData]);

  const uniqueCursusNamen = useMemo(() => {
    const namen = new Set<string>();
    initialOpleidingenData.forEach(opl => {
      const detail = cursusDetailsMap.get(opl.cursus_id);
      // Ensure 'naam' exists, is a string, and is not empty after trimming
      if (detail && typeof detail.naam === 'string' && detail.naam.trim().length > 0) {
        namen.add(detail.naam);
      }
    });
    return Array.from(namen).sort();
  }, [initialOpleidingenData, cursusDetailsMap]);

  const uniqueLocatieNamen = useMemo(() => {
    const namen = new Set<string>();
    initialOpleidingenData.forEach(opl => {
      const locatie = locatiesMap.get(opl.locatie_id);
      // Ensure 'naam' exists, is a string, and is not empty after trimming
      if (locatie && typeof locatie.naam === 'string' && locatie.naam.trim().length > 0) {
        namen.add(locatie.naam);
      }
    });
    return Array.from(namen).sort();
  }, [initialOpleidingenData, locatiesMap]);

  const combinedAndFilteredCourses: GecombineerdeCursus[] = useMemo(() => {
    const nu = new Date();
    nu.setHours(0, 0, 0, 0);

    return initialOpleidingenData
      .map(opleiding => {
        const detail = cursusDetailsMap.get(opleiding.cursus_id);
        const locatie = locatiesMap.get(opleiding.locatie_id);
        const maxAantal = parseInt(opleiding.maximum_aantal, 10);
        const gereserveerd = parseInt(opleiding.aantal_gereserveerd || '0', 10);
        const vrijePlekken = isNaN(maxAantal) || isNaN(gereserveerd) ? undefined : maxAantal - gereserveerd;

        return {
          ...opleiding,
          cursusNaam: detail?.naam,
          cursusOmschrijving: detail?.omschrijving || `Een cursus in ${opleiding.branche || 'diverse branches'} aangeboden door FrisseStart.`,
          cursusLink: detail?.link,
          locatieNaam: locatie?.naam || `Locatie ID: ${opleiding.locatie_id}`,
          vrijePlekken: vrijePlekken,
        };
      })
      .filter(course => {
        if (!course.datum) return false;
        const [year, month, day] = course.datum.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
        const cursusDatum = new Date(year, month - 1, day);
        return cursusDatum >= nu;
      })
      .filter(course => {
        if (selectedCursus && selectedCursus !== '_all_courses_' && course.cursusNaam !== selectedCursus) return false;
        if (selectedLocatie && selectedLocatie !== '_all_locations_' && course.locatieNaam !== selectedLocatie) return false;
        if (showCode95Only && (!course.punten_code95 || parseFloat(course.punten_code95) <= 0)) return false;
        if (showSoobOnly && (!course.SOOB || parseFloat(course.SOOB) <= 0)) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.datum.split('-').map(Number).join('-'));
        const dateB = new Date(b.datum.split('-').map(Number).join('-'));
        return dateA.getTime() - dateB.getTime();
      });
  }, [initialOpleidingenData, cursusDetailsMap, locatiesMap, selectedCursus, selectedLocatie, showCode95Only, showSoobOnly]);

  const getDuration = (start: string, end: string): string => {
    const startTime = start.substring(0, 5);
    const endTime = end.substring(0, 5);
    return `Van ${startTime} tot ${endTime}`;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
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
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="flex items-center space-x-2 pt-6">
            <Switch id="filter-code95" checked={showCode95Only} onCheckedChange={setShowCode95Only} />
            <Label htmlFor="filter-code95" className="font-medium text-sm">Alleen Code 95</Label>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch id="filter-soob" checked={showSoobOnly} onCheckedChange={setShowSoobOnly} />
            <Label htmlFor="filter-soob" className="font-medium text-sm">Alleen met SOOB Subsidie</Label>
          </div>
        </CardContent>
      </Card>

      {combinedAndFilteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combinedAndFilteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card">
              <CardHeader className="p-0 relative">
                <Image
                  src={`https://placehold.co/400x250.png?text=${encodeURIComponent(course.cursusNaam || 'Cursus')}`}
                  alt={course.cursusNaam || `Opleiding ID ${course.id}`}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={course.cursusNaam || course.branche || "education training"}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <BookOpen size={20} className="mr-2 text-primary" />
                  {course.cursusNaam || `Opleiding ${course.cursus_id}`}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-sm line-clamp-3" title={course.cursusOmschrijving}>
                  {course.cursusOmschrijving || `Gepland op: ${formatDate(course.datum)}. Locatie: ${course.locatieNaam}.`}
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
                 {course.punten_code95 && parseFloat(course.punten_code95) > 0 && (
                    <p className="text-xs text-muted-foreground mb-2">Code 95: {course.punten_code95} punten</p>
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
                      <span className="flex items-center gap-1.5"><BarChart3 size={16} className="text-primary" /> Max: {course.maximum_aantal}</span>
                    )}
                  </div>
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                     <Link href={course.cursusLink || `/opleidingsaanbod/${course.id}`} passHref legacyBehavior>
                        <a>Meer Info & Inschrijven <Zap size={16} className="ml-2"/></a>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Momenteel zijn er geen aankomende opleidingen die aan uw criteria voldoen.</p>
          <p className="text-md text-muted-foreground mt-2">Pas uw filters aan of kom binnenkort terug voor updates.</p>
        </div>
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

    