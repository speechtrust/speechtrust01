import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: String,
  readTime: Number,
  answerTime: Number,
  weight: Number,
  order: Number
});

export const Question = mongoose.model('Question', questionSchema);
