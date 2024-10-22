import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

import { multi_color_tape_receive } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchProductionPromise = db
		.insert(multi_color_tape_receive)
		.values(req.body)
		.returning({ insertedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;

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

	const batchProductionPromise = db
		.update(multi_color_tape_receive)
		.set(req.body)
		.where(eq(multi_color_tape_receive.uuid, req.params.uuid))
		.returning({ updatedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;
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

	const batchProductionPromise = db
		.delete(multi_color_tape_receive)
		.where(eq(multi_color_tape_receive.uuid, req.params.uuid))
		.returning({ deletedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: multi_color_tape_receive.uuid,
			order_description_uuid:
				multi_color_tape_receive.order_description_uuid,
			quantity: decimalToNumber(multi_color_tape_receive.quantity),
			created_by: multi_color_tape_receive.created_by,
			created_by_name: hrSchema.users.name,
			created_at: multi_color_tape_receive.created_at,
			updated_at: multi_color_tape_receive.updated_at,
			remarks: multi_color_tape_receive.remarks,
		})
		.from(multi_color_tape_receive)
		.leftJoin(
			hrSchema.users,
			eq(multi_color_tape_receive.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(multi_color_tape_receive.created_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Multi color tape receive',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: multi_color_tape_receive.uuid,
			order_description_uuid:
				multi_color_tape_receive.order_description_uuid,
			quantity: decimalToNumber(multi_color_tape_receive.quantity),
			created_by: multi_color_tape_receive.created_by,
			created_by_name: hrSchema.users.name,
			created_at: multi_color_tape_receive.created_at,
			updated_at: multi_color_tape_receive.updated_at,
			remarks: multi_color_tape_receive.remarks,
		})
		.from(multi_color_tape_receive)
		.leftJoin(
			hrSchema.users,
			eq(multi_color_tape_receive.created_by, hrSchema.users.uuid)
		)
		.where(eq(multi_color_tape_receive.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Multi color tape receive selected',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
