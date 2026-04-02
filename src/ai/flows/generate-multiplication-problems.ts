/**
 * @fileOverview Local problem generation for multiplication problems (A x B = C).
 */

export interface GenerateMultiplicationInput {
  tables?: number[];
  rangeFactor1?: { min: number; max: number };
  rangeFactor2?: { min: number; max: number };
  unknownVariable: 'A' | 'B' | 'C';
  numProblems: number;
  shuffle?: boolean;
}

export interface GenerateMultiplicationOutput {
  problems: Array<{
    question: string;
    answer: string;
  }>;
}

export async function generateMultiplicationProblems(
  input: GenerateMultiplicationInput
): Promise<GenerateMultiplicationOutput> {
  const numProblems = input.numProblems || 20;
  let tables = input.tables && input.tables.length > 0 ? input.tables : [2, 3, 4, 5, 6, 7, 8, 9];
  const shuffle = input.shuffle !== false;
  const unknownVar = input.unknownVariable || 'C';

  const allPossible: Array<{ a: number, b: number, c: number }> = [];
  for (const a of tables) {
    for (let b = 1; b <= 10; b++) {
      allPossible.push({ a, b, c: a * b });
    }
  }

  if (shuffle) {
    for (let i = allPossible.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPossible[i], allPossible[j]] = [allPossible[j], allPossible[i]];
    }
  }

  const selected: Array<{ a: number, b: number, c: number }> = [];
  let idx = 0;
  while(selected.length < numProblems) {
     const p = allPossible[idx % allPossible.length];
     selected.push(p);
     idx++;
  }

  if (shuffle && selected.length > allPossible.length) {
     for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
  }

  const generated = selected.map(p => {
     const {a, b, c} = p;
     let question = `${a} x ${b} = ${c}`;
     if (unknownVar === 'A') question = `_ x ${b} = ${c}`;
     else if (unknownVar === 'B') question = `${a} x _ = ${c}`;
     else if (unknownVar === 'C') question = `${a} x ${b} = _`;
     
     return {
       question,
       answer: `${a} x ${b} = ${c}`
     };
  });

  return { problems: generated };
}

