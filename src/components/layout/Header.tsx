
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
  LogIn,
  LogOut,
  UserPlus,
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, // DropdownMenuTrigger hier toegevoegd
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';

const opleidingsAanbodLink = { label: 'Opleidingsaanbod', icon: <BookOpenText className="h-5 w-5" /> };
const onzeInstructeursLink = { href: '/onze-instructeurs', label: 'Onze Instructeurs', icon: <Users className="h-5 w-5 mr-2 md:mr-0" /> };
const overOnsLink = { href: '/over-ons', label: 'Over Ons', icon: <Info className="h-5 w-5 mr-2" /> };
const contactLink = { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5 mr-2" /> };
const contactInfoDropdownLabel = "Info & Contact";


const opleidingsAanbodItems = [
  { href: '/opleidingsaanbod', label: 'Alle Opleidingen', icon: <BookMarked className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/intern-certificeren', label: 'Intern Certificeren', icon: <Award className="h-5 w-5 mr-2" /> },
  { href: '/opleidingsaanbod/incompany-training', label: 'Incompany Training', icon: <Briefcase className="h-5 w-5 mr-2" /> },
  { href: '/actie-voordeel', label: 'Actie Voordeel', icon: <TagIcon className="h-5 w-5 mr-2" /> },
];


export function Header() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth(); 

  const NavLinkItem = ({ href, label, icon, isMobile = false, className, onClick }: { href: string; label: string; icon?: React.ReactNode, isMobile?: boolean, className?: string, onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
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
                <span className="md:mr-1 lg:mr-2">{contactLink.icon}</span> {}
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
          {isLoading ? (
            <div className="hidden sm:flex h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-3 text-sm font-medium">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span className="hidden sm:inline truncate max-w-[100px]">{user.email}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin" className="flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Beheer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'ghost' }),
                  'hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground'
                )}
              >
                <LogIn className="h-4 w-4" /> Inloggen
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'default' }),
                  '!bg-primary !text-white hover:!bg-primary/90',
                  'hidden sm:flex items-center gap-1 shadow-sm'
                )}
              >
                <UserPlus className="h-4 w-4" /> Registreren
              </Link>
            </>
          )}
          
          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 flex flex-col">
                <Link href="/" className="mb-6">
                  <Image src="/images/logo.png" alt="FrisseStart Logo" width={120} height={32} />
                </Link>
                <nav className="flex flex-col gap-1 flex-grow">
                  {}
                  <p className="px-3 py-2 text-lg font-medium text-muted-foreground flex items-center gap-2">
                      {opleidingsAanbodLink.icon}
                      {opleidingsAanbodLink.label}
                  </p>
                  <div className="pl-6 flex flex-col gap-1 border-l-2 border-muted ml-3 mb-2">
                      {opleidingsAanbodItems.map((item) => (
                          <NavLinkItem key={item.href} href={item.href} label={item.label} icon={item.icon} isMobile className="text-muted-foreground hover:text-foreground text-base" />
                      ))}
                  </div>
                  <NavLinkItem {...onzeInstructeursLink} isMobile />
                  {}
                  <p className="px-3 py-2 text-lg font-medium text-muted-foreground flex items-center gap-2 mt-2">
                       {contactLink.icon} {}
                      {contactInfoDropdownLabel}
                  </p>
                  <div className="pl-6 flex flex-col gap-1 border-l-2 border-muted ml-3">
                      {contactInfoItems.map((item) => (
                          <NavLinkItem key={item.href} href={item.href} label={item.label} icon={item.icon} isMobile className="text-muted-foreground hover:text-foreground text-base" />
                      ))}
                  </div>
                </nav>

                {}
                <div className="mt-auto pt-6 border-t border-border/40 space-y-3">
                  {isLoading ? (
                     <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                  ) : user ? (
                    <>
                      <div className="text-center text-sm text-muted-foreground mb-2 truncate">{user.email}</div>
                       <Button asChild variant="outline" className="w-full flex items-center justify-center gap-2">
                         <Link href="/admin">
                            <ShieldCheck className="mr-2 h-5 w-5" /> Beheer
                         </Link>
                       </Button>
                      <Button onClick={signOut} variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-5 w-5" /> Uitloggen
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={cn(
                          buttonVariants({ size: 'lg', variant: 'outline' }),
                          'w-full flex items-center justify-center gap-2'
                        )}
                      >
                        <LogIn className="h-5 w-5" /> Inloggen
                      </Link>
                      <Link
                        href="/register"
                        className={cn(
                          buttonVariants({ size: 'lg', variant: 'default' }),
                          '!bg-primary !text-white hover:!bg-primary/90 w-full flex items-center justify-center gap-2'
                        )}
                      >
                        <UserPlus className="h-5 w-5" /> Registreren
                      </Link>
                    </>
                  )}
                   <a
                     href="tel:+31408459091"
                     className={cn(
                      buttonVariants({ size: 'lg', variant: 'secondary' }),
                      '!bg-secondary !text-secondary-foreground hover:!bg-secondary/90',
                      'transform hover:scale-105 transition-transform duration-300 w-full text-center flex items-center justify-center gap-2 mt-3'
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
                        'transform hover:scale-105 transition-transform duration-300 w-full text-center mt-3'
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
