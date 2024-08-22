import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { tape_coil_to_dyeing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(tape_coil_to_dyeing)
		.values(req.body)
		.returning({ insertedId: tape_coil_to_dyeing.uuid });

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
		.update(tape_coil_to_dyeing)
		.set(req.body)
		.where(eq(tape_coil_to_dyeing.uuid, req.params.uuid))
		.returning({ updatedId: tape_coil_to_dyeing.uuid });

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
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(tape_coil_to_dyeing)
		.where(eq(tape_coil_to_dyeing.uuid, req.params.uuid))
		.returning({ deletedId: tape_coil_to_dyeing.uuid });

	try {
		const data = await resultPromise;

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
			uuid: tape_coil_to_dyeing.uuid,
			tape_coil_uuid: tape_coil_to_dyeing.tape_coil_uuid,
			order_description_uuid: tape_coil_to_dyeing.order_description_uuid,
			trx_quantity: tape_coil_to_dyeing.trx_quantity,
			created_by: tape_coil_to_dyeing.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_to_dyeing.created_at,
			updated_at: tape_coil_to_dyeing.updated_at,
			remarks: tape_coil_to_dyeing.remarks,
		})
		.from(tape_coil_to_dyeing)
		.leftJoin(
			hr.users,
			eq(tape_coil_to_dyeing.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'tape_coil_to_dyeing list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: tape_coil_to_dyeing.uuid,
			tape_coil_uuid: tape_coil_to_dyeing.tape_coil_uuid,
			order_description_uuid: tape_coil_to_dyeing.order_description_uuid,
			trx_quantity: tape_coil_to_dyeing.trx_quantity,
			created_by: tape_coil_to_dyeing.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil_to_dyeing.created_at,
			updated_at: tape_coil_to_dyeing.updated_at,
			remarks: tape_coil_to_dyeing.remarks,
		})
		.from(tape_coil_to_dyeing)
		.leftJoin(
			hr.users,
			eq(tape_coil_to_dyeing.created_by, hrSchema.users.uuid)
		)
		.where(eq(tape_coil_to_dyeing.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'tape_coil_to_dyeing',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
