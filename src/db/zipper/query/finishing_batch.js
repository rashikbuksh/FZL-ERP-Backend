import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import * as hrSchema from '../../hr/schema.js';
import { finishing_batch } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchPromise = db
		.insert(finishing_batch)
		.values(req.body)
		.returning({ insertedUuid: finishing_batch.uuid });

	try {
		const data = await finishingBatchPromise;

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

	const finishingBatchPromise = db
		.update(finishing_batch)
		.set(req.body)
		.where(eq(finishing_batch.uuid, req.params.uuid))
		.returning({ updatedUuid: finishing_batch.uuid });

	console.log('finishingBatchPromise', await finishingBatchPromise);

	try {
		const data = await finishingBatchPromise;

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

	const finishingBatchPromise = db
		.delete(finishing_batch)
		.where(eq(finishing_batch.uuid, req.params.uuid))
		.returning({ deletedUuid: finishing_batch.uuid });

	try {
		const data = await finishingBatchPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchPromise = db
		.select({
			uuid: finishing_batch.uuid,
			id: finishing_batch.id,
			order_description_uuid: finishing_batch.order_description_uuid,
			slider_lead_time: finishing_batch.slider_lead_time,
			dyeing_lead_time: finishing_batch.dyeing_lead_time,
			status: finishing_batch.status,
			slider_finishing_stock: decimalToNumber(
				finishing_batch.slider_finishing_stock
			),
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
		})
		.from(finishing_batch)
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(finishing_batch.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'finishing_batch list',
	};

	handleResponse({ promise: finishingBatchPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchPromise = db
		.select({
			uuid: finishing_batch.uuid,
			id: finishing_batch.id,
			order_description_uuid: finishing_batch.order_description_uuid,
			slider_lead_time: finishing_batch.slider_lead_time,
			dyeing_lead_time: finishing_batch.dyeing_lead_time,
			status: finishing_batch.status,
			slider_finishing_stock: decimalToNumber(
				finishing_batch.slider_finishing_stock
			),
			created_by: finishing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch.created_at,
			updated_at: finishing_batch.updated_at,
			remarks: finishing_batch.remarks,
		})
		.from(finishing_batch)
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch.created_by, hrSchema.users.uuid)
		)
		.where(eq(finishing_batch.uuid, req.params.uuid));

	try {
		const data = await finishingBatchPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'finishing_batch',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
