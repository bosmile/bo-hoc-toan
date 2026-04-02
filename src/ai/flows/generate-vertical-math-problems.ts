/**
 * @fileOverview Local problem generation for vertical math problems with detailed digit control.
 */

export interface VariableRange {
  min: number;
  max: number;
}

export interface VerticalProblem {
  top: string;
  bottom: string;
  result: string;
  operator: '+' | '-';
  fullEquation: string;
}

export interface GenerateVerticalInput {
  operation: 'plus' | 'minus' | 'mixed';
  digits: number;
  hasCarry?: boolean;
  hideTarget: 'result' | 'operands' | 'mixed';
  numProblems: number;
  rangeN1?: VariableRange;
  rangeN2?: VariableRange;
  rangeResult?: VariableRange;
}

export interface GenerateVerticalOutput {
  problems: VerticalProblem[];
}

export async function generateVerticalMathProblems(
  input: GenerateVerticalInput
): Promise<GenerateVerticalOutput> {
  const { operation, digits = 2, hasCarry, hideTarget = 'mixed', numProblems = 20, rangeN1, rangeN2, rangeResult } = input;
  const problems: VerticalProblem[] = [];
  const seen = new Set<string>();
  const maxTries = 30000;
  let tries = 0;

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getOp = (): '+' | '-' => operation === 'plus' ? '+' : (operation === 'minus' ? '-' : (Math.random() > 0.5 ? '+' : '-'));
  
  const minD = Math.pow(10, digits - 1);
  const maxD = Math.pow(10, digits) - 1;
  const getRange = (r: any) => r || { min: minD, max: maxD };

  const r1 = getRange(rangeN1);
  const r2 = getRange(rangeN2);
  const rRes = getRange(rangeResult);

  while (problems.length < numProblems && tries < maxTries) {
    tries++;
    const op = getOp();
    const n1 = randomInt(r1.min, r1.max);
    const n2 = randomInt(r2.min, r2.max);
    
    if (op === '-' && n1 < n2) continue;
    
    const res = op === '+' ? n1 + n2 : n1 - n2;
    if (res < rRes.min || res > rRes.max) continue;

    let hasC = false;
    const strN1 = n1.toString().padStart(digits, '0');
    const strN2 = n2.toString().padStart(digits, '0');
    
    for (let i = 0; i < digits; i++) {
       const d1 = parseInt(strN1[strN1.length - 1 - i] || '0');
       const d2 = parseInt(strN2[strN2.length - 1 - i] || '0');
       if (op === '+' && d1 + d2 >= 10) hasC = true;
       if (op === '-' && d1 < d2) hasC = true;
    }

    if (hasCarry === true && !hasC) continue;
    if (hasCarry === false && hasC) continue;

    let top = n1.toString();
    let bottom = n2.toString();
    let resultStr = res.toString();

    let targetObj = hideTarget;
    if (targetObj === 'mixed') {
       const targets = ['result', 'operands'];
       targetObj = targets[Math.floor(Math.random() * targets.length)] as any;
    }
    
    if (targetObj === 'result') {
      const hideIdx = Math.floor(Math.random() * resultStr.length);
      resultStr = resultStr.substring(0, hideIdx) + '_' + resultStr.substring(hideIdx + 1);
    } else {
      if (Math.random() > 0.5) {
         const hideIdx = Math.floor(Math.random() * top.length);
         top = top.substring(0, hideIdx) + '_' + top.substring(hideIdx + 1);
      } else {
         const hideIdx = Math.floor(Math.random() * bottom.length);
         bottom = bottom.substring(0, hideIdx) + '_' + bottom.substring(hideIdx + 1);
      }
    }

    const q = `${top}${op}${bottom}=${resultStr}`;
    if (seen.has(q)) continue;
    seen.add(q);

    problems.push({
      top,
      bottom,
      result: resultStr,
      operator: op,
      fullEquation: `${n1} ${op} ${n2} = ${res}`
    });
  }

  return { problems };
}

