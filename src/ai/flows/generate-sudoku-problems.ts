/**
 * @fileOverview Local problem generation for Sudoku problems.
 */

export interface SudokuProblem {
  size: number;
  grid: string[][];
  solution: string[][];
  difficulty: string;
}

export interface GenerateSudokuInput {
  size: '4' | '6' | '9';
  difficulty: 'easy' | 'medium' | 'hard';
  numProblems: number;
}

export interface GenerateSudokuOutput {
  problems: SudokuProblem[];
}

export async function generateSudokuProblems(
  input: GenerateSudokuInput
): Promise<GenerateSudokuOutput> {
    const { size, difficulty, numProblems } = input;
    const n = parseInt(size);
    const problems: SudokuProblem[] = [];

    // Simple solver/generator logic for Sudoku
    for (let i = 0; i < numProblems; i++) {
        const board = generateFullBoard(n);
        const solution = board.map(row => [...row]);
        const puzzle = pokeHoles(board, n, difficulty);
        
        problems.push({
            size: n,
            grid: puzzle.map(row => row.map(v => v === 0 ? "_" : v.toString())),
            solution: solution.map(row => row.map(v => v.toString())),
            difficulty
        });
    }

    return { problems };
}

function generateFullBoard(n: number): number[][] {
    const board = Array.from({ length: n }, () => Array(n).fill(0));
    const sqrt = Math.sqrt(n);
    const boxW = n === 6 ? 3 : sqrt;
    const boxH = n === 6 ? 2 : sqrt;
    
    fillBoard(board, n, boxW, boxH);
    return board;
}

function fillBoard(board: number[][], n: number, boxW: number, boxH: number): boolean {
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffle(Array.from({ length: n }, (_, i) => i + 1));
                for (const num of numbers) {
                    if (isValid(board, row, col, num, n, boxW, boxH)) {
                        board[row][col] = num;
                        if (fillBoard(board, n, boxW, boxH)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board: number[][], row: number, col: number, num: number, n: number, boxW: number, boxH: number): boolean {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / boxH) * boxH;
    const startCol = Math.floor(col / boxW) * boxW;
    for (let i = 0; i < boxH; i++) {
        for (let j = 0; j < boxW; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function pokeHoles(board: number[][], n: number, difficulty: string): number[][] {
    const puzzle = board.map(row => [...row]);
    let target = 0;
    if (n === 4) target = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    else if (n === 6) target = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    else target = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;

    let removed = 0;
    while (removed < target) {
        const r = Math.floor(Math.random() * n);
        const c = Math.floor(Math.random() * n);
        if (puzzle[r][c] !== 0) {
            puzzle[r][c] = 0;
            removed++;
        }
    }
    return puzzle;
}

function shuffle(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

