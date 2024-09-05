import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { dying_batch } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.insert(dying_batch)
		.values(req.body)
		.returning({ insertedId: dying_batch.uuid });

	try {
		const data = await dyingBatchPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.update(dying_batch)
		.set(req.body)
		.where(eq(dying_batch.uuid, req.params.uuid))
		.returning({ updatedId: dying_batch.uuid });
	try {
		const data = await dyingBatchPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.delete(dying_batch)
		.where(eq(dying_batch.uuid, req.params.uuid))
		.returning({ deletedId: dying_batch.uuid });

	try {
		const data = await dyingBatchPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: dying_batch.uuid,
			id: dying_batch.id,
			mc_no: dying_batch.mc_no,
			created_by: dying_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dying_batch.created_at,
			updated_at: dying_batch.updated_at,
		})
		.from(dying_batch)
		.leftJoin(
			hrSchema.users,
			eq(dying_batch.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'dying_batch list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchPromise = db
		.select({
			uuid: dying_batch.uuid,
			id: dying_batch.id,
			mc_no: dying_batch.mc_no,
			created_by: dying_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dying_batch.created_at,
			updated_at: dying_batch.updated_at,
		})
		.from(dying_batch)
		.leftJoin(
			hrSchema.users,
			eq(dying_batch.created_by, hrSchema.users.uuid)
		)
		.where(eq(dying_batch.uuid, req.params.uuid));

	try {
		const data = await dyingBatchPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dying_batch',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
