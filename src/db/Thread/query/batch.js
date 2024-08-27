import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { batch, machine } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch)
		.values(req.body)
		.returning({
			insertedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		});

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
		.update(batch)
		.set(req.body)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		});

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
		.delete(batch)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		});

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
			uuid: batch.uuid,
			id: batch.id,
			batch_id: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
			machine_uuid: batch.machine_uuid,
			dyeing_operator: batch.dyeing_operator,
			reason: batch.reason,
			category: batch.category,
			status: batch.status,
			pass_by: batch.pass_by,
			shift: batch.shift,
			yarn_quantity: batch.yarn_quantity,
			dyeing_supervisor: batch.dyeing_supervisor,
			is_dyeing_complete: batch.is_dyeing_complete,
			coning_operator: batch.coning_operator,
			coning_supervisor: batch.coning_supervisor,
			coning_machines: batch.coning_machines,
			created_by: batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch.created_at,
			updated_at: batch.updated_at,
			remarks: batch.remarks,
		})
		.from(batch)
		.leftJoin(hrSchema.users, eq(batch.created_by, hrSchema.users.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'batch list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch.uuid,
			id: batch.id,
			batch_id: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
			machine_uuid: batch.machine_uuid,
			dyeing_operator: batch.dyeing_operator,
			reason: batch.reason,
			category: batch.category,
			status: batch.status,
			pass_by: batch.pass_by,
			shift: batch.shift,
			yarn_quantity: batch.yarn_quantity,
			dyeing_supervisor: batch.dyeing_supervisor,
			is_dyeing_complete: batch.is_dyeing_complete,
			coning_operator: batch.coning_operator,
			coning_supervisor: batch.coning_supervisor,
			coning_machines: batch.coning_machines,
			created_by: batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch.created_at,
			updated_at: batch.updated_at,
			remarks: batch.remarks,
		})
		.from(batch)
		.where(eq(batch.uuid, req.params.uuid))
		.leftJoin(hrSchema.users, eq(batch.created_by, hrSchema.users.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'batch detail',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function selectBatchDetailsByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const api = await createApi(req);

		const { batch_uuid } = req.params;

		const fetchData = async (endpoint) =>
			await api.get(`/thread/${endpoint}/${batch_uuid}`);

		const [batch, batch_entry] = await Promise.all([
			fetchData('batch'),
			fetchData('batch-entry/by'),
		]);

		const response = {
			...batch?.data?.data[0],
			batch_entry: batch_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'batch',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
