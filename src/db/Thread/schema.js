import { eq, sql } from 'drizzle-orm';
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
import * as labDipSchema from '../lab_dip/schema.js';
import * as publicSchema from '../public/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

export const thread = pgSchema('thread');

export const machine = thread.table('machine', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	capacity: PG_DECIMAL('capacity').notNull(),
	water_capacity: PG_DECIMAL('water_capacity').default(0),
	leveling_agent_uuid: defaultUUID('Leveling Agent uuid').default(null),
	leveling_agent_quantity: PG_DECIMAL('Leveling Agent Quantity').default(0),
	buffering_agent_uuid: defaultUUID('Buffering Agent uuid').default(null),
	buffering_agent_quantity: PG_DECIMAL('Buffering Agent Quantity').default(0),
	sequestering_agent_uuid: defaultUUID('Sequestering Agent uuid').default(
		null
	),
	sequestering_agent_quantity: PG_DECIMAL(
		'Sequestering Agent Quantity'
	).default(0),
	caustic_soad_uuid: defaultUUID('Caustic Soad uuid').default(null),
	caustic_soad_quantity: PG_DECIMAL('Caustic Soad Quantity').default(0),
	hydros_uuid: defaultUUID('Hydros uuid').default(null),
	hydros_quantity: PG_DECIMAL('Hydros Quantity').default(0),
	neotrolizer_uuid: defaultUUID('Neotrolizer uuid').default(null),
	neotrolizer_quantity: PG_DECIMAL('Neotrolizer Quantity').default(0),
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
			pk: primaryKey({
				columns: [table.uuid],
			}),
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
	id: integer('id')
		.default(sql`nextval('thread.thread_order_info_sequence')`)
		.notNull(),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid').references(
		() => publicSchema.merchandiser.uuid
	),
	buyer_uuid: defaultUUID('buyer_uuid').references(
		() => publicSchema.buyer.uuid
	),
	is_sample: integer('is_sample').default(0),
	is_bill: integer('is_bill').default(0),
	delivery_date: DateTime('delivery_date').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const order_entry = thread.table('order_entry', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => order_info.uuid
	),
	lab_reference: text('lab_reference').default(null),
	color: text('color').notNull(),
	shade_recipe_uuid: defaultUUID('shade_recipe_uuid').references(
		() => labDipSchema.shade_recipe.uuid
	),
	po: text('po'),
	style: text('style'),
	count_length_uuid: defaultUUID('count_length_uuid').references(
		() => count_length.uuid
	),
	quantity: PG_DECIMAL('quantity').notNull(),
	company_price: PG_DECIMAL('company_price').default(0),
	party_price: PG_DECIMAL('party_price').default(0),
	swatch_approval_date: DateTime('swatch_approval_date').default(null),
	production_quantity: PG_DECIMAL('production_quantity').default(0),
	created_by: defaultUUID('created_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const thread_batch_sequence = thread.sequence('thread_batch_sequence', {
	startWith: 1,
	increment: 1,
});

export const batch = thread.table('batch', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('thread.thread_batch_sequence')`)
		.notNull(),
	machine_uuid: defaultUUID('machine_uuid').references(() => machine.uuid),
	lab_created_by: defaultUUID('lab_created_by').references(
		() => hrSchema.users.uuid
	),
	lab_created_at: DateTime('lab_created_at').default(null),
	lab_updated_at: DateTime('lab_updated_at').default(null),
	dyeing_operator: text('dyeing_operator').default(null),
	reason: text('reason').default(null),
	category: text('category').default(null),
	status: text('status').default(null),
	pass_by: text('pass_by').default(null),
	shift: text('shift').default(null),
	yarn_quantity: PG_DECIMAL('yarn_quantity').default(0),
	yarn_issue_created_by: defaultUUID('yarn_issue_created_by').references(
		() => hrSchema.users.uuid
	),
	yarn_issue_created_at: DateTime('yarn_issue_created_at').default(null),
	yarn_issue_updated_at: DateTime('yarn_issue_updated_at').default(null),
	dyeing_supervisor: text('dyeing_supervisor').default(null),
	is_drying_complete: text('is_drying_complete').default(null),
	drying_created_at: DateTime('drying_created_at').default(null),
	drying_updated_at: DateTime('drying_updated_at').default(null),
	coning_operator: text('coning_operator').default(null),
	coning_supervisor: text('coning_supervisor').default(null),
	coning_machines: text('coning_machines').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const batch_entry = thread.table('batch_entry', {
	uuid: uuid_primary,
	batch_uuid: defaultUUID('batch_uuid').references(() => batch.uuid),
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => order_entry.uuid
	),
	quantity: PG_DECIMAL('quantity').default(0),

	coning_production_quantity: PG_DECIMAL(
		'coning_production_quantity'
	).default(0),
	coning_production_quantity_in_kg: PG_DECIMAL(
		'coning_production_quantity_in_kg'
	).default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});
