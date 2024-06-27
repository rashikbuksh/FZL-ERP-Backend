import { drizzle } from "drizzle-orm/node-postgres";
import Pool from "pg";
import * as schema from "./schema/index.js";
import {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
} from "./secret.js";

const pool = new Pool.Pool({
	user: DB_USER,
	database: DB_NAME,
	password: DB_PASS,
	port: DB_POSTGRES_PORT,
	host: DB_HOST,
});

const db = drizzle(pool, { schema });

export default db;
