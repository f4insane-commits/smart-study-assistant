import { NextRequest, NextResponse } from "next/server";
import { evaluateProgress } from "@/lib/agents/progressTracker";
import { createAgentLogger } from "@/lib/agents/core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const logger = createAgentLogger(); const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || "anonymous";
  const progress = await evaluateProgress(userId, logger);
  return NextResponse.json({ progress, logs: logger.getLogs() });
}
