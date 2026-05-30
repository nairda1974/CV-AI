import { prisma } from "@/lib/prisma";

export class JobOfferRepository {
  async findAll() {
    return prisma.jobOffer.findMany({
      orderBy: { creadoEn: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.jobOffer.findUnique({
      where: { id },
    });
  }

  async create(empresa: string, puesto: string, descripcionRaw: string) {
    return prisma.jobOffer.create({
      data: {
        empresa,
        puesto,
        descripcionRaw,
      },
    });
  }

  async delete(id: string) {
    return prisma.jobOffer.delete({
      where: { id },
    });
  }
}
