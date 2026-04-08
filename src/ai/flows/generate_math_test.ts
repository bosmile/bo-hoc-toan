/**
 * @fileOverview Simulation script to test Singapore Math Generator Agent Skill.
 */

import * as fs from 'fs';
import * as path from 'path';

interface SingaporeMathProblem {
  question_text: string;
  variables: number[];
  operation: string;
  correct_answer: number;
  bar_model_hint: {
    model_type: 'part-whole' | 'comparison';
    number_of_blocks: number[];
    unknown_variable: string;
    value_per_block: number;
  };
  step_by_step_explanation: string[];
}

/**
 * Utility to clean LLM response strings.
 * Removes markdown code blocks (e.g., ```json ... ```) using regex.
 */
function cleanLLMResponse(rawResponse: string): string {
  // Regex to match markdown code block syntax (supports triple backticks and optional language hint)
  const regex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  const match = regex.exec(rawResponse);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Also handle cases with single backticks if needed, or if no markdown markers exist
  return rawResponse.replace(/```/g, '').trim();
}

/**
 * Mocks the AI generation process.
 * In a real scenario, this would call specialized-math-generator skill with the provided prompt.
 */
async function simulateAgentSkillCall(topic: string): Promise<string> {
  console.log(`[AGENT] Calling Singapore Math Generator with topic: ${topic}...`);
  
  // Simulated RAW response from LLM (including accidental markdown markers for testing robustness)
  const mockRawResponse = "```json\n" + JSON.stringify({
    "question_text": `Bơ có 5 bộ đồ chơi ${topic}, mỗi bộ có 12 cái. Hỏi Bơ có tất cả bao nhiêu cái ${topic}?`,
    "variables": [5, 12],
    "operation": "nhân",
    "correct_answer": 60,
    "bar_model_hint": {
      "model_type": "part-whole",
      "number_of_blocks": [5],
      "unknown_variable": `tổng số cái ${topic}`,
      "value_per_block": 12
    },
    "step_by_step_explanation": [
      `Bước 1: Xác định Bơ có 5 bộ ${topic}.`,
      `Bước 2: Mỗi bộ đều có 12 miếng ghép (đơn vị).`,
      `Bước 3: Ta vẽ mô hình 5 khối bằng nhau, mỗi khối ghi số 12.`,
      `Bước 4: Thực hiện phép tính 5 x 12 = 60.`,
      `Kết luận: Bơ có 60 cái ${topic}.`
    ]
  }, null, 2) + "\n```";

  return Promise.resolve(mockRawResponse);
}

/**
 * Main test function to generate 3 problems.
 */
export async function runMathGenerationTest() {
  const problems: SingaporeMathProblem[] = [];
  const topic = "Khủng long"; // Hardcoded as per user request
  
  console.log(`Starting Math Generation Test for Topic: ${topic}`);

  for (let i = 1; i <= 3; i++) {
    const rawResult = await simulateAgentSkillCall(topic);
    
    // Clean and Parse
    const cleanedResult = cleanLLMResponse(rawResult);
    
    try {
      const parsedProblem: SingaporeMathProblem = JSON.parse(cleanedResult);
      problems.push(parsedProblem);
      console.log(`Problem ${i} generated successfully.`);
    } catch (error) {
      console.error(`Error parsing Problem ${i}:`, error);
    }
  }

  // Save to math_data.json
  const outputPath = path.resolve(__dirname, '../../../math_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2), 'utf-8');
  
  console.log(`Test complete. Results saved to: ${outputPath}`);
  return problems;
}

// Auto-run if executed directly (mocking process.env or similar)
if (require.main === module) {
  runMathGenerationTest().catch(console.error);
}
