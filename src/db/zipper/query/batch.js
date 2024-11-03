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
	const query = sql`
		SELECT 
			batch.uuid,
			batch.id,
			concat('B', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_id,
			batch.batch_status,
			batch.machine_uuid,
			concat(public.machine.name, ' (', public.machine.min_capacity::float8, '-', public.machine.max_capacity::float8, ')') as machine_name,
			batch.slot,
			batch.received,
			batch.created_by,
			users.name as created_by_name,
			batch.created_at,
			batch.updated_at,
			batch.remarks,
			expected.total_quantity,
			expected.expected_kg,
			expected.order_numbers,
			expected.total_actual_production_quantity
		FROM zipper.batch
		LEFT JOIN hr.users ON batch.created_by = users.uuid
		LEFT JOIN public.machine ON batch.machine_uuid = public.machine.uuid
		LEFT JOIN (
			SELECT 
				ROUND(
					SUM(((
						(tcr.top + tcr.bottom + CASE 
						WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
						ELSE CAST(oe.size AS NUMERIC)
						END) * be.quantity::float8) /100) / tc.dyed_per_kg_meter::float8)::numeric
				, 3) as expected_kg, 
				be.batch_uuid, 
				jsonb_agg(DISTINCT vodf.order_number) as order_numbers, 
				SUM(be.quantity::float8) as total_quantity, 
				SUM(be.production_quantity_in_kg::float8) as total_actual_production_quantity
			FROM zipper.batch_entry be
				LEFT JOIN zipper.sfg ON be.sfg_uuid = zipper.sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				LEFT JOIN 
					zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid AND vodf.item = tcr.item_uuid 
					AND vodf.zipper_number = tcr.zipper_number_uuid 
					AND vodf.end_type = tcr.end_type_uuid
				LEFT JOIN
					zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid AND vodf.item = tc.item_uuid AND vodf.zipper_number = tc.zipper_number_uuid 
			WHERE CASE WHEN lower(vodf.item_name) = 'nylon' THEN vodf.nylon_stopper = tcr.nylon_stopper_uuid ELSE TRUE END
			GROUP BY be.batch_uuid
		) AS expected ON batch.uuid = expected.batch_uuid
		ORDER BY batch.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch list',
		};
		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		handleError({ error, res });
	}
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
