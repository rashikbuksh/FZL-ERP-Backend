import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const slider = pgSchema('slider');

// * ./swagger.js#defStock
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

export default slider;
