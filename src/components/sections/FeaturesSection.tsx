import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, BookOpen, TrendingUp, Award, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Innovatieve Cursussen",
    description: "Blijf voorop met onze constant bijgewerkte lesprogramma's en technologieën.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Expert Docenten",
    description: "Leer van professionals uit de industrie met jarenlange praktijkervaring.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Flexibel Leren",
    description: "Studeer in uw eigen tempo, waar en wanneer het u uitkomt, met onze online modules.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Carrière Ondersteuning",
    description: "Ontvang begeleiding bij het vinden van een baan of het starten van uw eigen onderneming.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Gecertificeerde Kwaliteit",
    description: "Onze cursussen zijn erkend en bieden waardevolle certificaten voor uw CV.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Praktijkgericht",
    description: "Focus op projecten en casestudies die u voorbereiden op echte werksituaties.",
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
          Wij bieden een unieke leerervaring die is ontworpen om u succesvol te maken in de digitale economie.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              {feature.icon}
              <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
