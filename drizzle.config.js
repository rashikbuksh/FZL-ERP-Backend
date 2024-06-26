// import { defineConfig } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
} from "./secret.js";

// if the command is generate then run the following code
if (process.argv[2] === "generate" || process.argv[2] === "introspect") {
	module.exports = defineConfig({
		schema: "./schema",
		out: "./drizzle",
		dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
		dbCredentials: {
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			port: DB_POSTGRES_PORT,
			ssl: false,
		},
	});
}

if (
	process.argv[2] === "migrate" ||
	process.argv[2] === "drop" ||
	process.argv[2] === "push"
) {
	module.exports = defineConfig({
		dialect: "postgresql", // "mysql" | "sqlite"
		schema: "./schema",
		out: "./drizzle",
		migrations: {
			table: "migrations_custom", // default `__drizzle_migrations`,
			schema: "public", // used in PostgreSQL only and default to `drizzle`
		},
		dbCredentials: {
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			port: DB_POSTGRES_PORT,
			ssl: false,
		},
	});
}
