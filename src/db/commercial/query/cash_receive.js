import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { cash_receive } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.insert(cash_receive)
		.values(req.body)
		.returning({
			insertedUuid: cash_receive.uuid,
		});
	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedUuid} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.update(cash_receive)
		.set(req.body)
		.where(eq(cash_receive.uuid, req.params.uuid))
		.returning({ updatedUuid: cash_receive.uuid });

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.delete(cash_receive)
		.where(eq(cash_receive.uuid, req.params.uuid))
		.returning({ deletedUuid: cash_receive.uuid });

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const query = sql`
				SELECT
					cash_receive.uuid,
					cash_receive.pi_cash_uuid,
					CASE 
						WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
						ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
					END AS pi_cash_id,
					pi_cash.receive_amount::float8,
					cash_receive.amount::float8,
					CASE 
						WHEN pi_cash.is_pi = 1 
						THEN ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) 
						ELSE ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) * pi_cash.conversion_rate::float8 END AS total_amount,
					cash_receive.created_by,
					hr.users.name AS created_by_name,
					cash_receive.created_at,
					cash_receive.updated_at,
					cash_receive.remarks
				FROM
					commercial.cash_receive
				LEFT JOIN
					hr.users ON cash_receive.created_by = hr.users.uuid
				LEFT JOIN
					commercial.pi_cash ON cash_receive.pi_cash_uuid = commercial.pi_cash.uuid
				LEFT JOIN
					(
						SELECT 
							(
								SUM(
									coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)
								)
							)::float8 as total_amount, 
							pi_cash.uuid as pi_cash_uuid
						FROM commercial.pi_cash 
							LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
							LEFT JOIN thread.order_entry ON pi_cash_entry.thread_order_entry_uuid = order_entry.uuid 
						GROUP BY pi_cash.uuid
					) as total_pi_amount ON total_pi_amount.pi_cash_uuid = cash_receive.pi_cash_uuid
				LEFT JOIN 
				(
					SELECT 
						(
							SUM(
								coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)
							)
						)::float8 as total_amount, 
						pi_cash.uuid as pi_cash_uuid
					FROM commercial.pi_cash 
						LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
						LEFT JOIN thread.order_entry ON pi_cash_entry.thread_order_entry_uuid = order_entry.uuid 
					GROUP BY pi_cash.uuid

				) as total_pi_amount_thread ON total_pi_amount_thread.pi_cash_uuid = cash_receive.pi_cash_uuid
			ORDER BY cash_receive.created_at DESC
	`;
	// const cashReceivePromise = db.select(cash_receive).from(cash_receive);

	const cashReceivePromise = db.execute(query);

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'cash_receive list',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// const cashReceivePromise = db
	// 	.select(cash_receive)
	// 	.from(cash_receive)
	// 	.where(eq(cash_receive.uuid, req.params.uuid));

	const query = sql`
				SELECT
					cash_receive.uuid,
					cash_receive.pi_cash_uuid,
					CASE 
						WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
						ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
					END AS pi_cash_id,
					pi_cash.receive_amount::float8,
					cash_receive.amount::float8,
					CASE 
						WHEN pi_cash.is_pi = 1 
						THEN ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) 
						ELSE ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) * pi_cash.conversion_rate::float8 END AS total_amount,
					cash_receive.created_by,
					hr.users.name AS created_by_name,
					cash_receive.created_at,
					cash_receive.updated_at,
					cash_receive.remarks
				FROM
					commercial.cash_receive
				LEFT JOIN
					hr.users ON cash_receive.created_by = hr.users.uuid
				LEFT JOIN
					commercial.pi_cash ON cash_receive.pi_cash_uuid = commercial.pi_cash.uuid
				LEFT JOIN
					(
						SELECT 
							(
								SUM(
									coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)
								)
							)::float8 as total_amount, 
							pi_cash.uuid as pi_cash_uuid
						FROM commercial.pi_cash 
							LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
							LEFT JOIN thread.order_entry ON pi_cash_entry.thread_order_entry_uuid = order_entry.uuid 
						GROUP BY pi_cash.uuid
					) as total_pi_amount ON total_pi_amount.pi_cash_uuid = cash_receive.pi_cash_uuid
				LEFT JOIN
				(
					SELECT 
						(
							SUM(
								coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)
							)
						)::float8 as total_amount, 
						pi_cash.uuid as pi_cash_uuid
					FROM commercial.pi_cash 
						LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
						LEFT JOIN thread.order_entry ON pi_cash_entry.thread_order_entry_uuid = order_entry.uuid 
					GROUP BY pi_cash.uuid

				) as total_pi_amount_thread ON total_pi_amount_thread.pi_cash_uuid = cash_receive.pi_cash_uuid
				WHERE cash_receive.uuid = ${req.params.uuid}
	`;

	const cashReceivePromise = db.execute(query);

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `cash_receive`,
		};

		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
