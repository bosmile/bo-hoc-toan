/**
 * @fileOverview Local problem generation for sequence problems (periodic, arithmetic, etc.).
 */

export interface SequenceProblem {
  type: 'periodic' | 'arithmetic_increase' | 'arithmetic_decrease' | 'step_increasing' | 'step_alternating';
  cycleNumbers?: number[];
  cycleSum?: number[];
  step?: number;
  step1?: number;
  step2?: number;
  sequence?: number[];
  grid: string[];
  instruction: string;
}

export interface GenerateSequenceInput {
  sequenceType: 'periodic' | 'arithmetic_increase' | 'arithmetic_decrease' | 'step_increasing' | 'step_alternating';
  cycleLength?: number;
  maxCycleSum?: number;
  rangeMin?: number;
  rangeMax?: number;
  stepMin?: number;
  stepMax?: number;
  gridLength?: number;
  numBlanks?: number;
  numProblems: number;
}

export interface GenerateSequenceOutput {
  problems: SequenceProblem[];
}

export async function generateSequenceProblems(
  input: GenerateSequenceInput
): Promise<GenerateSequenceOutput> {
  const { sequenceType = 'periodic', numProblems = 2 } = input;
  const problems: any[] = [];
  
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  for (let p = 0; p < numProblems; p++) {
    if (sequenceType === 'periodic') {
      const cycleLength = input.cycleLength ?? 3;
      const maxSum = input.maxCycleSum ?? 30;
      
      const cycle = [];
      const used = new Set<number>();
      for (let i = 0; i < cycleLength; i++) {
        let n = 0;
        let innerTries = 0;
        do {
          n = randomInt(1, Math.max(1, maxSum - cycleLength + 1));
          innerTries++;
        } while (used.has(n) && innerTries < 50);
        used.add(n);
        cycle.push(n);
      }
      
      const sum = cycle.reduce((a, b) => a + b, 0);
      const grid = Array(12).fill('_');
      for (let i = 0; i < cycleLength - 1; i++) {
        const value = cycle[i];
        const randomPeriod = Math.floor(Math.random() * Math.floor(12 / cycleLength));
        const index = randomPeriod * cycleLength + i;
        if (index < 12) grid[index] = value.toString();
      }

      problems.push({
        type: 'periodic' as const,
        cycleNumbers: cycle,
        cycleSum: sum,
        grid,
        instruction: `Biết tổng của ${cycleLength} số liên tiếp bằng ${sum}. Em hãy tìm số còn thiếu và hoàn thiện bảng sau:`
      });
    } else {
      const gridLen = input.gridLength ?? 6;
      const blanks = input.numBlanks ?? 2;
      const rMin = input.rangeMin ?? 0;
      const rMax = input.rangeMax ?? 100;
      const sMin = input.stepMin ?? 1;
      const sMax = input.stepMax ?? 10;
      
      let valid = false;
      let seq: number[] = [];
      let step = 0, step1 = 0, step2 = 0;
      let innerTries = 0;
      
      while (!valid && innerTries < 1000) {
        innerTries++;
        seq = [];
        const startNum = randomInt(rMin, rMax);
        seq.push(startNum);
        
        step = randomInt(sMin, sMax);
        step1 = randomInt(sMin, sMax) * (Math.random() > 0.5 ? 1 : -1);
        step2 = randomInt(sMin, sMax) * (Math.random() > 0.5 ? 1 : -1);
        if (step1 === step2) step2 = -step1;
        
        let isOk = true;
        let curr = startNum;
        
        for (let i = 1; i < gridLen; i++) {
          let diff = 0;
          if (sequenceType === 'arithmetic_increase') diff = step;
          else if (sequenceType === 'arithmetic_decrease') diff = -step;
          else if (sequenceType === 'step_increasing') diff = step + (i - 1);
          else if (sequenceType === 'step_alternating') diff = (i % 2 === 1) ? step1 : step2;
          
          curr += diff;
          if (curr < rMin || curr > rMax) {
             isOk = false;
             break;
          }
          seq.push(curr);
        }
        if (isOk) valid = true;
      }

      const grid = [];
      for (let i = 0; i < gridLen; i++) {
        if (i >= gridLen - blanks) grid.push('_');
        else grid.push(seq[i].toString());
      }

      let instruction = `Tìm quy luật và điền số thích hợp vào chỗ trống:`;

      problems.push({
        type: sequenceType as any,
        step,
        step1,
        step2,
        sequence: seq,
        grid,
        instruction
      });
    }
  }

  return { problems };
}


