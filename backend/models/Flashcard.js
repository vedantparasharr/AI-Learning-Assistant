import mongoose from "mongoose";
import { State } from "ts-fsrs";

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic_key: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["starter", "topic"],
      default: "starter",
    },
    status: {
      type: String,
      enum: ["locked", "active"],
      default: "active",
    },
    due: {
      type: Date,
      default: Date.now,
      required: true,
    },
    stability: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: Number,
      default: 0,
    },
    elapsed_days: {
      type: Number,
      default: 0,
    },
    scheduled_days: {
      type: Number,
      default: 0,
    },
    learning_steps: {
      type: Number,
      default: 0,
    },
    reps: {
      type: Number,
      default: 0,
    },
    lapses: {
      type: Number,
      default: 0,
    },
    state: {
      type: Number,
      enum: [State.New, State.Learning, State.Review, State.Relearning],
      default: State.New,
    },
    last_review: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

flashcardSchema.index({ userId: 1, topic_key: 1, due: 1, status: 1 });

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;
