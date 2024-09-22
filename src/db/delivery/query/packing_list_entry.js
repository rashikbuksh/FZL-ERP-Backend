import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { packing_list_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.insert(packing_list_entry)
		.values(req.body)
		.returning({ insertedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			msg: `${data[0].insertedId} created`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.update(packing_list_entry)
		.set(req.body)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ updatedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			msg: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.delete(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ deletedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			msg: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const query = sql`
		SELECT 
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.quantity,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			oe.style,
			oe.color,
			oe.size,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			(oe.quantity - sfg.delivered) as balance_quantity
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'packing list entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.quantity,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			(oe.quantity - sfg.delivered) as balance_quantity
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE 
			ple.packing_list_uuid = ${req.params.uuid}
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;

	const packing_list_entryPromise = db.execute(query);

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListEntryByPackingListUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			ple.uuid,
			ple.packing_list_uuid,
			ple.sfg_uuid,
			ple.quantity,
			ple.created_at,
			ple.updated_at,
			ple.remarks,
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			(oe.quantity - sfg.delivered) as balance_quantity
		FROM 
			delivery.packing_list_entry ple
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE 
			ple.uuid = ${req.params.packing_list_uuid}
		ORDER BY
			ple.created_at, ple.uuid DESC
	`;

	const packing_list_entryPromise = db.execute(query);

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing_list_entry',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
