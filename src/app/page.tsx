export const dynamic = "force-dynamic";

import Link from "next/link";
import { MasterProfileRepository } from "@/repositories/master-profile.repo";
import { AdaptedCVRepository } from "@/repositories/adapted-cv.repo";
import { JobOfferRepository } from "@/repositories/job-offer.repo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Award, User, History, Settings, ExternalLink, Trash2 } from "lucide-react";
import { deleteProfileAction } from "@/actions/profile.action";
import { deleteAdaptedCVAction } from "@/actions/adaptation.action";
import { revalidatePath } from "next/cache";

export default async function DashboardPage() {
  const profileRepo = new MasterProfileRepository();
  const adaptedCvRepo = new AdaptedCVRepository();
  const jobOfferRepo = new JobOfferRepository();

  const perfiles = await profileRepo.getSummaries();
  const cvs = await adaptedCvRepo.findAll();
  const ofertas = await jobOfferRepo.findAll();

  // Acciones en línea usando Server Actions directos
  const handleDeleteProfile = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteProfileAction(id);
    revalidatePath("/");
  };

  const handleDeleteCV = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteAdaptedCVAction(id);
    revalidatePath("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 border-r bg-white dark:bg-slate-950 p-6 flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-lg tracking-tight text-slate-950 dark:text-white">
              CV Adapter AI
            </span>
          </div>
          <nav className="space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg font-medium text-sm text-slate-950 dark:text-white"
            >
              <History className="h-4.5 w-4.5 text-indigo-600" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/perfil/nuevo"
              className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors"
            >
              <User className="h-4.5 w-4.5" />
              <span>Mis Perfiles</span>
            </Link>
            <Link
              href="/ofertas/nueva"
              className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Crear Oferta</span>
            </Link>
          </nav>
        </div>
        <div className="text-xs text-muted-foreground border-t pt-4 flex items-center gap-2">
          <Settings className="h-3.5 w-3.5" />
          <span>Ejecución Local</span>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (iOS Safe) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom,0px)] z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <History className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </Link>
        <Link href="/perfil/nuevo" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-650 transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Nuevo Perfil</span>
        </Link>
        <Link href="/ofertas/nueva" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-650 transition-colors">
          <Plus className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Adaptar CV</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Adapta tu CV maestro a ofertas laborales de forma local.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Link href="/perfil/nuevo">
              <Button className="flex items-center gap-2">
                <Plus className="h-4.5 w-4.5" /> Nuevo Perfil Maestro
              </Button>
            </Link>
            <Link href="/ofertas/nueva">
              <Button variant="secondary" className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5" /> Nueva Adaptación
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="shadow-xs bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Perfiles Maestros
              </CardTitle>
              <User className="h-4.5 w-4.5 text-slate-450" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">
                {perfiles.length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xs bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ofertas Guardadas
              </CardTitle>
              <FileText className="h-4.5 w-4.5 text-slate-450" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">
                {ofertas.length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xs bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                CVs Adaptados
              </CardTitle>
              <Award className="h-4.5 w-4.5 text-slate-450" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-950 dark:text-white">
                {cvs.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Secciones */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Listado de Perfiles Maestros */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Perfiles Maestros
            </h2>
            {perfiles.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 border border-dashed rounded-xl p-6 text-center shadow-xs">
                <p className="text-sm text-muted-foreground mb-3">No hay perfiles maestros.</p>
                <Link href="/perfil/nuevo">
                  <Button size="sm" variant="outline">
                    Crear Perfil
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {perfiles.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 border rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-800 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.creadoEn.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <form action={handleDeleteProfile}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historial de Adaptaciones */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Historial de Adaptaciones
            </h2>
            {cvs.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 border border-dashed rounded-xl p-8 text-center shadow-xs">
                <p className="text-sm text-muted-foreground mb-4">
                  Aún no has generado ninguna adaptación de CV.
                </p>
                <Link href="/ofertas/nueva">
                  <Button size="sm">
                    Adaptar primer CV
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop view table */}
                <div className="hidden md:block bg-white dark:bg-slate-950 border rounded-xl shadow-xs overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b text-xs font-semibold text-slate-550 uppercase">
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Empresa / Puesto</th>
                        <th className="p-4 text-center">Score ATS</th>
                        <th className="p-4 text-center">Versión</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {cvs.map((cv: any) => (
                        <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-medium text-slate-500">
                            {cv.creadoEn.toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {cv.jobOffer.empresa}
                            </p>
                            <p className="text-xs text-muted-foreground">{cv.jobOffer.puesto}</p>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={cv.scoreATS >= 80 ? "default" : "secondary"}>
                              {cv.scoreATS}%
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">v{cv.version}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/cv/${cv.id}`}>
                                <Button size="sm" variant="ghost" className="flex items-center gap-1 text-xs">
                                  <ExternalLink className="h-3.5 w-3.5" /> Ver
                                </Button>
                              </Link>
                              <form action={handleDeleteCV}>
                                <input type="hidden" name="id" value={cv.id} />
                                <Button
                                  type="submit"
                                  variant="ghost"
                                  size="icon"
                                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view cards (cleaner on iOS) */}
                <div className="block md:hidden space-y-3">
                  {cvs.map((cv: any) => (
                    <div
                      key={cv.id}
                      className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg p-4 border border-white/50 dark:border-slate-800/50 rounded-2xl shadow-xl space-y-3 relative transition-transform active:scale-[0.98]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-150">
                            {cv.jobOffer.empresa}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{cv.jobOffer.puesto}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={cv.scoreATS >= 80 ? "default" : "secondary"} className="text-[10px] px-1.5 py-0.5">
                            {cv.scoreATS}% ATS
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                            v{cv.version}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t text-xs">
                        <span className="text-slate-400 font-medium">
                          {cv.creadoEn.toLocaleDateString("es-ES")}
                        </span>
                        <div className="flex gap-1">
                          <Link href={`/cv/${cv.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2.5">
                              Ver / Editar
                            </Button>
                          </Link>
                          <form action={handleDeleteCV}>
                            <input type="hidden" name="id" value={cv.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
