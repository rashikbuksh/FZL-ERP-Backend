import { sql } from 'drizzle-orm';
import {
	boolean,
	decimal,
	integer,
	pgSchema,
	serial,
	text,
} from 'drizzle-orm/pg-core';
import * as hrSchema from '../hr/schema.js';
import * as labDipSchema from '../lab_dip/schema.js';
import * as materialSchema from '../material/schema.js';
import * as publicSchema from '../public/schema.js';
import * as sliderSchema from '../slider/schema.js';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

const zipper = pgSchema('zipper');

export const order_info_sequence = zipper.sequence('order_info_sequence', {
	startWith: 1,
	increment: 1,
});

export const swatchStatusEnum = zipper.enum('swatch_status_enum', [
	'pending',
	'approved',
	'rejected',
]);

export const sliderStartingSectionEnum = zipper.enum(
	'slider_starting_section_enum',
	['die_casting', 'slider_assembly', 'coloring', '---']
);

export const print_in_enum = zipper.enum('print_in_enum', [
	'portrait',
	'landscape',
	'break_down',
]);

export const order_info = zipper.table('order_info', {
	uuid: uuid_primary,
	id: integer('id')
		.default(sql`nextval('zipper.order_info_sequence')`)
		.notNull(),
	reference_order_info_uuid: defaultUUID('reference_order_info_uuid').default(
		null
	),
	buyer_uuid: defaultUUID('buyer_uuid').references(
		() => publicSchema.buyer.uuid
	),
	party_uuid: defaultUUID('party_uuid').references(
		() => publicSchema.party.uuid
	),
	marketing_uuid: defaultUUID('marketing_uuid').references(
		() => publicSchema.marketing.uuid
	),
	merchandiser_uuid: defaultUUID('merchandiser_uuid')
		.references(() => publicSchema.merchandiser.uuid)
		.default(null),
	factory_uuid: defaultUUID('factory_uuid').references(
		() => publicSchema.factory.uuid
	),
	is_sample: integer('is_sample').default(0),
	is_bill: integer('is_bill').default(0),
	is_cash: integer('is_cash').default(0),
	conversion_rate: PG_DECIMAL('conversion_rate').default(0.0),
	marketing_priority: text('marketing_priority').default(null),
	factory_priority: text('factory_priority').default(null),
	status: integer('status').notNull().default(0),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	print_in: print_in_enum('print_in').default('portrait'),
});

export const order_description = zipper.table('order_description', {
	uuid: uuid_primary,
	order_info_uuid: defaultUUID('order_info_uuid').references(
		() => order_info.uuid
	),
	tape_coil_uuid: defaultUUID('tape_coil_uuid')
		.references(() => tape_coil.uuid)
		.default(null),
	tape_received: PG_DECIMAL('tape_received').default(0),
	tape_transferred: PG_DECIMAL('tape_transferred').default(0),
	item: defaultUUID('item').references(() => publicSchema.properties.uuid),
	nylon_stopper: defaultUUID('nylon_stopper').references(
		() => publicSchema.properties.uuid
	),
	zipper_number: defaultUUID('zipper_number').references(
		() => publicSchema.properties.uuid
	),
	end_type: defaultUUID('end_type').references(
		() => publicSchema.properties.uuid
	),
	lock_type: defaultUUID('lock_type').references(
		() => publicSchema.properties.uuid
	),
	puller_type: defaultUUID('puller_type').references(
		() => publicSchema.properties.uuid
	),
	teeth_color: defaultUUID('teeth_color').references(
		() => publicSchema.properties.uuid
	),
	teeth_type: defaultUUID('teeth_type').references(
		() => publicSchema.properties.uuid
	),
	puller_color: defaultUUID('puller_color').references(
		() => publicSchema.properties.uuid
	),
	special_requirement: text('special_requirement').default(null),
	hand: defaultUUID('hand').references(() => publicSchema.properties.uuid),
	coloring_type: defaultUUID('coloring_type')
		.references(() => publicSchema.properties.uuid)
		.default(null),
	is_slider_provided: integer('is_slider_provided').default(0),
	slider: defaultUUID('slider')
		.references(() => publicSchema.properties.uuid)
		.default(null),
	slider_starting_section: sliderStartingSectionEnum(
		'slider_starting_section_enum'
	),
	top_stopper: defaultUUID('top_stopper').references(
		() => publicSchema.properties.uuid
	),
	bottom_stopper: defaultUUID('bottom_stopper').references(
		() => publicSchema.properties.uuid
	),
	logo_type: defaultUUID('logo_type').references(
		() => publicSchema.properties.uuid
	),
	is_logo_body: integer('is_logo_body').notNull().default(0),
	is_logo_puller: integer('is_logo_puller').notNull().default(0),
	description: text('description').default(null),
	status: integer('status').notNull().default(0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
	slider_body_shape: defaultUUID('slider_body_shape').references(
		() => publicSchema.properties.uuid
	),
	slider_link: defaultUUID('slider_link').references(
		() => publicSchema.properties.uuid
	),
	end_user: defaultUUID('end_user').references(
		() => publicSchema.properties.uuid
	),
	garment: text('garment').default(null),
	light_preference: defaultUUID('light_preference').references(
		() => publicSchema.properties.uuid
	),
	garments_wash: text('garments_wash').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	garments_remarks: text('garments_remarks').default(null),
	// nylon_plastic_finishing: PG_DECIMAL('nylon_plastic_finishing').default(0),
	// nylon_metallic_finishing: PG_DECIMAL('nylon_metallic_finishing').default(0),
	// vislon_teeth_molding: PG_DECIMAL('vislon_teeth_molding').default(0),
	// metal_teeth_molding: PG_DECIMAL('metal_teeth_molding').default(0),
	slider_finishing_stock: PG_DECIMAL('slider_finishing_stock').default(0),
});

export const order_entry = zipper.table('order_entry', {
	uuid: uuid_primary,
	order_description_uuid: defaultUUID('order_description_uuid').references(
		() => order_description.uuid
	),
	style: text('style').notNull(),
	color: text('color').notNull(),
	size: text('size').notNull(),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	company_price: PG_DECIMAL('company_price').default(0.0),
	party_price: PG_DECIMAL('party_price').default(0.0),
	status: integer('status').default(1),
	swatch_status: swatchStatusEnum('swatch_status_enum').default('pending'),
	swatch_approval_date: DateTime('swatch_approval_date').default(null),
	bleaching: text('bleaching').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const sfg = zipper.table('sfg', {
	uuid: uuid_primary,
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => order_entry.uuid
	),
	recipe_uuid: defaultUUID('recipe_uuid')
		.default(null)
		.references(() => labDipSchema.recipe.uuid),
	// dying_and_iron_stock: decimal("dying_and_iron_stock").default(0.0), // dying_and_iron has been moved to dying_batch table
	dying_and_iron_prod: decimal('dying_and_iron_prod', {
		precision: 20,
		scale: 4,
	}).default(0),
	teeth_molding_stock: decimal('teeth_molding_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_molding_prod: decimal('teeth_molding_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_coloring_stock: decimal('teeth_coloring_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	teeth_coloring_prod: decimal('teeth_coloring_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	finishing_stock: decimal('finishing_stock', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	finishing_prod: decimal('finishing_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	// die_casting_prod: decimal("die_casting_prod").default(0),
	// slider_assembly_stock: decimal("slider_assembly_stock").default(0),
	// slider_assembly_prod: decimal("slider_assembly_prod").default(0),
	// coloring_stock: decimal("coloring_stock").default(0.0), // slider section has been moved to slider schema
	coloring_prod: decimal('coloring_prod', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	warehouse: decimal('warehouse', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	delivered: decimal('delivered', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	pi: decimal('pi', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	short_quantity: integer('short_quantity').default(0),
	reject_quantity: integer('reject_quantity').default(0),
	remarks: text('remarks').default(null),
});

export const sfg_production = zipper.table('sfg_production', {
	uuid: uuid_primary,
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	section: text('section').notNull(),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	wastage: decimal('wastage', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const sfg_transaction = zipper.table('sfg_transaction', {
	uuid: uuid_primary,
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	trx_from: text('trx_from').notNull(),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	trx_quantity_in_kg: PG_DECIMAL('trx_quantity_in_kg').default(0.0),
	slider_item_uuid: defaultUUID('slider_item_uuid').references(
		() => sliderSchema.stock.uuid
	),
	//	slider_item_uuid: uuid('slider_item_uuid').references(() => sliderSchema.stock.uuid),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const dyed_tape_transaction = zipper.table('dyed_tape_transaction', {
	uuid: uuid_primary,
	order_description_uuid: defaultUUID('order_description_uuid').references(
		() => order_description.uuid
	),
	colors: text('colors').default(null),
	trx_quantity: PG_DECIMAL('trx_quantity').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const dyed_tape_transaction_from_stock = zipper.table(
	'dyed_tape_transaction_from_stock',
	{
		uuid: uuid_primary,
		order_description_uuid: defaultUUID(
			'order_description_uuid'
		).references(() => order_description.uuid),
		trx_quantity: PG_DECIMAL('trx_quantity').default(0),

		tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
			() => tape_coil.uuid
		),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		remarks: text('remarks').default(null),
	}
);

export const batchStatusEnum = zipper.enum('batch_status', [
	'pending',
	'completed',
	'cancelled',
]);

// zipper batch
export const batch = zipper.table('batch', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	batch_status: batchStatusEnum('batch_status').default('pending'),
	machine_uuid: defaultUUID('machine_uuid').references(
		() => publicSchema.machine.uuid
	),
	slot: integer('slot').default(0),
	received: integer('received').default(0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const batch_entry = zipper.table('batch_entry', {
	uuid: uuid_primary,
	batch_uuid: defaultUUID('batch_uuid').references(() => batch.uuid),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

// dying batch
export const dying_batch = zipper.table('dying_batch', {
	uuid: uuid_primary,
	id: serial('id').notNull(),
	mc_no: integer('mc_no').notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const dying_batch_entry = zipper.table('dying_batch_entry', {
	uuid: uuid_primary,
	dying_batch_uuid: defaultUUID('dying_batch_uuid').references(
		() => dying_batch.uuid
	),
	batch_entry_uuid: defaultUUID('batch_entry_uuid').references(
		() => batch_entry.uuid
	),
	quantity: decimal('quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

// tape and coil
export const tape_coil = zipper.table('tape_coil', {
	uuid: uuid_primary,
	item_uuid: defaultUUID('item_uuid').references(
		() => publicSchema.properties.uuid
	),
	zipper_number_uuid: defaultUUID('zipper_number_uuid').references(
		() => publicSchema.properties.uuid
	),
	name: text('name').notNull(),
	is_import: text('is_import').default(null),
	is_reverse: text('is_reverse').default(null),
	raw_per_kg_meter: PG_DECIMAL('raw_per_kg_meter').default(0.0),
	dyed_per_kg_meter: PG_DECIMAL('dyed_per_kg_meter').default(0.0),
	quantity: PG_DECIMAL('quantity').default(0.0), // tape stock
	trx_quantity_in_dying: PG_DECIMAL('trx_quantity_in_dying').default(0.0), // for dyeing
	stock_quantity: PG_DECIMAL('stock_quantity').default(0.0), // after dyeing
	trx_quantity_in_coil: PG_DECIMAL('trx_quantity_in_coil').default(0.0), // for coil
	quantity_in_coil: PG_DECIMAL('quantity_in_coil').default(0.0), // after coiling
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const tape_trx = zipper.table('tape_trx', {
	uuid: uuid_primary,
	tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
		() => tape_coil.uuid
	),
	to_section: text('to_section').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const tape_coil_production = zipper.table('tape_coil_production', {
	uuid: uuid_primary,
	section: text('section').notNull(),
	tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
		() => tape_coil.uuid
	),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	wastage: decimal('wastage', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const tape_coil_to_dyeing = zipper.table('tape_coil_to_dyeing', {
	uuid: uuid_primary,
	tape_coil_uuid: defaultUUID('tape_coil_uuid').references(
		() => tape_coil.uuid
	),
	order_description_uuid: defaultUUID('order_description_uuid').references(
		() => order_description.uuid
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

export const tape_coil_required = zipper.table('tape_coil_required', {
	uuid: uuid_primary,
	end_type_uuid: defaultUUID('end_type_uuid').references(
		() => publicSchema.properties.uuid
	),
	item_uuid: defaultUUID('item_uuid').references(
		() => publicSchema.properties.uuid
	),
	nylon_stopper_uuid: defaultUUID('nylon_stopper_uuid').references(
		() => publicSchema.properties.uuid
	),
	zipper_number_uuid: defaultUUID('zipper_number_uuid').references(
		() => publicSchema.properties.uuid
	),
	top: PG_DECIMAL('top').notNull(),
	bottom: PG_DECIMAL('bottom').notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const planning = zipper.table('planning', {
	week: text('week').primaryKey(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const planning_entry = zipper.table('planning_entry', {
	uuid: uuid_primary,
	planning_week: defaultUUID('planning_week').references(() => planning.week),
	sfg_uuid: defaultUUID('sfg_uuid').references(() => sfg.uuid),
	sno_quantity: decimal('sno_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	factory_quantity: decimal('factory_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	batch_production_quantity: decimal('batch_production_quantity', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	sno_remarks: text('sno_remarks').default(null),
	factory_remarks: text('factory_remarks').default(null),
});

export const material_trx_against_order_description = zipper.table(
	'material_trx_against_order_description',
	{
		uuid: uuid_primary,
		order_description_uuid: defaultUUID(
			'order_description_uuid'
		).references(() => order_description.uuid),
		material_uuid: defaultUUID('material_uuid').references(
			() => materialSchema.info.uuid
		),
		trx_to: text('trx_to').notNull(),
		trx_quantity: decimal('trx_quantity', {
			precision: 20,
			scale: 4,
		}).notNull(),
		created_by: defaultUUID('created_by').references(
			() => hrSchema.users.uuid
		),
		created_at: DateTime('created_at').notNull(),
		updated_at: DateTime('updated_at').default(null),
		remarks: text('remarks').default(null),
	}
);

export const batch_production = zipper.table('batch_production', {
	uuid: uuid_primary,
	batch_entry_uuid: defaultUUID('batch_entry_uuid').references(
		() => batch_entry.uuid
	),
	production_quantity: decimal('production_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	production_quantity_in_kg: decimal('production_quantity_in_kg', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default zipper;
