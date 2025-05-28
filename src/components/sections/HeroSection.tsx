
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <SectionContainer className="relative pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20 h-[33vh] flex items-center justify-center text-center md:text-left text-white">
      <Image
        src="/images/frissestart-header.jpg"
        alt="Frisse Start Header Achtergrond"
        layout="fill"
        objectFit="cover"
        objectPosition="center" 
        quality={90}
        priority
        className="-z-10"
      />
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

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
              <Button
                size="lg"
                asChild
                variant="default" // Primary color (orange)
                className="text-white hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <Link href="/opleidingsaanbod" passHref legacyBehavior>
                  <a>Onze opleidingen</a>
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                variant="secondary" // Secondary color (green)
                className="shadow-lg transform hover:scale-105 transition-transform duration-300 hover:bg-secondary/90" // text-secondary-foreground is already white by default
              >
                <Link href="/contact?subject=Certificeringsscan%20Aanvraag" passHref legacyBehavior>
                  <a>Vrijblijvende werknemers certificeringsscan</a>
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block md:col-span-1"> 
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
