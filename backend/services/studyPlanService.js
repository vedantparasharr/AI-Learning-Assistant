import crypto from "crypto";
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
  const plans = await StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 });

  return plans.map((plan) => {
    const topics = Array.isArray(plan.topics) ? plan.topics : [];
    const completedTopics = topics.filter((topic) => topic.completionStatus === "completed").length;

    let progress = 0;
    if (typeof plan.progressPercentage === "number") {
      progress = Math.round(plan.progressPercentage);
    } else if (topics.length > 0) {
      progress = Math.round((completedTopics / topics.length) * 100);
    }
    progress = Math.max(0, Math.min(100, progress));

    return {
      planId: String(plan._id),
      planName: plan.subjectName,
      sourceLabel: plan.sourceType === "text" ? "Notes" : plan.sourceType.charAt(0).toUpperCase() + plan.sourceType.slice(1),
      topicCount: topics.length,
      completedTopics,
      progress,
      examDate: plan.examDate,
      updatedAt: plan.updatedAt,
      topicNames: topics.map((t) => t.name),
    };
  });
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

// Generate (or return existing) share link for a plan the user owns
export const shareStudyPlanService = async (userId, planId) => {
  const plan = await StudyPlan.findOne({ _id: planId, userId });
  if (!plan) {
    const error = new Error("Study plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (!plan.shareSlug) {
    plan.shareSlug = crypto.randomBytes(8).toString("hex"); // 16-char hex slug
  }
  plan.isShared = true;
  await plan.save();

  return plan.shareSlug;
};

// Fetch a publicly shared plan by its slug (no auth required)
export const getSharedStudyPlanService = async (shareSlug) => {
  const plan = await StudyPlan.findOne({ shareSlug, isShared: true }).select(
    "-userId -sourceText"
  );
  if (!plan) {
    const error = new Error("Shared plan not found");
    error.statusCode = 404;
    throw error;
  }
  return plan;
};

// Clone a shared plan into the requesting user's account
export const cloneSharedStudyPlanService = async (userId, shareSlug) => {
  const source = await StudyPlan.findOne({ shareSlug, isShared: true });
  if (!source) {
    const error = new Error("Shared plan not found");
    error.statusCode = 404;
    throw error;
  }

  const clonedTopics = source.topics.map((t) => ({
    topic_key: t.topic_key,
    name: t.name,
    estimated_hours: t.estimated_hours,
    completionStatus: "pending",
  }));

  const newPlan = await StudyPlan.create({
    userId,
    subjectName: source.subjectName,
    examDate: source.examDate,
    sourceType: source.sourceType,
    sourceText: "",
    topics: clonedTopics,
  });

  return newPlan;
};
