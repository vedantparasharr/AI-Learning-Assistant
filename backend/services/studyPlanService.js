import StudyPlan from "../models/StudyPlan.js";
import Flashcard from "../models/Flashcard.js";
import { extractTextFromPDF } from "./pdfService.js";
import {
  generateRoadmapTopicsFromPrompt,
  generateStarterFlashcardsForTopics,
  parseSyllabusTopics,
} from "./geminiService.js";
import { buildTopicKey, sanitizeTopics } from "../utils/topicKey.js";
import { seedUserFlashcards } from "./flashcardService.js";

const buildPlanTopics = (topics, subjectName) => {
  const usedKeys = new Set();

  return topics.map((topic) => {
    let suffix = 0;
    let topicKey = buildTopicKey(subjectName, topic.name);

    while (usedKeys.has(topicKey)) {
      suffix += 1;
      topicKey = buildTopicKey(subjectName, topic.name, suffix);
    }

    usedKeys.add(topicKey);

    return {
      topic_key: topicKey,
      name: topic.name,
      estimated_hours: topic.estimated_hours,
      completionStatus: "pending",
    };
  });
};

export const getStudyPlansList = async (userId) => {
  return StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 });
};

export const getStudyPlanOverviewService = async (userId, planId) => {
  const plan = await StudyPlan.findOne({ _id: planId, userId });
  if (!plan) {
    const error = new Error("Study plan not found");
    error.statusCode = 404;
    throw error;
  }
  return plan;
};

export const parseStudyPlanService = async ({ file, sourceMode, outlineText, learningPrompt, subjectName }) => {
  let sourceText = "";
  let sourceType = "manual";

  if (file || sourceMode === "document") {
    if (!file) {
      const error = new Error("Upload a PDF file to generate topics from document mode");
      error.statusCode = 400;
      throw error;
    }
    const { text } = await extractTextFromPDF(file.buffer);
    sourceText = text;
    sourceType = "document";
  } else if (sourceMode === "prompt") {
    sourceText = learningPrompt;
    sourceType = "prompt";
  } else {
    sourceText = outlineText;
    sourceType = "text";
  }

  if (!sourceText || !sourceText.trim()) {
    const error = new Error("Provide notes text, a learning prompt, or a PDF document");
    error.statusCode = 400;
    throw error;
  }

  const topics = sourceType === "prompt"
    ? await generateRoadmapTopicsFromPrompt({ prompt: sourceText, subjectName })
    : await parseSyllabusTopics(sourceText);

  return {
    topics,
    sourceText,
    sourceType,
  };
};

export const createStudyPlanService = async (userId, { subjectName, examDate, topics, sourceText = "", sourceType = "manual" }) => {
  let parsedExamDate;
  if (examDate) {
    parsedExamDate = new Date(examDate);
    if (Number.isNaN(parsedExamDate.getTime())) {
      const error = new Error("examDate must be a valid date when provided");
      error.statusCode = 400;
      throw error;
    }
  } else {
    parsedExamDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  }

  const sanitizedTopics = sanitizeTopics(topics);
  if (sanitizedTopics.length === 0) {
    const error = new Error("At least one finalized topic is required");
    error.statusCode = 400;
    throw error;
  }

  const planTopics = buildPlanTopics(sanitizedTopics, subjectName);

  const studyPlan = await StudyPlan.create({
    userId,
    subjectName: String(subjectName).trim(),
    examDate: parsedExamDate,
    sourceText: String(sourceText || "").trim(),
    sourceType: ["text", "document", "manual", "prompt"].includes(sourceType) ? sourceType : "manual",
    topics: planTopics,
  });

  const starterDecks = await generateStarterFlashcardsForTopics({
    subjectName: studyPlan.subjectName,
    topics: planTopics,
  });

  const starterCards = starterDecks.flatMap((deck) => {
    const topic = planTopics.find(
      (entry) => entry.name.trim().toLowerCase() === deck.name.trim().toLowerCase(),
    );

    if (!topic) {
      return [];
    }

    return seedUserFlashcards({
      userId,
      topicKey: topic.topic_key,
      cards: deck.flashcards,
      source: "starter",
    });
  });

  if (starterCards.length > 0) {
    await Flashcard.insertMany(starterCards);
  }

  return {
    studyPlan,
    starterCardCount: starterCards.length,
  };
};

export const deleteStudyPlanService = async (userId, planId) => {
  const plan = await StudyPlan.findOne({ _id: planId, userId });
  if (!plan) {
    const error = new Error("Study plan not found");
    error.statusCode = 404;
    throw error;
  }

  const topicKeys = (plan.topics || []).map((topic) => topic.topic_key);

  await Promise.all([
    Flashcard.deleteMany({
      userId,
      topic_key: { $in: topicKeys },
    }),
    StudyPlan.deleteOne({ _id: planId, userId }),
  ]);

  return String(planId);
};
