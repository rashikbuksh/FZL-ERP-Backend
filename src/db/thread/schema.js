import { sql } from 'drizzle-orm';
import {
	boolean,
	integer,
	numeric,
	pgSchema,
	primaryKey,
	text,
} from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as labDipSchema from '../lab_dip/schema.js';
import * as materialSchema from '../material/schema.js';
import * as publicSchema from '../public/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

export const thread = pgSchema('thread');

export const count_length = thread.table(
	'count_length',
	{
		uuid: defaultUUID('uuid'),
		count: text('count').notNull(),
		length: numeric('length').notNull(),
		sst: text('sst').notNull(),
		min_weight: PG_DECIMAL('min_weight').notNull(),
		max_weight: PG_DECIMAL('max_weight').notNull(),
		cone_per_carton: integer('cone_per_carton').notNull().default(0),
		price: PG_DECIMAL('price').notNull(),
		created_by: defaultUUID('created_by')
			.notNull()
			.references(() => hrSchema.users.uuid),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		updated_by: defaultUUID('updated_by')
			.references(() => hrSchema.users.uuid)
			.default(null),
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
	is_cash: integer('is_cash').default(0),
	delivery_date: DateTime('delivery_date').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	revision_no: integer('revision_no').default(0),
	is_cancelled: boolean('is_cancelled').default(false),
	sno_from_head_office: boolean('sno_from_head_office').default(false),
	sno_from_head_office_time: DateTime('sno_from_head_office_time').default(
		null
	),
	sno_from_head_office_by: defaultUUID('sno_from_head_office_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	receive_by_factory: boolean('receive_by_factory').default(false),
	receive_by_factory_time: DateTime('receive_by_factory_time').default(null),
	receive_by_factory_by: defaultUUID('receive_by_factory_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	production_pause: boolean('production_pause').default(false),
	production_pause_time: DateTime('production_pause_time').default(null),
	production_pause_by: defaultUUID('production_pause_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	is_swatch_attached: boolean('is_swatch_attached').default(false),
});

export const order_entry = thread.table('order_entry', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => order_info.uuid
	),
	lab_reference: text('lab_reference').default(null),
	color: text('color').notNull(),
	recipe_uuid: defaultUUID('recipe_uuid').references(
		() => labDipSchema.recipe.uuid
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
	carton_of_production_quantity: integer(
		'carton_of_production_quantity'
	).default(0),
	bleaching: text('bleaching').default(null),
	transfer_quantity: PG_DECIMAL('transfer_quantity').default(0),
	created_by: defaultUUID('created_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	pi: PG_DECIMAL('pi').default(0),
	delivered: PG_DECIMAL('delivered').default(0),
	warehouse: PG_DECIMAL('warehouse').default(0),
	short_quantity: PG_DECIMAL('short_quantity').default(0),
	reject_quantity: PG_DECIMAL('reject_quantity').default(0),
	production_quantity_in_kg: PG_DECIMAL('production_quantity_in_kg').default(
		0
	),
	carton_quantity: integer('carton_quantity').default(0),
	index: integer('index').notNull().default(1),
	damage_quantity: PG_DECIMAL('damage_quantity').default(0),
	fresh_quantity: PG_DECIMAL('fresh_quantity').default(0),
	repair_quantity: PG_DECIMAL('repair_quantity').default(0),
	color_ref: text('color_ref').default(null),
	color_ref_entry_date: DateTime('color_ref_entry_date').default(null),
	color_ref_update_date: DateTime('color_ref_update_date').default(null),
	swatch_approval_received: boolean('swatch_approval_received').default(
		false
	),
	swatch_approval_received_date: DateTime(
		'swatch_approval_received_date'
	).default(null),
	swatch_approval_received_by: defaultUUID('swatch_approval_received_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
});

export const thread_batch_sequence = thread.sequence('thread_batch_sequence', {
	startWith: 1,
	increment: 1,
});

export const batch_type_enum = thread.enum('batch_type', ['normal', 'extra']);

export const batch = thread.table('batch', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('thread.thread_batch_sequence')`)
		.notNull(),
	machine_uuid: defaultUUID('machine_uuid').references(
		() => publicSchema.machine.uuid
	),
	slot: integer('slot').default(0),
	lab_created_by: defaultUUID('lab_created_by').references(
		() => hrSchema.users.uuid
	),
	lab_created_at: DateTime('lab_created_at').default(null),
	lab_updated_at: DateTime('lab_updated_at').default(null),
	dyeing_operator: defaultUUID('dyeing_operator')
		.references(() => hrSchema.users.uuid)
		.default(null),
	reason: text('reason').default(null),
	category: text('category').default(null),
	status: text('status').default('pending'),
	pass_by: defaultUUID('pass_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	shift: text('shift').default(null),
	dyeing_supervisor: defaultUUID('dyeing_supervisor')
		.references(() => hrSchema.users.uuid)
		.default(null),
	dyeing_created_by: defaultUUID('dyeing_created_by').references(
		() => hrSchema.users.uuid
	),
	dyeing_created_at: DateTime('dyeing_created_at').default(null),
	dyeing_updated_at: DateTime('dyeing_updated_at').default(null),
	yarn_quantity: PG_DECIMAL('yarn_quantity').default(0),
	yarn_issue_created_by: defaultUUID('yarn_issue_created_by').references(
		() => hrSchema.users.uuid
	),
	yarn_issue_created_at: DateTime('yarn_issue_created_at').default(null),
	yarn_issue_updated_at: DateTime('yarn_issue_updated_at').default(null),
	is_drying_complete: text('is_drying_complete').default(null),
	drying_created_at: DateTime('drying_created_at').default(null),
	drying_updated_at: DateTime('drying_updated_at').default(null),
	coning_operator: text('coning_operator').default(null),
	coning_supervisor: text('coning_supervisor').default(null),
	coning_machines: text('coning_machines').default(null),
	coning_created_by: defaultUUID('coning_created_by').references(
		() => hrSchema.users.uuid
	),
	coning_created_at: DateTime('coning_created_at').default(null),
	coning_updated_at: DateTime('coning_updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	production_date: DateTime('production_date')
		.notNull()
		.default('2024-01-01 00:00:00'),
	batch_type: batch_type_enum('batch_type').default('normal'),
	order_info_uuid: defaultUUID('order_info_uuid')
		.references(() => order_info.uuid)
		.default(null),
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
	coning_carton_quantity: PG_DECIMAL('coning_carton_quantity').default(0),
	coning_created_at: DateTime('coning_created_at').default(null),
	coning_updated_at: DateTime('coning_updated_at').default(null),
	transfer_quantity: PG_DECIMAL('transfer_quantity').default(0),
	transfer_carton_quantity: integer('transfer_carton_quantity').default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	yarn_quantity: PG_DECIMAL('yarn_quantity').default(0),
	damaged_quantity: PG_DECIMAL('damaged_quantity').default(0),
});

export const dyes_category = thread.table('dyes_category', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	upto_percentage: PG_DECIMAL('upto_percentage').default(0),
	bleaching: text('bleaching').default(null),
	id: integer('id').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

export const programs = thread.table('programs', {
	uuid: uuid_primary,
	dyes_category_uuid: defaultUUID('dyes_category_uuid').references(
		() => dyes_category.uuid
	),
	material_uuid: defaultUUID('material_uuid').references(
		() => materialSchema.info.uuid
	),
	quantity: PG_DECIMAL('quantity').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

export const batch_entry_production_type = thread.enum(
	'batch_entry_production_type',
	['normal', 'damage']
);

export const batch_entry_production = thread.table('batch_entry_production', {
	uuid: uuid_primary,
	batch_entry_uuid: defaultUUID('batch_entry_uuid').references(
		() => batch_entry.uuid
	),
	production_quantity: PG_DECIMAL('production_quantity').notNull(),
	coning_carton_quantity: PG_DECIMAL('coning_carton_quantity').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
	type: batch_entry_production_type('type').default('normal'),
});

export const batch_entry_trx = thread.table('batch_entry_trx', {
	uuid: uuid_primary,
	batch_entry_uuid: defaultUUID('batch_entry_uuid').references(
		() => batch_entry.uuid
	),
	quantity: PG_DECIMAL('quantity').notNull(),
	carton_quantity: integer('carton_quantity').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	updated_by: defaultUUID('updated_by')
		.references(() => hrSchema.users.uuid)
		.default(null),
	remarks: text('remarks').default(null),
});

export const thread_challan_sequence = thread.sequence(
	'thread_challan_sequence',
	{
		startWith: 1,
		increment: 1,
	}
);
