import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { pi_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.insert(pi_entry)
		.values(req.body)
		.returning({ insertId: pi_entry.uuid });
	try {
		const data = await pi_entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piEntryPromise = db
		.update(pi_entry)
		.set(req.body)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning({ updatedId: pi_entry.uuid });

	try {
		const data = await piEntryPromise;
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
	if (!(await validateRequest(req, next))) return;

	const piEntryPromise = db
		.delete(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid))
		.returning({ deletedId: pi_entry.uuid });

	try {
		const data = await piEntryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: pi_entry.uuid,
			pi_uuid: pi_entry.pi_uuid,
			sfg_uuid: pi_entry.sfg_uuid,
			pi_quantity: pi_entry.pi_quantity,
			created_at: pi_entry.created_at,
			updated_at: pi_entry.updated_at,
			remarks: pi_entry.remarks,
		})
		.from(pi_entry)
		.orderBy(pi_entry.created_at, 'desc');

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'pi_entry list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.select({
			uuid: pi_entry.uuid,
			pi_uuid: pi_entry.pi_uuid,
			sfg_uuid: pi_entry.sfg_uuid,
			pi_quantity: pi_entry.pi_quantity,
			created_at: pi_entry.created_at,
			updated_at: pi_entry.updated_at,
			remarks: pi_entry.remarks,
		})
		.from(pi_entry)
		.where(eq(pi_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'pi_entry',
	};
	handleResponse({
		promise: pi_entryPromise,
		res,
		next,
		...toast,
	});
}
