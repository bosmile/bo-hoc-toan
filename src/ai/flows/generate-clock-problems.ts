/**
 * @fileOverview Local problem generation for clock problems.
 */

export interface ClockProblem {
  id: string;
  hour: number;
  minute: number;
  type: 'read' | 'draw' | 'mixed';
  displayTime: string;
}

export interface GenerateClockInput {
  difficulty: 'hours' | 'half-hours' | 'quarter-hours' | 'five-minutes' | 'any-minutes';
  type: 'read' | 'draw' | 'mixed';
  numProblems: number;
}

export interface GenerateClockOutput {
  problems: ClockProblem[];
}

export async function generateClockProblems(
  input: GenerateClockInput
): Promise<GenerateClockOutput> {
  const { difficulty, type, numProblems } = input;
  const problems: any[] = [];

  for (let i = 0; i < numProblems; i++) {
    let hour = Math.floor(Math.random() * 12) + 1;
    let minute = 0;

    switch (difficulty) {
      case 'hours':
        minute = 0;
        break;
      case 'half-hours':
        // Includes: Hours (0) + Half hours (30)
        minute = Math.random() < 0.5 ? 0 : 30;
        break;
      case 'quarter-hours':
        // Includes: Hours (0) + Half-hours (30) + 15/45 intervals
        const quarters = [0, 15, 30, 45];
        minute = quarters[Math.floor(Math.random() * quarters.length)];
        break;
      case 'five-minutes':
        // Includes: Hours, Half, Quarters + any multiple of 5
        minute = Math.floor(Math.random() * 12) * 5;
        break;
      case 'any-minutes':
        // Includes everything
        minute = Math.floor(Math.random() * 60);
        break;
    }

    const probType = type === 'mixed' ? (Math.random() < 0.5 ? 'read' : 'draw') : type;
    const displayTime = `${hour}:${minute.toString().padStart(2, '0')}`;

    problems.push({
      id: Math.random().toString(36).substr(2, 9),
      hour,
      minute,
      type: probType,
      displayTime,
    });
  }

  return { problems };
}

