
import Link from 'next/link';
import Image from 'next/image';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Forklift, HeartPulse, HardHat } from 'lucide-react'; // FirstAidKit vervangen door HeartPulse

const popularCourses = [
  {
    title: "Heftruck Cursus",
    description: "Leer veilig en efficiënt werken met een heftruck. Essentieel voor logistieke professionals en magazijnmedewerkers.",
    image: "https://placehold.co/400x250.png",
    dataAiHint: "forklift warehouse",
    link: "/opleidingsaanbod",
    icon: <Forklift className="h-8 w-8 text-primary mb-3" />,
  },
  {
    title: "BHV Cursus (Bedrijfshulpverlening)",
    description: "Word bedrijfshulpverlener en leer levensreddende eerste hulp verlenen, een beginnende brand bestrijden en evacueren.",
    image: "https://placehold.co/400x250.png",
    dataAiHint: "first aid emergency",
    link: "/opleidingsaanbod",
    icon: <HeartPulse className="h-8 w-8 text-primary mb-3" />, // FirstAidKit vervangen door HeartPulse
  },
  {
    title: "VCA Cursus (Basis & VOL)",
    description: "Behaal uw VCA certificaat (Basisveiligheid of Veiligheid voor Operationeel Leidinggevenden) en werk veilig.",
    image: "https://placehold.co/400x250.png",
    dataAiHint: "safety construction helmet",
    link: "/opleidingsaanbod",
    icon: <HardHat className="h-8 w-8 text-primary mb-3" />,
  }
];

export function PopularCoursesSection() {
  return (
    <SectionContainer id="popular-courses" className="bg-muted/30">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Populaire <span className="text-primary">Opleidingen</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ontdek onze meest gevraagde cursussen die professionals helpen hun vaardigheden te verbeteren en veiligheid te waarborgen.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {popularCourses.map((course) => (
          <Card key={course.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card">
            <CardHeader className="p-0 relative">
              <Image
                src={course.image}
                alt={course.title}
                width={400}
                height={250}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={course.dataAiHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col">
              <div className="flex justify-center mb-3">{course.icon}</div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2 text-center">{course.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm mb-4 flex-grow text-center">
                {course.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-6 border-t bg-card/50">
              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href={course.link} passHref legacyBehavior>
                  <a>
                    Meer Info <ArrowRight size={16} className="ml-2" />
                  </a>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="text-center mt-12 md:mt-16">
        <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/opleidingsaanbod" passHref legacyBehavior>
            <a>Bekijk Alle Opleidingen</a>
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
