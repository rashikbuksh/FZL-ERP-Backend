import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { tape_coil_to_dyeing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// check if tape_coil_uuid exists in order_description table
	const query = sql`
		SELECT
			tape_coil_uuid, order_number, item_description
		FROM
			zipper.v_order_details_full vodf
		WHERE
			vodf.order_description_uuid = ${req.body.order_description_uuid}
	`;

	const resultPromise = db
		.insert(tape_coil_to_dyeing)
		.values(req.body)
		.returning({ insertedId: tape_coil_to_dyeing.tape_coil_uuid });

	try {
		const data = await resultPromise;

		const tapeCoilUuid = await db.execute(query);

		if (tapeCoilUuid?.rows[0]?.tape_coil_uuid == null) {
			// update the tape_coil_uuid in order_description table
			const updateQuery = sql`
				UPDATE
					zipper.order_description
				SET
					tape_coil_uuid = ${data[0].insertedId}
				WHERE
					uuid = ${req.body.order_description_uuid}
			`;
			await db.execute(updateQuery);
		}

		const toast = {
			status: 201,
			type: 'insert',
			message: `${tapeCoilUuid.rows[0].order_number} - ${tapeCoilUuid.rows[0].item_description} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(tape_coil_to_dyeing)
		.set(req.body)
		.where(eq(tape_coil_to_dyeing.uuid, req.params.uuid))
		.returning({ updatedId: tape_coil_to_dyeing.uuid });

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
		.delete(tape_coil_to_dyeing)
		.where(eq(tape_coil_to_dyeing.uuid, req.params.uuid))
		.returning({ deletedId: tape_coil_to_dyeing.uuid });

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
	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.item_uuid,
			tape_coil.name,
			item_properties.name AS item_name,
			tape_coil.zipper_number_uuid,
			zipper_number_properties.name AS zipper_number_name,
			tape_coil.quantity as tape_prod,
				 coalesce(tape_coil.quantity, 0) + coalesce(tape_coil_to_dyeing.trx_quantity, 0) AS max_trf_qty
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
		ORDER BY
			tape_coil_to_dyeing.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.item_uuid,
			tape_coil.name,
			item_properties.name AS item_name,
			tape_coil.zipper_number_uuid,
			zipper_number_properties.name AS zipper_number_name,
			concat(item_properties.name, ' - ', zipper_number_properties.name) as type_of_zipper,
			tape_coil.quantity as tape_prod,
			CASE WHEN lower(item_properties.name) = 'nylon' THEN coalesce(tape_coil.quantity_in_coil, 0) + coalesce(tape_coil_to_dyeing.trx_quantity, 0) 
			ELSE coalesce(tape_coil.quantity, 0) + coalesce(tape_coil_to_dyeing.trx_quantity, 0) END AS max_trf_qty
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
		WHERE
			tape_coil_to_dyeing.uuid = ${req.params.uuid}
		ORDER BY
			tape_coil_to_dyeing.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTapeCoilToDyeingByNylon(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.item_uuid,
			tape_coil.name,
			item_properties.name AS item_name,
			tape_coil.zipper_number_uuid,
			zipper_number_properties.name AS zipper_number_name,
			concat(item_properties.name, ' - ', zipper_number_properties.name) as type_of_zipper,
			tape_coil.quantity as tape_prod,
				 coalesce(tape_coil.quantity, 0) + coalesce(tape_coil_to_dyeing.trx_quantity, 0) AS max_trf_qty
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
		WHERE
			lower(item_properties.name) = 'nylon'
		ORDER BY
			tape_coil_to_dyeing.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTapeCoilToDyeingForTape(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			tape_coil_to_dyeing.uuid,
			tape_coil_to_dyeing.tape_coil_uuid,
			tape_coil_to_dyeing.order_description_uuid,
			tape_coil_to_dyeing.trx_quantity,
			tape_coil_to_dyeing.created_by,
			users.name AS created_by_name,
			tape_coil_to_dyeing.created_at,
			tape_coil_to_dyeing.updated_at,
			tape_coil_to_dyeing.remarks,
			vod.order_number,
			vod.item_description,
			tape_coil.item_uuid,
			tape_coil.name,
			item_properties.name AS item_name,
			tape_coil.zipper_number_uuid,
			zipper_number_properties.name AS zipper_number_name,
			concat(item_properties.name, ' - ', zipper_number_properties.name) as type_of_zipper,
			tape_coil.quantity as tape_prod,
				 coalesce(tape_coil.quantity, 0) + coalesce(tape_coil_to_dyeing.trx_quantity, 0) AS max_trf_qty
		FROM
			zipper.tape_coil_to_dyeing
		LEFT JOIN
			hr.users ON tape_coil_to_dyeing.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON tape_coil_to_dyeing.order_description_uuid = vod.order_description_uuid
		LEFT JOIN zipper.tape_coil ON tape_coil_to_dyeing.tape_coil_uuid = tape_coil.uuid
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
		WHERE
			lower(item_properties.name) != 'nylon metallic' OR lower(item_properties.name) != 'nylon plastic'
		ORDER BY
			tape_coil_to_dyeing.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_to_dyeing detail',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
