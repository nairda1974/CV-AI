"use client";
import { useState } from "react";

interface Props {
  cvId: string;
  existingPdfUrl: string | null;
}

export function PdfDownloadButton({ cvId, existingPdfUrl }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(existingPdfUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pdf-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error generando el PDF");
        return;
      }

      setPdfUrl(data.pdfUrl);
      window.open(data.pdfUrl, "_blank");
    } catch {
      setError("Error de conexión al generar el PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-emerald-700 text-white font-medium py-2 px-5 rounded-lg hover:bg-emerald-600 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Generando PDF..." : pdfUrl ? "Descargar PDF" : "Generar y Descargar PDF"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
