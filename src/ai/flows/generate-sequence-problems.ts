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
3. Randomness: Do NOT use hardcoded sets like (4, 7, 9). Every problem MUST use a different, randomly generated set of integers for the cycle.
4. Grid Construction (STRICT PATTERN):
   - For a cycle of length N (e.g., [a, b, c, d] for N=4), you must place EXACTLY ONE instance of each of the first N-1 numbers (a, b, c) in the grid at their correct periodic positions (index mod N).
   - The N-th number (d) MUST NOT appear in the grid at all (it will be the underscore '_').
   - This forces the student to use the provided sum S and the known numbers (a, b, c) to find the missing number d.
   - Example for N=3, Cycle=[2, 5, 3], S=10:
     Grid: ["2", "_", "_", "_", "5", "_", "_", "_", "3", "_", "_", "_"]
     (Notice 2 is at index 0 (0%3=0), 5 is at index 4 (4%3=1), 3 is at index 8 (8%3=2). Only ONE of each.)
5. Instruction: "Biết tổng của {{cycleLength}} số liên tiếp bằng {{cycleSum}}. Em hãy tìm số còn thiếu và hoàn thiện bảng sau:"
6. Output: Return an array of objects with cycleNumbers, cycleSum, grid, and instruction.`,
});

const generateSequenceProblemsFlow = ai.defineFlow(
  {
    name: 'generateSequenceProblemsFlow',
    inputSchema: GenerateSequenceInputSchema,
    outputSchema: GenerateSequenceOutputSchema,
  },
  async (input) => {
    const { cycleLength = 3, maxCycleSum = 30, numProblems = 2 } = input;
    const problems = [];
    const seen = new Set<string>();
    const maxTries = 5000;
    let tries = 0;

    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    while (problems.length < numProblems && tries < maxTries) {
      tries++;
      const cycle = [];
      const used = new Set<number>();
      for (let i = 0; i < cycleLength; i++) {
        let n = 0;
        let innerTries = 0;
        do {
          n = randomInt(1, Math.max(1, maxCycleSum - cycleLength + 1));
          innerTries++;
        } while (used.has(n) && innerTries < 50);
        used.add(n);
        cycle.push(n);
      }
      
      const sum = cycle.reduce((a, b) => a + b, 0);
      if (sum > maxCycleSum) continue;

      const cycleKey = cycle.join(',');
      if (seen.has(cycleKey)) continue;
      seen.add(cycleKey);

      // Create grid (length = 12 cells for visual periodic repetition)
      const grid = Array(12).fill('_');
      // For first N-1 elements, put them at exactly one periodic position
      for (let i = 0; i < cycleLength - 1; i++) {
        const value = cycle[i];
        const randomPeriod = Math.floor(Math.random() * Math.floor(12 / cycleLength));
        const index = randomPeriod * cycleLength + i;
        if (index < 12) grid[index] = value.toString();
      }

      problems.push({
        cycleNumbers: cycle,
        cycleSum: sum,
        grid,
        instruction: `Biết tổng của ${cycleLength} số liên tiếp bằng ${sum}. Em hãy tìm số còn thiếu và hoàn thiện bảng sau:`
      });
    }

    return { problems };
  }
);
