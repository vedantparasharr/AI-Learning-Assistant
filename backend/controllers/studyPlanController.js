import * as studyPlanService from "../services/studyPlanService.js";

// @desc Parse Syllabus or Prompt
// @route POST api/study-plan/parse
// @access private
export const parseStudyPlan = async (req, res, next) => {
  try {
    const { sourceMode, outlineText, syllabusText, learningPrompt, subjectName } = req.body;
    const cleanOutlineText = String(outlineText || syllabusText || "").trim();

    const result = await studyPlanService.parseStudyPlanService({
      file: req.file,
      sourceMode,
      outlineText: cleanOutlineText,
      learningPrompt,
      subjectName,
    });

    return res.status(200).json({
      success: true,
      data: result,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create Study Plan
// @route POST api/study-plan/create
// @access private
export const createStudyPlan = async (req, res, next) => {
  try {
    const { subjectName, examDate, topics, sourceText, sourceType } = req.body;
    const result = await studyPlanService.createStudyPlanService(req.user._id, {
      subjectName,
      examDate,
      topics,
      sourceText,
      sourceType,
    });

    return res.status(201).json({
      success: true,
      data: result,
      message: "Study plan created successfully",
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all study plans
// @route GET api/study-plan
// @access private
export const getStudyPlans = async (req, res, next) => {
  try {
    const galleryPlans = await studyPlanService.getStudyPlansList(req.user._id);

    return res.status(200).json({
      success: true,
      data: galleryPlans,
      count: galleryPlans.length,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get study plan overview
// @route GET api/study-plan/:planId
// @access private
export const getStudyPlanOverview = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const result = await studyPlanService.getStudyPlanOverviewService(req.user._id, planId);

    return res.status(200).json({
      success: true,
      data: result,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete study plan
// @route DELETE api/study-plan/:planId
// @access private
export const deleteStudyPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const deletedPlanId = await studyPlanService.deleteStudyPlanService(req.user._id, planId);

    return res.status(200).json({
      success: true,
      data: { deletedPlanId },
      message: "Study plan deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Generate (or return) a shareable link for a plan
// @route POST /api/study-plan/:planId/share
// @access private
export const shareStudyPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const shareSlug = await studyPlanService.shareStudyPlanService(req.user._id, planId);

    const frontendOrigin =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://distilllearn.vercel.app"
        : "http://localhost:5173");

    return res.status(200).json({
      success: true,
      data: {
        shareSlug,
        shareUrl: `${frontendOrigin}/shared/${shareSlug}`,
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get a publicly shared study plan by slug
// @route GET /api/study-plan/shared/:slug
// @access public
export const getSharedStudyPlan = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const plan = await studyPlanService.getSharedStudyPlanService(slug);

    return res.status(200).json({
      success: true,
      data: plan,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Clone a shared plan into the requesting user's account
// @route POST /api/study-plan/shared/:slug/clone
// @access private
export const cloneSharedStudyPlan = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const newPlan = await studyPlanService.cloneSharedStudyPlanService(req.user._id, slug);

    return res.status(201).json({
      success: true,
      data: { planId: String(newPlan._id), subjectName: newPlan.subjectName },
      message: "Plan cloned successfully",
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};