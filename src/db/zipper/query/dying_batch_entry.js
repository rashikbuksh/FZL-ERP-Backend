import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { dying_batch_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.insert(dying_batch_entry)
		.values(req.body)
		.returning({ insertedId: dying_batch_entry.uuid });

	try {
		const data = await dyingBatchEntryPromise;
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

	const dyingBatchEntryPromise = db
		.update(dying_batch_entry)
		.set(req.body)
		.where(eq(dying_batch_entry.uuid, req.params.uuid))
		.returning({ updatedId: dying_batch_entry.uuid });

	try {
		const data = await dyingBatchEntryPromise;
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

	const dyingBatchEntryPromise = db
		.delete(dying_batch_entry)
		.where(eq(dying_batch_entry.uuid, req.params.uuid))
		.returning({ deletedId: dying_batch_entry.uuid });

	try {
		const data = await dyingBatchEntryPromise;
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
		.select()
		.from(dying_batch_entry)
		.orderBy(desc(dying_batch_entry.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'dying_batch_entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyingBatchEntryPromise = db
		.select()
		.from(dying_batch_entry)
		.where(eq(dying_batch_entry.uuid, req.params.uuid));

	try {
		const data = await dyingBatchEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `${data[0].uuid} selected`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}
