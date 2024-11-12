import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { carton } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cartonPromise = db
		.insert(carton)
		.values(req.body)
		.returning({ insertedName: carton.name });

	try {
		const data = await cartonPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cartonPromise = db
		.update(carton)
		.set(req.body)
		.where(eq(carton.uuid, req.params.uuid))
		.returning({ updatedName: carton.name });

	try {
		const data = await cartonPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cartonPromise = db
		.delete(carton)
		.where(eq(carton.uuid, req.params.uuid))
		.returning({ deletedName: carton.name });

	try {
		const data = await cartonPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const cartonPromise = db
		.select({
			uuid: carton.uuid,
			size: carton.size,
			name: carton.name,
			used_for: carton.used_for,
			active: carton.active,
			created_by: carton.created_by,
			created_by_name: hrSchema.users.name,
			created_at: carton.created_at,
			updated_at: carton.updated_at,
			remarks: carton.remarks,
		})
		.from(carton)
		.leftJoin(hrSchema.users, eq(carton.created_by, hrSchema.users.uuid))
		.orderBy(desc(carton.created_at));

	try {
		const data = await cartonPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'Carton list',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cartonPromise = db
		.select({
			uuid: carton.uuid,
			size: carton.size,
			name: carton.name,
			used_for: carton.used_for,
			active: carton.active,
			created_by: carton.created_by,
			created_by_name: hrSchema.users.name,
			created_at: carton.created_at,
			updated_at: carton.updated_at,
			remarks: carton.remarks,
		})
		.from(carton)
		.leftJoin(hrSchema.users, eq(carton.created_by, hrSchema.users.uuid))
		.where(eq(carton.uuid, req.params.uuid));

	try {
		const data = await cartonPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Carton',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
