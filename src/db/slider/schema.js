import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const slider = pgSchema('slider');

// * ./swagger.js#defStock
export const stock = slider.table('stock', {
	uuid: uuid_primary,
	order_description_uuid: defaultUUID('order_description_uuid')
		.references(() => zipperSchema.order_description.uuid)
		.default(null),
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
	finishing_stock: decimal('finishing_stock', {
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
	quantity_in_sa: decimal('quantity_in_sa', {
		precision: 20,
		scale: 4,
	}).default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const die_casting = slider.table('die_casting', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	item: defaultUUID('item')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	zipper_number: defaultUUID('zipper_number')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	end_type: defaultUUID('end_type')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	puller_type: defaultUUID('puller_type')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	logo_type: defaultUUID('logo_type')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	slider_body_shape: defaultUUID('slider_body_shape')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	slider_link: defaultUUID('slider_link')
		.default(null)
		.references(() => publicSchema.properties.uuid),
	is_logo_body: integer('is_logo_body').default(0),
	is_logo_puller: integer('is_logo_puller').default(0),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	weight: decimal('weight', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	pcs_per_kg: decimal('pcs_per_kg', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	type: text('type').default(null),
	quantity_in_sa: decimal('quantity_in_sa', {
		precision: 20,
		scale: 4,
	}).default(0),
});

export const assembly_stock = slider.table('assembly_stock', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	die_casting_body_uuid: defaultUUID('die_casting_body_uuid'),
	die_casting_puller_uuid: defaultUUID('die_casting_puller_uuid'),
	die_casting_cap_uuid: defaultUUID('die_casting_cap_uuid'),
	die_casting_link_uuid: defaultUUID('die_casting_link_uuid'),
	quantity: PG_DECIMAL('quantity').default(0),
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const die_casting_to_assembly_stock = slider.table(
	'die_casting_to_assembly_stock',
	{
		uuid: uuid_primary,
		assembly_stock_uuid: defaultUUID('assembly_stock_uuid').references(
			() => assembly_stock.uuid
		),
		production_quantity: PG_DECIMAL('production_quantity').default(0),
		weight: PG_DECIMAL('weight').default(0),
		wastage: PG_DECIMAL('wastage').default(0),
		with_link: integer('with_link').default(1),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		remarks: text('remarks').default(null),
	}
);

export const die_casting_production = slider.table('die_casting_production', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').references(
		() => die_casting.uuid
	),
	mc_no: integer('mc_no').notNull(),
	cavity_goods: integer('cavity_goods').notNull(),
	cavity_defect: integer('cavity_defect').notNull(),
	push: integer('push').notNull(),
	weight: PG_DECIMAL('weight').notNull(),
	order_description_uuid: defaultUUID('order_description_uuid')
		.default(null)
		.references(() => zipperSchema.order_description.uuid),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const die_casting_transaction = slider.table('die_casting_transaction', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').references(
		() => die_casting.uuid
	),
	stock_uuid: defaultUUID('stock_uuid')
		.references(() => stock.uuid)
		.default(null),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const transaction = slider.table('transaction', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').references(() => stock.uuid),
	assembly_stock_uuid: defaultUUID('assembly_stock_uuid')
		.references(() => assembly_stock.uuid)
		.default(null),
	from_section: text('from_section').notNull(),
	to_section: text('to_section').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

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
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const trx_against_stock = slider.table('trx_against_stock', {
	uuid: uuid_primary,
	die_casting_uuid: defaultUUID('die_casting_uuid').references(
		() => die_casting.uuid
	),
	quantity: PG_DECIMAL('quantity').notNull(),
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const production = slider.table('production', {
	uuid: uuid_primary,
	stock_uuid: defaultUUID('stock_uuid').references(() => stock.uuid),
	production_quantity: PG_DECIMAL('production_quantity').notNull(),
	weight: PG_DECIMAL('weight').default(0),
	wastage: PG_DECIMAL('wastage').notNull(),
	section: text('section'),
	with_link: integer('with_link').default(1),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default slider;
