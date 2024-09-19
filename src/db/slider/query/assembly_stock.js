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

const transaction_total_trx = alias(
	sql`
		SELECT
			assembly_stock.uuid AS assembly_stock_uuid,
			SUM(trx_quantity) AS total_transaction_quantity
		FROM slider.transaction
		JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
		GROUP BY assembly_stock.uuid
	`,
	'transaction_total_trx'
);

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
	const query = sql`
		SELECT 
			assembly_stock.uuid,
			assembly_stock.name,
			assembly_stock.die_casting_body_uuid,
			diecastingbody.name AS die_casting_body_name,
			diecastingbody.quantity_in_sa AS die_casting_body_quantity,
			assembly_stock.die_casting_puller_uuid,
			diecastingpuller.name AS die_casting_puller_name,
			diecastingpuller.quantity_in_sa AS die_casting_puller_quantity,
			assembly_stock.die_casting_cap_uuid,
			diecastingcap.name AS die_casting_cap_name,
			diecastingcap.quantity_in_sa AS die_casting_cap_quantity,
			assembly_stock.die_casting_link_uuid,
			diecastinglink.name AS die_casting_link_name,
			diecastinglink.quantity_in_sa AS die_casting_link_quantity,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa, diecastinglink.quantity_in_sa) AS min_quantity_with_link,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa) AS min_quantity_no_link,
			assembly_stock.quantity,
			assembly_stock.created_by,
			users.name AS created_by_name,
			assembly_stock.created_at,
			assembly_stock.updated_at,
			assembly_stock.remarks,
			transaction_total_trx.total_transaction_quantity
		FROM 
			slider.assembly_stock
		LEFT JOIN 
			hr.users ON assembly_stock.created_by = users.uuid
		LEFT JOIN 
			slider.die_casting diecastingbody ON assembly_stock.die_casting_body_uuid = diecastingbody.uuid
		LEFT JOIN 
			slider.die_casting diecastingpuller ON assembly_stock.die_casting_puller_uuid = diecastingpuller.uuid
		LEFT JOIN 
			slider.die_casting diecastingcap ON assembly_stock.die_casting_cap_uuid = diecastingcap.uuid
		LEFT JOIN 
			slider.die_casting diecastinglink ON assembly_stock.die_casting_link_uuid = diecastinglink.uuid
		LEFT JOIN (
			SELECT
				assembly_stock.uuid AS assembly_stock_uuid,
				SUM(trx_quantity::numeric) AS total_transaction_quantity
			FROM slider.transaction
			JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
			GROUP BY assembly_stock.uuid
		) AS transaction_total_trx ON assembly_stock.uuid = transaction_total_trx.assembly_stock_uuid
		ORDER BY 
			assembly_stock.created_at DESC;
	`;

	const assemblyStockPromise = db.execute(query);

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock list`,
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			assembly_stock.uuid,
			assembly_stock.name,
			assembly_stock.die_casting_body_uuid,
			diecastingbody.name AS die_casting_body_name,
			diecastingbody.quantity_in_sa AS die_casting_body_quantity,
			assembly_stock.die_casting_puller_uuid,
			diecastingpuller.name AS die_casting_puller_name,
			diecastingpuller.quantity_in_sa AS die_casting_puller_quantity,
			assembly_stock.die_casting_cap_uuid,
			diecastingcap.name AS die_casting_cap_name,
			diecastingcap.quantity_in_sa AS die_casting_cap_quantity,
			assembly_stock.die_casting_link_uuid,
			diecastinglink.name AS die_casting_link_name,
			diecastinglink.quantity_in_sa AS die_casting_link_quantity,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa, diecastinglink.quantity_in_sa) AS min_quantity_with_link,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa) AS min_quantity_no_link,
			assembly_stock.quantity,
			assembly_stock.created_by,
			users.name AS created_by_name,
			assembly_stock.created_at,
			assembly_stock.updated_at,
			assembly_stock.remarks,
			transaction_total_trx.total_transaction_quantity
		FROM 
			slider.assembly_stock
		LEFT JOIN 
			hr.users ON assembly_stock.created_by = users.uuid
		LEFT JOIN 
			slider.die_casting diecastingbody ON assembly_stock.die_casting_body_uuid = diecastingbody.uuid
		LEFT JOIN 
			slider.die_casting diecastingpuller ON assembly_stock.die_casting_puller_uuid = diecastingpuller.uuid
		LEFT JOIN 
			slider.die_casting diecastingcap ON assembly_stock.die_casting_cap_uuid = diecastingcap.uuid
		LEFT JOIN 
			slider.die_casting diecastinglink ON assembly_stock.die_casting_link_uuid = diecastinglink.uuid
		LEFT JOIN (
			SELECT
				assembly_stock.uuid AS assembly_stock_uuid,
				SUM(trx_quantity) AS total_transaction_quantity
			FROM slider.transaction
			JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
			GROUP BY assembly_stock.uuid
		) AS transaction_total_trx ON assembly_stock.uuid = transaction_total_trx.assembly_stock_uuid
		WHERE 
			assembly_stock.uuid = ${req.params.uuid}
		ORDER BY 
			assembly_stock.created_at DESC;
	`;

	const assemblyStockPromise = db.execute(query);

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock`,
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
