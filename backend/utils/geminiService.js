import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { parseJsonResponse } from "./parseJsonResponse.js";
import { buildStarterFlashcardsFallback } from "./flashcardHelpers.js";

dotenv.config();

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

const weaknessSupportSchema = {
  type: "object",
  properties: {
    simpler_explanation: { type: "string" },
    easier_flashcards: {
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
  required: ["simpler_explanation", "easier_flashcards"],
};

export const parseSyllabusTopics = async (text) => {
  const prompt = `You are extracting a syllabus into study topics for an exam planner.

Return ONLY a flat JSON array. Do not include markdown, commentary, or code fences.

Each array item must contain:
- "name": the topic name
- "estimated_hours": a realistic number of study hours for that topic

Rules:
- Preserve the original syllabus wording as much as possible.
- Do not invent topics that are not supported by the syllabus text.
- Merge obvious duplicates.
- Keep the array flat. No nesting, modules, units, or metadata outside the array.
- estimated_hours must be a positive number.

Syllabus text:
${text.substring(0, 25000)}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(syllabusTopicSchema),
    });

    const topics = parseJsonResponse(response.text);

    return Array.isArray(topics)
      ? topics
          .map((topic) => ({
            name: String(topic?.name || "").trim(),
            estimated_hours:
              Number(topic?.estimated_hours) > 0
                ? Number(topic.estimated_hours)
                : 1,
          }))
          .filter((topic) => topic.name)
      : [];
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to parse syllabus topics");
  }
};

export const generateRoadmapTopicsFromPrompt = async ({ prompt, subjectName = "" }) => {
  const roadmapPrompt = `You are designing a practical study roadmap.

Return ONLY a flat JSON array. Do not include markdown, commentary, or code fences.

Each array item must contain:
- "name": the topic name
- "estimated_hours": a realistic number of study hours for that topic

Rules:
- Build a progressive roadmap from fundamentals to advanced topics.
- Keep topic names concise and actionable.
- Avoid duplicates and near-duplicates.
- Prefer 8 to 18 topics based on scope.
- estimated_hours must be a positive number.

Learner goal:
${prompt.substring(0, 4000)}

Subject hint (if available):
${String(subjectName || "").trim() || "Not provided"}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: roadmapPrompt,
      config: jsonConfig(syllabusTopicSchema),
    });

    const topics = parseJsonResponse(response.text);

    return Array.isArray(topics)
      ? topics
          .map((topic) => ({
            name: String(topic?.name || "").trim(),
            estimated_hours:
              Number(topic?.estimated_hours) > 0
                ? Number(topic.estimated_hours)
                : 1,
          }))
          .filter((topic) => topic.name)
      : [];
  } catch (error) {
    console.error("Gemini roadmap generation error:", error);
    throw new Error("Failed to generate roadmap topics");
  }
};

export const generateStarterFlashcardsForTopics = async ({ subjectName, topics }) => {
  const prompt = `Create exactly 2 starter flashcards for each study topic below.

Subject: ${subjectName}
Topics:
${topics.map((topic, index) => `${index + 1}. ${topic.name}`).join("\n")}

Return only JSON. Each topic should have short, exam-useful flashcards. Avoid duplicate wording across topics.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(starterDeckSchema),
    });

    const parsed = parseJsonResponse(response.text);

    if (!Array.isArray(parsed)) {
      return topics.map((topic) => ({
        name: topic.name,
        flashcards: buildStarterFlashcardsFallback(subjectName, topic.name),
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
        flashcards: flashcards.length > 0
          ? flashcards
          : buildStarterFlashcardsFallback(subjectName, topic.name),
      };
    });
  } catch (error) {
    console.error("Gemini starter flashcards error:", error);
    return topics.map((topic) => ({
      name: topic.name,
      flashcards: buildStarterFlashcardsFallback(subjectName, topic.name),
    }));
  }
};

export const generateTopicNotes = async ({ subjectName, topicName }) => {
  const prompt = `Create exam-oriented Markdown notes for the topic "${topicName}" in the subject "${subjectName}".

Write for a student preparing under a deadline.

Required structure:
- ## Topic Overview
- ## Core Concepts
- ## Important Formulas / Facts (only if relevant)
- ## Common Exam Pitfalls
- ## Quick Revision Checklist

Rules:
- Stay focused on this topic only.
- Keep explanations clear, accurate, and concise.
- Prefer bullet points and short examples over long paragraphs.
- Use Markdown only.
- Do not mention that you are an AI.
- Do not wrap the answer in code fences.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate topic notes");
  }
};

export const generateWeaknessSupport = async ({ subjectName, topicName, question, answer }) => {
  const prompt = `A student is struggling with this topic.

Subject: ${subjectName}
Topic: ${topicName}
Card they missed:
Question: ${question}
Answer: ${answer}

Return only JSON with:
- simpler_explanation: a much easier explanation in plain language
- easier_flashcards: exactly 2 easier flashcards for rebuilding confidence

Keep everything concise, clear, and exam-oriented.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: jsonConfig(weaknessSupportSchema),
    });

    const parsed = parseJsonResponse(response.text);

    return {
      simpler_explanation: String(parsed?.simpler_explanation || "").trim(),
      easier_flashcards: Array.isArray(parsed?.easier_flashcards)
        ? parsed.easier_flashcards
            .map((card) => ({
              question: String(card?.question || "").trim(),
              answer: String(card?.answer || "").trim(),
            }))
            .filter((card) => card.question && card.answer)
            .slice(0, 2)
        : [],
    };
  } catch (error) {
    console.error("Gemini weakness support error:", error);
    return {
      simpler_explanation: `${topicName} becomes easier if you first focus on the basic idea, one small example, and the most common exam trap before attempting harder questions.`,
      easier_flashcards: [
        {
          question: `What is the simplest way to describe ${topicName}?`,
          answer: `${topicName} is easiest to learn by understanding its main goal, its simplest example, and when to use it.`,
        },
        {
          question: `What should you remember first about ${topicName}?`,
          answer: `Remember the core definition, one worked example, and the most common mistake students make.`,
        },
      ],
    };
  }
};

