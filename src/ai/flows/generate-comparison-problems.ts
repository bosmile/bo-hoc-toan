'use server';
/**
 * @fileOverview A Genkit flow for generating comparison problems (Exp1 <?> Exp2).
 *
 * - generateComparisonProblems - Function to generate comparison math problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateComparisonInputSchema = z.object({
  level: z.enum(['1', '2', '3']).describe('1: Exp vs Num, 2: Same base Exp, 3: Diff Exp vs Diff Exp'),
  range: z.object({ min: z.number().int(), max: z.number().int() }),
  operationMode: z.enum(['plus', 'minus', 'mixed']),
  numProblems: z.number().int().min(1).max(50).default(10),
});

export type GenerateComparisonInput = z.infer<typeof GenerateComparisonInputSchema>;

const GenerateComparisonOutputSchema = z.object({
  problems: z.array(z.object({
    question: z.string().describe('The problem string with underscore, e.g., "15 + 3 _ 20"'),
    answer: z.string().describe('The complete problem with the correct sign, e.g., "15 + 3 < 20"')
  })),
});

export type GenerateComparisonOutput = z.infer<typeof GenerateComparisonOutputSchema>;

export async function generateComparisonProblems(
  input: GenerateComparisonInput
): Promise<GenerateComparisonOutput> {
  return generateComparisonProblemsFlow(input);
}

const comparisonPrompt = ai.definePrompt({
  name: 'generateComparisonProblemsPrompt',
  input: { schema: GenerateComparisonInputSchema },
  output: { schema: GenerateComparisonOutputSchema },
  prompt: `You are a math teacher creating comparison problems for primary students. 
Generate {{numProblems}} unique comparison problems using the sign '_' as a placeholder for <, >, or =.

Rules for levels:
- Level 1: Left side is an expression (A op B), right side is a number C. Example: "12 + 5 _ 18".
- Level 2: Both sides are expressions with the SAME base number. Example: "15 - 2 _ 15 + 1".
- Level 3: Both sides are different expressions. Example: "12 + 8 _ 25 - 4".

Constraints:
1. Use numbers within range [{{range.min}}, {{range.max}}].
2. Operations: {{operationMode}} (plus: +, minus: -, mixed: both).
3. Step-by-step non-negativity: For any "A - B", A must be >= B.
4. Intermediate and final results must be within the specified range.
5. Ensure variety in answers (<, >, =).

Output format: JSON array of objects with 'question' and 'answer'.`,
});

const generateComparisonProblemsFlow = ai.defineFlow(
  {
    name: 'generateComparisonProblemsFlow',
    inputSchema: GenerateComparisonInputSchema,
    outputSchema: GenerateComparisonOutputSchema,
  },
  async (input) => {
    const { output } = await comparisonPrompt(input);
    if (!output) throw new Error('Failed to generate comparison problems.');
    return output;
  }
);
