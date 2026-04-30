import Flashcard from "../models/Flashcard.js";
import StudyPlan from "../models/StudyPlan.js";
import { buildDashboardSummary } from "../utils/studyMetrics.js";


export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [plans, flashcards] = await Promise.all([
      StudyPlan.find({ userId }).sort({ examDate: 1, createdAt: -1 }),
      Flashcard.find({ userId, status: "active" }),
    ]);

    const summary = buildDashboardSummary({
      plans,
      flashcards,
      now: new Date(),
    });

    return res.status(200).json({
      success: true,
      data: summary,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
