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
	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.type,
			tape_coil.zipper_number,
			concat(tape_coil.type, ' - ', tape_coil.zipper_number) AS type_of_zipper
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.type,
			tape_coil.zipper_number,
			concat(tape_coil.type, ' - ', tape_coil.zipper_number) AS type_of_zipper
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
		WHERE
			tape_coil_to_dyeing.uuid = ${req.params.uuid}
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
