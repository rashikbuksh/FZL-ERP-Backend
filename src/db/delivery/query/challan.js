import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { challan } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.insert(challan)
		.values(req.body)
		.returning({
			insertedId: sql`concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			updatedUuid: challan.uuid,
		});
	try {
		const data = await challanPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.update(challan)
		.set(req.body)
		.where(eq(challan.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			updatedUuid: challan.uuid,
		});

	try {
		const data = await challanPromise;
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

	const challanPromise = db
		.delete(challan)
		.where(eq(challan.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
		});

	try {
		const data = await challanPromise;
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
							main_query.*,
							sub_query.packing_list_uuids,
							sub_query.packing_numbers,
							sub_query.packing_list_numbers,
							sub_query.total_quantity,
							sub_query.total_poly_quantity
						FROM
							(
								SELECT
									challan.uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) ELSE
										CONCAT('TC', TO_CHAR(tc.created_at, 'YY'), '-', LPAD(tc.id::text, 4, '0')) END AS challan_number,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.order_info_uuid ELSE
										tc.order_info_uuid END AS order_info_uuid,
									challan.order_info_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) ELSE
										CONCAT('T', TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END AS order_number,
									packing_list_count.packing_list_count AS total_carton_quantity,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.buyer_uuid ELSE
										toi.buyer_uuid END AS buyer_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.buyer.name ELSE
										pb.name END AS buyer_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.party_uuid ELSE
										toi.party_uuid END AS party_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.party.name ELSE
										pp.name END AS party_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.merchandiser_uuid ELSE
										toi.merchandiser_uuid END AS merchandiser_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.merchandiser.name ELSE
										pm.name END AS merchandiser_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.factory_uuid ELSE
										toi.factory_uuid END AS factory_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.factory.name ELSE
										pf.name END AS factory_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.factory.address ELSE
										pf.address END AS factory_address,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.vehicle_uuid ELSE
										tc.vehicle_uuid END AS vehicle_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										vehicle.name ELSE
										tv.name END AS vehicle_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										vehicle.driver_name ELSE
										tv.driver_name END AS vehicle_driver_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CAST(challan.carton_quantity AS NUMERIC) ELSE
										CAST(tc.carton_quantity AS NUMERIC) END AS carton_quantity,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.receive_status ELSE
										tc.received END AS receive_status,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										packing_list.gate_pass ELSE
										tc.gate_pass END AS gate_pass,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.name ELSE
										tc.name END AS name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CAST(challan.delivery_cost AS NUMERIC) ELSE
										CAST(tc.delivery_cost AS NUMERIC) END AS delivery_cost,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.is_hand_delivery ELSE
										tc.is_hand_delivery END AS is_hand_delivery,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.created_by ELSE
										tc.created_by END AS created_by,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										hr.users.name ELSE
										tu.name END AS created_by_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.created_at ELSE
										tc.created_at END AS created_at,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.updated_at ELSE
										tc.updated_at END AS updated_at,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.remarks ELSE
										tc.remarks END AS remarks
								FROM
									delivery.challan
								LEFT JOIN
									hr.users ON challan.created_by = hr.users.uuid
								LEFT JOIN
									zipper.order_info ON challan.order_info_uuid = zipper.order_info.uuid
								LEFT JOIN
									delivery.packing_list ON challan.uuid = packing_list.challan_uuid
								LEFT JOIN
									public.buyer ON zipper.order_info.buyer_uuid = public.buyer.uuid
								LEFT JOIN
									public.party ON zipper.order_info.party_uuid = public.party.uuid
								LEFT JOIN
									public.merchandiser ON zipper.order_info.merchandiser_uuid = public.merchandiser.uuid
								LEFT JOIN
									public.factory ON zipper.order_info.factory_uuid = public.factory.uuid
								LEFT JOIN
									delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
								LEFT JOIN
									thread.order_info toi on delivery.packing_list.thread_order_info_uuid = toi.uuid
								LEFT JOIN
									thread.challan tc on delivery.packing_list.thread_order_info_uuid = tc.order_info_uuid
								LEFT JOIN
									public.buyer pb on toi.buyer_uuid = pb.uuid
								LEFT JOIN
									public.party pp on toi.party_uuid = pp.uuid
								LEFT JOIN
									public.merchandiser pm on toi.merchandiser_uuid = pm.uuid
								LEFT JOIN
									public.factory pf on toi.factory_uuid = pf.uuid
								LEFT JOIN
									hr.users tu on tc.created_by = tu.uuid
								LEFT JOIN
									delivery.vehicle tv on tc.vehicle_uuid = tv.uuid
								LEFT JOIN (
									SELECT
										COUNT(packing_list.uuid) AS packing_list_count,
										packing_list.challan_uuid
									FROM
										delivery.packing_list
									GROUP BY
										packing_list.challan_uuid
								) AS packing_list_count ON challan.uuid = packing_list_count.challan_uuid
							) AS main_query
						LEFT JOIN (
							SELECT
								packing_list.challan_uuid,
								ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
								ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
								jsonb_agg(DISTINCT jsonb_build_object('packing_list_uuid', packing_list.uuid, 'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')))) AS packing_list_numbers,
								SUM(packing_list_entry.quantity)::float8 AS total_quantity,
								SUM(packing_list_entry.poli_quantity)::float8 AS total_poly_quantity
							FROM
								delivery.packing_list
							LEFT JOIN
								delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
							GROUP BY
								packing_list.challan_uuid
						) AS sub_query ON main_query.uuid = sub_query.challan_uuid
					ORDER BY
							main_query.created_at DESC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
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
							main_query.*,
							sub_query.packing_list_uuids,
							sub_query.packing_numbers,
							sub_query.packing_list_numbers,
							sub_query.total_quantity,
							sub_query.total_poly_quantity
						FROM
							(
								SELECT
									challan.uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) ELSE
										CONCAT('TC', TO_CHAR(tc.created_at, 'YY'), '-', LPAD(tc.id::text, 4, '0')) END AS challan_number,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.order_info_uuid ELSE
										tc.order_info_uuid END AS order_info_uuid,
									challan.order_info_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) ELSE
										CONCAT('T', TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END AS order_number,
									packing_list_count.packing_list_count AS total_carton_quantity,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.buyer_uuid ELSE
										toi.buyer_uuid END AS buyer_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.buyer.name ELSE
										pb.name END AS buyer_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.party_uuid ELSE
										toi.party_uuid END AS party_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.party.name ELSE
										pp.name END AS party_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.merchandiser_uuid ELSE
										toi.merchandiser_uuid END AS merchandiser_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.merchandiser.name ELSE
										pm.name END AS merchandiser_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										zipper.order_info.factory_uuid ELSE
										toi.factory_uuid END AS factory_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.factory.name ELSE
										pf.name END AS factory_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										public.factory.address ELSE
										pf.address END AS factory_address,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.vehicle_uuid ELSE
										tc.vehicle_uuid END AS vehicle_uuid,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										vehicle.name ELSE
										tv.name END AS vehicle_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										vehicle.driver_name ELSE
										tv.driver_name END AS vehicle_driver_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CAST(challan.carton_quantity AS NUMERIC) ELSE
										CAST(tc.carton_quantity AS NUMERIC) END AS carton_quantity,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.receive_status ELSE
										tc.received END AS receive_status,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										packing_list.gate_pass ELSE
										tc.gate_pass END AS gate_pass,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.name ELSE
										tc.name END AS name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										CAST(challan.delivery_cost AS NUMERIC) ELSE
										CAST(tc.delivery_cost AS NUMERIC) END AS delivery_cost,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.is_hand_delivery ELSE
										tc.is_hand_delivery END AS is_hand_delivery,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.created_by ELSE
										tc.created_by END AS created_by,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										hr.users.name ELSE
										tu.name END AS created_by_name,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.created_at ELSE
										tc.created_at END AS created_at,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.updated_at ELSE
										tc.updated_at END AS updated_at,
									CASE WHEN packing_list.item_for = 'zipper' THEN
										challan.remarks ELSE
										tc.remarks END AS remarks
								FROM
									delivery.challan
								LEFT JOIN
									hr.users ON challan.created_by = hr.users.uuid
								LEFT JOIN
									zipper.order_info ON challan.order_info_uuid = zipper.order_info.uuid
								LEFT JOIN
									delivery.packing_list ON challan.uuid = packing_list.challan_uuid
								LEFT JOIN
									public.buyer ON zipper.order_info.buyer_uuid = public.buyer.uuid
								LEFT JOIN
									public.party ON zipper.order_info.party_uuid = public.party.uuid
								LEFT JOIN
									public.merchandiser ON zipper.order_info.merchandiser_uuid = public.merchandiser.uuid
								LEFT JOIN
									public.factory ON zipper.order_info.factory_uuid = public.factory.uuid
								LEFT JOIN
									delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
								LEFT JOIN
									thread.order_info toi on delivery.packing_list.thread_order_info_uuid = toi.uuid
								LEFT JOIN
									thread.challan tc on delivery.packing_list.thread_order_info_uuid = tc.order_info_uuid
								LEFT JOIN
									public.buyer pb on toi.buyer_uuid = pb.uuid
								LEFT JOIN
									public.party pp on toi.party_uuid = pp.uuid
								LEFT JOIN
									public.merchandiser pm on toi.merchandiser_uuid = pm.uuid
								LEFT JOIN
									public.factory pf on toi.factory_uuid = pf.uuid
								LEFT JOIN
									hr.users tu on tc.created_by = tu.uuid
								LEFT JOIN
									delivery.vehicle tv on tc.vehicle_uuid = tv.uuid
								LEFT JOIN (
									SELECT
										COUNT(packing_list.uuid) AS packing_list_count,
										packing_list.challan_uuid
									FROM
										delivery.packing_list
									GROUP BY
										packing_list.challan_uuid
								) AS packing_list_count ON challan.uuid = packing_list_count.challan_uuid
							) AS main_query
						LEFT JOIN (
							SELECT
								packing_list.challan_uuid,
								ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
								ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
								jsonb_agg(DISTINCT jsonb_build_object('packing_list_uuid', packing_list.uuid, 'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')))) AS packing_list_numbers,
								SUM(packing_list_entry.quantity)::float8 AS total_quantity,
								SUM(packing_list_entry.poli_quantity)::float8 AS total_poly_quantity
							FROM
								delivery.packing_list
							LEFT JOIN
								delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
							GROUP BY
								packing_list.challan_uuid
						) AS sub_query ON main_query.uuid = sub_query.challan_uuid
					WHERE
						main_query.uuid = ${req.params.uuid}
	`;

	const challanPromise = db.execute(query);

	try {
		const data = await challanPromise;
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

export async function selectChallanDetailsByChallanUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { challan_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${challan_uuid}`)
				.then((response) => response);

		const [challan, challan_entry] = await Promise.all([
			fetchData('/delivery/challan'),
			fetchData('/delivery/packing-list-entry-for-challan'),
		]);

		const response = {
			...challan?.data?.data,
			challan_entry: challan_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Challan Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
