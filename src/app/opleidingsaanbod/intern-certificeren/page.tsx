
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { CheckCircle, Award, Briefcase, Users, Lightbulb, Target, Handshake } from 'lucide-react';

const kernpunten = [
  "Afgestemd op de specifieke behoefte van jouw bedrijf",
  "Bespaar op reis-, locatie kosten en reistijd",
  "Versterken van de onderlinge samenwerking",
  "Wij verzorgen jouw cursussen in meerdere talen"
];

const watBiedenWeItems = [
  "Certificeren vanaf €75,- p.p.",
  "E-Learning / Reguliere trainingen",
  "Trainingen op eigen locatie",
  "Certificeren in een dagdeel",
  "Opleiden van Interne trainers",
  "Inhuren van ervaren trainers"
];

const voordelenInternCertificeren = [
  {
    title: "Focus op bedrijfsspecifieke behoeften",
    description: "Intern certificeren kan worden afgestemd op de specifieke behoeften van het bedrijf. Dit betekent dat de inhoud van de opleiding kan worden aangepast aan de vaardigheden die de werknemers nodig hebben. Dit zorgt ervoor dat werknemers de kennis en vaardigheden ontwikkelen die rechtstreeks van toepassing zijn op hun dagelijkse werkzaamheden, waardoor ze efficiënter en effectiever kunnen werken.",
    icon: <Target className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Kostenbesparing",
    description: "Het organiseren van interne certificering kan kosteneffectiever zijn dan het sturen van werknemers naar externe opleidingsinstituten. Bedrijven kunnen besparen op reiskosten, (betaalde) reistijd, accommodatie en andere externe trainingskosten.",
    icon: <Award className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Gemak en flexibiliteit",
    description: "FrisseStart begrijpt dat uw bedrijfsactiviteiten en de beschikbaarheid van uw werknemers prioriteit hebben. Daarom bieden ze trainingen aan op tijdstippen die het beste passen bij uw bedrijfsplanning. Dit minimaliseert de verstoring van het werk en afwezigheid van medewerkers.",
    icon: <Briefcase className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Samenwerking",
    description: "Bied de mogelijkheid om teams/collega’s samen te brengen en de onderlinge samenwerking te versterken.",
    icon: <Users className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Snelle implementatie",
    description: "Door middel van het inzetten Standaard Maatwerk E-Learnings en praktijk trainers van FrisseStart kunnen trainingen kunnen snel worden georganiseerd. Waardoor u uw veiligheid snel op orde heeft.",
    icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Eigen interne trainers certificeren",
    description: "Naast het verzorgen van trainingen, biedt FrisseStart ook de mogelijkheid om uw interne trainers te certificeren. Dit betekent dat uw eigen medewerkers kunnen worden opgeleid en gecertificeerd om als interne trainers op te treden. Dit bevordert niet alleen de kennisoverdracht binnen uw organisatie, maar biedt ook mogelijkheden voor continue ontwikkeling en groei van uw werknemers.",
    icon: <Handshake className="h-10 w-10 text-primary mb-4" />
  }
];

const faqItems = [
  {
    question: "Wat is intern certificeren en waarom is het belangrijk voor mijn bedrijf?",
    answer: "Intern certificeren betekent dat trainingen en certificeringen binnen uw eigen bedrijf en op uw locatie worden verzorgd. Het is belangrijk omdat het zorgt voor op maat gemaakte trainingen die direct relevant zijn voor uw bedrijfsprocessen, de veiligheid verhoogt en kosten kan besparen."
  },
  {
    question: "Welke voordelen biedt intern certificeren ten opzichte van externe trainingen?",
    answer: "Voordelen zijn onder andere: kostenbesparing (reis-, locatiekosten), trainingen afgestemd op specifieke bedrijfsbehoeften, flexibele planning, versterking van teamcohesie en directe toepassing van geleerde vaardigheden in de eigen werkomgeving."
  },
  {
    question: "Hoe kan FrisseStart de intern certificeringstrainingen aanpassen aan onze bedrijfsbehoeften?",
    answer: "FrisseStart analyseert uw specifieke situatie, de gebruikte apparatuur en de vaardigheden die uw medewerkers nodig hebben. Op basis daarvan wordt de cursusinhoud aangepast om maximale relevantie en effectiviteit te garanderen."
  },
  {
    question: "Biedt FrisseStart ondersteuning bij het certificeren van onze interne trainers?",
    answer: "Ja, FrisseStart biedt 'train-de-trainer' programma's aan waarbij uw eigen medewerkers worden opgeleid en gecertificeerd om als interne trainers op te treden, inclusief didactische vaardigheden en vakkennis."
  },
  {
    question: "Wat zijn de kosten van intern certificeren met FrisseStart?",
    answer: "De kosten zijn afhankelijk van het aantal deelnemers, de soort training en de specifieke wensen. Vanaf €75,- per persoon is mogelijk. Neem contact op voor een vrijblijvende offerte op maat."
  }
];

export default function InternCertificerenPage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Intern <span className="text-primary">Certificeren</span> bij FrisseStart
            </h1>
            <ul className="space-y-3 mb-8">
              {kernpunten.map((punt, index) => (
                <li key={index} className="flex items-center text-lg text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-secondary mr-3 shrink-0" />
                  {punt}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mb-4">
              Binnen elke onderneming zijn er goederen die intern moeten worden verplaatst. Denk hierbij aan de Hef- of reachtruck, een elektrische pallettruck of bijvoorbeeld een stapelaar. Veiligheid staat hierbij voorop.
            </p>
            <p className="text-muted-foreground">
              Als werkgever ben je verplicht om je werknemers te voorzien van de juiste voorlichting en instructies om veilig te kunnen werken met deze interne transport middelen.
            </p>
          </div>
           <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl group order-first md:order-last">
            <Image
              src="https://placehold.co/500x500.png"
              alt="Team training interne certificering"
              layout="fill"
              objectFit="cover"
              data-ai-hint="team training"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="pb-12 md:pb-16">
          <p className="text-lg text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
            FrisseStart biedt landelijk interne trainingen aan op uw eigen gekozen locatie die voor u en uw werknemers het beste uitkomt, aangepast aan uw wensen en behoeften. Bespaar tijd en kosten terwijl uw team effici\u00ebnt en effectief wordt opgeleid. Kies voor het gemak en de flexibiliteit van onze trainingen die perfect aansluiten bij uw bedrijfsplanning.
          </p>
           <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Stimuleer de samenwerking terwijl uw werknemers waardevolle kennis en vaardigheden opdoen. Kies voor FrisseStart en geef uw werknemers een frisse start in hun carrière!
          </p>
      </SectionContainer>

      <SectionContainer className="bg-accent/20 pb-12 md:pb-16">
        <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6 text-center">
            <CardTitle className="text-2xl md:text-3xl">Wat bieden we?</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {watBiedenWeItems.map((item, index) => (
                <li key={index} className="flex items-center text-foreground">
                  <CheckCircle className="h-5 w-5 text-secondary mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="bg-muted/50 p-6 flex justify-center">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-3 px-8 shadow-md">
              <Link href="/contact?subject=Offerte%20Aanvraag%20Intern%20Certificeren" passHref legacyBehavior>
                <a>Offerte Aanvragen</a>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </SectionContainer>

      <SectionContainer className="pb-12 md:pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Voordelen van Intern Certificeren</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {voordelenInternCertificeren.map((voordeel) => (
            <Card key={voordeel.title} className="bg-card shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="items-center text-center">
                {voordeel.icon}
                <CardTitle className="text-xl text-foreground">{voordeel.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm text-center">{voordeel.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="bg-background pb-16 md:pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Veelgestelde Vragen</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-lg text-left hover:text-primary">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionContainer>
    </>
  );
}

    