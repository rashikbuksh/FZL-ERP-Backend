import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db.insert(type).values(req.body).returning({
		insertedId: type.name,
	});
	try {
		const data = await typePromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.update(type)
		.set(req.body)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ updatedName: type.name });

	try {
		const data = await typePromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.delete(type)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ deletedName: type.name });

	try {
		const data = await typePromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(type);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Type list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.select()
		.from(type)
		.where(eq(type.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Type',
	};

	handleResponse({ promise: typePromise, res, next, ...toast });
}
