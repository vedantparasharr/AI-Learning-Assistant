/**
 * Build performance metrics for topics within a study plan.
 * Used by StudyPlan and Topic controllers to show progress and due counts.
 */
export const buildTopicMetrics = ({ plan, flashcards, now = new Date() }) => {
  // Map cards by topic_key for O(1) access
  const topicCardMap = new Map();
  for (const card of flashcards) {
    const list = topicCardMap.get(card.topic_key) || [];
    list.push(card);
    topicCardMap.set(card.topic_key, list);
  }

  const topics = (plan.topics || []).map((topic) => {
    const topicCards = topicCardMap.get(topic.topic_key) || [];
    const dueCount = topicCards.filter((c) => c.status === "active" && new Date(c.due) <= now).length;
    const reviewedCount = topicCards.filter((c) => c.reps > 0).length;

    return {
      topic_key: topic.topic_key,
      name: topic.name,
      estimated_hours: topic.estimated_hours || 1,
      completionStatus: topic.completionStatus,
      totalCards: topicCards.length,
      dueCount,
      reviewedCount,
    };
  });

  return {
    topics,
    dueTopicCount: topics.filter((t) => t.dueCount > 0).length,
  };
};
