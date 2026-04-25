import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/auth.js";
import {
  cloneSharedStudyPlan,
  createStudyPlan,
  getSharedStudyPlan,
  getStudyPlanOverview,
  getStudyPlans,
  parseStudyPlan,
  shareStudyPlan,
} from "../controllers/studyPlanController.js";

const router = express.Router();

router.get("/shared/:shareSlug", getSharedStudyPlan);

router.use(protect);

router.get("/", getStudyPlans);
router.post("/shared/:shareSlug/clone", cloneSharedStudyPlan);
router.post("/:planId/share", shareStudyPlan);
router.get("/:planId", getStudyPlanOverview);
router.post("/parse", upload.single("file"), parseStudyPlan);
router.post("/create", createStudyPlan);

export default router;
