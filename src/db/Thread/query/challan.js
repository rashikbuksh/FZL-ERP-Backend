import { eq, desc } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { challan } from '../schema.js';
import * as hrSchema from '../../hr/schema.js';
export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(challan)
		.values(req.body)
		.returning({ insertedId: challan.uuid });

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
		.update(challan)
		.set(req.body)
		.where(eq(challan.uuid, req.params.uuid))
		.returning({ updatedId: challan.uuid });

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
		.delete(challan)
		.where(eq(challan.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: challan.uuid,
			order_info_uuid: challan.order_info_uuid,
			carton_quantity: challan.carton_quantity,
			created_by: challan.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(hrSchema.users, eq(challan.created_by, hrSchema.users.uuid))
		.orderBy(desc(challan.created_at));

	const toast = {
		status: 200,
		type: 'select all',
		message: 'challan list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: challan.uuid,
			order_info_uuid: challan.order_info_uuid,
			carton_quantity: challan.carton_quantity,
			created_by: challan.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(hrSchema.users, eq(challan.created_by, hrSchema.users.uuid))
		.where(eq(challan.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
