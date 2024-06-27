import { defineConfig } from "drizzle-kit";
import {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
} from "./lib/secret";

const defaultConfig = {
	dialect: "postgresql",
	schema: "./db/schema/*.js",
	out: "./db/drizzle",
	dbCredentials: {
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB_NAME,
		port: DB_POSTGRES_PORT,
		ssl: false,
	},
};

const command = process.argv[2];
const isGenerateOrIntrospect = ["generate", "introspect"].includes(command);
const isMigrateDropOrPush = ["migrate", "drop", "push"].includes(command);

if (isGenerateOrIntrospect) {
	module.exports = defineConfig(defaultConfig);
} else if (isMigrateDropOrPush) {
	module.exports = defineConfig({
		...defaultConfig,
		migrations: { table: "migrations_details" },
	});
}
