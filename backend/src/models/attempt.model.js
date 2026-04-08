import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  transcript: String,
  score: Number,
  weight: Number,
  submittedEarly: Boolean,
  breakdown: Object,
  metrics: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Attempt = mongoose.model('Attempt', attemptSchema);
