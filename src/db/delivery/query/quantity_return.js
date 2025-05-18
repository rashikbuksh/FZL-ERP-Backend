import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { alias } from 'drizzle-orm/pg-core';
import {
	quantity_return,
	challan,
	packing_list_entry,
	packing_list,
} from '../schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import * as viewScehma from '../../view/schema.js';
import * as threadSchema from '../../thread/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as labDipSchema from '../../lab_dip/schema.js';

const completed_by_user = alias(hrSchema.users, 'completed_by_user');
const thread_order_entry = alias(
	threadSchema.order_entry,
	'thread_order_entry'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const quantity_returnPromise = db
		.insert(quantity_return)
		.values(req.body)
		.returning({ insertedName: quantity_return.id });

	try {
		const data = await quantity_returnPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const quantity_returnPromise = db
		.update(quantity_return)
		.set(req.body)
		.where(eq(quantity_return.uuid, req.params.uuid))
		.returning({ updatedName: quantity_return.id });

	try {
		const data = await quantity_returnPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const quantity_returnPromise = db
		.delete(quantity_return)
		.where(eq(quantity_return.uuid, req.params.uuid))
		.returning({ deletedName: quantity_return.id });

	try {
		const data = await quantity_returnPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const quantity_returnPromise = db
		.select({
			uuid: quantity_return.uuid,
			id: quantity_return.id,
			order_number: sql`
			CASE 
				WHEN quantity_return.order_entry_uuid IS NOT NULL 
				THEN v_order_details_full.order_number 
				ELSE CONCAT('ST', 
						CASE 
							WHEN order_info.is_sample = 1 THEN 'S' 
							ELSE '' 
						END, 
						TO_CHAR(order_info.created_at, 'YY'), '-', 
						LPAD(order_info.id::text, 4, '0')
					)
			END`,
			order_info_uuid: sql`
			CASE WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.order_info_uuid
				ELSE thread_order_entry.order_info_uuid
			END`,
			item_description: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.item_description
				ELSE null
			END`,
			order_description_uuid: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.order_description_uuid
				ELSE null
			END`,
			count: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN null ELSE CONCAT('"', thread.count_length.count) END`,
			length: threadSchema.count_length.length,
			count_length_uuid: threadSchema.count_length.uuid,
			count_length_name: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN null ELSE CONCAT('"', thread.count_length.count, ' - ', thread.count_length.length) END`,
			style: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.style ELSE thread_order_entry.style END`,
			color: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.color ELSE thread_order_entry.color END`,
			size: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.size ELSE null END`,
			quantity: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.quantity::float8 ELSE thread_order_entry.quantity::float8 END`,
			order_entry_uuid: quantity_return.order_entry_uuid,
			thread_order_entry_uuid: quantity_return.thread_order_entry_uuid,
			fresh_quantity: decimalToNumber(quantity_return.fresh_quantity),
			repair_quantity: decimalToNumber(quantity_return.repair_quantity),
			is_completed: quantity_return.is_completed,
			completed_date: quantity_return.completed_date,
			completed_by: quantity_return.completed_by,
			completed_by_name: completed_by_user.name,
			created_by: quantity_return.created_by,
			created_by_name: hrSchema.users.name,
			created_at: quantity_return.created_at,
			updated_at: quantity_return.updated_at,
			remarks: quantity_return.remarks,
			is_zipper: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN true
				ELSE false
			END`,
			challan_uuid: quantity_return.challan_uuid,
			challan_number: sql`
			CASE
				WHEN quantity_return.challan_uuid IS NULL
				THEN null
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN CONCAT('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 5, '0'))
				ELSE CONCAT('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 5, '0'))
			END`,
		})
		.from(quantity_return)
		.leftJoin(
			hrSchema.users,
			eq(quantity_return.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			completed_by_user,
			eq(quantity_return.completed_by, completed_by_user.uuid)
		)
		.leftJoin(
			zipperSchema.order_entry,
			eq(quantity_return.order_entry_uuid, zipperSchema.order_entry.uuid)
		)
		.leftJoin(
			viewScehma.v_order_details_full,
			eq(
				zipperSchema.order_entry.order_description_uuid,
				viewScehma.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			thread_order_entry,
			eq(quantity_return.thread_order_entry_uuid, thread_order_entry.uuid)
		)
		.leftJoin(
			threadSchema.count_length,
			eq(
				thread_order_entry.count_length_uuid,
				threadSchema.count_length.uuid
			)
		)
		.leftJoin(
			threadSchema.order_info,
			eq(thread_order_entry.order_info_uuid, threadSchema.order_info.uuid)
		)
		.leftJoin(challan, eq(quantity_return.challan_uuid, challan.uuid))
		.orderBy(desc(quantity_return.created_at));

	try {
		const data = await quantity_returnPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'quantity_return list',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const quantity_returnPromise = db
		.select({
			uuid: quantity_return.uuid,
			id: quantity_return.id,
			order_number: sql`
			CASE 
				WHEN quantity_return.order_entry_uuid IS NOT NULL 
				THEN v_order_details_full.order_number 
				ELSE CONCAT('ST', 
						CASE 
							WHEN order_info.is_sample = 1 THEN 'S' 
							ELSE '' 
						END, 
						TO_CHAR(order_info.created_at, 'YY'), '-', 
						LPAD(order_info.id::text, 4, '0')
					)
			END`,
			order_info_uuid: sql`
			CASE WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.order_info_uuid
				ELSE thread_order_entry.order_info_uuid
			END`,
			item_description: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.item_description
				ELSE null
			END`,
			order_description_uuid: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.order_description_uuid
				ELSE null
			END`,
			count: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN null ELSE CONCAT('"', thread.count_length.count) END`,
			length: threadSchema.count_length.length,
			count_length_uuid: threadSchema.count_length.uuid,
			count_length_name: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN null ELSE CONCAT('"', thread.count_length.count, ' - ', thread.count_length.length) END`,
			style: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.style ELSE thread_order_entry.style END`,
			color: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.color ELSE thread_order_entry.color END`,
			size: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.size ELSE null END`,
			quantity: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.quantity::float8 ELSE thread_order_entry.quantity::float8 END`,
			order_entry_uuid: quantity_return.order_entry_uuid,
			thread_order_entry_uuid: quantity_return.thread_order_entry_uuid,
			fresh_quantity: decimalToNumber(quantity_return.fresh_quantity),
			repair_quantity: decimalToNumber(quantity_return.repair_quantity),
			is_completed: quantity_return.is_completed,
			completed_date: quantity_return.completed_date,
			completed_by: quantity_return.completed_by,
			completed_by_name: completed_by_user.name,
			created_by: quantity_return.created_by,
			created_by_name: hrSchema.users.name,
			created_at: quantity_return.created_at,
			updated_at: quantity_return.updated_at,
			remarks: quantity_return.remarks,
			is_zipper: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN true
				ELSE false
			END`,
			challan_uuid: quantity_return.challan_uuid,
			challan_number: sql`
			CASE
				WHEN quantity_return.challan_uuid IS NULL
				THEN null
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN CONCAT('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 5, '0'))
				ELSE CONCAT('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 5, '0'))
			END`,
		})
		.from(quantity_return)
		.leftJoin(
			hrSchema.users,
			eq(quantity_return.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			completed_by_user,
			eq(quantity_return.completed_by, completed_by_user.uuid)
		)
		.leftJoin(
			zipperSchema.order_entry,
			eq(quantity_return.order_entry_uuid, zipperSchema.order_entry.uuid)
		)
		.leftJoin(
			viewScehma.v_order_details_full,
			eq(
				zipperSchema.order_entry.order_description_uuid,
				viewScehma.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			thread_order_entry,
			eq(quantity_return.thread_order_entry_uuid, thread_order_entry.uuid)
		)
		.leftJoin(
			threadSchema.count_length,
			eq(
				thread_order_entry.count_length_uuid,
				threadSchema.count_length.uuid
			)
		)
		.leftJoin(
			threadSchema.order_info,
			eq(thread_order_entry.order_info_uuid, threadSchema.order_info.uuid)
		)
		.leftJoin(challan, eq(quantity_return.challan_uuid, challan.uuid))
		.where(eq(quantity_return.uuid, req.params.uuid));

	try {
		const data = await quantity_returnPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'quantity_return',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectOrderEntryFullByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	const { challan_uuid } = req.query;

	const orderEntryPromise = db
		.select({
			order_entry_uuid: zipperSchema.order_entry.uuid,
			order_description_uuid:
				zipperSchema.order_entry.order_description_uuid,
			order_info_uuid: zipperSchema.order_description.order_info_uuid,
			item_description: viewScehma.v_order_details_full.item_description,
			style: zipperSchema.order_entry.style,
			color: zipperSchema.order_entry.color,
			size: zipperSchema.order_entry.size,
			is_inch: zipperSchema.order_description.is_inch,
			quantity: decimalToNumber(zipperSchema.order_entry.quantity),
			company_price: decimalToNumber(
				zipperSchema.order_entry.company_price
			),
			party_price: decimalToNumber(zipperSchema.order_entry.party_price),
			order_entry_status: zipperSchema.order_entry.status,
			swatch_status: zipperSchema.order_entry.swatch_status,
			swatch_approval_date: zipperSchema.order_entry.swatch_approval_date,
			bleaching: zipperSchema.order_entry.bleaching,
			created_at: zipperSchema.order_entry.created_at,
			updated_at: zipperSchema.order_entry.updated_at,
			total_warehouse_quantity: decimalToNumber(
				zipperSchema.sfg.warehouse
			),
			total_delivery_quantity: decimalToNumber(
				zipperSchema.sfg.delivered
			),
			total_reject_quantity: decimalToNumber(
				zipperSchema.sfg.reject_quantity
			),
			total_short_quantity: decimalToNumber(
				zipperSchema.sfg.short_quantity
			),
			index: zipperSchema.order_entry.index,
			fresh_quantity: sql`0`,
			repair_quantity: sql`0`,
		})
		.from(zipperSchema.order_entry)
		.leftJoin(
			zipperSchema.order_description,
			eq(
				zipperSchema.order_entry.order_description_uuid,
				zipperSchema.order_description.uuid
			)
		)
		.leftJoin(
			viewScehma.v_order_details_full,
			eq(
				zipperSchema.order_description.uuid,
				viewScehma.v_order_details_full.order_description_uuid
			)
		)
		.leftJoin(
			zipperSchema.sfg,
			eq(zipperSchema.order_entry.uuid, zipperSchema.sfg.order_entry_uuid)
		)
		.leftJoin(
			zipperSchema.finishing_batch_entry,
			eq(
				zipperSchema.sfg.uuid,
				zipperSchema.finishing_batch_entry.sfg_uuid
			)
		)
		.leftJoin(
			zipperSchema.finishing_batch_production,
			eq(
				zipperSchema.finishing_batch_entry.uuid,
				zipperSchema.finishing_batch_production
					.finishing_batch_entry_uuid
			)
		)
		.leftJoin(
			zipperSchema.dyeing_batch_entry,
			eq(zipperSchema.sfg.uuid, zipperSchema.dyeing_batch_entry.sfg_uuid)
		)
		.where(
			eq(zipperSchema.order_description.order_info_uuid, order_info_uuid)
		)
		.orderBy(asc(zipperSchema.order_entry.index));

	try {
		const data = await orderEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Entry Full',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntryByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	const { challan_uuid } = req.query;

	const resultPromise = db
		.select({
			uuid: threadSchema.order_entry.uuid,
			order_entry_uuid: threadSchema.order_entry.uuid,
			order_info_uuid: threadSchema.order_entry.order_info_uuid,
			lab_reference: threadSchema.order_entry.lab_reference,
			color: threadSchema.order_entry.color,
			recipe_uuid: threadSchema.order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: threadSchema.order_entry.po,
			style: threadSchema.order_entry.style,
			count_length_uuid: threadSchema.order_entry.count_length_uuid,
			count: threadSchema.count_length.count,
			length: threadSchema.count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			max_weight: threadSchema.count_length.max_weight,
			min_weight: threadSchema.count_length.min_weight,
			cone_per_carton: threadSchema.count_length.cone_per_carton,
			quantity: decimalToNumber(threadSchema.order_entry.quantity),
			company_price: decimalToNumber(
				threadSchema.order_entry.company_price
			),
			party_price: decimalToNumber(threadSchema.order_entry.party_price),
			swatch_approval_date: threadSchema.order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				threadSchema.order_entry.production_quantity
			),
			bleaching: threadSchema.order_entry.bleaching,
			transfer_quantity: decimalToNumber(
				threadSchema.order_entry.transfer_quantity
			),
			carton_quantity: decimalToNumber(
				threadSchema.order_entry.carton_quantity
			),
			created_by: threadSchema.order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: threadSchema.order_entry.created_at,
			updated_at: threadSchema.order_entry.updated_at,
			remarks: threadSchema.order_entry.remarks,
			pi: decimalToNumber(threadSchema.order_entry.pi),
			delivered: decimalToNumber(threadSchema.order_entry.delivered),
			warehouse: decimalToNumber(threadSchema.order_entry.warehouse),
			short_quantity: decimalToNumber(
				threadSchema.order_entry.short_quantity
			),
			reject_quantity: decimalToNumber(
				threadSchema.order_entry.reject_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				threadSchema.order_entry.production_quantity_in_kg
			),
			carton_quantity: threadSchema.order_entry.carton_quantity,
			index: threadSchema.order_entry.index,
			damage_quantity: decimalToNumber(
				threadSchema.order_entry.damage_quantity
			),
			fresh_quantity: sql`0`,
			repair_quantity: sql`0`,
		})
		.from(threadSchema.order_entry)
		.leftJoin(
			hrSchema.users,
			eq(threadSchema.order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(threadSchema.order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			threadSchema.count_length,
			eq(
				threadSchema.order_entry.count_length_uuid,
				threadSchema.count_length.uuid
			)
		)
		.where(eq(threadSchema.order_entry.order_info_uuid, order_info_uuid))
		.orderBy(asc(threadSchema.order_entry.index));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
