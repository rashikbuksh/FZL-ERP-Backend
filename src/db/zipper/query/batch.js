import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { batch } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchPromise = db
		.insert(batch)
		.values(req.body)
		.returning({
			insertedUuid: sql`concat('B', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		});
	try {
		const data = await batchPromise;

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

	const batchPromise = db
		.update(batch)
		.set(req.body)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({ updatedUuid: batch.uuid });

	try {
		const data = await batchPromise;
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

	const batchPromise = db
		.delete(batch)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({
			deletedUuid: sql`concat('B', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		});

	try {
		const data = await batchPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch.uuid,
			id: batch.id,
			batch_id: sql`concat('B', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
			batch_status: batch.batch_status,
			machine_uuid: batch.machine_uuid,
			machine_name: sql`concat(public.machine.name, '(', public.machine.min_capacity::float8, '-', public.machine.max_capacity::float8, ')')`,
			slot: batch.slot,
			received: batch.received,
			created_by: batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch.created_at,
			updated_at: batch.updated_at,
			remarks: batch.remarks,
		})
		.from(batch)
		.leftJoin(hrSchema.users, eq(batch.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.machine,
			eq(batch.machine_uuid, publicSchema.machine.uuid)
		)
		.orderBy(desc(batch.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'batch list',
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

	const batchPromise = db
		.select({
			uuid: batch.uuid,
			id: batch.id,
			batch_id: sql`concat('B', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
			batch_status: batch.batch_status,
			machine_uuid: batch.machine_uuid,
			machine_name: publicSchema.machine.name,
			slot: batch.slot,
			received: batch.received,
			created_by: batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch.created_at,
			updated_at: batch.updated_at,
			remarks: batch.remarks,
		})
		.from(batch)
		.leftJoin(hrSchema.users, eq(batch.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.machine,
			eq(batch.machine_uuid, publicSchema.machine.uuid)
		)
		.where(eq(batch.uuid, req.params.uuid));

	try {
		const data = await batchPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch detail',
		};
		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectBatchDetailsByBatchUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { batch_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${batch_uuid}`)
				.then((response) => response);

		const [batch, batch_entry] = await Promise.all([
			fetchData('/zipper/batch'),
			fetchData('/zipper/batch-entry/by/batch-uuid'),
		]);

		const response = {
			...batch?.data?.data,
			batch_entry: batch_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Batch Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
