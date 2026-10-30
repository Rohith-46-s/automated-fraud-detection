import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const sender = Number(body.sender_id);
  const receiver = Number(body.receiver_id);
  const amount = Number(body.amount);

  if (!Number.isInteger(sender) || !Number.isInteger(receiver) || !(amount > 0)) {
    return NextResponse.json(
      { success: false, error: 'sender_id, receiver_id and a positive amount are required' },
      { status: 400 }
    );
  }
  if (sender === receiver) {
    return NextResponse.json(
      { success: false, error: 'Sender and receiver must be different accounts' },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    await client.query('CALL process_transfer($1, $2, $3)', [sender, receiver, amount]);
    return NextResponse.json({ success: true, message: 'Transfer completed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
