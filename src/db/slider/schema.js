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
	item: defaultUUID('item').default(null),
	//.references(() => publicSchema.properties.item),
	zipper_number: defaultUUID('zipper_number').default(null),
	// .references(() => publicSchema.properties.zipper_number),
	end_type: defaultUUID('end_type').default(null),
	// .references(() => publicSchema.properties.end_type),
	lock_type: defaultUUID('lock_type').default(null),
	// .references(() => publicSchema.properties.lock_type),
	puller_type: defaultUUID('puller_type').default(null),
	// .references(() => publicSchema.properties.puller_type),
	puller_color: text('puller_color').default(null),
	// .references(() => publicSchema.properties.puller_color),
	puller_link: defaultUUID('puller_link').default(null),
	// .references(() => publicSchema.properties.puller_link),
	slider: defaultUUID('slider').default(null),
	// .references(() => publicSchema.properties.slider),
	slider_body_shape: defaultUUID('slider_body_shape').default(null),
	// .references(() => publicSchema.properties.slider_body_shape),
	slider_link: defaultUUID('slider_link').default(null),
	// .references(() => publicSchema.properties.slider_link),
	coloring_type: defaultUUID('coloring_type').default(null),
	// .references(() => publicSchema.properties.coloring_type),
	logo_type: defaultUUID('logo_type').default(null),
	// .references(() => publicSchema.properties.logo_type),
	is_logo_body: integer('is_logo_body').default(0),
	is_logo_puller: integer('is_logo_puller').default(0),
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
	item: defaultUUID('item').default(null),
	// .references(
	// 	() => zipperSchema.order_description.item
	// ),
	zipper_number: defaultUUID('zipper_number').default(null),
	// .references(
	// 	() => zipperSchema.order_description.zipper_number
	// ),
	end_type: defaultUUID('end_type').default(null),
	// .references(
	// 	() => zipperSchema.order_description.end_type
	// ),
	puller_type: defaultUUID('puller_type').default(null),
	// .references(
	// 	() => zipperSchema.order_description.puller_type
	// ),
	logo_type: defaultUUID('logo_type').default(null),
	// .references(
	// 	() => zipperSchema.order_description.logo_type
	// ),
	slider_body_shape: defaultUUID('slider_body_shape').default(null),
	// .references(
	// 	() => zipperSchema.order_description.slider_body_shape
	// ),
	puller_link: defaultUUID('puller_link').default(null),
	// .references(
	// 	() => zipperSchema.order_description.puller_link
	// ),
	stopper_type: defaultUUID('stopper_type').default(null),
	// .references(
	// 	() => zipperSchema.order_description.stopper_type
	// ),
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
	is_body: integer('is_body').default(0),
	is_puller: integer('is_puller').default(0),
	is_cap: integer('is_cap').default(0),
	is_link: integer('is_link').default(0),
	is_h_bottom: integer('is_h_bottom').default(0),
	is_u_top: integer('is_u_top').default(0),
	is_box_pin: integer('is_box_pin').default(0),
	is_two_way_pin: integer('is_two_way_pin').default(0),
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
	order_info_uuid: defaultUUID('order_info_uuid').default(null), //.references(() => zipperSchema.order_info.uuid)
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
