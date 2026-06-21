import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuizModel, UserProgressModel } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";
import { createAgentLogger } from "@/lib/agents/core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const quizId = url.searchParams.get("quizId");
  await connectDB();
  if (!quizId) {
    const all = await QuizModel.find({}).select("_id topic createdAt").lean();
    return NextResponse.json({ quizzes: all.map(q => ({ id: q._id, topic: q.topic, createdAt: q.createdAt })) });
  }
  const quizOpt = await QuizModel.findById(quizId).lean();
  if (!quizOpt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ quiz: { ...quizOpt, id: quizOpt._id } });
}

export async function POST(req: NextRequest) {
  const logger = createAgentLogger();
  logger.log("Orchestrator", "Routing quiz submission payload.", "pending");
  try {
    const { userId, quizId, topic, score, total } = await req.json();
    const id = uuidv4();
    await connectDB();
    await UserProgressModel.create({ _id: id, userId: userId || "anonymous", quizId, topic, score, total, completedAt: new Date() });
    logger.log("ProgressTracker", `Stored user performance for topic "${topic}". Score: ${score}/${total}`, "success");
    logger.log("Orchestrator", "Workflow resolved.", "success");
    return NextResponse.json({ success: true, logs: logger.getLogs() });
  } catch (error: any) {
    logger.log("Orchestrator", `Failed: ${error.message}`, "error");
    return NextResponse.json({ error: "Failed to store progress", logs: logger.getLogs() }, { status: 500 });
  }
}
