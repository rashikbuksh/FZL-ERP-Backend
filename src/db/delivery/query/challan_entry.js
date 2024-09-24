import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { challan, challan_entry } from '../schema.js';

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
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(challan, eq(challan_entry.challan_uuid, challan.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
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
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(challan, eq(challan_entry.challan_uuid, challan.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
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

	const challan_entryPromise = db
		.select({
			uuid: challan_entry.uuid,
			challan_uuid: challan_entry.challan_uuid,
			challan_assign_to: challan.assign_to,
			challan_assign_to_name: assignToUser.name,
			challan_created_by: challan.created_by,
			challan_created_by_name: createdByUser.name,
			packing_list_uuid: challan_entry.packing_list_uuid,
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(challan, eq(challan_entry.challan_uuid, challan.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
		.where(eq(challan_entry.challan_uuid, req.params.challan_uuid));

	try {
		const data = await challan_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Challan_entry',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}
