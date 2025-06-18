import { eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { dyed_tape_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(dyed_tape_transaction)
		.values(req.body)
		.returning({
			insertedUuid: dyed_tape_transaction.uuid,
		});

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(dyed_tape_transaction)
		.set(req.body)
		.where(eq(dyed_tape_transaction.uuid, req.params.uuid))
		.returning({ updatedUuid: dyed_tape_transaction.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(dyed_tape_transaction)
		.where(eq(dyed_tape_transaction.uuid, req.params.uuid))
		.returning({ deletedUuid: dyed_tape_transaction.uuid });

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from_date, to_date } = req.query;

	const query = sql`
		SELECT
			dtt.uuid AS uuid,
			dtt.order_description_uuid AS order_description_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_type,
			dtt.colors as colors,
			dtt.trx_quantity::float8 AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks,
			dtt.sfg_uuid as sfg_uuid,
			oe.color,
			oe.color_ref,
			oe.style,
			CONCAT(oe.color, ' - ', oe.style) as color_style,
			dtt.trx_quantity_in_meter::float8
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details vod ON dtt.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.sfg sfg ON dtt.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		WHERE 
			${from_date && to_date ? sql`DATE(dtt.created_at) BETWEEN ${from_date} AND ${to_date}` : sql`TRUE`}
		ORDER BY dtt.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'dyed_tape_transaction list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const query = sql`
		SELECT
			dtt.uuid AS uuid,
			dtt.order_description_uuid AS order_description_uuid,
			vodf.order_number as order_number,
			vodf.item_description as item_description,
			vodf.order_type,
			dtt.colors as colors,
			dtt.trx_quantity::float8 AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks,
			dtt.sfg_uuid as sfg_uuid,
			oe.color,
			oe.color_ref,
			oe.style,
			CONCAT(oe.color, ' - ', oe.style) as color_style,
			dtt.trx_quantity_in_meter::float8,
			CASE WHEN vodf.is_multi_color = 1 THEN vodf.multi_color_tape_received ELSE coalesce(batch_stock.stock,0)::float8 END as stock,
			CASE WHEN vodf.is_multi_color = 1 THEN vodf.multi_color_tape_received - vodf.tape_transferred::float8 ELSE coalesce(batch_stock.stock,0)::float8 - vodf.tape_transferred::float8 END + dtt.trx_quantity::float8 as max_trx_quantity
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details_full vodf ON dtt.order_description_uuid = vodf.order_description_uuid
			LEFT JOIN zipper.sfg sfg ON dtt.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			LEFT JOIN (
					SELECT oe.order_description_uuid, SUM(be.production_quantity_in_kg) as stock
					FROM zipper.order_entry oe
						LEFT JOIN zipper.sfg ON oe.uuid = sfg.order_entry_uuid
						LEFT JOIN zipper.dyeing_batch_entry be ON be.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.dyeing_batch b ON b.uuid = be.dyeing_batch_uuid
					WHERE b.received = 1
					GROUP BY oe.order_description_uuid
				) batch_stock ON vodf.order_description_uuid = batch_stock.order_description_uuid
		WHERE dtt.uuid = ${req.params.uuid}
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'dyed_tape_transaction list',
		};

		return res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDyedTapeTransactionBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { nylon_stopper } = req.body;
	const query = sql`
		SELECT
			dtt.uuid AS uuid,
			dtt.order_description_uuid AS order_description_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			vod.order_type,
			dtt.colors as colors,
			dtt.trx_quantity::float8 AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks,
			dtt.sfg_uuid as sfg_uuid,
			oe.color,
			oe.color_ref,
			oe.style,
			CONCAT(oe.color, ' - ', oe.style) as color_style,
			dtt.trx_quantity_in_meter::float8
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details vod ON dtt.order_description_uuid = vod.order_description_uuid
			LEFT JOIN zipper.sfg sfg ON dtt.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		WHERE lower(vod.item_name) = ${req.params.item_name}
	`;

	if (
		nylon_stopper !== undefined ||
		nylon_stopper !== null ||
		nylon_stopper !== ''
	) {
		query.append(sql`AND lower(vod.nylon_stopper_name) = ${nylon_stopper}`);
	}

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'dyed_tape_transaction list',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
