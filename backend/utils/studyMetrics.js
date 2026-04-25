const startOfDayKey = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

export const buildTopicMetrics = ({ plan, flashcards, now = new Date() }) => {
  const topicCardMap = new Map();

  for (const card of flashcards) {
    const cards = topicCardMap.get(card.topic_key) || [];
    cards.push(card);
    topicCardMap.set(card.topic_key, cards);
  }

  const metrics = (plan.topics || []).map((topic) => {
    const topicCards = topicCardMap.get(topic.topic_key) || [];
    const totalCards = topicCards.length;
    const dueCount = topicCards.filter((card) => card.status === "active" && new Date(card.due) <= now).length;

    return {
      topic_key: topic.topic_key,
      name: topic.name,
      estimated_hours: topic.estimated_hours || 1,
      completionStatus: topic.completionStatus,
      totalCards,
      dueCount,
    };
  });

  return {
    topics: metrics,
    dueTopicCount: metrics.filter((topic) => topic.dueCount > 0).length,
  };
};

export const buildDashboardSummary = ({ plans, flashcards, now = new Date() }) => {
  const activeCards = flashcards.filter((card) => card.status === "active");
  const dueCards = activeCards.filter((card) => new Date(card.due) <= now);

  const subjectSummaries = plans.map((plan) => {
    const planCards = activeCards.filter((card) => plan.topics.some((topic) => topic.topic_key === card.topic_key));
    const { topics } = buildTopicMetrics({ plan, flashcards: planCards, now });
    const totalCards = planCards.length;
    const dueCount = planCards.filter((card) => new Date(card.due) <= now).length;

    return {
      id: plan._id,
      subjectName: plan.subjectName,
      examDate: plan.examDate,
      topicCount: topics.length,
      cardCount: totalCards,
      dueCount,
      topics,
    };
  }).sort((left, right) => new Date(left.examDate) - new Date(right.examDate));

  const uniqueDays = [...new Set(
    activeCards
      .filter((card) => card.last_review)
      .map((card) => startOfDayKey(card.last_review)),
  )].sort((left, right) => right.localeCompare(left));

  let streak = 0;
  if (uniqueDays.length > 0) {
    const cursor = new Date(now);
    cursor.setHours(0, 0, 0, 0);

    for (const dayKey of uniqueDays) {
      const expected = cursor.toISOString().slice(0, 10);
      if (dayKey !== expected) {
        if (streak === 0) {
          cursor.setDate(cursor.getDate() - 1);
          const fallbackExpected = cursor.toISOString().slice(0, 10);
          if (dayKey !== fallbackExpected) {
            break;
          }
        } else {
          break;
        }
      }
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const nextDueCard = activeCards
    .filter((card) => new Date(card.due) > now)
    .sort((left, right) => new Date(left.due) - new Date(right.due))[0] || null;

  const hoursUntilNextReview = nextDueCard
    ? Math.max(1, Math.round((new Date(nextDueCard.due) - now) / (1000 * 60 * 60)))
    : null;

  return {
    dueCards: dueCards.length,
    streak,
    hoursUntilNextReview,
    subjects: subjectSummaries,
  };
};
