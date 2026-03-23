'use server';
/**
 * @fileOverview A Genkit flow for generating vertical math problems with detailed digit control.
 *
 * - generateVerticalMathProblems - Generates vertical addition/subtraction problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VariableRangeSchema = z.object({
  min: z.number().int().min(0).describe('The minimum value (inclusive).'),
  max: z.number().int().min(0).describe('The maximum value (inclusive).'),
}).describe('Min/Max range configuration.');

const VerticalProblemSchema = z.object({
  top: z.string().describe('First operand with underscores, e.g., "4_"'),
  bottom: z.string().describe('Second operand with underscores, e.g., "2_"'),
  result: z.string().describe('The result with underscores, e.g., "63"'),
  operator: z.enum(['+', '-']),
  fullEquation: z.string().describe('The complete equation for reference, e.g., "45 + 18 = 63"'),
});

const GenerateVerticalInputSchema = z.object({
  operation: z.enum(['plus', 'minus', 'mixed']),
  digits: z.number().int().min(1).max(3).default(2).describe('Number of digits for operands.'),
  hasCarry: z.boolean().optional().describe('True for problems with carry/borrow, false for no carry/borrow.'),
  hideTarget: z.enum(['result', 'operands', 'mixed']).default('mixed').describe('Where to place the underscores.'),
  numProblems: z.number().int().min(1).max(50).default(20),
  rangeN1: VariableRangeSchema.optional().describe('Range for the first operand.'),
  rangeN2: VariableRangeSchema.optional().describe('Range for the second operand.'),
  rangeResult: VariableRangeSchema.optional().describe('Range for the final result (Sum or Difference).'),
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
Generate exactly {{numProblems}} unique problems.

Arithmetic Constraints (STRICT):
{{#if rangeN1}}- Operand 1 (N1): [{{rangeN1.min}}, {{rangeN1.max}}]{{/if}}
{{#if rangeN2}}- Operand 2 (N2): [{{rangeN2.min}}, {{rangeN2.max}}]{{/if}}
{{#if rangeResult}}- Result: [{{rangeResult.min}}, {{rangeResult.max}}]{{/if}}

Rules:
1. Digits: Operands should have exactly {{digits}} digits.
2. Operation: Use {{operation}} (+ for plus, - for minus, or mixed).
3. Carry/Borrow Logic:
   - If hasCarry is true:
     - For Addition (+): Must involve at least one "carry" (sum of digits in a column >= 10).
     - For Subtraction (-): Must involve at least one "borrow" (top digit < bottom digit in a column).
   - If hasCarry is false:
     - For Addition (+): No carries allowed (sum of digits in every column < 10).
     - For Subtraction (-): No borrows allowed (top digit >= bottom digit in every column).
4. Hide Target Strategy:
   - If hideTarget is 'result': Only hide digits in the result (bottom number). Operands are full.
   - If hideTarget is 'operands': Only hide digits in the top and bottom operands. Result is full.
   - If hideTarget is 'mixed': Hide digits randomly across top, bottom, and result.
5. Difficulty/Logic:
   - For '-' operations, ensure top >= bottom.
   - Use '_' for hidden digits. Hide 1-2 digits per problem depending on {{digits}}.
6. Output: Return an array of objects with top, bottom, result, operator, and fullEquation.`,
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
