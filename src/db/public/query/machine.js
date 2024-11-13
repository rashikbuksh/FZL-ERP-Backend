import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
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
