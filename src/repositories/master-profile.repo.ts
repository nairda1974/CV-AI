import { prisma } from "@/lib/prisma";
import { CVProfile } from "@/schemas/cv-profile.schema";

export interface MasterProfileSummary {
  id: string;
  titulo: string;
  datosPersonales: any;
  creadoEn: Date;
}

export class MasterProfileRepository {
  async getSummaries(): Promise<MasterProfileSummary[]> {
    return prisma.masterProfile.findMany({
      select: {
        id: true,
        titulo: true,
        datosPersonales: true,
        creadoEn: true,
      },
      orderBy: { creadoEn: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.masterProfile.findUnique({
      where: { id },
    });
  }

  async getPhoto(id: string): Promise<string | null> {
    const res = await prisma.masterProfile.findUnique({
      where: { id },
      select: { fotoBase64: true },
    });
    return res?.fotoBase64 ?? null;
  }

  async create(titulo: string, profileData: CVProfile, fotoBase64?: string) {
    return prisma.masterProfile.create({
      data: {
        titulo,
        datosPersonales: profileData.datosPersonales,
        experiencia: profileData.experiencia,
        educacion: profileData.educacion,
        habilidades: profileData.habilidades,
        fotoBase64: fotoBase64 ?? null,
      },
    });
  }

  async update(id: string, profileData: CVProfile, fotoBase64?: string) {
    return prisma.masterProfile.update({
      where: { id },
      data: {
        datosPersonales: profileData.datosPersonales,
        experiencia: profileData.experiencia,
        educacion: profileData.educacion,
        habilidades: profileData.habilidades,
        ...(fotoBase64 !== undefined ? { fotoBase64 } : {}),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.masterProfile.delete({ where: { id } });
  }
}
