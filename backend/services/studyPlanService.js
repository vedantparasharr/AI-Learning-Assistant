import StudyPlan from "../models/StudyPlan.js";
import Flashcard from "../models/Flashcard.js";
import { extractTextFromPDF } from "./pdfService.js";
import {
  generateRoadmapTopicsFromPrompt,
  generateStarterFlashcardsForTopics,
  parseSyllabusTopics,
} from "./geminiService.js";
import { buildTopicKey } from "../utils/topicKey.js";
import { seedUserFlashcards } from "./flashcardService.js";

const sanitizeTopics = (topics) =>
  (Array.isArray(topics) ? topics : [])
    .map((topic) => ({
      name: String(topic?.name || "").trim(),
      estimated_hours:
        Number(topic?.estimated_hours) > 0
          ? Number(topic.estimated_hours)
          : 1,
    }))
    .filter((topic) => topic.name);

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

const buildSubjectTag = (subjectName) => {
  const clean = String(subjectName || "").trim();
  if (!clean) {
    return "General";
  }
  const [firstWord] = clean.split(/\s+/);
  return firstWord || clean;
};

const buildPlanSnippet = (plan) => {
  const source = String(plan?.sourceText || "").replace(/\s+/g, " ").trim();
  if (source.length > 0) {
    return source.slice(0, 140);
  }

  const topicNames = (plan?.topics || [])
    .map((topic) => String(topic?.name || "").trim())
    .filter(Boolean)
    .slice(0, 3);

  if (topicNames.length > 0) {
    return topicNames.join(", ");
  }

  return "Compile a new curriculum and start learning.";
};

const buildOverviewDescription = (plan) => {
  const source = String(plan?.sourceText || "").replace(/\s+/g, " ").trim();
  if (source.length > 0) {
    return source.slice(0, 260);
  }

  return `An in-depth learning path for ${plan.subjectName}, focusing on key modules, active recall, and spaced repetition.`;
};

export const getStudyPlansList = async (userId) => {
  const plans = await StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 });

  const topicKeys = plans.flatMap((plan) => (plan.topics || []).map((topic) => topic.topic_key));
  const flashcards = topicKeys.length > 0
    ? await Flashcard.find({
        userId,
        status: "active",
        topic_key: { $in: topicKeys },
      }).select("topic_key reps due")
    : [];

  return plans.map((plan) => {
    const topicCount = (plan.topics || []).length;
    const completedTopicCount = (plan.topics || []).filter(
      (t) => t.completionStatus === "completed",
    ).length;

    // Progress is simply completed topics divided by total topics
    const progressPercentage = topicCount > 0
      ? Math.round((completedTopicCount / topicCount) * 100)
      : 0;

    // Filter cards belonging to this study plan's topics
    const planTopicKeys = new Set((plan.topics || []).map((t) => t.topic_key));
    const planCards = flashcards.filter((c) => planTopicKeys.has(c.topic_key));

    const cardCount = planCards.length;
    const dueCount = planCards.filter((c) => new Date(c.due) <= new Date()).length;

    return {
      id: plan._id,
      subjectName: plan.subjectName,
      examDate: plan.examDate,
      sourceType: plan.sourceType,
      sourceText: plan.sourceText,
      subjectTag: buildSubjectTag(plan.subjectName),
      snippet: buildPlanSnippet(plan),
      topicCount,
      cardCount,
      dueCount,
      completedTopicCount,
      progressPercentage,
      topics: plan.topics,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
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

  const flashcards = await Flashcard.find({
    userId,
    topic_key: { $in: plan.topics.map((t) => t.topic_key) },
  });

  const now = new Date();

  // Map card stats per topic directly
  const topicOverview = plan.topics.map((topic, index) => {
    const topicCards = flashcards.filter((c) => c.topic_key === topic.topic_key);

    const totalCards = topicCards.length;
    const dueCount = topicCards.filter(
      (c) => c.status === "active" && new Date(c.due) <= now,
    ).length;
    const reviewedCount = topicCards.filter((c) => c.reps > 0).length;

    const completionStatus = topic.completionStatus || "pending";
    const isCompleted = completionStatus === "completed";
    const hasActivity = reviewedCount > 0;
    const stage = isCompleted ? "completed" : (hasActivity ? "in_progress" : "not_started");

    return {
      topic_key: topic.topic_key,
      name: topic.name,
      estimated_hours: topic.estimated_hours || 1,
      completionStatus,
      totalCards,
      dueCount,
      reviewedCount,
      moduleNumber: index + 1,
      lessonCount: Math.max(1, totalCards),
      lessonsCompleted: isCompleted ? totalCards : reviewedCount,
      stage,
    };
  });

  const topicCount = plan.topics.length;
  const completedTopicCount = plan.topics.filter(
    (t) => t.completionStatus === "completed",
  ).length;
  const progressPercentage = topicCount > 0
    ? Math.round((completedTopicCount / topicCount) * 100)
    : 0;

  const dueTopicCount = topicOverview.filter((t) => t.dueCount > 0).length;

  const totalEstimatedHours = plan.topics.reduce((sum, t) => sum + (t.estimated_hours || 1), 0);
  const remainingHours = plan.topics
    .filter((t) => t.completionStatus !== "completed")
    .reduce((sum, t) => sum + (t.estimated_hours || 1), 0);

  const nextTopic = topicOverview.find((t) => t.completionStatus !== "completed") || null;

  return {
    id: plan._id,
    subjectName: plan.subjectName,
    description: buildOverviewDescription(plan),
    examDate: plan.examDate,
    sourceType: plan.sourceType,
    dueTopicCount,
    topicCount,
    completedTopicCount,
    progressPercentage,
    totalEstimatedHours,
    remainingEstimatedHours: remainingHours,
    nextTopicKey: nextTopic?.topic_key || null,
    topics: topicOverview,
    generatedAt: now,
  };
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
