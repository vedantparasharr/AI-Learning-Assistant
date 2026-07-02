import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email must be a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    otpHash: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Hash password and Otp before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("otpHash") && this.otpHash) {
    this.otpHash = hashOtp(this.otpHash);
  }
});

// Compare entered OTP with hashed OTP
userSchema.methods.matchOtp = async function (otp) {
  return this.otpHash === hashOtp(otp);
};

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
