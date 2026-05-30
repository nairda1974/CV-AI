"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { adaptCVAction, updateAdaptedCVAction } from "@/actions/adaptation.action";
import { CVProfile } from "@/schemas/cv-profile.schema";
import HumanInTheLoopEditor from "./HumanInTheLoopEditor";

interface ProfileSummary {
  id: string;
  titulo: string;
}

interface Props {
  perfiles: ProfileSummary[];
}

export default function ClientAdaptationFlow({ perfiles }: Props) {
  // Datos del formulario
  const [perfilId, setPerfilId] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estado del flujo
  const [step, setStep] = useState<"form" | "loading" | "editor">("form");
  const [adaptedCvId, setAdaptedCvId] = useState<string>("");
  const [adaptedData, setAdaptedData] = useState<CVProfile | null>(null);

  // Mensajes de error/éxito
  const [error, setError] = useState("");

  const handleStartAdaptation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfilId) {
      setError("Debes seleccionar un perfil maestro.");
      return;
    }
    if (!empresa.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      return;
    }
    if (!puesto.trim()) {
      setError("El puesto de trabajo es obligatorio.");
      return;
    }
    if (descripcion.trim().length < 20) {
      setError("La descripción de la oferta debe tener al menos 20 caracteres.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await adaptCVAction(perfilId, empresa.trim(), puesto.trim(), descripcion.trim());
      if (res.success && res.id && res.adaptedData) {
        setAdaptedCvId(res.id);
        setAdaptedData(res.adaptedData);
        setStep("editor");
      } else {
        setError(res.error || "Ocurrió un error inesperado.");
        setStep("form");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con la API de IA.");
      setStep("form");
    }
  };

  const handleSaveEdits = async (updatedData: CVProfile) => {
    setError("");
    try {
      const res = await updateAdaptedCVAction(adaptedCvId, updatedData);
      if (res.success) {
        // Opcional: mostrar notificación de guardado exitoso
      } else {
        setError(res.error || "Error al guardar los cambios.");
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar en base de datos.");
    }
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 bg-white dark:bg-slate-950 border rounded-lg shadow-sm">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            La IA está adaptando tu currículum
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Estamos extrayendo requerimientos clave de la oferta de trabajo y reformulando tu experiencia profesional. Esto puede demorar unos segundos...
          </p>
        </div>
      </div>
    );
  }

  if (step === "editor" && adaptedData) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep("form")}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Formulario de Adaptación
        </Button>
        <HumanInTheLoopEditor initialData={adaptedData} onSave={handleSaveEdits} />
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-950 border shadow-sm">
      <CardHeader>
        <CardTitle className="text-md">Datos de la Oferta Laboral</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleStartAdaptation} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Seleccionar perfil */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Seleccionar Perfil Maestro <span className="text-rose-500">*</span>
            </label>
            <select
              value={perfilId}
              onChange={(e) => setPerfilId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecciona un perfil...</option>
              {perfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Empresa <span className="text-rose-500">*</span>
              </label>
              <Input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ej: Google Spain"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Puesto / Rol <span className="text-rose-500">*</span>
              </label>
              <Input
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                placeholder="Ej: Senior React Developer"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Descripción de la Oferta <span className="text-rose-500">*</span>
            </label>
            <Textarea
              rows={8}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Pega aquí la descripción completa del puesto de trabajo, requisitos y responsabilidades..."
              className="resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="flex items-center gap-2">
              Continuar a Edición
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
