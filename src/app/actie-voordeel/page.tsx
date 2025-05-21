
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ActieVoordeelClientView } from '@/components/actie-voordeel/ActieVoordeelClientView';
import type { Opleiding, CursusDetail, Locatie } from '@/types/opleidingen';
import { fetchAndCache } from '@/lib/cache';

const OPLEIDINGEN_CACHE_KEY = 'opleidingen_data_v1';
const CURSUS_DETAILS_CACHE_KEY = 'cursus_details_data_v1';
const LOCATIES_CACHE_KEY = 'locaties_data_v1';

export default async function ActieVoordeelPage() {
  const [opleidingenData, cursusDetailsData, locatiesData] = await Promise.all([
    fetchAndCache<Opleiding>('https://opleidingen.frissestart.nl/wp-json/mo/v1/opleidingen', OPLEIDINGEN_CACHE_KEY),
    fetchAndCache<CursusDetail>('https://opleidingen.frissestart.nl/wp-json/mo/v1/cursussen', CURSUS_DETAILS_CACHE_KEY),
    fetchAndCache<Locatie>('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties', LOCATIES_CACHE_KEY),
  ]);

  return (
    <SectionContainer className="py-12 md:py-16 lg:py-20">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Tijdelijke <span className="text-primary">Actie: 10% Korting!</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Profiteer nu van 10% korting op alle cursussen die binnen de komende 31 dagen starten. Mis deze kans niet om uw vaardigheden voordelig uit te breiden en uw plek veilig te stellen!
        </p>
      </div>

      <ActieVoordeelClientView
        initialOpleidingenData={opleidingenData}
        initialCursusDetailsData={cursusDetailsData}
        initialLocatiesData={locatiesData}
      />
    </SectionContainer>
  );
}
