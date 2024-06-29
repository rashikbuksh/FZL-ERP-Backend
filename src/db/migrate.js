import db from "@/db";
import { migrate } from "drizzle-orm/pg-core/migrator";

async function MigrateData() {
	await migrate(db, { migrationsFolder: "./drizzle" });
	process.exit(0);
}

await MigrateData().catch((err) => {
	console.error(err);
	process.exit(0);
});

// close the connection
await db.close();
