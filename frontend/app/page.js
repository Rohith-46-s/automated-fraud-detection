'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [vectorResults, setVectorResults] = useState([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.data);
      });
  }, []);

  const runVectorSearch = async () => {
    const res = await fetch('/api/vector-search');
    const data = await res.json();
    if (data.success) setVectorResults(data.data);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Fraud Detection Dashboard</h1>
      
      <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Behavioral Anomaly Detection (pgvector)</h3>
        <button onClick={runVectorSearch} style={{ padding: '10px', cursor: 'pointer' }}>
          Run AI Vector Scan on New Attempt
        </button>
        {vectorResults.length > 0 && (
          <ul style={{ marginTop: '1rem' }}>
            {vectorResults.map((v) => (
              <li key={v.transaction_id} style={{ color: v.distance < 0.5 ? 'red' : 'green' }}>
                Match vs Transaction ID {v.transaction_id} (${v.amount}) - Distance Score: {v.distance.toFixed(4)} 
                {v.distance < 0.5 ? ' (HIGH RISK)' : ' (SAFE)'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <table style={{ width: '100%', textAlign: 'left' }}>
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