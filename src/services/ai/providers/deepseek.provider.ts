import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AIProvider } from "./provider.interface";
import { ZodCVProfile, CVProfile } from "@/schemas/cv-profile.schema";

export class DeepSeekProvider implements AIProvider {
  private modelName = "deepseek-chat";

  private getClient() {
    return createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseURL: "https://api.deepseek.com",
    });
  }

  async extractProfile(text: string) {
    const client = this.getClient();
    const response = await generateObject({
      model: client(this.modelName),
      schema: ZodCVProfile,
      prompt: `Analiza el siguiente texto de un CV (curriculum vitae) y extrae toda la información de manera estructurada respetando el esquema de datos requerido. Asegúrate de categorizar adecuadamente cada habilidad.

Texto del CV:
${text}`,
    });

    return {
      object: response.object,
      usage: response.usage,
      modelUsed: this.modelName,
    };
  }

  async adaptCV(profile: CVProfile, jobDescription: string) {
    const client = this.getClient();
    const response = await generateObject({
      model: client(this.modelName),
      schema: ZodCVProfile,
      prompt: `Adapta el siguiente currículum vitae (CV) maestro para que se ajuste a la oferta de trabajo indicada.
Sigue estas directrices:
1. Reorganiza y reescribe los logros y descripciones de experiencia para destacar lo más relevante para el puesto.
2. Identifica habilidades técnicas y blandas que coincidan con los requerimientos de la oferta.
3. No inventes experiencia laboral ni educación ficticia. Mantente honesto respecto al CV maestro.
4. Redacta el perfil de forma atractiva para pasar filtros ATS.

CV Maestro:
${JSON.stringify(profile, null, 2)}

Oferta de Trabajo:
${jobDescription}`,
    });

    return {
      object: response.object,
      usage: response.usage,
      modelUsed: this.modelName,
    };
  }
}
