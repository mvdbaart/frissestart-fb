import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    // Verwijder de gradient achtergrond, we gebruiken nu een volledige afbeelding
    <SectionContainer className="relative pt-20 md:pt-24 lg:pt-32 min-h-[calc(100vh-4rem)] flex items-center justify-center text-center md:text-left text-white">
      {/* Achtergrondafbeelding */}
      <Image
        src="/images/frissestart-header.jpg" // Pad naar je header afbeelding
        alt="Frisse Start Header Achtergrond"
        layout="fill"
        objectFit="cover"
        objectPosition="center" // Zorgt ervoor dat het midden van de afbeelding zichtbaar is
        quality={90} // Iets hogere kwaliteit voor hero afbeeldingen
        priority // Belangrijk voor LCP
        className="-z-10" // Plaats achter de content
      />
      {/* Overlay voor betere leesbaarheid van tekst */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* Container voor de content, zodat deze boven de afbeelding en overlay komt */}
      <div className="relative z-10 container max-w-screen-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:col-span-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Dé opleider voor transport en logistiek voor <span className="text-primary">professionals</span> én <span className="text-primary">bedrijven</span>.
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto md:mx-0">
              Ontdek praktijkgerichte cursussen die u voorbereiden op de banen van de toekomst. Bij FrisseStart investeren we in uw groei.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Link href="/#course-recommender">Vind uw Perfecte Cursus</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg transform hover:scale-105 transition-transform duration-300 border-white text-white hover:bg-white hover:text-primary">
                <Link href="/cursussen">Ontdek Alle Cursussen</Link>
              </Button>
            </div>
          </div>
          {/* Optioneel: rechterkolom leeg of een andere call-to-action/afbeelding als je geen 2-koloms layout meer wilt met de tekst */}
          <div className="hidden md:block md:col-span-1"> 
            {/* Deze kolom kan leeg blijven of je kunt hier andere content plaatsen als de tekst niet meer over de hele breedte van de afbeelding moet. */}
            {/* Bijvoorbeeld een subtiele grafische hint of een testimonial quote */}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
