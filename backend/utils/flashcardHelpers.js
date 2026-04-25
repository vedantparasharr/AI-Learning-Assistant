import { createEmptyCard } from "ts-fsrs";

const normalize = (value) => String(value || "").trim().toLowerCase();

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

export const filterNewFlashcards = ({ existingCards, incomingCards }) => {
  const seen = new Set(
    existingCards.map((card) => `${normalize(card.question)}::${normalize(card.answer)}`),
  );

  return incomingCards.filter((card) => {
    const key = `${normalize(card.question)}::${normalize(card.answer)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
