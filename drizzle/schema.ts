import { pgTable, serial, text, bigint, unique, foreignKey, varchar, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const migrations_custom = pgTable("migrations_custom", {
	id: serial("id").primaryKey().notNull(),
	hash: text("hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	created_at: bigint("created_at", { mode: "number" }),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: text("name"),
},
(table) => {
	return {
		users_name_unique: unique("users_name_unique").on(table.name),
	}
});

export const auth_otp = pgTable("auth_otp", {
	id: serial("id").primaryKey().notNull(),
	phone: varchar("phone", { length: 256 }),
	user_id: integer("user_id").references(() => users.id),
});