import { prisma } from "@/lib/prisma";
import { CVProfile } from "@/schemas/cv-profile.schema";

export class AdaptedCVRepository {
  async findAll() {
    return prisma.adaptedCV.findMany({
      include: {
        jobOffer: {
          select: {
            empresa: true,
            puesto: true,
          },
        },
      },
      orderBy: { creadoEn: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.adaptedCV.findUnique({
      where: { id },
      include: {
        jobOffer: true,
        masterProfile: {
          select: {
            id: true,
            titulo: true,
            datosPersonales: true,
            experiencia: true,
            educacion: true,
            habilidades: true,
          },
        },
      },
    });
  }

  async findByJobOffer(jobOfferId: string) {
    return prisma.adaptedCV.findMany({
      where: { jobOfferId },
      orderBy: { version: "desc" },
    });
  }

  async create(masterProfileId: string, jobOfferId: string, contenidoJson: CVProfile, scoreATS = 0.0) {
    // Buscar la versión más alta para esta oferta de empleo para incrementarla
    const lastCV = await prisma.adaptedCV.findFirst({
      where: { jobOfferId },
      orderBy: { version: "desc" },
      select: { version: true },
    });

    const newVersion = lastCV ? lastCV.version + 1 : 1;

    return prisma.adaptedCV.create({
      data: {
        masterProfileId,
        jobOfferId,
        contenidoJson: contenidoJson as any,
        scoreATS,
        version: newVersion,
      },
    });
  }

  async updateContenido(id: string, contenidoJson: CVProfile, scoreATS?: number) {
    return prisma.adaptedCV.update({
      where: { id },
      data: {
        contenidoJson: contenidoJson as any,
        ...(scoreATS !== undefined ? { scoreATS } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.adaptedCV.delete({
      where: { id },
    });
  }
}
