

import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { CourseRecommender } from '@/components/CourseRecommender';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';


// Placeholder for actual testimonial data
const testimonials = [
  {
    quote: "Dankzij FrisseStart heb ik mijn carrière een nieuwe impuls kunnen geven. De cursus was praktijkgericht en de docenten super behulpzaam!",
    name: "Anna de Vries",
    role: "Webdeveloper",
    avatar: "https://placehold.co/100x100.png"
  },
  {
    quote: "De flexibiliteit van de online modules paste perfect bij mijn drukke schema. Ik heb enorm veel geleerd en pas dit nu dagelijks toe in mijn werk.",
    name: "Bas Jansen",
    role: "Data Analist",
    avatar: "https://placehold.co/100x100.png"
  },
  {
    quote: "Een absolute aanrader! FrisseStart biedt kwalitatieve opleidingen die je echt voorbereiden op de toekomst.",
    name: "Sophie Meijer",
    role: "UX Designer",
    avatar: "https://placehold.co/100x100.png"
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
    <SectionContainer className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      <div className="text-center py-12 px-6 rounded-xl shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Klaar om uw Toekomst te Starten?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
          Neem de volgende stap in uw carrière. Ontdek onze cursussen of vraag een persoonlijk adviesgesprek aan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground hover:border-primary-foreground/90 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href="/opleidingsaanbod" passHref legacyBehavior>
              <a>Bekijk Alle Cursussen</a>
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground transform hover:scale-105 transition-transform duration-300">
            <Link href="/contact" passHref legacyBehavior>
              <a>Neem Contact Op</a>
            </Link>
          </Button>
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
      <CourseRecommender />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
