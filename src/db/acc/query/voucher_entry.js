import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { voucher_entry, ledger } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.insert(voucher_entry)
		.values(req.body)
		.returning({ insertedIndex: voucher_entry.index });

	try {
		const data = await entryPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Voucher Entry #${data[0].insertedIndex} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.update(voucher_entry)
		.set(req.body)
		.where(eq(voucher_entry.uuid, req.params.uuid))
		.returning({ updatedIndex: voucher_entry.index });

	try {
		const data = await entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `Voucher Entry #${data[0].updatedIndex} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.delete(voucher_entry)
		.where(eq(voucher_entry.uuid, req.params.uuid))
		.returning({ deletedIndex: voucher_entry.index });

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Voucher Entry #${data[0].deletedIndex} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: voucher_entry.uuid,
			index: voucher_entry.index,
			ledger_uuid: voucher_entry.ledger_uuid,
			ledger_name: ledger.name,
			type: voucher_entry.type,
			amount: voucher_entry.amount,
			is_need_cost_center: voucher_entry.is_need_cost_center,
			is_payment: voucher_entry.is_payment,
			description: voucher_entry.description,
			created_by: voucher_entry.created_by,
			created_by_name: createdByUser.name,
			created_at: voucher_entry.created_at,
			updated_by: voucher_entry.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: voucher_entry.updated_at,
			remarks: voucher_entry.remarks,
		})
		.from(voucher_entry)
		.leftJoin(ledger, eq(voucher_entry.ledger_uuid, ledger.uuid))
		.leftJoin(
			createdByUser,
			eq(voucher_entry.created_by, createdByUser.uuid)
		)
		.leftJoin(
			updatedByUser,
			eq(voucher_entry.updated_by, updatedByUser.uuid)
		)
		.orderBy(desc(voucher_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entries',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.select({
			uuid: voucher_entry.uuid,
			index: voucher_entry.index,
			ledger_uuid: voucher_entry.ledger_uuid,
			ledger_name: ledger.name,
			type: voucher_entry.type,
			amount: voucher_entry.amount,
			is_need_cost_center: voucher_entry.is_need_cost_center,
			is_payment: voucher_entry.is_payment,
			description: voucher_entry.description,
			created_by: voucher_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher_entry.created_at,
			updated_by: voucher_entry.updated_by,
			updated_at: voucher_entry.updated_at,
			remarks: voucher_entry.remarks,
		})
		.from(voucher_entry)
		.leftJoin(ledger, eq(voucher_entry.ledger_uuid, ledger.uuid))
		.leftJoin(
			hrSchema.users,
			eq(voucher_entry.created_by, hrSchema.users.uuid)
		)
		.where(eq(voucher_entry.uuid, req.params.uuid));

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entry',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
