
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <SectionContainer className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p>Admin pagina laden...</p>
        </div>
      </SectionContainer>
    );
  }

  // TODO: Voeg hier extra check toe of user.role === 'admin' als je role-based access implementeert
  // Bijvoorbeeld: if (user.customClaims?.admin !== true) { router.push('/'); return null; }

  return (
    <SectionContainer className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Admin <span className="text-primary">Beheerpaneel</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welkom op de beheerpagina, {user.email}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Gebruikersbeheer</CardTitle>
            <CardDescription>Beheer gebruikersaccounts en rollen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deze functionaliteit is nog niet geïmplementeerd.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Cursusbeheer</CardTitle>
            <CardDescription>Beheer cursussen, data en locaties.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deze functionaliteit is nog niet geïmplementeerd.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reviewbeheer</CardTitle>
            <CardDescription>Modereer en beheer ingediende reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deze functionaliteit is nog niet geïmplementeerd.
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  );
}
