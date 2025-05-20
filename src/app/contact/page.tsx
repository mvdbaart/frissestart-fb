'use client';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const ContactFormSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters bevatten."),
  email: z.string().email("Ongeldig e-mailadres."),
  subject: z.string().min(5, "Onderwerp moet minimaal 5 karakters bevatten."),
  message: z.string().min(20, "Bericht moet minimaal 20 karakters bevatten.").max(1000, "Bericht mag maximaal 1000 karakters bevatten."),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Contact form data:", data);
    toast({
      title: "Bericht Verzonden!",
      description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
    });
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <SectionContainer className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Neem <span className="text-primary">Contact</span> Op
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Heeft u vragen, opmerkingen of wilt u meer weten over onze cursussen? We horen graag van u!
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Stuur ons een bericht</CardTitle>
              <CardDescription>Vul het onderstaande formulier in en we nemen contact met u op.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volledige Naam</FormLabel>
                          <FormControl>
                            <Input placeholder="Uw naam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Onderwerp</FormLabel>
                        <FormControl>
                          <Input placeholder="Waar gaat uw bericht over?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uw Bericht</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Typ hier uw bericht..." rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verzenden...
                      </>
                    ) : (
                      "Verstuur Bericht"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Contactinformatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Adres</h4>
                  <p className="text-muted-foreground">Voorbeeldstraat 123, 1000 AB Amsterdam, Nederland</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Telefoon</h4>
                  <p className="text-muted-foreground">+31 (0)20 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">E-mail</h4>
                  {/* Verwijder Digital uit het e-mailadres */}
                  <p className="text-muted-foreground">info@frissestart.nl</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Openingstijden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p><strong>Maandag - Vrijdag:</strong> 09:00 - 17:00</p>
              <p><strong>Zaterdag:</strong> 10:00 - 14:00 (alleen op afspraak)</p>
              <p><strong>Zondag:</strong> Gesloten</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}
