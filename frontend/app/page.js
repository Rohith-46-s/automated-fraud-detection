'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.data);
      });
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    // In a full build, this will call a POST route to execute the process_transfer stored procedure
    alert("Transfer initiated! This will trigger the Audit_Log."); 
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Fraud Detection Dashboard</h1>
      
      <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Initiate Transfer</h3>
        <form onSubmit={handleTransfer}>
          <input type="number" placeholder="Sender ID (e.g., 1)" required style={{ marginRight: '10px' }} />
          <input type="number" placeholder="Receiver ID (e.g., 2)" required style={{ marginRight: '10px' }} />
          <input type="number" placeholder="Amount" required style={{ marginRight: '10px' }} />
          <button type="submit">Send Funds</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left' }}>
        {/* Existing table code here */}
        <thead>
          <tr><th>ID</th><th>Sender</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transaction_id}>
              <td>{t.transaction_id}</td><td>{t.sender_name}</td><td>${t.amount}</td>
              <td style={{ color: t.status === 'FLAGGED' ? 'red' : 'green' }}>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}