const API_URL = "http://localhost:5000";

export async function getInvoices() {
  const res = await fetch(`${API_URL}/invoices`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function createInvoice(invoice) {
  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function extractInvoice(text) {
  const res = await fetch(`${API_URL}/invoices/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function extractInvoiceFile(file) {
  const res = await fetch(`${API_URL}/invoices/extract-file`, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
