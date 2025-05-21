
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  BookOpenText,
  Users,
  Info,
  MessageSquare,
  ChevronDown,
  Award,
  HomeIcon,
  BookMarked,
  Briefcase,
  TagIcon, // TagIcon toegevoegd
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const homeLink = { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5 mr-2" /> };
const overOnsLink = { href: '/over-ons', label: 'Over Ons', icon: <Users className="h-5 w-5 mr-2" /> };
const contactLink = { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5 mr-2" /> };

const opleidingsAanbodItems = [
  { href: '/opleidingsaanbod', label: 'Alle Opleidingen', icon: <BookMarked className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/intern-certificeren', label: 'Intern Certificeren', icon: <Award className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/incompany-training', label: 'Incompany Training', icon: <Briefcase className="h-5 w-5 mr-2" /> },
  { href: '/actie-voordeel', label: 'Actie Voordeel', icon: <TagIcon className="h-5 w-5 mr-2" /> }, // Nieuwe link toegevoegd
];

export function Header() {
  const pathname = usePathname();

  const NavLinkItem = ({ href, label, icon, isMobile = false, className }: { href: string; label: string; icon?: React.ReactNode, isMobile?: boolean, className?: string }) => (
    <Link href={href} passHref legacyBehavior>
      <a
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          pathname === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          isMobile && 'text-lg py-3 w-full',
          className
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLinkItem {...homeLink} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname.startsWith('/opleidingsaanbod') || pathname.startsWith('/actie-voordeel') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <BookOpenText className="h-5 w-5" />
                Opleidingsaanbod
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              {opleidingsAanbodItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                  <Link href={item.href} passHref legacyBehavior>
                    <a className={cn(
                      'flex items-center w-full text-sm',
                      pathname === item.href && 'font-semibold text-primary' 
                    )}>
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLinkItem {...overOnsLink} />
          <NavLinkItem {...contactLink} />
        </nav>

        <div className="flex items-center gap-2">
           <Button variant="default" asChild className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/opleidingsaanbod" passHref legacyBehavior>
              <a>Vind uw Cursus</a>
            </Link>
          </Button>
          {/* Mobile Navigation */}
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
                  <nav className="flex flex-col gap-1">
                    <NavLinkItem {...homeLink} isMobile />
                    
                    {/* Opleidingsaanbod items voor mobiel */}
                    <div className="mt-2">
                        <p className="px-3 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <BookOpenText className="h-5 w-5" />
                            Opleidingsaanbod
                        </p>
                        <div className="pl-6 flex flex-col gap-1 border-l-2 border-muted ml-3">
                            {opleidingsAanbodItems.map((item) => (
                                <NavLinkItem key={item.href} href={item.href} label={item.label} icon={item.icon} isMobile className="text-muted-foreground hover:text-foreground" />
                            ))}
                        </div>
                    </div>
                    <NavLinkItem {...overOnsLink} isMobile />
                    <NavLinkItem {...contactLink} isMobile />
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
