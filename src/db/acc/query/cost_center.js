import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { cost_center, ledger } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ccPromise = db
		.insert(cost_center)
		.values(req.body)
		.returning({ insertedName: cost_center.name });

	try {
		const data = await ccPromise;
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

	const ccPromise = db
		.update(cost_center)
		.set(req.body)
		.where(eq(cost_center.uuid, req.params.uuid))
		.returning({ updatedName: cost_center.name });

	try {
		const data = await ccPromise;
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

	const ccPromise = db
		.delete(cost_center)
		.where(eq(cost_center.uuid, req.params.uuid))
		.returning({ deletedName: cost_center.name });

	try {
		const data = await ccPromise;
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
			uuid: cost_center.uuid,
			name: cost_center.name,
			ledger_uuid: cost_center.ledger_uuid,
			ledger_name: ledger.name,
			table_name: cost_center.table_name,
			table_uuid: cost_center.table_uuid,
			invoice_no: cost_center.invoice_no,
			created_by: cost_center.created_by,
			created_by_name: createdByUser.name,
			created_at: cost_center.created_at,
			updated_by: cost_center.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: cost_center.updated_at,
			remarks: cost_center.remarks,
		})
		.from(cost_center)
		.leftJoin(ledger, eq(cost_center.ledger_uuid, ledger.uuid))
		.leftJoin(createdByUser, eq(cost_center.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(cost_center.updated_by, updatedByUser.uuid))
		.orderBy(desc(cost_center.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Cost Centers',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const ccPromise = db
		.select({
			uuid: cost_center.uuid,
			name: cost_center.name,
			ledger_uuid: cost_center.ledger_uuid,
			ledger_name: ledger.name,
			table_name: cost_center.table_name,
			table_uuid: cost_center.table_uuid,
			invoice_no: cost_center.invoice_no,
			created_by: cost_center.created_by,
			created_by_name: createdByUser.name,
			created_at: cost_center.created_at,
			updated_by: cost_center.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: cost_center.updated_at,
			remarks: cost_center.remarks,
		})
		.from(cost_center)
		.leftJoin(ledger, eq(cost_center.ledger_uuid, ledger.uuid))
		.leftJoin(createdByUser, eq(cost_center.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(cost_center.updated_by, updatedByUser.uuid))
		.where(eq(cost_center.uuid, req.params.uuid));

	try {
		const data = await ccPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Cost Center',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
