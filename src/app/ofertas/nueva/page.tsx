export const dynamic = "force-dynamic";

import Link from "next/link";
import ClientAdaptationFlow from "@/features/cv-adaptation/ClientAdaptationFlow";
import { MasterProfileRepository } from "@/repositories/master-profile.repo";
import { ArrowLeft } from "lucide-react";

export default async function NuevaOfertaPage() {
  const profileRepo = new MasterProfileRepository();
  const perfiles = await profileRepo.getSummaries();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 py-1.5 px-3 rounded-full transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Adaptar CV a Oferta
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Proporciona los detalles de la oferta de trabajo y la IA generará una versión optimizada de tu currículum maestro.
          </p>
        </div>

        <ClientAdaptationFlow perfiles={perfiles} />
      </div>
    </main>
  );
}
