import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizzes, userProgress } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createAgentLogger } from "@/lib/agents/core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const quizId = url.searchParams.get("quizId");
  if (!quizId) {
    const all = await db.select({ id: quizzes.id, topic: quizzes.topic, createdAt: quizzes.createdAt }).from(quizzes);
    return NextResponse.json({ quizzes: all });
  }
  const quizOpt = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (quizOpt.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ quiz: quizOpt[0] });
}

export async function POST(req: NextRequest) {
  const logger = createAgentLogger();
  logger.log("Orchestrator", "Routing quiz submission payload.", "pending");
  try {
    const { userId, quizId, topic, score, total } = await req.json();
    const id = uuidv4();
    await db.insert(userProgress).values({ id, userId: userId || "anonymous", quizId, topic, score, total, completedAt: new Date() });
    logger.log("ProgressTracker", `Stored user performance for topic "${topic}". Score: ${score}/${total}`, "success");
    logger.log("Orchestrator", "Workflow resolved.", "success");
    return NextResponse.json({ success: true, logs: logger.getLogs() });
  } catch (error: any) {
    logger.log("Orchestrator", `Failed: ${error.message}`, "error");
    return NextResponse.json({ error: "Failed to store progress", logs: logger.getLogs() }, { status: 500 });
  }
}
