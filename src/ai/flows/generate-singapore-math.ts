"use server"

/**
 * @fileOverview Official Singapore Math Generator Flow using Gemini API.
 */

import { readFileSync } from 'fs';
import path from 'path';

export interface SingaporeMathProblem {
  id: string;
  question_text: string;
  variables: number[];
  operation: string;
  correct_answer: number | string;
  bar_model_hint: {
    model_type: 'part-whole' | 'comparison';
    number_of_blocks: number[];
    unknown_variable: string;
    value_per_block: number;
  };
  step_by_step_explanation: string[];
}

export interface GenerateSingaporeMathInput {
  numProblems: number;
  topic: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
}

/**
 * Utility to clean LLM response strings.
 */
function cleanLLMResponse(rawResponse: string): string {
  const regex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  const match = regex.exec(rawResponse);
  if (match && match[1]) {
    return match[1].trim();
  }
  return rawResponse.replace(/```/g, '').trim();
}

/**
 * Generates Singapore Math problems by calling Gemini API.
 */
export async function generateSingaporeMath(input: GenerateSingaporeMathInput): Promise<{ problems: SingaporeMathProblem[] }> {
  const { numProblems, topic, difficulty } = input;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in .env");
  }

  // Read instructions from the Skill definition and rules
  const skillPath = path.resolve(process.cwd(), '.agent/skills/singapore-math-generator/SKILL.md');
  const rulesPath = path.resolve(process.cwd(), '.agent/skills/singapore-math-generator/resources/singapore_math_rules.txt');
  
  const fs = require('fs');
  if (!fs.existsSync(skillPath)) {
    throw new Error(`Skill file not found at: ${skillPath}. Please ensure the .agent folder exists in the project root.`);
  }
  if (!fs.existsSync(rulesPath)) {
    throw new Error(`Rules file not found at: ${rulesPath}`);
  }

  const skillContent = fs.readFileSync(skillPath, 'utf8');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  const systemInstructions = `
    ${skillContent}
    
    REFERENCE RULES:
    ${rulesContent}
  `;

  const prompt = `Hãy tạo ${numProblems} bài toán đố về chủ đề "${topic}" với độ khó "${difficulty}". 
  Trả về kết quả dưới dạng mảng JSON gồm các bài toán.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstructions}\n\nUSER REQUEST: ${prompt}` }] }],
      generation_config: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 64,
        max_output_tokens: 8192,
        response_mime_type: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[GEMINI ERROR]", response.status, errText);
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    console.error("[GEMINI EMPTY RESPONSE]", data);
    throw new Error("Empty response from Gemini API");
  }

  try {
    const cleaned = cleanLLMResponse(rawText);
    const parsed = JSON.parse(cleaned);
    
    // Ensure it's an array
    const problemsArray = Array.isArray(parsed) ? parsed : (parsed.problems || [parsed]);
    
    return {
      problems: problemsArray.map((p: any) => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9)
      }))
    };
  } catch (error) {
    console.error("JSON Parsing Error:", rawText);
    throw new Error("Failed to parse AI response as JSON");
  }
}
