"use server";

import { GroqProvider } from "@/services/ai/providers/groq.provider";
import { CVProfile } from "@/schemas/cv-profile.schema";

export async function optimizeForAtsAction(currentCV: CVProfile, jobDescription: string): Promise<CVProfile> {
  const aiProvider = new GroqProvider();
  
  try {
    const result = await aiProvider.optimizeCVForATS(currentCV, jobDescription);
    return result.object;
  } catch (error) {
    console.error("Error optimizing CV for ATS:", error);
    throw new Error("No se pudo optimizar el CV. Inténtalo de nuevo más tarde.");
  }
}
