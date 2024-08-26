import SE, { SED } from '../../../util/swagger_example.js';

// * Zipper Order Info * //
export const def_zipper_order_info = SED({
	required: [
		'uuid',
		'buyer_uuid',
		'party_uuid',
		'marketing_uuid',
		'merchandiser_uuid',
		'factory_uuid',
		'is_sample',
		'is_bill',
		'marketing_priority',
		'factory_priority',
		'status',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		buyer_uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		merchandiser_uuid: SE.uuid(),
		factory_uuid: SE.uuid(),
		is_sample: SE.integer(),
		is_bill: SE.integer(),
		is_cash: SE.integer(),
		marketing_priority: SE.string('Urgent'),
		factory_priority: SE.string('FIFO'),
		status: SE.integer(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Order-Info',
});

// * Zipper Order Description * //
export const def_zipper_order_description = SED({
	required: [
		'uuid',
		'order_info_uuid',
		'item',
		'zipper_number',
		'end_type',
		'lock_type',
		'puller_type',
		'teeth_color',
		'puller_color',
		'hand',
		'stopper_type',
		'coloring_type',
		'slider',
		'top_stopper',
		'bottom_stopper',
		'logo_type',
		'is_logo_body',
		'is_logo_puller',
		'slider_body_shape',
		'slider_link',
		'end_user',
		'light_preference',
		'garments_wash',
		'puller_link',
		'created_by',
	],
	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		tape_received: SE.number(10),
		item: SE.string(),
		zipper_number: SE.string(),
		end_type: SE.string(),
		lock_type: SE.string(),
		puller_type: SE.string(),
		teeth_color: SE.string(),
		puller_color: SE.string(),
		hand: SE.string(),
		stopper_type: SE.string(),
		coloring_type: SE.string(),
		slider: SE.string(),
		top_stopper: SE.string(),
		bottom_stopper: SE.string(),
		logo_type: SE.string(),
		is_logo_body: SE.integer(),
		is_logo_puller: SE.integer(),
		description: SE.string(),
		status: SE.integer(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
		slider_body_shape: SE.string(),
		slider_link: SE.string(),
		end_user: SE.string(),
		garment: SE.string(),
		light_preference: SE.string(),
		garments_wash: SE.string(),
		puller_link: SE.string(),
		created_by: SE.uuid(),
	},
	xml: 'Zipper/Order-Description',
});

// * Zipper Order Entry * //
export const def_zipper_order_entry = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'style',
		'color',
		'size',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		style: SE.string(),
		color: SE.string(),
		size: SE.string(),
		quantity: SE.integer(),
		company_price: SE.number(),
		party_price: SE.number(),
		status: SE.integer(),
		swatch_status: SE.string('pending'),
		swatch_approval_date: SE.date_time(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Order-Entry',
});

// * Zipper Sfg * //
export const def_zipper_sfg = SED({
	required: ['uuid', 'order_entry_uuid'],
	properties: {
		uuid: SE.uuid(),
		order_entry_uuid: SE.uuid(),
		recipe_uuid: SE.uuid(),
		dying_and_iron_prod: SE.number(),
		teeth_molding_stock: SE.number(),
		teeth_molding_prod: SE.number(),
		teeth_coloring_stock: SE.number(),
		teeth_coloring_prod: SE.number(),
		finishing_stock: SE.number(),
		finishing_prod: SE.number(),
		coloring_prod: SE.number(),
		warehouse: SE.number(),
		delivered: SE.number(),
		pi: SE.number(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Sfg',
});

// * Zipper Sfg production * //
export const def_zipper_sfg_production = SED({
	required: [
		'uuid',
		'sfg_uuid',
		'section',
		'production_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		section: SE.string(),
		used_quantity: SE.number(),
		production_quantity: SE.number(),
		wastage: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Sfg-Production',
});

// * Zipper sfg transaction * //
export const def_zipper_sfg_transaction = SED({
	required: [
		'uuid',
		'order_entry_uuid',
		'section',
		'trx_from',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_entry_uuid: SE.uuid(),
		section: SE.string(),
		trx_from: SE.string(),
		trx_to: SE.string(),
		trx_quantity: SE.number('10.0'),
		slider_item_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Sfg-Transaction',
});

// * Dyed Tape Transaction * //

// * Zipper Batch * //
export const def_zipper_batch = SED({
	required: ['uuid', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Batch',
});

// * Zipper Dyeing Batch Entry * //
export const def_zipper_batch_entry = SED({
	required: [
		'uuid',
		'batch_uuid',
		'sfg_uuid',
		'quantity',
		'production_quantity',
		'production_quantity_in_kg',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		batch_uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		quantity: SE.number(10.0),
		production_quantity: SE.number(10.0),
		production_quantity_in_kg: SE.number(10.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Batch-Entry',
});

// * Zipper Dyeing Batch * //
export const def_zipper_dying_batch = SED({
	required: ['uuid', 'mc_no', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(),
		mc_no: SE.string(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Dying-Batch',
});

// * Zipper Dyeing Batch Entry * //
export const def_zipper_dying_batch_entry = SED({
	required: [
		'uuid',
		'dying_batch_uuid',
		'batch_entry_uuid',
		'quantity',
		'production_quantity',
		'production_quantity_in_kg',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		dying_batch_uuid: SE.uuid(),
		batch_entry_uuid: SE.uuid(),
		quantity: SE.number(10.0),
		production_quantity: SE.number(10.0),
		production_quantity_in_kg: SE.number(10.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Dying-Batch-Entry',
});

// * Zipper Tape Coil * //
export const def_zipper_tape_coil = SED({
	required: [
		'uuid',
		'type',
		'zipper_number',
		'quantity',
		'trx_quantity_in_coil',
		'quantity_in_coil',
	],
	properties: {
		uuid: SE.uuid(),
		type: SE.string('nylon'),
		zipper_number: SE.number('3.0'),
		quantity: SE.number('100.0'),
		trx_quantity_in_coil: SE.number('100.0'),
		quantity_in_coil: SE.number('100.0'),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Coil',
});

// * Zipper Tape To Coil * //
export const def_zipper_tape_to_coil = SED({
	required: [
		'uuid',
		'tape_coil_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		tape_coil_uuid: SE.uuid(),
		trx_quantity: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-To-Coil',
});

// * Zipper Tape Coil Production * //
export const def_zipper_tape_coil_production = SED({
	required: [
		'uuid',
		'section',
		'tape_coil_uuid',
		'production_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		section: SE.string(),
		tape_coil_uuid: SE.uuid(),
		production_quantity: SE.number('100.0'),
		wastage: SE.number('0.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Coil-Production',
});

// * Zipper Planning * //
export const def_zipper_planning = SED({
	required: ['week', 'created_by', 'created_at'],
	properties: {
		week: SE.string('24-32'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Planning',
});

// * Zipper Planning Entry * //
export const def_zipper_planning_entry = SED({
	required: [
		'uuid',
		'planning_week',
		'sfg_uuid',
		'sno_quantity',
		'factory_quantity',
		'production_quantity',
		'batch_production_quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		planning_week: SE.string('24-32'),
		sfg_uuid: SE.uuid(),
		sno_quantity: SE.number('100.0'),
		factory_quantity: SE.number('100.0'),
		production_quantity: SE.number('100.0'),
		batch_production_quantity: SE.number('100.0'),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		sno_remarks: SE.string('Remarks'),
		factory_remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Planning-Entry',
});

// * Zipper material trx against order description * //
export const def_zipper_material_trx_against_order_description = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'material_uuid',
		'trx_to',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		trx_to: SE.string(),
		trx_quantity: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Material_trx_against_order_description',
});
// * Zipper tape coil to dyeing * //

export const def_zipper_tape_coil_to_dyeing = SED({
	required: [
		'uuid',
		'tape_coil_uuid',
		'order_description_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		tape_coil_uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		trx_quantity: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Coil-To-Dyeing',
});

export const def_zipper_batch_production = SED({
	required: [
		'uuid',
		'batch_entry_uuid',
		'production_quantity',
		'production_quantity_in_kg',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		batch_entry_uuid: SE.uuid(),
		production_quantity: SE.number(),
		production_quantity_in_kg: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Batch-Production',
});

//....................FOR TESTING.......................
export const defZipper = {
	order_info: def_zipper_order_info,
	order_description: def_zipper_order_description,
	order_entry: def_zipper_order_entry,
	sfg: def_zipper_sfg,
	sfg_production: def_zipper_sfg_production,
	sfg_transaction: def_zipper_sfg_transaction,
	batch: def_zipper_batch,
	batch_entry: def_zipper_batch_entry,
	dying_batch: def_zipper_dying_batch,
	dying_batch_entry: def_zipper_dying_batch_entry,
	tape_coil: def_zipper_tape_coil,
	tape_to_coil: def_zipper_tape_to_coil,
	tape_coil_production: def_zipper_tape_coil_production,
	planning: def_zipper_planning,
	planning_entry: def_zipper_planning_entry,
	material_trx_against_order_description:
		def_zipper_material_trx_against_order_description,
	tape_coil_to_dyeing: def_zipper_tape_coil_to_dyeing,
	batch_production: def_zipper_batch_production,
};

// * Zipper Tag * //
export const tagZipper = [
	{
		name: 'zipper.order_info',
		description: 'Zipper Order Info',
	},
	{
		name: 'zipper.order_description',
		description: 'Zipper Order Description',
	},
	{
		name: 'zipper.order_entry',
		description: 'Zipper Order Entry',
	},
	{
		name: 'zipper.sfg',
		description: 'Zipper SFG',
	},
	{
		name: 'zipper.sfg_production',
		description: 'Zipper SFG Production',
	},
	{
		name: 'zipper.sfg_transaction',
		description: 'Zipper SFG Transaction',
	},
	{
		name: 'zipper.batch',
		description: 'Zipper Batch',
	},
	{
		name: 'zipper.batch_entry',
		description: 'Zipper Batch Entry',
	},
	{
		name: 'zipper.dying_batch',
		description: 'Zipper Dying Batch',
	},
	{
		name: 'zipper.dying_batch_entry',
		description: 'Zipper Dying Batch Entry',
	},
	{
		name: 'zipper.tape_coil',
		description: 'Zipper Tape Coil',
	},
	{
		name: 'zipper.tape_to_coil',
		description: 'Zipper Tape To Coil',
	},
	{
		name: 'zipper.tape_coil_production',
		description: 'Zipper Tape Coil Production',
	},
	{
		name: 'zipper.planning',
		description: 'Zipper Planning',
	},
	{
		name: 'zipper.planning_entry',
		description: 'Zipper Planning Entry',
	},
	{
		name: 'zipper.material_trx_against_order_description',
		description: 'Zipper Material Trx Against Order Description',
	},
	{
		name: 'zipper.tape_coil_to_dyeing',
		description: 'Zipper Tape Coil To Dyeing',
	},
	{
		name: 'zipper.batch_production',
		description: 'Zipper Batch Production',
	},
];
