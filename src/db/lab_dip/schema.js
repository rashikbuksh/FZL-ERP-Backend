import {
	decimal,
	integer,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import { description } from "../purchase/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const lab_dip = pgSchema("lab_dip");

export const info = lab_dip.table("info", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	order_info_uuid: uuid("order_info_uuid").references(
		() => zipperSchema.order_info.uuid
	),
	lab_status: text("lab_status").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(0),
	remarks: text("remarks"),
});

export const defLabDipInfo = {
	type: "object",
	required: ["uuid", "name", "order_info_uuid", "created_by", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		order_info_uuid: {
			type: "string",
			format: "uuid",
		},
		lab_status: {
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
		name: "LabDip/Info",
	},
};

export const recipe = lab_dip.table("recipe", {
	uuid: uuid("uuid").primaryKey(),
	lab_dip_info_uuid: uuid("lab_dip_info_uuid").references(() => info.uuid),
	name: text("name").notNull(),
	approved: integer("approved").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	status: integer("status").default(0),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defLabDipRecipe = {
	type: "object",
	required: ["uuid", "lab_dip_info_uuid", "name", "created_by", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		lab_dip_info_uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		approved: {
			type: "integer",
		},
		created_by: {
			type: "string",
			format: "uuid",
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
	},
	xml: {
		name: "LabDip/Recipe",
	},
};

export const recipe_entry = lab_dip.table("recipe_entry", {
	uuid: uuid("uuid").primaryKey(),
	recipe_uuid: uuid("recipe_uuid").references(() => recipe.uuid),
	color: text("color").notNull(),
	quantity: decimal("quantity").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks"),
});

export const defLabDipRecipeEntry = {
	type: "object",
	required: ["uuid", "recipe_uuid", "color", "quantity", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		recipe_uuid: {
			type: "string",
			format: "uuid",
		},
		color: {
			type: "string",
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
		name: "LabDip/RecipeEntry",
	},
};

//............FOR TESTING.............

export const defLabDip = {
	info: defLabDipInfo,
	recipe: defLabDipRecipe,
	recipe_entry: defLabDipRecipeEntry,
};

export const tagLabDip = [
	{
		name: lab_dip.info,
		description: "Everything about info of Lab dip",
		externalDocs: {
			description: "Find out more about Lab dip",
			url: "http://swagger.io",
		},
	},
	{
		name: lab_dip.recipe,
		description: "Operations about recipe of Lab dip",
	},
	{
		name: lab_dip.recipe_entry,
		description: "Operations about recipe entry of Lab dip",
	},
];

export default lab_dip;
