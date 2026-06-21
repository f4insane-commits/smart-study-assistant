import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  filename: text("filename").notNull(),
  content: text("content").notNull(),
  parsedTopics: text("parsed_topics"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const quizzes = sqliteTable("quizzes", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull(),
  topic: text("topic").notNull(),
  questions: text("questions").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userProgress = sqliteTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  quizId: text("quiz_id").notNull(),
  topic: text("topic").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }).notNull(),
});
