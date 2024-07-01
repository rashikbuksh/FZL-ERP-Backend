import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";

export const buyer = pgTable("buyer", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name"),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const party = pgTable("party", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name"),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const marketing = pgTable("marketing", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name"),
	short_name: text("short_name"),
	user_uuid: uuid("user_uuid").references(() => hrSchema.users.uuid),
	remarks: text("remarks"),
});

export const merchandiser = pgTable("merchandiser", {
	uuid: uuid("uuid").primaryKey(),
	party_uuid: uuid("party_uuid").references(() => party.uuid),
	name: text("name"),
	email: text("email"),
	phone: text("phone"),
	address: text("address"),
	created: timestamp("created"),
	updated: timestamp("updated"),
});

export const factory = pgTable("factory", {
	uuid: uuid("uuid").primaryKey(),
	party_uuid: uuid("party_uuid").references(() => party.uuid),
	name: text("name"),
	phone: text("phone"),
	address: text("address"),
	created: timestamp("created"),
	updated: timestamp("updated"),
});

export const section = pgTable("section", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name"),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const properties = pgTable("properties", {
	uuid: uuid("uuid").primaryKey(),
	item_for: text("item_for"),
	type: text("type").unique(),
	name: text("name"),
	short_name: text("short_name"),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated"),
});

export default buyer;
