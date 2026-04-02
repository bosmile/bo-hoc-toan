/**
 * @fileOverview Local problem generation for comparison problems (Exp1 <?> Exp2).
 */

export interface GenerateComparisonInput {
  level: '1' | '2' | '3';
  range: { min: number; max: number };
  operationMode: 'plus' | 'minus' | 'mixed';
  numProblems: number;
}

export interface GenerateComparisonOutput {
  problems: Array<{
    question: string;
    answer: string;
  }>;
}

export async function generateComparisonProblems(
  input: GenerateComparisonInput
): Promise<GenerateComparisonOutput> {
  const { level, range, operationMode, numProblems } = input;
  const problems: Array<{ question: string, answer: string }> = [];
  const seen = new Set<string>();
  const maxTries = 20000;
  let tries = 0;
  
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getOp = () => operationMode === 'plus' ? '+' : (operationMode === 'minus' ? '-' : (Math.random() > 0.5 ? '+' : '-'));

  while (problems.length < (numProblems || 10) && tries < maxTries) {
    tries++;
    const op1 = getOp();
    const A = randomInt(range.min, range.max);
    const B = randomInt(range.min, range.max);
    const val1 = op1 === '+' ? A + B : A - B;
    if (val1 < range.min || val1 > range.max) continue;

    let exp1 = `${A} ${op1} ${B}`;
    let exp2 = '';
    let val2 = 0;

    if (level === '1') {
      val2 = randomInt(range.min, range.max);
      exp2 = `${val2}`;
    } else if (level === '2') {
      const op2 = getOp();
      const C = randomInt(range.min, range.max);
      val2 = op2 === '+' ? A + C : A - C;
      if (val2 < range.min || val2 > range.max) continue;
      exp2 = `${A} ${op2} ${C}`;
    } else {
      const op2 = getOp();
      const C = randomInt(range.min, range.max);
      const D = randomInt(range.min, range.max);
      val2 = op2 === '+' ? C + D : C - D;
      if (val2 < range.min || val2 > range.max) continue;
      exp2 = `${C} ${op2} ${D}`;
    }

    if (exp1 === exp2) continue;
    const sign = val1 > val2 ? '>' : (val1 < val2 ? '<' : '=');
    const q = `${exp1} _ ${exp2}`;
    if (seen.has(q)) continue;
    seen.add(q);

    problems.push({
      question: q,
      answer: `${exp1} ${sign} ${exp2}`
    });
  }

  return { problems };
}

