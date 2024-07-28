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
import * as sliderSchema from "../slider/schema.js";

const zipper = pgSchema("zipper");

export const swatchStatusEnum = zipper.enum("swatch_status_enum", [
	"pending",
	"approved",
	"rejected",
]);

export const sliderStartingSectionEnum = zipper.enum(
	"slider_starting_section_enum",
	["die_casting", "slider_assembly", "coloring"]
);

export const order_info = zipper.table("order_info", {
	uuid: uuid("uuid").primaryKey(),
	id: serial("id").default(null), // for order number serial if needed
	reference_order_info_uuid: uuid("reference_order_info_uuid")
		.references(() => order_info.uuid)
		.default(null),
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
	is_cash: integer("is_cash").default(0),
	marketing_priority: text("marketing_priority").default(null),
	factory_priority: text("factory_priority").default(null),
	status: integer("status").notNull().default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_order_info = {
	type: "object",
	required: [
		"uuid",
		"buyer_uuid",
		"party_uuid",
		"marketing_uuid",
		"merchandiser_uuid",
		"factory_uuid",
		"is_sample",
		"is_bill",
		"marketing_priority",
		"factory_priority",
		"status",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		id: {
			type: "serial",
		},
		reference_order_info_uuid: {
			type: "string",
			format: "uuid",
		},
		buyer_uuid: {
			type: "string",
			format: "uuid",
		},
		party_uuid: {
			type: "string",
			format: "uuid",
		},
		marketing_uuid: {
			type: "string",
			format: "uuid",
		},
		merchandiser_uuid: {
			type: "string",
			format: "uuid",
		},
		factory_uuid: {
			type: "string",
			format: "uuid",
		},
		is_sample: {
			type: "integer",
		},
		is_bill: {
			type: "integer",
		},
		is_cash: {
			type: "integer",
		},
		marketing_priority: {
			type: "string",
		},
		factory_priority: {
			type: "string",
		},
		status: {
			type: "integer",
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
		name: "zipper.order_info",
	},
};

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
	special_requirement: text("special_requirement").default(null),
	hand: uuid("hand").references(() => publicSchema.properties.uuid),
	stopper_type: uuid("stopper_type").references(
		() => publicSchema.properties.uuid
	),
	coloring_type: uuid("coloring_type").references(
		() => publicSchema.properties.uuid
	),
	is_slider_provided: integer("is_slider_provided").default(0),
	slider: uuid("slider").references(() => publicSchema.properties.uuid),
	slider_starting_section: sliderStartingSectionEnum(
		"slider_starting_section_enum"
	),
	top_stopper: uuid("top_stopper").references(
		() => publicSchema.properties.uuid
	),
	bottom_stopper: uuid("bottom_stopper").references(
		() => publicSchema.properties.uuid
	),
	logo_type: uuid("logo_type").references(() => publicSchema.properties.uuid),
	is_logo_body: integer("is_logo_body").notNull().default(0),
	is_logo_puller: integer("is_logo_puller").notNull().default(0),
	description: text("description").default(null),
	status: integer("status").notNull().default(0),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
	slider_body_shape: uuid("slider_body_shape").references(
		() => publicSchema.properties.uuid
	),
	slider_link: uuid("slider_link").references(
		() => publicSchema.properties.uuid
	),
	end_user: uuid("end_user").references(() => publicSchema.properties.uuid),
	garment: text("garment").default(null),
	light_preference: uuid("light_preference").references(
		() => publicSchema.properties.uuid
	),
	garments_wash: uuid("garments_wash").references(
		() => publicSchema.properties.uuid
	),
	puller_link: uuid("puller_link").references(
		() => publicSchema.properties.uuid
	),
});

export const def_zipper_order_description = {
	type: "object",
	required: [
		"uuid",
		"order_info_uuid",
		"item",
		"zipper_number",
		"end_type",
		"lock_type",
		"puller_type",
		"teeth_color",
		"puller_color",
		"hand",
		"stopper_type",
		"coloring_type",
		"slider",
		"top_stopper",
		"bottom_stopper",
		"logo_type",
		"is_logo_body",
		"is_logo_puller",
		"slider_body_shape",
		"slider_link",
		"end_user",
		"light_preference",
		"garments_wash",
		"puller_link",
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
		lock_type: {
			type: "string",
			format: "uuid",
		},
		puller_type: {
			type: "string",
			format: "uuid",
		},
		teeth_color: {
			type: "string",
			format: "uuid",
		},
		puller_color: {
			type: "string",
			format: "uuid",
		},
		special_requirement: {
			type: "object",
		},
		hand: {
			type: "string",
			format: "uuid",
		},
		stopper_type: {
			type: "string",
			format: "uuid",
		},
		coloring_type: {
			type: "string",
			format: "uuid",
		},
		is_slider_provided: {
			type: "integer",
		},
		slider: {
			type: "string",
			format: "uuid",
		},
		slider_starting_section: {
			type: "string",
		},
		top_stopper: {
			type: "string",
			format: "uuid",
		},
		bottom_stopper: {
			type: "string",
			format: "uuid",
		},
		logo_type: {
			type: "string",
			format: "uuid",
		},
		is_logo_body: {
			type: "integer",
		},
		is_logo_puller: {
			type: "integer",
		},
		description: {
			type: "string",
		},
		status: {
			type: "integer",
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
		slider_body_shape: {
			type: "string",
			format: "uuid",
		},
		slider_link: {
			type: "string",
			format: "uuid",
		},
		end_user: {
			type: "string",
			format: "uuid",
		},
		garment: {
			type: "string",
		},
		light_preference: {
			type: "string",
			format: "uuid",
		},
		garments_wash: {
			type: "string",
			format: "uuid",
		},
		puller_link: {
			type: "string",
			format: "uuid",
		},
	},
	xml: {
		name: "zipper.order_description",
	},
};

export const order_entry = zipper.table("order_entry", {
	uuid: uuid("uuid").primaryKey(),
	order_description_uuid: uuid("order_description_uuid").references(
		() => order_description.uuid
	),
	style: text("style").notNull(),
	color: text("color").notNull(),
	size: text("size").notNull(),
	quantity: decimal("quantity").notNull(),
	company_price: decimal("company_price").notNull().default(0.0),
	party_price: decimal("party_price").notNull().default(0.0),
	status: integer("status").default(1),
	swatch_status: swatchStatusEnum("swatch_status_enum").default("pending"),
	swap_approval_date: text("swap_approval_date").default(null),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_order_entry = {
	type: "object",
	required: [
		"uuid",
		"order_description_uuid",
		"style",
		"color",
		"size",
		"quantity",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		order_description_uuid: {
			type: "string",
			format: "uuid",
		},
		style: {
			type: "string",
		},
		color: {
			type: "string",
		},
		size: {
			type: "string",
		},
		quantity: {
			type: "number",
		},
		company_price: {
			type: "number",
		},
		party_price: {
			type: "number",
		},
		status: {
			type: "integer",
		},
		swatch_status: {
			type: "string",
		},
		swap_approval_date: {
			type: "string",
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
		name: "Zipper/Order-Entry",
	},
};

export const sfg = zipper.table("sfg", {
	uuid: uuid("uuid").primaryKey(),
	order_entry_uuid: uuid("order_entry_uuid").references(
		() => order_entry.uuid
	),
	recipe_uuid: uuid("recipe_uuid")
		.references(() => labDipSchema.recipe.uuid)
		.default(null),
	// dyeing_and_iron_stock: decimal("dyeing_and_iron_stock").default(0.0), // dyeing_and_iron has been moved to dyeing_batch table
	dyeing_and_iron_prod: decimal("dyeing_and_iron_prod").default(0),
	teeth_molding_stock: decimal("teeth_molding_stock").default(0.0),
	teeth_molding_prod: decimal("teeth_molding_prod").default(0.0),
	teeth_coloring_stock: decimal("teeth_coloring_stock").default(0.0),
	teeth_coloring_prod: decimal("teeth_coloring_prod").default(0.0),
	finishing_stock: decimal("finishing_stock").default(0.0),
	finishing_prod: decimal("finishing_prod").default(0.0),
	// die_casting_prod: decimal("die_casting_prod").default(0),
	// slider_assembly_stock: decimal("slider_assembly_stock").default(0),
	// slider_assembly_prod: decimal("slider_assembly_prod").default(0),
	// coloring_stock: decimal("coloring_stock").default(0.0), // slider section has been moved to slider schema
	coloring_prod: decimal("coloring_prod").default(0.0),
	warehouse: decimal("warehouse").notNull().default(0.0),
	delivered: decimal("delivered").notNull().default(0.0),
	pi: decimal("pi").notNull().default(0.0),
	remarks: text("remarks").default(null),
});

export const def_zipper_sfg = {
	type: "object",
	required: ["uuid", "order_entry_uuid", "recipe_uuid"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		order_entry_uuid: {
			type: "string",
			format: "uuid",
		},
		recipe_uuid: {
			type: "string",
			format: "uuid",
		},
		dyeing_and_iron_prod: {
			type: "number",
		},
		teeth_molding_stock: {
			type: "number",
		},
		teeth_molding_prod: {
			type: "number",
		},
		teeth_coloring_stock: {
			type: "number",
		},
		teeth_coloring_prod: {
			type: "number",
		},
		finishing_stock: {
			type: "number",
		},
		finishing_prod: {
			type: "number",
		},
		coloring_prod: {
			type: "number",
		},
		warehouse: {
			type: "number",
		},
		delivered: {
			type: "number",
		},
		pi: {
			type: "number",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Zipper/Sfg",
	},
};

export const sfg_production = zipper.table("sfg_production", {
	uuid: uuid("uuid").primaryKey(),
	sfg_uuid: uuid("sfg_uuid").references(() => sfg.uuid),
	section: text("section").notNull(),
	used_quantity: decimal("used_quantity").notNull(),
	production_quantity: decimal("production_quantity").default(0.0),
	wastage: decimal("wastage").notNull().default(0.0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_sfg_production = {
	type: "object",
	required: [
		"uuid",
		"sfg_uuid",
		"section",
		"production_quantity",
		"wastage",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		sfg_uuid: {
			type: "string",
			format: "uuid",
		},
		section: {
			type: "string",
		},
		used_quantity: {
			type: "number",
		},
		production_quantity: {
			type: "number",
		},
		wastage: {
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
		name: "Zipper/Sfg-Production",
	},
};

export const sfg_transaction = zipper.table("sfg_transaction", {
	uuid: uuid("uuid").primaryKey(),
	order_entry_uuid: uuid("order_entry_uuid").references(
		() => order_entry.uuid
	),
	section: text("section").notNull(),
	trx_from: text("trx_from").notNull(),
	trx_to: text("trx_to").notNull(),
	trx_quantity: decimal("trx_quantity").notNull(),
	slider_item_uuid: uuid("slider_item_uuid").references(
		() => sliderSchema.stock.uuid
	),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_sfg_transaction = {
	type: "object",
	required: [
		"uuid",
		"order_entry_uuid",
		"section",
		"trx_from",
		"trx_to",
		"trx_quantity",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		order_entry_uuid: {
			type: "string",
			format: "uuid",
		},
		section: {
			type: "string",
		},
		trx_from: {
			type: "string",
		},
		trx_to: {
			type: "string",
		},
		trx_quantity: {
			type: "number",
		},
		// slider_item_id: {
		// 	type: "string",
		// },
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
		name: "Zipper/Sfg-Transaction",
	},
};

// zipper batch
export const batch = zipper.table("batch", {
	uuid: uuid("uuid").primaryKey(),
	id: serial("id").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_batch = {
	type: "object",
	required: ["uuid", "created_by", "created"],
	properties: {
		uuid: {
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
		name: "Zipper/Batch",
	},
};

export const batch_entry = zipper.table("batch_entry", {
	uuid: uuid("uuid").primaryKey(),
	batch_uuid: uuid("batch_uuid").references(() => batch.uuid),
	sfg_uuid: uuid("sfg_uuid").references(() => sfg.uuid),
	quantity: decimal("quantity").notNull(),
	production_quantity: decimal("production_quantity").notNull(),
	production_quantity_in_kg: decimal("production_quantity_in_kg").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_batch_entry = {
	type: "object",
	required: [
		"uuid",
		"batch_uuid",
		"sfg_uuid",
		"quantity",
		"production_quantity",
		"production_quantity_in_kg",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		batch_uuid: {
			type: "string",
			format: "uuid",
		},
		sfg_uuid: {
			type: "string",
			format: "uuid",
		},
		quantity: {
			type: "number",
		},
		production_quantity: {
			type: "number",
		},
		production_quantity_in_kg: {
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
		name: "Zipper/Batch-Entry",
	},
};

// dyeing batch
export const dying_batch = zipper.table("dying_batch", {
	uuid: uuid("uuid").primaryKey(),
	id: serial("id").notNull(),
	mc_no: integer("mc_no").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_dying_batch = {
	type: "object",
	required: ["uuid", "mc_no", "created_by", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		mc_no: {
			type: "integer",
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
		name: "Zipper/Dying-Batch",
	},
};

export const dying_batch_entry = zipper.table("dying_batch_entry", {
	uuid: uuid("uuid").primaryKey(),
	dying_batch_uuid: uuid("dying_batch_uuid").references(
		() => dying_batch.uuid
	),
	batch_entry_uuid: uuid("batch_entry_uuid").references(
		() => batch_entry.uuid
	),
	quantity: decimal("quantity").notNull(),
	production_quantity: decimal("production_quantity").notNull(),
	production_quantity_in_kg: decimal("production_quantity_in_kg").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_dying_batch_entry = {
	type: "object",
	required: [
		"uuid",
		"dying_batch_uuid",
		"batch_entry_uuid",
		"quantity",
		"production_quantity",
		"production_quantity_in_kg",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		dying_batch_uuid: {
			type: "string",
			format: "uuid",
		},
		batch_entry_uuid: {
			type: "string",
			format: "uuid",
		},
		quantity: {
			type: "number",
		},
		production_quantity: {
			type: "number",
		},
		production_quantity_in_kg: {
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
		name: "Zipper/Dying-Batch-Entry",
	},
};

// tape and coil
export const tape_coil = zipper.table("tape_coil", {
	uuid: uuid("uuid").primaryKey(),
	type: text("type").notNull(),
	zipper_number: decimal("zipper_number", {
		precision: 2,
		scale: 1,
	}).notNull(),
	quantity: decimal("quantity").notNull(),
	trx_quantity_in_coil: decimal("trx_quantity_in_coil").notNull(),
	quantity_in_coil: decimal("quantity_in_coil").notNull(),
	remarks: text("remarks").default(null),
});

export const def_zipper_tape_coil = {
	type: "object",
	required: [
		"uuid",
		"type",
		"zipper_number",
		"quantity",
		"trx_quantity_in_coil",
		"quantity_in_coil",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		type: {
			type: "string",
		},
		zipper_number: {
			type: "number",
		},
		quantity: {
			type: "number",
		},
		trx_quantity_in_coil: {
			type: "number",
		},
		quantity_in_coil: {
			type: "number",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Zipper/Tape-Coil",
	},
};

export const tape_to_coil = zipper.table("tape_to_coil", {
	uuid: uuid("uuid").primaryKey(),
	tape_coil_uuid: uuid("tape_coil_uuid").references(() => tape_coil.uuid),
	trx_quantity: decimal("trx_quantity").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_tape_to_coil = {
	type: "object",
	required: [
		"uuid",
		"tape_coil_uuid",
		"trx_quantity",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		tape_coil_uuid: {
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
		name: "Zipper/Tape-To-Coil",
	},
};

export const tape_coil_production = zipper.table("tape_coil_production", {
	uuid: uuid("uuid").primaryKey(),
	section: text("section").notNull(),
	tape_coil_uuid: uuid("tape_coil_uuid").references(() => tape_coil.uuid),
	production_quantity: decimal("production_quantity").notNull(),
	wastage: decimal("wastage").notNull().default(0.0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const def_zipper_tape_coil_production = {
	type: "object",
	required: [
		"uuid",
		"section",
		"tape_coil_uuid",
		"production_quantity",
		"wastage",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		section: {
			type: "string",
		},
		tape_coil_uuid: {
			type: "string",
			format: "uuid",
		},
		production_quantity: {
			type: "number",
		},
		wastage: {
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
		name: "Zipper/Tape-Coil-Production",
	},
};

//....................FOR TESTING.......................
export const defZipper = {
	order_info: def_zipper_order_info,
	order_description: def_zipper_order_description,
	order_entry: def_zipper_order_entry,
	sfg: def_zipper_sfg,
	sfg_production: def_zipper_sfg_production,
	sfg_transaction: def_zipper_sfg_transaction,
	batch: def_zipper_batch,
	batch_entry: def_zipper_batch_entry,
	dying_batch: def_zipper_dying_batch,
	dying_batch_entry: def_zipper_dying_batch_entry,
	tape_coil: def_zipper_tape_coil,
	tape_to_coil: def_zipper_tape_to_coil,
	tape_coil_production: def_zipper_tape_coil_production,
};

export const tagZipper = [
	{
		name: "zipper.order_info",
		description: "Zipper Order Info",
	},
	{
		name: "zipper.order_description",
		description: "Zipper Order Description",
	},
	{
		name: "zipper.order_entry",
		description: "Zipper Order Entry",
	},
	{
		name: "zipper.sfg",
		description: "Zipper SFG",
	},
	{
		name: "zipper.sfg_production",
		description: "Zipper SFG Production",
	},
	{
		name: "zipper.sfg_transaction",
		description: "Zipper SFG Transaction",
	},
	{
		name: "zipper.batch",
		description: "Zipper Batch",
	},
	{
		name: "zipper.batch_entry",
		description: "Zipper Batch Entry",
	},
	{
		name: "zipper.dying_batch",
		description: "Zipper Dying Batch",
	},
	{
		name: "zipper.dying_batch_entry",
		description: "Zipper Dying Batch Entry",
	},
	{
		name: "zipper.tape_coil",
		description: "Zipper Tape Coil",
	},
	{
		name: "zipper.tape_to_coil",
		description: "Zipper Tape To Coil",
	},
	{
		name: "zipper.tape_coil_production",
		description: "Zipper Tape Coil Production",
	},
];

export default zipper;
