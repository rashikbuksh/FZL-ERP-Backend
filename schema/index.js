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

export const materialSchema = pgSchema("material");

export const material = materialSchema.table("material", {
	id: serial("id").primaryKey(),
	name: text("name"),
	description: text("description"),
	quantity: decimal("quantity"),
});

export const purchase = materialSchema.table("purchase", {
	id: serial("id").primaryKey(),
	material_id: integer("material_id").references(() => material.id),
	quantity: decimal("quantity").notNull(),
	price: decimal("price").notNull(),
});
