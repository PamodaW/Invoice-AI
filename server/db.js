const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "invoices.db");
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client TEXT NOT NULL,
    amount REAL NOT NULL,
    dueDate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid',
    createdAt TEXT NOT NULL
  )
`);

module.exports = db;
