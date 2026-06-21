import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = new Error("Not authorised");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      const error = new Error("User does not exist");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    next(error);
  }
};

export default protect;
