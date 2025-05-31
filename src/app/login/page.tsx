
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
import { Loader2, LogIn } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import type { AuthError } from 'firebase/auth';

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Ongeldig e-mailadres." }),
  password: z.string().min(6, { message: "Wachtwoord moet minimaal 6 karakters bevatten." }),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      let errorMessage = "Inloggen mislukt. Controleer uw gegevens.";
      if ((error as AuthError).code === 'auth/user-not-found' || (error as AuthError).code === 'auth/wrong-password' || (error as AuthError).code === 'auth/invalid-credential') {
        errorMessage = "Ongeldige e-mail of wachtwoord.";
      }
      toast({
        variant: "destructive",
        title: "Login Mislukt",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Succesvol Ingelogd!",
        description: "U wordt doorgestuurd.",
      });
      // Routering gebeurt in de signIn functie van AuthContext
    }
  };

  return (
    <SectionContainer className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Inloggen</CardTitle>
          <CardDescription>Log in op uw FrisseStart account.</CardDescription>
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
                      <Input type="password" placeholder="Uw wachtwoord" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Nog geen account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Registreer hier
            </Link>
          </p>
        </CardFooter>
      </Card>
    </SectionContainer>
  );
}
