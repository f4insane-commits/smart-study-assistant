import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  content: { type: String, required: true },
  parsedTopics: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const QuizSchema = new Schema({
  _id: { type: String, required: true },
  documentId: { type: String, required: true },
  topic: { type: String, required: true },
  questions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserProgressSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  quizId: { type: String, required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

export const DocModel = mongoose.models.Document || mongoose.model("Document", DocumentSchema);
export const QuizModel = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
export const UserProgressModel = mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema);
