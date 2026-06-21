import { NextRequest, NextResponse } from "next/server";
import { createAgentLogger } from "@/lib/agents/core";
import { parseDocument, analyzeDocumentStructure } from "@/lib/agents/analyzer";
import { generateQuiz } from "@/lib/agents/questionGen";
import { db } from "@/lib/db";
import { documents, quizzes } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const logger = createAgentLogger();
  logger.log("Orchestrator", "Received new document upload request.", "pending");
  try {
    const formData = await req.formData(); const file = formData.get("file") as File;
    const userId = formData.get("userId") as string || "anonymous";
    if (!file) { logger.log("Orchestrator", "No file payload found.", "error"); return NextResponse.json({ error: "No file provided", logs: logger.getLogs() }, { status: 400 }); }
    
    logger.log("Orchestrator", `Handing off ${file.name} to Analyzer.`, "success");
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseDocument(buffer, file.type, logger);
    const analysis = await analyzeDocumentStructure(text, logger);
    
    logger.log("Orchestrator", "Saving parsed knowledge base to core database...", "pending");
    const docId = uuidv4();
    await db.insert(documents).values({ id: docId, userId, filename: file.name, content: text, parsedTopics: JSON.stringify(analysis.topics), createdAt: new Date() });
    logger.log("Orchestrator", "Knowledge base secured.", "success");

    logger.log("Orchestrator", "Triggering proactive QuestionGen Agent for base quiz.", "pending");
    const generatedQuestions = await generateQuiz(text, analysis.title, logger);
    const quizId = uuidv4();
    await db.insert(quizzes).values({ id: quizId, documentId: docId, topic: analysis.title || "General", questions: JSON.stringify(generatedQuestions), createdAt: new Date() });
    
    logger.log("Orchestrator", "Workflow completed. Returning operational state.", "success");
    return NextResponse.json({ success: true, docId, analysis, quizId, logs: logger.getLogs() });
  } catch (error: any) {
    logger.log("Orchestrator", `System Failure: ${error.message}`, "error"); return NextResponse.json({ error: "Processing failed", logs: logger.getLogs() }, { status: 500 });
  }
}
