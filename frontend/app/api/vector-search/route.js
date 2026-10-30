import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    // Using the same test vector [0.85, 0.9, 0.85] representing a new suspicious attempt
    const result = await client.query(`
      SELECT 
          t.transaction_id, 
          t.amount, 
          e.behavior_vector <-> '[0.85, 0.9, 0.85]' AS distance 
      FROM Transaction_Embeddings e
      JOIN Transactions t ON e.transaction_id = t.transaction_id
      ORDER BY distance ASC 
      LIMIT 3;
    `);
    client.release();
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}