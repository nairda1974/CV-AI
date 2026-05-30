export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AdaptedCVRepository } from "@/repositories/adapted-cv.repo";
import HumanInTheLoopEditor from "@/features/cv-adaptation/HumanInTheLoopEditor";
import { CVProfile } from "@/schemas/cv-profile.schema";
import { updateAdaptedCVAction } from "@/actions/adaptation.action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CVPage({ params }: Props) {
  const { id } = await params;
  const repo = new AdaptedCVRepository();
  const cv = await repo.findById(id);

  if (!cv) notFound();

  const initialData = cv.contenidoJson as unknown as CVProfile;

  // Server action callback local para guardar los cambios editados en caliente
  const handleSaveEdits = async (updatedData: CVProfile) => {
    "use server";
    await updateAdaptedCVAction(id, updatedData);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 py-1.5 px-3 rounded-full transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-950 p-6 border rounded-lg shadow-xs space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Visualizador de Adaptación
          </h1>
          <p className="text-sm text-muted-foreground">
            Esta adaptación v{cv.version} fue generada a partir del perfil maestro para la oferta de{" "}
            <strong>{cv.jobOffer.empresa}</strong> como <strong>{cv.jobOffer.puesto}</strong>.
          </p>
          <div className="flex items-center gap-2 mt-4 pt-2 border-t text-xs text-muted-foreground">
            <span>Score estimado: <strong className="text-indigo-600 dark:text-indigo-400">{cv.scoreATS}%</strong></span>
            <span>•</span>
            <span>Actualizado: <strong>{cv.actualizadoEn.toLocaleDateString("es-ES")}</strong></span>
          </div>
        </div>

        <HumanInTheLoopEditor initialData={initialData} onSave={handleSaveEdits} />
      </div>
    </main>
  );
}
