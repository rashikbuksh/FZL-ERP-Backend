import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { challan } from '../schema.js';

const assignToUser = alias(hrSchema.users, 'assignToUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(challan)
		.values(req.body)
		.returning({
			insertedId: sql`concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
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
		.update(challan)
		.set(req.body)
		.where(eq(challan.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
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
	const resultPromise = db
		.delete(challan)
		.where(eq(challan.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
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
			challan.uuid,
			CONCAT('TC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) AS challan_id,
			challan.order_info_uuid,
			toi.buyer_uuid,
			pb.name AS buyer_name,
			toi.party_uuid,
			pp.name AS party_name,
			toi.merchandiser_uuid,
			pm.name AS merchandiser_name,
			toi.factory_uuid,
			pf.name AS factory_name,
			pf.address AS factory_address,
			challan.carton_quantity::float8,
			challan.gate_pass,
			challan.received,
			challan.vehicle_uuid,
			vehicle.name AS vehicle_name,
			challan.created_by,
			users.name AS created_by_name,
			challan.created_at,
			challan.updated_at,
			challan.remarks,
			challan.is_hand_delivery,
			challan.name,
			challan.delivery_cost::float8,
			concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS order_number,
			SUM(tce.quantity)::float8 AS total_quantity
		FROM 
			thread.challan
		LEFT JOIN 
			hr.users users ON challan.created_by = users.uuid
		LEFT JOIN 
			delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
		LEFT JOIN 
			thread.order_info toi ON challan.order_info_uuid = toi.uuid
		LEFT JOIN
			public.buyer pb ON toi.buyer_uuid = pb.uuid
		LEFT JOIN
			public.party pp ON toi.party_uuid = pp.uuid
		LEFT JOIN
			public.merchandiser pm ON toi.merchandiser_uuid = pm.uuid
		LEFT JOIN
			public.factory pf ON toi.factory_uuid = pf.uuid
		LEFT JOIN
			thread.challan_entry tce ON challan.uuid = tce.challan_uuid
		GROUP BY
			challan.uuid,
			challan.id,
			toi.buyer_uuid,
			pb.name,
			toi.party_uuid,
			pp.name,
			toi.merchandiser_uuid,
			pm.name,
			toi.factory_uuid,
			pf.name,
			pf.address,
			challan.carton_quantity,
			challan.gate_pass,
			challan.received,
			challan.vehicle_uuid,
			vehicle.name,
			challan.created_by,
			users.name,
			challan.created_at,
			challan.updated_at,
			challan.remarks,
			challan.is_hand_delivery,
			challan.name,
			challan.delivery_cost,
			toi.created_at,
			toi.id
		ORDER BY
			challan.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const query = sql`
		SELECT 
			challan.uuid,
			CONCAT('TC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) AS challan_id,
			challan.order_info_uuid,
			toi.buyer_uuid,
			pb.name AS buyer_name,
			toi.party_uuid,
			pp.name AS party_name,
			toi.merchandiser_uuid,
			pm.name AS merchandiser_name,
			toi.factory_uuid,
			pf.name AS factory_name,
			pf.address AS factory_address,
			challan.carton_quantity::float8,
			challan.gate_pass,
			challan.received,
			challan.vehicle_uuid,
			vehicle.name AS vehicle_name,
			challan.created_by,
			users.name AS created_by_name,
			challan.created_at,
			challan.updated_at,
			challan.remarks,
			challan.is_hand_delivery,
			challan.name,
			challan.delivery_cost::float8,
			concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS order_number
		FROM 
			thread.challan
		LEFT JOIN 
			hr.users users ON challan.created_by = users.uuid
		LEFT JOIN 
			delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
		LEFT JOIN 
			thread.order_info toi ON challan.order_info_uuid = toi.uuid
		LEFT JOIN
			public.buyer pb ON toi.buyer_uuid = pb.uuid
		LEFT JOIN
			public.party pp ON toi.party_uuid = pp.uuid
		LEFT JOIN
			public.merchandiser pm ON toi.merchandiser_uuid = pm.uuid
		LEFT JOIN
			public.factory pf ON toi.factory_uuid = pf.uuid
		WHERE 
			challan.uuid = ${req.params.uuid};
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};

		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByOrderInfoUuid(req, res, next) {
	const query = sql`
		SELECT
			concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS order_number,
			toe.order_info_uuid as order_info_uuid,
			toe.uuid as order_entry_uuid,
			toe.count_length_uuid,
			cl.count as count,
			cl.length as length,
			cl.cone_per_carton,
			toe.style as style,
			toe.color as color,
			toe.quantity::float8 as order_quantity,
			toe.delivered::float8 as delivered,
			toe.warehouse::float8 as warehouse,
			toe.bleaching as bleaching,
			(toe.quantity::float8 - toe.delivered::float8)::float8 as balance_quantity,
			(toe.quantity::float8 - toe.delivered::float8)::float8 as max_quantity,
			false as is_checked,
			0 as short_quantity,
			0 as reject_quantity
		FROM thread.order_entry toe
		LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
		WHERE toe.order_info_uuid = ${req.params.order_info_uuid} AND (toe.quantity - toe.delivered) > 0
		ORDER BY cl.count ASC
	`;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};
		const formattedData = {
			batch_entry: data.rows,
		};
		return await res.status(200).json({ toast, data: formattedData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadChallanDetailsByChallanUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { challan_uuid } = req.params;
	const { is_update } = req.query;
	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${challan_uuid}`)
				.then((response) => response);

		const [challan, challan_entry] = await Promise.all([
			fetchData('/thread/challan'),
			fetchData('/thread/challan-entry/by'),
		]);

		let query_data;

		if (is_update === 'true') {
			const order_info_uuid = challan?.data?.data?.order_info_uuid;

			// console.log('order_info_uuid', order_info_uuid);

			const fetchOrderDataForChallan = async () =>
				await api
					.get(
						`/thread/order-details-for-challan/by/${order_info_uuid}`
					)
					.then((response) => response);

			query_data = await fetchOrderDataForChallan();

			// console.log('query_data', query_data);
		}

		const response = {
			...challan?.data?.data,
			challan_entry: challan_entry?.data?.data || [],
			batch_entry: [],
		};

		if (is_update == 'true') {
			response.batch_entry = [
				...response.challan_entry,
				...query_data?.data?.data?.batch_entry,
			];
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'Thread Challan',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
