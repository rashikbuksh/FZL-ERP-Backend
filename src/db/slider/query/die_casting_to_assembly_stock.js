import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import {
	assembly_stock,
	die_casting,
	die_casting_to_assembly_stock,
} from '../schema.js';

const diecastingbody = alias(die_casting, 'diecastingbody');
const diecastingpuller = alias(die_casting, 'diecastingpuller');
const diecastingcap = alias(die_casting, 'diecastingcap');
const diecastinglink = alias(die_casting, 'diecastinglink');

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
			die_casting_body_uuid: assembly_stock.die_casting_body_uuid,
			die_casting_body_name: diecastingbody.name,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_puller_name: diecastingpuller.name,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_cap_name: diecastingcap.name,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			die_casting_link_name: diecastinglink.name,
			production_quantity:
				die_casting_to_assembly_stock.production_quantity,
			max_production_quantity_with_link: sql`diecastingbody.quantity_in_sa + diecastingpuller.quantity_in_sa + diecastingcap.quantity_in_sa + diecastinglink.quantity_in_sa + die_casting_to_assembly_stock.production_quantity`,
			max_production_quantity_without_link: sql`diecastingbody.quantity_in_sa + diecastingpuller.quantity_in_sa + diecastingcap.quantity_in_sa + die_casting_to_assembly_stock.production_quantity`,
			with_link: die_casting_to_assembly_stock.with_link,
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
			die_casting_body_uuid: assembly_stock.die_casting_body_uuid,
			die_casting_body_name: diecastingbody.name,
			die_casting_puller_uuid: assembly_stock.die_casting_puller_uuid,
			die_casting_puller_name: diecastingpuller.name,
			die_casting_cap_uuid: assembly_stock.die_casting_cap_uuid,
			die_casting_cap_name: diecastingcap.name,
			die_casting_link_uuid: assembly_stock.die_casting_link_uuid,
			die_casting_link_name: diecastinglink.name,
			production_quantity:
				die_casting_to_assembly_stock.production_quantity,
			max_production_quantity_with_link: sql`diecastingbody.quantity_in_sa + diecastingpuller.quantity_in_sa + diecastingcap.quantity_in_sa + diecastinglink.quantity_in_sa + die_casting_to_assembly_stock.production_quantity`,
			max_production_quantity_without_link: sql`diecastingbody.quantity_in_sa + diecastingpuller.quantity_in_sa + diecastingcap.quantity_in_sa + die_casting_to_assembly_stock.production_quantity`,
			with_link: die_casting_to_assembly_stock.with_link,
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
