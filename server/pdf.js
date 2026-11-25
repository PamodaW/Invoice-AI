const { readImageText } = require("./ocr");

const MAX_SCAN_PAGES = 3;

// Get text from a PDF. Uses the embedded text if there is any,
// otherwise renders the first pages to images and runs OCR on them.
async function readPdfText(buffer) {
  const { extractText, renderPageAsImage } = await import("unpdf");

  const { text, totalPages } = await extractText(new Uint8Array(buffer), { mergePages: true });
  if (text.trim().length > 20) return text;

  let ocrText = "";
  const pages = Math.min(totalPages, MAX_SCAN_PAGES);
  for (let page = 1; page <= pages; page++) {
    const png = await renderPageAsImage(new Uint8Array(buffer), page, {
      canvasImport: () => import("@napi-rs/canvas"),
      scale: 2,
    });
    ocrText += (await readImageText(Buffer.from(png))) + "\n";
  }
  return ocrText;
}

module.exports = { readPdfText };
