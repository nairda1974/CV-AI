"use server";

import { MasterProfileRepository } from "@/repositories/master-profile.repo";
import { AIExecutionRepository } from "@/repositories/ai-execution.repo";
import { getAIProvider, runWithRetry } from "@/services/ai";
import { ZodCVProfile, CVProfile } from "@/schemas/cv-profile.schema";
import { extractText } from "@/lib/pdf/parser";
import { revalidatePath } from "next/cache";

const profileRepo = new MasterProfileRepository();
const aiLogRepo = new AIExecutionRepository();

export async function extractProfileFromTextAction(titulo: string, text: string, fotoBase64?: string) {
  if (!titulo || titulo.trim().length < 3) {
    return { success: false, error: "El título debe tener al menos 3 caracteres." };
  }
  if (!text || text.trim().length < 10) {
    return { success: false, error: "El texto del CV debe tener al menos 10 caracteres." };
  }

  const startTime = Date.now();
  const provider = getAIProvider();

  try {
    // LLamada resiliente a la IA para extraer la estructura del CV
    const { object, usage, modelUsed } = await runWithRetry(() => provider.extractProfile(text));
    const duration = Date.now() - startTime;

    // Loguear ejecución exitosa
    await aiLogRepo.logExecution({
      proveedor: process.env.AI_PROVIDER || "gemini",
      modelo: modelUsed,
      duracionMs: duration,
      promptTokens: usage?.promptTokens || 0,
      completionTokens: usage?.completionTokens || 0,
      estado: "SUCCESS",
    });

    // Validar el objeto resultante con Zod por seguridad extra
    const validated = ZodCVProfile.safeParse(object);
    if (!validated.success) {
      return { success: false, error: "La IA generó una estructura inválida: " + validated.error.message };
    }

    // Persistir en PostgreSQL
    const created = await profileRepo.create(titulo, validated.data, fotoBase64);

    revalidatePath("/");
    return { success: true, id: created.id };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await aiLogRepo.logExecution({
      proveedor: process.env.AI_PROVIDER || "gemini",
      modelo: "gemini-1.5-flash",
      duracionMs: duration,
      promptTokens: 0,
      completionTokens: 0,
      estado: "ERROR",
      error: error.message || "Error desconocido en extracción",
    });

    return {
      success: false,
      error: error.message || "Error al procesar el CV con la Inteligencia Artificial.",
    };
  }
}

export async function createProfileDirectAction(titulo: string, data: CVProfile, fotoBase64?: string) {
  const validated = ZodCVProfile.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Datos del perfil inválidos: " + validated.error.message };
  }

  try {
    const created = await profileRepo.create(titulo, validated.data, fotoBase64);
    revalidatePath("/");
    return { success: true, id: created.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al guardar el perfil." };
  }
}

export async function updateProfileAction(id: string, data: CVProfile, fotoBase64?: string) {
  const validated = ZodCVProfile.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Datos del perfil inválidos: " + validated.error.message };
  }

  try {
    await profileRepo.update(id, validated.data, fotoBase64);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar el perfil." };
  }
}

export async function deleteProfileAction(id: string) {
  try {
    await profileRepo.delete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al eliminar el perfil." };
  }
}

export async function createProfileFromPDFAction(titulo: string, fileData: FormData, fotoBase64?: string) {
  try {
    const file = fileData.get("file") as File;
    if (!file) {
      return { success: false, error: "Archivo de PDF no encontrado." };
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractText(buffer);
    return await extractProfileFromTextAction(titulo, text, fotoBase64);
  } catch (error: any) {
    return { success: false, error: error.message || "Error extrayendo texto del PDF." };
  }
}
