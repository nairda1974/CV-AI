"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Upload, FileText, Loader2, Sparkles, CheckCircle } from "lucide-react";
import PhotoCropDialog from "@/features/master-profile/PhotoCropDialog";
import { extractProfileFromTextAction, createProfileFromPDFAction } from "@/actions/profile.action";

export default function ClientProfileForm() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Estados para recortar foto
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [croppedPhoto, setCroppedPhoto] = useState<string>(""); // Base64
  const [isCropOpen, setIsCropOpen] = useState(false);

  // Estados de carga y feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPhotoSrc(reader.result?.toString() || "");
        setIsCropOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMessage("El título del perfil es obligatorio.");
      return;
    }

    if (!file && !textContent.trim()) {
      setErrorMessage("Debes proporcionar el texto de tu CV o subir un archivo PDF.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let result;
      if (file) {
        // Enviar vía FormData al Server Action de PDF
        const formData = new FormData();
        formData.append("file", file);
        result = await createProfileFromPDFAction(titulo.trim(), formData, croppedPhoto || undefined);
      } else {
        // Enviar texto directamente
        result = await extractProfileFromTextAction(
          titulo.trim(),
          textContent.trim(),
          croppedPhoto || undefined
        );
      }

      if (result.success) {
        setSuccessMessage("¡Perfil Maestro creado y procesado exitosamente por la IA!");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Ocurrió un error inesperado al procesar el perfil.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-950 border shadow-sm">
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            Configuración del Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Título del perfil */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Título Descriptivo <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                disabled={isLoading}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Senior Full-Stack Engineer — 2026"
              />
              <p className="text-xs text-muted-foreground">
                Úsalo para identificar este perfil (ej: "Perfil Técnico Node/React").
              </p>
            </div>

            {/* Subida de foto con recorte */}
            <div className="space-y-2 border-t pt-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Foto de Perfil (Opcional)
              </label>
              <div className="flex items-center gap-4">
                {croppedPhoto ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                    <img src={croppedPhoto} alt="Foto recortada" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-900 border flex items-center justify-center text-slate-400">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={isLoading}
                    onChange={handlePhotoChange}
                    className="max-w-xs text-xs file:bg-slate-100 file:border-0 file:rounded-md file:px-2 file:py-1 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Se abrirá un editor para recortar la imagen a formato cuadrado 1:1.
                  </p>
                </div>
              </div>
            </div>

            {/* Origen del CV */}
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-slate-400" />
                  Opción A: Subir PDF de CV
                </label>
                <Input
                  type="file"
                  accept=".pdf"
                  disabled={isLoading}
                  onChange={handleFileChange}
                  className="cursor-pointer file:cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  La IA leerá el texto del archivo e interpretará la estructura automáticamente.
                </p>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">O</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Opción B: Pegar CV en Texto Plano
                </label>
                <Textarea
                  disabled={isLoading || !!file}
                  rows={10}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={`Pegar contenido aquí...\n\nEjemplo:\nJuan Pérez\nEmail: juan@email.com\nExperiencia:\nSoftware Engineer en Empresa X (2023 - Actualidad)\n- Lideré el desarrollo de...`}
                  className="resize-none"
                />
                {file && (
                  <p className="text-xs text-amber-600 font-medium">
                    * Has seleccionado un archivo PDF. La opción de texto plano está deshabilitada y se priorizará el archivo.
                  </p>
                )}
              </div>
            </div>

            {/* Alertas de error/éxito */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {successMessage}
              </div>
            )}

            {/* Botón de envío */}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Extraer y Guardar Perfil
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de recorte */}
      <PhotoCropDialog
        open={isCropOpen}
        onOpenChange={setIsCropOpen}
        imageSrc={photoSrc}
        onCropComplete={setCroppedPhoto}
      />
    </div>
  );
}
