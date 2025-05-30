
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Zap, Users, CheckCircle } from 'lucide-react';

const newFeatures = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "100% SOOB Garantie",
    description: "Wij garanderen 100% SOOB-subsidie voor al onze erkende opleidingen in de transport en logistiek.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Geen Wachttijden",
    description: "Direct starten met je opleiding zonder lange wachttijden. Flexibele planning mogelijk.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Professionele Ondersteuning",
    description: "Onze ervaren docenten bieden persoonlijke begeleiding tijdens je hele opleidingstraject.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Direct Geregeld",
    description: "Jij focust op je opleiding, wij doen de rest, van inschrijving tot subsidieaanvraag. Geen administratieve rompslomp.",
  },
];

export function FeaturesSection() {
  return (
    <SectionContainer id="features" className="bg-accent/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Waarom Kiezen Voor <span className="text-primary">FrisseStart</span>?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Wij bieden hoogwaardige opleidingen aan voor transport en logistiek professionals die willen groeien in hun vakgebied.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {newFeatures.map((feature, index) => (
          <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="flex flex-col items-center text-center gap-4 pb-4">
              {feature.icon}
              <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
