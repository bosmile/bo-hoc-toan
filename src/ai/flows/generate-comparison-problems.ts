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
    const { level, range, operationMode, numProblems } = input;
    const problems = [];
    const seen = new Set<string>();
    const maxTries = 20000;
    let tries = 0;
    
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getOp = () => operationMode === 'plus' ? '+' : (operationMode === 'minus' ? '-' : (Math.random() > 0.5 ? '+' : '-'));

    while (problems.length < (numProblems || 10) && tries < maxTries) {
      tries++;
      const op1 = getOp();
      const A = randomInt(range.min, range.max);
      const B = randomInt(range.min, range.max);
      const val1 = op1 === '+' ? A + B : A - B;
      if (val1 < range.min || val1 > range.max) continue;

      let exp1 = `${A} ${op1} ${B}`;
      let exp2 = '';
      let val2 = 0;

      if (level === '1') {
        val2 = randomInt(range.min, range.max);
        exp2 = `${val2}`;
      } else if (level === '2') {
        const op2 = getOp();
        const C = randomInt(range.min, range.max);
        val2 = op2 === '+' ? A + C : A - C;
        if (val2 < range.min || val2 > range.max) continue;
        exp2 = `${A} ${op2} ${C}`;
      } else {
        const op2 = getOp();
        const C = randomInt(range.min, range.max);
        const D = randomInt(range.min, range.max);
        val2 = op2 === '+' ? C + D : C - D;
        if (val2 < range.min || val2 > range.max) continue;
        exp2 = `${C} ${op2} ${D}`;
      }

      if (exp1 === exp2) continue;
      const sign = val1 > val2 ? '>' : (val1 < val2 ? '<' : '=');
      const q = `${exp1} _ ${exp2}`;
      if (seen.has(q)) continue;
      seen.add(q);

      problems.push({
        question: q,
        answer: `${exp1} ${sign} ${exp2}`
      });
    }

    return { problems };
  }
);
