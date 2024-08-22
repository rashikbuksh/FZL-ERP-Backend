import { defineConfig } from 'drizzle-kit';
import {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
} from './src/lib/secret.js';

const defaultConfig = {
	dialect: 'postgresql',
	schema: './src/db/*/schema.js',
	out: './src/db/migrations',
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
const isGenerateOrIntrospect = ['generate', 'introspect', 'studio'].includes(
	command
);
const isMigrateDropOrPush = ['migrate', 'drop', 'push'].includes(command);

var config;

// if new schema is added then add the schema name here in schemaFilter
if (isGenerateOrIntrospect) {
	config = defineConfig({
		...defaultConfig,
		schemaFilter: [
			'commercial',
			'delivery',
			'hr',
			'lab_dip',
			'material',
			'public',
			'purchase',
			'slider',
			'zipper',
			'thread',
		],
	});
} else if (isMigrateDropOrPush) {
	config = defineConfig({
		...defaultConfig,
		migrations: { table: 'migrations_details' },
	});
}

export default config;
