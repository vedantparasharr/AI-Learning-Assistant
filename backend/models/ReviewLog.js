import mongoose from "mongoose";

/**
 * ReviewLog Schema for tracking historical flashcard review activity.
 * This ensures accurate GitHub-style activity heatmaps.
 */
const reviewLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashcard",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4], // Again, Hard, Good, Easy
    },
    state: {
      type: Number,
      required: true,
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: false },
);

// Index for fast dashboard heatmap aggregation
reviewLogSchema.index({ userId: 1, reviewedAt: 1 });

const ReviewLog = mongoose.model("ReviewLog", reviewLogSchema);

export default ReviewLog;
