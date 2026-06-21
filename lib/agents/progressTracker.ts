import { db } from "../db";
import { userProgress } from "../schema";
import { eq } from "drizzle-orm";
import { createAgentLogger } from "./core";

export async function evaluateProgress(userId: string, logger: ReturnType<typeof createAgentLogger>) {
  logger.log("ProgressTracker", "Evaluating user learning trajectory...", "pending");
  try {
    const records = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    if (records.length === 0) {
      logger.log("ProgressTracker", "No previous history found.", "success");
      return { totalScore: 0, average: 0, topicMastery: {} };
    }
    let totalScore = 0; let totalQuestions = 0;
    const topicMastery: Record<string, { correct: number, total: number }> = {};
    for (const record of records) {
      totalScore += record.score; totalQuestions += record.total;
      if (!topicMastery[record.topic]) topicMastery[record.topic] = { correct: 0, total: 0 };
      topicMastery[record.topic].correct += record.score;
      topicMastery[record.topic].total += record.total;
    }
    const average = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    logger.log("ProgressTracker", `Analyzed ${records.length} interactions. Current average: ${average}%`, "success");
    return { totalScore, totalQuestions, average, topicMastery };
  } catch (error) {
    logger.log("ProgressTracker", "Failed to calculate trajectory.", "error");
    return { totalScore: 0, average: 0, topicMastery: {} };
  }
}
