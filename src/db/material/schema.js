import {
	decimal,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";

const material = pgSchema("material");

export const section = material.table("section", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const type = material.table("type", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const info = material.table("info", {
	uuid: uuid("uuid").primaryKey().unique(),
	section_uuid: uuid("section_uuid").references(() => section.uuid),
	type_uuid: uuid("type_uuid").references(() => type.uuid),
	name: text("name").notNull(),
	short_name: text("short_name"),
	unit: text("unit"),
	threshold: decimal("threshold").default(0),
	description: text("description"),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const stock = material.table("stock", {
	uuid: uuid("uuid").primaryKey(),
	material_uuid: uuid("material_uuid").references(() => info.uuid),
	section_uuid: uuid("section_uuid").references(
		() => publicSchema.section.uuid
	),
	stock: decimal("stock").default(0.0),
});

export const trx = material.table("trx", {
	uuid: uuid("uuid").primaryKey(),
	material_stock_uuid: uuid("material_stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	section_uuid_trx_to: uuid("section_uuid_trx_to")
		.references(() => publicSchema.section.uuid)
		.notNull(),
	quantity: decimal("quantity").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const used = material.table("used", {
	uuid: uuid("uuid").primaryKey(),
	material_stock_uuid: uuid("material_stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	section_uuid: uuid("section_uuid").references(
		() => publicSchema.section.uuid
	),
	used_quantity: decimal("used_quantity").notNull(),
	wastage: decimal("wastage").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export default material;
