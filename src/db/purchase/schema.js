import { decimal, integer, pgSchema, text } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import { sql } from 'drizzle-orm';
import * as hrSchema from '../hr/schema.js';
import * as materialSchema from '../material/schema.js';
import { PG_DECIMAL } from '../variables.js';

const purchase = pgSchema('purchase');

export const store_type_enum = purchase.enum('store_type_enum', [
	'rm',
	'accessories',
	'maintenance',
]);

export const vendor = purchase.table('vendor', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	contact_name: text('contact_name').notNull(),
	email: text('email').notNull(),
	office_address: text('office_address').notNull(),
	contact_number: text('contact_number').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
	store_type: store_type_enum('store_type').default('rm'),
});

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
	challan_number: text('challan_number').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	store_type: store_type_enum('store_type').notNull().default('rm'),
	transport_cost: PG_DECIMAL('transport_cost').default(0),
	misc_cost: PG_DECIMAL('misc_cost').default(0),
	file: text('file').default(null),
});

export const entry = purchase.table('entry', {
	uuid: uuid_primary,
	purchase_description_uuid: defaultUUID(
		'purchase_description_uuid'
	).references(() => description.uuid),
	material_uuid: defaultUUID('material_uuid').references(
		() => materialSchema.info.uuid
	),
	quantity: PG_DECIMAL('quantity').notNull(),
	price: PG_DECIMAL('price').default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	provided_quantity: PG_DECIMAL('provided_quantity').default(0),
});

export default purchase;
