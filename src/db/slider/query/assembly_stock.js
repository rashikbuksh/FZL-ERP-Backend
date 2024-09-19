import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { assembly_stock, die_casting } from '../schema.js';

const diecastingbody = alias(die_casting, 'diecastingbody');
const diecastingpuller = alias(die_casting, 'diecastingpuller');
const diecastingcap = alias(die_casting, 'diecastingcap');
const diecastinglink = alias(die_casting, 'diecastinglink');

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
			die_casting_body_name: sql`concat(diecastingbody.name, ' ', diecastingbody.quantity_in_sa)`,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_puller_name: sql`concat(diecastingpuller.name, ' ', diecastingpuller.quantity_in_sa)`,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_cap_name: sql`concat(diecastingcap.name, ' ', diecastingcap.quantity_in_sa)`,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			die_casting_link_name: sql`concat(diecastinglink.name, ' ', diecastinglink.quantity_in_sa)`,
			min_quantity_with_link: sql`LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa, diecastinglink.quantity_in_sa)`,
			min_quantity_no_link: sql`LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa)`,
			quantity: assembly_stock.quantity,
			created_by: assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: assembly_stock.created_at,
			updated_at: assembly_stock.updated_at,
			remarks: assembly_stock.remarks,
		})
		.from(assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(assembly_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			diecastingbody,
			eq(assembly_stock.die_casting_body_uuid, diecastingbody.uuid)
		)
		.leftJoin(
			diecastingpuller,
			eq(assembly_stock.die_casting_puller_uuid, diecastingpuller.uuid)
		)
		.leftJoin(
			diecastingcap,
			eq(assembly_stock.die_casting_cap_uuid, diecastingcap.uuid)
		)
		.leftJoin(
			diecastinglink,
			eq(assembly_stock.die_casting_link_uuid, diecastinglink.uuid)
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
			die_casting_body_name: sql`concat(diecastingbody.name, ' ', diecastingbody.quantity)`,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_puller_name: sql`concat(diecastingpuller.name, ' ', diecastingpuller.quantity)`,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_cap_name: sql`concat(diecastingcap.name, ' ', diecastingcap.quantity)`,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			die_casting_link_name: sql`concat(diecastinglink.name, ' ', diecastinglink.quantity)`,
			min_quantity: sql`LEAST(diecastingbody.quantity, diecastingpuller.quantity, diecastingcap.quantity, diecastinglink.quantity)`,
			quantity: assembly_stock.quantity,
			created_by: assembly_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: assembly_stock.created_at,
			updated_at: assembly_stock.updated_at,
			remarks: assembly_stock.remarks,
		})
		.from(assembly_stock)
		.leftJoin(
			hrSchema.users,
			eq(assembly_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			diecastingbody,
			eq(assembly_stock.die_casting_body_uuid, diecastingbody.uuid)
		)
		.leftJoin(
			diecastingpuller,
			eq(assembly_stock.die_casting_puller_uuid, diecastingpuller.uuid)
		)
		.leftJoin(
			diecastingcap,
			eq(assembly_stock.die_casting_cap_uuid, diecastingcap.uuid)
		)
		.leftJoin(
			diecastinglink,
			eq(assembly_stock.die_casting_link_uuid, diecastinglink.uuid)
		)
		.where(eq(assembly_stock.uuid, req.params.uuid));

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
