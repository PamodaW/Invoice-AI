const Tesseract = require("tesseract.js");

// Read text out of an image buffer (PNG/JPG). Language data downloads on first use.
async function readImageText(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data.text;
}

module.exports = { readImageText };
