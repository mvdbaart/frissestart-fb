
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
  BookMarked,
  Briefcase,
  TagIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const opleidingsAanbodLink = { label: 'Opleidingsaanbod', icon: <BookOpenText className="h-5 w-5" /> };
const onzeInstructeursLink = { href: '/onze-instructeurs', label: 'Onze Instructeurs', icon: <Users className="h-5 w-5 mr-2 md:mr-0" /> };
const overOnsLink = { href: '/over-ons', label: 'Over Ons', icon: <Info className="h-5 w-5 mr-2 md:mr-0" /> };
const contactLink = { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5 mr-2 md:mr-0" /> };


const opleidingsAanbodItems = [
  { href: '/opleidingsaanbod', label: 'Alle Opleidingen', icon: <BookMarked className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/intern-certificeren', label: 'Intern Certificeren', icon: <Award className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/incompany-training', label: 'Incompany Training', icon: <Briefcase className="h-5 w-5 mr-2" /> },
  { href: '/actie-voordeel', label: 'Actie Voordeel', icon: <TagIcon className="h-5 w-5 mr-2" /> },
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
          !isMobile && 'md:px-2 lg:px-3',
          className
        )}
      >
        {icon && <span className={cn(isMobile ? 'mr-2' : 'md:mr-1 lg:mr-2')}>{icon}</span>}
        <span className={cn(isMobile ? '' : 'group-data-[collapsible=icon]:hidden group-data-[state=expanded]:md:inline')}>{label}</span>
      </a>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="FrisseStart Home">
          <Image src="/images/logo.png" alt="FrisseStart Logo" width={150} height={40} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  (pathname.startsWith('/opleidingsaanbod') || pathname.startsWith('/actie-voordeel')) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                  'md:px-2 lg:px-3'
                )}
              >
                <span className="md:mr-1 lg:mr-2">{opleidingsAanbodLink.icon}</span>
                <span className="group-data-[collapsible=icon]:hidden group-data-[state=expanded]:md:inline">{opleidingsAanbodLink.label}</span>
                <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              {opleidingsAanbodItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                  <Link href={item.href} passHref legacyBehavior>
                    <a className={cn(
                      'flex items-center w-full text-sm py-2 px-3',
                      pathname === item.href && 'bg-accent font-semibold text-accent-foreground'
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
          <NavLinkItem {...onzeInstructeursLink} />
          <NavLinkItem {...contactLink} />
        </nav>

        <div className="flex items-center gap-2">
           <Button
             size="default"
             asChild
             className="hidden sm:flex !bg-secondary dark:!bg-primary !text-white hover:!bg-secondary/90 dark:hover:!bg-primary/90 shadow-md transform hover:scale-105 transition-transform duration-300"
           >
            <Link href="/contact?subject=Offerte%20Aanvraag" passHref legacyBehavior>
              <a>Offerte Aanvragen</a>
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
                    {/* Opleidingsaanbod items voor mobiel */}
                    <div className="mt-2">
                        <p className="px-3 py-2 text-lg font-medium text-muted-foreground flex items-center gap-2">
                            {opleidingsAanbodLink.icon}
                            {opleidingsAanbodLink.label}
                        </p>
                        <div className="pl-6 flex flex-col gap-1 border-l-2 border-muted ml-3">
                            {opleidingsAanbodItems.map((item) => (
                                <NavLinkItem key={item.href} href={item.href} label={item.label} icon={item.icon} isMobile className="text-muted-foreground hover:text-foreground text-base" />
                            ))}
                        </div>
                    </div>
                    <NavLinkItem {...overOnsLink} isMobile />
                    <NavLinkItem {...onzeInstructeursLink} isMobile />
                    <NavLinkItem {...contactLink} isMobile />
                  </nav>
                  <Button size="lg" asChild className="!bg-secondary dark:!bg-primary !text-white hover:!bg-secondary/90 dark:hover:!bg-primary/90 transform hover:scale-105 transition-transform duration-300">
                    <Link href="/contact?subject=Offerte%20Aanvraag" passHref legacyBehavior>
                      <a>Offerte Aanvragen</a>
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
