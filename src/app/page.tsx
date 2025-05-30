
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Building, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Nieuwe TrustBlock component
function TrustBlock() {
  return (
    <SectionContainer id="trust-block" className="bg-muted/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Gebouwd op <span className="text-primary">Vertrouwen & Expertise</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-primary mb-4" />
            <p className="text-2xl font-semibold text-foreground">Al &gt;3.500 professionals opgeleid</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Building className="h-12 w-12 text-primary mb-4" />
            <p className="text-2xl font-semibold text-foreground mb-4">Erkend door</p>
            <div className="flex justify-center items-center gap-6">
              <div className="relative h-12 w-24">
                <Image src="/images/soob-logo.png" alt="SOOB Logo" layout="fill" objectFit="contain" data-ai-hint="SOOB logo" />
              </div>
              <div className="relative h-12 w-24">
                <Image src="/images/tln-logo.png" alt="TLN Logo" layout="fill" objectFit="contain" data-ai-hint="TLN logo" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  );
}

const testimonials = [
  {
    quote: "Dankzij FrisseStart heb ik mijn carrière een nieuwe impuls kunnen geven. De cursus was praktijkgericht en de docenten super behulpzaam!",
    name: "Anna de Vries",
    role: "Webdeveloper",
    avatar: "https://placehold.co/100x100.png",
    rating: 5,
  },
  {
    quote: "De flexibiliteit van de online modules paste perfect bij mijn drukke schema. Ik heb enorm veel geleerd en pas dit nu dagelijks toe in mijn werk.",
    name: "Bas Jansen",
    role: "Data Analist",
    avatar: "https://placehold.co/100x100.png",
    rating: 4,
  },
  {
    quote: "Een absolute aanrader! FrisseStart biedt kwalitatieve opleidingen die je echt voorbereiden op de toekomst.",
    name: "Sophie Meijer",
    role: "UX Designer",
    avatar: "https://placehold.co/100x100.png",
    rating: 5,
  }
];

function TestimonialsSection() {
  return (
    <SectionContainer id="testimonials" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Wat Onze <span className="text-primary">Cursisten Zeggen</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Echte verhalen van mensen die hun carrière transformeerden met FrisseStart.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardContent className="pt-6 flex-grow">
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
            </CardContent>
            <CardFooter className="flex items-center gap-4 border-t pt-4 mt-auto">
              <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}


function CtaSection() {
  return (
    <SectionContainer className="bg-secondary text-secondary-foreground">
      <div className="text-center py-12 px-6 rounded-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Klaar om uw Toekomst te Starten?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
          Neem de volgende stap in uw carrière. Ontdek onze cursussen of vraag een persoonlijk adviesgesprek aan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/opleidingsaanbod"
            passHref
            legacyBehavior
            className={cn(
              buttonVariants({ size: 'lg' }),
              '!bg-primary hover:!bg-primary/90 !text-white',
              'shadow-lg transform hover:scale-105 transition-transform duration-300'
            )}
          >
            <a>Bekijk Alle Cursussen</a>
          </Link>
          <Link
            href="/contact"
            passHref
            legacyBehavior
            className={cn(
              buttonVariants({ size: 'lg', variant: 'ghost' }),
              'text-white hover:bg-white/20 hover:text-white',
              'transform hover:scale-105 transition-transform duration-300'
            )}
          >
            <a>Neem Contact Op</a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TrustBlock />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}

