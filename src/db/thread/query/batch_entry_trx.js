import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';

import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { batch_entry_trx } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch_entry_trx)
		.values(req.body)
		.returning({ insertedId: batch_entry_trx.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(batch_entry_trx)
		.set(req.body)
		.where(eq(batch_entry_trx.uuid, req.params.uuid))
		.returning({ updatedId: batch_entry_trx.uuid });

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
		.delete(batch_entry_trx)
		.where(eq(batch_entry_trx.uuid, req.params.uuid))
		.returning({ deletedId: batch_entry_trx.uuid });

	try {
		const data = await resultPromise;

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
	const resultPromise = db
		.select({
			uuid: batch_entry_trx.uuid,
			batch_entry_uuid: batch_entry_trx.batch_entry_uuid,
			quantity: decimalToNumber(batch_entry_trx.quantity),
			carton_quantity: decimalToNumber(batch_entry_trx.carton_quantity),
			created_by: batch_entry_trx.created_by,
			created_by_name: hrSchema.users.name,
			created_at: batch_entry_trx.created_at,
			updated_at: batch_entry_trx.updated_at,
			remarks: batch_entry_trx.remarks,
		})
		.from(batch_entry_trx)
		.leftJoin(
			hrSchema.users,
			eq(batch_entry_trx.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(batch_entry_trx.created_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_trx list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const query = sql`
		WITH calculated_balance AS (SELECT 
			bet.uuid,
			bet.batch_entry_uuid,
			bet.quantity::float8,
			bet.carton_quantity::float8,
			be.batch_uuid,
			CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_number,
			be.order_entry_uuid, 
			CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
			oe.color as color,
			oe.po as po,
			oe.style as style,
			oe.bleaching as bleaching,
			oe.count_length_uuid as count_length_uuid,
			CONCAT(cl.count, ' - ', cl.length) as count_length,
			cl.cone_per_carton,
			be.quantity::float8 as batch_quantity,
			be.coning_production_quantity::float8,
			be.coning_carton_quantity::float8,
			be.transfer_quantity::float8 as transfer_quantity,
			(be.quantity - be.transfer_quantity)::float8 as balance_quantity,
			bet.created_by,
			users.name as created_by_name,
			bet.created_at,
			bet.updated_at,
			bet.remarks as trx_remarks
			
		FROM
			thread.batch_entry_trx bet
		LEFT JOIN
			hr.users ON bet.created_by = users.uuid
		LEFT JOIN
			thread.batch_entry be ON bet.batch_entry_uuid = be.uuid
		LEFT JOIN 
			thread.order_entry oe ON be.order_entry_uuid = oe.uuid
		LEFT JOIN
			thread.count_length cl ON oe.count_length_uuid = cl.uuid
		LEFT JOIN 
			thread.order_info ON oe.order_info_uuid = order_info.uuid
		LEFT JOIN
			thread.batch ON be.batch_uuid = batch.uuid
	)
		SELECT * FROM calculated_balance
	WHERE uuid = ${req.params.uuid};
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_trx',
		};
		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getBatchEntryTrxDetails(req, res, next) {
	const query = sql`
	WITH calculated_balance AS (SELECT 
		bet.uuid,
		bet.batch_entry_uuid,
		bet.quantity::float8,
		bet.carton_quantity::float8,
		be.batch_uuid,
		CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_number,
		be.order_entry_uuid, 
		CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.bleaching as bleaching,
		oe.count_length_uuid as count_length_uuid,
		CONCAT(cl.count, ' - ', cl.length) as count_length,
		cl.cone_per_carton,
		be.quantity::float8 as batch_quantity,
		be.coning_production_quantity::float8,
		be.coning_carton_quantity::float8,
		be.transfer_quantity::float8 as transfer_quantity,
		(be.quantity - be.transfer_quantity)::float8 as balance_quantity,
		bet.created_by,
		users.name as created_by_name,
		bet.created_at,
		bet.updated_at,
		bet.remarks as trx_remarks
	FROM
		thread.batch_entry_trx bet
	LEFT JOIN
		hr.users ON bet.created_by = users.uuid
	LEFT JOIN
		thread.batch_entry be ON bet.batch_entry_uuid = be.uuid
	LEFT JOIN 
		thread.order_entry oe ON be.order_entry_uuid = oe.uuid
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN
		thread.batch ON be.batch_uuid = batch.uuid
	)
	SELECT * FROM calculated_balance
	WHERE balance_quantity >= 0
	ORDER BY created_at DESC;
	`;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_trx_details list',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
