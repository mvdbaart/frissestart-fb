
import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';

export function AboutSection() {
  return (
    <SectionContainer id="about" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Over <span className="text-primary">FrisseStart</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Team FrisseStart is een hecht en gepassioneerd collectief van ervaren professionals die zich inzetten voor het succes van onze klanten.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl group">
          <Image
            src="https://placehold.co/500x350.png"
            alt="Team van FrisseStart"
            layout="fill"
            objectFit="cover"
            data-ai-hint="team meeting professional"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div>
          <p className="text-muted-foreground mb-4">
            Ons team bestaat uit trainers, experts en consultants met uitgebreide kennis en ervaring op het gebied van incompany trainingen voor Code95, logistiek en veiligheid.
          </p>
          <p className="text-muted-foreground mb-4">
            Wat ons onderscheidt, is onze toewijding aan het begrijpen van de unieke behoeften van elke klant. We geloven in nauwe samenwerking en luisteren naar de specifieke leerdoelen van organisaties, zodat we op maat gemaakte trainingsprogramma’s kunnen ontwikkelen die echte impact hebben.
          </p>
          <p className="text-muted-foreground font-semibold">
            Bij Team FrisseStart is ons motto: “Jouw succes is ons succes,” en we streven er voortdurend naar om onze klanten te helpen groeien en excelleren in hun vakgebieden.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
