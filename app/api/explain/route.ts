import { NextRequest, NextResponse } from "next/server";
import { createAgentLogger } from "@/lib/agents/core";
import { explainConcept } from "@/lib/agents/explainer";
import { evaluateProgress } from "@/lib/agents/progressTracker";
import { connectDB } from "@/lib/db";
import { DocModel } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const logger = createAgentLogger();
  logger.log("Orchestrator", "Routing topic explanation request.", "pending");
  try {
    const { docId, concept, userId } = await req.json();
    let context = "";
    if (docId) {
       await connectDB();
       const doc = await DocModel.findById(docId).lean();
       if (doc) context = doc.content;
    }
    const explanation = await explainConcept(concept, context, logger);
    if (userId) {
       logger.log("Orchestrator", "Requesting ProgressTracker to evaluate engagement...", "pending");
       await evaluateProgress(userId, logger);
       logger.log("Orchestrator", "Orchestration fully satisfied.", "success");
    }
    return NextResponse.json({ success: true, explanation, logs: logger.getLogs() });
  } catch (error: any) {
    logger.log("Orchestrator", `System Failure: ${error.message}`, "error");
    return NextResponse.json({ error: "Processing failed", logs: logger.getLogs() }, { status: 500 });
  }
}
