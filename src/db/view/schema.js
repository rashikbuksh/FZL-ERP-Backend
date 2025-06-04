import { boolean, integer, text } from 'drizzle-orm/pg-core';
import * as deliverySchema from '../delivery/schema.js';
import * as hrSchema from '../hr/schema.js';
import * as publicSchema from '../public/schema.js';
import { DateTime, PG_DECIMAL } from '../variables.js';
import * as zipperSchema from '../zipper/schema.js';

const zipper = zipperSchema.zipper;
const delivery = deliverySchema.delivery;

// NOTE: ZIPPER VIEWS
export const v_order_details = zipper
	.view('v_order_details', {
		order_info_uuid: text('order_info_uuid').references(
			() => zipperSchema.order_info.uuid
		),
		reference_order_info_uuid: text('reference_order_info_uuid').references(
			() => zipperSchema.order_info.uuid
		),
		order_number: text('order_number'),
		item_description: text('item_description'),
		item_name: text('item_name'),
		nylon_stopper_name: text('nylon_stopper_name'),
		zipper_number_name: text('zipper_number_name'),
		end_type_name: text('end_type_name'),
		puller_type_name: text('puller_type_name'),
		order_description_uuid: text('order_description_uuid').references(
			() => zipperSchema.order_description.uuid
		),
		buyer_uuid: text('buyer_uuid').references(
			() => publicSchema.buyer.uuid
		),
		buyer_name: text('buyer_name'),
		party_uuid: text('party_uuid').references(
			() => publicSchema.party.uuid
		),
		party_name: text('party_name'),
		marketing_uuid: text('marketing_uuid').references(
			() => publicSchema.marketing.uuid
		),
		marketing_name: text('marketing_name'),
		merchandiser_uuid: text('merchandiser_uuid').references(
			() => publicSchema.merchandiser.uuid
		),
		merchandiser_name: text('merchandiser_name'),
		factory_uuid: text('factory_uuid').references(
			() => publicSchema.factory.uuid
		),
		factory_name: text('factory_name'),
		is_sample: integer('is_sample'),
		is_bill: integer('is_bill'),
		is_cash: integer('is_cash'),
		marketing_priority: text('marketing_priority'),
		factory_priority: text('factory_priority'),
		status: text('status'),
		created_by_uuid: text('created_by_uuid').references(
			() => hrSchema.users.uuid
		),
		created_by_name: text('created_by_name'),
		created_at: DateTime('created_at'),
		updated_at: DateTime('updated_at'),
		remarks: text('remarks'),
		is_inch: integer('is_inch'),
		is_meter: integer('is_meter'),
		is_cm: integer('is_cm'),
		order_type: text('order_type'),
		is_multi_color: integer('is_multi_color'),
		order_description_created_at: DateTime('order_description_created_at'),
		order_description_updated_at: DateTime('order_description_updated_at'),
		tape_received: PG_DECIMAL('tape_received'),
		tape_transferred: PG_DECIMAL('tape_transferred'),
		is_cancelled: boolean('is_cancelled'),
	})
	.existing();

export const v_order_details_full = zipper
	.view('v_order_details_full', {
		order_info_uuid: text('order_info_uuid').references(
			() => zipperSchema.order_info.uuid
		),
		order_number: text('order_number'),
		order_description_uuid: text('order_description_uuid').references(
			() => zipperSchema.order_description.uuid
		),
		tape_received: PG_DECIMAL('tape_received'),
		tape_transferred: PG_DECIMAL('tape_transferred'),
		slider_finishing_stock: PG_DECIMAL('slider_finishing_stock'),
		marketing_uuid: text('marketing_uuid').references(
			() => publicSchema.marketing.uuid
		),
		marketing_name: text('marketing_name'),
		buyer_uuid: text('buyer_uuid').references(
			() => publicSchema.buyer.uuid
		),
		buyer_name: text('buyer_name'),
		merchandiser_uuid: text('merchandiser_uuid').references(
			() => publicSchema.merchandiser.uuid
		),
		merchandiser_name: text('merchandiser_name'),
		factory_uuid: text('factory_uuid').references(
			() => publicSchema.factory.uuid
		),
		factory_name: text('factory_name'),
		factory_address: text('factory_address'),
		party_uuid: text('party_uuid').references(
			() => publicSchema.party.uuid
		),
		party_name: text('party_name'),
		created_by_uuid: text('created_by_uuid').references(
			() => hrSchema.users.uuid
		),
		created_by_name: text('created_by_name'),
		is_cash: integer('is_cash'),
		is_bill: integer('is_bill'),
		is_sample: integer('is_sample'),
		order_status: text('order_status'),
		created_at: DateTime('created_at'),
		updated_at: DateTime('updated_at'),
		print_in: text('print_in'),
		item_description: text('item_description'),
		item: text('item'),
		item_name: text('item_name'),
		item_short_name: text('item_short_name'),
		nylon_stopper: text('nylon_stopper'),
		nylon_stopper_name: text('nylon_stopper_name'),
		nylon_stopper_short_name: text('nylon_stopper_short_name'),
		zipper_number: text('zipper_number'),
		zipper_number_name: text('zipper_number_name'),
		zipper_number_short_name: text('zipper_number_short_name'),
		end_type: text('end_type'),
		end_type_name: text('end_type_name'),
		end_type_short_name: text('end_type_short_name'),
		puller_type: text('puller_type'),
		puller_type_name: text('puller_type_name'),
		puller_type_short_name: text('puller_type_short_name'),
		lock_type: text('lock_type'),
		lock_type_name: text('lock_type_name'),
		lock_type_short_name: text('lock_type_short_name'),
		teeth_color: text('teeth_color'),
		teeth_color_name: text('teeth_color_name'),
		teeth_color_short_name: text('teeth_color_short_name'),
		puller_color: text('puller_color'),
		puller_color_name: text('puller_color_name'),
		puller_color_short_name: text('puller_color_short_name'),
		hand: text('hand'),
		hand_name: text('hand_name'),
		hand_short_name: text('hand_short_name'),
		coloring_type: text('coloring_type'),
		coloring_type_name: text('coloring_type_name'),
		coloring_type_short_name: text('coloring_type_short_name'),
		slider_provided: integer('slider_provided'),
		slider: text('slider'),
		slider_name: text('slider_name'),
		slider_short_name: text('slider_short_name'),
		slider_starting_section: text('slider_starting_section'),
		top_stopper: text('top_stopper'),
		top_stopper_name: text('top_stopper_name'),
		top_stopper_short_name: text('top_stopper_short_name'),
		bottom_stopper: text('bottom_stopper'),
		bottom_stopper_name: text('bottom_stopper_name'),
		bottom_stopper_short_name: text('bottom_stopper_short_name'),
		logo_type: text('logo_type'),
		logo_type_name: text('logo_type_name'),
		logo_type_short_name: text('logo_type_short_name'),
		is_logo_body: integer('is_logo_body'),
		is_logo_puller: integer('is_logo_puller'),
		special_requirement: text('special_requirement'),
		description: text('description'),
		order_description_status: text('order_description_status'),
		order_description_created_at: DateTime('order_description_created_at'),
		order_description_updated_at: DateTime('order_description_updated_at'),
		remarks: text('remarks'),
		slider_body_shape: text('slider_body_shape'),
		slider_body_shape_name: text('slider_body_shape_name'),
		slider_body_shape_short_name: text('slider_body_shape_short_name'),
		end_user: text('end_user'),
		end_user_name: text('end_user_name'),
		end_user_short_name: text('end_user_short_name'),
		garment: text('garment'),
		light_preference: text('light_preference'),
		light_preference_name: text('light_preference_name'),
		light_preference_short_name: text('light_preference_short_name'),
		garments_wash: text('garments_wash'),
		slider_link: text('slider_link'),
		slider_link_name: text('slider_link_name'),
		slider_link_short_name: text('slider_link_short_name'),
		marketing_priority: text('marketing_priority'),
		factory_priority: text('factory_priority'),
		garments_remarks: text('garments_remarks'),
		stock_swatch_approved_quantity: PG_DECIMAL(
			'stock_swatch_approved_quantity'
		),
		tape_coil_uuid: text('tape_coil_uuid'),
		tape_name: text('tape_name'),
		teeth_type: text('teeth_type'),
		teeth_type_name: text('teeth_type_name'),
		teeth_type_short_name: text('teeth_type_short_name'),
		is_inch: integer('is_inch'),
		is_meter: integer('is_meter'),
		is_cm: integer('is_cm'),
		order_type: text('order_type'),
		is_multi_color: integer('is_multi_color'),
		is_waterproof: boolean('is_waterproof'),
	})
	.existing();

// NOTE: DELIVERY VIEWS
export const v_packing_list_details = delivery
	.view('v_packing_list_details', {
		packing_list_id: integer('packing_list_id'),
		packing_list_uuid: text('packing_list_uuid'),
		packing_number: text('packing_number'),
		carton_name: text('carton_name'),
		carton_size: text('carton_size'),
		carton_weight: PG_DECIMAL('carton_weight'),
		order_info_uuid: text('order_info_uuid'),
		thread_order_info_uuid: text('thread_order_info_uuid'),
		challan_uuid: text('challan_uuid'),
		created_by_uuid: text('created_by_uuid'),
		created_by_name: text('created_by_name'),
		created_at: DateTime('created_at'),
		updated_at: DateTime('updated_at'),
		remarks: text('remarks'),
		is_warehouse_received: integer('is_warehouse_received'),
		challan_number: text('challan_number'),
		gate_pass: text('gate_pass'),
		receive_status: text('receive_status'),
		packing_list_entry_uuid: text('packing_list_entry_uuid'),
		sfg_uuid: text('sfg_uuid'),
		quantity: PG_DECIMAL('quantity'),
		poli_quantity: PG_DECIMAL('poli_quantity'),
		short_quantity: PG_DECIMAL('short_quantity'),
		reject_quantity: PG_DECIMAL('reject_quantity'),
		entry_created_at: DateTime('entry_created_at'),
		entry_updated_at: DateTime('entry_updated_at'),
		entry_remarks: text('entry_remarks'),
		order_entry_uuid: text('order_entry_uuid'),
		style: text('style'),
		color: text('color'),
		size: PG_DECIMAL('size'),
		is_inch: integer('is_inch'),
		is_meter: integer('is_meter'),
		is_cm: integer('is_cm'),
		style_color_size: text('style_color_size'),
		order_quantity: PG_DECIMAL('order_quantity'),
		order_description_uuid: text('order_description_uuid'),
		order_number: text('order_number'),
		item_description: text('item_description'),
		warehouse: PG_DECIMAL('warehouse'),
		delivered: PG_DECIMAL('delivered'),
		balance_quantity: PG_DECIMAL('balance_quantity'),
		item_for: text('item_for'),
	})
	.existing();

export const v_packing_list = delivery
	.view('v_packing_list', {
		uuid: text('uuid'),
		order_info_uuid: text('order_info_uuid'),
		packing_list_wise_rank: integer('packing_list_wise_rank'),
		packing_list_wise_count: integer('packing_list_wise_count'),
		packing_number: text('packing_number'),
		order_number: text('order_number'),
		challan_uuid: text('challan_uuid'),
		challan_number: text('challan_number'),
		party_name: text('party_name'),
		carton_size: text('carton_size'),
		carton_weight: PG_DECIMAL('carton_weight'),
		carton_uuid: text('carton_uuid'),
		carton_name: text('carton_name'),
		is_warehouse_received: integer('is_warehouse_received'),
		factory_uuid: text('factory_uuid'),
		factory_name: text('factory_name'),
		buyer_uuid: text('buyer_uuid'),
		buyer_name: text('buyer_name'),
		created_by: text('created_by'),
		created_by_name: text('created_by_name'),
		created_at: DateTime('created_at'),
		updated_at: DateTime('updated_at'),
		remarks: text('remarks'),
		gate_pass: text('gate_pass'),
		item_for: text('item_for'),
	})
	.existing();
