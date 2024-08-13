import { decimal, integer, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import e from 'express';
import * as hrSchema from '../hr/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const delivery = pgSchema('delivery');

export const packing_list = delivery.table('packing_list', {
	uuid: uuid_primary,
	carton_size: text('carton_size').notNull(),
	carton_weight: text('carton_weight').notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defPackingList = {
	type: 'object',
	required: [
		'uuid',
		'carton_size',
		'carton_weight',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		carton_size: {
			type: 'string',
			example: '10x10x10',
		},
		carton_weight: {
			type: 'string',
			example: '10kg',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
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
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Delivery/PackingList',
	},
};

export const packing_list_entry = delivery.table('packing_list_entry', {
	uuid: uuid_primary,
	packing_list_uuid: defaultUUID('packing_list_uuid').references(
		() => packing_list.uuid
	),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => zipperSchema.sfg.uuid),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defPackingListEntry = {
	type: 'object',
	required: [
		'uuid',
		'packing_list_uuid',
		'sfg_uuid',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		packing_list_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		sfg_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 100,
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
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Delivery/PackingListEntry',
	},
};

export const challan = delivery.table('challan', {
	uuid: uuid_primary,
	carton_quantity: integer('carton_quantity').notNull(),
	assign_to: defaultUUID('assign_to').references(() => hrSchema.users.uuid),
	receive_status: integer('receive_status').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defChallan = {
	type: 'object',
	required: [
		'uuid',
		'carton_quantity',
		'assign_to',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		carton_quantity: {
			type: 'number',
			example: 100,
		},
		assign_to: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		receive_status: {
			type: 'number',
			example: 0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
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
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Delivery/Challan',
	},
};

export const challan_entry = delivery.table('challan_entry', {
	uuid: uuid_primary,
	challan_uuid: defaultUUID('challan_uuid').references(() => challan.uuid),
	packing_list_uuid: defaultUUID('packing_list_uuid').references(
		() => packing_list.uuid
	),
	delivery_quantity: decimal('delivery_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defChallanEntry = {
	type: 'object',
	required: [
		'uuid',
		'challan_uuid',
		'packing_list_uuid',
		'delivery_quantity',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		challan_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		packing_list_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		delivery_quantity: {
			type: 'number',
			example: 100,
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
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Delivery/ChallanEntry',
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
		description: 'Operations about Packing List',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: delivery.packing_list_entry,
		description: 'Operations about Packing List Entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: delivery.challan,
		description: 'Operations about Challan',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
	{
		name: delivery.challan_entry,
		description: 'Operations about Challan Entry',
		externalDocs: {
			description: 'Find out more',
			url: 'http://swagger.io',
		},
	},
];

export default delivery;
