import { decimal, integer, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as hrSchema from "../hr/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const delivery = pgSchema("delivery");

export const packing_list = delivery.table("packing_list", {
	uuid: uuid("uuid").primaryKey(),
	carton_size: text("carton_size").notNull(),
	carton_weight: text("carton_weight").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const packing_list_entry = delivery.table("packing_list_entry", {
	uuid: uuid("uuid").primaryKey(),
	packing_list_uuid: uuid("packing_list_uuid").references(
		() => packing_list.uuid
	),
	sfg_uuid: uuid("sfg_uuid").references(() => zipperSchema.sfg.uuid),
	quantity: decimal("quantity").notNull(),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const challan = delivery.table("challan", {
	uuid: uuid("uuid").primaryKey(),
	carton_quantity: decimal("carton_quantity").notNull(),
	assign_to: uuid("created_by").references(() => hrSchema.users.uuid),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	receive_status: integer("receive_status").default(0),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const challan_entry = delivery.table("challan_entry", {
	uuid: uuid("uuid").primaryKey(),
	challan_uuid: uuid("challan_uuid").references(() => challan.uuid),
	packing_list_uuid: uuid("packing_list_uuid").references(
		() => packing_list.uuid
	),
	delivery_quantity: decimal("delivery_quantity").notNull(),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export default delivery;
