import express from "express";
import { getDashboardSummary, getActivityByDate } from "../controllers/dashboardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/activity/:date", protect, getActivityByDate);

export default router;
