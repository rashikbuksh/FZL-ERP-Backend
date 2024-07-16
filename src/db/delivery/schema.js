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

const delivery = pgSchema("delivery");

export const packing_list = delivery.table("packing_list", {
	uuid: uuid("uuid").primaryKey(),
	carton_size: text("carton_size").notNull(),
	carton_weight: text("carton_weight").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const defPackingList = {
	type: "object",
	required: ["uuid", "carton_size", "carton_weight", "created_by", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		carton_size: {
			type: "string",
		},
		carton_weight: {
			type: "string",
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
		name: "Delivery/PackingList",
	},
};

export const packing_list_entry = delivery.table("packing_list_entry", {
	uuid: uuid("uuid").primaryKey(),
	packing_list_uuid: uuid("packing_list_uuid").references(
		() => packing_list.uuid
	),
	sfg_uuid: uuid("sfg_uuid").references(() => zipperSchema.sfg.uuid),
	quantity: decimal("quantity").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});

export const defPackingListEntry = {
	type: "object",
	required: ["uuid", "packing_list_uuid", "sfg_uuid", "quantity", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		packing_list_uuid: {
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
		name: "Delivery/PackingListEntry",
	},
};

export const challan = delivery.table("challan", {
	uuid: uuid("uuid").primaryKey(),
	carton_quantity: decimal("carton_quantity").notNull(),
	assign_to: uuid("assign_to").references(() => hrSchema.users.uuid),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	receive_status: integer("receive_status").default(0),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defChallan = {
	type: "object",
	required: ["uuid", "carton_quantity", "assign_to", "created_by", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		carton_quantity: {
			type: "number",
		},
		assign_to: {
			type: "string",
			format: "uuid",
		},
		created_by: {
			type: "string",
			format: "uuid",
		},
		receive_status: {
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
		name: "Delivery/Challan",
	},
};

export const challan_entry = delivery.table("challan_entry", {
	uuid: uuid("uuid").primaryKey(),
	challan_uuid: uuid("challan_uuid").references(() => challan.uuid),
	packing_list_uuid: uuid("packing_list_uuid").references(
		() => packing_list.uuid
	),
	delivery_quantity: decimal("delivery_quantity").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(0),
	remarks: text("remarks").default(0),
});

export const defChallanEntry = {
	type: "object",
	required: [
		"uuid",
		"challan_uuid",
		"packing_list_uuid",
		"delivery_quantity",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		challan_uuid: {
			type: "string",
			format: "uuid",
		},
		packing_list_uuid: {
			type: "string",
			format: "uuid",
		},
		delivery_quantity: {
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
		name: "Delivery/ChallanEntry",
	},
};

//.....................FOR TESTING.....................
export const defDelivery = {
	packing_list: defPackingList,
	packing_list_entry: defPackingListEntry,
	challan: defChallan,
	challan_entry: defChallanEntry,
};

export const tagDelivery = [
	{
		name: delivery.packing_list,
		description: "Operations about Packing List",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: delivery.packing_list_entry,
		description: "Operations about Packing List Entry",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: delivery.challan,
		description: "Operations about Challan",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: delivery.challan_entry,
		description: "Operations about Challan Entry",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
];

export default delivery;
