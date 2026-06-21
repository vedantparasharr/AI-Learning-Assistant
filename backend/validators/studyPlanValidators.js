import { body, param } from "express-validator";

export const createStudyPlanValidation = [
  body("subjectName")
    .trim()
    .notEmpty()
    .withMessage("subjectName is required"),
  body("examDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("examDate must be a valid date"),
  body("topics")
    .isArray({ min: 1 })
    .withMessage("At least one topic is required"),
];

export const parseStudyPlanValidation = [
  body("sourceMode")
    .optional()
    .trim()
    .isIn(["text", "document", "manual", "prompt"])
    .withMessage("sourceMode must be one of: text, document, manual, prompt"),
];
