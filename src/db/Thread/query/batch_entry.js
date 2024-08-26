import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
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
			yarn_quantity: batch_entry.yarn_quantity,
			coning_production_quantity: batch_entry.coning_production_quantity,
			coning_production_quantity_in_kg:
				batch_entry.coning_production_quantity_in_kg,
			created_by: batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
		})
		.from(batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(batch_entry.created_by, hrSchema.users.uuid)
		);
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
			yarn_quantity: batch_entry.yarn_quantity,
			coning_production_quantity: batch_entry.coning_production_quantity,
			coning_production_quantity_in_kg:
				batch_entry.coning_production_quantity_in_kg,
			created_by: batch_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
		})
		.from(batch_entry)
		.leftJoin(
			hrSchema.users,
			eq(batch_entry.created_by, hrSchema.users.uuid)
		)
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
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.count_length_uuid as count_length_uuid,
		oe.quantity as quantity,
		CONCAT(cl.count, ' - ', cl.length) as count_length,
		oe.shade_recipe_uuid as shade_recipe_uuid,
		se.name as shade_recipe_name

	FROM
		thread.order_entry oe
	LEFT JOIN
		thread.count_length cl
	ON
		oe.count_length_uuid = cl.uuid
	LEFT JOIN
		lab_dip.shade_recipe se
	ON
		oe.shade_recipe_uuid = se.uuid
	WHERE
	oe.shade_recipe_uuid IS NOT NULL
	`;

	const batchEntryPromise = db.select(query);

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
