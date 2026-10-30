# Automated Fraud Detection & Behavioral Transaction Audit System

## 1. Prerequisites
- Node.js installed
- PostgreSQL installed (with pgvector extension)

## 2. Setup Database
1. Connect to PostgreSQL and create a database: `CREATE DATABASE fraud_db;`
2. Run the SQL files in the `database/` folder in order:
   - `schema.sql`
   - `advanced_features.sql`
   - `vector_setup.sql`

## 3. Setup Next.js App
1. Navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Rename `.env.example` to `.env.local` and add your PostgreSQL credentials.
4. Run `npm run dev` to start the Next.js development server.
