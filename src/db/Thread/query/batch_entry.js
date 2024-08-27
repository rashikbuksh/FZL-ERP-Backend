import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { batch_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch_entry)
		.values(req.body)
		.returning({ insertedId: batch_entry.uuid });

	try {
		const data = await resultPromise;

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

	const resultPromise = db
		.update(batch_entry)
		.set(req.body)
		.where(eq(batch_entry.uuid, req.params.uuid))
		.returning({ updatedId: batch_entry.uuid });

	try {
		const data = await resultPromise;

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
	const resultPromise = db
		.delete(batch_entry)
		.where(eq(batch_entry.uuid, req.params.uuid));

	try {
		await resultPromise;

		const toast = {
			status: 201,
			type: 'remove',
			message: `${req.params.uuid} removed`,
		};

		return await res.status(201).json({ toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry.uuid,
			batch_uuid: batch_entry.batch_uuid,
			order_entry_uuid: batch_entry.order_entry_uuid,
			quantity: batch_entry.quantity,
			coning_production_quantity: batch_entry.coning_production_quantity,
			coning_production_quantity_in_kg:
				batch_entry.coning_production_quantity_in_kg,
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
		})
		.from(batch_entry);
	const toast = {
		status: 201,
		type: 'select_all',
		message: 'batch_entry list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry.uuid,
			batch_uuid: batch_entry.batch_uuid,
			order_entry_uuid: batch_entry.order_entry_uuid,
			quantity: batch_entry.quantity,
			coning_production_quantity: batch_entry.coning_production_quantity,
			coning_production_quantity_in_kg:
				batch_entry.coning_production_quantity_in_kg,
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
		})
		.from(batch_entry)
		.where(eq(batch_entry.uuid, req.params.uuid));
	const toast = {
		status: 201,
		type: 'select',
		message: 'batch_entry',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function getOrderDetailsForBatchEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const query = sql`
	SELECT 
		oe.uuid as order_entry_uuid,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.count_length_uuid as count_length_uuid,
		oe.quantity as order_quantity,
		CONCAT(cl.count, '/', cl.length) as count_length,
		oe.shade_recipe_uuid as shade_recipe_uuid,
		se.name as shade_recipe_name,
		CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
		be_given.total_quantity as total_trx_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0)) as balance_quantity
	FROM
		thread.order_entry oe
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN
		lab_dip.shade_recipe se ON oe.shade_recipe_uuid = se.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN 
	(
		SELECT 
			batch_entry.order_entry_uuid,
			SUM(batch_entry.quantity) as total_quantity
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) as be_given ON be_given.order_entry_uuid = oe.uuid
	WHERE
	oe.shade_recipe_uuid IS NOT NULL
	`;

	const batchEntryPromise = db.execute(query);

	try {
		const data = await batchEntryPromise;
		const batch_data = { batch_entry: data?.rows };
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order details',
		};

		return await res.status(200).json({ toast, data: batch_data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getBatchEntryByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
	SELECT 
		be.uuid as batch_entry_uuid,
		be.batch_uuid,
		oe.uuid as order_entry_uuid,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.count_length_uuid as count_length_uuid,
		oe.quantity as order_quantity,
		CONCAT(cl.count, '/', cl.length) as count_length,
		oe.shade_recipe_uuid as shade_recipe_uuid,
		se.name as shade_recipe_name,
		CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
		be.quantity as quantity,
		be.coning_production_quantity,
		be.coning_production_quantity_in_kg,
		be_given.total_quantity as total_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0)) as balance_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0) + be.quantity) as can_trx_quantity,
		be.created_at,
		be.updated_at,
		be.remarks as batch_remarks
	FROM
		thread.batch_entry be
	LEFT JOIN 
		thread.order_entry oe ON be.order_entry_uuid = oe.uuid
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN
		lab_dip.shade_recipe se ON oe.shade_recipe_uuid = se.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN 
	(
		SELECT 
			batch_entry.order_entry_uuid,
			SUM(batch_entry.quantity) as total_quantity
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) as be_given ON be_given.order_entry_uuid = oe.uuid
	WHERE
		be.batch_uuid = ${req.params.batch_uuid}
	`;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
