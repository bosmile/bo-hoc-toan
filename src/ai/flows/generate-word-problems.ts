
export interface WordProblem {
  id: string;
  templateId: string;
  problemText: string;
  solutionLine: string;
  answerPrefix: string;
  answerSuffix: string;
  unit: string;
  numbers: Record<string, number>;
  correctAnswer: any;
}

export interface WordProblemOptions {
  numProblems: number;
  maxSum: number;
}

const wordProblemTemplates = [
  {
    id: 'find_number_sub_sub',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 4)) + 5;
      const n2 = Math.floor(Math.random() * (max / 4)) + 5;
      const res = Math.floor(Math.random() * (max / 2)) + 10;
      const total = res + n1 + n2;
      return {
        problemText: `Tìm một số, biết nếu lấy số đó trừ đi ${n1} rồi trừ tiếp đi ${n2} thì được kết quả là ${res}.`,
        solutionLine: "Ta có:",
        answerPrefix: "Số đó là",
        answerSuffix: ".",
        unit: "",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'candy_bags',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 3)) + 10;
      const n2 = Math.floor(Math.random() * (max / 5)) + 5;
      const n3 = Math.floor(Math.random() * (max / 5)) + 5;
      const total = n1 + (n2 * 2) + n3;
      return {
        problemText: `Cửa hàng có một số túi kẹo. Ngày thứ nhất, cửa hàng bán được ${n1} túi kẹo. Ngày thứ hai và thứ ba, mỗi ngày cửa hàng bán được ${n2} túi kẹo thì còn lại ${n3} túi kẹo. Hỏi lúc đầu, cửa hàng có bao nhiêu túi kẹo?`,
        solutionLine: "Lúc đầu, cửa hàng có số túi kẹo là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " túi kẹo.",
        unit: "túi",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'chess_points',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 2)) + 10;
      const n2 = Math.floor(Math.random() * (max / 2)) + 10;
      const total = n1 + n2;
      return {
        problemText: `Nam tham gia thi cờ vua. Ở trận thi đấu thứ nhất, Nam được ${n1} điểm, trận thi đấu thứ hai Nam được ${n2} điểm. Hỏi sau hai trận thi đấu, Nam được tất cả bao nhiêu điểm?`,
        solutionLine: "Sau hai trận thi đấu, Nam được tất cả số điểm là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " điểm.",
        unit: "điểm",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'string_cut',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 2)) + 10;
      const n2 = Math.floor(Math.random() * (max / 2)) + 10;
      const total = n1 + n2;
      return {
        problemText: `Linh cắt sợi dây thành hai đoạn. Đoạn thứ nhất dài ${n1} cm, đoạn thứ hai dài ${n2} cm. Hỏi lúc đầu, sợi dây dài bao nhiêu xăng-ti-mét?`,
        solutionLine: "Lúc đầu, sợi dây dài số xăng-ti-mét là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " cm.",
        unit: "cm",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'garden_fruit_trees',
    generate: (max: number) => {
      const total = Math.floor(Math.random() * (max - 20)) + 30;
      const n1 = Math.floor(Math.random() * (total / 3)) + 5;
      const n2 = Math.floor(Math.random() * (total / 3)) + 5;
      const n3 = total - n1 - n2;
      return {
        problemText: `Trong vườn có ${total} cây ăn quả gồm: cây bưởi, cây na và cây hồng. Trong đó có ${n1} cây bưởi và ${n2} cây na, còn lại là cây hồng. Hỏi trong vườn có bao nhiêu cây hồng?`,
        solutionLine: "Trong vườn có số cây hồng là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " cây hồng.",
        unit: "cây",
        correctAnswer: n3,
      };
    }
  },
  {
    id: 'two_digit_sum',
    generate: (max: number) => {
      const s = Math.floor(Math.random() * 8) + 2; // Sum between 2 and 9
      const solutions = [];
      for (let i = 1; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
           if (i + j === s) solutions.push(`${i}${j}`);
        }
      }
      return {
        problemText: `Viết các số có hai chữ số, biết rằng khi cộng hai chữ số của mỗi số với nhau được kết quả bằng ${s}.`,
        solutionLine: "",
        answerPrefix: "Các số đó là:",
        answerSuffix: "",
        unit: "",
        correctAnswer: solutions.join(', '),
        isGridOnly: true
      };
    }
  },
  {
    id: 'two_digit_diff',
    generate: (max: number) => {
      const d = Math.floor(Math.random() * 5) + 3; // Difference between 3 and 7
      const solutions = [];
      for (let i = 1; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
           if (i - j === d) solutions.push(`${i}${j}`);
        }
      }
      return {
        problemText: `Viết các số có hai chữ số, biết trong mỗi số, chữ số hàng chục lớn hơn chữ số hàng đơn vị là ${d}.`,
        solutionLine: "",
        answerPrefix: "Các số đó là:",
        answerSuffix: "",
        unit: "",
        correctAnswer: solutions.join(', '),
        isGridOnly: true
      };
    }
  },
  {
    id: 'two_digit_diff_reverse',
    generate: (max: number) => {
      const d = Math.floor(Math.random() * 5) + 3;
      const solutions = [];
      for (let i = 1; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
           if (j - i === d) solutions.push(`${i}${j}`);
        }
      }
      return {
        problemText: `Viết tất cả các số có hai chữ số sao cho chữ số hàng đơn vị lớn hơn chữ số hàng chục là ${d}.`,
        solutionLine: "",
        answerPrefix: "Các số đó là:",
        answerSuffix: "",
        unit: "",
        correctAnswer: solutions.join(', '),
        isGridOnly: true
      };
    }
  },
  {
    id: 'digit_combination_min_max',
    generate: (max: number) => {
      const d1 = Math.floor(Math.random() * 3) + 1;
      const d2 = Math.floor(Math.random() * 3) + 4;
      const d3 = Math.floor(Math.random() * 2) + 7;
      const digits = [d1, d2, d3];
      const numbers = [];
      for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
          if(i!==j) numbers.push(digits[i]*10 + digits[j]);
        }
      }
      const mx = Math.max(...numbers);
      const mn = Math.min(...numbers);
      return {
        problemText: `Cho ba chữ số ${d1}; ${d2}; ${d3}. \n a. Hãy lập các số có hai chữ số khác nhau từ hai trong ba chữ số đã cho. \n b. Từ các số lập được ở câu a, lấy số lớn nhất trừ đi số bé nhất được kết quả là bao nhiêu?`,
        solutionLine: "Hướng dẫn: Các số lập được: " + numbers.join(', ') + ". Lớn nhất: " + mx + ", Bé nhất: " + mn,
        answerPrefix: "Kết quả là:",
        answerSuffix: "",
        unit: "",
        correctAnswer: mx - mn,
      };
    }
  },
  {
    id: 'queue_people',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * 10) + 5;
      const n2 = Math.floor(Math.random() * 10) + 5;
      const n3 = Math.floor(Math.random() * 15) + 5;
      const total = n1 + n2 + n3;
      return {
        problemText: `Trước cửa hàng bán bánh có một số người đang xếp hàng. Biết rằng Nga đứng thứ ${n1} tính từ đầu hàng, Lê đứng thứ ${n2} tính từ cuối hàng. Ở giữa Nga và Lê có ${n3} người. Hỏi có bao nhiêu người đang đứng xếp hàng?`,
        solutionLine: "Vì: " + n1 + " + " + n3 + " + " + n2 + " = " + total,
        answerPrefix: "Có",
        answerSuffix: " người đang đứng xếp hàng.",
        unit: "",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'hidden_digits_calc',
    generate: (max: number) => {
      const a1 = Math.floor(Math.random() * 5) + 1;
      const b2 = Math.floor(Math.random() * 5) + 1;
      const res = (a1 * 10 + 6) + (20 + b2);
      return {
        problemText: `Bạn Hùng đã viết một phép tính đúng. Sau đó, bạn ấy dùng các tấm bìa để che đi hai chữ số. Hỏi hai chữ số nào đã bị che đi? \n [ ]6 + 2[ ] = ${res}`,
        solutionLine: "Ta có: " + (a1*10+6) + " + " + (20+b2) + " = " + res,
        answerPrefix: "Hai chữ số bị che là:",
        answerSuffix: "",
        unit: "",
        correctAnswer: `${a1} và ${b2}`,
      };
    }
  },
  {
    id: 'need_more_students',
    generate: (max: number) => {
      const total = Math.floor(Math.random() * (max/2)) + (max/2);
      const n1 = Math.floor(Math.random() * (total - 10)) + 5;
      const diff = total - n1;
      return {
        problemText: `Để chuẩn bị cho buổi đồng diễn, cô tổng phụ trách cần có ${total} học sinh tham gia. Cô đã chọn được ${n1} học sinh. Hỏi cô tổng phụ trách cần thêm bao nhiêu học sinh nữa để có đủ số học sinh tham gia?`,
        solutionLine: "Cô tổng phụ trách cần thêm số học sinh là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " học sinh.",
        unit: "học sinh",
        correctAnswer: diff,
      };
    }
  },
  {
    id: 'cake_distribution',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 4)) + 5;
      const n2 = Math.floor(Math.random() * (max / 4)) + 5;
      const n3 = Math.floor(Math.random() * (max / 4)) + 5;
      const total = n1 + n2 + n3;
      return {
        problemText: `Bố đã mua một số chiếc bánh. Bố biếu bà ${n1} chiếc bánh, tặng mẹ ${n2} chiếc bánh và cho Hà ${n3} chiếc bánh thì vừa hết số bánh bố đã mua. Hỏi bố đã mua tất cả bao nhiêu chiếc bánh?`,
        solutionLine: "Bố đã mua tất cả số chiếc bánh là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " chiếc bánh.",
        unit: "chiếc",
        correctAnswer: total,
      };
    }
  },
  {
    id: 'more_than_marbles',
    generate: (max: number) => {
      const n1 = Math.floor(Math.random() * (max / 2)) + 10;
      const n2 = Math.floor(Math.random() * (max / 3)) + 5;
      const total = n1 + n2;
      return {
        problemText: `Hoà có ${n1} viên bi, Phong có nhiều hơn Hoà ${n2} viên bi. Hỏi Phong có bao nhiêu viên bi?`,
        solutionLine: "Phong có số viên bi là:",
        answerPrefix: "Đáp số:",
        answerSuffix: " viên bi.",
        unit: "viên",
        correctAnswer: total,
      };
    }
  }
];

export async function generateWordProblems(options: WordProblemOptions) {
  const { numProblems, maxSum = 100 } = options;
  const problems = [];
  const max = maxSum;

  // Create a shuffled pool of templates to ensure variety and no repeats
  let pool = [...wordProblemTemplates];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  for (let i = 0; i < numProblems; i++) {
    // Pick from pool sequentially (loops back if numProblems > pool.length)
    const template = pool[i % pool.length];
    const p = template.generate(max);
    problems.push({
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id
    });
  }

  return { problems };
}

export async function generateAllLibraryWordProblems(maxSum: number = 100) {
  return {
    problems: wordProblemTemplates.map(template => ({
      ...template.generate(maxSum),
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id
    }))
  };
}
