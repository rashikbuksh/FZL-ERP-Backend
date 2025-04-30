import { eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { multi_color_tape_receive } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const batchProductionPromise = db
		.insert(multi_color_tape_receive)
		.values(req.body)
		.returning({ insertedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;

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

	const batchProductionPromise = db
		.update(multi_color_tape_receive)
		.set(req.body)
		.where(eq(multi_color_tape_receive.uuid, req.params.uuid))
		.returning({ updatedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;
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

	const batchProductionPromise = db
		.delete(multi_color_tape_receive)
		.where(eq(multi_color_tape_receive.uuid, req.params.uuid))
		.returning({ deletedUuid: multi_color_tape_receive.uuid });

	try {
		const data = await batchProductionPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			mctr.uuid,
			vodf.order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			mctr.order_description_uuid,
			mctr.quantity::float8 AS quantity,
			mctr.created_by,
			u.name AS created_by_name,
			mctr.created_at,
			mctr.updated_at,
			mctr.remarks,
			mcd.expected_tape_quantity::float8 AS expected_tape_quantity

		FROM
			zipper.multi_color_tape_receive mctr
		LEFT JOIN hr.users u ON mctr.created_by = u.uuid
		LEFT JOIN zipper.v_order_details_full vodf ON mctr.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN zipper.multi_color_dashboard mcd ON mctr.order_description_uuid = mcd.order_description_uuid
		ORDER BY
			mctr.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Multi color tape receive',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			mctr.uuid,
			vodf.order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			mctr.order_description_uuid,
			mctr.quantity::float8 AS quantity,
			mctr.created_by,
			u.name AS created_by_name,
			mctr.created_at,
			mctr.updated_at,
			mctr.remarks,
			mcd.expected_tape_quantity::float8 AS expected_tape_quantity
			
		FROM
			zipper.multi_color_tape_receive mctr
		LEFT JOIN hr.users u ON mctr.created_by = u.uuid
		LEFT JOIN zipper.v_order_details_full vodf ON mctr.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN zipper.multi_color_dashboard mcd ON mctr.order_description_uuid = mcd.order_description_uuid
		WHERE
			mctr.uuid = ${req.params.uuid}
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Multi color tape receive selected',
		};

		res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
