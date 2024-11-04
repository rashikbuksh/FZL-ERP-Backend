import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import * as hrSchema from '../../hr/schema.js';

import { finishing_batch_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.insert(finishing_batch_entry)
		.values(req.body)
		.returning({ insertedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.update(finishing_batch_entry)
		.set(req.body)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.delete(finishing_batch_entry)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: finishing_batch_entry.uuid });

	try {
		const data = await finishingBatchEntryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const finishingBatchEntryPromise = db
		.select({
			uuid: finishing_batch_entry.uuid,
			finishing_batch_uuid: finishing_batch_entry.finishing_batch_uuid,
			sfg_uuid: finishing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(finishing_batch_entry.quantity),
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_entry.dyed_tape_used_in_kg
			),
			teeth_molding_prod: decimalToNumber(
				finishing_batch_entry.teeth_molding_prod
			),
			teeth_coloring_stock: decimalToNumber(
				finishing_batch_entry.teeth_coloring_stock
			),
			finishing_stock: decimalToNumber(
				finishing_batch_entry.finishing_stock
			),
			finishing_prod: decimalToNumber(
				finishing_batch_entry.finishing_prod
			),
			warehouse: decimalToNumber(finishing_batch_entry.warehouse),
			created_by: finishing_batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_entry.created_at,
			updated_at: finishing_batch_entry.updated_at,
			remarks: finishing_batch_entry.remarks,
		})
		.from(finishing_batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, finishing_batch_entry.created_by)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'finishing_batch_entry list',
	};

	handleResponse({
		promise: finishingBatchEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchEntryPromise = db
		.select({
			uuid: finishing_batch_entry.uuid,
			finishing_batch_uuid: finishing_batch_entry.finishing_batch_uuid,
			sfg_uuid: finishing_batch_entry.sfg_uuid,
			quantity: decimalToNumber(finishing_batch_entry.quantity),
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_entry.dyed_tape_used_in_kg
			),
			teeth_molding_prod: decimalToNumber(
				finishing_batch_entry.teeth_molding_prod
			),
			teeth_coloring_stock: decimalToNumber(
				finishing_batch_entry.teeth_coloring_stock
			),
			finishing_stock: decimalToNumber(
				finishing_batch_entry.finishing_stock
			),
			finishing_prod: decimalToNumber(
				finishing_batch_entry.finishing_prod
			),
			warehouse: decimalToNumber(finishing_batch_entry.warehouse),
			created_by: finishing_batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_entry.created_at,
			updated_at: finishing_batch_entry.updated_at,
			remarks: finishing_batch_entry.remarks,
		})
		.from(finishing_batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, finishing_batch_entry.created_by)
		)
		.where(eq(finishing_batch_entry.uuid, req.params.uuid));

	try {
		const data = await finishingBatchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch_entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
