import express from "express";
import protect from "../middleware/auth.js";
import {
  activateTopicFlashcards,
  getDailyReviewQueue,
  reviewFlashcard,
} from "../controllers/flashcardController.js";

const router = express.Router();

router.use(protect);

router.post("/activate/:topicKey", activateTopicFlashcards);
router.get("/queue", getDailyReviewQueue);
router.post("/review/:cardId", reviewFlashcard);

export default router;
