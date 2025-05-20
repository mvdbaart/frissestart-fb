import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart3, Zap, BookOpen, CheckCircle } from 'lucide-react'; // CheckCircle toegevoegd

import opleidingenData from '../../../opleidingen.json';
import cursusDetailsData from '../../../cursus_details.json';

// TODO: Locatie data ophalen en verwerken
// import locatiesData from '../../../locaties.json'; // Veronderstelt dat je de locaties opslaat

interface Opleiding {
  id: string;
  datum: string;
  begintijd: string;
  eindtijd: string;
  cursus_id: string;
  locatie_id: string;
  verkoopprijs: string;
  SOOB: string;
  punten_code95: string;
  branche: string;
  maximum_aantal: string;
}

interface CursusDetail {
  id: number;
  naam: string;
  omschrijving: string;
}

// TODO: Interface voor Locatie definiëren
// interface Locatie {
//   id: string;
//   naam: string;
//   // ...andere velden indien nodig
// }

interface GecombineerdeCursus extends Opleiding {
  cursusNaam?: string;
  cursusOmschrijving?: string;
  locatieNaam?: string; // Toegevoegd voor locatienaam
}

const voordelen = [
  { text: "Jouw certificeringsdata op orde", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Kies zelf je datum & cursuslocatie (ook op zaterdag)", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Ervaren trainers uit de praktijk", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Wij verzorgen jouw cursussen in meerdere talen", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
  { text: "Alles goed geregeld", icon: <CheckCircle size={20} className="text-primary mr-2" /> },
];

export default async function OpleidingsaanbodPage() { // async gemaakt voor fetch
  const opleidingen = opleidingenData as Opleiding[];
  const cursusDetails = cursusDetailsData as CursusDetail[];

  // Fetch locaties data
  let locatiesMap = new Map<string, string>();
  try {
    const response = await fetch('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties');
    if (!response.ok) {
      console.error('Failed to fetch locaties:', response.statusText);
    } else {
      const locatiesData = await response.json();
      if (Array.isArray(locatiesData)) {
        locatiesData.forEach(locatie => {
          locatiesMap.set(locatie.id.toString(), locatie.naam);
        });
      }
    }
  } catch (error) {
    console.error('Error fetching locaties:', error);
  }

  const cursusDetailsMap = new Map<string, CursusDetail>();
  cursusDetails.forEach(detail => {
    cursusDetailsMap.set(detail.id.toString(), detail);
  });

  const nu = new Date();
  nu.setHours(0, 0, 0, 0);

  const combinedCourses: GecombineerdeCursus[] = opleidingen
    .map(opleiding => {
      const detail = cursusDetailsMap.get(opleiding.cursus_id);
      return {
        ...opleiding,
        cursusNaam: detail?.naam,
        cursusOmschrijving: detail?.omschrijving,
        locatieNaam: locatiesMap.get(opleiding.locatie_id) || `ID: ${opleiding.locatie_id}`, // Locatienaam toevoegen
      };
    })
    .filter(course => {
      const [year, month, day] = course.datum.split('-').map(Number);
      const cursusDatum = new Date(year, month - 1, day);
      return cursusDatum >= nu;
    })
    .sort((a, b) => {
      const dateA = new Date(a.datum.split('-').map(Number).join('-'));
      const dateB = new Date(b.datum.split('-').map(Number).join('-'));
      return dateA.getTime() - dateB.getTime();
    });

  const getDuration = (start: string, end: string): string => {
    return `Van ${start} tot ${end}`;
  };

  return (
    <SectionContainer className="py-12 md:py-16 lg:py-20">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Ons <span className="text-primary">Opleidingsaanbod</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Ontdek ons uitgebreide aanbod aan geplande opleidingen en vind de cursus die bij jou past. Profiteer van onze expertise en flexibiliteit.
        </p>
      </div>

      {/* Voordelen Sectie */}
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

      {combinedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combinedCourses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card">
              <CardHeader className="p-0 relative">
                <Image
                  // Gebruik cursusNaam voor de placeholder tekst, anders een generieke tekst
                  src={course.cursusNaam ? `https://placehold.co/400x250.png?text=${encodeURIComponent(course.cursusNaam)}` : "https://placehold.co/400x250.png?text=FrisseStart+Opleiding"}
                  alt={course.cursusNaam || course.branche || `Opleiding ID ${course.id}`}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={course.cursusNaam || course.branche || "opleiding"}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <BookOpen size={20} className="mr-2 text-primary" />
                  {course.cursusNaam || course.branche || `Opleiding ${course.cursus_id}`}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-sm line-clamp-3" title={course.cursusOmschrijving}>
                  {course.cursusOmschrijving || `Gepland op: ${course.datum}. Prijs: €${course.verkoopprijs}.`}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.branche && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{course.branche}</span>
                  )}
                  {course.punten_code95 !== "0" && parseFloat(course.punten_code95) > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Code95: {course.punten_code95}p</span>
                  )}
                  {/* Locatienaam weergeven */}
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{course.locatieNaam}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Prijs: €{course.verkoopprijs}</span>
                  {course.SOOB !== "0.00" && parseFloat(course.SOOB) > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">SOOB: €{course.SOOB}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 border-t bg-muted/30">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {course.datum}, {getDuration(course.begintijd, course.eindtijd)}</span>
                    <span className="flex items-center gap-1.5"><BarChart3 size={16} className="text-primary" /> Max: {course.maximum_aantal}</span>
                  </div>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                     {/* Link aanpassen naar nieuwe padstructuur indien nodig */}
                    <Link href={`/opleidingsaanbod/${course.id}`}> 
                      Meer Info & Inschrijven <Zap size={16} className="ml-2"/>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Momenteel zijn er geen aankomende opleidingen gepland.</p>
          <p className="text-md text-muted-foreground mt-2">Kom binnenkort terug voor updates of neem contact met ons op voor meer informatie.</p>
        </div>
      )}
       <div className="mt-12 md:mt-16 text-center">
        <p className="text-lg text-muted-foreground mb-4">Kunt u niet vinden wat u zoekt?</p>
        <Button asChild variant="outline" size="lg">
          <Link href="/#course-recommender">
            Gebruik onze Slimme Cursus Recommender
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
