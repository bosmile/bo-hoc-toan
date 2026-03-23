'use server';
/**
 * @fileOverview A Genkit flow for generating multiplication problems (A x B = C).
 *
 * - generateMultiplicationProblems - A function that generates multiplication problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMultiplicationInputSchema = z.object({
  tables: z.array(z.number().int()).optional().describe('Selected multiplication tables (e.g., [2, 5, 10]).'),
  rangeFactor1: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
  rangeFactor2: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
  unknownVariable: z.enum(['A', 'B', 'C']).describe('The unknown: Factor 1 (A), Factor 2 (B), or Product (C).'),
  numProblems: z.number().int().min(1).max(50).default(20),
  shuffle: z.boolean().default(true),
});

export type GenerateMultiplicationInput = z.infer<typeof GenerateMultiplicationInputSchema>;

const GenerateMultiplicationOutputSchema = z.object({
  problems: z.array(z.object({
    question: z.string().describe('The problem string with underscore, e.g., "2 x _ = 10"'),
    answer: z.string().describe('The complete problem with the answer, e.g., "2 x 5 = 10"')
  })),
});

export type GenerateMultiplicationOutput = z.infer<typeof GenerateMultiplicationOutputSchema>;

export async function generateMultiplicationProblems(
  input: GenerateMultiplicationInput
): Promise<GenerateMultiplicationOutput> {
  return generateMultiplicationProblemsFlow(input);
}

const multiplicationPrompt = ai.definePrompt({
  name: 'generateMultiplicationProblemsPrompt',
  input: { schema: GenerateMultiplicationInputSchema },
  output: { schema: GenerateMultiplicationOutputSchema },
  prompt: `You are a math teacher creating a multiplication worksheet.
Generate {{numProblems}} unique multiplication problems of the form A x B = C.

{{#if tables}}
- Use multiplication tables: {{#each tables}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
- Factor A range: [{{rangeFactor1.min}}, {{rangeFactor1.max}}]
- Factor B range: [{{rangeFactor2.min}}, {{rangeFactor2.max}}]
{{/if}}

- Replace '{{unknownVariable}}' with an underscore '_' for the 'question' field.
- The 'answer' field must contain the full equation with the correct result.
- If shuffle is true, vary the order of tables used.
- Ensure no duplicate problems.
- Use 'x' as the multiplication symbol.`,
});

const generateMultiplicationProblemsFlow = ai.defineFlow(
  {
    name: 'generateMultiplicationProblemsFlow',
    inputSchema: GenerateMultiplicationInputSchema,
    outputSchema: GenerateMultiplicationOutputSchema,
  },
  async (input) => {
    const { output } = await multiplicationPrompt(input);
    if (!output) throw new Error('Failed to generate multiplication problems.');
    return output;
  }
);
