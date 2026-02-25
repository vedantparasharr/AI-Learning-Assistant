import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorised",
        statusCode: 401,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User does not exist",
        statusCode: 401,
      });
    }
    next();
  } catch (error) {
    console.error("Auth middleware attack: ", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token is expired",
        statusCode: 401,
      });
    }
    return res.status(401).json({
      success: false,
      error: "Not authorised",
      statusCode: 401,
    });
  }
};

export default protect;
