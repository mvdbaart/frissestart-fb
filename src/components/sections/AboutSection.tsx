import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Award, Briefcase, Users } from 'lucide-react';

export function AboutSection() {
  return (
    <SectionContainer id="about" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Over <span className="text-primary">FrisseStart Digital</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Bij FrisseStart Digital geloven we in de kracht van vernieuwing en continue ontwikkeling. Onze missie is om individuen en organisaties te voorzien van de digitale vaardigheden die nodig zijn om te excelleren in een snel veranderende wereld.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl group">
          <Image
            src="https://placehold.co/500x350.png"
            alt="Team van FrisseStart Digital"
            layout="fill"
            objectFit="cover"
            data-ai-hint="team collaboration"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Onze Visie & Aanpak</h3>
          <p className="text-muted-foreground mb-6">
            Wij streven ernaar om een brug te slaan tussen ambitie en expertise. Met een focus op praktijkgerichte trainingen, persoonlijke begeleiding en de nieuwste technologische inzichten, helpen we u om uw carrière een vliegende start of een nieuwe wending te geven.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Award className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Kwalitatieve Opleidingen</h4>
                <p className="text-sm text-muted-foreground">Door experts ontwikkelde cursussen met actuele content.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Briefcase className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Carrièregericht</h4>
                <p className="text-sm text-muted-foreground">Focus op vaardigheden die direct toepasbaar zijn op de arbeidsmarkt.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Users className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Deskundige Begeleiding</h4>
                <p className="text-sm text-muted-foreground">Persoonlijke ondersteuning van ervaren docenten en mentoren.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
