
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { CheckCircle, Briefcase, Users, Lightbulb, Target, DollarSign, CalendarClock, BookOpen, Award, ShieldCheck, HelpCircle, Clock, MapPin, TrendingUp } from 'lucide-react';

const watBiedenWeItems = [
  "Trainingen vanaf €29.50,- p.p.",
  "Meerdere certificaten op 1 dag",
  "Behaal 14 uur in 1 dag",
  "Géén zaterdag toeslagen",
  "Vanaf 1 deelnemer in te plannen",
  "Landelijke dekking"
];

const voordelenIncompany = [
  {
    title: "Gevarieerd Cursusaanbod",
    description: "Bij FrisseStart bieden we een breed scala aan Code 95 cursussen aan, zodat u kunt kiezen welke het beste bij uw behoeften past. Of u nu geïnteresseerd bent in veiligheidstraining, milieubewust rijden of andere vakgerichte onderwerpen, wij hebben de juiste cursus voor u.",
    icon: <BookOpen className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Accreditatie",
    description: "Onze cursussen zijn geaccrediteerd en voldoen aan de wettelijke eisen voor Code 95. Dit betekent dat u na het voltooien van onze cursussen uw vakbekwaamheid behoudt en legaal de weg op kunt.",
    icon: <Award className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Flexibele Planning",
    description: "We begrijpen dat chauffeurs drukke schema’s hebben, daarom bieden we flexibele planningsopties voor onze cursussen. Of u nu fulltime werkt of deeltijds, wij hebben cursussen die bij uw schema passen.",
    icon: <CalendarClock className="h-10 w-10 text-primary mb-4" />
  },
  {
    title: "Interactieve Leeromgeving",
    description: "Onze cursussen zijn interactief en boeiend. We geloven dat leren leuk moet zijn, en daarom zorgen we voor actieve deelname en praktische oefeningen om uw kennis en vaardigheden te versterken.",
    icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />
  }
];

const faqItems = [
  {
    question: "Wat zijn de voordelen van incompany trainingen bij FrisseStart?",
    answer: "De voordelen zijn onder andere: trainingen op maat, kostenbesparing op reis- en locatiekosten, flexibele planning, training op eigen locatie met bekend materieel, en versterking van teamcohesie."
  },
  {
    question: "Is het mogelijk om eigen trainers voor de incompany trainingen te gebruiken?",
    answer: "Ja, een uniek aspect van FrisseStart is dat u uw eigen langdurige samenwerkingsverbanden met trainers kunt behouden of een interne instructeur/trainer die u in dienst heeft kunt inzetten."
  },
  {
    question: "Worden de incompany trainingen gesubsidieerd?",
    answer: "Veel van onze trainingen, inclusief Code 95, komen in aanmerking voor SOOB-subsidie. We helpen u graag met de aanvraag."
  },
  {
    question: "Wat houdt de Code 95 verplichting precies in?",
    answer: "Beroepschauffeurs zijn verplicht iedere 5 jaar 35 uur nascholing te volgen om de Code 95 te behouden. Hiervan mag maximaal 12 uur via e-learning worden gevolgd."
  },
  {
    question: "Hoe kan ik ervoor zorgen dat mijn chauffeurs aan de Code 95 verplichting voldoen?",
    answer: "Door het faciliteren en financieren van de juiste opleidingen en cursussen, hetzij intern georganiseerd (zoals onze incompany trainingen) of door chauffeurs extern te laten deelnemen. Regelmatige planning en het bijhouden van de status is essentieel."
  }
];

export default function IncompanyTrainingPage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Incompany <span className="text-primary">Training</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              FrisseStart biedt landelijk incompany trainingen voor Code 95 aan op uw eigen gekozen locatie. Bespaar tijd en kosten terwijl uw team met gelijke kennis efficiënt wordt opgeleid.
            </p>
            <p className="text-muted-foreground mb-4">
              Kies voor het gemak en de flexibiliteit van onze trainingen, u kunt ze met diverse cursussen indelen en kan zo op maat worden samengesteld. Stimuleer de samenwerking terwijl uw werknemers waardevolle kennis en vaardigheden opdoen.
            </p>
             <p className="text-muted-foreground">
              Een uniek aspect van FrisseStart is dat het ook mogelijk is om eigen trainers in te zetten. Klanten kunnen hun eigen langdurige samenwerkingsverbanden met trainers behouden of gebruikmaken van een interne instructeur/trainer die zij in dienst hebben. Dit biedt extra flexibiliteit en maatwerk voor de klant.
            </p>
          </div>
          <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden shadow-xl group order-first md:order-last">
            <Image
              src="https://placehold.co/500x500.png"
              alt="Incompany training bij FrisseStart"
              layout="fill"
              objectFit="cover"
              data-ai-hint="group training corporate"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="code95-verplichtingen" className="pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">Verplichtingen Code 95</h2>
          <p className="text-muted-foreground mb-4">
            In de wereld van transport en logistiek heb je als werkgever een belangrijke verantwoordelijkheid als het gaat om Code 95. Je bent volgens de CAO BGV verplicht om te zorgen dat jouw chauffeurs voldoen aan de verplichte nascholing. Dit betekent dat je de juiste opleidingen en cursussen moet faciliteren en financieren.
          </p>
          <p className="text-muted-foreground mb-4">
            Dit kan worden gedaan door het organiseren van interne cursussen of door chauffeurs de mogelijkheid te bieden om externe cursussen te volgen. Beroepschauffeurs zijn verplicht iedere 5 jaar 35 uur nascholing te volgen om de Code 95 te behouden. Om deze 35 uur zo efficiënt mogelijk in te zetten is het mogelijk om van de 35 uur, 12 uur in een E-Learning. Wat betekend dat een code 95 in minimaal 3.5 dag georganiseerd kan worden.
          </p>
          <p className="text-muted-foreground font-semibold">
            Het resultaat? Voorkom last-minute cursussen, kwaliteit voor alle werknemers en gemotiveerde werknemers die bijdragen aan het succes van uw organisatie.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-accent/20 pb-12 md:pb-16">
        <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6 text-center">
            <CardTitle className="text-2xl md:text-3xl">Wat bieden we?</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">Trainingen vanaf €29.50,- p.p.</CardDescription>
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
              <Link href="/contact?subject=Offerte%20Aanvraag%20Incompany%20Training" passHref legacyBehavior>
                <a>Offerte Aanvragen</a>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </SectionContainer>

      <SectionContainer className="pb-12 md:pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Voordelen van Incompany Trainingen</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"> {/* Changed to lg:grid-cols-2 for better fit */}
          {voordelenIncompany.map((voordeel) => (
            <Card key={voordeel.title} className="bg-card shadow-md hover:shadow-lg transition-shadow flex flex-col text-center">
              <CardHeader className="items-center">
                {voordeel.icon}
                <CardTitle className="text-xl text-foreground">{voordeel.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{voordeel.description}</p>
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
                <AccordionTrigger className="text-lg text-left hover:text-primary">
                  <HelpCircle className="h-5 w-5 mr-3 text-primary/80 shrink-0" />
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pl-10">
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
