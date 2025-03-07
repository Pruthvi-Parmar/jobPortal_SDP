import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const loadingTask = getDocument({ data: fileBuffer });
    const pdfDoc = await loadingTask.promise;

    let text = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return text.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};
