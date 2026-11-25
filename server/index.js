const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (replaced by a database later)
const invoices = [];
let nextId = 1;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// List all invoices
app.get("/invoices", (req, res) => {
  res.json(invoices);
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

  const invoice = {
    id: nextId++,
    client: client.trim(),
    amount,
    dueDate,
    status: "unpaid",
    createdAt: new Date().toISOString(),
  };
  invoices.push(invoice);
  res.status(201).json(invoice);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
