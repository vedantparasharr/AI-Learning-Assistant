import Flashcard from "../models/Flashcard.js";
import StudyPlan from "../models/StudyPlan.js";
import ReviewLog from "../models/ReviewLog.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate due cards
    const now = new Date();
    const dueCards = await Flashcard.countDocuments({
      userId,
      status: "active",
      due: { $lte: now },
    });

    // Total cards
    const totalCards = await Flashcard.countDocuments({ userId });

    // Total plans
    const plansCount = await StudyPlan.countDocuments({ userId });

    // Cards reviewed
    const cardsReviewed = await ReviewLog.countDocuments({ userId });

    // Retention rate
    const successReviews = await ReviewLog.countDocuments({
      userId,
      rating: { $in: [2, 3, 4] },
    });
    const retentionRate = cardsReviewed > 0 ? Math.round((successReviews / cardsReviewed) * 100) : 0;

    // Heatmap data & Streak
    const reviewLogs = await ReviewLog.find({ userId }).select("reviewedAt").sort({ reviewedAt: 1 });
    
    const heatmapData = {};
    const activeDaysSet = new Set();
    
    const dateStrings = reviewLogs.map(log => {
      const d = new Date(log.reviewedAt);
      return d.toISOString().split("T")[0];
    });

    dateStrings.forEach(dateStr => {
      activeDaysSet.add(dateStr);
      heatmapData[dateStr] = (heatmapData[dateStr] || 0) + 1;
    });

    const activeDaysArray = Array.from(activeDaysSet).sort().reverse();
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let previousDate = null;
    
    // Calculate current and max streak
    const sortedDaysAsc = Array.from(activeDaysSet).sort();
    
    for (const dateStr of sortedDaysAsc) {
      const currentDate = new Date(dateStr);
      if (!previousDate) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - previousDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      previousDate = currentDate;
    }
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (activeDaysArray.length > 0 && (activeDaysArray[0] === todayStr || activeDaysArray[0] === yesterdayStr)) {
        let checkDate = new Date(activeDaysArray[0]);
        currentStreak = 1;
        for (let i = 1; i < activeDaysArray.length; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (activeDaysArray[i] === checkDate.toISOString().split("T")[0]) {
                currentStreak++;
            } else {
                break;
            }
        }
    }
    
    const totalActiveDays = activeDaysSet.size;

    // Subjects
    const studyPlans = await StudyPlan.find({ userId });
    
    const subjects = [];
    for (const plan of studyPlans) {
      const topicKeys = plan.topics.map(t => t.topic_key);
      const planDueCards = await Flashcard.countDocuments({
        userId,
        status: "active",
        topic_key: { $in: topicKeys },
        due: { $lte: now }
      });

      let progressPercentage = 0;
      if (plan.topics.length > 0) {
        const completedTopics = plan.topics.filter(t => t.completionStatus === "completed").length;
        progressPercentage = Math.round((completedTopics / plan.topics.length) * 100);
      }

      subjects.push({
        id: plan._id,
        subjectName: plan.subjectName,
        topicCount: plan.topics.length,
        dueCount: planDueCards,
        progressPercentage
      });
    }

    // Trends
    const yesterdayTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dueCardsTrend = await Flashcard.countDocuments({
      userId,
      status: "active",
      due: { $gt: yesterdayTime, $lte: now }
    });

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekReviews = await ReviewLog.find({ userId, reviewedAt: { $gte: sevenDaysAgo } });
    let thisWeekSuccess = 0;
    thisWeekReviews.forEach(r => { if (r.rating > 1) thisWeekSuccess++; });
    const thisWeekRate = thisWeekReviews.length > 0 ? (thisWeekSuccess / thisWeekReviews.length) * 100 : 0;

    const lastWeekReviews = await ReviewLog.find({ userId, reviewedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });
    let lastWeekSuccess = 0;
    lastWeekReviews.forEach(r => { if (r.rating > 1) lastWeekSuccess++; });
    const lastWeekRate = lastWeekReviews.length > 0 ? (lastWeekSuccess / lastWeekReviews.length) * 100 : 0;

    const retentionRateTrend = Math.round(thisWeekRate - lastWeekRate);

    res.status(200).json({
      success: true,
      data: {
        dueCards,
        dueCardsTrend,
        streak: currentStreak,
        maxStreak,
        totalActiveDays,
        joinedAt: req.user.createdAt,
        totalCards,
        plansCount,
        retentionRate,
        retentionRateTrend,
        cardsReviewed,
        subjects,
        heatmapData
      }
    });

  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    res.status(500).json({ success: false, message: "Server error getting dashboard summary" });
  }
};

export const getActivityByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const logs = await ReviewLog.find({
      userId,
      reviewedAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate({
      path: "cardId",
      select: "question topic_key",
    });
    
    // Group by topic
    const topicMap = {};
    for (const log of logs) {
        if (!log.cardId) continue;
        const topicKey = log.cardId.topic_key;
        if (!topicMap[topicKey]) {
            topicMap[topicKey] = {
                topicKey,
                cardsReviewed: 0,
                successes: 0
            };
        }
        topicMap[topicKey].cardsReviewed++;
        if (log.rating > 1) {
            topicMap[topicKey].successes++;
        }
    }
    
    const activities = Object.values(topicMap).map(topic => ({
        name: topic.topicKey,
        count: topic.cardsReviewed,
        review: topic.cardsReviewed, // simplified
        new: 0 // simplified
    }));

    res.status(200).json({
      success: true,
      data: {
        totalReviews: logs.length,
        typeBreakdown: { new: 0, review: logs.length }, // simplified
        subjects: activities
      }
    });

  } catch (error) {
    console.error("Error in getActivityByDate:", error);
    res.status(500).json({ success: false, message: "Server error getting activity by date" });
  }
};
