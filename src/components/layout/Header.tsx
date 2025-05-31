
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
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
  Phone,
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
const overOnsLink = { href: '/over-ons', label: 'Over Ons', icon: <Info className="h-5 w-5 mr-2" /> };
const contactLink = { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5 mr-2" /> };
const contactInfoDropdownLabel = "Contact & Info";


const opleidingsAanbodItems = [
  { href: '/opleidingsaanbod', label: 'Alle Opleidingen', icon: <BookMarked className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/intern-certificeren', label: 'Intern Certificeren', icon: <Award className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/incompany-training', label: 'Incompany Training', icon: <Briefcase className="h-5 w-5 mr-2" /> },
  { href: '/actie-voordeel', label: 'Actie Voordeel', icon: <TagIcon className="h-5 w-5 mr-2" /> },
];


export function Header() {
  const pathname = usePathname();

  const NavLinkItem = ({ href, label, icon, isMobile = false, className }: { href: string; label: string; icon?: React.ReactNode, isMobile?: boolean, className?: string }) => (
    <Link
      href={href}
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
    </Link>
  );

  const contactInfoItems = [overOnsLink, contactLink];

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
                  (pathname.startsWith('/opleidingsaanbod') || pathname === '/actie-voordeel') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
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
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center w-full text-sm py-2 px-3',
                      pathname === item.href && 'bg-accent font-semibold text-accent-foreground'
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <NavLinkItem {...onzeInstructeursLink} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                variant="ghost"
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  (pathname === overOnsLink.href || pathname === contactLink.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                  'md:px-2 lg:px-3'
                )}
              >
                <span className="md:mr-1 lg:mr-2">{contactInfoItems[1].icon}</span> {/* Using Contact icon as main for dropdown */}
                <span className="group-data-[collapsible=icon]:hidden group-data-[state=expanded]:md:inline">{contactInfoDropdownLabel}</span>
                <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              {contactInfoItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                   <Link
                    href={item.href}
                    className={cn(
                      'flex items-center w-full text-sm py-2 px-3',
                      pathname === item.href && 'bg-accent font-semibold text-accent-foreground'
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
           <a
             href="tel:+31408459091"
             className={cn(
              buttonVariants({ size: 'default', variant: 'secondary' }),
              '!bg-secondary !text-secondary-foreground hover:!bg-secondary/90',
              'hidden sm:flex items-center gap-2 shadow-md transform hover:scale-105 transition-transform duration-300'
             )}
           >
             <Phone className="h-4 w-4" />
             040 845 90 91
           </a>
           <Link
              href="/contact?subject=Offerte%20Aanvraag"
              className={cn(
                buttonVariants({ size: 'default', variant: 'default' }),
                '!bg-primary !text-white hover:!bg-primary/90',
                'hidden sm:flex shadow-md transform hover:scale-105 transition-transform duration-300'
              )}
            >
              Offerte Aanvragen
            </Link>
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
                    <NavLinkItem {...onzeInstructeursLink} isMobile />
                    <div className="mt-2">
                        <p className="px-3 py-2 text-lg font-medium text-muted-foreground flex items-center gap-2">
                             {contactInfoItems[1].icon} {/* Using Contact icon */}
                            {contactInfoDropdownLabel}
                        </p>
                        <div className="pl-6 flex flex-col gap-1 border-l-2 border-muted ml-3">
                            {contactInfoItems.map((item) => (
                                <NavLinkItem key={item.href} href={item.href} label={item.label} icon={item.icon} isMobile className="text-muted-foreground hover:text-foreground text-base" />
                            ))}
                        </div>
                    </div>
                  </nav>
                  <a
                     href="tel:+31408459091"
                     className={cn(
                      buttonVariants({ size: 'lg', variant: 'secondary' }),
                      '!bg-secondary !text-secondary-foreground hover:!bg-secondary/90',
                      'transform hover:scale-105 transition-transform duration-300 w-full text-center flex items-center justify-center gap-2'
                     )}
                   >
                     <Phone className="h-5 w-5" />
                     040 845 90 91
                   </a>
                   <Link
                      href="/contact?subject=Offerte%20Aanvraag"
                      className={cn(
                        buttonVariants({ size: 'lg', variant: 'default' }),
                        '!bg-primary !text-white hover:!bg-primary/90',
                        'transform hover:scale-105 transition-transform duration-300 w-full text-center'
                      )}
                    >
                      Offerte Aanvragen
                    </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

