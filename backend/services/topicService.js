import StudyPlan from "../models/StudyPlan.js";
import TopicContent from "../models/TopicContent.js";
import Flashcard from "../models/Flashcard.js";
import { generateTopicNotes, generateTopicNotesStream, extractFlashcardsFromNotes } from "./geminiService.js";
import { getTopTopicVideos } from "./youtubeService.js";
import { syncTopicCardsForUser } from "./flashcardService.js";

export const findTopicInPlan = async (userId, topicKey) => {
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

  if (topic.completionStatus === "pending") {
    topic.completionStatus = "in_progress";
    await studyPlan.save();
  }

  const lockState = await acquireTopicLock({ topicKey, subject: studyPlan.subjectName });

  if (lockState.type === "generating") {
    return {
      status: "generating",
      data: null,
    };
  }

  let cache = lockState.cache;

  if (lockState.type === "locked") {
    // Save cache immediately WITHOUT notes or videos to unblock the frontend and let it stream
    cache = await TopicContent.findOneAndUpdate(
      { topic_key: topicKey },
      {
        subject: studyPlan.subjectName,
        video: null,
        fallback_videos: [],
        notes: "",
        flashcards: [],
        status: "ready",
      },
      { returnDocument: 'after' }
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

export const markTopicCompletedService = async (userId, topicKey, completionStatus = "completed") => {
  const plan = await StudyPlan.findOneAndUpdate(
    { userId, "topics.topic_key": topicKey },
    { $set: { "topics.$.completionStatus": completionStatus } },
    { returnDocument: 'after' }
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
    completionStatus,
    progressPercentage,
  };
};

export const streamTopicContentService = async (req, res) => {
  const { topicKey } = req.params;
  const userId = req.user._id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const topicContext = await findTopicInPlan(userId, topicKey);
    if (!topicContext) {
      sendEvent("error", { message: "Topic not found in the user's study plan" });
      res.end();
      return;
    }

    const { studyPlan, topic } = topicContext;
    
    // Check if it's already generated completely
    const cache = await TopicContent.findOne({ topic_key: topicKey });
    if (cache && cache.notes && cache.video) {
      sendEvent("video", { curatedVideos: buildCuratedVideos(cache) });
      sendEvent("chunk", { text: cache.notes });
      sendEvent("done", {});
      res.end();
      return;
    }

    // Start video fetching in background
    let rankedVideos = [];
    let videoPromise = getTopTopicVideos(topic.name, studyPlan.subjectName).then((videos) => {
      rankedVideos = videos;
      const curatedVideos = buildCuratedVideos({ video: videos[0] || null, fallback_videos: videos.slice(1, 3) });
      sendEvent("video", { curatedVideos });
    }).catch(err => {
      console.error("Video fetching failed during stream:", err);
    });

    let fullNotes = "";
    
    const stream = await generateTopicNotesStream({ subjectName: studyPlan.subjectName, topicName: topic.name });
    
    for await (const textChunk of stream) {
      fullNotes += textChunk;
      sendEvent("chunk", { text: textChunk });
    }

    await videoPromise; // Ensure video promise completed before saving

    const updatedCache = await TopicContent.findOneAndUpdate(
      { topic_key: topicKey },
      {
        subject: studyPlan.subjectName,
        video: rankedVideos[0] || null,
        fallback_videos: rankedVideos.slice(1, 3),
        notes: fullNotes,
        status: "ready",
      },
      { returnDocument: 'after' }
    );

    sendEvent("done", {});
    res.end();

    // Kick off flashcards background process
    (async () => {
      try {
        const flashcards = await extractFlashcardsFromNotes({
          subjectName: studyPlan.subjectName,
          topicName: topic.name,
          notes: fullNotes,
        });
        const finalCache = await TopicContent.findOneAndUpdate(
          { topic_key: topicKey },
          { flashcards },
          { returnDocument: 'after' }
        );
        await syncTopicCardsForUser({
          userId,
          topicKey,
          cacheFlashcards: finalCache.flashcards || [],
        });
      } catch (err) {
        console.error("Flashcard extraction failed in background after stream:", err.message);
      }
    })();
  } catch (error) {
    console.error("Streaming error:", error);
    sendEvent("error", { message: "Streaming failed" });
    res.end();
  }
};
