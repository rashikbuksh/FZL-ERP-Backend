import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { machine } from '../../public/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(machine)
		.values(req.body)
		.returning({ insertedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(machine)
		.set(req.body)
		.where(eq(machine.uuid, req.params.uuid))
		.returning({ updatedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const resultPromise = db
		.delete(machine)
		.where(eq(machine.uuid, req.params.uuid))
		.returning({ deletedName: machine.name });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: machine.uuid,
			name: machine.name,
			is_vislon: machine.is_vislon,
			is_nylon: machine.is_nylon,
			is_metal: machine.is_metal,
			is_sewing_thread: machine.is_sewing_thread,
			is_bulk: machine.is_bulk,
			is_sample: machine.is_sample,
			max_capacity: decimalToNumber(machine.max_capacity),
			min_capacity: decimalToNumber(machine.min_capacity),
			water_capacity: decimalToNumber(machine.water_capacity),
			created_by: machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine.created_at,
			updated_at: machine.updated_at,
			remarks: machine.remarks,
		})
		.from(machine)
		.leftJoin(hrSchema.users, eq(machine.created_by, hrSchema.users.uuid))
		.orderBy(desc(machine.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Machine',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: machine.uuid,
			name: machine.name,
			is_vislon: machine.is_vislon,
			is_nylon: machine.is_nylon,
			is_metal: machine.is_metal,
			is_sewing_thread: machine.is_sewing_thread,
			is_bulk: machine.is_bulk,
			is_sample: machine.is_sample,
			max_capacity: decimalToNumber(machine.max_capacity),
			min_capacity: decimalToNumber(machine.min_capacity),
			water_capacity: decimalToNumber(machine.water_capacity),
			created_by: machine.created_by,
			created_by_name: hrSchema.users.name,
			created_at: machine.created_at,
			updated_at: machine.updated_at,
			remarks: machine.remarks,
		})
		.from(machine)
		.leftJoin(hrSchema.users, eq(machine.created_by, hrSchema.users.uuid))
		.where(eq(machine.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Machine',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByDate(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const machineQuery = sql`SELECT 
		uuid AS machine_uuid,
		CONCAT(name, '(', min_capacity::float8, '-', max_capacity::float8, ')') AS machine_name
	 FROM public.machine`;

	const dataQuery = sql`
        SELECT
            DATE(zdb.production_date) as date,
			CONCAT(pm.name, '(', pm.min_capacity::float8, '-', pm.max_capacity::float8, ')') AS machine_name,
            zdb.slot,
            CONCAT('B', to_char(zdb.created_at, 'YY'), '-', LPAD(zdb.id::text, 4, '0')) AS batch_no,
			zdb.uuid AS batch_uuid,
            vodf.order_number,
			vodf.order_info_uuid as order_uuid,
            zoe.color,
            zbe.production_quantity_in_kg::float8,
			expected.total_quantity::float8,
			zdb.batch_status::text as batch_status,
			expected.expected_kg::float8 as expected_kg,
			ROUND(expected.total_actual_production_quantity::numeric, 3)::float8 AS total_actual_production_quantity,
			zdb.received,
			vodf.item_description,
			1 as is_zipper
        FROM public.machine pm
        LEFT JOIN zipper.dyeing_batch zdb ON zdb.machine_uuid = pm.uuid
        LEFT JOIN zipper.dyeing_batch_entry zbe ON zbe.dyeing_batch_uuid = zdb.uuid
        LEFT JOIN zipper.sfg sfg ON sfg.uuid = zbe.sfg_uuid
        LEFT JOIN zipper.order_entry zoe ON zoe.uuid = sfg.order_entry_uuid
        LEFT JOIN zipper.order_description zod ON zod.uuid = zoe.order_description_uuid
        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = zod.uuid
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
				be.dyeing_batch_uuid, 
				jsonb_agg(DISTINCT vodf.order_number) as order_numbers, 
				SUM(be.quantity::float8) as total_quantity, 
				SUM(be.production_quantity_in_kg::float8) as total_actual_production_quantity
			FROM zipper.dyeing_batch_entry be
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
			GROUP BY be.dyeing_batch_uuid
		) AS expected ON zdb.uuid = expected.dyeing_batch_uuid
        WHERE DATE(zdb.production_date) = ${req.params.date}
	UNION 
		SELECT 
			DATE(tb.production_date) as date,
			pm.name AS machine_name,
			tb.slot,
			CONCAT('TB', to_char(tb.created_at, 'YY'), '-', LPAD(tb.id::text, 4, '0')) AS batch_no,
			tb.uuid AS batch_uuid,
			CONCAT('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS order_number,
			toi.uuid as order_uuid,
			toe.color,
			toe.production_quantity_in_kg::float8,
			expected.total_quantity::float8,
			tb.status as batch_status,
			0 as expected_kg,
			ROUND(expected.total_actual_production_quantity::numeric, 3)::float8 as total_actual_production_quantity,
			null as received,
			CONCAT(tcl.count,'-',tcl.length) as item_description,
			0 as is_zipper
		FROM public.machine pm
		LEFT JOIN thread.batch tb ON tb.machine_uuid = pm.uuid
		LEFT JOIN thread.batch_entry tbe ON tbe.batch_uuid = tb.uuid
		LEFT JOIN thread.order_entry toe ON toe.uuid = tbe.order_entry_uuid
		LEFT JOIN thread.order_info toi ON toi.uuid = toe.order_info_uuid
		LEFT JOIN thread.count_length tcl ON tcl.uuid = toe.count_length_uuid
		LEFT JOIN (
			SELECT
				SUM(tbe.coning_production_quantity::float8) as total_actual_production_quantity,
				SUM(tbe.quantity::float8) as total_quantity,
				tbe.batch_uuid
			FROM thread.batch_entry tbe
			GROUP BY tbe.batch_uuid
		) AS expected ON tb.uuid = expected.batch_uuid

		WHERE DATE(tb.production_date) = ${req.params.date}
    `;

	try {
		const { rows: machines } = await db.execute(machineQuery);
		const { rows: results } = await db.execute(dataQuery);

		if (!Array.isArray(machines) || !Array.isArray(results)) {
			throw new TypeError('Expected results to be an array');
		}

		const groupedResults = results.reduce((acc, item) => {
			if (!acc[item.machine_name]) {
				acc[item.machine_name] = {};
			}
			if (!acc[item.machine_name][item.slot]) {
				acc[item.machine_name][item.slot] = {
					batch_no: item.batch_no,
					batch_uuid: item.batch_uuid,
					order_no: item.order_number,
					order_uuid: item.order_uuid,
					color: item.color,
					production_quantity_in_kg: item.production_quantity_in_kg,
					total_quantity: item.total_quantity,
					expected_kg: item.expected_kg,
					batch_status: item.batch_status,
					total_actual_production_quantity:
						item.total_actual_production_quantity,
					received: item.received,
					item_description: item.item_description,
					is_zipper: item.is_zipper,
				};
			}
			return acc;
		}, {});

		const response = {
			date: results[0]?.date,
			data: machines.map((machine) => ({
				machine_uuid: machine.machine_uuid,
				machine: machine.machine_name,
				slot_1: groupedResults[machine.machine_name]?.[1] || null,
				slot_2: groupedResults[machine.machine_name]?.[2] || null,
				slot_3: groupedResults[machine.machine_name]?.[3] || null,
				slot_4: groupedResults[machine.machine_name]?.[4] || null,
				slot_5: groupedResults[machine.machine_name]?.[5] || null,
				slot_6: groupedResults[machine.machine_name]?.[6] || null,
			})),
		};

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Machine',
		};

		return res.status(200).json({ toast, data: response.data });
	} catch (error) {
		await handleError({ error, res });
	}
}
