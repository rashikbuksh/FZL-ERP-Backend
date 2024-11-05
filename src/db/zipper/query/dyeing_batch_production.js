import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { dyeing_batch_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchProductionPromise = db
		.insert(dyeing_batch_production)
		.values(req.body)
		.returning({ insertedUuid: dyeing_batch_production.uuid });

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
		.update(dyeing_batch_production)
		.set(req.body)
		.where(eq(dyeing_batch_production.uuid, req.params.uuid))
		.returning({ updatedUuid: dyeing_batch_production.uuid });

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
		.delete(dyeing_batch_production)
		.where(eq(dyeing_batch_production.uuid, req.params.uuid))
		.returning({ deletedUuid: dyeing_batch_production.uuid });

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
			uuid: dyeing_batch_production.uuid,
			dyeing_batch_entry_uuid:
				dyeing_batch_production.dyeing_batch_entry_uuid,
			production_quantity: decimalToNumber(
				dyeing_batch_production.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				dyeing_batch_production.production_quantity_in_kg
			),
			created_by: dyeing_batch_production.created_by,
			created_name: hrSchema.users.name,
			created_at: dyeing_batch_production.created_at,
			updated_at: dyeing_batch_production.updated_at,
			remarks: dyeing_batch_production.remarks,
		})
		.from(dyeing_batch_production)
		.leftJoin(
			hrSchema.users,
			eq(dyeing_batch_production.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(dyeing_batch_production.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'dyeing_batch_production list',
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
			uuid: dyeing_batch_production.uuid,
			dyeing_batch_entry_uuid:
				dyeing_batch_production.dyeing_batch_entry_uuid,
			production_quantity: decimalToNumber(
				dyeing_batch_production.production_quantity
			),
			production_quantity_in_kg: decimalToNumber(
				dyeing_batch_production.production_quantity_in_kg
			),
			created_by: dyeing_batch_production.created_by,
			created_name: hrSchema.users.name,
			created_at: dyeing_batch_production.created_at,
			updated_at: dyeing_batch_production.updated_at,
			remarks: dyeing_batch_production.remarks,
		})
		.from(dyeing_batch_production)
		.leftJoin(
			hrSchema.users,
			eq(dyeing_batch_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(dyeing_batch_production.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch_production',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
