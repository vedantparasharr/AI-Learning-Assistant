import StudyPlan from "../models/StudyPlan.js";
import TopicContent from "../models/TopicContent.js";
import Flashcard from "../models/Flashcard.js";
import { generateTopicNotes, extractFlashcardsFromNotes } from "./geminiService.js";
import { getTopTopicVideos } from "./youtubeService.js";
import { filterNewFlashcards, seedUserFlashcards } from "./flashcardService.js";

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

  if (existingCache) {
    if (existingCache.status === "ready" || existingCache.status === "generating") {
      return { type: existingCache.status, cache: existingCache };
    }

    Object.assign(existingCache, {
      subject,
      status: "generating",
      video: null,
      fallback_videos: [],
      notes: "",
      flashcards: [],
    });
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
      return { type: concurrentCache?.status || "generating", cache: concurrentCache };
    }
    throw error;
  }
};

const syncTopicCardsForUser = async ({ userId, topicKey, cacheFlashcards }) => {
  const cards = await Flashcard.find({ userId, topic_key: topicKey }).sort({ due: 1, createdAt: 1 });
  const newCards = filterNewFlashcards({
    existingCards: cards,
    incomingCards: cacheFlashcards,
  });

  if (newCards.length === 0) {
    return cards;
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

const buildCuratedVideos = (content) => {
  const candidates = [content?.video, ...(content?.fallback_videos || [])].filter(Boolean);
  return candidates.slice(0, 3).map((video) =>
    video.videoId
      ? `https://www.youtube.com/embed/${video.videoId}`
      : video.url || ""
  );
};

export const getOrGenerateTopicContentService = async (userId, topicKey) => {
  const topicContext = await findTopicInPlan(userId, topicKey);
  if (!topicContext) {
    const error = new Error("Topic not found in the user's study plan");
    error.statusCode = 404;
    throw error;
  }

  const { studyPlan, topic } = topicContext;
  const lockState = await acquireTopicLock({ topicKey, subject: studyPlan.subjectName });

  if (lockState.type === "generating") {
    return {
      status: "generating",
      data: null,
    };
  }

  let cache = lockState.cache;

  if (lockState.type === "locked") {
    const [videoResult, notesResult] = await Promise.allSettled([
      getTopTopicVideos(topic.name, studyPlan.subjectName),
      generateTopicNotes({ subjectName: studyPlan.subjectName, topicName: topic.name }),
    ]);

    if (notesResult.status !== "fulfilled") {
      await TopicContent.updateOne({ topic_key: topicKey }, { status: "failed" });
      const error = new Error("Failed to generate topic notes");
      error.statusCode = 500;
      throw error;
    }

    const rankedVideos = videoResult.status === "fulfilled" ? videoResult.value : [];
    let flashcards = [];
    try {
      flashcards = await extractFlashcardsFromNotes({
        subjectName: studyPlan.subjectName,
        topicName: topic.name,
        notes: notesResult.value,
      });
    } catch (err) {
      console.error("Flashcard extraction failed:", err.message);
    }

    cache = await TopicContent.findOneAndUpdate(
      { topic_key: topicKey },
      {
        subject: studyPlan.subjectName,
        video: rankedVideos[0] || null,
        fallback_videos: rankedVideos.slice(1, 3),
        notes: notesResult.value,
        flashcards,
        status: "ready",
      },
      { new: true }
    );
  }

  const syncedCards = await syncTopicCardsForUser({
    userId,
    topicKey,
    cacheFlashcards: cache.flashcards || [],
  });

  const totalCards = syncedCards.length;
  const now = new Date();
  const dueCount = syncedCards.filter((c) => c.status === "active" && new Date(c.due) <= now).length;
  const curatedVideos = buildCuratedVideos(cache || {});
  const completionStatus = topic.completionStatus || "pending";

  return {
    status: "ready",
    data: {
      topic: {
        topic_key: topic.topic_key,
        name: topic.name,
        subjectName: studyPlan.subjectName,
        examDate: studyPlan.examDate,
        dueCount,
        totalCards,
        studyPlanId: studyPlan._id,
        completionStatus,
      },
      content: cache,
      notesSections: [],
      curatedVideos,
      cards: syncedCards,
    },
  };
};

export const markTopicCompletedService = async (userId, topicKey) => {
  const plan = await StudyPlan.findOneAndUpdate(
    { userId, "topics.topic_key": topicKey },
    { $set: { "topics.$.completionStatus": "completed" } },
    { new: true }
  );

  if (!plan) {
    const error = new Error("Topic not found in the user's study plan");
    error.statusCode = 404;
    throw error;
  }

  const completed = plan.topics.filter((t) => t.completionStatus === "completed").length;
  const progressPercentage = plan.topics.length > 0 ? Math.round((completed / plan.topics.length) * 100) : 0;

  return {
    topic_key: topicKey,
    completionStatus: "completed",
    progressPercentage,
  };
};
