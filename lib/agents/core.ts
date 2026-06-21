import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const ORCHESTRATOR_MODEL = "gemini-3.5-flash";
export const HEAVY_MODEL = "gemini-3.5-flash";

export type AgentLog = {
  id: string;
  agent: "Orchestrator" | "Analyzer" | "QuestionGen" | "Explainer" | "ProgressTracker";
  message: string;
  status: "pending" | "success" | "error";
  timestamp: number;
};

export function createAgentLogger() {
  const logs: AgentLog[] = [];
  return {
    log: (agent: AgentLog['agent'], message: string, status: AgentLog['status'] = "success") => {
      logs.push({ id: Math.random().toString(), agent, message, status, timestamp: Date.now() });
      console.log(`[${agent}] ${message}`);
    },
    getLogs: () => logs
  };
}

export const getGeminiModel = () => ai.models;
