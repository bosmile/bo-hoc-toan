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
    const numProblems = input.numProblems || 20;
    let tables = input.tables && input.tables.length > 0 ? input.tables : [2, 3, 4, 5, 6, 7, 8, 9];
    const shuffle = input.shuffle !== false;
    const unknownVar = input.unknownVariable || 'C';

    const allPossible = [];
    for (const a of tables) {
      for (let b = 1; b <= 10; b++) {
        allPossible.push({ a, b, c: a * b });
      }
    }

    if (shuffle) {
      for (let i = allPossible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPossible[i], allPossible[j]] = [allPossible[j], allPossible[i]];
      }
    }

    const selected = [];
    let idx = 0;
    while(selected.length < numProblems) {
       // if we run out of unique, repopulate/wrap around
       const p = allPossible[idx % allPossible.length];
       selected.push(p);
       idx++;
    }

    // Optionally shuffle again if we wrapped around so we don't get repeating blocks
    if (shuffle && selected.length > allPossible.length) {
       for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
    }

    const generated = selected.map(p => {
       const {a, b, c} = p;
       let question = `${a} x ${b} = ${c}`;
       if (unknownVar === 'A') question = `_ x ${b} = ${c}`;
       else if (unknownVar === 'B') question = `${a} x _ = ${c}`;
       else if (unknownVar === 'C') question = `${a} x ${b} = _`;
       
       return {
         question,
         answer: `${a} x ${b} = ${c}`
       };
    });

    return { problems: generated };
  }
);
