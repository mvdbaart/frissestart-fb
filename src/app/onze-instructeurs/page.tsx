
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CheckCircle, Users as UsersIcon, Truck, BookOpen as BookOpenIcon, Briefcase, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const instructeurs = [
  {
    naam: "Marc van Hoek",
    functie: "Instructeur WRM / Code 95",
    bio: "Ik ben Marc en deel met veel plezier mijn uitgebreide kennis en ervaring. Als rijinstructeur C, CE en LZV. Daarnaast verzorg ik theorie opleidingen voor Code95 en Intern transport. Na het afronden van mijn opleidingen heb ik 20 jaar als chauffeur gewerkt, behaalde ik mijn rij instructie bevoegdheid in 2015. Sinds 2015 werk ik met veel plezier als Instructeur voor FrisseStart.",
    specialisaties: [
      "Rijlessen C, CE, LZV",
      "Praktijktrainingen Code95",
      "Logistieke trainingen ( Meenneem-, Hef en Reachtruck, Hoogwerker)",
      "Theorie trainingen ( VCA, Chauffeursdagen, Techniek en Veiligheid)"
    ],
    afbeelding: "/images/marc-van-hoek.png"
  },
  {
    naam: "Paul van de Warrenburg",
    functie: "Instructeur WRM / Code 95",
    bio: "Ruim 15 jaar ben ik eigenaar van Warrenburg opleidingen geweest, daarnaast heb ik bijna 20 jaar op zaterdag bij de Jumbo gereden als chauffeur. Mede omdat ik het nog altijd leuk vind om mijn kennis over te dragen verzorg ik met name rijlessen op vrachtwagen C en CE. Sinds 2024 werk ik met veel plezier als Instructeur voor FrisseStart.",
    specialisaties: [
      "Rijlessen C, CE, LZV",
      "Praktijktrainingen Code95",
      "Logistieke trainingen ( Hef en Reachtruck, EPT, Stapelaar)",
      "Theorie trainingen ( Chauffeursdagen, Digitale tachograaf en boordcomputers)"
    ],
    afbeelding: "/images/paul-van-de-warrenburg.png"
  },
  {
    naam: "Menno Gijsbers",
    functie: "Instructeur WRM / Code 95",
    bio: "Op 19 jarige leeftijd heb ik mijn rijbewijzen behaalt en ben ik werkzaam geweest als chauffeur, de eerste jaren nationaal daarna met name als internationaal chauffeur. Ik heb als chauffeur veel verschillende werkzaamheden uitgevoerd, de laatste jaren heb ik veel collega’s opgeleid en begeleid. Vanuit deze ervaring kwam mijn interesse om als instructeur te gaan werken. In 2023 ben ik gestart met mijn omscholing tot rijinstructeur. Sinds 2024 heb ik mijn B, C en CE instructie behaald. Sinds mei 2023 werk ik voor FrisseStart, in eerste instantie als chauffeur. Naast mijn opleiding tot instructeur verzorg ik voor FrisseStart verschillende trainingen.",
    specialisaties: [
      "Rijlessen C, CE",
      "Praktijktrainingen Code95",
      "Logistieke trainingen ( Hef en Reachtruck, EPT, Stapelaar)",
      "Theorie trainingen ( Chauffeursdagen )"
    ],
    afbeelding: "/images/menno-gijsbers.png"
  },
  {
    naam: "Dorien Schriks",
    functie: "Instructeur WRM",
    bio: "Na 25 jaar ervaring als chauffeur voornamelijk in de bouwsector bem ben ik in 2010 als zelfstandige begonnen. Ruim 10 jaar bezat ik 2 vrachtwagens, waar ik samen met mijn partner in het speciaal transport heb gereden. In 2020 heb ik mijzelf omgeschoold tot rijinstructeur B. Na 1 jaar als instructeur gewerkt te hebben, kriebelde het weer om als chauffeur te gaan rijden. Eind  2023 ben ik in contact gekomen met FrisseStart, daarna heb ik besloten om mijn C en CE instructie te behalen. Inmiddels heb ik in 2024 mijn C  en CE instructie behaald. Sinds mei 2024 ben ik in dienst van FrisseStart en verzorg verschillende cursussen als Docent Code95, daarnaast geef ik rijles en praktijktrainingen. Binnenkort ga ik ook starten om mijn LZV certificeringen te behalen.",
    specialisaties: [
      "Rijlessen C, CE",
      "Logistieke trainingen ( Hef en Reachtruck, Hoogwerker, EPT, Stapelaar)",
      "Theorie trainingen ( Chauffeursdagen, Lading Zekeren )"
    ],
    afbeelding: "/images/dorien-schriks.png"
  },
  {
    naam: "Alain Soucy",
    functie: "Logistiek instructeur",
    bio: "Op 17 jarige leeftijd ben ik in de Logistiek terecht gekomen, na 10 jaar met verschillende heftrucks gewerkt te hebben, heb ik in 1999 mijn rijbewijzen C en CE behaald. Vervolgens ben ik eind jaren ’90 als chauffeur gestart. Ik heb ruim 25 jaar als internationaal chauffeur gewerkt in de tank- en bulktransport",
    specialisaties: [
      "Logistieke trainingen ( Hef en Reachtruck, EPT, Stapelaar)",
      "Theorie trainingen ( Chauffeursdagen, Actualisatie vakbekwaamheid )"
    ],
    afbeelding: "/images/alain-soucy.png"
  }
];

export default function OnzeInstructeursPage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pb-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Onze <span className="text-primary">Deskundige Instructeurs</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Bij FrisseStart kun je terecht voor de inhuur van (WRM) instructeurs op het gebied van onder andere:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg shadow-md flex items-center">
              <Truck className="h-6 w-6 text-secondary mr-3 shrink-0" />
              <span className="text-foreground">Rijopleidingen BE, C, CE</span>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-md flex items-center">
              <Briefcase className="h-6 w-6 text-secondary mr-3 shrink-0" />
              <span className="text-foreground">Praktijk opleidingen (HNR, BBS, Manouvreren etc.)</span>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-md flex items-center">
              <BookOpenIcon className="h-6 w-6 text-secondary mr-3 shrink-0" />
              <span className="text-foreground">Logistieke trainingen (Hef- Reachtruck, EPT-Stapelaar, etc.)</span>
            </div>
             <div className="bg-card p-4 rounded-lg shadow-md flex items-center sm:col-span-2 lg:col-span-3 lg:max-w-md lg:mx-auto">
              <UsersIcon className="h-6 w-6 text-secondary mr-3 shrink-0" />
              <span className="text-foreground">Theorie opleidingen voor Code95</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground font-semibold">
            Bij Team FrisseStart is ons motto: “Jouw succes is ons succes,” en we streven er voortdurend naar om onze klanten te helpen groeien en excelleren in hun vakgebieden.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer id="instructeurs" className="pb-16 md:pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Maak Kennis met <span className="text-primary">Onze Instructeurs</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {instructeurs.map((instructeur) => (
            <Card key={instructeur.naam} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/50">
                  <Image
                    src={instructeur.afbeelding}
                    alt={`Foto van ${instructeur.naam}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardTitle className="text-2xl text-foreground">{instructeur.naam}</CardTitle>
                <CardDescription className="text-primary font-medium">{instructeur.functie}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm mb-4 text-center">{instructeur.bio}</p>
                <h4 className="font-semibold text-foreground mb-2 mt-4 text-center">Specialisaties:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {instructeur.specialisaties.map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="bg-accent/10 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <UsersIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Word Deel van Ons <span className="text-primary">Geweldige Team!</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Heb jij passie voor transport en logistiek en wil je jouw kennis en ervaring delen? FrisseStart is altijd op zoek naar enthousiaste en deskundige instructeurs om ons team te versterken.
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white shadow-md transform hover:scale-105 transition-transform">
            <Link href="/contact?subject=Sollicitatie%20Instructeur" passHref legacyBehavior>
              <a>Solliciteer Nu <Send className="ml-2 h-5 w-5" /></a>
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </>
  );
}
