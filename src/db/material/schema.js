import { decimal, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import { DateTime, defaultUUID, uuid_primary } from '../variables.js';

import * as hrSchema from '../hr/schema.js';
import * as zipperSchema from '../zipper/schema.js';

const material = pgSchema('material');

export const section = material.table('section', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const defMaterialSection = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Section 1',
		},
		short_name: {
			type: 'string',
			example: 'S1',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Material/Section',
	},
};

export const type = material.table('type', {
	uuid: uuid_primary,
	name: text('name').notNull(),
	short_name: text('short_name').default(null),
	remarks: text('remarks').default(null),
});

export const defMaterialType = {
	type: 'object',
	required: ['uuid', 'name'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Type 1',
		},
		short_name: {
			type: 'string',
			example: 'T1',
		},
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'Material/Type',
	},
};

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
	description: text('description').default(null),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});
export const defMaterialInfo = {
	type: 'object',
	required: [
		'uuid',
		'section_uuid',
		'type_uuid',
		'name',
		'unit',
		'threshold',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		type_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Material 1',
		},
		short_name: {
			type: 'string',
			example: 'M1',
		},
		unit: {
			type: 'string',
			example: 'kg',
		},
		threshold: {
			type: 'number',
			example: 1000.0,
		},
		description: {
			type: 'string',
			example: 'This is a material',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Material/Info',
	},
};

export const stock = material.table('stock', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid'),
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

export const defMaterialStock = {
	type: 'object',
	required: ['uuid', 'material_uuid', 'stock'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		stock: {
			type: 'number',
			example: 1000.0,
		},
		tape_making: {
			type: 'number',
			example: 1000.0,
		},
		coil_forming: {
			type: 'number',
			example: 1000.0,
		},
		dying_and_iron: {
			type: 'number',
			example: 1000.0,
		},
		m_gapping: {
			type: 'number',
			example: 1000.0,
		},
		v_gapping: {
			type: 'number',
			example: 1000.0,
		},
		v_teeth_molding: {
			type: 'number',
			example: 1000.0,
		},
		m_teeth_molding: {
			type: 'number',
			example: 1000.0,
		},
		teeth_assembling_and_polishing: {
			type: 'number',
			example: 1000.0,
		},
		m_teeth_cleaning: {
			type: 'number',
			example: 1000.0,
		},
		v_teeth_cleaning: {
			type: 'number',
			example: 1000.0,
		},
		plating_and_iron: {
			type: 'number',
			example: 1000.0,
		},
		m_sealing: {
			type: 'number',
			example: 1000.0,
		},
		v_sealing: {
			type: 'number',
			example: 1000.0,
		},
		n_t_cutting: {
			type: 'number',
			example: 1000.0,
		},
		v_t_cutting: {
			type: 'number',
			example: 1000.0,
		},
		m_stopper: {
			type: 'number',
			example: 1000.0,
		},
		v_stopper: {
			type: 'number',
			example: 1000.0,
		},
		n_stopper: {
			type: 'number',
			example: 1000.0,
		},
		cutting: {
			type: 'number',
			example: 1000.0,
		},
		m_qc_and_packing: {
			type: 'number',
			example: 1000.0,
		},
		v_qc_and_packing: {
			type: 'number',
			example: 1000.0,
		},
		n_qc_and_packing: {
			type: 'number',
			example: 1000.0,
		},
		s_qc_and_packing: {
			type: 'number',
			example: 1000.0,
		},
		die_casting: {
			type: 'number',
			example: 1000.0,
		},
		slider_assembly: {
			type: 'number',
			example: 1000.0,
		},
		coloring: {
			type: 'number',
			example: 1000.0,
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Material/Stock',
	},
};

export const trx = material.table('trx', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid'),
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
export const defMaterialTrx = {
	type: 'object',
	required: [
		'uuid',
		'material_uuid',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_to: {
			type: 'string',
			example: 'ig',
		},
		trx_quantity: {
			type: 'number',
			example: 1000.0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Material/Trx',
	},
};

export const used = material.table('used', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid'),
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
export const defMaterialUsed = {
	type: 'object',
	required: [
		'uuid',
		'material_uuid',
		'section',
		'used_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		section: {
			type: 'string',
			example: 'ig',
		},
		used_quantity: {
			type: 'number',
			example: 0.0,
		},
		wastage: {
			type: 'number',
			example: 0.0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Material/Used',
	},
};

//stock to sfg table
export const stock_to_sfg = material.table('stock_to_sfg', {
	uuid: uuid_primary,
	material_uuid: defaultUUID('material_uuid'),
	order_entry_uuid: defaultUUID('order_entry_uuid').references(
		() => zipperSchema.order_entry.uuid
	),
	trx_to: text('trx_to').notNull(),
	trx_quantity: decimal('trx_quantity', {
		precision: 20,
		scale: 4,
	}).notNull(),
	created_by: defaultUUID('created_by'),
	created_at: DateTime('created_at').notNull(),
	updated_at: DateTime('updated_at').default(null),
	remarks: text('remarks').default(null),
});

export const defMaterialStockToSfg = {
	type: 'object',
	required: [
		'uuid',
		'material_uuid',
		'order_entry_uuid',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		material_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		order_entry_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		trx_to: {
			type: 'string',
			example: 'ig',
		},
		trx_quantity: {
			type: 'number',
			example: 1000.0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			example: '2024-01-01 00:00:00',
		},
		remarks: {
			type: 'string',
			example: 'This is an entry',
		},
	},
	xml: {
		name: 'Material/StockToSfg',
	},
};

//................FOR TESTING................

export const defMaterial = {
	section: defMaterialSection,
	type: defMaterialType,
	info: defMaterialInfo,
	stock: defMaterialStock,
	trx: defMaterialTrx,
	used: defMaterialUsed,
	stock_to_sfg: defMaterialStockToSfg,
};

export const tagMaterial = [
	{
		name: 'material.section',
		description: 'Material Section',
		externalDocs: {
			description: 'Find out more about Material Section',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.type',
		description: 'Material Type',
		externalDocs: {
			description: 'Find out more about Material Type',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.info',
		description: 'Material Information',
		externalDocs: {
			description: 'Find out more about Material Information',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.stock',
		description: 'Material Stock',
		externalDocs: {
			description: 'Find out more about Material Stock',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.trx',
		description: 'Material Transaction',
		externalDocs: {
			description: 'Find out more about Material Transaction',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.used',
		description: 'Material Used',
		externalDocs: {
			description: 'Find out more about Material Used',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'material.stock_to_sfg',
		description: 'Material Stock to SFG',
	},
];

export default material;
