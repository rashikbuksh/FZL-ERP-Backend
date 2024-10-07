import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import * as publicSchema from '../../public/schema.js';
import { count_length, order_entry, order_info } from '../schema.js';
import { decimalToNumber } from '../../variables.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(order_info)
		.values(req.body)
		.returning({
			insertedId: sql`concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

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
		.update(order_info)
		.set(req.body)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

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
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

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
			order_info.uuid,
			order_info.id,
			CONCAT('TO', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			order_info.party_uuid,
			party.name AS party_name,
			order_info.marketing_uuid,
			marketing.name AS marketing_name,
			order_info.factory_uuid,
			factory.name AS factory_name,
			factory.address AS factory_address,
			order_info.merchandiser_uuid,
			merchandiser.name AS merchandiser_name,
			order_info.buyer_uuid,
			buyer.name AS buyer_name,
			order_info.is_sample,
			order_info.is_bill,
			order_info.is_cash,
			order_info.delivery_date,
			order_info.created_by,
			hr.users.name AS created_by_name,
			order_info.created_at,
			order_info.updated_at,
			order_info.remarks,
			swatch_approval_counts.swatch_approval_count,
			order_entry_counts.order_entry_count,
			CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatches_approved
		FROM 
			thread.order_info
		LEFT JOIN 
			hr.users ON order_info.created_by = hr.users.uuid
		LEFT JOIN 
			public.party ON order_info.party_uuid = public.party.uuid
		LEFT JOIN 
			public.marketing ON order_info.marketing_uuid = public.marketing.uuid
		LEFT JOIN 
			public.factory ON order_info.factory_uuid = public.factory.uuid
		LEFT JOIN 
			public.merchandiser ON order_info.merchandiser_uuid = public.merchandiser.uuid
		LEFT JOIN 
			public.buyer ON order_info.buyer_uuid = public.buyer.uuid
		LEFT JOIN (
					SELECT COUNT(toe.swatch_approval_date) AS swatch_approval_count, toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					GROUP BY toe.order_info_uuid
		) swatch_approval_counts ON order_info.uuid = swatch_approval_counts.order_info_uuid
		LEFT JOIN (
					SELECT COUNT(*) AS order_entry_count, toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					GROUP BY toe.order_info_uuid
		) order_entry_counts ON order_info.uuid = order_entry_counts.order_info_uuid
		ORDER BY 
			order_info.created_at DESC;
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order info',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			order_number: sql`concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			factory_address: publicSchema.factory.address,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			is_cash: order_info.is_cash,
			delivery_date: order_info.delivery_date,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
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
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.where(eq(order_info.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order info',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDetailsByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const api = await createApi(req);

		const fetchData = async (endpoint) =>
			await api.get(`/thread/${endpoint}/${order_info_uuid}`);

		const [order_info, order_info_entry] = await Promise.all([
			fetchData('order-info'),
			fetchData('order-entry/by'),
		]);

		const response = {
			...order_info?.data?.data,
			order_info_entry: order_info_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Thread Order info',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadSwatch(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			order_number: sql`concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			order_entry_uuid: order_entry.uuid,
			style: order_entry.style,
			color: order_entry.color,
			recipe_uuid: order_entry.recipe_uuid,
			recipe_name: labDipSchema.recipe.name,
			bleaching: order_entry.bleaching,
			po: order_entry.po,
			count_length_uuid: order_entry.count_length_uuid,
			count: count_length.count,
			length: count_length.length,
			count_length_name: sql`concat(count_length.count, ' - ', count_length.length)`,
			order_quantity: decimalToNumber(order_entry.quantity),
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(order_entry, eq(order_info.uuid, order_entry.order_info_uuid))
		.leftJoin(
			count_length,
			eq(order_entry.count_length_uuid, count_length.uuid)
		)
		.leftJoin(
			labDipSchema.recipe,
			eq(order_entry.recipe_uuid, labDipSchema.recipe.uuid)
		)
		.orderBy(desc(order_entry.created_at, order_info.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Swatch',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
