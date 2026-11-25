import { useEffect, useState } from "react";
import { getInvoices } from "./api";
import InvoiceList from "./InvoiceList";

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>Invoices</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Could not load invoices: {error}</p>}
      {!loading && !error && <InvoiceList invoices={invoices} />}
    </div>
  );
}

export default App;
