import { getGeminiModel, HEAVY_MODEL, type AgentLog, createAgentLogger } from "./core";

export async function generateQuiz(documentText: string, contextTopic: string | null, logger: ReturnType<typeof createAgentLogger>) {
  logger.log("QuestionGen", `Generating questions${contextTopic ? ` for topic: ${contextTopic}` : ''}...`, "pending");
  const ai = getGeminiModel();
  const prompt = `Generate exactly 5 multiple choice questions based on the text. Range in difficulty. Return EXACTLY valid JSON:
  {
    "questions": [
      { "question": "?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 1, "explanation": "Why", "difficulty": "Easy" }
    ]
  }\nText:\n${documentText.substring(0, 8000)}`;

  const response = await ai.generateContent({ model: HEAVY_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
  try {
    const parsed = JSON.parse(response.text ?? "{}");
    logger.log("QuestionGen", `Successfully mapped ${parsed.questions?.length || 0} smart questions.`, "success");
    return parsed.questions || [];
  } catch (e) {
    logger.log("QuestionGen", "Failed to compile questions.", "error");
    return [];
  }
}
