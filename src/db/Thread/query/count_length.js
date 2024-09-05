import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { count_length } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(count_length)
		.values(req.body)
		.returning({
			insertedId: sql`concat(count_length.count, '-', count_length.length)`,
		});

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(count_length)
		.set(req.body)
		.where(eq(count_length.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat(count_length.count, '-', count_length.length)`,
		});

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const resultPromise = db
		.delete(count_length)
		.where(eq(count_length.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat(count_length.count, '-', count_length.length)`,
		});

	try {
		await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: 'deleted',
		};

		return await res.status(201).json({ toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: count_length.uuid,
			count: count_length.count,
			length: count_length.length,
			weight: count_length.weight,
			sst: count_length.sst,
			created_by: count_length.created_by,
			created_by_name: hrSchema.users.name,
			created_at: count_length.created_at,
			updated_at: count_length.updated_at,
			remarks: count_length.remarks,
		})
		.from(count_length)
		.leftJoin(
			hrSchema.users,
			eq(count_length.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'count_length list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: count_length.uuid,
			count: count_length.count,
			length: count_length.length,
			weight: count_length.weight,
			sst: count_length.sst,
			created_by: count_length.created_by,
			created_by_name: hrSchema.users.name,
			created_at: count_length.created_at,
			updated_at: count_length.updated_at,
			remarks: count_length.remarks,
		})
		.from(count_length)
		.leftJoin(
			hrSchema.users,
			eq(count_length.created_by, hrSchema.users.uuid)
		)
		.where(eq(count_length.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'count_length',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
