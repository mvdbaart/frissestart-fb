
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import type { AuthError } from 'firebase/auth';

const RegisterFormSchema = z.object({
  email: z.string().email({ message: "Ongeldig e-mailadres." }),
  password: z.string().min(6, { message: "Wachtwoord moet minimaal 6 karakters bevatten." }),
  confirmPassword: z.string().min(6, { message: "Wachtwoord moet minimaal 6 karakters bevatten." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen.",
  path: ["confirmPassword"], // Geef aan welk veld de foutmelding krijgt
});

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      let errorMessage = "Registratie mislukt. Probeer het opnieuw.";
       if ((error as AuthError).code === 'auth/email-already-in-use') {
        errorMessage = "Dit e-mailadres is al in gebruik.";
      }
      toast({
        variant: "destructive",
        title: "Registratie Mislukt",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Registratie Succesvol!",
        description: "U wordt doorgestuurd.",
      });
      // Routering gebeurt in de signUp functie van AuthContext
    }
  };

  return (
    <SectionContainer className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Account Aanmaken</CardTitle>
          <CardDescription>Maak een nieuw FrisseStart account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mailadres</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="uw.email@voorbeeld.nl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wachtwoord</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimaal 6 karakters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bevestig Wachtwoord</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Voer wachtwoord opnieuw in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registreren...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Registreer
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Heeft u al een account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log hier in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </SectionContainer>
  );
}
