import { generateTimoProblems } from '../src/ai/flows/generate-timo-problems';

async function main() {
  const result = await generateTimoProblems({
    category: 'All',
    numProblems: 25
  });

  let md = `# ĐỀ THI MẪU TIMO KHỐI LỚP 1 (FULL TEST)\n*Thời gian làm bài: 90 phút | Số lượng: 25 câu*\n\n---\n\n`;
  let answers = `> [!TIP] ĐÁP ÁN\n`;

  result.problems.forEach((p: any, idx: number) => {
    md += `**Câu ${idx + 1}: [${p.category}]** ${p.questionEn}\n*(${p.questionVn})*\n\n`;
    answers += `> ${idx + 1}. ${p.answer}\n`;
  });

  console.log(md + "---\n\n" + answers);
}

main().catch(console.error);
