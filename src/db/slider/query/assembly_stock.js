import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { assembly_stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const assemblyStockPromise = db
		.insert(assembly_stock)
		.values(req.body)
		.returning({ insertedId: assembly_stock.uuid });

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
		.update(assembly_stock)
		.set(req.body)
		.where(eq(assembly_stock.uuid, req.params.uuid))
		.returning({ updatedId: assembly_stock.uuid });
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
		.delete(assembly_stock)
		.where(eq(assembly_stock.uuid, req.params.uuid))
		.returning({ deletedId: assembly_stock.uuid });
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
			uuid: assembly_stock.uuid,
			name: assembly_stock.name,
			die_casting_body_uuid: assembly_stock.die_casting_body_uuid,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			quantity: assembly_stock.quantity,
			created_by: assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: assembly_stock.created_at,
			updated_at: assembly_stock.updated_at,
		})
		.from(assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(assembly_stock.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(assembly_stock.created_at));

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock list`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const assemblyStockPromise = db
		.select({
			uuid: assembly_stock.uuid,
			name: assembly_stock.name,
			die_casting_body_uuid: assembly_stock.die_casting_body_uuid,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			quantity: assembly_stock.quantity,
			created_by: assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: assembly_stock.created_at,
			updated_at: assembly_stock.updated_at,
		})
		.from(assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(assembly_stock.created_by, hrSchema.users.uuid)
		)
		.where(eq(assembly_stock.uuid, req.params.uuid))
		.returning({ selectedId: assembly_stock.uuid });

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
