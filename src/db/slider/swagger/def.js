import SE, { SED } from '../../../util/swagger_example.js';
// * ./schema.js#stock
export const defStock = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'item',
		'zipper_number',
		'end_type',
		'puller_type',
		'color',
		'order_quantity',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		order_quantity: SE.number(0.0),
		body_quantity: SE.number(0.0),
		cap_quantity: SE.number(0.0),
		puller_quantity: SE.number(0.0),
		link_quantity: SE.number(0.0),
		sa_prod: SE.number(0.0),
		coloring_stock: SE.number(0.0),
		coloring_prod: SE.number(0.0),
		finishing_stock: SE.number(0.0),
		trx_to_finishing: SE.number(0.0),
		u_top_quantity: SE.number(0.0),
		h_bottom_quantity: SE.number(0.0),
		box_pin_quantity: SE.number(0.0),
		two_way_pin_quantity: SE.number(0.0),
		quantity_in_sa: SE.number(0.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks	'),
	},
	xml: 'Slider/Stock',
});

export const defDieCasting = SED({
	required: [
		'uuid',
		'name',
		'item',
		'zipper_number',
		'end_type',
		'puller_type',
		'logo_type',
		'slider_link',
		'quantity',
		'weight',
		'pcs_per_kg',
		'created_by',
		'created_at',
		'quantity_in_sa',
	],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('die_casting 1'),
		item: SE.uuid(),
		zipper_number: SE.uuid(),
		end_type: SE.uuid(),
		puller_type: SE.uuid(),
		logo_type: SE.uuid(),
		slider_body_shape: SE.uuid(),
		slider_link: SE.uuid(),
		is_logo_body: SE.number(0),
		is_logo_puller: SE.number(0),
		quantity: SE.number(0.0),
		weight: SE.number(0.0),
		pcs_per_kg: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		type: SE.string('body'),
		quantity_in_sa: SE.number(0.0),
	},
	xml: 'Slider/DieCasting',
});

export const defAssemblyStock = SED({
	required: [
		'uuid',
		'name',
		'die_casting_body_uuid',
		'die_casting_puller_uuid',
		'die_casting_cap_uuid',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('die_casting 1'),
		die_casting_body_uuid: SE.uuid(),
		die_casting_puller_uuid: SE.uuid(),
		die_casting_cap_uuid: SE.uuid(),
		die_casting_link_uuid: SE.uuid(),
		quantity: SE.number(0.0),
		weight: SE.number(0.0),
		production_quantity: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/AssemblyStock',
});

export const defDieCastingToAssemblyStock = SED({
	required: [
		'uuid',
		'assembly_stock_uuid',
		'production_quantity',
		'weight',
		'wastage',
		'with_link',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		assembly_stock_uuid: SE.uuid(),
		production_quantity: SE.number(0.0),
		weight: SE.number(0.0),
		wastage: SE.number(0.0),
		with_link: SE.number(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
		material_uuid: SE.uuid(),
	},
	xml: 'Slider/DieCastingToAssemblyStock',
});

export const defDieCastingProduction = SED({
	required: [
		'uuid',
		'die_casting_uuid',
		'mc_no',
		'cavity_goods',
		'cavity_defect',
		'push',
		'weight',
		'order_description_uuid',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		die_casting_uuid: SE.uuid(),
		mc_no: SE.number(0),
		cavity_goods: SE.number(0),
		cavity_defect: SE.number(0),
		push: SE.number(0),
		weight: SE.number(0.0),
		order_description_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/DieCastingProduction',
});
export const defDieCastingTransaction = SED({
	required: [
		'uuid',
		'die_casting_uuid',
		'stock_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		die_casting_uuid: SE.uuid(),
		stock_uuid: SE.uuid(),
		trx_quantity: SE.number(0.0),
		weight: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/DieCastingTransaction',
});
export const defTransaction = SED({
	required: [
		'uuid',
		'stock_uuid',
		'assembly_stock_uuid',
		'from_section',
		'to_section',
		'trx_quantity',
		'weight',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		stock_uuid: SE.uuid(),
		assembly_stock_uuid: SE.uuid(),
		from_section: SE.string('sa_prod'),
		to_section: SE.string('coloring_stock'),
		trx_quantity: SE.number(0.0),
		weight: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/Transaction',
});
export const defColoringTransaction = SED({
	required: [
		'uuid',
		'stock_uuid',
		'order_info_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		stock_uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		trx_quantity: SE.number(0.0),
		weight: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/ColoringTransaction',
});

export const defTrxAgainstStock = SED({
	required: [
		'uuid',
		'die_casting_uuid',
		'quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		die_casting_uuid: SE.uuid(),
		quantity: SE.number(0.0),
		weight: SE.number(0.0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/TrxAgainstStock',
});

export const defProduction = SED({
	required: [
		'uuid',
		'stock_uuid',
		'production_quantity',
		'wastage',
		'section',
		'with_link',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		stock_uuid: SE.uuid(),
		production_quantity: SE.number(0.0),
		weight: SE.number(0.0),
		wastage: SE.number(0.0),
		section: SE.string('sa_prod'),
		with_link: SE.number(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Slider/Production',
});

// * Marge All
export const defSlider = {
	die_casting: defDieCasting,
	die_casting_production: defDieCastingProduction,
	die_casting_transaction: defDieCastingTransaction,
	assembly_stock: defAssemblyStock,
	die_casting_to_assembly_stock: defDieCastingToAssemblyStock,
	stock: defStock,
	transaction: defTransaction,
	coloring_transaction: defColoringTransaction,
	trx_against_stock: defTrxAgainstStock,
	production: defProduction,
};

// * Tag
export const tagSlider = [
	{
		name: 'slider.stock',
		description: 'Stock',
	},
	{
		name: 'slider.die_casting',
		description: 'Die Casting',
	},
	{
		name: 'slider.assembly_stock',
		description: 'Assembly Stock',
	},
	{
		name: 'slider.die_casting_to_assembly_stock',
		description: 'Die Casting To Assembly Stock',
	},
	{
		name: 'slider.die_casting_production',
		description: 'Die Casting Production',
	},
	{
		name: 'slider.die_casting_transaction',
		description: 'Die Casting Transaction',
	},
	{
		name: 'slider.transaction',
		description: 'Transaction',
	},
	{
		name: 'slider.coloring_transaction',
		description: 'Coloring Transaction',
	},
	{
		name: 'slider.trx_against_stock',
		description: 'Trx Against Stock',
	},
	{
		name: 'slider.production',
		description: 'Production',
	},
];

// * PATH
