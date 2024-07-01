import {
	decimal,
	integer,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as materialSchema from "../material/schema.js";

const purchase = pgSchema("purchase");

export const vendor = purchase.table("vendor", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	contact_name: text("contact_name"),
	email: text("email").default(""),
	office_address: text("office_address").default(""),
	contact_number: text("contact_number").default(""),
	remarks: text("remarks"),
});

export const description = purchase.table("description", {
	uuid: uuid("uuid").primaryKey(),
	vendor_uuid: uuid("vendor_uuid").references(() => vendor.uuid),
	is_local: integer("is_local").default(0),
	lc_number: text("lc_number").default(null),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const entry = purchase.table("entry", {
	uuid: uuid("uuid").primaryKey(),
	purchase_description_uuid: uuid("purchase_description_uuid").references(
		() => description.uuid
	),
	material_info_uuid: uuid("material_info_uuid").references(
		() => materialSchema.info.uuid
	),
	quantity: decimal("quantity").notNull(),
	price: decimal("price").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export default purchase;
