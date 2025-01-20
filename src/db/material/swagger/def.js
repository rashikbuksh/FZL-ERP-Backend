import SE, { SED } from '../../../util/swagger_example.js';
//* ./schema.js#section

export const defMaterialSection = SED({
	required: ['uuid', 'name', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Section 1'),
		short_name: SE.string('S1'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		index: SE.number(0),
	},
	xml: 'Material/Section',
});

export const defMaterialType = SED({
	required: ['uuid', 'name', 'created_at', 'created_by'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Type 1'),
		short_name: SE.string('T1'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Type',
});

export const defMaterialInfo = SED({
	required: [
		'uuid',
		'section_uuid',
		'type_uuid',
		'name',
		'unit',
		'threshold',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		section_uuid: SE.uuid(),
		type_uuid: SE.uuid(),
		name: SE.string('Material 1'),
		short_name: SE.string('M1'),
		unit: SE.string('kg'),
		threshold: SE.number(100),
		is_priority_material: SE.number(1),
		average_lead_time: SE.number(10),
		description: SE.string('description'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Info',
});

export const defMaterialStock = SED({
	required: ['uuid', 'material_uuid', 'stock'],
	properties: {
		uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		index: SE.number(0),
		stock: SE.number(1000.0),
		lab_dip: SE.number(1000.0),
		tape_making: SE.number(1000.0),
		coil_forming: SE.number(1000.0),
		dying_and_iron: SE.number(1000.0),
		m_gapping: SE.number(1000.0),
		v_gapping: SE.number(1000.0),
		v_teeth_molding: SE.number(1000.0),
		m_teeth_molding: SE.number(1000.0),
		teeth_assembling_and_polishing: SE.number(1000.0),
		m_teeth_cleaning: SE.number(1000.0),
		v_teeth_cleaning: SE.number(1000.0),
		plating_and_iron: SE.number(1000.0),
		m_sealing: SE.number(1000.0),
		v_sealing: SE.number(1000.0),
		n_t_cutting: SE.number(1000.0),
		v_t_cutting: SE.number(1000.0),
		m_stopper: SE.number(1000.0),
		v_stopper: SE.number(1000.0),
		n_stopper: SE.number(1000.0),
		cutting: SE.number(1000.0),
		m_qc_and_packing: SE.number(1000.0),
		v_qc_and_packing: SE.number(1000.0),
		n_qc_and_packing: SE.number(1000.0),
		s_qc_and_packing: SE.number(1000.0),
		die_casting: SE.number(1000.0),
		slider_assembly: SE.number(1000.0),
		coloring: SE.number(1000.0),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Stock',
});

export const defMaterialTrx = SED({
	required: [
		'uuid',
		'material_uuid',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		trx_to: SE.string('ig'),
		trx_quantity: SE.number(1000.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Trx',
});

export const defMaterialUsed = SED({
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
		uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		section: SE.string('ig'),
		used_quantity: SE.number(1000.0),
		wastage: SE.number(1000.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Used',
});

export const defMaterialStockToSfg = SED({
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
		uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		order_entry_uuid: SE.uuid(),
		trx_to: SE.string('ig'),
		trx_quantity: SE.number(1000.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/StockToSfg',
});
export const defMaterialBooking = SED({
	required: [
		'uuid',
		'material_uuid',
		'marketing_uuid',
		'quantity',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.number(1),
		material_uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		quantity: SE.number(1000.0),
		trx_quantity: SE.number(1000.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Material/Booking',
});

// * Marge All

export const defMaterial = {
	section: defMaterialSection,
	type: defMaterialType,
	info: defMaterialInfo,
	stock: defMaterialStock,
	trx: defMaterialTrx,
	used: defMaterialUsed,
	stock_to_sfg: defMaterialStockToSfg,
	booking: defMaterialBooking,
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
	{
		name: 'material.booking',
		description: 'Material Booking',
	},
];
