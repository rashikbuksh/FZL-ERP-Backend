//* ./schema.js#section

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

// * Marge All

export const defMaterial = {
	section: defMaterialSection,
	type: defMaterialType,
	info: defMaterialInfo,
	stock: defMaterialStock,
	trx: defMaterialTrx,
	used: defMaterialUsed,
	stock_to_sfg: defMaterialStockToSfg,
};

// * Tag
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
