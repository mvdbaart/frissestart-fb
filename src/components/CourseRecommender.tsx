'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recommendCourse, type CourseRecommendationOutput } from '@/ai/flows/course-recommendation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { SectionContainer } from './ui/SectionContainer';

const FormSchema = z.object({
  qualifications: z.string().min(50, { message: "Beschrijf uw kwalificaties en ervaring in minimaal 50 karakters." }).max(2000, { message: "Maximale lengte is 2000 karakters." }),
});

type FormData = z.infer<typeof FormSchema>;

export function CourseRecommender() {
  const [recommendation, setRecommendation] = useState<CourseRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      qualifications: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendCourse({ qualifications: data.qualifications });
      setRecommendation(result);
      toast({
        title: "Aanbeveling gegenereerd!",
        description: "Scroll naar beneden om uw persoonlijke cursusaanbeveling te zien.",
      });
    } catch (error) {
      console.error("Error getting course recommendation:", error);
      toast({
        variant: "destructive",
        title: "Fout opgetreden",
        description: "Er is iets misgegaan bij het ophalen van de aanbeveling. Probeer het later opnieuw.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionContainer id="course-recommender" className="bg-background">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Vind uw Perfecte Cursus
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Vertel ons over uw achtergrond, ervaring en ambities. Onze slimme tool helpt u de juiste keuze te maken.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="qualifications" className="text-lg font-medium">Uw Kwalificaties en Ervaring</FormLabel>
                      <FormControl>
                        <Textarea
                          id="qualifications"
                          placeholder="Bijvoorbeeld: 'Ik heb een MBO diploma in administratie en 5 jaar werkervaring als secretaresse. Ik wil me graag omscholen naar een IT-functie, bij voorkeur in webdevelopment of data analyse. Ik ben leergierig en pak snel nieuwe dingen op.'"
                          rows={8}
                          className="text-base resize-none focus:ring-2 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-3 px-8 shadow-md">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Moment geduld...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Ontvang Aanbeveling
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {recommendation && (
          <Card className="mt-12 shadow-xl animate-in fade-in duration-500 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Sparkles className="h-7 w-7" />
                Uw Persoonlijke Cursusaanbeveling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Aanbevolen Cursus:</h3>
                <p className="text-lg text-muted-foreground p-4 bg-primary/10 rounded-md border border-primary/20">{recommendation.courseRecommendation}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Redenering:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap p-4 bg-muted/50 rounded-md border border-border">{recommendation.reasoning}</p>
              </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="link" className="text-primary">
                    <Link href="/cursussen">Bekijk alle cursussen &rarr;</Link>
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </SectionContainer>
  );
}
