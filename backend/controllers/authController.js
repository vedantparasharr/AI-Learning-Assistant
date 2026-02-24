import jwt from "jsonwebtoken";
import User from "../models/User";

// generate JWT token
const generateToken = (id) => {
  jwt.sign(
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
export const register = (req, res, next) => {};

// @desc login
// @route POST api/auth/login
// @access public
export const login = (req, res, next) => {};

// @desc get user profile
// @route GET api/auth/profile
// @access private
export const getProfile = async (req, res, next) => {};

// @desc update user profile
// @route PUT api/auth/profile
// @access private
export const updateProfile = async (req, res, next) => {};

// @desc change user password
// @route POST api/auth/profile
// @access private
export const changePassword = async (req, res, next) => {};
