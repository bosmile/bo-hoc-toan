/**
 * @fileOverview Local problem generation for Archimedes Math Problems of the form A ± B ± C = D.
 */

export interface GenerateArchimedesMathProblemsInput {
  unknownVariable: 'A' | 'B' | 'C' | 'D';
  operationMode: 'plus' | 'minus' | 'mixed';
  rangeA: { min: number; max: number };
  rangeB: { min: number; max: number };
  rangeC: { min: number; max: number };
  rangeD: { min: number; max: number };
  numProblems: number;
}

export interface GenerateArchimedesMathProblemsOutput {
  problems: Array<{
    question: string;
    answer: string;
  }>;
}

export async function generateArchimedesMathProblems(
  input: GenerateArchimedesMathProblemsInput
): Promise<GenerateArchimedesMathProblemsOutput> {
  const { unknownVariable, operationMode, rangeA, rangeB, rangeC, rangeD, numProblems } = input;
  const problems = new Set<string>();
  const fullProblems: Array<{ question: string, answer: string }> = [];
  const maxTries = 20000;
  let tries = 0;

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  while (problems.size < (numProblems || 10) && tries < maxTries) {
    tries++;
    const A = randomInt(rangeA.min, rangeA.max);
    const B = randomInt(rangeB.min, rangeB.max);
    const C = randomInt(rangeC.min, rangeC.max);
    
    let op1 = operationMode === 'plus' ? '+' : (operationMode === 'minus' ? '-' : (Math.random() > 0.5 ? '+' : '-'));
    let op2 = operationMode === 'plus' ? '+' : (operationMode === 'minus' ? '-' : (Math.random() > 0.5 ? '+' : '-'));

    const res1 = op1 === '+' ? A + B : A - B;
    if (res1 < 0) continue;

    const D = op2 === '+' ? res1 + C : res1 - C;
    if (D < 0 || D < rangeD.min || D > rangeD.max) continue;

    let strA = A.toString();
    let strB = B.toString();
    let strC = C.toString();
    let strD = D.toString();

    if (unknownVariable === 'A') strA = '_';
    if (unknownVariable === 'B') strB = '_';
    if (unknownVariable === 'C') strC = '_';
    if (unknownVariable === 'D') strD = '_';

    const q = `${strA} ${op1} ${strB} ${op2} ${strC} = ${strD}`;
    const ans = `${A} ${op1} ${B} ${op2} ${C} = ${D}`;
    
    if (!problems.has(q)) {
      problems.add(q);
      fullProblems.push({ question: q, answer: ans });
    }
  }

  return { problems: fullProblems };
}

