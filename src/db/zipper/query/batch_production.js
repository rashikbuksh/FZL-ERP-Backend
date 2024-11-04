import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { batch_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchProductionPromise = db
		.insert(batch_production)
		.values(req.body)
		.returning({ insertedUuid: batch_production.uuid });

	try {
		const data = await batchProductionPromise;

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

	const batchProductionPromise = db
		.update(batch_production)
		.set(req.body)
		.where(eq(batch_production.uuid, req.params.uuid))
		.returning({ updatedUuid: batch_production.uuid });

	try {
		const data = await batchProductionPromise;
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

	const batchProductionPromise = db
		.delete(batch_production)
		.where(eq(batch_production.uuid, req.params.uuid))
		.returning({ deletedUuid: batch_production.uuid });

	try {
		const data = await batchProductionPromise;
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
	const resultPromise = db
		.select({
			uuid: batch_production.uuid,
			dyeing_batch_entry_uuid: batch_production.dyeing_batch_entry_uuid,
			production_quantity: decimalToNumber(
				batch_production.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				batch_production.production_quantity_in_kg
			),
			created_by: batch_production.created_by,
			created_name: hrSchema.users.name,
			created_at: batch_production.created_at,
			updated_at: batch_production.updated_at,
			remarks: batch_production.remarks,
		})
		.from(batch_production)
		.leftJoin(
			hrSchema.users,
			eq(batch_production.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(batch_production.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'batch_production list',
	};

	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_production.uuid,
			dyeing_batch_entry_uuid: batch_production.dyeing_batch_entry_uuid,
			production_quantity: decimalToNumber(
				batch_production.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				batch_production.production_quantity_in_kg
			),
			created_by: batch_production.created_by,
			created_name: hrSchema.users.name,
			created_at: batch_production.created_at,
			updated_at: batch_production.updated_at,
			remarks: batch_production.remarks,
		})
		.from(batch_production)
		.leftJoin(
			hrSchema.users,
			eq(batch_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(batch_production.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_production',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
