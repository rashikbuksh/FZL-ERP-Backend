import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import { type } from '../material/schema.js';
import * as publicSchema from '../public/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const slider = pgSchema('slider');

export const stock = slider.table('stock', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').default(null),
	//.references(() => zipperSchema.order_info.uuid),
	item: defaultUUID('item'),
	//.references(() => zipperSchema.order_description.item),
	zipper_number: defaultUUID('zipper_number'),
	// .references(() => zipperSchema.order_description.zipper_number),
	end_type: defaultUUID('end_type'),
	// .references(() => zipperSchema.order_description.end_type),
	puller_type: defaultUUID('puller_type').default(null),
	// .references(() => zipperSchema.order_description.puller_type),
	puller_color: text('puller_color').notNull(),
	// .references(() => zipperSchema.order_description.puller_color),
	// logo_type: defaultUUID('logo_type').default(null),
	// // .references(() => zipperSchema.order_description.logo_type),
	// is_logo_body: integer('is_logo_body').default(0),
	// is_logo_puller: integer('is_logo_puller').default(0),
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
		'puller_type',
		'color',
		'order_quantity',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		item: {
			type: 'string',
			xample: 'igD0v9DIJQhJeet',
		},
		zipper_number: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		end_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		color: {
			type: 'string',
			example: 'red',
		},
		order_quantity: {
			type: 'number',
			example: 0.0,
		},
		body_quantity: {
			type: 'number',
			example: 0.0,
		},
		cap_quantity: {
			type: 'number',
			example: 0.0,
		},
		puller_quantity: {
			type: 'number',
			example: 0.0,
		},
		link_quantity: {
			type: 'number',
			example: 0.0,
		},
		sa_prod: {
			type: 'number',
			example: 0.0,
		},
		coloring_stock: {
			type: 'number',
			example: 0.0,
		},
		coloring_prod: {
			type: 'number',
			example: 0.0,
		},
		trx_to_finishing: {
			type: 'number',
			example: 0.0,
		},
		u_top_quantity: {
			type: 'number',
			example: 0.0,
		},
		h_bottom_quantity: {
			type: 'number',
			example: 0.0,
		},
		box_pin_quantity: {
			type: 'number',
			example: 0.0,
		},
		two_way_pin_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/Stock',
	},
};

export const die_casting = slider.table('die_casting', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	item: defaultUUID('item'),
	// .references(
	// 	() => zipperSchema.order_description.item
	// ),
	zipper_number: defaultUUID('zipper_number'),
	// .references(
	// 	() => zipperSchema.order_description.zipper_number
	// ),
	end_type: defaultUUID('end_type'),
	// .references(
	// 	() => zipperSchema.order_description.end_type
	// ),
	puller_type: defaultUUID('puller_type'),
	// .references(
	// 	() => zipperSchema.order_description.puller_type
	// ),
	logo_type: defaultUUID('logo_type'),
	// .references(
	// 	() => zipperSchema.order_description.logo_type
	// ),
	slider_body_shape: defaultUUID('slider_body_shape'),
	// .references(
	// 	() => zipperSchema.order_description.slider_body_shape
	// ),
	puller_link: defaultUUID('puller_link'),
	// .references(
	// 	() => zipperSchema.order_description.puller_link
	// ),
	stopper_type: defaultUUID('stopper_type'),
	// .references(
	// 	() => zipperSchema.order_description.stopper_type
	// ),
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
		'end_type',
		'puller_type',
		'logo_type',
		'puller_link',
		'stopper_type',
		'quantity',
		'weight',
		'pcs_per_kg',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'die_casting 1',
		},
		item: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		zipper_number: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		end_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		logo_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		body_shape: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		puller_link: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stopper_type: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		quantity: {
			type: 'number',
			example: 0.0,
		},
		weight: {
			type: 'number',
			example: 0.0,
		},
		pcs_per_kg: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCasting',
	},
};

export const die_casting_production = slider.table('die_casting_production', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').references(
		() => die_casting.uuid
	),
	mc_no: integer('mc_no').notNull(),
	cavity_goods: integer('cavity_goods').notNull(),
	cavity_defect: integer('cavity_defect').notNull(),
	push: integer('push').notNull(),
	weight: decimal('weight', {
		precision: 20,
		scale: 4,
	}).notNull(),
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => zipperSchema.order_info.uuid
	),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
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
			example: 'igD0v9DIJQhJeet',
		},
		die_casting_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		mc_no: {
			type: 'number',
			example: 0,
		},
		cavity_goods: {
			type: 'number',
			example: 0,
		},
		cavity_defect: {
			type: 'number',
			example: 0,
		},
		push: {
			type: 'number',
			example: 0,
		},
		weight: {
			type: 'number',
			example: 0.0,
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCastingProduction',
	},
};

export const die_casting_transaction = slider.table('die_casting_transaction', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').references(
		() => die_casting.uuid
	),
	stock_uuid: defaultUUID('stock_uuid').references(() => stock.uuid),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
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
			example: 'igD0v9DIJQhJeet',
		},
		die_casting_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/DieCastingTransaction',
	},
};

// transaction

export const transaction = slider.table('transaction', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').references(() => stock.uuid),
	section: text('section').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
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
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'section',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
		},
	},
	xml: {
		name: 'Slider/Transaction',
	},
};

// coloring transaction

export const coloring_transaction = slider.table('coloring_transaction', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').references(() => stock.uuid),
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => zipperSchema.order_info.uuid
	),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
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
			example: 'igD0v9DIJQhJeet',
		},
		stock_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_quantity: {
			type: 'number',
			example: 0.0,
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
			example: 'remarks',
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
