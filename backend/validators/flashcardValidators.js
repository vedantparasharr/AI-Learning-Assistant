import { body, param } from "express-validator";

export const reviewFlashcardValidation = [
  param("cardId")
    .isMongoId()
    .withMessage("Invalid card ID"),
  body("rating")
    .trim()
    .toLowerCase()
    .isIn(["again", "hard", "good", "easy"])
    .withMessage("rating must be one of: again, hard, good, easy"),
];

export const topicKeyParamValidation = [
  param("topicKey")
    .trim()
    .notEmpty()
    .withMessage("topicKey is required"),
];
