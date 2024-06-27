import {
	decimal,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const material = pgSchema("material");

export const info = material.table("info", {
	id: serial("id").primaryKey(),
	name: text("name").unique(),
	price: decimal("price"),
	quantity: integer("quantity"),
});

export const purchase = material.table("purchase", {
	id: serial("id").primaryKey(),
	material_id: integer("material_id").references(() => info.id),
	quantity: integer("quantity"),
	date: text("date"),
});
