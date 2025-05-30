
import { buttonVariants } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <SectionContainer className="relative pt-12 pb-8 md:pt-20 lg:pt-24 md:pb-16 lg:pb-20 h-[33vh] flex items-center justify-center text-center md:text-left text-white">
      <Image
        src="/images/frissestart-header.jpg"
        alt="Frisse Start Header Achtergrond"
        layout="fill"
        objectFit="cover"
        objectPosition="center top"
        quality={90}
        priority
        className="-z-10"
      />
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <div className="relative z-10 container max-w-screen-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:col-span-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Dé opleider voor transport en logistiek voor <span className="text-primary">professionals</span> én <span className="text-primary">bedrijven</span>.
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
              Of je nu zelf aan de slag wilt in de sector of jouw personeel wilt bijscholen: Frisse Start biedt erkende opleidingen, persoonlijke begeleiding en 100% SOOB-subsidie. Snel starten, alles geregeld.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link href="/opleidingsaanbod" passHref legacyBehavior>
                <a
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    '!bg-primary !text-white hover:!bg-primary/90',
                    'shadow-lg transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-4 sm:px-8'
                  )}
                >
                  Bekijk opleidingen
                </a>
              </Link>
              <Link href="/opleidingsaanbod/incompany-training" passHref legacyBehavior>
                <a
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'secondary' }),
                     '!bg-secondary !text-secondary-foreground hover:!bg-secondary/90',
                    'shadow-lg transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-4 sm:px-8'
                  )}
                >
                  Opleidingen voor bedrijven
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:col-span-1">
            {/* This column is intentionally empty for layout purposes on larger screens */}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
