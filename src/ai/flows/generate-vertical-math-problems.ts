'use server';
/**
 * @fileOverview A Genkit flow for generating vertical math problems with missing digits.
 *
 * - generateVerticalMathProblems - Generates vertical addition/subtraction problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerticalProblemSchema = z.object({
  top: z.string().describe('First operand (2 digits), e.g., "4_" or "_5"'),
  bottom: z.string().describe('Second operand (2 digits), e.g., "2_" or "18"'),
  result: z.string().describe('The result (2 or 3 digits), e.g., "63" or "10_"'),
  operator: z.enum(['+', '-']),
  fullEquation: z.string().describe('The complete equation for reference, e.g., "45 + 18 = 63"'),
});

const GenerateVerticalInputSchema = z.object({
  operation: z.enum(['plus', 'minus', 'mixed']),
  level: z.enum(['easy', 'medium', 'hard']),
  numProblems: z.number().int().min(1).max(50).default(20),
});

export type GenerateVerticalInput = z.infer<typeof GenerateVerticalInputSchema>;

const GenerateVerticalOutputSchema = z.object({
  problems: z.array(VerticalProblemSchema),
});

export type GenerateVerticalOutput = z.infer<typeof GenerateVerticalOutputSchema>;

export async function generateVerticalMathProblems(
  input: GenerateVerticalInput
): Promise<GenerateVerticalOutput> {
  return generateVerticalMathProblemsFlow(input);
}

const verticalPrompt = ai.definePrompt({
  name: 'generateVerticalMathProblemsPrompt',
  input: { schema: GenerateVerticalInputSchema },
  output: { schema: GenerateVerticalOutputSchema },
  prompt: `You are a math teacher creating "Missing Digit" vertical problems for primary students.
Generate {{numProblems}} unique problems.

Rules:
1. Range: All numbers (operands and results) must be between 10 and 99 (except results of addition can be up to 150).
2. Difficulty Levels:
   - easy: Hide 1 digit in either top or bottom number. No carry (for +) and no borrow (for -).
   - medium: Hide 2 digits across top, bottom, or result. Simple carry/borrow allowed.
   - hard: Hide multiple digits (3-4). Must involve carry/borrow to require logical deduction.
3. Steps:
   - Ensure the math is correct.
   - Use '_' for hidden digits.
   - For '-' operations, ensure top >= bottom.
4. Output: Return an array of objects with top, bottom, result, operator, and fullEquation.
   Example for 45 + 18 = 63 (Hard): top: "4_", bottom: "_8", result: "6_", operator: "+"`,
});

const generateVerticalMathProblemsFlow = ai.defineFlow(
  {
    name: 'generateVerticalMathProblemsFlow',
    inputSchema: GenerateVerticalInputSchema,
    outputSchema: GenerateVerticalOutputSchema,
  },
  async (input) => {
    const { output } = await verticalPrompt(input);
    if (!output) throw new Error('Failed to generate vertical problems.');
    return output;
  }
);
