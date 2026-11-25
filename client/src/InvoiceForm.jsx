import { useState } from "react";
import { createInvoice, extractInvoice, extractInvoiceFile } from "./api";

function InvoiceForm({ onCreated }) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pasted, setPasted] = useState("");
  const [extracting, setExtracting] = useState(false);

  function fillFields(fields) {
    setClient(fields.client ?? "");
    setAmount(fields.amount != null ? String(fields.amount) : "");
    setDueDate(fields.dueDate ?? "");
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setExtracting(true);
    try {
      const fields = await extractInvoiceFile(file);
      setPasted(fields.text ?? "");
      fillFields(fields);
    } catch (err) {
      setError(err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function handleExtract() {
    setError(null);
    setExtracting(true);
    try {
      const fields = await extractInvoice(pasted);
      fillFields(fields);
    } catch (err) {
      setError(err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const invoice = await createInvoice({
        client,
        amount: Number(amount),
        dueDate,
      });
      onCreated(invoice);
      setClient("");
      setAmount("");
      setDueDate("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
      <textarea
        placeholder="Paste invoice text here, then click Extract with AI"
        rows={4}
        style={{ width: "100%" }}
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
      />
      <button type="button" onClick={handleExtract} disabled={extracting || !pasted.trim()}>
        {extracting ? "Extracting..." : "Extract with AI"}
      </button>
      <label>
        or upload an invoice (PNG, JPG or PDF):{" "}
        <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleFile} disabled={extracting} />
      </label>
      <input
        placeholder="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add invoice"}
      </button>
      {error && <p style={{ width: "100%", margin: 0 }}>{error}</p>}
    </form>
  );
}

export default InvoiceForm;
