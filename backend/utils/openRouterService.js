import dotenv from "dotenv";
import OpenAI from "openai";
import { parseJsonResponse } from "./parseJsonResponse.js";

dotenv.config();

const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";

const getClient = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
      "X-Title": "DistillLearn 2.0",
    },
  });
};

export const extractFlashcardsFromNotes = async ({
  subjectName,
  topicName,
  notes,
}) => {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Return only valid JSON. No markdown, no commentary, no code fences.",
      },
      {
        role: "user",
        content: `Convert these notes into a concise flashcard deck for revision.

Subject: ${subjectName}
Topic: ${topicName}

Return a JSON array only. Each item must be:
{
  "question": "string",
  "answer": "string"
}

Create up to 10 high-value cards. Avoid duplicates and keep answers concise.

Notes:
${notes}`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || "[]";
  const parsed = parseJsonResponse(content);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((card) => ({
      question: String(card?.question || "").trim(),
      answer: String(card?.answer || "").trim(),
    }))
    .filter((card) => card.question && card.answer);
};
