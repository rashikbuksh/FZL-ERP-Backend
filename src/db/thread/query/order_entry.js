import { asc, eq, inArray, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import { decimalToNumber } from '../../variables.js';
import { count_length, order_entry, order_info } from '../schema.js';
import { order_entry_log } from '../../zipper/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(order_entry)
		.values(req.body)
		.returning({ insertedId: order_entry.uuid });

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
		.update(order_entry)
		.set(req.body)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedId: order_entry.order_info_uuid });

	try {
		const data = await resultPromise;

		const order_info_number = db
			.select({
				updatedId: sql`concat('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', order_info.id::text)`,
			})
			.from(order_info)
			.where(eq(order_info.uuid, data[0].updatedId));

		const orderInfoNumber = await order_info_number;

		const toast = {
			status: 201,
			type: 'update',
			message: `${orderInfoNumber[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const orderEntryLogPromise = db
		.delete(order_entry_log)
		.where(eq(order_entry_log.thread_order_entry_uuid, req.params.uuid))
		.returning({ deletedIdOrderEntryLog: order_entry_log.id });

	const resultPromise = db
		.delete(order_entry)
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ deletedId: order_entry.uuid });

	try {
		await orderEntryLogPromise;
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
			uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			color_ref: order_entry.color_ref,
			color_ref_entry_date: order_entry.color_ref_entry_date,
			color_ref_update_date: order_entry.color_ref_update_date,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.orderBy(asc(order_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			color_ref: order_entry.color_ref,
			color_ref_entry_date: order_entry.color_ref_entry_date,
			color_ref_update_date: order_entry.color_ref_update_date,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.where(eq(order_entry.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry',
		};
		return await res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntryByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: order_entry.uuid,
			order_entry_uuid: order_entry.uuid,
			order_info_uuid: order_entry.order_info_uuid,
			lab_reference: order_entry.lab_reference,
			color: order_entry.color,
			color_ref: order_entry.color_ref,
			color_ref_entry_date: order_entry.color_ref_entry_date,
			color_ref_update_date: order_entry.color_ref_update_date,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			po: order_entry.po,
			style: order_entry.style,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			max_weight: count_length.max_weight,
			min_weight: count_length.min_weight,
			cone_per_carton: count_length.cone_per_carton,
			quantity: decimalToNumber(order_entry.quantity),
			company_price: decimalToNumber(order_entry.company_price),
			party_price: decimalToNumber(order_entry.party_price),
			swatch_approval_date: order_entry.swatch_approval_date,
			production_quantity: decimalToNumber(
				order_entry.production_quantity
			),
			bleaching: order_entry.bleaching,
			transfer_quantity: decimalToNumber(order_entry.transfer_quantity),
			carton_quantity: decimalToNumber(order_entry.carton_quantity),
			created_by: order_entry.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry.created_at,
			updated_at: order_entry.updated_at,
			remarks: order_entry.remarks,
			pi: decimalToNumber(order_entry.pi),
			delivered: decimalToNumber(order_entry.delivered),
			warehouse: decimalToNumber(order_entry.warehouse),
			short_quantity: decimalToNumber(order_entry.short_quantity),
			reject_quantity: decimalToNumber(order_entry.reject_quantity),
			production_quantity_in_kg: decimalToNumber(
				order_entry.production_quantity_in_kg
			),
			carton_quantity: order_entry.carton_quantity,
			index: order_entry.index,
			damage_quantity: decimalToNumber(order_entry.damage_quantity),
			batch_quantity: decimalToNumber(
				sql`COALESCE(batch.total_batch_quantity, 0)`
			),
		})
		.from(order_entry)
		.leftJoin(
			hrSchema.users,
			eq(order_entry.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.leftJoin(
			sql`
				(
					SELECT 
						batch_entry.order_entry_uuid,
						SUM(batch_entry.quantity) AS total_batch_quantity
					FROM thread.batch_entry
					GROUP BY batch_entry.order_entry_uuid
				) AS batch
			`,
			sql`batch.order_entry_uuid = order_entry.uuid`
		)
		.where(eq(order_entry.order_info_uuid, req.params.order_info_uuid))
		.orderBy(asc(order_entry.index));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadSwatchApprovalReceived(req, res, next) {
	const { type, order_type } = req.query;

	const query = sql`
	SELECT 
		order_info.uuid as order_info_uuid,
		CONCAT('ST', 
			CASE 
				WHEN order_info.is_sample = 1 THEN 'S' 
				ELSE '' 
			END, 
			TO_CHAR(order_info.created_at, 'YY'), '-', 
			(order_info.id::text)
		) AS order_number,
		order_entry.uuid,
		order_entry.style,
		order_entry.color,
		order_entry.color_ref,
		order_entry.recipe_uuid,
		lab_dip_recipe.name AS recipe_name,
		order_entry.bleaching,
		order_entry.count_length_uuid,
		count_length.count,
		count_length.length,
		CONCAT(count_length.count, ' - ', count_length.length) AS count_length_name,
		order_entry.quantity::float8 AS order_quantity,
		order_info.created_at,
		order_info.updated_at,
		order_info.remarks,
		order_entry.swatch_approval_date,
		COALESCE(batch_status.is_batch_created, FALSE) AS is_batch_created,
		order_info.is_cancelled,
		order_info.sno_from_head_office,
		order_info.sno_from_head_office_time,
		order_info.receive_by_factory,
		order_info.receive_by_factory_time,
		order_info.receive_by_factory_by,
		order_info.production_pause,
		order_info.is_swatch_attached,
		order_entry.swatch_approval_received,
		order_entry.swatch_approval_received_date,
		order_entry.swatch_approval_received_by,
		swatch_approval_received_by.name AS swatch_approval_received_by_name
	FROM 
		thread.order_info
	LEFT JOIN 
		thread.order_entry ON order_info.uuid = order_entry.order_info_uuid
	LEFT JOIN 
		thread.count_length ON order_entry.count_length_uuid = count_length.uuid
	LEFT JOIN 
		lab_dip.recipe AS lab_dip_recipe ON order_entry.recipe_uuid = lab_dip_recipe.uuid
	LEFT JOIN (
		SELECT 
			batch_entry.order_entry_uuid,
			CASE 
				WHEN SUM(batch_entry.quantity) > 0 THEN TRUE 
				ELSE FALSE 
			END AS is_batch_created
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) AS batch_status ON order_entry.uuid = batch_status.order_entry_uuid
	LEFT JOIN hr.users swatch_approval_received_by ON order_entry.swatch_approval_received_by = swatch_approval_received_by.uuid
	WHERE 
		order_info.is_cancelled = FALSE
		AND order_info.production_pause = FALSE
		AND order_info.receive_by_factory = TRUE
		${
			type === 'pending'
				? sql` AND order_entry.swatch_approval_received = FALSE`
				: type === 'completed'
					? sql` AND order_entry.swatch_approval_received = TRUE`
					: sql``
		}
		${
			order_type === 'complete_order'
				? sql` AND order_entry.quantity <= order_entry.delivered AND order_entry.swatch_approval_received = TRUE`
				: order_type === 'incomplete_order'
					? sql` AND order_entry.quantity > order_entry.delivered`
					: sql``
		}
	ORDER BY 
		order_entry.created_at DESC, 
		order_info.created_at DESC, 
		order_entry.uuid ASC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Swatch',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchApprovalReceivedByUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		swatch_approval_received,
		swatch_approval_received_date,
		swatch_approval_received_by,
		updated_by,
		updated_at,
	} = req.body;

	const orderEntryPromise = db
		.update(order_entry)
		.set({
			swatch_approval_received: swatch_approval_received,
			swatch_approval_received_date: swatch_approval_received_date,
			swatch_approval_received_by: swatch_approval_received_by,
			updated_by: updated_by,
			updated_at: updated_at,
		})
		.where(eq(order_entry.uuid, req.params.uuid))
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await orderEntryPromise;
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

export async function selectThreadSwatch(req, res, next) {
	const { type, order_type } = req.query;

	const query = sql`
	SELECT 
		order_info.uuid,
		CONCAT('ST', 
			CASE 
				WHEN order_info.is_sample = 1 THEN 'S' 
				ELSE '' 
			END, 
			TO_CHAR(order_info.created_at, 'YY'), '-', 
			(order_info.id::text)
		) AS order_number,
		order_entry.uuid AS order_entry_uuid,
		order_entry.style,
		order_entry.color,
		order_entry.color_ref,
		order_entry.color_ref_entry_date,
		order_entry.color_ref_update_date,
		order_entry.recipe_uuid,
		lab_dip_recipe.name AS recipe_name,
		order_entry.bleaching,
		order_entry.count_length_uuid,
		count_length.count,
		count_length.length,
		CONCAT(count_length.count, ' - ', count_length.length) AS count_length_name,
		order_entry.quantity::float8 AS order_quantity,
		order_info.created_at,
		order_info.updated_at,
		order_info.remarks,
		order_entry.swatch_approval_date,
		COALESCE(batch_status.is_batch_created, FALSE) AS is_batch_created,
		order_info.is_cancelled,
		order_info.sno_from_head_office,
		order_info.sno_from_head_office_time,
		order_info.receive_by_factory,
		order_info.receive_by_factory_time,
		order_info.receive_by_factory_by,
		receive_by_factory_by.name AS receive_by_factory_by_name,
		order_info.production_pause,
		order_info.is_swatch_attached,
		order_entry.swatch_approval_received,
		order_entry.swatch_approval_received_date,
		order_entry.swatch_approval_received_by,
		swatch_approval_received_by.name AS swatch_approval_received_by_name
	FROM 
		thread.order_info
	LEFT JOIN 
		thread.order_entry ON order_info.uuid = order_entry.order_info_uuid
	LEFT JOIN 
		thread.count_length ON order_entry.count_length_uuid = count_length.uuid
	LEFT JOIN 
		lab_dip.recipe AS lab_dip_recipe ON order_entry.recipe_uuid = lab_dip_recipe.uuid
	LEFT JOIN (
		SELECT 
			batch_entry.order_entry_uuid,
			CASE 
				WHEN SUM(batch_entry.quantity) > 0 THEN TRUE 
				ELSE FALSE 
			END AS is_batch_created
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) AS batch_status ON order_entry.uuid = batch_status.order_entry_uuid
	LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
	LEFT JOIN hr.users swatch_approval_received_by ON order_entry.swatch_approval_received_by = swatch_approval_received_by.uuid
	WHERE 
		order_info.is_cancelled = FALSE
		AND order_info.production_pause = FALSE
		AND order_info.receive_by_factory = TRUE
		${
			type === 'pending'
				? sql`AND order_entry.recipe_uuid IS NULL`
				: type === 'completed'
					? sql`AND order_entry.recipe_uuid IS NOT NULL`
					: sql``
		}
		${
			order_type === 'complete_order'
				? sql`AND order_entry.quantity <= order_entry.delivered AND order_entry.recipe_uuid IS NOT NULL`
				: order_type === 'incomplete_order'
					? sql`AND order_entry.quantity > order_entry.delivered`
					: sql``
		}
	ORDER BY 
		order_entry.created_at DESC, 
		order_info.created_at DESC, 
		order_entry.uuid ASC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Swatch',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadSwatchBulk(req, res, next) {
	const { type, order_type } = req.query;

	const query = sql`
	SELECT 
		order_info.uuid as order_info_uuid,
		CONCAT('ST', 
			CASE 
				WHEN order_info.is_sample = 1 THEN 'S' 
				ELSE '' 
			END, 
			TO_CHAR(order_info.created_at, 'YY'), '-', 
			(order_info.id::text)
		) AS order_number,
		JSONB_AGG(order_entry.uuid) AS uuids,
		order_entry.style,
		order_entry.color,
		CASE WHEN order_entry.color_ref = '' THEN NULL ELSE order_entry.color_ref END AS color_ref,
		order_entry.recipe_uuid,
		lab_dip_recipe.name AS recipe_name,
		order_entry.bleaching,
		JSONB_AGG(order_entry.count_length_uuid) AS count_length_uuid,
		JSONB_AGG(count_length.count) AS count,
		JSONB_AGG(count_length.length) AS length,
		JSONB_AGG(CONCAT(count_length.count, ' - ', count_length.length)) AS count_length_name,
		SUM(order_entry.quantity::float8) AS order_quantity,
		order_info.created_at,
		order_info.updated_at,
		order_info.remarks,
		MAX(order_entry.swatch_approval_date) as swatch_approval_date,
		COALESCE(BOOL_OR(batch_status.is_batch_created), FALSE) AS is_batch_created,
		order_info.is_cancelled,
		order_info.sno_from_head_office,
		order_info.sno_from_head_office_time,
		order_info.receive_by_factory,
		order_info.receive_by_factory_time,
		order_info.receive_by_factory_by,
		order_info.production_pause,
		order_info.is_swatch_attached,
		order_entry.swatch_approval_received,
		order_entry.swatch_approval_received_date,
		order_entry.swatch_approval_received_by,
		swatch_approval_received_by.name AS swatch_approval_received_by_name
	FROM 
		thread.order_info
	LEFT JOIN 
		thread.order_entry ON order_info.uuid = order_entry.order_info_uuid
	LEFT JOIN 
		thread.count_length ON order_entry.count_length_uuid = count_length.uuid
	LEFT JOIN 
		lab_dip.recipe AS lab_dip_recipe ON order_entry.recipe_uuid = lab_dip_recipe.uuid
	LEFT JOIN (
		SELECT 
			batch_entry.order_entry_uuid,
			CASE 
				WHEN SUM(batch_entry.quantity) > 0 THEN TRUE 
				ELSE FALSE 
			END AS is_batch_created
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) AS batch_status ON order_entry.uuid = batch_status.order_entry_uuid
	LEFT JOIN hr.users swatch_approval_received_by ON order_entry.swatch_approval_received_by = swatch_approval_received_by.uuid
	WHERE 
		order_info.is_cancelled = FALSE
		AND order_info.production_pause = FALSE
		AND order_info.receive_by_factory = TRUE
		${
			type === 'pending'
				? sql` AND order_entry.recipe_uuid IS NULL`
				: type === 'completed'
					? sql` AND order_entry.recipe_uuid IS NOT NULL`
					: sql``
		}
		${
			order_type === 'complete_order'
				? sql` AND order_entry.quantity <= order_entry.delivered AND order_entry.recipe_uuid IS NOT NULL`
				: order_type === 'incomplete_order'
					? sql` AND order_entry.quantity > order_entry.delivered`
					: sql``
		}
	GROUP BY 
		order_info.uuid,
		order_entry.style,
		order_entry.color,
		order_entry.color_ref,
		order_entry.recipe_uuid,
		lab_dip_recipe.name,
		order_entry.bleaching,
		order_info.created_at,
		order_info.updated_at,
		order_info.remarks,
		order_entry.swatch_approval_date,
		batch_status.is_batch_created,
		order_info.is_cancelled,
		order_info.sno_from_head_office,
		order_info.sno_from_head_office_time,
		order_info.receive_by_factory,
		order_info.receive_by_factory_time,
		order_info.receive_by_factory_by,
		order_info.production_pause,
		order_info.is_swatch_attached,
		order_entry.swatch_approval_received,
		order_entry.swatch_approval_received_date,
		order_entry.swatch_approval_received_by,
		swatch_approval_received_by.name
	ORDER BY 
		order_info.created_at DESC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Swatch',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchApprovalReceivedBulkByUuids(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuids,
		swatch_approval_received,
		swatch_approval_received_date,
		swatch_approval_received_by,
		updated_by,
		updated_at,
	} = req.body;

	const orderEntryPromise = db
		.update(order_entry)
		.set({
			swatch_approval_received: swatch_approval_received,
			swatch_approval_received_date: swatch_approval_received_date,
			swatch_approval_received_by: swatch_approval_received_by,
			updated_by: updated_by,
			updated_at: updated_at,
		})
		.where(inArray(order_entry.uuid, uuids))
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await orderEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data.length} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchStatusBulkByUuids(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuids, recipe_uuid, swatch_approval_date, updated_by, updated_at } =
		req.body;

	const orderEntryPromise = db
		.update(order_entry)
		.set({
			recipe_uuid: recipe_uuid,
			swatch_approval_date: swatch_approval_date,
			updated_by: updated_by,
			updated_at: updated_at,
		})
		.where(inArray(order_entry.uuid, uuids))
		.returning({ updatedId: order_entry.uuid });

	try {
		const data = await orderEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data.length} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
