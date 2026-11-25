const API_URL = "http://localhost:5000";

export async function getInvoices() {
  const res = await fetch(`${API_URL}/invoices`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
