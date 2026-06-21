import express from "express";
import protect from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  activateTopicFlashcards,
  getDailyReviewQueue,
  reviewFlashcard,
} from "../controllers/flashcardController.js";
import {
  reviewFlashcardValidation,
  topicKeyParamValidation,
} from "../validators/flashcardValidators.js";

const router = express.Router();

// All flashcard routes require authentication
router.use(protect);

/**
 * @route   POST /api/flashcards/activate/:topicKey
 * @desc    Sync flashcards from topic content to user collection
 */
router.post(
  "/activate/:topicKey",
  topicKeyParamValidation,
  validateRequest,
  activateTopicFlashcards
);

/**
 * @route   GET /api/flashcards/queue
 * @desc    Get the daily review queue (optionally filtered by topicKey)
 */
router.get("/queue", getDailyReviewQueue);

/**
 * @route   POST /api/flashcards/review/:cardId
 * @desc    Submit a flashcard review (Again, Hard, Good, Easy)
 */
router.post(
  "/review/:cardId",
  reviewFlashcardValidation,
  validateRequest,
  reviewFlashcard
);

export default router;
