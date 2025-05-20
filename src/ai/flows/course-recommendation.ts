'use server';
/**
 * @fileOverview AI flow for recommending courses based on user's prior qualifications and experience.
 *
 * - recommendCourse - A function that takes user's qualifications and experience as input and returns a course recommendation.
 * - CourseRecommendationInput - The input type for the recommendCourse function.
 * - CourseRecommendationOutput - The return type for the recommendCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseRecommendationInputSchema = z.object({
  qualifications: z
    .string()
    .describe('The prior qualifications and experience of the user.'),
});
export type CourseRecommendationInput = z.infer<typeof CourseRecommendationInputSchema>;

const CourseRecommendationOutputSchema = z.object({
  courseRecommendation: z
    .string()
    .describe('The recommended course based on the user qualifications.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the course recommendation.'),
});
export type CourseRecommendationOutput = z.infer<typeof CourseRecommendationOutputSchema>;

export async function recommendCourse(
  input: CourseRecommendationInput
): Promise<CourseRecommendationOutput> {
  return recommendCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseRecommendationPrompt',
  input: {schema: CourseRecommendationInputSchema},
  output: {schema: CourseRecommendationOutputSchema},
  prompt: `Based on the following qualifications and experience: {{{qualifications}}}, recommend the most suitable course and explain your reasoning.`,
});

const recommendCourseFlow = ai.defineFlow(
  {
    name: 'recommendCourseFlow',
    inputSchema: CourseRecommendationInputSchema,
    outputSchema: CourseRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
