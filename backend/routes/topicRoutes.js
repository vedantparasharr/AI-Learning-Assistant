import express from "express";
import protect from "../middleware/auth.js";
import { generateTopicContent, markTopicCompleted } from "../controllers/topicController.js";

const router = express.Router();

router.use(protect);

router.post("/:topicKey/generate", generateTopicContent);
router.patch("/:topicKey/complete", markTopicCompleted);

export default router;
