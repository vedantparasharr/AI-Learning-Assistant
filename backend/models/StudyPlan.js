import mongoose from "mongoose";

const studyPlanTopicSchema = new mongoose.Schema(
  {
    topic_key: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    estimated_hours: {
      type: Number,
      default: 1,
      min: 0,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    completionStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { _id: false },
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["text", "document", "manual", "prompt"],
      default: "manual",
    },
    sourceText: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareSlug: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    topics: {
      type: [studyPlanTopicSchema],
      default: [],
    },
  },
  { timestamps: true },
);

studyPlanSchema.index({ userId: 1, "topics.topic_key": 1 });
studyPlanSchema.index({ shareSlug: 1 }, { unique: true, sparse: true });

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;
