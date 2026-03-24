import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
}