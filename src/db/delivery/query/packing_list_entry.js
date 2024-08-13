import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { packing_list_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.insert(packing_list_entry)
		.values(req.body)
		.returning({ insertedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			msg: `${data[0].insertedId} created`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.update(packing_list_entry)
		.set(req.body)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ updatedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			msg: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.delete(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid))
		.returning({ deletedId: packing_list_entry.uuid });

	try {
		const data = await packing_list_entryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			msg: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(packing_list_entry);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Packing_list_entry list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_list_entryPromise = db
		.select()
		.from(packing_list_entry)
		.where(eq(packing_list_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Packing_list_entry',
	};
	handleResponse({ promise: packing_list_entryPromise, res, next, ...toast });
}
