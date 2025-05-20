
import { SectionContainer } from '@/components/ui/SectionContainer';
import { OpleidingenClientView } from '@/components/opleidingen/OpleidingenClientView';
import type { Opleiding, CursusDetail, Locatie } from '@/types/opleidingen';
import { fetchAndCache } from '@/lib/cache'; // Importeer de nieuwe cache functie

// Definieer de cache keys
const OPLEIDINGEN_CACHE_KEY = 'opleidingen_data_v1';
const CURSUS_DETAILS_CACHE_KEY = 'cursus_details_data_v1';
const LOCATIES_CACHE_KEY = 'locaties_data_v1';

export default async function OpleidingsaanbodPage() {
  // Gebruik fetchAndCache in plaats van een directe fetch
  const [opleidingenData, cursusDetailsData, locatiesData] = await Promise.all([
    fetchAndCache<Opleiding>('https://opleidingen.frissestart.nl/wp-json/mo/v1/opleidingen', OPLEIDINGEN_CACHE_KEY),
    fetchAndCache<CursusDetail>('https://opleidingen.frissestart.nl/wp-json/mo/v1/cursussen', CURSUS_DETAILS_CACHE_KEY),
    fetchAndCache<Locatie>('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties', LOCATIES_CACHE_KEY),
  ]);

  return (
    <SectionContainer className="py-12 md:py-16 lg:py-20">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Ons <span className="text-primary">Opleidingsaanbod</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Ontdek ons uitgebreide aanbod aan geplande opleidingen en vind de cursus die bij jou past. Profiteer van onze expertise en flexibiliteit.
        </p>
      </div>

      <OpleidingenClientView
        initialOpleidingenData={opleidingenData}
        initialCursusDetailsData={cursusDetailsData}
        initialLocatiesData={locatiesData}
      />
    </SectionContainer>
  );
}
