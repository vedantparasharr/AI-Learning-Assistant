import { GoogleGenAI } from "@google/genai";
import { sanitizeTopics } from "../utils/topicKey.js";

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not set in the environment variables.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash-lite";

const jsonConfig = (schema) => ({
  responseMimeType: "application/json",
  responseSchema: schema,
});

const syllabusTopicSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      estimated_hours: { type: "number" },
    },
    required: ["name", "estimated_hours"],
  },
};

const starterDeckSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      flashcards: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
          },
          required: ["question", "answer"],
        },
      },
    },
    required: ["name", "flashcards"],
  },
};

const flashcardExtractionSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
    },
    required: ["question", "answer"],
  },
};

export const parseSyllabusTopics = async (text) => {
  const prompt = `You are an expert curriculum designer. Extract the following syllabus into a flat list of specific, searchable study topics.

Rules:
- Each topic must be a single, standalone concept a student can study in one sitting.
- Never combine two things with a slash (React/Vue, HTML/CSS) — split them or pick the more relevant one.
- Keep names concise and search-friendly (good for YouTube/Google lookup).
- Merge duplicates.
- Assign realistic study hours per topic.

Syllabus:
${text.substring(0, 25000)}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(syllabusTopicSchema),
    });

    const topics = JSON.parse(response.text.trim());

    return sanitizeTopics(topics);
  } catch (error) {
    console.error("Gemini API error parsing syllabus:", error);
    throw new Error("Failed to parse syllabus topics");
  }
};

export const generateRoadmapTopicsFromPrompt = async ({ prompt, subjectName = "" }) => {
  const roadmapPrompt = `You are an expert curriculum designer. Generate a progressive study roadmap for this learner goal.

Rules:
- Start from fundamentals, build toward advanced topics.
- Each topic must be a single standalone concept — no slashes, no vague groupings.
- Keep names concise and search-friendly.
- 8 to 18 topics depending on scope. No duplicates.
- Assign realistic study hours per topic.

Goal: ${prompt.substring(0, 4000)}
${subjectName ? `Subject: ${subjectName}` : ""}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: roadmapPrompt,
      config: jsonConfig(syllabusTopicSchema),
    });

    const topics = JSON.parse(response.text.trim());

    return sanitizeTopics(topics);
  } catch (error) {
    console.error("Gemini roadmap generation error:", error);
    throw new Error("Failed to generate roadmap topics");
  }
};

export const generateStarterFlashcardsForTopics = async ({ subjectName, topics }) => {
  const prompt = `You are an expert educator. Create exactly 2 exam-focused flashcards for each topic below.

Subject: ${subjectName}
Topics:
${topics.map((t, i) => `${i + 1}. ${t.name}`).join("\n")}

Rules:
- Each card must test a core, examinable idea for that topic.
- Questions should be direct — no vague "what is" questions unless the definition is itself the key exam point.
- Answers must be concise but complete. No padding.
- Don't repeat phrasing across cards.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(starterDeckSchema),
    });

    const parsed = JSON.parse(response.text.trim());

    if (!Array.isArray(parsed)) {
      return topics.map((topic) => ({
        name: topic.name,
        flashcards: [],
      }));
    }

    return topics.map((topic) => {
      const generated = parsed.find(
        (entry) => String(entry?.name || "").trim().toLowerCase() === topic.name.trim().toLowerCase(),
      );

      const flashcards = Array.isArray(generated?.flashcards)
        ? generated.flashcards
            .map((card) => ({
              question: String(card?.question || "").trim(),
              answer: String(card?.answer || "").trim(),
            }))
            .filter((card) => card.question && card.answer)
            .slice(0, 2)
        : [];

      return {
        name: topic.name,
        flashcards,
      };
    });
  } catch (error) {
    console.error("Gemini starter flashcards error:", error);
    return topics.map((topic) => ({
      name: topic.name,
      flashcards: [],
    }));
  }
};

export const generateTopicNotes = async ({ subjectName, topicName }) => {
  const prompt = `You are a senior engineer explaining to a fellow developer.

Write exam-oriented study notes for: "${topicName}" (${subjectName})

- Get straight to the point. No motivational openers, no "why this matters" preamble.
- Use examples and code snippets where they make things clearer.
- Use markdown: headings, bold for key terms, code blocks for code. Keep it scannable.
- Write like you're explaining to someone who needs to pass an exam tomorrow, not someone learning from scratch.
- No filler. No "great question" energy. No AI disclaimer at the end.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API error generating notes:", error);
    throw new Error("Failed to generate topic notes");
  }
};

export const extractFlashcardsFromNotes = async ({
  subjectName,
  topicName,
  notes,
}) => {
  const prompt = `You are an expert educator. Convert these notes into a concise flashcard deck for revision.

Subject: ${subjectName}
Topic: ${topicName}

Create up to 10 high-value cards. Avoid duplicates and keep answers concise.

Notes:
${notes}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(flashcardExtractionSchema),
    });

    const parsed = JSON.parse(response.text.trim());

    return Array.isArray(parsed)
      ? parsed
          .map((card) => ({
            question: String(card?.question || "").trim(),
            answer: String(card?.answer || "").trim(),
          }))
          .filter((card) => card.question && card.answer)
      : [];
  } catch (error) {
    console.error("Gemini flashcard extraction error:", error);
    return [];
  }
};
