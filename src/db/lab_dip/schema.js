import {
	decimal,
	integer,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const lab_dip = pgSchema("lab_dip");

export const info = lab_dip.table("info", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	order_info_uuid: uuid("order_info_uuid").references(
		() => zipperSchema.order_info.uuid
	),
	lab_status: text("lab_status").default(null),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const recipe = lab_dip.table("recipe", {
	uuid: uuid("uuid").primaryKey(),
	lab_dip_info_uuid: uuid("lab_dip_info_uuid").references(() => info.uuid),
	name: text("name").notNull(),
	approved: integer("approved").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	status: integer("status").default(0),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const recipe_entry = lab_dip.table("recipe_entry", {
	uuid: uuid("uuid").primaryKey(),
	recipe_uuid: uuid("recipe_uuid").references(() => recipe.uuid),
	color: text("color").notNull(),
	quantity: decimal("quantity").notNull(),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export default lab_dip;
