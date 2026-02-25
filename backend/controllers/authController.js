import jwt from "jsonwebtoken";
import User from "../models/User.js";

// generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
};

// @desc Register
// @route POST api/auth/register
// @access public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email is already registered with our platform"
            : "Username is taken",
        statusCode: 400,
      });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      password,
    });

    // Generate token
    const token = generateToken(user._id);
    res.status(201).json({
      status: true,
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
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc login
// @route POST api/auth/login
// @access public
export const login = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc get user profile
// @route GET api/auth/profile
// @access private
export const getProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc update user profile
// @route PUT api/auth/profile
// @access private
export const updateProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc change user password
// @route POST api/auth/profile
// @access private
export const changePassword = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
