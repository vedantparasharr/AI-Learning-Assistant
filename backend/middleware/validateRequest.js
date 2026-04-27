import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array();
  const firstMessage = errors[0]?.msg || "Validation failed";

  return res.status(400).json({
    success: false,
    error: firstMessage,
    statusCode: 400,
    details: errors,
  });
};

export default validateRequest;
