'use server';
/**
 * @fileOverview A Genkit flow for generating Archimedes Math Problems of the form A \u00b1 B \u00b1 C = D.
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
  rangeA: VariableRangeSchema.describe('Value range for variable A.'),
  rangeB: VariableRangeSchema.describe('Value range for variable B.'),
  rangeC: VariableRangeSchema.describe('Value range for variable C.'),
  rangeD: VariableRangeSchema.describe('Value range for variable D.'),
  numProblems: z.number().int().min(1).default(5).describe('The number of problems to generate.'),
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
  prompt: `You are an expert math problem generator for young learners. Your task is to create diverse math problems of the form 'A op1 B op2 C = D', where 'op1' and 'op2' are either '+' or '-'.\n\nInstructions for generating problems:\n1.  Generate exactly {{numProblems}} math problems.\n2.  Each number (A, B, C, D) must be an integer within its specified range:\n    -   A must be between {{rangeA.min}} and {{rangeA.max}} (inclusive).\n    -   B must be between {{rangeB.min}} and {{rangeB.max}} (inclusive).\n    -   C must be between {{rangeC.min}} and {{rangeC.max}} (inclusive).\n    -   D must be between {{rangeD.min}} and {{rangeD.max}} (inclusive).\n3.  The variable '{{unknownVariable}}' should be the unknown. Represent the unknown variable with an underscore '_'.\n4.  **Strictly enforce non-negative intermediate calculations and final results:**\n    -   If an operation is subtraction (e.g., 'X - Y'), the number being subtracted (Y) must be less than or equal to the number it's subtracted from (X), so 'X >= Y'.\n    -   For problems like 'A op1 B op2 C = D':\n        -   If op1 is '-', then A must be >= B.\n        -   If op2 is '-', then (A op1 B) must be >= C.\n        -   The final result D must always be >= 0.\n    -   All numbers A, B, C, D must be non-negative (their min ranges are set to 0 or above).\n5.  Vary the operations (+ or -) and the numbers to create diverse problems.\n6.  Ensure the problems are solvable and adhere to all constraints.\n\nOutput must be a JSON array of strings, where each string is a generated problem.\nExample output format:\n\`\`\`json\n{\n  "problems": [\n    "10 + 5 - 3 = _",\n    "_ + 7 - 2 = 12",\n    "20 - 5 + _ = 25",\n    "15 - _ - 4 = 6"\n  ]\n}\n\`\`\`\n\nGenerate the problems now:`,
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