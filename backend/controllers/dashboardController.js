import Flashcard from "../models/Flashcard.js";
import StudyPlan from "../models/StudyPlan.js";
import ReviewLog from "../models/ReviewLog.js";
import { State } from "ts-fsrs";

/**
 * Get a summary of the user's study progress and activity for the dashboard.
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Fetch all relevant data in parallel
    const [plans, activeCards, reviewLogs] = await Promise.all([
      StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 }).lean(),
      Flashcard.find({ userId, status: "active" }).lean(),
      ReviewLog.find({ userId }).select("reviewedAt").lean(),
    ]);

    // 1. Map cards by topic_key for O(1) lookups during subject aggregation
    const topicCardMap = new Map();
    for (const card of activeCards) {
      const list = topicCardMap.get(card.topic_key) || [];
      list.push(card);
      topicCardMap.set(card.topic_key, list);
    }

    // 2. Calculate Review Breakdown (FSRS States)
    const dueCards = [];
    const reviewBreakdown = { learn: 0, review: 0, new: 0 };

    for (const card of activeCards) {
      if (new Date(card.due) <= now) {
        dueCards.push(card);
        if (card.state === State.New) reviewBreakdown.new++;
        else if (card.state === State.Review) reviewBreakdown.review++;
        else reviewBreakdown.learn++;
      }
    }

    // 3. Aggregate Subject Summaries
    const subjects = plans.map((plan) => {
      let totalCards = 0;
      let dueCount = 0;
      let completedTopics = 0;

      const topics = (plan.topics || []).map((topic) => {
        const cards = topicCardMap.get(topic.topic_key) || [];
        const topicDue = cards.filter((c) => new Date(c.due) <= now).length;

        totalCards += cards.length;
        dueCount += topicDue;
        if (topic.completionStatus === "completed") completedTopics++;

        return {
          topic_key: topic.topic_key,
          name: topic.name,
          completionStatus: topic.completionStatus,
          totalCards: cards.length,
          dueCount: topicDue,
        };
      });

      const progressPercentage = topics.length > 0
        ? Math.min(100, Math.round((completedTopics / topics.length) * 100))
        : 0;

      return {
        id: plan._id,
        subjectName: plan.subjectName,
        examDate: plan.examDate,
        topicCount: topics.length,
        cardCount: totalCards,
        dueCount,
        progressPercentage,
        topics,
      };
    }).sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

    // 4. Aggregate Heatmap Data from ReviewLogs
    const heatmapData = {};
    const reviewCountsByDay = new Map();

    for (const log of reviewLogs) {
      const key = new Date(log.reviewedAt).toISOString().slice(0, 10);
      reviewCountsByDay.set(key, (reviewCountsByDay.get(key) || 0) + 1);
      heatmapData[key] = reviewCountsByDay.get(key);
    }

    // 5. Calculate Streak & Stats from aggregated counts
    const uniqueReviewDays = Array.from(reviewCountsByDay.keys()).sort((a, b) => b.localeCompare(a));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    if (uniqueReviewDays.length > 0) {
      const cursor = new Date(now);
      cursor.setHours(0, 0, 0, 0);

      for (const dayKey of uniqueReviewDays) {
        const expected = cursor.toISOString().slice(0, 10);
        if (dayKey !== expected) {
          if (currentStreak === 0) {
            cursor.setDate(cursor.getDate() - 1);
            if (dayKey !== cursor.toISOString().slice(0, 10)) break;
          } else {
            break;
          }
        }
        currentStreak++;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    // Calculate max streak
    if (uniqueReviewDays.length > 0) {
      // Sort in ascending order to find gaps
      const sortedAsc = [...uniqueReviewDays].sort((a, b) => a.localeCompare(b));
      let prevDate = null;

      for (const dayKey of sortedAsc) {
        const currentDate = new Date(dayKey);
        
        if (prevDate) {
          const diffTime = Math.abs(currentDate - prevDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        prevDate = currentDate;
      }
      maxStreak = Math.max(maxStreak, tempStreak);
    }

    // 6. Final Dashboard Data Structure
    const estimatedReviewMinutes = dueCards.length === 0
      ? 0
      : Math.max(5, Math.round((dueCards.length * 0.5) / 5) * 5);

    return res.status(200).json({
      success: true,
      data: {
        dueCards: dueCards.length,
        streak: currentStreak,
        maxStreak,
        totalActiveDays: uniqueReviewDays.length,
        reviewBreakdown,
        estimatedReviewMinutes,
        heatmapData,
        subjects,
        joinedAt: req.user.createdAt,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed activity breakdown for a specific date.
 * GET /api/dashboard/activity/:date
 */
export const getActivityByDate = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { date } = req.params; // YYYY-MM-DD

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [logs, plans] = await Promise.all([
      ReviewLog.find({
        userId,
        reviewedAt: { $gte: startOfDay, $lte: endOfDay },
      }).populate("cardId", "topic_key").lean(),
      StudyPlan.find({ userId }).select("subjectName topics").lean(),
    ]);

    // Map topic_key to subjectName
    const topicToSubjectMap = new Map();
    for (const plan of plans) {
      for (const topic of plan.topics) {
        topicToSubjectMap.set(topic.topic_key, plan.subjectName);
      }
    }

    const subjectBreakdown = {};
    const typeBreakdown = { new: 0, review: 0 };

    for (const log of logs) {
      const subjectName = topicToSubjectMap.get(log.cardId?.topic_key) || "Unknown Subject";
      
      // Update subject breakdown
      if (!subjectBreakdown[subjectName]) {
        subjectBreakdown[subjectName] = { count: 0, new: 0, review: 0 };
      }
      subjectBreakdown[subjectName].count++;

      // Update type breakdown (State.New = 0, others are learning/review)
      if (log.state === State.New) {
        subjectBreakdown[subjectName].new++;
        typeBreakdown.new++;
      } else {
        subjectBreakdown[subjectName].review++;
        typeBreakdown.review++;
      }
    }

    // Format for response
    const formattedSubjects = Object.entries(subjectBreakdown).map(([name, data]) => ({
      name,
      ...data,
    }));

    return res.status(200).json({
      success: true,
      data: {
        date,
        totalReviews: logs.length,
        subjects: formattedSubjects,
        typeBreakdown,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
