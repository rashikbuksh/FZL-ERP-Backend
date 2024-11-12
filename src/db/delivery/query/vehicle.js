import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { vehicle } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vehiclePromise = db
		.insert(vehicle)
		.values(req.body)
		.returning({ insertedName: vehicle.name });

	try {
		const data = await vehiclePromise;
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

	const vehiclePromise = db
		.update(vehicle)
		.set(req.body)
		.where(eq(vehicle.uuid, req.params.uuid))
		.returning({ updatedName: vehicle.name });

	try {
		const data = await vehiclePromise;
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

	const vehiclePromise = db
		.delete(vehicle)
		.where(eq(vehicle.uuid, req.params.uuid))
		.returning({ deletedName: vehicle.name });

	try {
		const data = await vehiclePromise;
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
	if (!(await validateRequest(req, next))) return;
	const vehiclePromise = db
		.select({
			uuid: vehicle.uuid,
			type: vehicle.type,
			name: vehicle.name,
			number: vehicle.number,
			driver_name: vehicle.driver_name,
			active: vehicle.active,
			created_by: vehicle.created_by,
			created_by_name: hrSchema.users.name,
			created_at: vehicle.created_at,
			updated_at: vehicle.updated_at,
			remarks: vehicle.remarks,
		})
		.from(vehicle)
		.leftJoin(hrSchema.users, eq(vehicle.created_by, hrSchema.users.uuid))
		.orderBy(desc(vehicle.created_at));

	try {
		const data = await vehiclePromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'Vehicle list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vehiclePromise = db
		.select({
			uuid: vehicle.uuid,
			type: vehicle.type,
			name: vehicle.name,
			number: vehicle.number,
			driver_name: vehicle.driver_name,
			active: vehicle.active,
			created_by: vehicle.created_by,
			created_by_name: hrSchema.users.name,
			created_at: vehicle.created_at,
			updated_at: vehicle.updated_at,
			remarks: vehicle.remarks,
		})
		.from(vehicle)
		.leftJoin(hrSchema.users, eq(vehicle.created_by, hrSchema.users.uuid))
		.where(eq(vehicle.uuid, req.params.uuid));

	try {
		const data = await vehiclePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Vehicle',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
