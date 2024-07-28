import {
	decimal,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const slider = pgSchema("slider");

export const stock = slider.table("stock", {
	uuid: uuid("uuid").primaryKey(),
	order_info_uuid: uuid("order_info_uuid")
		.references(() => zipperSchema.order_info.uuid)
		.default(null),
	item: uuid("item")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	zipper_number: uuid("zipper_number")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	end_type: uuid("end_type")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	puller: uuid("puller")
		.references(() => publicSchema.properties.uuid)
		.default(null),
	color: text("color").notNull(),
	order_quantity: decimal("order_quantity").default(0),
	body_quantity: decimal("body_quantity").default(0),
	cap_quantity: decimal("cap_quantity").default(0),
	puller_quantity: decimal("puller_quantity").default(0),
	link_quantity: decimal("link_quantity").default(0),
	sa_prod: decimal("sa_prod").default(0),
	coloring_stock: decimal("coloring_stock").default(0),
	coloring_prod: decimal("coloring_prod").default(0),
	trx_to_finishing: decimal("trx_to_finishing").default(0),
	u_top_quantity: decimal("u_top_quantity").default(0),
	h_bottom_quantity: decimal("h_bottom_quantity").default(0),
	box_pin_quantity: decimal("box_pin_quantity").default(0),
	two_way_pin_quantity: decimal("two_way_pin_quantity").default(0),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defStock = {
	type: "object",
	required: [
		"uuid",
		"order_info_uuid",
		"item",
		"zipper_number",
		"end_type",
		"puller",
		"color",
		"order_quantity",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		order_info_uuid: {
			type: "string",
			format: "uuid",
		},
		item: {
			type: "string",
			format: "uuid",
		},
		zipper_number: {
			type: "string",
			format: "uuid",
		},
		end_type: {
			type: "string",
			format: "uuid",
		},
		puller: {
			type: "string",
			format: "uuid",
		},
		color: {
			type: "string",
		},
		order_quantity: {
			type: "number",
		},
		body_quantity: {
			type: "number",
		},
		cap_quantity: {
			type: "number",
		},
		puller_quantity: {
			type: "number",
		},
		link_quantity: {
			type: "number",
		},
		sa_prod: {
			type: "number",
		},
		coloring_stock: {
			type: "number",
		},
		coloring_prod: {
			type: "number",
		},
		trx_to_finishing: {
			type: "number",
		},
		u_top_quantity: {
			type: "number",
		},
		h_bottom_quantity: {
			type: "number",
		},
		box_pin_quantity: {
			type: "number",
		},
		two_way_pin_quantity: {
			type: "number",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/Stock",
	},
};

export const die_casting = slider.table("die_casting", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	item: uuid("item")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	zipper_number: uuid("zipper_number")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	type: uuid("type")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	puller: uuid("puller")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	logo_type: uuid("logo_type")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	body_shape: uuid("body_shape").references(
		() => publicSchema.properties.uuid
	),
	puller_link: uuid("puller_link")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	stopper: uuid("stopper")
		.notNull()
		.references(() => publicSchema.properties.uuid),
	quantity: decimal("quantity").notNull(),
	weight: decimal("weight").notNull(),
	pcs_per_kg: decimal("pcs_per_kg").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defDieCasting = {
	type: "object",
	required: [
		"uuid",
		"name",
		"item",
		"zipper_number",
		"type",
		"puller",
		"logo_type",
		"puller_link",
		"stopper",
		"quantity",
		"weight",
		"pcs_per_kg",
		"created_at",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		item: {
			type: "number",
		},
		zipper_number: {
			type: "number",
		},
		type: {
			type: "number",
		},
		puller: {
			type: "number",
		},
		logo_type: {
			type: "number",
		},
		body_shape: {
			type: "number",
		},
		puller_link: {
			type: "number",
		},
		stopper: {
			type: "number",
		},
		quantity: {
			type: "number",
		},
		weight: {
			type: "number",
		},
		pcs_per_kg: {
			type: "number",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/DieCasting",
	},
};

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
	order_info_uuid: uuid("order_info_uuid").references(
		() => zipperSchema.order_info.uuid
	),
	created_by: uuid("created_by")
		.references(() => hrSchema.users.uuid)
		.notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defDieCastingProduction = {
	type: "object",
	required: [
		"uuid",
		"die_casting_uuid",
		"mc_no",
		"cavity_goods",
		"cavity_defect",
		"push",
		"weight",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		die_casting_uuid: {
			type: "string",
			format: "uuid",
		},
		mc_no: {
			type: "number",
		},
		cavity_goods: {
			type: "number",
		},
		cavity_defect: {
			type: "number",
		},
		push: {
			type: "number",
		},
		weight: {
			type: "number",
		},
		order_info_uuid: {
			type: "string",
			format: "uuid",
		},
		created_by: {
			type: "string",
			format: "uuid",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/DieCastingProduction",
	},
};

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
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defDieCastingTransaction = {
	type: "object",
	required: [
		"uuid",
		"die_casting_uuid",
		"stock_uuid",
		"trx_quantity",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		die_casting_uuid: {
			type: "string",
			format: "uuid",
		},
		stock_uuid: {
			type: "string",
			format: "uuid",
		},
		trx_quantity: {
			type: "number",
		},
		created_by: {
			type: "string",
			format: "uuid",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/DieCastingTransaction",
	},
};

// transaction

export const transaction = slider.table("transaction", {
	uuid: uuid("uuid").primaryKey(),
	stock_uuid: uuid("stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	section: text("section").notNull(),
	trx_quantity: decimal("trx_quantity").notNull(),
	created_by: uuid("created_by")
		.references(() => hrSchema.users.uuid)
		.notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defTransaction = {
	type: "object",
	required: [
		"uuid",
		"stock_uuid",
		"section",
		"trx_quantity",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		stock_uuid: {
			type: "string",
			format: "uuid",
		},
		section: {
			type: "string",
		},
		trx_quantity: {
			type: "number",
		},
		created_by: {
			type: "string",
			format: "uuid",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/Transaction",
	},
};

// coloring transaction

export const coloring_transaction = slider.table("coloring_transaction", {
	uuid: uuid("uuid").primaryKey(),
	stock_uuid: uuid("stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	order_info_uuid: uuid("order_info_uuid")
		.references(() => zipperSchema.order_info.uuid)
		.notNull(),
	trx_quantity: decimal("trx_quantity").notNull(),
	created_by: uuid("created_by")
		.references(() => hrSchema.users.uuid)
		.notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defColoringTransaction = {
	type: "object",
	required: [
		"uuid",
		"stock_uuid",
		"order_info_uuid",
		"trx_quantity",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		stock_uuid: {
			type: "string",
			format: "uuid",
		},
		order_info_uuid: {
			type: "string",
			format: "uuid",
		},
		trx_quantity: {
			type: "number",
		},
		created_by: {
			type: "string",
			format: "uuid",
		},
		created: {
			type: "string",
			format: "date-time",
		},
		updated: {
			type: "string",
			format: "date-time",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Slider/ColoringTransaction",
	},
};

// ------------- FOR TESTING ----------------

export const defSlider = {
	die_casting: defDieCasting,
	die_casting_production: defDieCastingProduction,
	die_casting_transaction: defDieCastingTransaction,
	stock: defStock,
	transaction: defTransaction,
	coloring_transaction: defColoringTransaction,
};

export const tagSlider = [
	{
		name: "slider.stock",
		description: "Stock",
	},
	{
		name: "slider.die_casting",
		description: "Die Casting",
	},
	{
		name: "slider.die_casting_production",
		description: "Die Casting Production",
	},
	{
		name: "slider.die_casting_transaction",
		description: "Die Casting Transaction",
	},
	{
		name: "slider.transaction",
		description: "Transaction",
	},
	{
		name: "slider.coloring_transaction",
		description: "Coloring Transaction",
	},
];

export default slider;
