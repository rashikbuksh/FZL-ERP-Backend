import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { assembly_stock, die_casting_to_assembly_stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const assemblyStockPromise = db
		.insert(die_casting_to_assembly_stock)
		.values(req.body)
		.returning({ insertedId: die_casting_to_assembly_stock.uuid });

	try {
		const data = await assemblyStockPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const assemblyStockPromise = db
		.update(die_casting_to_assembly_stock)
		.set(req.body)
		.where(eq(die_casting_to_assembly_stock.uuid, req.params.uuid))
		.returning({ updatedId: die_casting_to_assembly_stock.uuid });
	try {
		const data = await assemblyStockPromise;
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

	const assemblyStockPromise = db
		.delete(die_casting_to_assembly_stock)
		.where(eq(die_casting_to_assembly_stock.uuid, req.params.uuid))
		.returning({ deletedId: die_casting_to_assembly_stock.uuid });
	try {
		const data = await assemblyStockPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const assemblyStockPromise = db
		.select({
			uuid: die_casting_to_assembly_stock.uuid,
			assembly_stock_uuid:
				die_casting_to_assembly_stock.assembly_stock_uuid,
			assembly_stock_name: assembly_stock.name,
			production_quantity:
				die_casting_to_assembly_stock.production_quantity,
			created_by: die_casting_to_assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_to_assembly_stock.created_at,
			updated_at: die_casting_to_assembly_stock.updated_at,
			remarks: die_casting_to_assembly_stock.remarks,
		})
		.from(die_casting_to_assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(die_casting_to_assembly_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			assembly_stock,
			eq(
				die_casting_to_assembly_stock.assembly_stock_uuid,
				assembly_stock.uuid
			)
		)
		.orderBy(desc(die_casting_to_assembly_stock.created_at));

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `die_casting_to_assembly_stock list`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const assemblyStockPromise = db
		.select({
			uuid: die_casting_to_assembly_stock.uuid,
			assembly_stock_uuid:
				die_casting_to_assembly_stock.assembly_stock_uuid,
			assembly_stock_name: assembly_stock.name,
			production_quantity:
				die_casting_to_assembly_stock.production_quantity,
			created_by: die_casting_to_assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_to_assembly_stock.created_at,
			updated_at: die_casting_to_assembly_stock.updated_at,
			remarks: die_casting_to_assembly_stock.remarks,
		})
		.from(die_casting_to_assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(die_casting_to_assembly_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			assembly_stock,
			eq(
				die_casting_to_assembly_stock.assembly_stock_uuid,
				assembly_stock.uuid
			)
		)
		.where(eq(die_casting_to_assembly_stock.uuid, req.params.uuid));

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `die_casting_to_assembly_stock`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
