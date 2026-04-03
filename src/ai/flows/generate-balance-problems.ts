
export interface BalanceProblem {
  numbers: number[];
  equationTemplate: string;
  solution: number[];
  type: 'chain' | 'expression';
}

export interface BalanceOptions {
  numProblems: number;
  maxSum: number;
  type?: 'chain' | 'expression';
  allowSubtraction?: boolean;
}

export async function generateBalanceProblems(options: BalanceOptions) {
  const { numProblems, maxSum = 20, type = 'chain', allowSubtraction = false } = options;
  const problems: BalanceProblem[] = [];

  const usedCombinations = new Set<string>();

  while (problems.length < numProblems) {
    if (type === 'chain') {
      // Logic for [ ] + [ ] = [ ] + [ ] = [ ]
      const S = Math.floor(Math.random() * (maxSum - 5)) + 5;
      const pairs: [number, number][] = [];
      for (let i = 1; i < S / 2; i++) {
        const j = S - i;
        if (i !== j && i !== S && j !== S) pairs.push([i, j]);
      }

      if (pairs.length < 2) continue;
      const idx1 = Math.floor(Math.random() * pairs.length);
      let idx2 = Math.floor(Math.random() * pairs.length);
      while (idx1 === idx2) idx2 = Math.floor(Math.random() * pairs.length);

      const p1 = pairs[idx1];
      const p2 = pairs[idx2];
      const numbers = [...p1, ...p2, S].sort((a, b) => a - b);
      if (new Set(numbers).size !== 5) continue;

      const comboId = `chain:${numbers.join(',')}`;
      if (usedCombinations.has(comboId)) continue;
      usedCombinations.add(comboId);

      problems.push({
        numbers,
        equationTemplate: '_ + _ = _ + _ = _',
        solution: [...p1, ...p2, S],
        type: 'chain'
      });
    } else {
      // Logic for [ ] ± [ ] ± [ ] = [ ]
      const a = Math.floor(Math.random() * (maxSum / 2)) + 1;
      const b = Math.floor(Math.random() * (maxSum / 2)) + 1;
      const c = Math.floor(Math.random() * (maxSum / 2)) + 1;
      
      let op1 = '+';
      let op2 = '+';
      
      if (allowSubtraction) {
        // Default to exactly one + and one - as requested
        if (Math.random() > 0.5) {
          op1 = '+'; op2 = '-';
        } else {
          op1 = '-'; op2 = '+';
        }
      }
      
      let res = a;
      if (op1 === '+') res += b; else res -= b;
      if (op2 === '+') res += c; else res -= c;
      
      if (res <= 0 || res > maxSum) continue;
      
      const numbers = [a, b, c, res].sort((a, b) => a - b);
      if (new Set(numbers).size !== 4) continue;
      
      const comboId = `expr:${numbers.join(',')}:${op1}:${op2}`;
      if (usedCombinations.has(comboId)) continue;
      usedCombinations.add(comboId);
      
      problems.push({
        numbers,
        equationTemplate: `_ ${op1} _ ${op2} _ = _`,
        solution: [a, b, c, res],
        type: 'expression'
      });
    }
  }

  return { problems };
}
