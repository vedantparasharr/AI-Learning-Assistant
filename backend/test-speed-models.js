import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",").map(k => k.trim()).filter(Boolean);
const aiClients = keys.map(apiKey => new GoogleGenAI({ apiKey }));
const getAi = () => aiClients[0];

async function testSpeed() {
  const prompt = `Write clean study notes for: "React Hooks" (Web Development).

- You decide the best way to structure the notes based on the topic.
- If it is an academic or theoretical topic, make the notes exam-oriented.
- If it is a practical skill or tool, structure the notes for someone learning that skill.
- Above all, the notes must be completely self-explanatory, organic, and straightforward.
- Do not force rigid or repetitive structures (like putting a "Core Concepts" heading in every note).
- Get straight to the point. No motivational openers, filler text, or AI disclaimers.
- Use examples and code snippets where they make things clearer.
- Format mathematical equations and formulas using LaTeX syntax (wrap inline math with $ and block math with $$).
- Use basic markdown for scannability, but avoid over-structuring.`;

  console.log('Testing gemini-2.5-flash-lite...');
  let start = Date.now();
  await getAi().models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
  console.log(`gemini-2.5-flash-lite took ${Date.now() - start}ms`);

  console.log('Testing gemini-2.5-flash...');
  start = Date.now();
  await getAi().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(`gemini-2.5-flash took ${Date.now() - start}ms`);

  console.log('Testing gemini-1.5-flash...');
  start = Date.now();
  await getAi().models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });
  console.log(`gemini-1.5-flash took ${Date.now() - start}ms`);
}

testSpeed();
