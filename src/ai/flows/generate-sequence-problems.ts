'use server';
/**
 * @fileOverview A Genkit flow for generating periodic sequence problems.
 * 
 * - generateSequenceProblems - Generates problems where a sequence of numbers repeats.
 * - Strict Pattern Logic: Each distinct number in the cycle appears exactly once in the grid.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SequenceProblemSchema = z.object({
  cycleNumbers: z.array(z.number().int()).describe('The numbers forming one repeating cycle.'),
  cycleSum: z.number().int().describe('The sum of one cycle.'),
  grid: z.array(z.string()).describe('The sequence grid with underscores for blanks.'),
  instruction: z.string().describe('The instruction text.'),
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
  prompt: `You are a math teacher creating "Strict Periodic Sequence" problems for advanced primary students.
Generate {{numProblems}} unique problems.

Rules:
1. Cycle Length (N): {{cycleLength}} (either 3 or 4).
2. Cycle Sum (S): Must be exactly the sum of the N cycle numbers, and ≤ {{maxCycleSum}}.
3. Grid: A sequence array of length 12-15.
4. Hiding Strategy (STRICT PATTERN):
   - For a cycle of length N (e.g., [a, b, c] for N=3), you must provide EXACTLY ONE instance of each number (a, b, c) in the grid at a valid periodic position.
   - For example, if N=3 and cycle is [2, 3, 5], you might place '2' at index 0, '3' at index 4 (mod 3 = 1), and '5' at index 8 (mod 3 = 2).
   - ALL OTHER POSITIONS in the grid must be underscores ('_').
   - This ensures the student sees only one of each number in the entire grid and MUST use the provided sum S to find any missing numbers before filling the rest.
5. Difficulty: The sum S must be clearly stated in the instruction.
6. Instruction Format: "Biết tổng của {{cycleLength}} số liên tiếp bằng {{cycleSum}}. Em hãy tìm số còn thiếu và hoàn thiện bảng sau:"
7. Output: Return an array of objects with cycleNumbers, cycleSum, grid, and instruction.`,
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
