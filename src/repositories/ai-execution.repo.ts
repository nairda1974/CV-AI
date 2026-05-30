import { prisma } from "@/lib/prisma";

export class AIExecutionRepository {
  async logExecution(data: {
    proveedor: string;
    modelo: string;
    duracionMs: number;
    promptTokens: number;
    completionTokens: number;
    estado: "SUCCESS" | "ERROR";
    error?: string;
  }) {
    return prisma.aIExecution.create({
      data: {
        proveedor: data.proveedor,
        modelo: data.modelo,
        duracionMs: data.duracionMs,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        estado: data.estado,
        error: data.error ?? null,
      },
    });
  }

  async getMetrics() {
    const executions = await prisma.aIExecution.findMany({
      orderBy: { creadoEn: "desc" },
      take: 50,
    });
    return executions;
  }
}
