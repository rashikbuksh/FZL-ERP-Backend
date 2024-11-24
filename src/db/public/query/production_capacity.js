import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { production_capacity } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const productionCapacityPromise = db
		.insert(production_capacity)
		.values(req.body)
		.returning({ insertedId: production_capacity.uuid });

	try {
		const data = await productionCapacityPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0]?.insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const productionCapacityPromise = db
		.update(production_capacity)
		.set(req.body)
		.where(eq(production_capacity.uuid, req.params.uuid))
		.returning({ updatedId: production_capacity.uuid });

	try {
		const data = await productionCapacityPromise;
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
	if (!(await validateRequest(req, next))) return;

	const productionCapacityPromise = db
		.delete(production_capacity)
		.where(eq(production_capacity.uuid, req.params.uuid))
		.returning({ deletedId: production_capacity.uuid });

	try {
		const data = await productionCapacityPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${req.params.uuid} deleted`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const productionCapacityPromise = db
		.select({
			...production_capacity,
		})
		.from(production_capacity);

	try {
		const data = await productionCapacityPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'All production capacities selected',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const productionCapacityPromise = db
		.select({
			...production_capacity,
		})
		.from(production_capacity)
		.where(eq(production_capacity.uuid, req.params.uuid));

	try {
		const data = await productionCapacityPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `${req.params.uuid} selected`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
