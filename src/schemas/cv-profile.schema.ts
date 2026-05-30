import { z } from "zod";

export const SkillCategorySchema = z.enum([
  "frontend",
  "backend",
  "database",
  "cloud",
  "devops",
  "soft-skill",
  "other",
]);

export const SkillSchema = z.object({
  nombre: z.string().min(1, "El nombre de la habilidad es obligatorio"),
  categoria: SkillCategorySchema,
});

export const ExperienceSchema = z.object({
  empresa: z.string().min(2, "El nombre de la empresa es obligatorio"),
  puesto: z.string().min(2, "El puesto es obligatorio"),
  fechaInicio: z.string().min(4, "Fecha de inicio requerida"),
  fechaFin: z.string().min(4, "Fecha de fin requerida (o 'Presente')"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  logros: z.array(z.string().min(5)).nonempty("Debe incluir al menos un logro significativo"),
});

export const EducationSchema = z.object({
  institucion: z.string().min(2, "La institución es obligatoria"),
  titulo: z.string().min(2, "El título obtenido es obligatorio"),
  fechaInicio: z.string().min(4, "Fecha de inicio requerida"),
  fechaFin: z.string().min(4, "Fecha de fin requerida"),
});

export const PersonalDataSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Formato de email inválido"),
  telefono: z.string().min(5, "Número de teléfono inválido"),
  ubicacion: z.string().min(2, "La ubicación es obligatoria"),
  linkedin: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  portfolio: z.string().url("URL de Portfolio inválida").optional().or(z.literal("")),
});

export const ZodCVProfile = z.object({
  datosPersonales: PersonalDataSchema,
  experiencia: z.array(ExperienceSchema),
  educacion: z.array(EducationSchema),
  habilidades: z.array(SkillSchema),
});

export type CVProfile = z.infer<typeof ZodCVProfile>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type PersonalData = z.infer<typeof PersonalDataSchema>;
