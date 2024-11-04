import SE, { SED } from '../../../util/swagger_example.js';
import { finishing_batch_entry } from '../schema.js';

// * Zipper Order Info * //
export const def_zipper_order_info = SED({
	required: [
		'uuid',
		'id',
		'reference_order_info_uuid',
		'buyer_uuid',
		'party_uuid',
		'marketing_uuid',
		'merchandiser_uuid',
		'factory_uuid',
		'is_sample',
		'is_bill',
		'conversion_rate',
		'marketing_priority',
		'factory_priority',
		'status',
		'created_by',
		'created_at',
		'remarks',
		'print_in',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(),
		reference_order_info_uuid: SE.uuid(),
		buyer_uuid: SE.uuid(),
		party_uuid: SE.uuid(),
		marketing_uuid: SE.uuid(),
		merchandiser_uuid: SE.uuid(),
		factory_uuid: SE.uuid(),
		is_sample: SE.integer(),
		is_bill: SE.integer(),
		is_cash: SE.integer(),
		conversion_rate: SE.number(),
		marketing_priority: SE.string('Urgent'),
		factory_priority: SE.string('FIFO'),
		status: SE.integer(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
		print_in: SE.string('portrait'),
	},
	xml: 'Zipper/Order-Info',
});

// * Zipper Order Description * //
export const def_zipper_order_description = SED({
	required: [
		'uuid',
		'order_info_uuid',
		'item',
		'nylon_stopper',
		'zipper_number',
		'end_type',
		'lock_type',
		'puller_type',
		'teeth_color',
		'teeth_type',
		'puller_color',
		'hand',
		'coloring_type',
		'slider',
		'slider_starting_section',
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
		'created_by',
		'slider_finishing_stock',
		'is_inch',
		'is_meter',
		'order_type',
	],
	properties: {
		uuid: SE.uuid(),
		order_info_uuid: SE.uuid(),
		tape_coil_uuid: SE.uuid(),
		tape_received: SE.number(10),
		tape_transferred: SE.number(10),
		item: SE.string(),
		nylon_stopper: SE.uuid(),
		zipper_number: SE.uuid(),
		end_type: SE.uuid(),
		lock_type: SE.uuid(),
		puller_type: SE.uuid(),
		teeth_color: SE.uuid(),
		teeth_type: SE.uuid(),
		puller_color: SE.uuid(),
		special_requirement: SE.string(),
		hand: SE.string(),
		coloring_type: SE.uuid(),
		slider_provided: SE.string(),
		slider: SE.uuid(),
		slider_starting_section: SE.string(),
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
		slider_body_shape: SE.uuid(),
		slider_link: SE.uuid(),
		end_user: SE.uuid(),
		garment: SE.string(),
		light_preference: SE.string(),
		garments_wash: SE.string(),
		created_by: SE.uuid(),
		garments_remarks: SE.string(),
		slider_finishing_stock: SE.number(),
		is_inch: SE.integer(0),
		is_meter: SE.integer(0),
		is_cm: SE.integer(0),
		order_type: SE.string('full'),
		is_multi_color: SE.integer(0),
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
		'bleaching',
		'created_at',
		'is_inch',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		style: SE.string(),
		color: SE.string(),
		size: SE.string(),
		is_inch: SE.integer(0),
		quantity: SE.integer(),
		company_price: SE.number(),
		party_price: SE.number(),
		status: SE.integer(),
		swatch_status: SE.string('pending'),
		swatch_approval_date: SE.date_time(),
		bleaching: SE.string(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Order-Entry',
});

// * Zipper Sfg * //
export const def_zipper_sfg = SED({
	required: [
		'uuid',
		'order_entry_uuid',
		'recipe_uuid',
		'dying_and_iron_prod',
		'teeth_molding_stock',
		'teeth_molding_prod',
		'teeth_coloring_stock',
		'teeth_coloring_prod',
		'finishing_stock',
		'finishing_prod',
		'coloring_prod',
		'warehouse',
		'delivered',
		'pi',
		'short_quantity',
		'reject_quantity',
		'batch_quantity',
		'created_at',
		'remarks',
	],
	properties: {
		uuid: SE.uuid(),
		order_entry_uuid: SE.uuid(),
		recipe_uuid: SE.uuid(),
		dying_and_iron_prod: SE.number(),
		dyed_tape_used_in_kg: SE.number(),
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
		short_quantity: SE.number(),
		reject_quantity: SE.number(),
		batch_quantity: SE.number(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Sfg',
});

// * Zipper Sfg production * //
export const def_zipper_finishing_batch_production = SED({
	required: [
		'uuid',
		'finishing_batch_entry_uuid',
		'section',
		'production_quantity',
		'wastage',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		finishing_batch_entry_uuid: SE.uuid(),
		section: SE.string(),
		dyed_tape_used_in_kg: SE.number(),
		production_quantity_in_kg: SE.number(),
		production_quantity: SE.number(),
		wastage: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Finishing-Batch-Production',
});

// * Zipper finishing batch transaction * //
export const def_zipper_finishing_batch_transaction = SED({
	required: [
		'uuid',
		'finishing_batch_entry_uuid',
		'section',
		'trx_from',
		'trx_to',
		'trx_quantity',
		'trx_quantity_in_kg',
		'slider_item_uuid',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		finishing_batch_entry_uuid: SE.uuid(),
		section: SE.string(),
		trx_from: SE.string(),
		trx_to: SE.string(),
		trx_quantity: SE.number('10.0'),
		trx_quantity_in_kg: SE.number('10.0'),
		slider_item_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Finishing-Batch-Transaction',
});

// * Dyed Tape Transaction * //
export const def_zipper_dyed_tape_transaction = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		colors: SE.string('colors'),
		trx_quantity: SE.number('10.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Zipper/Dyed-Tape-Transaction',
});

// * Dyed Tape Transaction From Stock * //

export const def_zipper_dyed_tape_transaction_from_stock = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'trx_quantity',
		'tape_coil_uuid',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		trx_quantity: SE.number('10.0'),
		tape_coil_uuid: SE.uuid(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'Zipper/Dyed-Tape-Transaction-From-Stock',
});

// * Zipper Batch * //
export const def_zipper_dyeing_batch = SED({
	required: [
		'uuid',
		'created_by',
		'created_at',
		'remarks',
		'batch_status',
		'machine_uuid',
		'slot',
		'received',
		'id',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(),
		batch_status: SE.string('pending'),
		machine_uuid: SE.uuid(),
		slot: SE.number(),
		received: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Dyeing-Batch',
});

// * Zipper Dyeing Batch Entry * //
export const def_zipper_dyeing_batch_entry = SED({
	required: [
		'uuid',
		'dyeing_batch_uuid',
		'sfg_uuid',
		'quantity',
		'production_quantity',
		'production_quantity_in_kg',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		dyeing_batch_uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		quantity: SE.number(10.0),
		production_quantity: SE.number(10.0),
		production_quantity_in_kg: SE.number(10.0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Dyeing-Batch-Entry',
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
		'item_uuid',
		'zipper_number_uuid',
		'name',
		'is_import',
		'is_reverse',
		'raw_per_kg_meter',
		'dyed_per_kg_meter',
		'quantity',
		'trx_quantity_in_dying',
		'stock_quantity',
		'trx_quantity_in_coil',
		'quantity_in_coil',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		item_uuid: SE.uuid(),
		zipper_number_uuid: SE.uuid(),
		name: SE.string('Name'),
		is_import: SE.boolean(),
		is_reverse: SE.boolean(),
		raw_per_kg_meter: SE.number('100.0'),
		dyed_per_kg_meter: SE.number('100.0'),
		quantity: SE.number('100.0'),
		trx_quantity_in_dying: SE.number('100.0'),
		stock_quantity: SE.number('100.0'),
		trx_quantity_in_coil: SE.number('100.0'),
		quantity_in_coil: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Coil',
});

// * Zipper Tape To Coil * //
export const def_zipper_tape_trx = SED({
	required: [
		'uuid',
		'tape_coil_uuid',
		'to_section',
		'trx_quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		tape_coil_uuid: SE.uuid(),
		to_section: SE.string(),
		trx_quantity: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Trx',
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
// * Zipper Tape Coil Required * //
export const def_zipper_tape_coil_required = SED({
	required: [
		'uuid',
		'end_type_uuid',
		'item_uuid',
		'nylon_stopper_uuid',
		'zipper_number_uuid',
		'top',
		'bottom',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		end_type_uuid: SE.uuid(),
		item_uuid: SE.uuid(),
		nylon_stopper_uuid: SE.uuid(),
		zipper_number_uuid: SE.uuid(),
		top: SE.number('100.0'),
		bottom: SE.number('100.0'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('Remarks'),
	},
	xml: 'Zipper/Tape-Coil-Required',
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

export const def_zipper_batch_production = SED({
	required: [
		'uuid',
		'dyeing_batch_entry_uuid',
		'production_quantity',
		'production_quantity_in_kg',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		dyeing_batch_entry_uuid: SE.uuid(),
		production_quantity: SE.number(),
		production_quantity_in_kg: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Batch-Production',
});

export const def_multi_color_dashboard = SED({
	required: ['uuid', 'order_description_uuid'],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		expected_tape_quantity: SE.number(),
		is_swatch_approved: SE.integer(),
		tape_quantity: SE.number(),
		coil_uuid: SE.uuid(),
		coil_quantity: SE.number(),
		thread_name: SE.string(),
		thread_quantity: SE.number(),
		is_coil_received_sewing: SE.integer(),
		is_thread_received_sewing: SE.integer(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Multi-Color-Dashboard',
});

export const def_multi_color_tape_receive = SED({
	required: [
		'uuid',
		'order_description_uuid',
		'quantity',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		order_description_uuid: SE.uuid(),
		quantity: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Multi-Color-Tape-Receive',
});

export const def_finishing_batch = SED({
	required: [
		'uuid',
		'id',
		'order_description_uuid',
		'slider_lead_time',
		'dyeing_lead_time',
		'status',
		'slider_finishing_stock',
		'created_by',
		'created_at',
		'remarks',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(),
		order_description_uuid: SE.uuid(),
		slider_lead_time: SE.number(),
		dyeing_lead_time: SE.number(),
		status: SE.integer(),
		slider_finishing_stock: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Finishing-Batch',
});

export const def_finishing_batch_entry = SED({
	required: [
		'uuid',
		'finishing_batch_uuid',
		'sfg_uuid',
		'quantity',
		'dyed_tape_used_in_kg',
		'teeth_molding_prod',
		'teeth_coloring_stock',
		'finishing_stock',
		'finishing_prod',
		'warehouse',
		'created_by',
		'created_at',
		'remarks',
	],
	properties: {
		uuid: SE.uuid(),
		finishing_batch_uuid: SE.uuid(),
		sfg_uuid: SE.uuid(),
		quantity: SE.number(),
		dyed_tape_used_in_kg: SE.number(),
		teeth_molding_prod: SE.number(),
		teeth_coloring_stock: SE.number(),
		finishing_stock: SE.number(),
		finishing_prod: SE.number(),
		warehouse: SE.number(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string(),
	},
	xml: 'Zipper/Finishing-Batch-Entry',
});

//....................FOR TESTING.......................
export const defZipper = {
	order_info: def_zipper_order_info,
	order_description: def_zipper_order_description,
	order_entry: def_zipper_order_entry,
	sfg: def_zipper_sfg,
	finishing_batch_production: def_zipper_finishing_batch_production,
	finishing_batch_transaction: def_zipper_finishing_batch_transaction,
	dyed_tape_transaction: def_zipper_dyed_tape_transaction,
	dyed_tape_transaction_from_stock:
		def_zipper_dyed_tape_transaction_from_stock,
	dyeing_batch: def_zipper_dyeing_batch,
	dyeing_batch_entry: def_zipper_dyeing_batch_entry,
	dying_batch: def_zipper_dying_batch,
	dying_batch_entry: def_zipper_dying_batch_entry,
	tape_coil: def_zipper_tape_coil,
	tape_trx: def_zipper_tape_trx,
	tape_coil_production: def_zipper_tape_coil_production,
	planning: def_zipper_planning,
	planning_entry: def_zipper_planning_entry,
	material_trx_against_order_description:
		def_zipper_material_trx_against_order_description,
	tape_coil_to_dyeing: def_zipper_tape_coil_to_dyeing,
	batch_production: def_zipper_batch_production,
	tape_coil_required: def_zipper_tape_coil_required,
	multi_color_dashboard: def_multi_color_dashboard,
	multi_color_tape_receive: def_multi_color_tape_receive,
	finishing_batch: def_finishing_batch,
	finishing_batch_entry: def_finishing_batch_entry,
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
		name: 'zipper.finishing_batch_production',
		description: 'Zipper Finishing Batch Production',
	},
	{
		name: 'zipper.finishing_batch_transaction',
		description: 'Zipper Finishing Batch Transaction',
	},
	{
		name: 'zipper.dyed_tape_transaction',
		description: 'Zipper Dyed Tape Transaction',
	},
	{
		name: 'zipper.dyed_tape_transaction_from_stock',
		description: 'Zipper Dyed Tape Transaction From Stock',
	},
	{
		name: 'zipper.dyeing_batch',
		description: 'Zipper Dyeing Batch',
	},
	{
		name: 'zipper.dyeing_batch_entry',
		description: 'Zipper Dyeing Batch Entry',
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
		name: 'zipper.tape_trx',
		description: 'Zipper Tape Trx',
	},
	{
		name: 'zipper.tape_coil_production',
		description: 'Zipper Tape Coil Production',
	},
	{
		name: 'zipper.tape_coil_required',
		description: 'Zipper Tape Coil Required',
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
	{
		name: 'zipper.multi_color_dashboard',
		description: 'Zipper Multi Color Dashboard',
	},
	{
		name: 'zipper.multi_color_tape_receive',
		description: 'Zipper Multi Color Tape Receive',
	},
	{
		name: 'zipper.finishing_batch',
		description: 'Zipper Finishing Batch',
	},
	{
		name: 'zipper.finishing_batch_entry',
		description: 'Zipper Finishing Batch Entry',
	},
];
