import express from "express";
import protect from "../middleware/auth.js";
import {
  activateTopicFlashcards,
  getDailyReviewQueue,
  reviewFlashcard,
} from "../controllers/flashcardController.js";

const router = express.Router();

// All flashcard routes require authentication
router.use(protect);

/**
 * @route   POST /api/flashcards/activate/:topicKey
 * @desc    Sync flashcards from topic content to user collection
 */
router.post("/activate/:topicKey", activateTopicFlashcards);

/**
 * @route   GET /api/flashcards/queue
 * @desc    Get the daily review queue (optionally filtered by topicKey)
 */
router.get("/queue", getDailyReviewQueue);

/**
 * @route   POST /api/flashcards/review/:cardId
 * @desc    Submit a flashcard review (Again, Hard, Good, Easy)
 */
router.post("/review/:cardId", reviewFlashcard);

export default router;
