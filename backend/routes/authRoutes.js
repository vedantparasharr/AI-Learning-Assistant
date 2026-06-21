import express from "express";

import {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  verifyEmailOtp,
  resendOtp,
} from "../controllers/authController.js";

import protect from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  changePasswordValidation,
  emailValidation,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  verifyOtpValidation,
} from "../validators/authValidators.js";
const router = express.Router();

// Public routes
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", logout);
router.post("/verify-email", verifyOtpValidation, validateRequest, verifyEmailOtp);
router.post("/resend-otp", emailValidation, validateRequest, resendOtp);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidation, validateRequest, updateProfile);
router.post("/change-password", protect, changePasswordValidation, validateRequest, changePassword);

export default router;
