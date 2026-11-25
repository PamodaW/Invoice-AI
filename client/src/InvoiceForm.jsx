import { useState } from "react";
import { createInvoice } from "./api";

function InvoiceForm({ onCreated }) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
