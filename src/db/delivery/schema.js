import { sql } from 'drizzle-orm';
import { boolean, decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as threadSchema from '../thread/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const delivery = pgSchema('delivery');

export const packing_list_sequence = delivery.sequence(
	'packing_list_sequence',
	{
		startWith: 1,
		increment: 1,
	}
);

export const item_for_enum = delivery.enum('item_for_enum', [
	'zipper',
	'thread',
]);

export const packing_list = delivery.table('packing_list', {
	id: integer('id').default(sql`nextval('delivery.packing_list_sequence')`),
	uuid: uuid_primary,
	carton_weight: text('carton_weight').notNull(),
	order_info_uuid: defaultUUID('order_info_uuid')
		.references(() => zipperSchema.order_info.uuid)
		.default(null),
	challan_uuid: defaultUUID('challan_uuid')
		.references(() => challan.uuid)
		.default(null),
	carton_uuid: defaultUUID('carton_uuid').references(() => carton.uuid),
	is_warehouse_received: boolean('is_warehouse_received').default(false),
	gate_pass: integer('gate_pass').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	item_for: item_for_enum('item_for').notNull().default('zipper'),
	thread_order_info_uuid: defaultUUID('thread_order_info_uuid')
		.references(() => threadSchema.order_info.uuid)
		.default(null),
});

export const packing_list_entry = delivery.table('packing_list_entry', {
	uuid: uuid_primary,
	packing_list_uuid: defaultUUID('packing_list_uuid').references(
		() => packing_list.uuid
	),
	sfg_uuid: defaultUUID('sfg_uuid')
		.references(() => zipperSchema.sfg.uuid)
		.default(null),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	poli_quantity: integer('poli_quantity').default(0),
	short_quantity: integer('short_quantity').default(0),
	reject_quantity: integer('reject_quantity').default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	thread_order_entry_uuid: defaultUUID('thread_order_entry_uuid')
		.references(() => threadSchema.order_entry.uuid)
		.default(null),
});

export const challan_sequence = delivery.sequence('challan_sequence', {
	startWith: 1,
	increment: 1,
});

export const challan = delivery.table('challan', {
	uuid: uuid_primary,
	id: integer('id').default(sql`nextval('delivery.challan_sequence')`),
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => zipperSchema.order_info.uuid
	),
	vehicle_uuid: defaultUUID('vehicle_uuid')
		.references(() => vehicle.uuid)
		.default(null),
	carton_quantity: integer('carton_quantity').default(0),
	assign_to: defaultUUID('assign_to').references(() => hrSchema.users.uuid),
	receive_status: integer('receive_status').default(0),
	name: text('name').default(null),
	delivery_cost: PG_DECIMAL('delivery_cost').default(0),
	is_hand_delivery: boolean('is_hand_delivery').default(false),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const vehicle = delivery.table('vehicle', {
	uuid: uuid_primary,
	type: text('type').notNull(),
	name: text('name').notNull(),
	number: text('number').notNull(),
	driver_name: text('driver_name').notNull(),
	active: integer('active').default(1),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const carton = delivery.table('carton', {
	uuid: uuid_primary,
	size: text('size').notNull(),
	name: text('name').notNull(),
	used_for: text('used_for').notNull(),
	active: integer('active').default(1),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default delivery;
