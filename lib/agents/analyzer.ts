import pdf from "pdf-parse";
import mammoth from "mammoth";
import { type AgentLog, createAgentLogger, getGeminiModel, HEAVY_MODEL } from "./core";

export async function parseDocument(fileBuffer: Buffer, mimeType: string, logger: ReturnType<typeof createAgentLogger>) {
  logger.log("Analyzer", "Parsing document format...", "pending");
  let text = "";
  try {
    if (mimeType === "application/pdf") {
      logger.log("Analyzer", "Extracting text from PDF...", "pending");
      const data = await pdf(fileBuffer);
      text = data.text;
    } else if (mimeType.includes("word")) {
      logger.log("Analyzer", "Extracting text from DOCX...", "pending");
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      text = fileBuffer.toString("utf-8");
    }
    logger.log("Analyzer", `Successfully extracted ${text.length} chars.`, "success");
    return text.substring(0, 35000);
  } catch (error) {
    logger.log("Analyzer", "Failed to parse document format.", "error");
    throw error;
  }
}

export async function analyzeDocumentStructure(text: string, logger: ReturnType<typeof createAgentLogger>) {
  logger.log("Analyzer", "Analyzing core concepts and topics...", "pending");
  const ai = getGeminiModel();
  const prompt = `Extract main topics and return a structured JSON breakdown. Return ONLY valid JSON in format: {"title": "Title", "summary": "summary", "topics": ["topic1"]}\nText:\n${text}`;
  const response = await ai.generateContent({ model: HEAVY_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
  try {
    const parsed = JSON.parse(response.text ?? "{}");
    logger.log("Analyzer", `Identified ${parsed.topics?.length || 0} core topics.`, "success");
    return parsed;
  } catch (e) {
    logger.log("Analyzer", "Failed to parse concepts.", "error");
    return { title: "Unknown", summary: "Failed to summarize.", topics: [] };
  }
}
