import { sql } from 'drizzle-orm';
import { boolean, decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import * as threadSchema from '../thread/schema.js';
import * as zipperSchema from '../zipper/schema.js';

const commercial = pgSchema('commercial');

export const bank = commercial.table('bank', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	swift_code: text('swift_code').notNull(),
	address: text('address').default(null),
	policy: text('policy').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	routing_no: text('routing_no').default(null),
	remarks: text('remarks').default(null),
});

export const lc_sequence = commercial.sequence('lc_sequence', {
	startWith: 1,
	increment: 1,
});

export const lc = commercial.table('lc', {
	uuid: uuid_primary,
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	id: integer('id')
		.default(sql`nextval('commercial.lc_sequence')`)
		.notNull(),
	lc_number: text('lc_number').notNull(),
	lc_date: DateTime('lc_date').notNull(),
	payment_date: DateTime('payment_date').default(null),
	ldbc_fdbc: text('ldbc_fdbc').default(null),
	acceptance_date: DateTime('acceptance_date').default(null),
	maturity_date: DateTime('maturity_date').default(null),
	commercial_executive: text('commercial_executive').notNull(),
	party_bank: text('party_bank').notNull(),
	production_complete: integer('production_complete').default(0),
	lc_cancel: integer('lc_cancel').default(0),
	handover_date: DateTime('handover_date').default(null),
	document_receive_date: DateTime('document_receive_date').default(null),
	shipment_date: DateTime('shipment_date').default(null),
	expiry_date: DateTime('expiry_date').default(null),
	ud_no: text('ud_no').default(null),
	ud_received: text('ud_received').default(null),
	at_sight: text('at_sight').default(null),
	amd_date: DateTime('amd_date').default(null),
	amd_count: integer('amd_count').default(0),
	problematical: integer('problematical').default(0),
	epz: integer('epz').default(0),
	is_rtgs: integer('is_rtgs').default(0),
	is_old_pi: integer('is_old_pi').default(0),
	pi_number: text('pi_number').default(null),
	lc_value: PG_DECIMAL('lc_value').default(0),
	payment_value: PG_DECIMAL('payment_value').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const manual_pi_sequence = commercial.sequence('manual_pi_sequence', {
	startWith: 1,
	increment: 1,
});

export const manual_pi = commercial.table('manual_pi', {
	uuid: uuid_primary,
	id: integer('id').default(sql`nextval('commercial.manual_pi_sequence')`),
	pi_uuids: text('pi_uuids')
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	buyer_uuid: defaultUUID('buyer_uuid').references(
		() => publicSchema.buyer.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid').references(
		() => publicSchema.merchandiser.uuid
	),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	bank_uuid: defaultUUID('bank_uuid').references(() => bank.uuid),
	validity: integer('validity').default(0),
	payment: integer('payment').default(0),
	remarks: text('remarks').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	receive_amount: PG_DECIMAL('receive_amount').default(0),
	weight: PG_DECIMAL('weight').default(0),
	date: DateTime('date').default(null),
	pi_number: text('pi_number').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
});

export const manual_pi_entry = commercial.table('manual_pi_entry', {
	uuid: uuid_primary,
	manual_pi_uuid: defaultUUID('manual_pi_uuid').references(
		() => manual_pi.uuid
	),
	order_number: text('order_number').notNull(),
	po: text('po').default(null),
	style: text('style').default(null),
	item: text('item').default(null),
	specification: text('specification').default(null),
	size: text('size').default(null),
	quantity: PG_DECIMAL('quantity').default(0),
	unit_price: PG_DECIMAL('unit_price').default(0),
	is_zipper: boolean('is_zipper').default(false),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const order_info_sequence = commercial.sequence('pi_sequence', {
	startWith: 1,
	increment: 1,
});

export const pi_cash = commercial.table('pi_cash', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('commercial.pi_sequence')`)
		.notNull(),
	lc_uuid: defaultUUID('lc_uuid')
		.default(null)
		.references(() => lc.uuid),
	order_info_uuids: text('order_info_uuids').notNull(),
	thread_order_info_uuids: text('thread_order_info_uuids').default(null),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid').references(
		() => publicSchema.merchandiser.uuid
	),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	bank_uuid: defaultUUID('bank_uuid')
		.default(null)
		.references(() => bank.uuid),
	validity: integer('validity').default(0),
	payment: integer('payment').default(0),
	is_pi: integer('is_pi').default(0),
	conversion_rate: decimal('conversion_rate', {
		precision: 20,
		scale: 4,
	}).default(0),
	receive_amount: decimal('receive_amount', {
		precision: 20,
		scale: 4,
	}).default(0),
	weight: PG_DECIMAL('weight').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const pi_cash_entry = commercial.table('pi_cash_entry', {
	uuid: uuid_primary,
	pi_cash_uuid: defaultUUID('pi_cash_uuid').references(() => pi_cash.uuid),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => zipperSchema.sfg.uuid),
	pi_cash_quantity: decimal('pi_cash_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	thread_order_entry_uuid: defaultUUID('thread_order_entry_uuid').references(
		() => threadSchema.order_entry.uuid
	),
});

export default commercial;
