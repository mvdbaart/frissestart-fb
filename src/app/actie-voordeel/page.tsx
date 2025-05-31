
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ActieVoordeelClientView } from '@/components/actie-voordeel/ActieVoordeelClientView';
import { getCourses } from '@/lib/course-data'; // Gebruik de nieuwe functie

export default async function ActieVoordeelPage() {
  const allCourses = await getCourses(); // Haal alle cursussen uit Firestore

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
        initialCourses={allCourses} // Geef de volledige dataset door
      />
    </SectionContainer>
  );
}
