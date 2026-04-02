/**
 * @fileOverview Local problem generation for word problems (A ± B ± C = D).
 */

const names = ['Bơ', 'Nam', 'Lan', 'Hoa', 'Minh', 'Hải', 'Mai', 'Tuấn', 'Dũng', 'Nhung', 'An', 'Bình', 'Chi', 'Đức'];
const items = ['quả táo', 'cái kẹo', 'quyển vở', 'bông hoa', 'viên bi', 'chiếc bút', 'quyển truyện', 'quả bóng', 'cái bánh', 'đồ chơi'];

const templates = [
  { type: 'Xếp hàng', text: "{name1} đang xếp hàng mua vé. Phía trước {name1} có {A} người, phía sau {name1} có {B} người. Hỏi hàng đó có tất cả bao nhiêu người?", calculateAnswer: (A: number, B: number) => A + B + 1 },
  { type: 'Xếp hạng', text: "Trong cuộc thi chạy, {name1} xếp thứ {A} từ trên xuống và xếp thứ {B} từ dưới lên. Hỏi có tất cả bao nhiêu bạn tham gia cuộc thi?", calculateAnswer: (A: number, B: number) => A + B - 1 },
  { type: 'Tuổi tác', text: "Năm nay anh {name1} {A} tuổi, em {name2} {B} tuổi. Hỏi {C} năm nữa, anh {name1} hơn em {name2} bao nhiêu tuổi?", calculateAnswer: (A: number, B: number, C: number) => A - B },
  { type: 'Cưa gỗ', text: "Bác thợ mộc cần cưa một khúc gỗ thành {A} đoạn ngắn. Hỏi bác thợ mộc phải cưa bao nhiêu lần?", calculateAnswer: (A: number) => A - 1 },
  { type: 'Thêm bớt liên hoàn', text: "Lúc đầu {name1} có {A} {item}. {name1} cho em {B} {item}, sau đó mẹ lại thưởng cho {name1} thêm {C} {item}. Hỏi bây giờ {name1} có bao nhiêu {item}?", calculateAnswer: (A: number, B: number, C: number) => A - B + C },
  { type: 'Tổng 2 bước', text: "{name1} có {A} {item}. {name2} có ít hơn {name1} {B} {item}. Hỏi cả hai bạn có tất cả bao nhiêu {item}?", calculateAnswer: (A: number, B: number) => A + (A - B) }
];

export interface WordProblem {
  id: string;
  story: string;
  calculation: string;
  answer: number;
  solution: string;
}

export interface GenerateWordProblemsInput {
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'plus' | 'minus' | 'mult' | 'div' | 'mixed';
  topic?: string;
  numProblems: number;
}

export interface GenerateWordProblemsOutput {
  problems: WordProblem[];
}

export async function generateWordProblems(
  input: GenerateWordProblemsInput
): Promise<GenerateWordProblemsOutput> {
  const { numProblems = 3 } = input;
  const problems: WordProblem[] = [];

  for (let i = 0; i < numProblems; i++) {
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    const name1 = names[Math.floor(Math.random() * names.length)];
    const name2 = names.find(n => n !== name1) || 'An';
    const itemName = items[Math.floor(Math.random() * items.length)];

    let A = Math.floor(Math.random() * 10) + 10;
    let B = Math.floor(Math.random() * (A - 2)) + 2;
    let C = Math.floor(Math.random() * 5) + 1;

    const answer = tpl.calculateAnswer(A, B, C);
    const story = tpl.text
      .replace(/{name1}/g, name1)
      .replace(/{name2}/g, name2)
      .replace(/{item}/g, itemName)
      .replace(/{A}/g, A.toString())
      .replace(/{B}/g, B.toString())
      .replace(/{C}/g, C.toString());

    problems.push({
      id: Math.random().toString(36).substr(2, 9),
      story,
      calculation: "Tư duy Logic",
      answer,
      solution: `Đáp số đúng là: ${answer}.`
    });
  }

  return { problems };
}

