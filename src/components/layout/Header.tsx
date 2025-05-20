
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Importeer de Image component
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookOpenText, Users, Info, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: <Info className="h-5 w-5" /> },
  { href: '/opleidingsaanbod', label: 'Opleidingsaanbod', icon: <BookOpenText className="h-5 w-5" /> },
  { href: '/over-ons', label: 'Over Ons', icon: <Users className="h-5 w-5" /> },
  { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5" /> },
];

export function Header() {
  const pathname = usePathname();

  const NavLinkItem = ({ href, label, icon, isMobile = false }: { href: string; label: string; icon: React.ReactNode, isMobile?: boolean }) => (
    <Link href={href} passHref legacyBehavior>
      <a
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
          pathname === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
          isMobile && 'text-lg py-3'
        )}
      >
        {icon}
        {label}
      </a>
    </Link>
  );
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="FrisseStart Home">
          <Image src="/images/logo.png" alt="FrisseStart Logo" width={150} height={40} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <NavLinkItem key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <Button variant="default" asChild className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/opleidingsaanbod" passHref legacyBehavior>
              <a>Vind uw Cursus</a>
            </Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                <div className="flex flex-col gap-6">
                  <Link href="/" className="mb-4">
                    <Image src="/images/logo.png" alt="FrisseStart Logo" width={120} height={32} />
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                       <NavLinkItem key={link.href} {...link} isMobile />
                    ))}
                  </nav>
                   <Button variant="default" asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                     <Link href="/opleidingsaanbod" passHref legacyBehavior>
                       <a>Vind uw Cursus</a>
                      </Link>
                   </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
