import * as authService from "../services/authService.js";

// Returns cookie options based on actual request protocol
const getCookieOptions = (req, maxAge = 7 * 24 * 60 * 60 * 1000) => {
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
    maxAge,
  };
};

// @desc Register
// @route POST api/auth/register
// @access public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser({ username, email, password });

    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true,
      },
      message: "Account created. OTP sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login
// @route POST api/auth/login
// @access public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });

    res.cookie("token", token, getCookieOptions(req));

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Logout
// @route POST api/auth/logout
// @access public
export const logout = (req, res) => {
  res.clearCookie("token", getCookieOptions(req, 0));
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc Get user profile
// @route GET api/auth/profile
// @access private
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT api/auth/profile
// @access private
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await authService.updateUserProfile(req.user._id, {
      username,
      email,
      profileImage,
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change user password
// @route POST api/auth/change-password
// @access private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    await authService.changeUserPassword(req.user._id, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify email using OTP
// @route POST api/auth/verify-email
// @access public
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { user, token, alreadyVerified } = await authService.verifyEmailOtp({ email, otp });

    res.cookie("token", token, getCookieOptions(req));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: alreadyVerified ? "Email already verified" : "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Resend OTP for email verification
// @route POST api/auth/resend-otp
// @access public
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.resendOtp({ email });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
