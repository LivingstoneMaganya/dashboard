import { neon } from '@neondatabase/serverless';
import { setDefaultAutoSelectFamily } from 'node:net';
import dotenv from 'dotenv';

dotenv.config();
setDefaultAutoSelectFamily(false);

export const db = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function initDatabase() {
  if (!db) {
    console.warn('⚠️ DATABASE_URL is missing or unreadable in .env.');
    return;
  }

  try {
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('⚡ Neon PostgreSQL tables initialized successfully.');
  } catch (err) {
    console.error('❌ Neon Database connection failed:', err.message);
  }
}
