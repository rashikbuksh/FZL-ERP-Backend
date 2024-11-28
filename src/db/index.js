import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
} from '../lib/secret.js';

const { Pool } = pg;

const pool = new Pool({
	host: DB_HOST,
	port: DB_POSTGRES_PORT,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
});

const db = drizzle(pool);

export default db;
