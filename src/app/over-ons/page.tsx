
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // CardDescription niet nodig hier
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Target, Lightbulb, Handshake, Rocket, MessageCircle, Brain, UsersRound, Milestone } from 'lucide-react';

const kernFrisseStart = [
  {
    question: "Wat is de reden dat Frisse Start ooit is gestart?",
    answer: "We zagen dat veel mensen in de transportsector moeite hadden om toegang te krijgen tot kwalitatieve opleidingen, goede begeleiding en praktische herstartmogelijkheden. Frisse Start is opgericht om dát gat te vullen — met maatwerk, persoonlijke aandacht en erkenning vanuit de sector.",
    icon: <Lightbulb className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Waar staat Frisse Start vandaag écht voor?",
    answer: "Voor een persoonlijke en no-nonsense aanpak. We helpen mensen écht vooruit met duidelijke communicatie, betrokken instructeurs en opleidingsroutes die direct toepasbaar zijn in de praktijk.",
    icon: <Target className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Wat maakt jullie anders dan andere opleiders of uitzenders?",
    answer: "Onze mensen maken het verschil. Geen anonieme leslokalen, maar betrokken instructeurs die zelf uit de praktijk komen. We begeleiden cursisten van begin tot eind, inclusief subsidie-aanvraag, contact met werkgevers en hercertificering.",
    icon: <Users className="h-6 w-6 text-primary mr-3 shrink-0" />
  }
];

const impactEnAanpak = [
  {
    question: "Wat maakt jullie werkwijze uniek?",
    answer: "We combineren persoonlijke begeleiding met administratieve ontzorging. Werkgevers krijgen één contactpersoon, deelnemers weten waar ze aan toe zijn. Alles is geregeld – van subsidie tot planning.",
    icon: <Handshake className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Wat is een typerend voorbeeld van een “frisse start”?",
    answer: "Een langdurig zieke chauffeur die via ons re-integratietraject zijn Code 95 heeft vernieuwd en nu weer volledig aan het werk is. Hij noemde onze instructeur “meer een collega dan een docent”.",
    icon: <Rocket className="h-6 w-6 text-primary mr-3 shrink-0" />
  }
];

const mensenAchter = [
 {
    question: "Wat drijft jou persoonlijk in dit werk?",
    answer: "Het zien van groei. Mensen die binnenkomen met twijfel, en vertrekken met trots en een certificaat in de hand.",
    icon: <Brain className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Hoe zou je de sfeer binnen het team omschrijven?",
    answer: "Direct – Betrokken – Nuchter",
    icon: <UsersRound className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Als Frisse Start een persoon was, hoe zou je die dan omschrijven?",
    answer: "Eerlijk, vriendelijk, en met beide benen op de grond.",
    icon: <MessageCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
  }
];

const toekomstEnVisie = [
 {
    question: "Hoe zie je Frisse Start over 3 jaar?",
    answer: "Een landelijk erkende opleider in transport en logistiek, met sterke posities in re-integratie en Code 95-hercertificering.",
    icon: <Milestone className="h-6 w-6 text-primary mr-3 shrink-0" />
  },
  {
    question: "Wat willen jullie bereiken?",
    answer: "Dat elke cursist met vertrouwen de praktijk in kan. En dat bedrijven ons zien als dé partner om hun personeel bij te scholen.",
    icon: <Target className="h-6 w-6 text-primary mr-3 shrink-0" />
  }
];


export default function OverOnsPage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pb-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Over <span className="text-primary">FrisseStart</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
            Uw partner voor opleidingen in transport en logistiek.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-secondary">
                <Image src="/images/sander.png" alt="Sander - Directeur FrisseStart" layout="fill" objectFit="cover" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mt-4">Sander</h3>
              <p className="text-muted-foreground">Directeur</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-secondary">
                <Image src="/images/kirsten.png" alt="Kirsten - Directeur FrisseStart" layout="fill" objectFit="cover" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mt-4">Kirsten</h3>
              <p className="text-muted-foreground">Directeur</p>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="kern" className="pb-12 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
          Over de kern van <span className="text-primary">Frisse Start</span>
        </h2>
        <div className="grid md:grid-cols-1 gap-6">
          {kernFrisseStart.map((item, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                {item.icon}
                <CardTitle className="text-xl text-foreground">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="impact" className="bg-accent/20 pb-12 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
          Over impact en <span className="text-primary">aanpak</span>
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {impactEnAanpak.map((item, index) => (
             <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                {item.icon}
                <CardTitle className="text-xl text-foreground">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>
      
      <SectionContainer id="mensen" className="pb-12 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
          Over de mensen achter <span className="text-primary">Frisse Start</span>
        </h2>
        <div className="grid md:grid-cols-1 gap-6">
          {mensenAchter.map((item, index) => (
             <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                {item.icon}
                <CardTitle className="text-xl text-foreground">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="toekomst" className="bg-accent/20 pb-12 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
          Over de toekomst en <span className="text-primary">visie</span>
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {toekomstEnVisie.map((item, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                {item.icon}
                <CardTitle className="text-xl text-foreground">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="pb-16 md:pb-20 text-center">
        <p className="text-2xl font-semibold text-primary italic">
          Frisse Start – Vooruit in transport en logistiek
        </p>
      </SectionContainer>
    </>
  );
}

    