'use server';
/**
 * @fileOverview A Genkit flow for generating periodic sequence problems.
 *
 * - generateSequenceProblems - Generates problems where a sequence of numbers repeats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SequenceProblemSchema = z.object({
  cycleNumbers: z.array(z.number().int()).describe('The numbers forming one repeating cycle.'),
  cycleSum: z.number().int().describe('The sum of one cycle.'),
  grid: z.array(z.string()).describe('The sequence grid with underscores for blanks, e.g., ["1", "_", "5", "1", "4", "_"]'),
  instruction: z.string().describe('The instruction text, e.g., "Biết tổng 3 số liên tiếp bằng 10"'),
});

const GenerateSequenceInputSchema = z.object({
  cycleLength: z.number().int().min(3).max(4).default(3).describe('Number of elements in one cycle.'),
  maxCycleSum: z.number().int().min(10).max(100).default(30).describe('Maximum allowed sum for one cycle.'),
  numProblems: z.number().int().min(1).max(10).default(2),
});

export type GenerateSequenceInput = z.infer<typeof GenerateSequenceInputSchema>;

const GenerateSequenceOutputSchema = z.object({
  problems: z.array(SequenceProblemSchema),
});

export type GenerateSequenceOutput = z.infer<typeof GenerateSequenceOutputSchema>;

export async function generateSequenceProblems(
  input: GenerateSequenceInput
): Promise<GenerateSequenceOutput> {
  return generateSequenceProblemsFlow(input);
}

const sequencePrompt = ai.definePrompt({
  name: 'generateSequenceProblemsPrompt',
  input: { schema: GenerateSequenceInputSchema },
  output: { schema: GenerateSequenceOutputSchema },
  prompt: `You are a math teacher creating "Periodic Sequence" problems.
Generate {{numProblems}} unique problems.

Rules:
1. Cycle Length: {{cycleLength}} (either 3 or 4).
2. Cycle Sum: Must be exactly the sum of the cycle numbers, and ≤ {{maxCycleSum}}.
3. Grid: A sequence of length 12-15.
4. Clue Logic: 
   - Hiding Strategy: You must hide some numbers (replace with '_'). 
   - Ensure the student can logically determine ALL numbers in the cycle.
   - For a cycle of 3 (a, b, c), provide at least one 'a', one 'b', and one 'c' at different positions in the grid, OR provide two of them and the total sum.
   - Example (Cycle 3, Sum 10): If numbers are [2, 3, 5], the grid could be ["2", "_", "5", "_", "3", "_", "2", "_", "5"].
5. Difficulty: The sum should be clearly stated in the instruction.
6. Output: Return an array of objects with cycleNumbers, cycleSum, grid, and instruction.`,
});

const generateSequenceProblemsFlow = ai.defineFlow(
  {
    name: 'generateSequenceProblemsFlow',
    inputSchema: GenerateSequenceInputSchema,
    outputSchema: GenerateSequenceOutputSchema,
  },
  async (input) => {
    const { output } = await sequencePrompt(input);
    if (!output) throw new Error('Failed to generate sequence problems.');
    return output;
  }
);
