import {
	decimal,
	integer,
	PgArray,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const commercial = pgSchema("commercial");

export const bank = commercial.table("bank", {
	uuid: uuid("uuid").primaryKey(),
	name: text("name").notNull(),
	swift_code: text("swift_code").notNull(),
	address: text("address").default(null),
	policy: text("policy").default(null),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defCommercialBank = {
	type: "object",
	required: ["uuid", "name", "swift_code", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		name: {
			type: "string",
		},
		swift_code: {
			type: "string",
		},
		address: {
			type: "string",
		},
		policy: {
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
		name: "Commercial/Bank",
	},
};

export const lc = commercial.table("lc", {
	uuid: uuid("uuid").primaryKey(),
	party_uuid: uuid("party_uuid").references(() => publicSchema.party.uuid),
	file_no: text("file_no").notNull(),
	lc_number: text("lc_number").notNull(),
	lc_date: text("lc_date").notNull(),
	payment_value: decimal("payment_value").notNull(),
	payment_date: timestamp("payment_date").default(null),
	ldbc_fdbc: text("ldbc_fdbc").notNull(),
	acceptance_date: timestamp("acceptance_date").default(null),
	maturity_date: timestamp("maturity_date").default(null),
	commercial_executive: text("commercial_executive").notNull(),
	party_bank: text("party_bank").notNull(),
	production_complete: integer("production_complete").default(0),
	lc_cancel: integer("lc_cancel").default(0),
	handover_date: timestamp("handover_date").default(null),
	shipment_date: timestamp("shipment_date").default(null),
	expiry_date: timestamp("expiry_date").default(null),
	ud_no: text("ud_no").default(null),
	ud_received: text("ud_received").default(null),
	at_sight: text("at_sight").notNull(),
	amd_date: timestamp("amd_date").default(null),
	amd_count: integer("amd_count").default(0),
	problematical: integer("problematical").default(0),
	epz: integer("epz").default(0),
	created_by: uuid("created_by").references(() => hrSchema.users.uuid),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defCommercialLc = {
	type: "object",
	required: [
		"uuid",
		"party_uuid",
		"file_no",
		"lc_number",
		"lc_date",
		"ldbc_fdbc",
		"commercial_executive",
		"party_bank",
		"expiry_date",
		"at_sight",
		"created",
		"created_by",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		party_uuid: {
			type: "string",
			format: "uuid",
		},
		file_no: {
			type: "string",
		},
		lc_number: {
			type: "string",
		},
		lc_date: {
			type: "string",
		},
		payment_value: {
			type: "number",
		},
		payment_date: {
			type: "string",
			format: "date-time",
		},
		ldbc_fdbc: {
			type: "string",
		},
		acceptance_date: {
			type: "string",
			format: "date-time",
		},
		maturity_date: {
			type: "string",
			format: "date-time",
		},
		commercial_executive: {
			type: "string",
		},
		party_bank: {
			type: "string",
		},
		production_complete: {
			type: "integer",
		},
		lc_cancel: {
			type: "integer",
		},
		handover_date: {
			type: "string",
			format: "date-time",
		},
		shipment_date: {
			type: "string",
			format: "date-time",
		},
		expiry_date: {
			type: "string",
			format: "date-time",
		},
		ud_no: {
			type: "string",
		},
		ud_received: {
			type: "string",
		},
		at_sight: {
			type: "string",
		},
		amd_date: {
			type: "string",
			format: "date-time",
		},
		amd_count: {
			type: "integer",
		},
		problematical: {
			type: "integer",
		},
		epz: {
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
		name: "Commercial/Lc",
	},
};

export const pi = commercial.table("pi", {
	uuid: uuid("uuid").primaryKey(),
	lc_uuid: uuid("lc_uuid").references(() => lc.uuid),
	order_info_ids: text("order_info_ids").array().notNull(),
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
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defCommercialPi = {
	type: "object",
	required: [
		"uuid",
		"lc_uuid",
		"order_info_ids",
		"marketing_uuid",
		"party_uuid",
		"merchandiser_uuid",
		"factory_uuid",
		"bank_uuid",
		"validity",
		"payment",
		"created_by",
		"created",
	],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		lc_uuid: {
			type: "string",
			format: "uuid",
		},
		order_info_ids: {
			type: "array",
			items: {
				type: "string",
			},
		},
		marketing_uuid: {
			type: "string",
			format: "uuid",
		},
		party_uuid: {
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
		bank_uuid: {
			type: "string",
			format: "uuid",
		},
		validity: {
			type: "integer",
		},
		payment: {
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
		name: "Commercial/Pi",
	},
};

export const pi_entry = commercial.table("pi_entry", {
	uuid: uuid("uuid").primaryKey(),
	pi_uuid: uuid("pi_uuid").references(() => pi.uuid),
	sfg_uuid: uuid("sfg_uuid").references(() => zipperSchema.sfg.uuid),
	pi_quantity: decimal("pi_quantity").notNull(),
	created: timestamp("created").notNull(),
	updated: timestamp("updated").default(null),
	remarks: text("remarks").default(null),
});

export const defCommercialPiEntry = {
	type: "object",
	required: ["uuid", "pi_uuid", "sfg_uuid", "pi_quantity", "created"],
	properties: {
		uuid: {
			type: "string",
			format: "uuid",
		},
		pi_uuid: {
			type: "string",
			format: "uuid",
		},
		sfg_uuid: {
			type: "string",
			format: "uuid",
		},
		pi_quantity: {
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
		name: "Commercial/PiEntry",
	},
};

//..................FOR TESTING.......................

export const defCommercial = {
	bank: defCommercialBank,
	lc: defCommercialLc,
	pi: defCommercialPi,
	pi_entry: defCommercialPiEntry,
};

export const tagCommercial = [
	{
		name: "commercial.bank",
		description: "Everything about commercial bank",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: "commercial.lc",
		description: "Operations about commercial lc",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: "commercial.pi",
		description: "Operations about commercial pi",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
	{
		name: "commercial.pi_entry",
		description: "Operations about commercial pi_entry",
		externalDocs: {
			description: "Find out more",
			url: "http://swagger.io",
		},
	},
];

export default commercial;
