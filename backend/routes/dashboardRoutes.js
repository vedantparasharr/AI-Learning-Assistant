import express from "express";
import protect from "../middleware/auth.js";
import { getDashboardSummary, getActivityByDate } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getDashboardSummary);
router.get("/activity/:date", getActivityByDate);

export default router;
