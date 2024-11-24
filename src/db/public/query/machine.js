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

	const query = sql`
        SELECT
            DATE(zdb.production_date) as date,
            pm.name AS machine_name,
            zdb.slot,
            CONCAT('B', to_char(zdb.created_at, 'YY'), '-', LPAD(zdb.id::text, 4, '0')) AS batch_no,
            vodf.order_number,
            zoe.color,
            zbe.production_quantity_in_kg::float8 as weight
        FROM public.machine pm
        LEFT JOIN zipper.dyeing_batch zdb ON zdb.machine_uuid = pm.uuid
        LEFT JOIN zipper.dyeing_batch_entry zbe ON zbe.dyeing_batch_uuid = zdb.uuid
        LEFT JOIN zipper.sfg sfg ON sfg.uuid = zbe.sfg_uuid
        LEFT JOIN zipper.order_entry zoe ON zoe.uuid = sfg.order_entry_uuid
        LEFT JOIN zipper.order_description zod ON zod.uuid = zoe.order_description_uuid
        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = zod.uuid
        WHERE DATE(zdb.production_date) = ${req.params.date}
        ORDER BY zdb.created_at DESC
    `;

	try {
		const { rows: results } = await db.execute(query);

		if (!Array.isArray(results)) {
			throw new TypeError('Expected results to be an array');
		}

		const groupedResults = results.reduce((acc, item) => {
			if (!acc[item.machine_name]) {
				acc[item.machine_name] = [];
			}
			acc[item.machine_name].push({
				slot: item.slot,
				batch_no: item.batch_no,
				order_no: item.order_number,
				color: item.color,
				weight: item.weight,
			});
			return acc;
		}, {});

		const machines = Object.keys(groupedResults).map((machine_name) => ({
			[machine_name]: groupedResults[machine_name],
		}));

		const response = {
			date: results[0]?.date,
			machines,
		};

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Machine',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
