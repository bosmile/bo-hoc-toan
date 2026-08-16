import db from '../../data/timo-grade-1-db.json';

export interface TimoProblem {
  id: string;
  category: 'Logical Thinking' | 'Arithmetic' | 'Number Theory' | 'Geometry' | 'Combinatorics';
  questionEn: string;
  questionVn: string;
  answer: string;
}

export interface GenerateTimoProblemsInput {
  category: 'All' | 'Logical Thinking' | 'Arithmetic' | 'Number Theory' | 'Geometry' | 'Combinatorics';
  numProblems: number;
}

export interface GenerateTimoProblemsOutput {
  problems: TimoProblem[];
}

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export async function generateTimoProblems(input: GenerateTimoProblemsInput): Promise<GenerateTimoProblemsOutput> {
  const problems: TimoProblem[] = [];
  const typedDb = db as Record<string, TimoProblem[]>;

  if (input.category === 'All') {
    // We want a full test simulation if they ask for exactly 25
    if (input.numProblems === 25) {
      for (let i = 1; i <= 25; i++) {
        problems.push(randomElement(typedDb[`q${i}`]));
      }
    } else {
      // Pick randomly across all questions
      const allProblems = Object.values(typedDb).flat();
      for (let i = 0; i < input.numProblems; i++) {
        problems.push(randomElement(allProblems));
      }
    }
  } else {
    // Filter out only the buckets that belong to this category
    // For example Logical Thinking is Q1-Q5, but we can just filter the entire flattened list
    // because each problem has a `category` tag saved in the JSON.
    const allProblems = Object.values(typedDb).flat();
    const categoryProblems = allProblems.filter(p => p.category === input.category);
    
    for (let i = 0; i < input.numProblems; i++) {
      problems.push(randomElement(categoryProblems));
    }
  }

  return { problems };
}
