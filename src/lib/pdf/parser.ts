import PDFParser from "pdf2json"

export async function extractText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()
    pdfParser.on("pdfParser_dataError", (err: any) => reject(err.parserError))
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfData.Pages.flatMap((page: any) =>
        page.Texts.map((t: any) => decodeURIComponent(t.R[0].T))
      ).join(" ").replace(/\s+/g, " ").trim()
      resolve(text)
    })
    pdfParser.parseBuffer(buffer)
  })
}
