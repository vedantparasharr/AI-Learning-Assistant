import Flashcard from "../models/Flashcard.js";
import StudyPlan from "../models/StudyPlan.js";
import TopicContent from "../models/TopicContent.js";
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import { buildDashboardSummary } from "../utils/studyMetrics.js";
import { filterNewFlashcards, seedUserFlashcards, serializeFsrsCard } from "../utils/flashcardHelpers.js";

const scheduler = fsrs();

const RATING_MAP = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

const getUserPlanForTopic = (userId, topicKey) =>
  StudyPlan.findOne({
    userId,
    "topics.topic_key": topicKey,
  });

export const activateTopicFlashcards = async (req, res, next) => {
  try {
    const { topicKey } = req.params;

    const [topicContent, plan] = await Promise.all([
      TopicContent.findOne({ topic_key: topicKey, status: "ready" }),
      getUserPlanForTopic(req.user._id, topicKey),
    ]);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Topic not found in the user's study plan",
        statusCode: 404,
      });
    }

    if (!topicContent) {
      return res.status(404).json({
        success: false,
        error: "Topic content is not ready yet",
        statusCode: 404,
      });
    }

    const existingCards = await Flashcard.find({
      userId: req.user._id,
      topic_key: topicKey,
    }).select("question answer");

    const newCards = filterNewFlashcards({
      existingCards,
      incomingCards: topicContent.flashcards || [],
    });

    if (newCards.length > 0) {
      await Flashcard.insertMany(
        seedUserFlashcards({
          userId: req.user._id,
          topicKey,
          cards: newCards,
          source: "topic",
        }),
      );
    }

    const activeCards = await Flashcard.find({
      userId: req.user._id,
      topic_key: topicKey,
    }).sort({ due: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        topic_key: topicKey,
        activatedCount: activeCards.length,
        cards: activeCards,
      },
      message: "Topic flashcards synced successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyReviewQueue = async (req, res, next) => {
  try {
    const now = new Date();
    const topicKey = String(req.query?.topicKey || "").trim();
    const query = {
      userId: req.user._id,
      status: "active",
      due: { $lte: now },
    };

    if (topicKey) {
      query.topic_key = topicKey;
    }

    const cards = await Flashcard.find(query).sort({ due: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: cards,
      count: cards.length,
      message: "Daily review queue loaded successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewFlashcard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const normalizedRating = String(req.body?.rating || "").trim().toLowerCase();
    const rating = RATING_MAP[normalizedRating];

    if (!rating) {
      return res.status(400).json({
        success: false,
        error: "rating must be one of: again, hard, good, easy",
        statusCode: 400,
      });
    }

    const flashcard = await Flashcard.findOne({
      _id: cardId,
      userId: req.user._id,
      status: "active",
    });

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found",
        statusCode: 404,
      });
    }

    const now = new Date();
    const result = scheduler.next(
      {
        due: flashcard.due,
        stability: flashcard.stability,
        difficulty: flashcard.difficulty,
        elapsed_days: flashcard.elapsed_days,
        scheduled_days: flashcard.scheduled_days,
        learning_steps: flashcard.learning_steps,
        reps: flashcard.reps,
        lapses: flashcard.lapses,
        state: flashcard.state,
        last_review: flashcard.last_review,
      },
      now,
      rating,
    );

    Object.assign(flashcard, serializeFsrsCard(result.card));
    await flashcard.save();

    const plans = await StudyPlan.find({ userId: req.user._id });
    const allFlashcards = await Flashcard.find({ userId: req.user._id, status: "active" });
    const dashboard = buildDashboardSummary({ plans, flashcards: allFlashcards, now });

    return res.status(200).json({
      success: true,
      data: {
        card: flashcard,
        reviewLog: result.log,
        dashboard,
      },
      message: "Flashcard reviewed successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
