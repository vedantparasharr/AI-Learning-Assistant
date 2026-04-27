import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getStudyPlans = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.STUDY_PLAN.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch study plans" };
  }
};

const deleteStudyPlan = async (planId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.STUDY_PLAN.DELETE(planId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete study plan" };
  }
};

const getStudyPlanOverview = async (planId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.STUDY_PLAN.GET_ONE(planId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch study plan overview" };
  }
};

const getSharedStudyPlan = async (shareSlug) => {
  try {
    const response = await axiosInstance.get(API_PATHS.STUDY_PLAN.GET_SHARED(shareSlug));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch shared study plan" };
  }
};

const shareStudyPlan = async (planId) => {
  try {
    const response = await axiosInstance.post(API_PATHS.STUDY_PLAN.SHARE(planId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to share study plan" };
  }
};

const cloneSharedStudyPlan = async (shareSlug) => {
  try {
    const response = await axiosInstance.post(API_PATHS.STUDY_PLAN.CLONE_SHARED(shareSlug));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to clone shared study plan" };
  }
};


const parseStudyPlan = async ({ file, outlineText, learningPrompt, sourceMode, subjectName }) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (outlineText) {
      formData.append("outlineText", outlineText);
    }
    if (learningPrompt) {
      formData.append("learningPrompt", learningPrompt);
    }
    if (sourceMode) {
      formData.append("sourceMode", sourceMode);
    }
    if (subjectName) {
      formData.append("subjectName", subjectName);
    }

    const response = await axiosInstance.post(API_PATHS.STUDY_PLAN.PARSE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to generate study plan topics" };
  }
};

const createStudyPlan = async ({ subjectName, examDate, topics, sourceText, sourceType }) => {
  try {
    const response = await axiosInstance.post(API_PATHS.STUDY_PLAN.CREATE, {
      subjectName,
      examDate,
      topics,
      sourceText,
      sourceType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create study plan" };
  }
};

const studyPlanService = {
  getStudyPlans,
  deleteStudyPlan,
  getStudyPlanOverview,
  getSharedStudyPlan,
  shareStudyPlan,
  cloneSharedStudyPlan,
  parseStudyPlan,
  createStudyPlan,
};

export default studyPlanService;
