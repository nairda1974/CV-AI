"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CVProfile } from "@/schemas/cv-profile.schema";

interface Props {
  cvData: CVProfile;
  template?: "modern" | "classic" | "creative" | "adrian" | "harvard" | "executive" | "startup" | "minimalist" | "hybrid" | "bold";
  themeColor?: string;
}

export default function LazyPDFButton({ cvData, template = "modern", themeColor = "#4F46E5" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Cargamos dinámicamente bajo demanda el renderizador PDF de react-pdf y la plantilla elegida
      const { pdf } = await import("@react-pdf/renderer");
      
      let TemplateComponent;
      if (template === "classic") {
        const { ClassicCVTemplate } = await import("./ClassicCVTemplate");
        TemplateComponent = ClassicCVTemplate;
      } else if (template === "creative") {
        const { CreativeCVTemplate } = await import("./CreativeCVTemplate");
        TemplateComponent = CreativeCVTemplate;
      } else if (template === "adrian") {
        const { AdrianCVTemplate } = await import("./AdrianCVTemplate");
        TemplateComponent = AdrianCVTemplate;
      } else if (template === "harvard") {
        const { HarvardCVTemplate } = await import("./HarvardCVTemplate");
        TemplateComponent = HarvardCVTemplate;
      } else if (template === "executive") {
        const { ExecutiveCVTemplate } = await import("./ExecutiveCVTemplate");
        TemplateComponent = ExecutiveCVTemplate;
      } else if (template === "startup") {
        const { TechStartupCVTemplate } = await import("./TechStartupCVTemplate");
        TemplateComponent = TechStartupCVTemplate;
      } else if (template === "minimalist") {
        const { MinimalistCVTemplate } = await import("./MinimalistCVTemplate");
        TemplateComponent = MinimalistCVTemplate;
      } else if (template === "hybrid") {
        const { HybridATSCVTemplate } = await import("./HybridATSCVTemplate");
        TemplateComponent = HybridATSCVTemplate;
      } else if (template === "bold") {
        const { BoldTypographyCVTemplate } = await import("./BoldTypographyCVTemplate");
        TemplateComponent = BoldTypographyCVTemplate;
      } else {
        const { ModernCVTemplate } = await import("./ModernCVTemplate");
        TemplateComponent = ModernCVTemplate;
      }

      const doc = <TemplateComponent cvData={cvData} themeColor={themeColor} />;
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
    <Button onClick={handleDownload} disabled={loading} className="w-full shadow-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
      {loading ? "Generando PDF..." : "Exportar Diseño en PDF"}
    </Button>
  );
}
