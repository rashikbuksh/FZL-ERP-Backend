import { decimal, integer, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as materialSchema from '../material/schema.js';
import { sql } from 'drizzle-orm';

const purchase = pgSchema('purchase');

export const vendor = purchase.table('vendor', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	contact_name: text('contact_name').notNull(),
	email: text('email').notNull(),
	office_address: text('office_address').notNull(),
	contact_number: text('contact_number').default(null),
	remarks: text('remarks').default(null),
});

export const defPurchaseVendor = {
	type: 'object',
	required: ['uuid', 'name', 'email', 'office_address'],
	properties: {
		uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174000',
		},
		name: {
			type: 'string',
			example: 'Z Group',
		},
		contact_name: {
			type: 'string',
			example: 'Jahid Hasan',
		},
		email: {
			type: 'string',
			example: 'z456@gmail.com',
		},
		office_address: {
			type: 'string',
			example: 'Dhaka, Bangladesh',
		},
		contact_number: {
			type: 'string',
			example: '01700000000',
		},
		remarks: {
			type: 'string',
			example: 'This is a vendor',
		},
	},
	xml: {
		name: 'Purchase/Vendor',
	},
};

export const purchase_description_sequence = purchase.sequence(
	'purchase_description_sequence',
	{
		startWith: 1,
		increment: 1,
	}
);

export const description = purchase.table('description', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('purchase.purchase_description_sequence')`)
		.notNull(),
	vendor_uuid: defaultUUID('vendor_uuid').references(() => vendor.uuid),
	is_local: integer('is_local').notNull(),
	lc_number: text('lc_number').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defPurchaseDescription = {
	type: 'object',
	required: ['uuid', 'vendor_uuid', 'created_by', 'created_at', 'is_local'],
	properties: {
		uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174002',
		},
		vendor_uuid: {
			type: 'string',
			example: '123e4567-e89b-12d3-a456-426614174000',
		},
		is_local: {
			type: 'integer',
			example: 1,
		},
		lc_number: {
			type: 'string',
			example: '1234',
		},
		created_by: {
			type: 'string',
			example: '1234567890',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is a description',
		},
	},
	xml: {
		name: 'Purchase/Description',
	},
};

export const entry = purchase.table('entry', {
	uuid: uuid_primary,
	purchase_description_uuid: defaultUUID(
		'purchase_description_uuid'
	).references(() => description.uuid),
	material_uuid: defaultUUID('material_uuid'),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	price: decimal('price', {
		precision: 20,
		scale: 4,
	}).default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defPurchaseEntry = {
	type: 'object',
	required: [
		'uuid',
		'purchase_description_uuid',
		'material_uuid',
		'quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		purchase_description_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 1000.0,
		},
		price: {
			type: 'number',
			example: 1111.0,
		},
		created_by: {
			type: 'string',
			example: '1234567890',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Purchase/Entry',
	},
};

//.....................FOR TESTING.....................

export const defPurchase = {
	vendor: defPurchaseVendor,
	description: defPurchaseDescription,
	entry: defPurchaseEntry,
};

export const tagPurchase = [
	{
		'purchase.vendor': {
			name: 'Vendor',
			description: 'Vendor',
		},
	},
	{
		'purchase.description': {
			name: 'Description',
			description: 'Description',
		},
	},
	{
		'purchase.entry': {
			name: 'Entry',
			description: 'Entry',
		},
	},
];

export default purchase;
