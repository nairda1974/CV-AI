"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CVProfile } from "@/schemas/cv-profile.schema";

interface Props {
  cvData: CVProfile;
}

export default function LazyPDFButton({ cvData }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Cargamos dinámicamente bajo demanda el renderizador PDF de react-pdf
      const { pdf } = await import("@react-pdf/renderer");
      const { ModernCVTemplate } = await import("./ModernCVTemplate");

      const doc = <ModernCVTemplate cvData={cvData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_Adaptado_${cvData.datosPersonales.nombre.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al renderizar el PDF vectorial:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} className="w-full sm:w-auto">
      {loading ? "Generando PDF vectorial..." : "Exportar PDF Profesional"}
    </Button>
  );
}
