import { asc, desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { challan_entry, order_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(challan_entry)
		.values(req.body)
		.returning({ insertedId: challan_entry.uuid });

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
		.update(challan_entry)
		.set(req.body)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ updatedId: challan_entry.uuid });

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
	if (!(await validateRequest(req, next))) return;
	const resultPromise = db
		.delete(challan_entry)
		.where(eq(challan_entry.uuid, req.params.uuid))
		.returning({ deletedId: challan_entry.uuid });

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
			uuid: challan_entry.uuid,
			challan_uuid: challan_entry.challan_uuid,
			order_entry_uuid: challan_entry.order_entry_uuid,
			quantity: decimalToNumber(challan_entry.quantity),
			short_quantity: decimalToNumber(challan_entry.short_quantity),
			reject_quantity: decimalToNumber(challan_entry.reject_quantity),
			created_by: challan_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(
			hrSchema.users,
			eq(challan_entry.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(challan_entry.created_at));

	const toast = {
		status: 200,
		type: 'select all',
		message: 'challan_entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: challan_entry.uuid,
			challan_uuid: challan_entry.challan_uuid,
			order_entry_uuid: challan_entry.order_entry_uuid,
			quantity: decimalToNumber(challan_entry.quantity),
			short_quantity: decimalToNumber(challan_entry.short_quantity),
			reject_quantity: decimalToNumber(challan_entry.reject_quantity),
			created_by: challan_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan_entry.created_at,
			updated_at: challan_entry.updated_at,
			remarks: challan_entry.remarks,
		})
		.from(challan_entry)
		.leftJoin(
			hrSchema.users,
			eq(challan_entry.created_by, hrSchema.users.uuid)
		)
		.where(eq(challan_entry.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan_entry',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadChallanEntryByChallanUuid(req, res, next) {
	const query = sql`
		SELECT
			challan_entry.uuid,
			challan_entry.order_entry_uuid,
			challan_entry.quantity::float8,
			challan_entry.short_quantity::float8,
			challan_entry.reject_quantity::float8,
			challan_entry.created_at,
			challan_entry.updated_at,
			order_entry.count_length_uuid,
			concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			count_length.count,
			count_length.length,
			order_entry.quantity::float8 as order_quantity,
			order_entry.style,
			order_entry.color,
			order_entry.po,
			order_entry.bleaching,
			order_entry.recipe_uuid,
			order_entry.delivered::float8,
			order_entry.warehouse::float8,
			(order_entry.quantity::float8 - order_entry.delivered::float8) as balance_quantity,
			order_entry.warehouse::float8 + challan_entry.quantity::float8 as max_quantity,
			true AS is_checked
		FROM
			thread.challan_entry
		LEFT JOIN
			thread.order_entry ON challan_entry.order_entry_uuid = order_entry.uuid
		LEFT JOIN
			thread.count_length ON order_entry.count_length_uuid = count_length.uuid
		LEFT JOIN 
			thread.order_info ON order_entry.order_info_uuid = order_info.uuid
		WHERE
			challan_entry.challan_uuid = ${req.params.challan_uuid}
		ORDER BY
			challan_entry.created_at ASC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan_entry',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
