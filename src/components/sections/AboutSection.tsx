
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';

const aboutItems = [
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Ons Team: Gepassioneerd & Ervaren",
    description: "Team FrisseStart is een hecht en gepassioneerd collectief van ervaren professionals die zich inzetten voor het succes van onze klanten. Ons team bestaat uit trainers, experts en consultants met uitgebreide kennis en ervaring op het gebied van incompany trainingen voor Code95, logistiek en veiligheid.",
  },
  {
    icon: <Target className="h-10 w-10 text-primary mb-4" />,
    title: "Unieke Klantfocus: Maatwerk dat Werkt",
    description: "Wat ons onderscheidt, is onze toewijding aan het begrijpen van de unieke behoeften van elke klant. We geloven in nauwe samenwerking en luisteren naar de specifieke leerdoelen van organisaties, zodat we op maat gemaakte trainingsprogramma’s kunnen ontwikkelen die echte impact hebben.",
  },
  {
    icon: <Award className="h-10 w-10 text-primary mb-4" />,
    title: "Onze Belofte: Jouw Succes is Ons Succes",
    description: "Bij Team FrisseStart is ons motto: “Jouw succes is ons succes,” en we streven er voortdurend naar om onze klanten te helpen groeien en excelleren in hun vakgebieden.",
  },
];

export function AboutSection() {
  return (
    <SectionContainer id="about" className="bg-background">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Over <span className="text-primary">FrisseStart</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Team FrisseStart is een hecht en gepassioneerd collectief van ervaren professionals die zich inzetten voor het succes van onze klanten.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {aboutItems.map((item, index) => (
          <Card key={index} className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              {item.icon}
              <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="mt-12 md:mt-16">
        <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] rounded-lg overflow-hidden shadow-xl group max-w-4xl mx-auto">
          <Image
            src="https://placehold.co/800x450.png"
            alt="Sfeerbeeld FrisseStart team of training"
            layout="fill"
            objectFit="cover"
            data-ai-hint="teamwork education professional"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
