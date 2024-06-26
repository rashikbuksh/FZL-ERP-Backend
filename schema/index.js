import {
    decimal,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").unique(),
});
export const authOtps = pgTable("auth_otp", {
	id: serial("id").primaryKey(),
	phone: varchar("phone", { length: 256 }),
	userId: integer("user_id").references(() => users.id),
});
