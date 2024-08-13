import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { packing_list } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.insert(packing_list)
		.values(req.body)
		.returning({ insertedId: packing_list.uuid });
	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.update(packing_list)
		.set(req.body)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({ updatedId: packing_list.uuid });

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.delete(packing_list)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({ deletedId: packing_list.uuid });

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'remove',
			message: `${data[0].deletedId} removed`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: packing_list.uuid,
			carton_size: packing_list.carton_size,
			carton_weight: packing_list.carton_weight,
			created_by: packing_list.created_by,
			created_by_name: hrSchema.users.name,
			created_at: packing_list.created_at,
			updated_at: packing_list.updated_at,
			remarks: packing_list.remarks,
		})
		.from(packing_list)
		.leftJoin(
			hrSchema.users,
			eq(packing_list.created_by, hrSchema.users.uuid)
		);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Packing list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.select({
			uuid: packing_list.uuid,
			carton_size: packing_list.carton_size,
			carton_weight: packing_list.carton_weight,
			created_by: packing_list.created_by,
			created_by_name: hrSchema.users.name,
			created_at: packing_list.created_at,
			updated_at: packing_list.updated_at,
			remarks: packing_list.remarks,
		})
		.from(packing_list)
		.leftJoin(
			hrSchema.users,
			eq(packing_list.created_by, hrSchema.users.uuid)
		)
		.where(eq(packing_list.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Packing list',
	};
	handleResponse({
		promise: packing_listPromise,
		res,
		next,
		...toast,
	});
}
