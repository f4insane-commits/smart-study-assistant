import { getGeminiModel, HEAVY_MODEL, createAgentLogger } from "./core";

export async function explainConcept(concept: string, documentContext: string, logger: ReturnType<typeof createAgentLogger>) {
  logger.log("Explainer", `Preparing a deep explanation for: "${concept}"`, "pending");
  const ai = getGeminiModel();
  const prompt = `You are the Concept Explainer Agent. Understand: "${concept}". Create engaging explanation with analogies. Context: \n${documentContext.substring(0, 5000)}`;
  const response = await ai.generateContent({ model: HEAVY_MODEL, contents: prompt });
  logger.log("Explainer", `Explanation compiled and optimized for clarity.`, "success");
  return response.text ?? "";
}
