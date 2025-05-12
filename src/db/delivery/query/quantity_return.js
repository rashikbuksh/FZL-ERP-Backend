import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { alias } from 'drizzle-orm/pg-core';
import { quantity_return } from '../schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import * as viewScehma from '../../view/schema.js';
import * as threadSchema from '../../thread/schema.js';
import { decimalToNumber } from '../../variables.js';

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
			message: `${data[0].insertedName} inserted`,
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
			item_description: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.item_description
				ELSE null
			END`,
			count: sql`CONCAT('"', thread.count_length.count)`,
			length: threadSchema.count_length.length,
			style: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.style ELSE thread_order_entry.style END`,
			color: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.color ELSE thread_order_entry.color END`,
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
			item_description: sql`
			CASE
				WHEN quantity_return.order_entry_uuid IS NOT NULL
				THEN v_order_details_full.item_description
				ELSE null
			END`,
			count: sql`CONCAT('"', thread.count_length.count)`,
			length: threadSchema.count_length.length,
			style: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.style ELSE thread_order_entry.style END`,
			color: sql`CASE WHEN quantity_return.order_entry_uuid IS NOT NULL THEN zipper.order_entry.color ELSE thread_order_entry.color END`,
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
