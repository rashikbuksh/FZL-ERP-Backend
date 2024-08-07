import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const slider = pgSchema('slider');

export const stock = slider.table('stock', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').default(null),
	item: defaultUUID('item').notNull(),
	zipper_number: defaultUUID('zipper_number').notNull(),
	end_type: defaultUUID('end_type').notNull(),
	puller: defaultUUID('puller').default(null),
	color: text('color').notNull(),
	order_quantity: decimal('order_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	body_quantity: decimal('body_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	cap_quantity: decimal('cap_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	puller_quantity: decimal('puller_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	link_quantity: decimal('link_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	sa_prod: decimal('sa_prod', {
		precision: 20,
		scale: 4,
	}).default(0),
	coloring_stock: decimal('coloring_stock', {
		precision: 20,
		scale: 4,
	}).default(0),
	coloring_prod: decimal('coloring_prod', {
		precision: 20,
		scale: 4,
	}).default(0),
	trx_to_finishing: decimal('trx_to_finishing', {
		precision: 20,
		scale: 4,
	}).default(0),
	u_top_quantity: decimal('u_top_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	h_bottom_quantity: decimal('h_bottom_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	box_pin_quantity: decimal('box_pin_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	two_way_pin_quantity: decimal('two_way_pin_quantity', {
		precision: 20,
		scale: 4,
	}).default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defStock = {
	type: 'object',
	required: [
		'uuid',
		'order_info_uuid',
		'item',
		'zipper_number',
		'end_type',
		'puller',
		'color',
		'order_quantity',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		order_info_uuid: {
			type: 'string',
		},
		item: {
			type: 'string',
		},
		zipper_number: {
			type: 'string',
		},
		end_type: {
			type: 'string',
		},
		puller: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
		order_quantity: {
			type: 'number',
		},
		body_quantity: {
			type: 'number',
		},
		cap_quantity: {
			type: 'number',
		},
		puller_quantity: {
			type: 'number',
		},
		link_quantity: {
			type: 'number',
		},
		sa_prod: {
			type: 'number',
		},
		coloring_stock: {
			type: 'number',
		},
		coloring_prod: {
			type: 'number',
		},
		trx_to_finishing: {
			type: 'number',
		},
		u_top_quantity: {
			type: 'number',
		},
		h_bottom_quantity: {
			type: 'number',
		},
		box_pin_quantity: {
			type: 'number',
		},
		two_way_pin_quantity: {
			type: 'number',
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
		},
	},
	xml: {
		name: 'Slider/Stock',
	},
};

export const die_casting = slider.table('die_casting', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	item: defaultUUID('item').notNull(),
	zipper_number: defaultUUID('zipper_number').notNull(),
	type: defaultUUID('type').notNull(),
	puller: defaultUUID('puller').notNull(),
	logo_type: defaultUUID('logo_type').notNull(),
	body_shape: defaultUUID('body_shape'),
	puller_link: defaultUUID('puller_link').notNull(),
	stopper: defaultUUID('stopper').notNull(),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	weight: decimal('weight', {
		precision: 20,
		scale: 4,
	}).notNull(),
	pcs_per_kg: decimal('pcs_per_kg', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defDieCasting = {
	type: 'object',
	required: [
		'uuid',
		'name',
		'item',
		'zipper_number',
		'type',
		'puller',
		'logo_type',
		'puller_link',
		'stopper',
		'quantity',
		'weight',
		'pcs_per_kg',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		item: {
			type: 'number',
		},
		zipper_number: {
			type: 'number',
		},
		type: {
			type: 'number',
		},
		puller: {
			type: 'number',
		},
		logo_type: {
			type: 'number',
		},
		body_shape: {
			type: 'number',
		},
		puller_link: {
			type: 'number',
		},
		stopper: {
			type: 'number',
		},
		quantity: {
			type: 'number',
		},
		weight: {
			type: 'number',
		},
		pcs_per_kg: {
			type: 'number',
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
		},
	},
	xml: {
		name: 'Slider/DieCasting',
	},
};

export const die_casting_production = slider.table('die_casting_production', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').notNull(),
	mc_no: integer('mc_no').notNull(),
	cavity_goods: integer('cavity_goods').notNull(),
	cavity_defect: integer('cavity_defect').notNull(),
	push: integer('push').notNull(),
	weight: decimal('weight', {
		precision: 20,
		scale: 4,
	}).notNull(),
	order_info_uuid: defaultUUID('order_info_uuid'),
	created_by: defaultUUID('created_by').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defDieCastingProduction = {
	type: 'object',
	required: [
		'uuid',
		'die_casting_uuid',
		'mc_no',
		'cavity_goods',
		'cavity_defect',
		'push',
		'weight',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		die_casting_uuid: {
			type: 'string',
		},
		mc_no: {
			type: 'number',
		},
		cavity_goods: {
			type: 'number',
		},
		cavity_defect: {
			type: 'number',
		},
		push: {
			type: 'number',
		},
		weight: {
			type: 'number',
		},
		order_info_uuid: {
			type: 'string',
		},
		created_by: {
			type: 'string',
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
		},
	},
	xml: {
		name: 'Slider/DieCastingProduction',
	},
};

export const die_casting_transaction = slider.table('die_casting_transaction', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').notNull(),
	stock_uuid: defaultUUID('stock_uuid').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defDieCastingTransaction = {
	type: 'object',
	required: [
		'uuid',
		'die_casting_uuid',
		'stock_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		die_casting_uuid: {
			type: 'string',
		},
		stock_uuid: {
			type: 'string',
		},
		trx_quantity: {
			type: 'number',
		},
		created_by: {
			type: 'string',
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
		},
	},
	xml: {
		name: 'Slider/DieCastingTransaction',
	},
};

// transaction

export const transaction = slider.table('transaction', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').notNull(),
	section: text('section').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defTransaction = {
	type: 'object',
	required: [
		'uuid',
		'stock_uuid',
		'section',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		stock_uuid: {
			type: 'string',
		},
		section: {
			type: 'string',
		},
		trx_quantity: {
			type: 'number',
		},
		created_by: {
			type: 'string',
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
		},
	},
	xml: {
		name: 'Slider/Transaction',
	},
};

// coloring transaction

export const coloring_transaction = slider.table('coloring_transaction', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').notNull(),
	order_info_uuid: defaultUUID('order_info_uuid').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defColoringTransaction = {
	type: 'object',
	required: [
		'uuid',
		'stock_uuid',
		'order_info_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
		},
		stock_uuid: {
			type: 'string',
		},
		order_info_uuid: {
			type: 'string',
		},
		trx_quantity: {
			type: 'number',
		},
		created_by: {
			type: 'string',
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
		},
	},
	xml: {
		name: 'Slider/ColoringTransaction',
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
		name: 'slider.stock',
		description: 'Stock',
	},
	{
		name: 'slider.die_casting',
		description: 'Die Casting',
	},
	{
		name: 'slider.die_casting_production',
		description: 'Die Casting Production',
	},
	{
		name: 'slider.die_casting_transaction',
		description: 'Die Casting Transaction',
	},
	{
		name: 'slider.transaction',
		description: 'Transaction',
	},
	{
		name: 'slider.coloring_transaction',
		description: 'Coloring Transaction',
	},
];

export default slider;
