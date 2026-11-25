function InvoiceList({ invoices }) {
  if (invoices.length === 0) {
    return <p>No invoices yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Client</th>
          <th>Amount</th>
          <th>Due date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id}>
            <td>{inv.id}</td>
            <td>{inv.client}</td>
            <td>${inv.amount.toFixed(2)}</td>
            <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
            <td>{inv.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InvoiceList;
