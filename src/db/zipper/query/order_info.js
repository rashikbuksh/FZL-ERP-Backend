import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { desc, eq, sql } from 'drizzle-orm';
import * as hrSchema from '../../hr/schema.js';
import * as publicSchema from '../../public/schema.js';
import { order_info } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';
import { GetMarketingOwnUUID } from '../../variables.js';

const snoFromHeadOfficeBy = alias(hrSchema.users, 'sno_from_head_office_by');
const receiveByFactoryBy = alias(hrSchema.users, 'receive_by_factory_by');
const productionPauseBy = alias(hrSchema.users, 'production_pause_by');

export async function insert(req, res, next) {
	if (!validateRequest(req, next)) return;

	const {
		uuid,
		buyer_uuid,
		party_uuid,
		reference_order_info_uuid,
		marketing_uuid,
		merchandiser_uuid,
		factory_uuid,
		is_sample,
		is_bill,
		is_cash,
		conversion_rate,
		marketing_priority,
		factory_priority,
		status,
		created_by,
		created_at,
		remarks,
		print_in,
		is_cancelled,
		sno_from_head_office,
		sno_from_head_office_time,
		sno_from_head_office_by,
		receive_by_factory,
		receive_by_factory_time,
		receive_by_factory_by,
		production_pause,
		production_pause_time,
		production_pause_by,
		is_swatch_attached,
	} = req.body;

	const orderInfoPromise = db
		.insert(order_info)
		.values({
			uuid,
			buyer_uuid,
			party_uuid,
			reference_order_info_uuid,
			marketing_uuid,
			merchandiser_uuid,
			factory_uuid,
			is_sample,
			is_bill,
			is_cash,
			conversion_rate,
			marketing_priority,
			factory_priority,
			status,
			created_by,
			created_at,
			remarks,
			print_in,
			is_cancelled,
			sno_from_head_office,
			sno_from_head_office_time,
			sno_from_head_office_by,
			receive_by_factory,
			receive_by_factory_time,
			receive_by_factory_by,
			production_pause,
			production_pause_time,
			production_pause_by,
			is_swatch_attached,
		})
		.returning({
			insertedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 200,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		buyer_uuid,
		party_uuid,
		reference_order_info_uuid,
		marketing_uuid,
		merchandiser_uuid,
		factory_uuid,
		is_sample,
		is_bill,
		is_cash,
		conversion_rate,
		marketing_priority,
		factory_priority,
		status,
		created_by,
		created_at,
		updated_at,
		remarks,
		print_in,
		is_cancelled,
		sno_from_head_office,
		sno_from_head_office_time,
		sno_from_head_office_by,
		receive_by_factory,
		receive_by_factory_time,
		receive_by_factory_by,
		production_pause,
		production_pause_time,
		production_pause_by,
		is_swatch_attached,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			buyer_uuid,
			party_uuid,
			reference_order_info_uuid,
			marketing_uuid,
			merchandiser_uuid,
			factory_uuid,
			is_sample,
			is_bill,
			is_cash,
			conversion_rate,
			marketing_priority,
			factory_priority,
			status,
			created_by,
			created_at,
			updated_at,
			remarks,
			print_in,
			is_cancelled,
			sno_from_head_office,
			sno_from_head_office_time,
			sno_from_head_office_by,
			receive_by_factory,
			receive_by_factory_time,
			receive_by_factory_by,
			production_pause,
			production_pause_time,
			production_pause_by,
			is_swatch_attached,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			deletedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const result = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${result[0].deletedId} deleted`,
		};

		return res.status(201).json({ toast, data: result[0].deletedId });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const orderInfoPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			order_number: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			reference_order_info_uuid: order_info.reference_order_info_uuid,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			is_cash: order_info.is_cash,
			conversion_rate: order_info.conversion_rate,
			marketing_priority: order_info.marketing_priority,
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
			print_in: order_info.print_in,
			is_cancelled: order_info.is_cancelled,
			sno_from_head_office: order_info.sno_from_head_office,
			sno_from_head_office_time: order_info.sno_from_head_office_time,
			sno_from_head_office_by: order_info.sno_from_head_office_by,
			sno_from_head_office_by_name: snoFromHeadOfficeBy.name,
			receive_by_factory: order_info.receive_by_factory,
			receive_by_factory_time: order_info.receive_by_factory_time,
			receive_by_factory_by: order_info.receive_by_factory_by,
			receive_by_factory_by_name: receiveByFactoryBy.name,
			production_pause: order_info.production_pause,
			production_pause_time: order_info.production_pause_time,
			production_pause_by: order_info.production_pause_by,
			production_pause_by_name: productionPauseBy.name,
			is_swatch_attached: order_info.is_swatch_attached,
		})
		.from(order_info)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(order_info.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			snoFromHeadOfficeBy,
			eq(order_info.sno_from_head_office_by, snoFromHeadOfficeBy.uuid)
		)
		.leftJoin(
			receiveByFactoryBy,
			eq(order_info.receive_by_factory_by, receiveByFactoryBy.uuid)
		)
		.leftJoin(
			productionPauseBy,
			eq(order_info.production_pause_by, productionPauseBy.uuid)
		)
		.orderBy(desc(order_info.created_at));

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			reference_order_info_uuid: order_info.reference_order_info_uuid,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			is_cash: order_info.is_cash,
			conversion_rate: order_info.conversion_rate,
			marketing_priority: order_info.marketing_priority,
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
			print_in: order_info.print_in,
			is_cancelled: order_info.is_cancelled,
			sno_from_head_office: order_info.sno_from_head_office,
			sno_from_head_office_time: order_info.sno_from_head_office_time,
			sno_from_head_office_by: order_info.sno_from_head_office_by,
			sno_from_head_office_by_name: snoFromHeadOfficeBy.name,
			receive_by_factory: order_info.receive_by_factory,
			receive_by_factory_time: order_info.receive_by_factory_time,
			receive_by_factory_by: order_info.receive_by_factory_by,
			receive_by_factory_by_name: receiveByFactoryBy.name,
			production_pause: order_info.production_pause,
			production_pause_time: order_info.production_pause_time,
			production_pause_by: order_info.production_pause_by,
			production_pause_by_name: productionPauseBy.name,
			is_swatch_attached: order_info.is_swatch_attached,
		})
		.from(order_info)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(order_info.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			snoFromHeadOfficeBy,
			eq(order_info.sno_from_head_office_by, snoFromHeadOfficeBy.uuid)
		)
		.leftJoin(
			receiveByFactoryBy,
			eq(order_info.receive_by_factory_by, receiveByFactoryBy.uuid)
		)
		.leftJoin(
			productionPauseBy,
			eq(order_info.production_pause_by, productionPauseBy.uuid)
		)
		.where(eq(order_info.uuid, req.params.uuid));

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Info',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetails(req, res, next) {
	const { all, approved, type, own_uuid } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
        SELECT 
			vod.order_number_wise_rank,
            vod.is_sample,
			vod.order_info_uuid,
			vod.order_number,
			vod.party_name,
			vod.item_description,
			vod.order_description_uuid,
			vod.order_type,
			vod.is_multi_color,
			vod.is_inch,
			vod.marketing_name,
			vod.is_marketing_checked,
			vod.marketing_checked_at,
			vod.buyer_name,
			vod.remarks,
			vod.created_by_name,
			vod.order_description_created_at,
			vod.order_description_updated_at,
            COUNT(*) OVER (PARTITION BY vod.order_number) AS order_number_wise_count,
            COALESCE(oe_stats.swatch_approval_count, 0) AS swatch_approval_count,
            COALESCE(oe_stats.order_entry_count, 0) AS order_entry_count,
            COALESCE(oe_stats.price_approval_count, 0) AS price_approval_count,
            CASE WHEN COALESCE(oe_stats.swatch_approval_count, 0) > 0 THEN 1 ELSE 0 END AS is_swatch_approved
        FROM zipper.v_order_details vod
        LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
        LEFT JOIN (
            SELECT 
				COUNT(oe.swatch_approval_date) AS swatch_approval_count, 
				COUNT(*) AS order_entry_count, 
				COUNT(CASE WHEN oe.party_price > 0 AND oe.company_price > 0 THEN 1 END) AS price_approval_count,
				oe.order_description_uuid
			FROM zipper.order_entry oe
			GROUP BY oe.order_description_uuid
        ) oe_stats ON vod.order_description_uuid = oe_stats.order_description_uuid
        WHERE vod.order_description_uuid IS NOT NULL 
            ${
				approved === 'true'
					? sql` AND oe_stats.swatch_approval_count > 0`
					: sql``
			}
            ${
				type === 'bulk'
					? sql` AND vod.is_sample = 0`
					: type === 'sample'
						? sql` AND vod.is_sample = 1`
						: sql``
			}
            ${own_uuid ? sql` AND vod.marketing_uuid = ${marketingUuid}` : sql``}
        ORDER BY vod.order_description_created_at DESC, vod.order_number_wise_rank ASC`;

		const orderInfoPromise = db.execute(query);

		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		const combinedData = {
			toast,
			data: data?.rows,
		};

		return combinedData;
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getTapeAssigned(req, res, next) {
	const { type } = req.query;
	const query = sql`
					SELECT 
						vodf.order_number,
						vodf.party_uuid,
						vodf.party_name,
						vodf.item_description,
						vodf.description,
						vodf.item,
						vodf.item_name,
						vodf.zipper_number,
						vodf.zipper_number_name,
						vodf.is_multi_color,
						vodf.tape_coil_uuid,
						vodf.order_description_uuid,
						vodf.is_sample,
						vodf.order_number_wise_rank,
						vodf.is_cancelled,
						order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
						swatch_approval_counts.swatch_approval_count,
						order_entry_counts.order_entry_count,
						CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved,
						vodf.is_swatch_attached
					FROM zipper.v_order_details_full vodf
					LEFT JOIN (
						SELECT order_number, COUNT(*) AS order_number_wise_count
						FROM zipper.v_order_details_full
						GROUP BY order_number
					) order_number_wise_counts
					ON vodf.order_number = order_number_wise_counts.order_number
					LEFT JOIN zipper.order_info oi ON vodf.order_info_uuid = oi.uuid
					LEFT JOIN (
						SELECT COUNT(oe.swatch_approval_date) AS swatch_approval_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) swatch_approval_counts ON vodf.order_description_uuid = swatch_approval_counts.order_description_uuid
					 LEFT JOIN (
						SELECT COUNT(*) AS order_entry_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) order_entry_counts ON vodf.order_description_uuid = order_entry_counts.order_description_uuid
					WHERE vodf.order_description_uuid IS NOT NULL 
							AND vodf.is_multi_color = 0 
							AND vodf.order_type != 'slider' 
							${
								type === 'bulk_pending'
									? sql`AND vodf.tape_coil_uuid IS NULL AND vodf.is_sample = 0`
									: type === 'bulk_completed'
										? sql`AND vodf.tape_coil_uuid IS NOT NULL AND vodf.is_sample = 0`
										: type === 'sample_pending'
											? sql`AND vodf.tape_coil_uuid IS NULL AND vodf.is_sample = 1`
											: type === 'sample_completed'
												? sql`AND vodf.tape_coil_uuid IS NOT NULL AND vodf.is_sample = 1`
												: type === 'bulk_all'
													? sql`AND vodf.is_sample = 0`
													: type === 'sample_all'
														? sql`AND vodf.is_sample = 1`
														: sql`AND 1=1`
							}
							AND vodf.is_cancelled = false
					ORDER BY 
						vodf.order_number_wise_rank asc,
						vodf.tape_coil_uuid ASC NULLS FIRST,
						vodf.order_number DESC,
						vodf.item_description ASC;`;

	const tapeAssignedPromise = db.execute(query);

	try {
		const data = await tapeAssignedPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Tape Assigned list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsByOwnUuid(req, res, next) {
	const { own_uuid } = req.params;
	const { approved, type } = req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
					SELECT 
						vod.order_number_wise_rank,
						vod.is_sample,
						vod.order_info_uuid,
						vod.order_number,
						vod.party_name,
						vod.item_description,
						vod.order_description_uuid,
						vod.order_type,
						vod.is_multi_color,
						vod.is_inch,
						vod.marketing_name,
						vod.is_marketing_checked,
						vod.marketing_checked_at,
						vod.buyer_name,
						vod.remarks,
						vod.created_by_name,
						vod.order_description_created_at,
						vod.order_description_updated_at,
						order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
						all_approval_counts.swatch_approval_count,
						all_approval_counts.order_entry_count,
						CASE WHEN all_approval_counts.price_approval_count IS NULL THEN 0 ELSE all_approval_counts.price_approval_count END AS price_approval_count,
						CASE WHEN all_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved
					FROM zipper.v_order_details vod
					LEFT JOIN (
						SELECT order_number, COUNT(*) AS order_number_wise_count
						FROM zipper.v_order_details
						GROUP BY order_number
					) order_number_wise_counts
					ON vod.order_number = order_number_wise_counts.order_number
					LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
					LEFT JOIN (
						SELECT COUNT(oe.swatch_approval_date) AS swatch_approval_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) swatch_approval_counts ON vod.order_description_uuid = swatch_approval_counts.order_description_uuid
					 LEFT JOIN (
						SELECT COUNT(*) AS order_entry_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) order_entry_counts ON vod.order_description_uuid = order_entry_counts.order_description_uuid
					WHERE vod.order_description_uuid IS NOT NULL 
						AND oi.marketing_uuid = ${marketingUuid} AND ${
							approved === 'true'
								? sql`swatch_approval_counts.swatch_approval_count > 0`
								: sql`1=1`
						}
						${
							type === 'bulk'
								? sql`AND vod.is_sample = 0`
								: type === 'sample'
									? sql`AND vod.is_sample = 1`
									: sql`AND 1=1`
						}
					ORDER BY vod.order_description_created_at DESC;`;

		const orderInfoPromise = db.execute(query);

		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updatePrintIn(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { print_in } = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			print_in,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSendFromHeadOffice(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		sno_from_head_office,
		sno_from_head_office_time,
		sno_from_head_office_by,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			sno_from_head_office,
			sno_from_head_office_time,
			sno_from_head_office_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateReceiveByFactory(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		receive_by_factory,
		receive_by_factory_time,
		receive_by_factory_by,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			receive_by_factory,
			receive_by_factory_time,
			receive_by_factory_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateProductionPause(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { production_pause, production_pause_time, production_pause_by } =
		req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			production_pause,
			production_pause_time,
			production_pause_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchAttachment(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { is_swatch_attached } = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			is_swatch_attached,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderInfoLogs(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { order_info_uuid } = req.params;

	const query = sql`
		SELECT 
			oil.id,
			oil.order_info_uuid,
			oil.field_name,
			oil.old_value,
			oil.new_value,
			oil.operation,
			oil.changed_by,
			users.name AS changed_by_name,
			oil.changed_at,
			oil.remarks
		FROM 
			zipper.order_info_log oil
		LEFT JOIN 
			hr.users ON oil.changed_by = users.uuid
		WHERE 
			oil.order_info_uuid = ${order_info_uuid}
		ORDER BY 
			oil.changed_at DESC, oil.id DESC
	`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info Change Logs',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAllOrderInfoLogs(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { limit = 100, offset = 0 } = req.query;

	const query = sql`
		SELECT 
			oil.id,
			oil.order_info_uuid,
			CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', oi.id::text) AS order_number,
			oil.field_name,
			oil.old_value,
			oil.new_value,
			oil.operation,
			oil.changed_by,
			users.name AS changed_by_name,
			oil.changed_at,
			oil.remarks
		FROM 
			zipper.order_info_log oil
		LEFT JOIN 
			hr.users ON oil.changed_by = users.uuid
		LEFT JOIN
			zipper.order_info oi ON oil.order_info_uuid = oi.uuid
		ORDER BY 
			oil.changed_at DESC, oil.id DESC
		LIMIT ${limit}
		OFFSET ${offset}
	`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All Order Info Change Logs',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
