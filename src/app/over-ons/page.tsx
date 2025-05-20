import { SectionContainer } from '@/components/ui/SectionContainer';
import Image from 'next/image';
import { Award, Briefcase, Users, Lightbulb, Target, Handshake } from 'lucide-react';

export default function OverOnsPage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Over <span className="text-primary">FrisseStart</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Wij zijn uw toegewijde partner in het navigeren en succesvol zijn in de steeds evoluerende digitale wereld.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer id="mission-vision" className="pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl group">
            <Image
              src="https://placehold.co/500x500.png"
              alt="Team FrisseStart in overleg"
              layout="fill"
              objectFit="cover"
              data-ai-hint="team meeting"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-6">Onze Missie & Visie</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Target className="h-8 w-8 text-secondary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Onze Missie</h3>
                  <p className="text-muted-foreground">
                    Individuen en organisaties empoweren met de essentiële digitale vaardigheden en kennis om te bloeien in het digitale tijdperk. We streven ernaar toegankelijke, praktijkgerichte en transformerende leerervaringen te bieden.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Lightbulb className="h-8 w-8 text-secondary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Onze Visie</h3>
                  <p className="text-muted-foreground">
                    Een leidende kracht zijn in digitale educatie, bekend om onze innovatie, kwaliteit en de positieve impact die we hebben op de carrières en levens van onze cursisten. We zien een toekomst waarin iedereen de kans heeft om digitaal vaardig te zijn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="values" className="bg-accent/20 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Onze Kernwaarden</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            De principes die ons leiden in alles wat we doen.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Award className="h-10 w-10 text-primary mb-4" />, title: "Kwaliteit", description: "We zetten ons in voor de hoogste standaarden in cursusontwerp en -levering." },
            { icon: <Users className="h-10 w-10 text-primary mb-4" />, title: "Cursistgericht", description: "Het succes en de groei van onze cursisten staan centraal in onze aanpak." },
            { icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />, title: "Innovatie", description: "We omarmen verandering en integreren voortdurend nieuwe technologieën en methoden." },
            { icon: <Briefcase className="h-10 w-10 text-primary mb-4" />, title: "Praktijkrelevantie", description: "Onze cursussen zijn ontworpen om direct toepasbare vaardigheden te bieden." },
            { icon: <Handshake className="h-10 w-10 text-primary mb-4" />, title: "Integriteit", description: "We handelen ethisch en transparant in al onze interacties." },
            { icon: <Target className="h-10 w-10 text-primary mb-4" />, title: "Toegankelijkheid", description: "We streven ernaar leren voor iedereen mogelijk te maken, ongeacht achtergrond." },
          ].map(value => (
            <div key={value.title} className="bg-card p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              {value.icon}
              <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="team" className="pb-16">
         <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ons Team</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Maak kennis met enkele van de gepassioneerde professionals achter FrisseStart. (Deze sectie is een placeholder)
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
             <div key={i} className="bg-card p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <Image src={`https://placehold.co/150x150.png`} alt={`Teamlid ${i}`} width={120} height={120} className="rounded-full mx-auto mb-4" data-ai-hint="professional person" />
                <h3 className="text-lg font-semibold text-foreground">Naam Teamlid {i}</h3>
                <p className="text-sm text-primary">Functie</p>
             </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <p className="text-muted-foreground">We zijn een divers team van experts, docenten en ondersteunend personeel, allemaal toegewijd aan uw succes.</p>
        </div>
      </SectionContainer>
    </>
  );
}
