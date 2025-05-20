
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image'; // Import Image component

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/logo.png" alt="FrisseStart Logo" width={160} height={43} />
            </Link>
            <p className="text-muted-foreground text-sm">
              Uw partner voor een frisse start in de digitale wereld. Wij bieden praktijkgerichte cursussen en opleidingen.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Snelle Links</h3>
            <ul className="space-y-2">
              <li><Link href="/over-ons" className="text-muted-foreground hover:text-primary transition-colors">Over Ons</Link></li>
              <li><Link href="/opleidingsaanbod" className="text-muted-foreground hover:text-primary transition-colors">Opleidingsaanbod</Link></li> {/* Aangepast */}
              <li><Link href="/#course-recommender" className="text-muted-foreground hover:text-primary transition-colors">Cursus Recommender</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Volg Ons</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={24} /></Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={24} /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={24} /></Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={24} /></Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} FrisseStart. Alle rechten voorbehouden.</p> {/* "Digital" verwijderd */}
          <p>Ontworpen met passie.</p>
        </div>
      </div>
    </footer>
  );
}
