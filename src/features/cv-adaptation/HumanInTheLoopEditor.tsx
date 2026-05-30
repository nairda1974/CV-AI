"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CVProfile, SkillCategory } from "@/schemas/cv-profile.schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import dynamic from "next/dynamic";

const LazyPDFButton = dynamic(() => import("./LazyPDFButton"), {
  ssr: false,
  loading: () => <Button disabled>Preparando visor PDF...</Button>,
});

interface Props {
  initialData: CVProfile;
  onSave?: (data: CVProfile) => Promise<void>;
}

export default function HumanInTheLoopEditor({ initialData, onSave }: Props) {
  const [data, setData] = useState<CVProfile>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<"modern" | "classic" | "creative">("modern");
  const [themeColor, setThemeColor] = useState<string>("#4F46E5");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange("fotoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalChange = (key: keyof typeof data.datosPersonales, val: string) => {
    setData((prev) => ({
      ...prev,
      datosPersonales: { ...prev.datosPersonales, [key]: val },
    }));
  };

  // Experiencia
  const handleExperienceChange = (index: number, key: string, val: any) => {
    setData((prev) => {
      const copy = [...prev.experiencia];
      copy[index] = { ...copy[index], [key]: val };
      return { ...prev, experiencia: copy };
    });
  };

  const handleLogroChange = (expIdx: number, logroIdx: number, val: string) => {
    setData((prev) => {
      const copy = [...prev.experiencia];
      const logrosCopy = [...copy[expIdx].logros];
      logrosCopy[logroIdx] = val;
      copy[expIdx] = { ...copy[expIdx], logros: logrosCopy as any };
      return { ...prev, experiencia: copy };
    });
  };

  const addLogro = (expIdx: number) => {
    setData((prev) => {
      const copy = [...prev.experiencia];
      copy[expIdx] = {
        ...copy[expIdx],
        logros: [...copy[expIdx].logros, "Nuevo logro destacado"] as any,
      };
      return { ...prev, experiencia: copy };
    });
  };

  const removeLogro = (expIdx: number, logroIdx: number) => {
    setData((prev) => {
      const copy = [...prev.experiencia];
      copy[expIdx] = {
        ...copy[expIdx],
        logros: copy[expIdx].logros.filter((_, i) => i !== logroIdx) as any,
      };
      return { ...prev, experiencia: copy };
    });
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experiencia: [
        ...prev.experiencia,
        {
          empresa: "Nueva Empresa",
          puesto: "Nuevo Puesto",
          fechaInicio: "Año",
          fechaFin: "Actualidad",
          descripcion: "Descripción de responsabilidades",
          logros: ["Logro importante"] as any,
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      experiencia: prev.experiencia.filter((_, i) => i !== index),
    }));
  };

  // Educación
  const handleEducationChange = (index: number, key: string, val: string) => {
    setData((prev) => {
      const copy = [...prev.educacion];
      copy[index] = { ...copy[index], [key]: val };
      return { ...prev, educacion: copy };
    });
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      educacion: [
        ...prev.educacion,
        {
          institucion: "Nueva Institución",
          titulo: "Nuevo Título",
          fechaInicio: "Año",
          fechaFin: "Año",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      educacion: prev.educacion.filter((_, i) => i !== index),
    }));
  };

  // Habilidades
  const handleSkillChange = (index: number, key: "nombre" | "categoria", val: string) => {
    setData((prev) => {
      const copy = [...prev.habilidades];
      copy[index] = { ...copy[index], [key]: val } as any;
      return { ...prev, habilidades: copy };
    });
  };

  const addSkill = () => {
    setData((prev) => ({
      ...prev,
      habilidades: [...prev.habilidades, { nombre: "Habilidad", categoria: "other" }],
    }));
  };

  const removeSkill = (index: number) => {
    setData((prev) => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index),
    }));
  };

  const handleSaveClick = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 border rounded-lg shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Human-in-the-Loop: Edición y Ajuste Fino
          </h2>
          <p className="text-xs text-muted-foreground">
            Modifica y refina cualquier detalle de la adaptación generada antes de exportar el PDF.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {onSave && (
            <Button onClick={handleSaveClick} disabled={isSaving} variant="outline" className="w-full sm:w-auto">
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          )}
          <div className="w-full sm:w-auto flex">
            <LazyPDFButton cvData={data} template={template} themeColor={themeColor} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="datos" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          <TabsTrigger value="datos" className="rounded-md font-medium text-xs sm:text-sm">Contacto</TabsTrigger>
          <TabsTrigger value="experiencia" className="rounded-md font-medium text-xs sm:text-sm">Experiencia</TabsTrigger>
          <TabsTrigger value="educacion" className="rounded-md font-medium text-xs sm:text-sm">Educación</TabsTrigger>
          <TabsTrigger value="habilidades" className="rounded-md font-medium text-xs sm:text-sm">Skills</TabsTrigger>
          <TabsTrigger value="diseno" className="rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-indigo-100 to-rose-100 text-indigo-700 data-[state=active]:from-indigo-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">Diseño</TabsTrigger>
        </TabsList>

        {/* DATOS PERSONALES */}
        <TabsContent value="datos" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Información Personal y Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid-cols-1 md:col-span-2 space-y-1 mb-2">
                  <label className="text-xs font-semibold text-slate-500">Fotografía de Perfil (Opcional)</label>
                  <div className="flex items-center gap-4">
                    {data.datosPersonales.fotoUrl && (
                      <img src={data.datosPersonales.fotoUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="cursor-pointer file:text-sm file:font-semibold file:text-indigo-600 file:bg-indigo-50 file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Nombre Completo</label>
                  <Input
                    value={data.datosPersonales.nombre}
                    onChange={(e) => handlePersonalChange("nombre", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Email</label>
                  <Input
                    type="email"
                    value={data.datosPersonales.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Teléfono</label>
                  <Input
                    value={data.datosPersonales.telefono}
                    onChange={(e) => handlePersonalChange("telefono", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Ubicación</label>
                  <Input
                    value={data.datosPersonales.ubicacion}
                    onChange={(e) => handlePersonalChange("ubicacion", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">LinkedIn (URL)</label>
                  <Input
                    value={data.datosPersonales.linkedin}
                    onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">GitHub (URL)</label>
                  <Input
                    value={data.datosPersonales.github}
                    onChange={(e) => handlePersonalChange("github", e.target.value)}
                  />
                </div>
                <div className="grid-cols-1 md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Portfolio (URL)</label>
                  <Input
                    value={data.datosPersonales.portfolio}
                    onChange={(e) => handlePersonalChange("portfolio", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DISEÑO */}
        <TabsContent value="diseno" className="pt-4 space-y-4">
          <Card className="border-indigo-100 dark:border-indigo-900 shadow-lg">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-t-xl">
              <CardTitle className="text-md text-indigo-900 dark:text-indigo-200">Personalización Visual del PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Plantilla del Currículum</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant={template === "modern" ? "default" : "outline"} onClick={() => setTemplate("modern")} className={`justify-start h-auto py-4 px-4 flex flex-col items-start gap-1 transition-all ${template === "modern" ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:bg-slate-50"}`}>
                    <span className="font-bold text-base">Moderna</span>
                    <span className="text-xs font-normal opacity-80 whitespace-normal text-left">Dos columnas limpias. Un diseño estándar infalible.</span>
                  </Button>
                  <Button variant={template === "classic" ? "default" : "outline"} onClick={() => setTemplate("classic")} className={`justify-start h-auto py-4 px-4 flex flex-col items-start gap-1 transition-all ${template === "classic" ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:bg-slate-50"}`}>
                    <span className="font-bold text-base">Clásica</span>
                    <span className="text-xs font-normal opacity-80 whitespace-normal text-left">Una columna tradicional. Elegancia para banca y consultoría.</span>
                  </Button>
                  <Button variant={template === "creative" ? "default" : "outline"} onClick={() => setTemplate("creative")} className={`justify-start h-auto py-4 px-4 flex flex-col items-start gap-1 transition-all ${template === "creative" ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:bg-slate-50"}`}>
                    <span className="font-bold text-base">Creativa</span>
                    <span className="text-xs font-normal opacity-80 whitespace-normal text-left">Bloques vibrantes y foto destacada. Para marketing o tech.</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Color de Acento Principal</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: "Índigo Profesional", value: "#4F46E5" },
                    { name: "Esmeralda", value: "#10B981" },
                    { name: "Rosa Vibrante", value: "#E11D48" },
                    { name: "Pizarra Minimalista", value: "#334155" },
                    { name: "Cielo Corporativo", value: "#0284C7" },
                    { name: "Naranja Creativo", value: "#EA580C" }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setThemeColor(color.value)}
                      className={`w-12 h-12 rounded-full border-2 transition-transform duration-200 ${themeColor === color.value ? 'border-slate-900 dark:border-white scale-125 shadow-lg' : 'border-transparent hover:scale-110 shadow-sm'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPERIENCIA */}
        <TabsContent value="experiencia" className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">Experiencia Laboral</h3>
            <Button onClick={addExperience} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Agregar Experiencia
            </Button>
          </div>

          {data.experiencia.map((exp, idx) => (
            <Card key={idx} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(idx)}
                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Empresa</label>
                    <Input
                      value={exp.empresa}
                      onChange={(e) => handleExperienceChange(idx, "empresa", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Puesto</label>
                    <Input
                      value={exp.puesto}
                      onChange={(e) => handleExperienceChange(idx, "puesto", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Fecha de Inicio</label>
                    <Input
                      value={exp.fechaInicio}
                      onChange={(e) => handleExperienceChange(idx, "fechaInicio", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Fecha de Fin</label>
                    <Input
                      value={exp.fechaFin}
                      onChange={(e) => handleExperienceChange(idx, "fechaFin", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Descripción de Funciones</label>
                  <Textarea
                    rows={3}
                    value={exp.descripcion}
                    onChange={(e) => handleExperienceChange(idx, "descripcion", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500">Logros Destacados</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addLogro(idx)}
                      className="text-primary hover:text-primary-hover p-0 h-auto"
                    >
                      + Añadir logro
                    </Button>
                  </div>
                  {exp.logros.map((logro, lIdx) => (
                    <div key={lIdx} className="flex gap-2 items-center">
                      <Input
                        value={logro}
                        onChange={(e) => handleLogroChange(idx, lIdx, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLogro(idx, lIdx)}
                        className="text-rose-500 hover:text-rose-700 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* EDUCACION */}
        <TabsContent value="educacion" className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">Historial de Educación</h3>
            <Button onClick={addEducation} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Agregar Educación
            </Button>
          </div>

          {data.educacion.map((edu, idx) => (
            <Card key={idx} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(idx)}
                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Institución</label>
                    <Input
                      value={edu.institucion}
                      onChange={(e) => handleEducationChange(idx, "institucion", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Título / Carrera</label>
                    <Input
                      value={edu.titulo}
                      onChange={(e) => handleEducationChange(idx, "titulo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Fecha de Inicio</label>
                    <Input
                      value={edu.fechaInicio}
                      onChange={(e) => handleEducationChange(idx, "fechaInicio", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Fecha de Fin</label>
                    <Input
                      value={edu.fechaFin}
                      onChange={(e) => handleEducationChange(idx, "fechaFin", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* HABILIDADES */}
        <TabsContent value="habilidades" className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">Habilidades / Skills</h3>
            <Button onClick={addSkill} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Agregar Habilidad
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-3">
              {data.habilidades.map((skill, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-slate-400">Habilidad</label>
                    <Input
                      value={skill.nombre}
                      onChange={(e) => handleSkillChange(idx, "nombre", e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-48 space-y-1">
                    <label className="text-xs text-slate-400">Categoría</label>
                    <select
                      value={skill.categoria}
                      onChange={(e) => handleSkillChange(idx, "categoria", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Base de Datos</option>
                      <option value="cloud">Cloud / AWS / GCP</option>
                      <option value="devops">DevOps / CI-CD</option>
                      <option value="soft-skill">Blanda (Soft Skill)</option>
                      <option value="other">Otra</option>
                    </select>
                  </div>
                  <div className="flex items-end h-full pt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(idx)}
                      className="text-rose-500 hover:text-rose-700 h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
