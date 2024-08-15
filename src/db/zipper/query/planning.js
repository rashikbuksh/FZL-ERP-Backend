import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { planning } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchPromise = db
		.insert(planning)
		.values(req.body)
		.returning({ insertedUuid: planning.uuid });
	try {
		const data = await batchPromise;

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

	const batchPromise = db
		.update(planning)
		.set(req.body)
		.where(eq(planning.uuid, req.params.uuid))
		.returning({ updatedUuid: planning.uuid });

	try {
		const data = await batchPromise;
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

	const batchPromise = db
		.delete(planning)
		.where(eq(planning.uuid, req.params.uuid))
		.returning({ deletedUuid: planning.uuid });

	try {
		const data = await batchPromise;
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
			uuid: planning.uuid,
			week: planning.week,
			created_by: hrSchema.users.uuid,
			created_by_name: hrSchema.users.name,
			created_at: planning.created_at,
			updated_at: planning.updated_at,
			remarks: planning.remarks,
		})

		.from(planning)
		.leftJoin(hrSchema.users, eq(planning.created_by, hrSchema.users.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'planning list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: planning.uuid,
			week: planning.week,
			created_by: hrSchema.users.uuid,
			created_by_name: hrSchema.users.name,
			created_at: planning.created_at,
			updated_at: planning.updated_at,
			remarks: planning.remarks,
		})

		.from(planning)
		.leftJoin(hrSchema.users, eq(planning.created_by, hrSchema.users.uuid))
		.where(eq(planning.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'planning',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
