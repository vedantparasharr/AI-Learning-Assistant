import 'dotenv/config';

import { GoogleGenAI } from "@google/genai";
import { getTopTopicVideos } from './services/youtubeService.js';
import { generateTopicNotes } from './services/geminiService.js';

const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",").map(k => k.trim()).filter(Boolean);

const ai = new GoogleGenAI({ apiKey: keys[0] });

async function testModel(modelName) {
  console.log(`\nTesting ${modelName}...`);
  const start = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Write a 1-paragraph summary of React Hooks.',
    });
    console.log(`${modelName} took ${Date.now() - start}ms`);
  } catch (err) {
    console.log(`${modelName} failed:`, err.message);
  }
}

async function testSpeed() {
  console.log('Testing ytSearch...');
  let start = Date.now();
  await getTopTopicVideos('React Hooks', 'Web Development');
  console.log(`ytSearch took ${Date.now() - start}ms`);

  await testModel('gemini-2.5-flash');
  await testModel('gemini-1.5-flash');
  await testModel('gemini-2.5-flash-lite');
  await testModel('gemini-2.0-flash');
}

testSpeed();
