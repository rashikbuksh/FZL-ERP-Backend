import {
	decimal,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const hr = pgSchema("hr");

export const users = hr.table("users", {
	id: serial("id").primaryKey(),
	name: text("name").unique(),
});
