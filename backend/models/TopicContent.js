import mongoose from "mongoose";

const cachedVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    videoId: { type: String, default: "", trim: true },
    thumbnail: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
    seconds: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    authorName: { type: String, default: "", trim: true },
    score: { type: Number, default: 0 },
  },
  { _id: false },
);

const cachedFlashcardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const topicContentSchema = new mongoose.Schema(
  {
    topic_key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: cachedVideoSchema,
      default: null,
    },
    fallback_videos: {
      type: [cachedVideoSchema],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    flashcards: {
      type: [cachedFlashcardSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["generating", "ready", "failed"],
      default: "generating",
    },
  },
  { timestamps: true },
);

const TopicContent = mongoose.model("TopicContent", topicContentSchema);

export default TopicContent;
