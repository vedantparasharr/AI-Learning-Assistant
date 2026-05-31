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

    // Fetch relevant data using Aggregation Pipelines
    const [plans, flashcardAgg, reviewLogsAgg] = await Promise.all([
      StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 }).lean(),
      
      // Aggregate Flashcards directly in DB
      Flashcard.aggregate([
        { $match: { userId, status: "active" } },
        {
          $facet: {
            topicStats: [
              {
                $group: {
                  _id: "$topic_key",
                  totalCards: { $sum: 1 },
                  dueCount: {
                    $sum: { $cond: [{ $lte: ["$due", now] }, 1, 0] },
                  },
                  reviewedCount: {
                    $sum: { $cond: [{ $gt: ["$reps", 0] }, 1, 0] },
                  },
                },
              },
            ],
            globalStats: [
              { $match: { due: { $lte: now } } },
              {
                $group: {
                  _id: "$state",
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]),

      // Aggregate ReviewLogs to get counts per day
      ReviewLog.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$reviewedAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
      ]),
    ]);

    // 1. Process Flashcard Aggregation Results
    const topicStats = flashcardAgg[0]?.topicStats || [];
    const globalStats = flashcardAgg[0]?.globalStats || [];

    const topicCardMap = new Map();
    topicStats.forEach((stat) => {
      topicCardMap.set(stat._id, {
        totalCards: stat.totalCards,
        dueCount: stat.dueCount,
        reviewedCount: stat.reviewedCount,
      });
    });

    const reviewBreakdown = { learn: 0, review: 0, new: 0 };
    let totalDueCards = 0;

    globalStats.forEach((stat) => {
      totalDueCards += stat.count;
      if (stat._id === State.New) reviewBreakdown.new += stat.count;
      else if (stat._id === State.Review) reviewBreakdown.review += stat.count;
      else reviewBreakdown.learn += stat.count;
    });

    // 2. Aggregate Subject Summaries
    const subjects = plans.map((plan) => {
      let totalCards = 0;
      let dueCount = 0;
      let completedTopics = 0;

      const topics = (plan.topics || []).map((topic) => {
        const stats = topicCardMap.get(topic.topic_key) || {
          totalCards: 0,
          dueCount: 0,
          reviewedCount: 0,
        };

        totalCards += stats.totalCards;
        dueCount += stats.dueCount;
        if (topic.completionStatus === "completed") completedTopics++;

        return {
          topic_key: topic.topic_key,
          name: topic.name,
          completionStatus: topic.completionStatus,
          totalCards: stats.totalCards,
          dueCount: stats.dueCount,
          reviewedCount: stats.reviewedCount,
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

    // 3. Process Heatmap Data and Streaks from ReviewLog Aggregation
    const heatmapData = {};
    const uniqueReviewDays = reviewLogsAgg.map((log) => log._id).sort((a, b) => b.localeCompare(a));

    reviewLogsAgg.forEach((log) => {
      heatmapData[log._id] = log.count;
    });

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    if (uniqueReviewDays.length > 0) {
      const cursor = new Date(now);
      cursor.setHours(0, 0, 0, 0);

      // Current Streak
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

      // Max Streak
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

    // 4. Final Dashboard Data Structure
    const estimatedReviewMinutes = totalDueCards === 0
      ? 0
      : Math.max(5, Math.round((totalDueCards * 0.5) / 5) * 5);

    return res.status(200).json({
      success: true,
      data: {
        dueCards: totalDueCards,
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
