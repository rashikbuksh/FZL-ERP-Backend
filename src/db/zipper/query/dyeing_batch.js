import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { dyeing_batch, order_info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchPromise = db
		.insert(dyeing_batch)
		.values(req.body)
		.returning({
			insertedUuid: sql`concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0'))`,
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
		.update(dyeing_batch)
		.set(req.body)
		.where(eq(dyeing_batch.uuid, req.params.uuid))
		.returning({ updatedUuid: dyeing_batch.uuid });

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
		.delete(dyeing_batch)
		.where(eq(dyeing_batch.uuid, req.params.uuid))
		.returning({
			deletedUuid: sql`concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0'))`,
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
	const { type } = req.query;
	const query = sql`
		SELECT 
			dyeing_batch.uuid,
			dyeing_batch.id,
			concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0')) as batch_id,
			dyeing_batch.batch_status,
			dyeing_batch.machine_uuid,
			concat(public.machine.name, ' (', public.machine.min_capacity::float8, '-', public.machine.max_capacity::float8, ')') as machine_name,
			dyeing_batch.slot,
			dyeing_batch.received,
			dyeing_batch.received_date,
			dyeing_batch.created_by,
			users.name as created_by_name,
			dyeing_batch.created_at,
			dyeing_batch.updated_at,
			dyeing_batch.remarks,
			expected.total_quantity::float8,
			expected.expected_kg::float8,
			expected.order_numbers,
			ROUND(expected.total_actual_production_quantity::numeric, 3)::float8 AS total_actual_production_quantity,
			dyeing_batch.production_date::date as production_date,
			expected.party_name,
			oe_colors.item_descriptions as item_descriptions,
			oe_colors.colors as color,
			oe_colors.color_refs as color_refs,
			oe_colors.styles as style,
			dyeing_batch.batch_type as batch_type,
			dyeing_batch.order_info_uuid,
			machine.water_capacity::float8 as water_capacity
		FROM zipper.dyeing_batch
		LEFT JOIN hr.users ON dyeing_batch.created_by = users.uuid
		LEFT JOIN public.machine ON dyeing_batch.machine_uuid = public.machine.uuid
		LEFT JOIN zipper.v_order_details_full vodf ON dyeing_batch.order_info_uuid = vodf.order_info_uuid
		LEFT JOIN zipper.dyeing_batch_entry ON dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
		LEFT JOIN zipper.sfg ON dyeing_batch_entry.sfg_uuid = zipper.sfg.uuid
		LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
		LEFT JOIN (
			SELECT 
				ARRAY_AGG(DISTINCT vodf.item_description) as item_descriptions,
				ARRAY_AGG(DISTINCT order_entry.style) as styles,
				ARRAY_AGG(DISTINCT order_entry.color) as colors,
				ARRAY_AGG(DISTINCT order_entry.color_ref) as color_refs,
				MAX(order_entry.bulk_approval_date) as bulk_approval_date,
				dyeing_batch.uuid
			FROM zipper.order_entry
			LEFT JOIN zipper.sfg ON order_entry.uuid = sfg.order_entry_uuid
			LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
			LEFT JOIN zipper.dyeing_batch_entry on dyeing_batch_entry.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.dyeing_batch on dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
			GROUP BY dyeing_batch.uuid
		) AS oe_colors ON dyeing_batch.uuid = oe_colors.uuid
		LEFT JOIN (
			SELECT 
				ROUND(
					SUM((
						CASE 
							WHEN vodf.order_type = 'tape' 
								THEN ((tcr.top + tcr.bottom + be.quantity) * 1) / 100 / tcr.dyed_mtr_per_kg::float8
							ELSE ((tcr.top + tcr.bottom + CASE 
									WHEN vodf.is_inch = 1 
										THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
									ELSE CAST(oe.size AS NUMERIC)
									END) * be.quantity::float8) / 100 / tcr.dyed_mtr_per_kg::float8
						END
				)::numeric), 3) as expected_kg, 
				be.dyeing_batch_uuid, 
				jsonb_agg(DISTINCT vodf.order_number) as order_numbers, 
				jsonb_agg(DISTINCT vodf.party_name) as party_name,
				SUM(be.quantity::float8) as total_quantity, 
				SUM(be.production_quantity_in_kg::float8) as total_actual_production_quantity
			FROM zipper.dyeing_batch_entry be
				LEFT JOIN zipper.sfg ON be.sfg_uuid = zipper.sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				LEFT JOIN 
					zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid AND vodf.item = tcr.item_uuid 
					AND vodf.zipper_number = tcr.zipper_number_uuid 
					AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
				LEFT JOIN
					zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid
			WHERE 
						lower(vodf.item_name) != 'nylon' 
						OR vodf.nylon_stopper = tcr.nylon_stopper_uuid

			GROUP BY be.dyeing_batch_uuid
		) AS expected ON dyeing_batch.uuid = expected.dyeing_batch_uuid
		WHERE ${
			type === 'pending'
				? sql`dyeing_batch.received = 0`
				: type === 'completed'
					? sql`dyeing_batch.received = 1`
					: sql`1 = 1`
		}
		AND expected.order_numbers IS NOT NULL
		GROUP BY dyeing_batch.uuid, public.machine.name, public.machine.min_capacity, public.machine.max_capacity, users.name, expected.total_quantity, expected.expected_kg, expected.order_numbers, expected.total_actual_production_quantity, expected.party_name, oe_colors.colors, oe_colors.styles, machine.water_capacity, oe_colors.color_refs
		ORDER BY expected.order_numbers DESC, dyeing_batch.id DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch list',
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
			uuid: dyeing_batch.uuid,
			id: dyeing_batch.id,
			batch_id: sql`concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0'))`,
			batch_status: dyeing_batch.batch_status,
			machine_uuid: dyeing_batch.machine_uuid,
			machine_name: publicSchema.machine.name,
			slot: dyeing_batch.slot,
			received: dyeing_batch.received,
			received_date: dyeing_batch.received_date,
			created_by: dyeing_batch.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dyeing_batch.created_at,
			updated_at: dyeing_batch.updated_at,
			remarks: dyeing_batch.remarks,
			production_date: sql`dyeing_batch.production_date::date`,
			batch_type: dyeing_batch.batch_type,
			order_info_uuid: dyeing_batch.order_info_uuid,
			order_number: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			water_capacity: decimalToNumber(
				publicSchema.machine.water_capacity
			),
		})
		.from(dyeing_batch)
		.leftJoin(
			hrSchema.users,
			eq(dyeing_batch.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			publicSchema.machine,
			eq(dyeing_batch.machine_uuid, publicSchema.machine.uuid)
		)
		.leftJoin(order_info, eq(dyeing_batch.order_info_uuid, order_info.uuid))
		.where(eq(dyeing_batch.uuid, req.params.uuid));

	try {
		const data = await batchPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch detail',
		};
		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectBatchDetailsByBatchUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	try {
		const api = await createApi(req);
		const { dyeing_batch_uuid } = req.params;
		const { is_update, type } = req.query;

		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${dyeing_batch_uuid}`)
				.then((response) => response);

		const [dyeing_batch, dyeing_batch_entry] = await Promise.all([
			fetchData('/zipper/dyeing-batch'),
			fetchData('/zipper/dyeing-batch-entry/by/dyeing-batch-uuid'),
		]);

		let new_dyeing_batch_entry = null;

		const { batch_type, order_info_uuid } = dyeing_batch?.data?.data;

		if (is_update === 'true') {
			const dyeing_order_batch = await api.get(
				batch_type == 'extra'
					? `/zipper/dyeing-order-batch?batch_type=${batch_type}&order_info_uuid=${order_info_uuid}&type=${type}`
					: `/zipper/dyeing-order-batch?type=${type}`
			);

			const sfg_uuid = dyeing_batch_entry?.data?.data?.map(
				(entry) => entry.sfg_uuid
			);

			new_dyeing_batch_entry =
				dyeing_order_batch?.data?.data?.dyeing_batch_entry || [];

			if (sfg_uuid) {
				if (!Array.isArray(new_dyeing_batch_entry)) {
					new_dyeing_batch_entry = [];
				}
				new_dyeing_batch_entry = new_dyeing_batch_entry.filter(
					(uuid) => !sfg_uuid.includes(uuid.sfg_uuid)
				);
			}
		}

		const response = {
			...dyeing_batch?.data?.data,
			dyeing_batch_entry: dyeing_batch_entry?.data?.data || [],
		};

		if (is_update === 'true') {
			response.new_dyeing_batch_entry = new_dyeing_batch_entry;
		}

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Batch Details Full',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
