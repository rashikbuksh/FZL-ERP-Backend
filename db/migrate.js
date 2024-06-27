import { migrate } from "drizzle-orm/pg-core/migrator";
import db from ".";

async function MigrateData() {
	await migrate(db, { migrationsFolder: "./drizzle" });
	process.exit(0);
}

MigrateData().catch((err) => {
	console.error(err);
	process.exit(0);
});

// close the connection
db.close();
