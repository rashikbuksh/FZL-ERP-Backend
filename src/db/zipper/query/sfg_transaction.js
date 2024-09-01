import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { order_entry, sfg, sfg_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.insert(sfg_transaction)
		.values(req.body)
		.returning({ insertedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
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

	const sfgTransactionPromise = db
		.update(sfg_transaction)
		.set(req.body)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning({ updatedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
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

	const sfgTransactionPromise = db
		.delete(sfg_transaction)
		.where(eq(sfg_transaction.uuid, req.params.uuid))
		.returning({ deletedId: sfg_transaction.uuid });

	try {
		const data = await sfgTransactionPromise;
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
			uuid: sfg_transaction.uuid,
			sfg_uuid: sfg_transaction.sfg_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: order_entry.quantity,
			trx_from: sfg_transaction.trx_from,
			trx_to: sfg_transaction.trx_to,
			trx_quantity: sfg_transaction.trx_quantity,
			trx_quantity_in_kg: sfg_transaction.trx_quantity_in_kg,
			slider_item_uuid: sfg_transaction.slider_item_uuid,
			created_by: sfg_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_transaction.created_at,
			updated_at: sfg_transaction.updated_at,
			remarks: sfg_transaction.remarks,
		})
		.from(sfg_transaction)
		.leftJoin(sfg, eq(sfg_transaction.sfg_uuid, sfg.uuid))
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			hrSchema.users,
			eq(sfg_transaction.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'SFG transaction list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}
export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgTransactionPromise = db
		.select({
			uuid: sfg_transaction.uuid,
			sfg_uuid: sfg_transaction.sfg_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: order_entry.quantity,
			trx_from: sfg_transaction.trx_from,
			trx_to: sfg_transaction.trx_to,
			trx_quantity: sfg_transaction.trx_quantity,
			trx_quantity_in_kg: sfg_transaction.trx_quantity_in_kg,
			slider_item_uuid: sfg_transaction.slider_item_uuid,
			created_by: sfg_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_transaction.created_at,
			updated_at: sfg_transaction.updated_at,
			remarks: sfg_transaction.remarks,
		})
		.from(sfg_transaction)
		.leftJoin(sfg, eq(sfg_transaction.sfg_uuid, sfg.uuid))
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			hrSchema.users,
			eq(sfg_transaction.created_by, hrSchema.users.uuid)
		)
		.where(eq(sfg_transaction.uuid, req.params.uuid));

	const data = await sfgTransactionPromise;

	const toast = {
		status: 200,
		type: 'select',
		message: 'SFG Transaction',
	};

	return await res.status(200).json({ toast, data: data[0] });
}

export async function selectByTrxFrom(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_name, stopper_type } = req.query;

	const query = sql`
		SELECT
			sfg_transaction.uuid,
			sfg_transaction.sfg_uuid,
			sfg.order_entry_uuid,
			vodf.order_description_uuid,
			vodf.order_number, 
			vodf.item_description, 
			concat(oe.style, '-', oe.color, '-', oe.size) AS style_color_size, 
			oe.quantity as order_quantity,
			sfg_transaction.trx_from,
			sfg_transaction.trx_to,
			sfg_transaction.trx_quantity_in_kg,
			sfg_transaction.trx_quantity,
			sfg_transaction.created_by,
			users.name AS created_by_name,
			sfg_transaction.created_at,
			sfg_transaction.updated_at,
			sfg_transaction.remarks,
			sfg.dying_and_iron_prod,
			sfg.teeth_molding_stock,
			sfg.teeth_molding_prod,
			sfg.teeth_coloring_stock,
			sfg.teeth_coloring_prod,
			sfg.finishing_stock,
			sfg.finishing_prod,
			sfg.coloring_prod,
			sfg.warehouse,
			sfg.delivered,
			sfg.pi
		FROM
			zipper.sfg_transaction
		LEFT JOIN
			hr.users ON sfg_transaction.created_by = users.uuid
		LEFT JOIN
			zipper.sfg ON sfg_transaction.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE
			sfg_transaction.trx_from = ${req.params.trx_from}
	`;

	if (item_name) {
		query.append(sql` AND lower(vodf.item_name) = lower(${item_name})`);
	}

	if (stopper_type) {
		query.append(
			sql` AND lower(vodf.stopper_type_name) = lower(${stopper_type})`
		);
	}

	const sfgProductionPromise = db.execute(query);

	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'SFG Transaction',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
