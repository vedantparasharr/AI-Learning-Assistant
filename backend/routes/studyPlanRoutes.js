import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createStudyPlan,
  deleteStudyPlan,
  getStudyPlanOverview,
  getStudyPlans,
  parseStudyPlan,
  shareStudyPlan,
  getSharedStudyPlan,
  cloneSharedStudyPlan,
} from "../controllers/studyPlanController.js";
import {
  createStudyPlanValidation,
  parseStudyPlanValidation,
} from "../validators/studyPlanValidators.js";

const router = express.Router();

// ── Public routes (no auth required) ──────────────────────────────────────────
// Must be declared before protect middleware and before /:planId catch-all
router.get("/shared/:slug", getSharedStudyPlan);

// ── Protected routes ───────────────────────────────────────────────────────────
router.use(protect);

router.get("/", getStudyPlans);
router.get("/:planId", getStudyPlanOverview);
router.delete("/:planId", deleteStudyPlan);
router.post("/:planId/share", shareStudyPlan);
router.post("/shared/:slug/clone", cloneSharedStudyPlan);
router.post(
  "/parse",
  upload.single("file"),
  parseStudyPlanValidation,
  validateRequest,
  parseStudyPlan
);
router.post(
  "/create",
  createStudyPlanValidation,
  validateRequest,
  createStudyPlan
);

export default router;
