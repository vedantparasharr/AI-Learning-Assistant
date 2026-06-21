import * as flashcardService from "../services/flashcardService.js";

/**
 * Activates flashcards for a specific topic by syncing them from TopicContent to the user's collection.
 * POST /api/flashcards/activate/:topicKey
 */
export const activateTopicFlashcards = async (req, res, next) => {
  try {
    const { topicKey } = req.params;
    const activeCards = await flashcardService.activateTopicCardsService(req.user._id, topicKey);

    return res.status(200).json({
      success: true,
      data: {
        topicKey,
        activatedCount: activeCards.length,
        cards: activeCards,
      },
      message: "Topic flashcards synced successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the daily review queue for a user, optionally filtered by topic.
 * GET /api/flashcards/queue?topicKey=...
 */
export const getDailyReviewQueue = async (req, res, next) => {
  try {
    const topicKey = String(req.query?.topicKey || "").trim();
    const cards = await flashcardService.getReviewQueueService(req.user._id, topicKey);

    return res.status(200).json({
      success: true,
      data: cards,
      count: cards.length,
      message: "Daily review queue loaded successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submits a review for a specific flashcard and updates its FSRS scheduling data.
 * POST /api/flashcards/review/:cardId
 */
export const reviewFlashcard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { rating } = req.body;

    const { card, reviewLog } = await flashcardService.processCardReviewService(
      req.user._id,
      cardId,
      rating
    );

    return res.status(200).json({
      success: true,
      data: {
        card,
        reviewLog,
      },
      message: "Flashcard reviewed successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
