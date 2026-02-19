import { Pool } from 'pg';
// import postgres from 'postgres';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
}