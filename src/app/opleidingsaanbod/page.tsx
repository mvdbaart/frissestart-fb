
import { SectionContainer } from '@/components/ui/SectionContainer';
import { OpleidingenClientView } from '@/components/opleidingen/OpleidingenClientView';
import { getCourses } from '@/lib/course-data'; // Gebruik de nieuwe functie om data uit Firestore te halen

export default async function OpleidingsaanbodPage() {
  const courses = await getCourses(); // Haal cursussen uit Firestore

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
        initialCourses={courses} // Geef de direct bruikbare data door
      />
    </SectionContainer>
  );
}

