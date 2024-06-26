import {
	decimal,
	integer,
	pgSchema,
	serial,
	text,
} from "drizzle-orm/pg-core";

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
