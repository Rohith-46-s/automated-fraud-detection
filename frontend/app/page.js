'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [vectorResults, setVectorResults] = useState([]);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTransactions = () =>
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.data);
      });

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          amount: amount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Transfer failed');
      setMessage({ ok: true, text: 'Transfer completed.' });
      setSenderId('');
      setReceiverId('');
      setAmount('');
      await loadTransactions();
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const runVectorSearch = async () => {
    const res = await fetch('/api/vector-search');
    const data = await res.json();
    if (data.success) setVectorResults(data.data);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Fraud Detection Dashboard</h1>

      <form
        onSubmit={handleTransfer}
        style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}
      >
        <h3>Transfer Funds</h3>
        <input
          type="number"
          placeholder="Sender account ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          required
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <input
          type="number"
          placeholder="Receiver account ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" disabled={submitting} style={{ padding: '10px', cursor: 'pointer' }}>
          {submitting ? 'Sending...' : 'Send'}
        </button>
        {message && (
          <p style={{ marginTop: '0.75rem', color: message.ok ? 'green' : 'red' }}>{message.text}</p>
        )}
      </form>

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