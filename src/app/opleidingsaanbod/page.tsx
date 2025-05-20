
import { SectionContainer } from '@/components/ui/SectionContainer';
import { OpleidingenClientView } from '@/components/opleidingen/OpleidingenClientView'; // Nieuwe client component
import type { Opleiding, CursusDetail, Locatie } from '@/types/opleidingen'; // Aangenomen dat je types hebt gedefinieerd

async function fetchData(url: string): Promise<any[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

export default async function OpleidingsaanbodPage() {
  const [opleidingenData, cursusDetailsData, locatiesData] = await Promise.all([
    fetchData('https://opleidingen.frissestart.nl/wp-json/mo/v1/opleidingen') as Promise<Opleiding[]>,
    fetchData('https://opleidingen.frissestart.nl/wp-json/mo/v1/cursussen') as Promise<CursusDetail[]>,
    fetchData('https://opleidingen.frissestart.nl/wp-json/mo/v1/locaties') as Promise<Locatie[]>,
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
