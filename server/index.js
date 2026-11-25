const express = require("express");
const cors = require("cors");
const db = require("./db");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
