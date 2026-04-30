export const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    VERIFY_EMAIL: "/api/auth/verify-email",
    RESEND_OTP: "/api/auth/resend-otp",
    LOGOUT: "/api/auth/logout",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/updateProfile",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  STUDY_PLAN: {
    GET_ALL: "/api/study-plan",
    GET_ONE: (planId) => `/api/study-plan/${planId}`,
    DELETE: (planId) => `/api/study-plan/${planId}`,
    GET_SHARED: (shareSlug) => `/api/study-plan/shared/${shareSlug}`,
    CLONE_SHARED: (shareSlug) => `/api/study-plan/shared/${shareSlug}/clone`,
    SHARE: (planId) => `/api/study-plan/${planId}/share`,
    PARSE: "/api/study-plan/parse",
    CREATE: "/api/study-plan/create",
  },

  TOPICS: {
    GENERATE: (topicKey) => `/api/topics/${topicKey}/generate`,
    COMPLETE: (topicKey) => `/api/topics/${topicKey}/complete`,
  },

  FLASHCARDS: {
    ACTIVATE_TOPIC: (topicKey) => `/api/flashcards/activate/${topicKey}`,
    GET_QUEUE: "/api/flashcards/queue",
    REVIEW_CARD: (cardId) => `/api/flashcards/review/${cardId}`,
  },

  DASHBOARD: {
    GET_SUMMARY: "/api/dashboard/summary",
    GET_ACTIVITY_BY_DATE: (date) => `/api/dashboard/activity/${date}`,
  },
};
