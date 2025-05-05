import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { production_capacity, properties } from '../schema.js';
const item_properties = alias(properties, 'item_properties');
const nylon_stopper_properties = alias(properties, 'nylon_stopper_properties');
const zipper_number_properties = alias(properties, 'zipper_number_properties');
const end_type_properties = alias(properties, 'end_type_properties');

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
			uuid: production_capacity.uuid,
			product: production_capacity.product,
			item: item_properties.uuid,
			item_name: item_properties.name,
			nylon_stopper: nylon_stopper_properties.uuid,
			nylon_stopper_name: nylon_stopper_properties.name,
			zipper_number: zipper_number_properties.uuid,
			zipper_number_name: zipper_number_properties.name,
			end_type: end_type_properties.uuid,
			end_type_name: end_type_properties.name,
			quantity: decimalToNumber(production_capacity.quantity),
			created_by: production_capacity.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production_capacity.created_at,
			updated_at: production_capacity.updated_at,
			remarks: production_capacity.remarks,
		})
		.from(production_capacity)
		.leftJoin(
			hrSchema.users,
			eq(production_capacity.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(production_capacity.item, item_properties.uuid)
		)
		.leftJoin(
			nylon_stopper_properties,
			eq(production_capacity.nylon_stopper, nylon_stopper_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(production_capacity.zipper_number, zipper_number_properties.uuid)
		)
		.leftJoin(
			end_type_properties,
			eq(production_capacity.end_type, end_type_properties.uuid)
		);
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
			uuid: production_capacity.uuid,
			product: production_capacity.product,
			item: item_properties.uuid,
			item_name: item_properties.name,
			nylon_stopper: nylon_stopper_properties.uuid,
			nylon_stopper_name: nylon_stopper_properties.name,
			zipper_number: zipper_number_properties.uuid,
			zipper_number_name: zipper_number_properties.name,
			end_type: end_type_properties.uuid,
			end_type_name: end_type_properties.name,
			quantity: decimalToNumber(production_capacity.quantity),
			created_by: production_capacity.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production_capacity.created_at,
			updated_at: production_capacity.updated_at,
			remarks: production_capacity.remarks,
		})
		.from(production_capacity)
		.leftJoin(
			hrSchema.users,
			eq(production_capacity.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			item_properties,
			eq(production_capacity.item, item_properties.uuid)
		)
		.leftJoin(
			nylon_stopper_properties,
			eq(production_capacity.nylon_stopper, nylon_stopper_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(production_capacity.zipper_number, zipper_number_properties.uuid)
		)
		.leftJoin(
			end_type_properties,
			eq(production_capacity.end_type, end_type_properties.uuid)
		)
		.where(eq(production_capacity.uuid, req.params.uuid));

	try {
		const data = await productionCapacityPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `${req.params.uuid} selected`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
