import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { desc, eq, sql } from 'drizzle-orm';
import * as hrSchema from '../../hr/schema.js';
import * as publicSchema from '../../public/schema.js';
import { order_info } from '../schema.js';

export async function insert(req, res, next) {
	// insert issue persists (insert issue)
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
	const { all, approved } = req.query;

	// console.log(all, '- all', approved, '- approved');

	const query = sql`
					SELECT 
						vod.*, 
						ROW_NUMBER() OVER (
							PARTITION BY vod.order_number
							ORDER BY vod.order_info_uuid
						) AS order_number_wise_rank, 
						order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
						swatch_approval_counts.swatch_approval_count,
						order_entry_counts.order_entry_count,
						CASE WHEN price_approval_counts.price_approval_count IS NULL THEN 0 ELSE price_approval_counts.price_approval_count END AS price_approval_count,
						CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved
					FROM zipper.v_order_details vod
					LEFT JOIN (
						SELECT 
							order_number, 
							COUNT(*) AS order_number_wise_count
						FROM zipper.v_order_details
						GROUP BY order_number
					) order_number_wise_counts
					ON vod.order_number = order_number_wise_counts.order_number
					LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
					LEFT JOIN (
						SELECT 
							COUNT(oe.swatch_approval_date) AS swatch_approval_count, 
							oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) swatch_approval_counts ON vod.order_description_uuid = swatch_approval_counts.order_description_uuid
					 LEFT JOIN (
						SELECT 
							COUNT(*) AS price_approval_count, 
							oe.order_description_uuid
						FROM zipper.order_entry oe
						WHERE oe.party_price > 0 AND oe.company_price > 0
						GROUP BY oe.order_description_uuid
					) price_approval_counts ON vod.order_description_uuid = price_approval_counts.order_description_uuid
					 LEFT JOIN (
						SELECT 
							COUNT(*) AS order_entry_count, 
							oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
					) order_entry_counts ON vod.order_description_uuid = order_entry_counts.order_description_uuid
					WHERE vod.order_description_uuid IS NOT NULL 
						AND ${
							all === 'true'
								? sql`1=1`
								: sql`
                    ${approved === 'true' ? sql`swatch_approval_counts.swatch_approval_count > 0` : sql`1=1`}`
						}
					ORDER BY vod.order_number DESC, order_number_wise_rank ASC;`;

	const orderInfoPromise = db.execute(query);

	try {
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

export async function getTapeAssigned(req, res, next) {
	const query = sql`
					SELECT 
						vodf.order_number,
						vodf.party_uuid,
						vodf.party_name,
						vodf.item_description,
						vodf.item,
						vodf.item_name,
						vodf.zipper_number,
						vodf.zipper_number_name,
						vodf.is_multi_color,
						vodf.tape_coil_uuid,
						vodf.order_description_uuid,
						vodf.is_sample,
						ROW_NUMBER() OVER (
							PARTITION BY vodf.order_number
							ORDER BY vodf.order_info_uuid
						) AS order_number_wise_rank, 
						order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
						swatch_approval_counts.swatch_approval_count,
						order_entry_counts.order_entry_count,
						CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved
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
					WHERE vodf.order_description_uuid IS NOT NULL AND vodf.is_multi_color = 0  AND swatch_approval_counts.swatch_approval_count>0
					ORDER BY 
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
	const { approved } = req.query;
	const query = sql`
					SELECT 
						vod.*, 
						ROW_NUMBER() OVER (
							PARTITION BY vod.order_number
							ORDER BY vod.order_info_uuid
						) AS order_number_wise_rank, 
						order_number_wise_counts.order_number_wise_count AS order_number_wise_count,
						swatch_approval_counts.swatch_approval_count,
						order_entry_counts.order_entry_count,
						CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatch_approved
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
						AND oi.marketing_uuid = ${own_uuid} AND ${
							approved === 'true'
								? sql`swatch_approval_counts.swatch_approval_count > 0`
								: sql`1=1`
						}
					ORDER BY vod.created_at DESC;`;

	const orderInfoPromise = db.execute(query);

	try {
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
