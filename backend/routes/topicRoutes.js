import express from "express";
import protect from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { generateTopicContent, streamTopicContent, markTopicCompleted } from "../controllers/topicController.js";
import { topicKeyParamValidation } from "../validators/flashcardValidators.js";

const router = express.Router();

router.use(protect);

router.post(
  "/:topicKey/generate",
  topicKeyParamValidation,
  validateRequest,
  generateTopicContent
);

router.get(
  "/:topicKey/stream",
  topicKeyParamValidation,
  validateRequest,
  streamTopicContent
);

router.patch(
  "/:topicKey/complete",
  topicKeyParamValidation,
  validateRequest,
  markTopicCompleted
);

export default router;
