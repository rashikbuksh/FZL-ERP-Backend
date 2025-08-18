import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { group, head, ledger } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.insert(ledger)
		.values(req.body)
		.returning({ insertedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.update(ledger)
		.set(req.body)
		.where(eq(ledger.uuid, req.params.uuid))
		.returning({ updatedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ledgerPromise = db
		.delete(ledger)
		.where(eq(ledger.uuid, req.params.uuid))
		.returning({ deletedName: ledger.name });

	try {
		const data = await ledgerPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: ledger.uuid,
			id: ledger.id,
			table_name: ledger.table_name,
			table_uuid: ledger.table_uuid,
			name: ledger.name,
			category: ledger.category,
			account_no: ledger.account_no,
			type: ledger.type,
			is_active: ledger.is_active,
			restrictions: ledger.restrictions,
			group_uuid: ledger.group_uuid,
			group_name: group.name,
			head_uuid: group.head_uuid,
			head_name: head.name,
			vat_deduction: ledger.vat_deduction,
			tax_deduction: ledger.tax_deduction,
			old_ledger_id: ledger.old_ledger_id,
			created_by: ledger.created_by,
			created_by_name: hrSchema.users.name,
			created_at: ledger.created_at,
			updated_by: ledger.updated_by,
			updated_at: ledger.updated_at,
			remarks: ledger.remarks,
		})
		.from(ledger)
		.leftJoin(group, eq(ledger.group_uuid, group.uuid))
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(ledger.created_by, hrSchema.users.uuid))
		.orderBy(desc(ledger.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Groups',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const groupPromise = db
		.select({
			uuid: ledger.uuid,
			id: ledger.id,
			table_name: ledger.table_name,
			table_uuid: ledger.table_uuid,
			name: ledger.name,
			category: ledger.category,
			account_no: ledger.account_no,
			type: ledger.type,
			is_active: ledger.is_active,
			restrictions: ledger.restrictions,
			group_uuid: ledger.group_uuid,
			group_name: group.name,
			head_uuid: group.head_uuid,
			head_name: head.name,
			vat_deduction: ledger.vat_deduction,
			tax_deduction: ledger.tax_deduction,
			old_ledger_id: ledger.old_ledger_id,
			created_by: ledger.created_by,
			created_by_name: hrSchema.users.name,
			created_at: ledger.created_at,
			updated_by: ledger.updated_by,
			updated_at: ledger.updated_at,
			remarks: ledger.remarks,
		})
		.from(ledger)
		.leftJoin(group, eq(ledger.group_uuid, group.uuid))
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(ledger.created_by, hrSchema.users.uuid))
		.where(eq(group.uuid, req.params.uuid));

	try {
		const data = await groupPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Group',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
