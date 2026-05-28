import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.PG_DATABASE_URI,
    ssl: {
        rejectUnauthorized: true,
        requestCert: true,
        ca: Buffer.from(process.env.PG_DATABASE_CA as string, 'base64').toString()
    }
});

export default pool;