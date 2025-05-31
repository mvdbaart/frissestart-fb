
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PopularCoursesSection } from '@/components/sections/PopularCoursesSection';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Building, Users, Phone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReviewsData } from '@/lib/review-data';
import { ReviewCard } from '@/components/reviews/ReviewCard';


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
                <Image src="/images/soob-logo.png" alt="SOOB Logo" layout="fill" objectFit="contain" data-ai-hint="SOOB logo"/>
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

async function HomepageTestimonialsSection() {
  const allReviews = await getReviewsData();
  // Pak de eerste 3 meest recente reviews (data is al gesorteerd in getReviewsData)
  const recentReviews = allReviews.slice(0, 3);

  return (
    <SectionContainer id="homepage-testimonials" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Wat Onze <span className="text-primary">Klanten Zeggen</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Echte verhalen van mensen die hun carrière transformeerden met FrisseStart.
        </p>
      </div>
      {recentReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentReviews.map((review, index) => (
            <ReviewCard key={review.title + index} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">Geen reviews gevonden.</p>
      )}
      <div className="text-center mt-12">
        <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/reviews">
            Bekijk alle reviews <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
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
           <Link href="/opleidingsaanbod" passHref legacyBehavior>
            <a
              className={cn(
                buttonVariants({ size: 'lg' }),
                '!bg-primary !text-white hover:!bg-primary/90',
                'shadow-lg transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-4 sm:px-8'
              )}
            >
              Bekijk Alle Cursussen
            </a>
          </Link>
          <Link href="/contact?subject=Adviesgesprek%20Aanvraag" passHref legacyBehavior>
            <a
             className={cn(
                buttonVariants({ size: 'lg', variant: 'ghost' }),
                '!text-white hover:!bg-white/20 hover:!text-white',
                'shadow-lg transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-4 sm:px-8'
              )}
            >
              Neem Contact Op
            </a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}


export default async function HomePage() { // async toegevoegd
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PopularCoursesSection />
      <TrustBlock />
      <HomepageTestimonialsSection /> {/* Aangepaste sectie hier gebruikt */}
      <CtaSection />
    </>
  );
}
