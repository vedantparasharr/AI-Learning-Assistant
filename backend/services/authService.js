import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendOtpEmail } from "./emailService.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

// Generate a JWT token
export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// Issue verification OTP
export const issueOtpForUser = async (user) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  user.otpHash = otp;
  user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
  user.otpAttempts = 0;
  await user.save({ validateBeforeSave: false });

  await sendOtpEmail({
    toEmail: user.email,
    username: user.username,
    otp,
  });
};

export const registerUser = async ({ username, email, password }) => {
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    const error = new Error(
      userExists.email === email ? "Email is already in use" : "Username is already taken"
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    email,
    username,
    password,
    verified: false,
  });

  await issueOtpForUser(user);
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (!user.verified) {
    const error = new Error("Email not verified. Please verify OTP first.");
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { user, token };
};

export const verifyEmailOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.verified) {
    const token = generateToken(user._id);
    return { user, token, alreadyVerified: true };
  }

  if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    const error = new Error("OTP expired. Request a new one.");
    error.statusCode = 400;
    throw error;
  }

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
    const error = new Error("Too many invalid attempts. Request a new OTP.");
    error.statusCode = 429;
    throw error;
  }

  const isValidOtp = await user.matchOtp(otp);
  if (!isValidOtp) {
    user.otpAttempts += 1;
    await user.save({ validateBeforeSave: false });
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  user.verified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  return { user, token, alreadyVerified: false };
};

export const resendOtp = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.verified) {
    const error = new Error("Email already verified");
    error.statusCode = 400;
    throw error;
  }

  await issueOtpForUser(user);
};

export const updateUserProfile = async (userId, { username, email }) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (username || email) {
    const existing = await User.findOne({
      $or: [
        username ? { username } : null,
        email ? { email } : null
      ].filter(Boolean),
      _id: { $ne: userId },
    });

    if (existing) {
      const error = new Error(
        existing.email === email ? "Email is already in use" : "Username is already taken"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  if (username) user.username = username;
  if (email) user.email = email;
  await user.save();
  return user;
};

export const changeUserPassword = async (userId, { currentPassword, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    const error = new Error("New password and confirm password must match");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    const error = new Error("User does not exist");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();
};
