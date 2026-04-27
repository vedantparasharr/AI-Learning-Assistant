import StudyPlan from "../models/StudyPlan.js";
import TopicContent from "../models/TopicContent.js";
import Flashcard from "../models/Flashcard.js";
import { createEmptyCard } from "ts-fsrs";
import { generateTopicNotes } from "../utils/geminiService.js";
import { extractFlashcardsFromNotes } from "../utils/openRouterService.js";
import { getTopTopicVideos } from "../utils/videoScoring.js";
import { buildTopicMetrics } from "../utils/studyMetrics.js";
import { filterNewFlashcards, seedUserFlashcards } from "../utils/flashcardHelpers.js";

const findTopicInPlan = async (userId, topicKey) => {
  const studyPlan = await StudyPlan.findOne({
    userId,
    "topics.topic_key": topicKey,
  });

  if (!studyPlan) {
    return null;
  }

  const topic = studyPlan.topics.find((entry) => entry.topic_key === topicKey);

  if (!topic) {
    return null;
  }

  return { studyPlan, topic };
};

const acquireTopicLock = async ({ topicKey, subject }) => {
  const existingCache = await TopicContent.findOne({ topic_key: topicKey });

  if (existingCache?.status === "ready") {
    return { type: "ready", cache: existingCache };
  }

  if (existingCache?.status === "generating") {
    return { type: "generating", cache: existingCache };
  }

  if (existingCache?.status === "failed") {
    existingCache.subject = subject;
    existingCache.status = "generating";
    existingCache.video = null;
    existingCache.fallback_videos = [];
    existingCache.notes = "";
    existingCache.flashcards = [];
    await existingCache.save();
    return { type: "locked", cache: existingCache };
  }

  try {
    const cache = await TopicContent.create({
      topic_key: topicKey,
      subject,
      status: "generating",
    });

    return { type: "locked", cache };
  } catch (error) {
    if (error.code === 11000) {
      const concurrentCache = await TopicContent.findOne({ topic_key: topicKey });

      if (concurrentCache?.status === "ready") {
        return { type: "ready", cache: concurrentCache };
      }

      return { type: "generating", cache: concurrentCache };
    }

    throw error;
  }
};

const syncTopicCardsForUser = async ({ userId, topicKey, cacheFlashcards }) => {
  const existingCards = await Flashcard.find({ userId, topic_key: topicKey }).select("question answer");
  const newCards = filterNewFlashcards({
    existingCards,
    incomingCards: cacheFlashcards,
  });

  if (newCards.length === 0) {
    return Flashcard.find({ userId, topic_key: topicKey }).sort({ due: 1, createdAt: 1 });
  }

  const seededCards = seedUserFlashcards({
    userId,
    topicKey,
    cards: newCards,
    source: "topic",
    now: new Date(),
  });

  await Flashcard.insertMany(seededCards);

  return Flashcard.find({ userId, topic_key: topicKey }).sort({ due: 1, createdAt: 1 });
};

const splitNotesSections = (notesText) => {
  const source = String(notesText || "").trim();
  if (!source) {
    return [];
  }

  const blocks = source
    .split(/\n#{1,3}\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return [];
  }

  return blocks.slice(0, 6).map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const heading = lines[0] || `Concept ${index + 1}`;
    const bullets = lines.filter((line) => /^[-*]\s+/.test(line)).map((line) => line.replace(/^[-*]\s+/, "").trim());
    const body = lines
      .filter((line, lineIndex) => lineIndex > 0 && !/^[-*]\s+/.test(line))
      .join(" ")
      .trim();

    return {
      heading,
      body,
      bullets,
    };
  });
};

const buildCuratedVideos = (content) => {
  const candidates = [content?.video, ...(content?.fallback_videos || [])].filter(Boolean);
  return candidates.slice(0, 3).map((video, index) => ({
    rank: index + 1,
    title: video.title || "Recommended explanation",
    url: video.url || "",
    thumbnail: video.thumbnail || "",
    duration: video.duration || "",
    authorName: video.authorName || "",
    views: Number(video.views) || 0,
    score: Number(video.score) || 0,
  }));
};

const buildTopicOverview = ({ topic, studyPlan, content }) => {
  const raw = String(content?.notes || "").replace(/[#*_`>-]/g, " ").replace(/\s+/g, " ").trim();
  if (raw) {
    return raw.slice(0, 280);
  }

  return `${topic.name} in ${studyPlan.subjectName}: key ideas, memory models, and applied practice points.`;
};

const buildTopicPayload = ({ studyPlan, topic, flashcards, content }) => {
  const { topics: metrics } = buildTopicMetrics({
    plan: studyPlan,
    flashcards,
  });
  const topicMetric = metrics.find((entry) => entry.topic_key === topic.topic_key) || null;

  const totalCards = flashcards.length;
  const masteredCards = flashcards.filter((card) => card.state === 2 && card.lapses === 0).length;
  const retentionRate = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  const notesSections = splitNotesSections(content?.notes || "");
  const curatedVideos = buildCuratedVideos(content || {});
  const completionStatus = topic.completionStatus || "pending";
  const masteryStatus = completionStatus === "completed"
    ? "completed"
    : (retentionRate > 0 ? "in_progress" : "not_started");

  return {
    topic: {
      topic_key: topic.topic_key,
      name: topic.name,
      subjectName: studyPlan.subjectName,
      examDate: studyPlan.examDate,
      dueCount: topicMetric?.dueCount || 0,
      totalCards,
      studyPlanId: studyPlan._id,
      completionStatus,
      overview: buildTopicOverview({ topic, studyPlan, content }),
    },
    content,
    notesSections,
    curatedVideos,
    mastery: {
      status: masteryStatus,
      retentionRate,
      masteredCards,
      totalCards,
    },
    cards: flashcards,
  };
};

export const generateTopicContent = async (req, res, next) => {
  try {
    const { topicKey } = req.params;
    const topicContext = await findTopicInPlan(req.user._id, topicKey);

    if (!topicContext) {
      return res.status(404).json({
        success: false,
        error: "Topic not found in the user's study plan",
        statusCode: 404,
      });
    }

    const { studyPlan, topic } = topicContext;
    const lockState = await acquireTopicLock({
      topicKey,
      subject: studyPlan.subjectName,
    });

    if (lockState.type === "ready") {
      const syncedCards = await syncTopicCardsForUser({
        userId: req.user._id,
        topicKey,
        cacheFlashcards: lockState.cache.flashcards || [],
      });

      return res.status(200).json({
        success: true,
        data: buildTopicPayload({
          studyPlan,
          topic,
          flashcards: syncedCards,
          content: lockState.cache,
        }),
        message: "Topic content retrieved from cache",
        statusCode: 200,
      });
    }

    if (lockState.type === "generating") {
      const flashcards = await Flashcard.find({ userId: req.user._id, topic_key: topicKey }).sort({ due: 1, createdAt: 1 });
      return res.status(202).json({
        success: true,
        data: buildTopicPayload({
          studyPlan,
          topic,
          flashcards,
          content: lockState.cache,
        }),
        message: "Topic content is still generating. Please retry shortly.",
        statusCode: 202,
      });
    }

    const [videoResult, notesResult] = await Promise.allSettled([
      getTopTopicVideos(topic.name, studyPlan.subjectName),
      generateTopicNotes({
        subjectName: studyPlan.subjectName,
        topicName: topic.name,
      }),
    ]);

    if (notesResult.status !== "fulfilled") {
      await TopicContent.findOneAndUpdate(
        { topic_key: topicKey },
        { $set: { status: "failed" } },
      );

      return res.status(500).json({
        success: false,
        error: "Failed to generate topic notes",
        statusCode: 500,
      });
    }

    const rankedVideos = videoResult.status === "fulfilled" ? videoResult.value : [];
    const notes = notesResult.value;

    let flashcards = [];

    try {
      flashcards = await extractFlashcardsFromNotes({
        subjectName: studyPlan.subjectName,
        topicName: topic.name,
        notes,
      });
    } catch (error) {
      console.error("OpenRouter flashcard extraction failed:", error.message);
    }

    const updatedCache = await TopicContent.findOneAndUpdate(
      { topic_key: topicKey },
      {
        $set: {
          subject: studyPlan.subjectName,
          video: rankedVideos[0] || null,
          fallback_videos: rankedVideos.slice(1, 3),
          notes,
          flashcards,
          status: "ready",
        },
      },
      { new: true },
    );

    const syncedCards = await syncTopicCardsForUser({
      userId: req.user._id,
      topicKey,
      cacheFlashcards: updatedCache.flashcards || [],
    });

    return res.status(200).json({
      success: true,
      data: buildTopicPayload({
        studyPlan,
        topic,
        flashcards: syncedCards,
        content: updatedCache,
      }),
      message: "Topic content generated successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const markTopicCompleted = async (req, res, next) => {
  try {
    const { topicKey } = req.params;

    const plan = await StudyPlan.findOne({
      userId: req.user._id,
      "topics.topic_key": topicKey,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Topic not found in the user's study plan",
        statusCode: 404,
      });
    }

    await StudyPlan.updateOne(
      {
        _id: plan._id,
        userId: req.user._id,
        "topics.topic_key": topicKey,
      },
      {
        $set: {
          "topics.$.completionStatus": "completed",
        },
      },
    );

    const refreshedPlan = await StudyPlan.findOne({
      _id: plan._id,
      userId: req.user._id,
    });

    const topicCount = (refreshedPlan?.topics || []).length;
    const completedTopicCount = (refreshedPlan?.topics || [])
      .filter((topic) => topic.completionStatus === "completed")
      .length;
    const progressPercentage = topicCount > 0
      ? Math.round((completedTopicCount / topicCount) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        topic_key: topicKey,
        completionStatus: "completed",
        planId: refreshedPlan?._id || plan._id,
        topicCount,
        completedTopicCount,
        progressPercentage,
      },
      message: "Topic marked as completed",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

