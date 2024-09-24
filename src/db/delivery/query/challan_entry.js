import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import {
	challan,
	challan_entry,
	packing_list,
	packing_list_entry,
} from '../schema.js';

const assignToUser = alias(hrSchema.users, 'assignToUser');
const createdByUser = alias(hrSchema.users, 'createdByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.insert(challan_entry)
		.values(req.body)
		.returning({ insertedId: challan_entry.uuid });

	try {
		const data = await challan_entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.update(challan_entry)
		.set(req.body)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ updatedId: challan_entry.uuid });

	try {
		const data = await challan_entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.delete(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ deletedName: challan_entry.uuid });

	try {
		const data = await challan_entryPromise;
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
	const resultPromise = db
		.select({
			uuid: challan_entry.uuid,
			challan_uuid: challan_entry.challan_uuid,
			challan_assign_to: challan.assign_to,
			challan_assign_to_name: assignToUser.name,
			challan_created_by: challan.created_by,
			challan_created_by_name: createdByUser.name,
			packing_list_uuid: challan_entry.packing_list_uuid,
			packing_number: sql`concat('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(challan, eq(challan_entry.challan_uuid, challan.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
		.leftJoin(
			packing_list,
			eq(challan_entry.packing_list_uuid, packing_list.uuid)
		)
		.orderBy(desc(challan_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Challan_entry list',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challan_entryPromise = db
		.select({
			uuid: challan_entry.uuid,
			challan_uuid: challan_entry.challan_uuid,
			challan_assign_to: challan.assign_to,
			challan_assign_to_name: assignToUser.name,
			challan_created_by: challan.created_by,
			challan_created_by_name: createdByUser.name,
			packing_list_uuid: challan_entry.packing_list_uuid,
			packing_number: sql`concat('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(challan, eq(challan_entry.challan_uuid, challan.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
		.leftJoin(
			packing_list,
			eq(challan_entry.packing_list_uuid, packing_list.uuid)
		)
		.where(eq(challan_entry.uuid, req.params.uuid));

	try {
		const data = await challan_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Challan_entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectChallanEntryByChallanUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			challan_entry.uuid,
			challan_entry.challan_uuid,
			challan.assign_to AS challan_assign_to,
			assign_to_user.name AS challan_assign_to_name,
			challan.created_by AS challan_created_by,
			created_by_user.name AS challan_created_by_name,
			challan_entry.packing_list_uuid,
			CONCAT('PL', TO_CHAR(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) AS packing_number,
			challan_entry.created_at,
			challan_entry.updated_at,
			ple.uuid as packing_list_entry_uuid,
			CONCAT('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) as packing_number,
			ple.sfg_uuid,
			ple.quantity,
			ple.short_quantity,
			ple.reject_quantity,
			ple.remarks as remarks,
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			(oe.quantity - sfg.warehouse) as balance_quantity
		FROM 
			delivery.challan_entry
		LEFT JOIN 
			delivery.challan ON challan_entry.challan_uuid = challan.uuid
		LEFT JOIN 
			hr.users assign_to_user ON challan.assign_to = assign_to_user.uuid
		LEFT JOIN 
			hr.users created_by_user ON challan.created_by = created_by_user.uuid
		LEFT JOIN 
			delivery.packing_list pl ON challan_entry.packing_list_uuid = pl.uuid
		LEFT JOIN 
			delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
		LEFT JOIN 
			zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.order_description_uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE 
			challan_entry.challan_uuid = ${req.params.challan_uuid};
	`;

	const challan_entryPromise = db.execute(query);

	try {
		const data = await challan_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Challan_entry',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
