
import { SectionContainer } from '@/components/ui/SectionContainer';
import { CheckCircle } from 'lucide-react';

const incompanyVoordelen = [
  "Kies zelf je datum & cursuslocatie",
  "Ook op zaterdag",
  "Behaal in 3.5 dag je volledige Code95",
  "Reguliere en E-Learning modules"
];

export default function IncompanyTrainingPage() {
  return (
    <SectionContainer className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Incompany <span className="text-primary">Training</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Flexibele en op maat gemaakte trainingen op uw eigen locatie.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Gevarieerd Cursusaanbod</h2>
        <ul className="space-y-4">
          {incompanyVoordelen.map((voordeel, index) => (
            <li key={index} className="flex items-center text-lg text-muted-foreground">
              <CheckCircle className="h-6 w-6 text-secondary mr-3 shrink-0" />
              {voordeel}
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
