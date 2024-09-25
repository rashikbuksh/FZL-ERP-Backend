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
	const query = sql`
		SELECT
			dtt.uuid AS uuid,
			dtt.order_description_uuid AS order_description_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			dtt.colors as colors,
			dtt.trx_quantity AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details vod ON dtt.order_description_uuid = vod.order_description_uuid
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
			vod.order_number as order_number,
			vod.item_description as item_description,
			dtt.colors as colors,
			dtt.trx_quantity AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details vod ON dtt.order_description_uuid = vod.order_description_uuid
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
	const query = sql`
		SELECT
			dtt.uuid AS uuid,
			dtt.order_description_uuid AS order_description_uuid,
			vod.order_number as order_number,
			vod.item_description as item_description,
			dtt.colors as colors,
			dtt.trx_quantity AS trx_quantity,
			dtt.created_by AS created_by,
			u.name AS created_by_name,
			dtt.created_at AS created_at,
			dtt.updated_at AS updated_at,
			dtt.remarks AS remarks
		FROM zipper.dyed_tape_transaction dtt
			LEFT JOIN hr.users u ON dtt.created_by = u.uuid
			LEFT JOIN zipper.v_order_details vod ON dtt.order_description_uuid = vod.order_description_uuid
		WHERE dtt.section = ${req.params.section}
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
