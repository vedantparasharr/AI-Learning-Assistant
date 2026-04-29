import { createEmptyCard } from "ts-fsrs";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

/**
 * Builds fallback starter flashcards if none are provided.
 * @param {string} subjectName 
 * @param {string} topicName 
 * @returns {Array} Array of flashcard objects.
 */
export const buildStarterFlashcardsFallback = (subjectName, topicName) => [
  {
    question: `What is ${topicName} in ${subjectName}?`,
    answer: `Define ${topicName}, identify its main purpose, and explain where it appears in ${subjectName}.`,
  },
  {
    question: `What is a common exam mistake in ${topicName}?`,
    answer: `Confusing the core idea, skipping edge cases, or memorizing steps without understanding why ${topicName} works.`,
  },
];

/**
 * Serializes a ts-fsrs Card object for storage in MongoDB.
 * @param {Object} card - ts-fsrs Card object.
 * @returns {Object} Cleaned card object.
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
 * @param {Object} params 
 * @param {string} params.userId 
 * @param {string} params.topicKey 
 * @param {Array} params.cards 
 * @param {string} [params.source="starter"]
 * @param {Date} [params.now=new Date()]
 * @returns {Array} Array of flashcard documents.
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
 * @param {Object} params 
 * @param {Array} params.existingCards 
 * @param {Array} params.incomingCards 
 * @returns {Array} List of unique new cards.
 */
export const filterNewFlashcards = ({ existingCards, incomingCards }) => {
  const seen = new Set(
    existingCards.map((card) => `${normalizeValue(card.question)}::${normalizeValue(card.answer)}`),
  );

  return incomingCards.filter((card) => {
    const key = `${normalizeValue(card.question)}::${normalizeValue(card.answer)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
