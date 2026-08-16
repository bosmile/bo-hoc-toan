import fs from 'fs';
import path from 'path';

// Redefine the templates here locally so we can run this script cleanly and then overwrite the old TS file.
// Or we can just import if ts-node handles it. Let's redefine for safety because we are going to change the original file.

export interface TimoProblem {
  id: string;
  category: 'Logical Thinking' | 'Arithmetic' | 'Number Theory' | 'Geometry' | 'Combinatorics';
  questionEn: string;
  questionVn: string;
  answer: string;
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysVn = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const TIMO_TEMPLATES = [
  // LOGICAL THINKING
  {
    category: 'Logical Thinking',
    generate: (): TimoProblem => {
      const start = randomInt(1, 10);
      const step = randomInt(2, 5);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      const ans = start + 4 * step;
      return {
        id: 'lt_pattern_1',
        category: 'Logical Thinking',
        questionEn: `According to the pattern shown below, what is the number in the space provided?\n${seq.join(', ')}, __`,
        questionVn: `Dựa vào quy luật dưới đây, tìm số thích hợp để điền vào chỗ trống:\n${seq.join(', ')}, __`,
        answer: ans.toString(),
      };
    }
  },
  {
    category: 'Logical Thinking',
    generate: (): TimoProblem => {
      const todayIdx = randomInt(0, 6);
      const offset = randomInt(2, 10);
      const isFuture = Math.random() > 0.5;
      const targetIdx = isFuture ? (todayIdx + offset) % 7 : (todayIdx - offset + 70) % 7;
      
      const enPhrase = isFuture ? `${offset} days later` : `${offset} days ago`;
      const vnPhrase = isFuture ? `${offset} ngày nữa` : `${offset} ngày trước`;

      return {
        id: 'lt_days_1',
        category: 'Logical Thinking',
        questionEn: `Today is ${daysEn[todayIdx]}. Which day of the week will it be ${enPhrase}?`,
        questionVn: `Hôm nay là ${daysVn[todayIdx]}. Hỏi ${vnPhrase} là ngày thứ mấy?`,
        answer: daysVn[targetIdx],
      };
    }
  },
  {
    category: 'Logical Thinking',
    generate: (): TimoProblem => {
      const age1 = randomInt(30, 50);
      const age2 = age1 + randomInt(-5, 5);
      const actualAge2 = age2 === age1 ? age2 + 1 : age2;
      return {
        id: 'lt_age_diff',
        category: 'Logical Thinking',
        questionEn: `Father is ${Math.max(age1, actualAge2)} years old and mother is ${Math.min(age1, actualAge2)} years old. Find the difference between their ages.`,
        questionVn: `Năm nay bố ${Math.max(age1, actualAge2)} tuổi và mẹ ${Math.min(age1, actualAge2)} tuổi. Hỏi hiệu số tuổi của hai người là bao nhiêu?`,
        answer: Math.abs(age1 - actualAge2).toString(),
      };
    }
  },
  {
    category: 'Logical Thinking',
    generate: (): TimoProblem => {
      const children = randomInt(15, 30);
      const front = randomInt(5, children - 5);
      const behind = children - 1 - front;
      const names = ['Eric', 'John', 'Mary', 'Anna', 'Peter', 'Tom'];
      const name = names[randomInt(0, names.length - 1)];
      return {
        id: 'lt_queue_behind',
        category: 'Logical Thinking',
        questionEn: `${children} children form a column. There are ${front} children in front of ${name}. How many children are behind him/her?`,
        questionVn: `${children} bạn nhỏ xếp thành một hàng dọc. Có ${front} bạn đứng phía trước ${name}. Hỏi có bao nhiêu bạn đứng phía sau bạn ấy?`,
        answer: behind.toString(),
      };
    }
  },

  // ARITHMETIC
  {
    category: 'Arithmetic',
    generate: (): TimoProblem => {
      const nums = Array.from({ length: randomInt(4, 6) }, () => randomInt(2, 15));
      const sum = nums.reduce((a, b) => a + b, 0);
      return {
        id: 'ar_sum',
        category: 'Arithmetic',
        questionEn: `Find the value of ${nums.join(' + ')}.`,
        questionVn: `Tìm giá trị của ${nums.join(' + ')}.`,
        answer: sum.toString(),
      };
    }
  },
  {
    category: 'Arithmetic',
    generate: (): TimoProblem => {
      const n1 = randomInt(30, 60);
      const n2 = randomInt(5, 15);
      const n3 = randomInt(5, 10);
      return {
        id: 'ar_sub',
        category: 'Arithmetic',
        questionEn: `Find the value of ${n1} - ${n2} - ${n3}.`,
        questionVn: `Tìm giá trị của ${n1} - ${n2} - ${n3}.`,
        answer: (n1 - n2 - n3).toString(),
      };
    }
  },
  {
    category: 'Arithmetic',
    generate: (): TimoProblem => {
      const a = randomInt(5, 20);
      const ans = randomInt(5, 20);
      const sum = a + ans;
      return {
        id: 'ar_eq_add',
        category: 'Arithmetic',
        questionEn: `A is a 1-digit or 2-digit number. What is the value of A if the equation below is correct?\n${a} + A = ${sum}`,
        questionVn: `Nếu A là một số, tìm giá trị của A để phép tính dưới đây là đúng:\n${a} + A = ${sum}`,
        answer: ans.toString(),
      };
    }
  },
  {
    category: 'Arithmetic',
    generate: (): TimoProblem => {
      const a = randomInt(50, 99);
      const b = randomInt(10, 40);
      return {
        id: 'ar_eq_sub',
        category: 'Arithmetic',
        questionEn: `What is the number that should be filled in the blank below?\n${a} - ___ = ${a - b}`,
        questionVn: `Điền số thích hợp vào chỗ trống dưới đây:\n${a} - ___ = ${a - b}`,
        answer: b.toString(),
      };
    }
  },

  // NUMBER THEORY
  {
    category: 'Number Theory',
    generate: (): TimoProblem => {
      const animals = [
        { en: 'dog', vn: 'con chó', legs: 4, pl: 'dogs' },
        { en: 'spider', vn: 'con nhện', legs: 8, pl: 'spiders' },
        { en: 'bird', vn: 'con chim', legs: 2, pl: 'birds' },
        { en: 'cat', vn: 'con mèo', legs: 4, pl: 'cats' }
      ];
      const animal = animals[randomInt(0, animals.length - 1)];
      const count = randomInt(3, 9);
      return {
        id: 'nt_legs',
        category: 'Number Theory',
        questionEn: `A ${animal.en} has ${animal.legs} legs. How many legs do ${count} ${animal.pl} have?`,
        questionVn: `Một ${animal.vn} có ${animal.legs} cái chân. Hỏi ${count} ${animal.vn} có tất cả bao nhiêu cái chân?`,
        answer: (animal.legs * count).toString(),
      };
    }
  },
  {
    category: 'Number Theory',
    generate: (): TimoProblem => {
      const diff = randomInt(1, 5) * 2; // always even diff so they can share equally
      const smaller = randomInt(5, 15);
      const bigger = smaller + diff;
      return {
        id: 'nt_share',
        category: 'Number Theory',
        questionEn: `Andy has ${bigger} candies and Peter has ${smaller} candies. How many candies does Andy have to give Peter to make them have the same number of candies?`,
        questionVn: `Andy có ${bigger} cái kẹo và Peter có ${smaller} cái kẹo. Hỏi Andy phải cho Peter bao nhiêu cái kẹo để số kẹo của hai bạn bằng nhau?`,
        answer: (diff / 2).toString(),
      };
    }
  },
  {
    category: 'Number Theory',
    generate: (): TimoProblem => {
      const min = randomInt(10, 20);
      const max = randomInt(30, 40);
      // count odds or evens
      const type = Math.random() > 0.5 ? 'odd' : 'even';
      let count = 0;
      for (let i = min; i <= max; i++) {
        if (type === 'odd' && i % 2 !== 0) count++;
        if (type === 'even' && i % 2 === 0) count++;
      }
      return {
        id: 'nt_count_odd_even',
        category: 'Number Theory',
        questionEn: `How many ${type} numbers are there from ${min} to ${max}?`,
        questionVn: `Hỏi có bao nhiêu số ${type === 'odd' ? 'lẻ' : 'chẵn'} tính từ số ${min} đến số ${max}?`,
        answer: count.toString(),
      };
    }
  },
  {
    category: 'Number Theory',
    generate: (): TimoProblem => {
      const l_per_box = 10;
      const s_per_box = 5;
      const num_l = randomInt(2, 5);
      const num_s = randomInt(2, 5);
      const extra_per_pair = randomInt(1, 3);
      const pairs = Math.min(num_l, num_s);
      const extra = pairs * extra_per_pair;
      const total = num_l * l_per_box + num_s * s_per_box + extra;

      return {
        id: 'nt_package_bonus',
        category: 'Number Theory',
        questionEn: `A large package contains ${l_per_box} cookies. A small package contains ${s_per_box} cookies. Buying 1 large package and 1 small package together will get you ${extra_per_pair} extra cookies for free every time. If Peggy buys ${num_l} large packages and ${num_s} small packages, how many cookies does she get in total?`,
        questionVn: `Một túi lớn có ${l_per_box} cái bánh quy. Một túi nhỏ có ${s_per_box} cái bánh quy. Mỗi lần mua cùng lúc 1 túi lớn và 1 túi nhỏ, bạn sẽ được tặng thêm ${extra_per_pair} cái bánh quy miễn phí. Nếu Peggy mua ${num_l} túi lớn và ${num_s} túi nhỏ, hỏi cô ấy nhận được tất cả bao nhiêu cái bánh quy?`,
        answer: total.toString(),
      };
    }
  },

  // GEOMETRY
  {
    category: 'Geometry',
    generate: (): TimoProblem => {
      const shapes = [
        { en: 'triangle', vn: 'hình tam giác', sides: 3, pl: 'triangles' },
        { en: 'square', vn: 'hình vuông', sides: 4, pl: 'squares' },
        { en: 'pentagon', vn: 'hình ngũ giác', sides: 5, pl: 'pentagons' },
        { en: 'hexagon', vn: 'hình lục giác', sides: 6, pl: 'hexagons' }
      ];
      const shape = shapes[randomInt(0, shapes.length - 1)];
      const count = randomInt(4, 10);
      return {
        id: 'geo_sides',
        category: 'Geometry',
        questionEn: `A ${shape.en} has ${shape.sides} sides. How many sides are there in ${count} ${shape.pl}?`,
        questionVn: `Một ${shape.vn} có ${shape.sides} cạnh. Hỏi ${count} ${shape.vn} có tất cả bao nhiêu cạnh?`,
        answer: (shape.sides * count).toString(),
      };
    }
  },
  {
    category: 'Geometry',
    generate: (): TimoProblem => {
      const c1 = randomInt(4, 9);
      const c2 = randomInt(2, 6);
      const c3 = randomInt(3, 8);
      return {
        id: 'geo_cubes',
        category: 'Geometry',
        questionEn: `Amy stacks some cubes. She uses ${c1} red cubes, ${c2} blue cubes and ${c3} yellow cubes. How many cubes does she use in total?`,
        questionVn: `Amy xếp các khối lập phương. Cô ấy dùng ${c1} khối màu đỏ, ${c2} khối màu xanh và ${c3} khối màu vàng. Hỏi cô ấy đã dùng tổng cộng bao nhiêu khối lập phương?`,
        answer: (c1 + c2 + c3).toString(),
      };
    }
  },
  {
    category: 'Geometry',
    generate: (): TimoProblem => {
      const points = randomInt(5, 12);
      return {
        id: 'geo_lines',
        category: 'Geometry',
        questionEn: `There are ${points} points on a circle. If we connect every point to the center of the circle, how many line segments will be formed?`,
        questionVn: `Có ${points} điểm trên một đường tròn. Nếu ta nối mỗi điểm với tâm của đường tròn, ta sẽ được bao nhiêu đoạn thẳng?`,
        answer: points.toString(),
      };
    }
  },
  {
    category: 'Geometry',
    generate: (): TimoProblem => {
      const l = randomInt(3, 7);
      const w = randomInt(2, 5);
      const h = randomInt(2, 5);
      return {
        id: 'geo_stack_cubes',
        category: 'Geometry',
        questionEn: `Some identical cubes are stacked together to form a solid rectangular block. The block has length ${l} cubes, width ${w} cubes and height ${h} cubes. How many cubes are there in the block?`,
        questionVn: `Một số khối lập phương giống nhau được xếp thành một khối hộp chữ nhật đặc. Khối hộp có chiều dài gồm ${l} khối, chiều rộng ${w} khối và chiều cao ${h} khối. Hỏi có tất cả bao nhiêu khối lập phương?`,
        answer: (l * w * h).toString(),
      };
    }
  },

  // COMBINATORICS
  {
    category: 'Combinatorics',
    generate: (): TimoProblem => {
      const groups = randomInt(3, 6);
      const perGroup = randomInt(4, 9);
      const total = groups * perGroup;
      const items = ['stars', 'apples', 'candies', 'oranges'];
      const vnItems = ['ngôi sao', 'quả táo', 'cái kẹo', 'quả cam'];
      const idx = randomInt(0, items.length - 1);
      return {
        id: 'comb_separate',
        category: 'Combinatorics',
        questionEn: `Separate ${total} ${items[idx]} into ${groups} equal groups, how many ${items[idx]} are there in each group?`,
        questionVn: `Chia ${total} ${vnItems[idx]} thành ${groups} nhóm bằng nhau. Hỏi mỗi nhóm có bao nhiêu ${vnItems[idx]}?`,
        answer: perGroup.toString(),
      };
    }
  },
  {
    category: 'Combinatorics',
    generate: (): TimoProblem => {
      const nums = new Set<number>();
      while (nums.size < 5) nums.add(randomInt(10, 99));
      const arr = Array.from(nums);
      const sorted = [...arr].sort((a, b) => b - a); // descending
      const rank = randomInt(2, 4);
      return {
        id: 'comb_sort',
        category: 'Combinatorics',
        questionEn: `Arrange the following numbers in descending order (from largest to smallest), find the value of the ${rank === 2 ? '2nd' : rank === 3 ? '3rd' : '4th'} largest number.\n${arr.join(', ')}`,
        questionVn: `Sắp xếp các số dưới đây theo thứ tự giảm dần (từ lớn nhất đến nhỏ nhất) để tìm số lớn thứ ${rank}.\n${arr.join(', ')}`,
        answer: sorted[rank - 1].toString(),
      };
    }
  },
  {
    category: 'Combinatorics',
    generate: (): TimoProblem => {
      const c1 = randomInt(3, 7);
      const v1 = randomInt(1, 2);
      const c2 = randomInt(2, 5);
      const v2 = randomInt(5, 10);
      const totalValue = c1 * v1 + c2 * v2;
      return {
        id: 'comb_coins',
        category: 'Combinatorics',
        questionEn: `Peter has ${c1} $${v1} coins and ${c2} $${v2} coins. What is the maximum value of the souvenir that he can buy?`,
        questionVn: `Peter có ${c1} đồng xu mệnh giá $${v1} và ${c2} đồng xu mệnh giá $${v2}. Hỏi bạn ấy có thể mua được món đồ lưu niệm có giá cao nhất là bao nhiêu?`,
        answer: totalValue.toString(),
      };
    }
  },
  {
    category: 'Combinatorics',
    generate: (): TimoProblem => {
      const num1 = randomInt(20240000, 20249999);
      const num2 = randomInt(20250000, 20259999);
      const num3 = randomInt(20300000, 20399999);
      const num4 = randomInt(20200000, 20239999);
      const arr = [num1, num2, num3, num4].sort(() => Math.random() - 0.5);
      const smallest = Math.min(...arr);

      return {
        id: 'comb_find_smallest',
        category: 'Combinatorics',
        questionEn: `Which number below is the smallest?\n${arr.join(', ')}`,
        questionVn: `Số nào dưới đây là số nhỏ nhất?\n${arr.join(', ')}`,
        answer: smallest.toString(),
      };
    }
  }
];

function generateDatabase() {
  const db: Record<string, TimoProblem[]> = {};
  const categories = [
    { name: 'Logical Thinking', qStart: 1, qEnd: 5 },
    { name: 'Arithmetic', qStart: 6, qEnd: 10 },
    { name: 'Number Theory', qStart: 11, qEnd: 15 },
    { name: 'Geometry', qStart: 16, qEnd: 20 },
    { name: 'Combinatorics', qStart: 21, qEnd: 25 },
  ];

  for (const cat of categories) {
    const templates = TIMO_TEMPLATES.filter(t => t.category === cat.name);
    for (let q = cat.qStart; q <= cat.qEnd; q++) {
      const bucket: TimoProblem[] = [];
      for (let i = 0; i < 30; i++) {
        // Randomly pick a template for this category
        const t = templates[randomInt(0, templates.length - 1)];
        bucket.push(t.generate());
      }
      db[`q${q}`] = bucket;
    }
  }

  // Ensure the directory exists
  const dirPath = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const outPath = path.join(dirPath, 'timo-grade-1-db.json');
  fs.writeFileSync(outPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Successfully generated ${25 * 30} static problems to ${outPath}`);
}

generateDatabase();
