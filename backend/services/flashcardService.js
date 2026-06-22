import { fsrs, Rating, createEmptyCard } from "ts-fsrs";
import Flashcard from "../models/Flashcard.js";
import StudyPlan from "../models/StudyPlan.js";
import TopicContent from "../models/TopicContent.js";
import ReviewLog from "../models/ReviewLog.js";

const scheduler = fsrs();

const RATING_MAP = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

/**
 * Serializes a ts-fsrs Card object for storage in MongoDB.
 */
export const serializeFsrsCard = (card) => ({
  due: card.due,
  stability: card.stability,
  difficulty: card.difficulty,
  elapsed_days: card.elapsed_days,
  scheduled_days: card.scheduled_days,
  learning_steps: card.learning_steps ?? 0,
  reps: card.reps,
  lapses: card.lapses,
  state: card.state,
  last_review: card.last_review ?? null,
});

/**
 * Seeds a list of flashcards for a specific user and topic.
 */
export const seedUserFlashcards = ({ userId, topicKey, cards, source = "starter", now = new Date() }) =>
  cards.map((card) => ({
    userId,
    topic_key: topicKey,
    question: card.question,
    answer: card.answer,
    source,
    status: "active",
    ...serializeFsrsCard(createEmptyCard(now)),
  }));

/**
 * Filters out flashcards that already exist in the user's collection.
 */
export const filterNewFlashcards = ({ existingCards, incomingCards }) => {
  const existingQuestions = new Set(
    existingCards.map((card) => card.question.trim().toLowerCase())
  );

  return incomingCards.filter((card) => {
    const questionLower = card.question.trim().toLowerCase();
    if (existingQuestions.has(questionLower)) {
      return false;
    }
    existingQuestions.add(questionLower);
    return true;
  });
};

export const syncTopicCardsForUser = async ({ userId, topicKey, cacheFlashcards }) => {
  const cards = await Flashcard.find({ userId, topic_key: topicKey }).select("question answer");
  const newCards = filterNewFlashcards({
    existingCards: cards,
    incomingCards: cacheFlashcards,
  });

  if (newCards.length > 0) {
    const seededCards = seedUserFlashcards({
      userId,
      topicKey,
      cards: newCards,
      source: "topic",
      now: new Date(),
    });
    await Flashcard.insertMany(seededCards);
  }

  return Flashcard.find({ userId, topic_key: topicKey }).sort({ due: 1, createdAt: 1 });
};

export const activateTopicCardsService = async (userId, topicKey) => {
  const [topicContent, plan] = await Promise.all([
    TopicContent.findOne({ topic_key: topicKey, status: "ready" }),
    StudyPlan.findOne({
      userId,
      "topics.topic_key": topicKey,
    }),
  ]);

  if (!plan) {
    const error = new Error("Topic not found in the user's study plan");
    error.statusCode = 404;
    throw error;
  }

  if (!topicContent) {
    const error = new Error("Topic content is not ready yet");
    error.statusCode = 404;
    throw error;
  }

  return syncTopicCardsForUser({
    userId,
    topicKey,
    cacheFlashcards: topicContent.flashcards || [],
  });
};

export const getReviewQueueService = async (userId, topicKey = "") => {
  const now = new Date();
  const query = {
    userId,
    status: "active",
    due: { $lte: now },
  };

  const cleanTopicKey = String(topicKey || "").trim();
  if (cleanTopicKey) {
    query.topic_key = cleanTopicKey;
  }

  return Flashcard.find(query).sort({ due: 1, createdAt: 1 });
};

export const processCardReviewService = async (userId, cardId, ratingString) => {
  const normalizedRating = String(ratingString || "").trim().toLowerCase();
  const rating = RATING_MAP[normalizedRating];

  const flashcard = await Flashcard.findOne({
    _id: cardId,
    userId,
    status: "active",
  });

  if (!flashcard) {
    const error = new Error("Flashcard not found");
    error.statusCode = 404;
    throw error;
  }

  const now = new Date();
  const initialState = flashcard.state;

  const result = scheduler.next(flashcard.toObject(), now, rating);

  Object.assign(flashcard, serializeFsrsCard(result.card));

  await Promise.all([
    flashcard.save(),
    ReviewLog.create({
      userId,
      cardId: flashcard._id,
      rating,
      state: initialState,
      reviewedAt: now,
    }),
  ]);

  return {
    card: flashcard,
    reviewLog: result.log,
  };
};
