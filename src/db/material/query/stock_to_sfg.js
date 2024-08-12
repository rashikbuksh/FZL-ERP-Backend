import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { stock_to_sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(stock_to_sfg).values(req.body).returning({
		insertedId: stock_to_sfg.material_uuid,
	});
	try {
		const data = await usedPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(stock_to_sfg)
		.set(req.body)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning({ updatedName: stock_to_sfg.material_uuid });

	try {
		const data = await usedPromise;
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
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.delete(stock_to_sfg)
		.where(eq(stock_to_sfg.uuid, req.params.uuid))
		.returning({ deletedName: stock_to_sfg.material_uuid });

	try {
		const data = await usedPromise;
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
	const query = sql`SELECT 
						stock_to_sfg.uuid,
						stock_to_sfg.material_uuid,
						info.name AS material_name,
						info.unit AS unit,
						stock.stock AS stock,
						stock_to_sfg.order_entry_uuid,
						order_entry.order_description_uuid AS order_description_uuid,
						stock_to_sfg.trx_to,
						stock_to_sfg.trx_quantity,
						stock_to_sfg.created_by,
						users.name AS created_by_name,
						stock_to_sfg.created_at,
						stock_to_sfg.updated_at,
						stock_to_sfg.remarks,
						vodf.order_number,
						vodf.item_description,
						order_entry.style AS style,
						order_entry.color AS color,
						order_entry.size AS size,
						CONCAT(order_entry.style, '/', order_entry.color, '/', order_entry.size) AS style_color_size
					FROM 
						material.stock_to_sfg
					LEFT JOIN 
						material.info ON stock_to_sfg.material_uuid = info.uuid
					LEFT JOIN 
						material.stock ON stock.material_uuid = info.uuid
					LEFT JOIN 
						zipper.order_entry ON stock_to_sfg.order_entry_uuid = order_entry.uuid
					LEFT JOIN 
						zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN 
						hr.users AS users ON stock_to_sfg.created_by = users.uuid`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Stock to SFG List',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`SELECT 
						stock_to_sfg.uuid,
						stock_to_sfg.material_uuid,
						info.name AS material_name,
						info.unit AS unit,
						stock.stock AS stock,
						stock_to_sfg.order_entry_uuid,
						order_entry.order_description_uuid AS order_description_uuid,
						stock_to_sfg.trx_to,
						stock_to_sfg.trx_quantity,
						stock_to_sfg.created_by,
						users.name AS created_by_name,
						stock_to_sfg.created_at,
						stock_to_sfg.updated_at,
						stock_to_sfg.remarks,
						vodf.order_number,
						vodf.item_description,
						order_entry.style AS style,
						order_entry.color AS color,
						order_entry.size AS size,
						CONCAT(order_entry.style, '/', order_entry.color, '/', order_entry.size) AS style_color_size
					FROM 
						material.stock_to_sfg
					LEFT JOIN 
						material.info ON stock_to_sfg.material_uuid = info.uuid
					LEFT JOIN 
						material.stock ON stock.material_uuid = info.uuid
					LEFT JOIN 
						zipper.order_entry ON stock_to_sfg.order_entry_uuid = order_entry.uuid
					LEFT JOIN 
						zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN 
						hr.users AS users ON stock_to_sfg.created_by = users.uuid
					WHERE 
						stock_to_sfg.uuid = ${req.params.uuid}`;

	const stockToSfgPromise = db.execute(query);

	try {
		const data = await stockToSfgPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Stock to SFG',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
