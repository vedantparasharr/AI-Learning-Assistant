import express from "express";
import protect from "../middleware/auth.js";
import { generateTopicContent } from "../controllers/topicController.js";

const router = express.Router();

router.use(protect);

router.post("/:topicKey/generate", generateTopicContent);

export default router;
