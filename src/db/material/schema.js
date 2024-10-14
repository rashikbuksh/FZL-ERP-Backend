import { decimal, integer, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import {
	DateTime,
	defaultUUID,
	PG_DECIMAL,
	uuid_primary,
} from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as zipperSchema from '../zipper/schema.js';

const material = pgSchema('material');

export const section = material.table('section', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const type = material.table('type', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const info = material.table('info', {
	uuid: uuid_primary,
	section_uuid: defaultUUID('section_uuid').references(() => section.uuid),
	type_uuid: defaultUUID('type_uuid').references(() => type.uuid),
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	unit: text('unit').notNull(),
	threshold: decimal('threshold', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	average_lead_time: integer('average_lead_time').default(0),
	description: text('description').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	remarks: text('remarks').default(null),
});

export const stock = material.table('stock', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	stock: decimal('stock', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	lab_dip: decimal('lab_dip', {
		precision: 20,
		scale: 4,
	}).default(0.0),
	tape_making: decimal('tape_making', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	coil_forming: decimal('coil_forming', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	dying_and_iron: decimal('dying_and_iron', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_gapping: decimal('m_gapping', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_gapping: decimal('v_gapping', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_teeth_molding: decimal('v_teeth_molding', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_teeth_molding: decimal('m_teeth_molding', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	teeth_assembling_and_polishing: decimal('teeth_assembling_and_polishing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_teeth_cleaning: decimal('m_teeth_cleaning', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_teeth_cleaning: decimal('v_teeth_cleaning', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	plating_and_iron: decimal('plating_and_iron', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_sealing: decimal('m_sealing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_sealing: decimal('v_sealing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	n_t_cutting: decimal('n_t_cutting', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_t_cutting: decimal('v_t_cutting', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_stopper: decimal('m_stopper', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_stopper: decimal('v_stopper', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	n_stopper: decimal('n_stopper', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	cutting: decimal('cutting', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	m_qc_and_packing: decimal('m_qc_and_packing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	v_qc_and_packing: decimal('v_qc_and_packing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	n_qc_and_packing: decimal('n_qc_and_packing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	s_qc_and_packing: decimal('s_qc_and_packing', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	die_casting: decimal('die_casting', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	slider_assembly: decimal('slider_assembly', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	coloring: decimal('coloring', {
		precision: 20,
		scale: 4,
	})
		.notNull()
		.default(0.0),
	remarks: text('remarks').default(null),
});

export const trx = material.table('trx', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const used = material.table('used', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	section: text('section').notNull(),
	used_quantity: decimal('used_quantity', {
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

//stock to sfg table
export const stock_to_sfg = material.table('stock_to_sfg', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid').references(() => info.uuid),
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => zipperSchema.order_entry.uuid
	),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by').references(() => hrSchema.users.uuid),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export default material;
