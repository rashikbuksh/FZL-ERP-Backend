import { integer, pgSchema, text, uuid } from "drizzle-orm/pg-core";
import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const commercial = pgSchema("commercial");

export const bank = commercial.table("bank", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	swift_code: text("swift_code").notNull(),
	address: text("address").notNull(),
	policy: text("policy").notNull(),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const lc = commercial.table("lc", {
	uuid: uuid("uuid").primaryKey(),
	party_uuid: uuid("party_uuid").references(() => publicSchema.party.uuid),
	lc_number: text("lc_number").notNull(),
	lc_date: text("lc_date").notNull(),
	payment_value: decimal("payment_value"),
	payment_date: timestamp("payment_date"),
	ldbc_fdbc: text("ldbc_fdbc").notNull(),
	acceptance_date: timestamp("acceptance_date").default(null),
	maturity_date: timestamp("maturity_date").default(null),
	commercial_executive: text("commercial_executive").notNull(),
	party_bank: text("party_bank").notNull(),
	production_complete: integer("production_complete").default(0),
	lc_cancel: integer("lc_cancel").default(0),
	handover_date: timestamp("handover_date").default(null),
	shipment_date: timestamp("shipment_date").default(null),
	expiry_date: timestamp("expiry_date"),
	ud_no: text("ud_no").default(null),
	ud_received: text("ud_received").default(null),
	at_sight: text("at_sight"),
	amd_date: timestamp("amd_date"),
	amd_count: integer("amd_count").default(0),
	problematical: integer("problematical").default(0),
	epz: integer("epz").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const pi = commercial.table("pi", {
	uuid: uuid("uuid").primaryKey(),
	lc_uuid: uuid("lc_uuid").references(() => lc.uuid),
	order_info_ids: text("order_info_ids").notNull(),
	marketing_uuid: uuid("marketing_uuid").references(
		() => publicSchema.marketing.uuid
	),
	party_uuid: uuid("party_uuid").references(() => publicSchema.party.uuid),
	merchandiser_uuid: uuid("merchandiser_uuid").references(
		() => publicSchema.merchandiser.uuid
	),
	factory_uuid: uuid("factory_uuid").references(
		() => publicSchema.factory.uuid
	),
	bank_uuid: uuid("bank_uuid").references(() => bank.uuid),
	validity: integer("validity").notNull(), // need review
	payment: integer("payment").notNull(), // need review
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const pi_entry = commercial.table("pi_entry", {
	uuid: uuid("uuid").primaryKey(),
	pi_uuid: uuid("pi_uuid").references(() => pi.uuid),
	sfg_uuid: uuid("sfg_uuid").references(() => zipperSchema.sfg.uuid),
	pi_quantity: decimal("pi_quantity").notNull(),
	created: timestamp("created"),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export default commercial;
