import { State } from "ts-fsrs";

const startOfDayKey = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const clampPercent = (value) => Math.max(0, Math.min(100, value));

const buildReviewBreakdown = (dueCards) => {
  const newCount = dueCards.filter((card) => card.state === State.New).length;
  const reviewCount = dueCards.filter((card) => card.state === State.Review).length;
  const learnCount = Math.max(0, dueCards.length - newCount - reviewCount);

  return {
    learn: learnCount,
    review: reviewCount,
    new: newCount,
  };
};

const buildLearningActivity = ({ flashcards, now }) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monday = new Date(now);
  const day = monday.getDay();
  const offsetToMonday = day === 0 ? 6 : day - 1;
  monday.setDate(monday.getDate() - offsetToMonday);
  monday.setHours(0, 0, 0, 0);

  const buckets = labels.map((label, index) => {
    const bucketDate = new Date(monday);
    bucketDate.setDate(monday.getDate() + index);

    return {
      label,
      key: bucketDate.toISOString().slice(0, 10),
      value: 0,
      isCurrentDay: bucketDate.toDateString() === now.toDateString(),
    };
  });

  const countMap = new Map(buckets.map((bucket) => [bucket.key, 0]));
  for (const card of flashcards) {
    if (!card.last_review) {
      continue;
    }

    const dayKey = startOfDayKey(card.last_review);
    if (!dayKey || !countMap.has(dayKey)) {
      continue;
    }

    countMap.set(dayKey, (countMap.get(dayKey) || 0) + 1);
  }

  const bars = buckets.map((bucket) => ({
    label: bucket.label,
    value: countMap.get(bucket.key) || 0,
    isCurrentDay: bucket.isCurrentDay,
  }));

  const max = bars.reduce((highest, item) => Math.max(highest, item.value), 0);

  return {
    bars,
    max,
  };
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
  const reviewBreakdown = buildReviewBreakdown(dueCards);

  const subjectSummaries = plans.map((plan) => {
    const planCards = activeCards.filter((card) => plan.topics.some((topic) => topic.topic_key === card.topic_key));
    const { topics } = buildTopicMetrics({ plan, flashcards: planCards, now });
    const totalCards = planCards.length;
    const dueCount = planCards.filter((card) => new Date(card.due) <= now).length;
    const completedTopicCount = topics.filter((topic) => topic.completionStatus === "completed").length;
    const progressPercentage = topics.length > 0
      ? clampPercent(Math.round((completedTopicCount / topics.length) * 100))
      : 0;

    return {
      id: plan._id,
      subjectName: plan.subjectName,
      examDate: plan.examDate,
      topicCount: topics.length,
      cardCount: totalCards,
      dueCount,
      completedTopicCount,
      progressPercentage,
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

  const estimatedReviewMinutes = dueCards.length === 0
    ? 0
    : Math.max(5, Math.round((dueCards.length * 0.5) / 5) * 5);

  const learningActivity = buildLearningActivity({ flashcards: activeCards, now });

  return {
    dueCards: dueCards.length,
    streak,
    hoursUntilNextReview,
    reviewBreakdown,
    estimatedReviewMinutes,
    learningActivity,
    subjects: subjectSummaries,
  };
};
