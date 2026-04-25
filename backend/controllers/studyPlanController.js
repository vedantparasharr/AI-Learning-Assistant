import StudyPlan from "../models/StudyPlan.js";
import Flashcard from "../models/Flashcard.js";
import TopicContent from "../models/TopicContent.js";
import crypto from "crypto";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import {
  generateRoadmapTopicsFromPrompt,
  generateStarterFlashcardsForTopics,
  parseSyllabusTopics,
} from "../utils/geminiService.js";
import { buildTopicKey } from "../utils/topicKey.js";
import { buildTopicMetrics } from "../utils/studyMetrics.js";
import { seedUserFlashcards } from "../utils/flashcardHelpers.js";

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

const getPlanById = (userId, planId) =>
  StudyPlan.findOne({
    _id: planId,
    userId,
  });

const PUBLIC_BASE_URL = process.env.APP_URL || "https://distilllearn.com";

const buildShareUrl = (shareSlug) => `${PUBLIC_BASE_URL.replace(/\/$/, "")}/shared/${shareSlug}`;

const generateShareSlug = () => crypto.randomBytes(6).toString("base64url").toLowerCase();

const getPublicPlanBySlug = (shareSlug) =>
  StudyPlan.findOne({
    shareSlug,
    isPublic: true,
  });



export const parseStudyPlan = async (req, res, next) => {
  try {
    const sourceMode = String(req.body?.sourceMode || "").trim().toLowerCase();
    const outlineText = String(req.body?.outlineText || req.body?.syllabusText || "").trim();
    const learningPrompt = String(req.body?.learningPrompt || "").trim();
    const subjectName = String(req.body?.subjectName || "").trim();

    let sourceText = "";
    let sourceType = "manual";

    if (req.file || sourceMode === "document") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Upload a PDF file to generate topics from document mode",
          statusCode: 400,
        });
      }

      const { text } = await extractTextFromPDF(req.file.buffer);
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
      return res.status(400).json({
        success: false,
        error: "Provide notes text, a learning prompt, or a PDF document",
        statusCode: 400,
      });
    }

    const topics = sourceType === "prompt"
      ? await generateRoadmapTopicsFromPrompt({ prompt: sourceText, subjectName })
      : await parseSyllabusTopics(sourceText);

    return res.status(200).json({
      success: true,
      data: {
        topics,
        sourceText,
        sourceType,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudyPlan = async (req, res, next) => {
  try {
    const {
      subjectName,
      examDate,
      topics,
      sourceText = "",
      sourceType = "manual",
    } = req.body;

    if (!subjectName || !String(subjectName).trim()) {
      return res.status(400).json({
        success: false,
        error: "subjectName is required",
        statusCode: 400,
      });
    }

    let parsedExamDate;
    if (examDate) {
      parsedExamDate = new Date(examDate);
      if (Number.isNaN(parsedExamDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "examDate must be a valid date when provided",
          statusCode: 400,
        });
      }
    } else {
      parsedExamDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }

    const sanitizedTopics = sanitizeTopics(topics);
    if (sanitizedTopics.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one finalized topic is required",
        statusCode: 400,
      });
    }

    const planTopics = buildPlanTopics(sanitizedTopics, subjectName);

    const studyPlan = await StudyPlan.create({
      userId: req.user._id,
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
        userId: req.user._id,
        topicKey: topic.topic_key,
        cards: deck.flashcards,
        source: "starter",
      });
    });

    if (starterCards.length > 0) {
      await Flashcard.insertMany(starterCards);
    }

    return res.status(201).json({
      success: true,
      data: {
        studyPlan,
        starterCardCount: starterCards.length,
      },
      message: "Study plan created successfully",
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user._id }).sort({ examDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: plans,
      count: plans.length,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudyPlanOverview = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const plan = await getPlanById(req.user._id, planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Study plan not found",
        statusCode: 404,
      });
    }

    const flashcards = await Flashcard.find({
      userId: req.user._id,
      topic_key: { $in: plan.topics.map((topic) => topic.topic_key) },
    }).sort({ due: 1, createdAt: 1 });

    const { topics: topicMetrics, dueTopicCount } = buildTopicMetrics({
      plan,
      flashcards,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: plan._id,
        subjectName: plan.subjectName,
        examDate: plan.examDate,
        sourceType: plan.sourceType,
        dueTopicCount,
        topics: topicMetrics,
        isPublic: Boolean(plan.isPublic),
        shareSlug: plan.shareSlug || null,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};



export const shareStudyPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const plan = await getPlanById(req.user._id, planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Study plan not found",
        statusCode: 404,
      });
    }

    if (!plan.shareSlug) {
      let createdSlug = "";
      let attempts = 0;

      while (!createdSlug && attempts < 7) {
        const candidate = generateShareSlug();
        const exists = await StudyPlan.exists({ shareSlug: candidate });
        if (!exists) {
          createdSlug = candidate;
        }
        attempts += 1;
      }

      if (!createdSlug) {
        return res.status(500).json({
          success: false,
          error: "Could not generate a share link. Please retry.",
          statusCode: 500,
        });
      }

      plan.shareSlug = createdSlug;
    }

    plan.isPublic = true;
    await plan.save();

    return res.status(200).json({
      success: true,
      data: {
        shareSlug: plan.shareSlug,
        shareUrl: buildShareUrl(plan.shareSlug),
      },
      message: "Study plan is now shareable",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedStudyPlan = async (req, res, next) => {
  try {
    const shareSlug = String(req.params?.shareSlug || "").trim().toLowerCase();
    if (!shareSlug) {
      return res.status(400).json({
        success: false,
        error: "shareSlug is required",
        statusCode: 400,
      });
    }

    const plan = await getPublicPlanBySlug(shareSlug);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Shared study plan not found",
        statusCode: 404,
      });
    }

    const flashcards = await Flashcard.find({
      userId: plan.userId,
      topic_key: { $in: plan.topics.map((topic) => topic.topic_key) },
      status: "active",
    });

    const { topics: topicMetrics } = buildTopicMetrics({
      plan,
      flashcards,
      now: new Date(),
    });

    const publicTopics = topicMetrics.map((topic) => ({
      topic_key: topic.topic_key,
      name: topic.name,
      estimated_hours: topic.estimated_hours,
    }));

    return res.status(200).json({
      success: true,
      data: {
        subjectName: plan.subjectName,
        examDate: plan.examDate,
        sourceType: plan.sourceType,
        shareSlug: plan.shareSlug,
        topics: publicTopics,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const cloneSharedStudyPlan = async (req, res, next) => {
  try {
    const shareSlug = String(req.params?.shareSlug || "").trim().toLowerCase();
    if (!shareSlug) {
      return res.status(400).json({
        success: false,
        error: "shareSlug is required",
        statusCode: 400,
      });
    }

    const sourcePlan = await getPublicPlanBySlug(shareSlug);

    if (!sourcePlan) {
      return res.status(404).json({
        success: false,
        error: "Shared study plan not found",
        statusCode: 404,
      });
    }

    const baseTopics = sanitizeTopics(sourcePlan.topics || []);
    if (baseTopics.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Shared plan has no topics to clone",
        statusCode: 400,
      });
    }

    const clonedTopics = buildPlanTopics(baseTopics, sourcePlan.subjectName);

    const clonedPlan = await StudyPlan.create({
      userId: req.user._id,
      subjectName: sourcePlan.subjectName,
      examDate: sourcePlan.examDate,
      sourceType: "manual",
      sourceText: `Cloned from shared plan ${shareSlug}`,
      topics: clonedTopics,
      isPublic: false,
      shareSlug: null,
    });

    const starterDecks = await generateStarterFlashcardsForTopics({
      subjectName: clonedPlan.subjectName,
      topics: clonedTopics,
    });

    const starterCards = starterDecks.flatMap((deck) => {
      const topic = clonedTopics.find(
        (entry) => entry.name.trim().toLowerCase() === deck.name.trim().toLowerCase(),
      );

      if (!topic) {
        return [];
      }

      return seedUserFlashcards({
        userId: req.user._id,
        topicKey: topic.topic_key,
        cards: deck.flashcards,
        source: "starter",
      });
    });

    if (starterCards.length > 0) {
      await Flashcard.insertMany(starterCards);
    }

    return res.status(201).json({
      success: true,
      data: {
        studyPlan: clonedPlan,
        starterCardCount: starterCards.length,
      },
      message: "Shared study plan cloned successfully",
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};
