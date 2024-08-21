import {
	decimal,
	integer,
	numeric,
	pgSchema,
	primaryKey,
	serial,
	text,
	uuid,
} from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

const thread = pgSchema('thread');

export const machine = thread.table('machine', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	capacity: PG_DECIMAL('capacity').notNull(),
	created_by: defaultUUID('created_by')
		.notNull()
		.references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const count_length = thread.table(
	'count_length',
	{
		uuid: defaultUUID('uuid'),
		count: numeric('count').notNull(),
		length: numeric('length').notNull(),
		weight: PG_DECIMAL('weight').notNull(),
		sst: text('sst').notNull(),
		created_by: defaultUUID('created_by')
			.notNull()
			.references(() => hrSchema.users.uuid),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		remarks: text('remarks').default(null),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.count, table.length] }),
		};
	}
);

export const thread_order_info_sequence = thread.sequence(
	'thread_order_info_sequence',
	{
		startWith: 1,
		increment: 1,
	}
);

export const order_info = thread.table('order_info', {
	uuid: uuid_primary,
	id: integer('id').notNull(),
	party_uuid: uuid('party_uuid').references(() => publicSchema.party.uuid),
	marketing_uuid: uuid('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	factory_uuid: uuid('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	merchandiser_uuid: uuid('merchandiser_uuid').references(
		() => publicSchema.merchandiser.uuid
	),
	buyer_uuid: uuid('buyer_uuid').references(() => publicSchema.buyer.uuid),
	is_sample: text('is_sample').notNull(),
	is_bill: text('is_bill').notNull(),
	delivery_date: DateTime('delivery_date').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const order_entry = thread.table('order_entry', {
	uuid: uuid_primary,
	order_info_uuid: uuid('order_info_uuid').references(() => order_info.uuid),
	lab_reference: text('lab_reference').notNull(),
	color: text('color').notNull(),
	shade_recipe_uuid: uuid('shade_recipe_uuid').notNull(),
	po: text('po').notNull(),
	style: text('style').notNull(),
	count_length_uuid: uuid('count_length_uuid').notNull(),
	quantity: numeric('quantity').notNull(),
	company_price: PG_DECIMAL('company_price').notNull(),
	party_price: PG_DECIMAL('party_price').notNull(),
	swatch_approval_date: DateTime('swatch_approval_date').notNull(),
	production_quantity: numeric('production_quantity').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});


export const batch = thread.table('batch', {
	uuid: uuid_primary,
	id: integer('id').notNull(),
	dyeing_operator : text('dyeing_operator').notNull(),
	reason: text('reason').notNull(),
	category: text('category').notNull(),
	status: text('status').notNull(),
	pass_by: text('pass_by').notNull(),
	shift : text('shift').notNull(),
	dyeing_supervisor : text('dyeing_supervisor').notNull(),
	is_dyeing_complete : text('is_dyeing_complete').notNull(),
	coning_operator : text('coning_operator').notNull(),
	coning_supervisor : text('coning_supervisor').notNull(),
	coning_machines : text('coning_machines').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const batch_entry = thread.table('batch_entry', {
	uuid: uuid_primary,
	batch_uuid: uuid('batch_uuid').references(() => batch.uuid),
	order_entry_uuid: uuid('order_entry_uuid').references(() => order_entry.uuid),
	quantity: numeric('quantity').notNull(),
	yarn_quantity: numeric('yarn_quantity').notNull(),
	coning_production_quantity: numeric('coning_production_quantity').notNull(),
	coning_production_quantity_in_kg: numeric('coning_production_quantity_in_kg').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});
