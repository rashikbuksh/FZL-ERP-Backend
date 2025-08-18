import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { voucher_entry_cost_center, cost_center } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const veccPromise = db
		.insert(voucher_entry_cost_center)
		.values(req.body)
		.returning({ insertedIndex: voucher_entry_cost_center.index });

	try {
		const data = await veccPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Voucher Entry Cost Center #${data[0].insertedIndex} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const veccPromise = db
		.update(voucher_entry_cost_center)
		.set(req.body)
		.where(eq(voucher_entry_cost_center.uuid, req.params.uuid))
		.returning({ updatedIndex: voucher_entry_cost_center.index });

	try {
		const data = await veccPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `Voucher Entry Cost Center #${data[0].updatedIndex} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const veccPromise = db
		.delete(voucher_entry_cost_center)
		.where(eq(voucher_entry_cost_center.uuid, req.params.uuid))
		.returning({ deletedIndex: voucher_entry_cost_center.index });

	try {
		const data = await veccPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Voucher Entry Cost Center #${data[0].deletedIndex} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: voucher_entry_cost_center.uuid,
			index: voucher_entry_cost_center.index,
			voucher_entry_uuid: voucher_entry_cost_center.voucher_entry_uuid,
			cost_center_uuid: voucher_entry_cost_center.cost_center_uuid,
			cost_center_name: cost_center.name,
			created_by: voucher_entry_cost_center.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher_entry_cost_center.created_at,
			updated_by: voucher_entry_cost_center.updated_by,
			updated_at: voucher_entry_cost_center.updated_at,
			remarks: voucher_entry_cost_center.remarks,
		})
		.from(voucher_entry_cost_center)
		.leftJoin(
			cost_center,
			eq(voucher_entry_cost_center.cost_center_uuid, cost_center.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(voucher_entry_cost_center.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(voucher_entry_cost_center.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entry Cost Centers',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const veccPromise = db
		.select({
			uuid: voucher_entry_cost_center.uuid,
			index: voucher_entry_cost_center.index,
			voucher_entry_uuid: voucher_entry_cost_center.voucher_entry_uuid,
			cost_center_uuid: voucher_entry_cost_center.cost_center_uuid,
			cost_center_name: cost_center.name,
			created_by: voucher_entry_cost_center.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher_entry_cost_center.created_at,
			updated_by: voucher_entry_cost_center.updated_by,
			updated_at: voucher_entry_cost_center.updated_at,
			remarks: voucher_entry_cost_center.remarks,
		})
		.from(voucher_entry_cost_center)
		.leftJoin(
			cost_center,
			eq(voucher_entry_cost_center.cost_center_uuid, cost_center.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(voucher_entry_cost_center.created_by, hrSchema.users.uuid)
		)
		.where(eq(voucher_entry_cost_center.uuid, req.params.uuid));

	try {
		const data = await veccPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entry Cost Center',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
