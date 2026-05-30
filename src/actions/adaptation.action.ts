"use server";

import { AdaptedCVRepository } from "@/repositories/adapted-cv.repo";
import { JobOfferRepository } from "@/repositories/job-offer.repo";
import { MasterProfileRepository } from "@/repositories/master-profile.repo";
import { AIExecutionRepository } from "@/repositories/ai-execution.repo";
import { getAIProvider, runWithRetry } from "@/services/ai";
import { ZodCVProfile, CVProfile } from "@/schemas/cv-profile.schema";
import { revalidatePath } from "next/cache";

const adaptedCvRepo = new AdaptedCVRepository();
const jobOfferRepo = new JobOfferRepository();
const profileRepo = new MasterProfileRepository();
const aiLogRepo = new AIExecutionRepository();

export async function adaptCVAction(
  profileId: string,
  empresa: string,
  puesto: string,
  descripcionRaw: string
) {
  if (!profileId) return { success: false, error: "Debes seleccionar un perfil maestro." };
  if (!empresa.trim()) return { success: false, error: "El nombre de la empresa es obligatorio." };
  if (!puesto.trim()) return { success: false, error: "El puesto es obligatorio." };
  if (descripcionRaw.trim().length < 20) return { success: false, error: "La descripción de la oferta es demasiado corta." };

  const startTime = Date.now();
  const provider = getAIProvider();

  try {
    // 1. Obtener perfil maestro
    const profile = await profileRepo.findById(profileId);
    if (!profile) return { success: false, error: "Perfil maestro no encontrado." };

    const formattedProfile: CVProfile = {
      datosPersonales: profile.datosPersonales as any,
      experiencia: profile.experiencia as any,
      educacion: profile.educacion as any,
      habilidades: profile.habilidades as any,
    };

    // 2. Crear la Oferta de Empleo
    const jobOffer = await jobOfferRepo.create(empresa.trim(), puesto.trim(), descripcionRaw.trim());

    // 3. Ejecutar la IA de forma resiliente
    const { object, usage, modelUsed } = await runWithRetry(() =>
      provider.adaptCV(formattedProfile, descripcionRaw)
    );
    const duration = Date.now() - startTime;

    // Loguear ejecución de IA
    await aiLogRepo.logExecution({
      proveedor: process.env.AI_PROVIDER || "gemini",
      modelo: modelUsed,
      duracionMs: duration,
      promptTokens: usage?.promptTokens || 0,
      completionTokens: usage?.completionTokens || 0,
      estado: "SUCCESS",
    });

    // Validar respuesta estructurada
    const validated = ZodCVProfile.safeParse(object);
    if (!validated.success) {
      return { success: false, error: "La IA devolvió datos estructurados inválidos: " + validated.error.message };
    }

    // 4. Calcular un score ATS estimado basado en coincidencias de habilidades técnicas
    const skillsRequired = descripcionRaw.toLowerCase();
    const matches = validated.data.habilidades.filter((skill) =>
      skillsRequired.includes(skill.nombre.toLowerCase())
    ).length;
    const totalSkills = validated.data.habilidades.length || 1;
    const scoreATS = Math.min(100, Math.round((matches / totalSkills) * 60 + 40)); // Base de 40% + 60% por coincidencia

    // 5. Guardar la Adaptación con versionado
    const createdCV = await adaptedCvRepo.create(profileId, jobOffer.id, validated.data, scoreATS);

    revalidatePath("/");
    return { success: true, id: createdCV.id, adaptedData: validated.data };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await aiLogRepo.logExecution({
      proveedor: process.env.AI_PROVIDER || "gemini",
      modelo: "gemini-1.5-flash",
      duracionMs: duration,
      promptTokens: 0,
      completionTokens: 0,
      estado: "ERROR",
      error: error.message || "Error desconocido en adaptación de CV",
    });

    return {
      success: false,
      error: error.message || "Error al generar la adaptación con IA.",
    };
  }
}

export async function updateAdaptedCVAction(id: string, data: CVProfile) {
  const validated = ZodCVProfile.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Estructura de CV inválida: " + validated.error.message };
  }

  try {
    await adaptedCvRepo.updateContenido(id, validated.data);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar la adaptación." };
  }
}

export async function deleteAdaptedCVAction(id: string) {
  try {
    await adaptedCvRepo.delete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al eliminar la adaptación." };
  }
}
