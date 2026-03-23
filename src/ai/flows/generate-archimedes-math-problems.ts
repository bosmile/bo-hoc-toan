'use server';
/**
 * @fileOverview A Genkit flow for generating Archimedes Math Problems of the form A ± B ± C = D.
 *
 * - generateArchimedesMathProblems - A function that generates math problems based on user-defined configurations.
 * - GenerateArchimedesMathProblemsInput - The input type for the generateArchimedesMathProblems function.
 * - GenerateArchimedesMathProblemsOutput - The return type for the generateArchimedesMathProblems function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VariableRangeSchema = z.object({
  min: z.number().int().min(0).describe('The minimum value for the variable (inclusive).'),
  max: z.number().int().min(0).describe('The maximum value for the variable (inclusive).'),
}).describe('Min/Max range configuration for a specific variable.');

const GenerateArchimedesMathProblemsInputSchema = z.object({
  unknownVariable: z.enum(['A', 'B', 'C', 'D']).describe('The variable (A, B, C, or D) that will be the unknown in the problem.'),
  operationMode: z.enum(['plus', 'minus', 'mixed']).describe('Type of operations: only addition, only subtraction, or mixed.'),
  rangeA: VariableRangeSchema.describe('Value range for variable A.'),
  rangeB: VariableRangeSchema.describe('Value range for variable B.'),
  rangeC: VariableRangeSchema.describe('Value range for variable C.'),
  rangeD: VariableRangeSchema.describe('Value range for variable D.'),
  numProblems: z.number().int().min(1).max(50).default(10).describe('The number of problems to generate.'),
});

export type GenerateArchimedesMathProblemsInput = z.infer<typeof GenerateArchimedesMathProblemsInputSchema>;

const GenerateArchimedesMathProblemsOutputSchema = z.object({
  problems: z.array(z.string()).describe('An array of generated math problems.'),
});

export type GenerateArchimedesMathProblemsOutput = z.infer<typeof GenerateArchimedesMathProblemsOutputSchema>;

export async function generateArchimedesMathProblems(
  input: GenerateArchimedesMathProblemsInput
): Promise<GenerateArchimedesMathProblemsOutput> {
  return generateArchimedesMathProblemsFlow(input);
}

const problemPrompt = ai.definePrompt({
  name: 'generateArchimedesMathProblemsPrompt',
  input: { schema: GenerateArchimedesMathProblemsInputSchema },
  output: { schema: GenerateArchimedesMathProblemsOutputSchema },
  prompt: `You are an expert math problem generator for young learners. Your task is to create diverse math problems of the form 'A op1 B op2 C = D', where 'op1' and 'op2' are operators (+ or -).

Instructions for generating problems:
1. Generate exactly {{numProblems}} unique math problems.
2. Operation Logic:
   - If operationMode is 'plus', both op1 and op2 must be '+'.
   - If operationMode is 'minus', both op1 and op2 must be '-'.
   - If operationMode is 'mixed', use a variety of (+, +), (+, -), (-, +), and (-, -).
3. Value Constraints:
   - Numbers A, B, C, D must be integers within their specified ranges:
     - A: [{{rangeA.min}}, {{rangeA.max}}]
     - B: [{{rangeB.min}}, {{rangeB.max}}]
     - C: [{{rangeC.min}}, {{rangeC.max}}]
     - D: [{{rangeD.min}}, {{rangeD.max}}]
4. **Step-by-Step Non-Negativity Rule (CRITICAL):**
   - Every intermediate calculation must be non-negative.
   - For 'A op1 B op2 C = D':
     - If op1 is '-', then A must be >= B (A - B >= 0).
     - If op2 is '-', then the result of (A op1 B) must be >= C ((A op1 B) - C >= 0).
     - The final result D must always be >= 0.
5. Unknown Variable:
   - The variable '{{unknownVariable}}' must be replaced by an underscore '_'.
6. Anti-Duplication:
   - Ensure all problems in the set are unique (no identical A, B, C values).

Output must be a JSON array of strings. Example: ["10 + 5 - 3 = _", "_ + 7 - 2 = 12"]`,
});

const generateArchimedesMathProblemsFlow = ai.defineFlow(
  {
    name: 'generateArchimedesMathProblemsFlow',
    inputSchema: GenerateArchimedesMathProblemsInputSchema,
    outputSchema: GenerateArchimedesMathProblemsOutputSchema,
  },
  async (input) => {
    const { output } = await problemPrompt(input);
    if (!output) {
      throw new Error('Failed to generate math problems. Output was empty.');
    }
    return output;
  }
);
