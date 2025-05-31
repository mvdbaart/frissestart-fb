
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewManagementSection } from '@/components/admin/ReviewManagementSection';
import { CourseManagementSection } from '@/components/admin/CourseManagementSection';
import { UserManagementSection } from '@/components/admin/UserManagementSection';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/admin');
    }
    // Toekomstige check voor admin rol:
    // if (!isLoading && user && !user.customClaims?.admin) {
    //   toast({ variant: "destructive", title: "Geen Toegang", description: "U heeft geen rechten om deze pagina te bekijken." });
    //   router.push('/');
    // }
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

  return (
    <SectionContainer className="py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Admin <span className="text-primary">Beheerpaneel</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Welkom op de beheerpagina, {user.email}.
        </p>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8">
          <TabsTrigger value="reviews">Reviewbeheer</TabsTrigger>
          <TabsTrigger value="courses">Cursusbeheer</TabsTrigger>
          <TabsTrigger value="users">Gebruikersbeheer</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ReviewManagementSection />
        </TabsContent>
        <TabsContent value="courses">
          <CourseManagementSection />
        </TabsContent>
        <TabsContent value="users">
          <UserManagementSection />
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
