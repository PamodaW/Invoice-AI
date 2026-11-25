const express = require("express");
const cors = require("cors");
const db = require("./db");
const { extractInvoiceFields } = require("./extract");
const { readImageText } = require("./ocr");
const { readPdfText } = require("./pdf");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// List all invoices
app.get("/invoices", (req, res) => {
  const rows = db.prepare("SELECT * FROM invoices ORDER BY id").all();
  res.json(rows);
});

// Create an invoice
app.post("/invoices", (req, res) => {
  const { client, amount, dueDate } = req.body;

  if (!client || typeof client !== "string") {
    return res.status(400).json({ error: "client is required" });
  }
  if (typeof amount !== "number" || !(amount > 0)) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }
  if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: "dueDate must be a valid date" });
  }

  const createdAt = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO invoices (client, amount, dueDate, createdAt) VALUES (?, ?, ?, ?)")
    .run(client.trim(), amount, dueDate, createdAt);
  const invoice = db
    .prepare("SELECT * FROM invoices WHERE id = ?")
    .get(result.lastInsertRowid);
  res.status(201).json(invoice);
});

// Use AI to pull invoice fields out of pasted text
app.post("/invoices/extract", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.length > 10000) {
    return res.status(400).json({ error: "text is required (max 10000 characters)" });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set on the server" });
  }
  try {
    res.json(await extractInvoiceFields(text));
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "AI extraction failed" });
  }
});

// Upload an invoice (image or PDF): read its text, then extract the fields
app.post(
  "/invoices/extract-file",
  express.raw({ type: ["image/png", "image/jpeg", "application/pdf"], limit: "10mb" }),
  async (req, res) => {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Send a PNG, JPG or PDF file as the request body" });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set on the server" });
    }
    try {
      const text =
        req.headers["content-type"] === "application/pdf"
          ? await readPdfText(req.body)
          : await readImageText(req.body);
      if (!text.trim()) {
        return res.status(422).json({ error: "No text found in the file" });
      }
      res.json({ ...(await extractInvoiceFields(text)), text });
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: "Could not read the invoice file" });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
