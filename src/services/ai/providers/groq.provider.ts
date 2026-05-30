import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { AIProvider } from "./provider.interface";
import { ZodCVProfile, CVProfile } from "@/schemas/cv-profile.schema";

export class GroqProvider implements AIProvider {
  private modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  private groq = createGroq({
    apiKey: process.env.GROQ_API_KEY || "",
  });

  /**
   * Extrae JSON validado de forma manual para evitar el fallo de "json_schema" de generateObject
   */
  private async generateValidatedJSON(prompt: string, schema: any, retries = 2) {
    // Inject zod schema requirements into prompt
    import("zod-to-json-schema").then((zodToJsonSchema) => {
        // En producción podrías pasarle el json schema convertido. Por simplicidad pediremos JSON.
    });

    const systemPrompt = `Eres un sistema backend automatizado. Tu única salida DEBE ser un objeto JSON puro, válido y minificado. NUNCA escribas texto antes o después del JSON. NO uses formato markdown (ni las marcas de bloque de código de json). SOLO devuelve las llaves del objeto JSON.`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await generateText({
          model: this.groq(this.modelName),
          system: systemPrompt,
          prompt: prompt,
          temperature: 0.1, // Temperatura baja para que sea determinista
        });

        // Extraer y limpiar posible markdown si el LLM lo incluye a pesar de las instrucciones
        let text = response.text.trim();
        if (text.startsWith("```json")) text = text.replace(/^```json/, "");
        if (text.startsWith("```")) text = text.replace(/^```/, "");
        if (text.endsWith("```")) text = text.replace(/```$/, "");
        text = text.trim();

        // 1. Parseo nativo
        const parsedJSON = JSON.parse(text);
        
        // 2. Validación estricta con Zod
        const validatedData = schema.parse(parsedJSON); 
        
        return { object: validatedData as CVProfile, usage: response.usage, text };
      } catch (error: any) {
        console.error(`Intento ${attempt} fallido:`, error.message);
        if (attempt === retries) {
          throw new Error(`Fallo tras ${retries} intentos. Error final: ${error.message}`);
        }
      }
    }
    throw new Error("Fallo inesperado durante la generación.");
  }

  async extractProfile(text: string) {
    const prompt = `Analiza el siguiente texto de un CV (curriculum vitae) y extrae toda la información de manera estructurada.
    
Devuelve un JSON exacto que cumpla estrictamente con este formato:
{
  "datosPersonales": {
    "nombre": "string (obligatorio)",
    "email": "string (correo válido o 'No especificado@ejemplo.com')",
    "telefono": "string (obligatorio)",
    "ubicacion": "string (obligatorio)",
    "linkedin": "string o cadena vacía",
    "github": "string o cadena vacía",
    "portfolio": "string o cadena vacía"
  },
  "experiencia": [
    {
      "empresa": "string",
      "puesto": "string",
      "fechaInicio": "Mes de Año (ej. Septiembre de 2021)",
      "fechaFin": "Mes de Año o 'Actualidad'",
      "descripcion": "string (al menos 10 caracteres explicativos)",
      "logros": ["string"]
    }
  ],
  "educacion": [
    {
      "institucion": "string",
      "titulo": "string",
      "fechaInicio": "Mes de Año",
      "fechaFin": "Mes de Año o 'Actualidad'"
    }
  ],
  "habilidades": [
    {
      "nombre": "string",
      "categoria": "frontend" | "backend" | "database" | "cloud" | "devops" | "soft-skill" | "other"
    }
  ]
}

IMPORTANTE: 
1. La "categoria" de habilidades DEBE ser exactamente una de estas: "frontend", "backend", "database", "cloud", "devops", "soft-skill", "other". NUNCA uses otra palabra.
2. Si falta algún dato personal obligatorio, pon "No especificado".
3. Los 'logros' deben ser un array con al menos 1 elemento.

Texto del CV:
${text}`;

    const result = await this.generateValidatedJSON(prompt, ZodCVProfile);

    return {
      object: result.object,
      usage: result.usage,
      modelUsed: this.modelName,
    };
  }

  async adaptCV(profile: CVProfile, jobDescription: string) {
    const prompt = `Adapta el siguiente currículum vitae (CV) maestro para que se ajuste a la oferta de trabajo indicada.
Sigue estas directrices:
1. Reorganiza y reescribe los logros y descripciones de experiencia para destacar lo más relevante para el puesto.
2. Identifica habilidades técnicas y blandas que coincidan con los requerimientos de la oferta.
3. No inventes experiencia laboral ni educación ficticia. Mantente honesto respecto al CV maestro.
4. Redacta de forma atractiva para pasar filtros ATS.

Devuelve EXACTAMENTE la misma estructura JSON que se ha proporcionado en el CV maestro.
IMPORTANTE: 
- El objeto "datosPersonales" debe mantenerse íntegro.
- La "categoria" de cualquier habilidad DEBE ser una de estas palabras literales: "frontend", "backend", "database", "cloud", "devops", "soft-skill", "other". ¡Ninguna más!
- EXPRESA TODAS LAS FECHAS EN FORMATO HUMANO (ej. "Septiembre de 2025" o "Actualidad"). NUNCA uses números como "2025-09".

CV Maestro:
${JSON.stringify(profile, null, 2)}

Oferta de Trabajo:
${jobDescription}`;

    const result = await this.generateValidatedJSON(prompt, ZodCVProfile);

    return {
      object: result.object,
      usage: result.usage,
      modelUsed: this.modelName,
    };
  }

  async optimizeCVForATS(profile: CVProfile, jobDescription: string) {
    const prompt = `Eres un experto en optimización de currículums para sistemas ATS (Applicant Tracking Systems).
Tu tarea es tomar el CV actual y afinarlo al MÁXIMO para que encaje perfectamente con la oferta de trabajo provista, SIN MENTIR NI INVENTAR DATOS.

Reglas estrictas:
1. Reescribe los "logros" y la "descripcion" de cada experiencia utilizando las mismas palabras clave (keywords) exactas que aparecen en la oferta.
2. Si el candidato tiene habilidades que encajan con la oferta, destácalas o sube su prioridad.
3. EXPRESA TODAS LAS FECHAS EN FORMATO HUMANO (ej. "Septiembre de 2025" o "Actualidad"). No uses números como "2025-09".
4. NO INVENTES experiencia laboral, años de experiencia, ni educación que no exista en el CV original. Solo optimiza la semántica y el vocabulario.
5. MÁXIMA PRIORIDAD (SÍNTESIS 1 PÁGINA): Reduce agresivamente el contenido para que el CV final ocupe obligatoriamente 1 sola página. Resume brutalmente. Deja MÁXIMO 3 viñetas (logros) por experiencia laboral. Filtra información no relevante. Sé extremadamente conciso y denso.

Devuelve EXACTAMENTE la misma estructura JSON que se ha proporcionado.

CV Actual:
${JSON.stringify(profile, null, 2)}

Oferta de Trabajo:
${jobDescription}`;

    const result = await this.generateValidatedJSON(prompt, ZodCVProfile);

    return {
      object: result.object,
      usage: result.usage,
      modelUsed: this.modelName,
    };
  }
}
