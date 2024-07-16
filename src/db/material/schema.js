import { decimal, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";

const material = pgSchema("material");

export const section = material.table("section", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const defMaterialSection = {
	type: "object",
	required: ["uuid", "name"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		short_name: {
			type: "string",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Material/Section",
	},
};

export const type = material.table("type", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	short_name: text("short_name"),
	remarks: text("remarks"),
});

export const defMaterialType = {
	type: "object",
	required: ["uuid", "name"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		short_name: {
			type: "string",
		},
		remarks: {
			type: "string",
		},
	},
	xml: {
		name: "Material/Type",
	},
};

export const info = material.table("info", {
	uuid: uuid("uuid").primaryKey().unique(),
	section_uuid: uuid("section_uuid").references(() => section.uuid),
	type_uuid: uuid("type_uuid").references(() => type.uuid),
	name: text("name").notNull(),
	short_name: text("short_name"),
	unit: text("unit"),
	threshold: decimal("threshold").default(0),
	description: text("description"),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});
export const defMaterialInfo = {
	type: "object",
	required: ["uuid", "section_uuid", "type_uuid", "name", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		section_uuid: {
			type: "string",
			format: "uuid",
		},
		type_uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		short_name: {
			type: "string",
		},
		unit: {
			type: "string",
		},
		threshold: {
			type: "number",
		},
		description: {
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
		name: "Material/Info",
	},
};

export const stock = material.table("stock", {
	uuid: uuid("uuid").primaryKey(),
	material_uuid: uuid("material_uuid").references(() => info.uuid),
	section_uuid: uuid("section_uuid").references(
		() => publicSchema.section.uuid
	),
	stock: decimal("stock").notNull().default(0.0),
});

export const defMaterialStock = {
	type: "object",
	required: ["uuid", "material_uuid", "section_uuid", "stock"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		material_uuid: {
			type: "string",
			format: "uuid",
		},
		section_uuid: {
			type: "string",
			format: "uuid",
		},
		stock: {
			type: "number",
		},
	},
	xml: {
		name: "Material/Stock",
	},
};

export const trx = material.table("trx", {
	uuid: uuid("uuid").primaryKey(),
	material_stock_uuid: uuid("material_stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	section_uuid_trx_to: uuid("section_uuid_trx_to")
		.references(() => publicSchema.section.uuid)
		.notNull(),
	quantity: decimal("quantity").notNull(),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});
export const defMaterialTrx = {
	type: "object",
	required: [
		"uuid",
		"material_stock_uuid",
		"section_uuid_trx_to",
		"quantity",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		material_stock_uuid: {
			type: "string",
			format: "uuid",
		},
		section_uuid_trx_to: {
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
		name: "Material/Trx",
	},
};

export const used = material.table("used", {
	uuid: uuid("uuid").primaryKey(),
	material_stock_uuid: uuid("material_stock_uuid")
		.references(() => stock.uuid)
		.notNull(),
	section_uuid: uuid("section_uuid").references(
		() => publicSchema.section.uuid
	),
	used_quantity: decimal("used_quantity").notNull(),
	wastage: decimal("wastage").notNull().default(0.0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated"),
	remarks: text("remarks"),
});
export const defMaterialUsed = {
	type: "object",
	required: [
		"uuid",
		"material_stock_uuid",
		"section_uuid",
		"used_quantity",
		"wastage",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		material_stock_uuid: {
			type: "string",
			format: "uuid",
		},
		section_uuid: {
			type: "string",
			format: "uuid",
		},
		used_quantity: {
			type: "number",
		},
		wastage: {
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
		name: "Material/Used",
	},
};

//................FOR TESTING................

export const defMaterial = {
	section: defMaterialSection,
	type: defMaterialType,
	info: defMaterialInfo,
	stock: defMaterialStock,
	trx: defMaterialTrx,
	used: defMaterialUsed,
};

export const tagMaterial = [
	{
		name: "material.section",
		description: "Material Section",
		externalDocs: {
			description: "Find out more about Material Section",
			url: "http://swagger.io",
		},
	},
	{
		name: "material.type",
		description: "Material Type",
		externalDocs: {
			description: "Find out more about Material Type",
			url: "http://swagger.io",
		},
	},
	{
		name: "material.info",
		description: "Material Information",
		externalDocs: {
			description: "Find out more about Material Information",
			url: "http://swagger.io",
		},
	},
	{
		name: "material.stock",
		description: "Material Stock",
		externalDocs: {
			description: "Find out more about Material Stock",
			url: "http://swagger.io",
		},
	},
	{
		name: "material.trx",
		description: "Material Transaction",
		externalDocs: {
			description: "Find out more about Material Transaction",
			url: "http://swagger.io",
		},
	},
	{
		name: "material.used",
		description: "Material Used",
		externalDocs: {
			description: "Find out more about Material Used",
			url: "http://swagger.io",
		},
	},
];

export default material;
