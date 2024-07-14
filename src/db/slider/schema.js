import {
	decimal,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { order_info } from "../zipper/schema.js";

const slider = pgSchema("slider");

export const stock = slider.table("stock", {
	uuid: uuid("uuid").primaryKey(),
	order_info_uuid: uuid("order_info_uuid")
		.references(() => order_info.uuid)
		.notNull(),
	item: integer("item").notNull(),
	remarks: text("remarks").default(null),
	zipper_number: integer("zipper_number").notNull(),
	end_type: integer("end_type").notNull(),
	puller: integer("puller").notNull(),
	color: integer("color").notNull(),
	order_quantity: decimal("order_quantity").notNull(),
	body_quantity: decimal("body_quantity").default(0),
	cap_quantity: decimal("cap_quantity").default(0),
	puller_quantity: decimal("puller_quantity").default(0),
	link_quantity: decimal("link_quantity").default(0),
	sa_prod: decimal("sa_prod").notNull(),
	coloring_stock: integer("coloring_stock").notNull(),
	coloring_prod: integer("coloring_prod").notNull(),
	trx_to_finishing: integer("trx_to_finishing").notNull(),
	u_top_quantity: decimal("u_top_quantity").default(0),
	h_bottom_quantity: decimal("h_bottom_quantity").default(0),
	box_pin_quantity: decimal("box_pin_quantity").default(0),
	two_way_pin_quantity: decimal("two_way_pin_quantity").default(0),
	created_at: timestamp("created_at").notNull(),
	updated_at: timestamp("updated_at").default(null),
});

export const die_casting = slider.table("die_casting", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	item: integer("item").notNull(),
	zipper_number: integer("zipper_number").notNull(),
	type: integer("type").notNull(),
	puller: integer("puller").notNull(),
	logo_type: integer("logo_type").notNull(),
	body_shape: integer("body_shape"),
	puller_link: integer("puller_link").notNull(),
	stopper: integer("stopper").notNull(),
	quantity: decimal("quantity").notNull(),
	weight: decimal("weight").notNull(),
	pcs_per_kg: decimal("pcs_per_kg").notNull(),
	created_at: timestamp("created_at").notNull(),
	updated_at: timestamp("updated_at").default(null),
	remarks: text("remarks").default(null),
});

export const die_casting_production = slider.table("die_casting_production", {
	uuid: uuid("uuid").primaryKey(),
	die_casting_uuid: uuid("die_casting_uuid")
		.references(() => die_casting.uuid)
		.notNull(),
	mc_no: integer("mc_no").notNull(),
	cavity_goods: integer("cavity_goods").notNull(),
	cavity_defect: integer("cavity_defect").notNull(),
	push: integer("push").notNull(),
	weight: decimal("weight").notNull(),
	order_info_uuid: uuid("order_info_uuid")
		.references(() => order_info.uuid)
		.notNull(),
	created_by: uuid("created_by")
		.references(() => hrSchema.users.uuid)
		.notNull(),
	created_at: timestamp("created_at").notNull(),
	updated_at: timestamp("updated_at").default(null),
	remarks: text("remarks").default(null),
});

export const die_casting_transaction = slider.table("die_casting_transaction", {
	uuid: uuid("uuid").primaryKey(),
	die_casting_uuid: uuid("die_casting_uuid")
		.references(() => die_casting.uuid)
		.notNull(),
	stock_uuid: uuid("stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	trx_quantity: decimal("trx_quantity").notNull(),
	created_by: uuid("created_by")
		.references(() => hrSchema.users.uuid)
		.notNull(),
	created_at: timestamp("created_at").notNull(),
	updated_at: timestamp("updated_at").default(null),
	remarks: text("remarks").default(null),
});

export default slider;
