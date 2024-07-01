import {
	decimal,
	integer,
	jsonb,
	pgSchema,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as labDipSchema from "../lab_dip/schema.js";
import * as publicSchema from "../public/schema.js";

const zipper = pgSchema("zipper");

export const order_info = zipper.table("order_info", {
	uuid: uuid("uuid").primaryKey(),
	id: serial("id"),
	reference_order_info_uuid: uuid("reference_order_info_uuid").default(null),
	buyer_uuid: uuid("buyer_uuid").references(() => publicSchema.buyer.uuid),
	party_uuid: uuid("party_uuid").references(() => publicSchema.party.uuid),
	marketing_uuid: uuid("marketing_uuid").references(
		() => publicSchema.marketing.uuid
	),
	merchandiser_uuid: uuid("merchandiser_uuid").references(
		() => publicSchema.merchandiser.uuid
	),
	factory_uuid: uuid("factory_uuid").references(
		() => publicSchema.factory.uuid
	),
	is_sample: integer("is_sample").default(0),
	is_bill: integer("is_bill").default(0),
	marketing_priority: text("marketing_priority").default(null),
	factory_priority: text("factory_priority").default(null),
	status: integer("status").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const order_description = zipper.table("order_description", {
	uuid: uuid("uuid").primaryKey(),
	order_info_uuid: uuid("order_info_uuid").references(() => order_info.uuid),
	item: uuid("item").references(() => publicSchema.properties.uuid),
	zipper_number: uuid("zipper_number").references(
		() => publicSchema.properties.uuid
	),
	end_type: uuid("end_type").references(() => publicSchema.properties.uuid),
	lock_type: uuid("lock_type").references(() => publicSchema.properties.uuid),
	puller_type: uuid("puller_type").references(
		() => publicSchema.properties.uuid
	),
	teeth_color: uuid("teeth_color").references(
		() => publicSchema.properties.uuid
	),
	puller_color: uuid("puller_color").references(
		() => publicSchema.properties.uuid
	),
	special_requirement: jsonb("special_requirement").default(null),
	hand: uuid("hand").references(() => publicSchema.properties.uuid),
	stopper_type: uuid("stopper_type").references(
		() => publicSchema.properties.uuid
	),
	coloring_type: uuid("coloring_type").references(
		() => publicSchema.properties.uuid
	),
	is_slider_provided: integer("is_slider_provided").default(0),
	slider: uuid("slider").references(() => publicSchema.properties.uuid),
	slider_starting_section: text("slider_starting_section").default(null),
	top_stopper: uuid("top_stopper").references(
		() => publicSchema.properties.uuid
	),
	bottom_stopper: uuid("bottom_stopper").references(
		() => publicSchema.properties.uuid
	),
	logo_type: uuid("logo_type").references(() => publicSchema.properties.uuid),
	is_logo_body: integer("is_logo_body").default(0),
	is_logo_puller: integer("is_logo_puller").default(0),
	description: text("description").default(null),
	status: integer("status").default(0),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const order_entry = zipper.table("order_entry", {
	uuid: uuid("uuid").primaryKey(),
	order_description_uuid: uuid("order_description_uuid").references(
		() => order_description.uuid
	),
	style: text("style").notNull(),
	color: text("color").notNull(),
	size: text("size").notNull(),
	quantity: decimal("quantity").notNull(),
	company_price: decimal("company_price").notNull(),
	party_price: decimal("party_price").notNull(),
	status: integer("status").default(0),
	swatch_status: text("swatch_status").default(null),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const sfg = zipper.table("sfg", {
	uuid: uuid("uuid").primaryKey(),
	order_entry_uuid: uuid("order_entry_uuid").references(
		() => order_entry.uuid
	),
	recipe_uuid: uuid("recipe_uuid").references(() => labDipSchema.recipe.uuid),
	dyeing_and_iron_stock: decimal("dyeing_and_iron_stock").default(0),
	dyeing_and_iron_prod: decimal("dyeing_and_iron_prod").default(0),
	teeth_molding_stock: decimal("teeth_molding_stock").default(0),
	teeth_molding_prod: decimal("teeth_molding_prod").default(0),
	teeth_coloring_stock: decimal("teeth_coloring_stock").default(0),
	teeth_coloring_prod: decimal("teeth_coloring_prod").default(0),
	finishing_stock: decimal("finishing_stock").default(0),
	finishing_prod: decimal("finishing_prod").default(0),
	die_casting_prod: decimal("die_casting_prod").default(0),
	slider_assembly_stock: decimal("slider_assembly_stock").default(0),
	slider_assembly_prod: decimal("slider_assembly_prod").default(0),
	coloring_stock: decimal("coloring_stock").default(0),
	coloring_prod: decimal("coloring_prod").default(0),
	pi: decimal("pi").default(0),
	warehouse: decimal("warehouse").default(0),
	delivered: decimal("delivered").default(0),
});

export const sfg_production = zipper.table("sfg_production", {
	uuid: uuid("uuid").primaryKey(),
	sfg_uuid: uuid("sfg_uuid").references(() => sfg.uuid),
	section: text("section").notNull(),
	used_quantity: decimal("used_quantity").notNull(),
	production_quantity: decimal("production_quantity").notNull(),
	wastage: decimal("wastage").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const sfg_transaction = zipper.table("sfg_transaction", {
	uuid: uuid("uuid").primaryKey(),
	order_entry_uuid: uuid("order_entry_uuid").references(
		() => order_entry.uuid
	),
	section: text("section").notNull(),
	trx_from: text("trx_from").notNull(),
	trx_to: text("trx_to").notNull(),
	trx_quantity: decimal("trx_quantity").notNull(),
	// slider_item_id: text("slider_item_id").default(null),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created"),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export default zipper;
