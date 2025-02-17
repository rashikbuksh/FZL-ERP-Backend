import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { challan, packing_list } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	if (
		req.body.item_for === 'zipper' ||
		req.body.item_for === 'sample_zipper' ||
		req.body.item_for === 'slider' ||
		req.body.item_for === 'tape'
	) {
		req.body.order_info_uuid = req.body.order_info_uuid;
		req.body.thread_order_info_uuid = null;
	} else if (
		req.body.item_for === 'thread' ||
		req.body.item_for === 'sample_thread'
	) {
		const threadOrders = req.body.order_info_uuid;
		req.body.order_info_uuid = null;
		req.body.thread_order_info_uuid = threadOrders;
	} else {
		req.body.order_info_uuid = null;
		req.body.thread_order_info_uuid = null;
	}

	if (
		req.body.item_for == 'sample_thread' ||
		req.body.item_for == 'sample_zipper'
	) {
		req.body.gate_pass = 1;
	}

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

	if (
		req.body.item_for === 'zipper' ||
		req.body.item_for === 'sample_zipper' ||
		req.body.item_for === 'slider' ||
		req.body.item_for === 'tape'
	) {
		req.body.order_info_uuid = req.body.order_info_uuid;
		req.body.thread_order_info_uuid = null;
	} else if (
		req.body.item_for === 'thread' ||
		req.body.item_for === 'sample_thread'
	) {
		const threadOrders = req.body.order_info_uuid;
		req.body.order_info_uuid = null;
		req.body.thread_order_info_uuid = threadOrders;
	} else {
		req.body.order_info_uuid = null;
		req.body.thread_order_info_uuid = null;
	}
	if (
		req.body.item_for == 'sample_thread' ||
		req.body.item_for == 'sample_zipper'
	) {
		req.body.gate_pass = 1;
	}

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

export async function removeChallanAndPLRef(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { challan_number, uuid } = req.params;

	const packingListPromise = db
		.update(packing_list)
		.set({ challan_uuid: null, gate_pass: 0 })
		.where(eq(packing_list.challan_uuid, uuid))
		.returning({
			updatedId: packing_list.item_for,
		});

	try {
		const packingListData = await packingListPromise;

		// // packinglistData has two item_for values, so we need to check which any of one is not thread or sample_thread then we will use ZC as challan prefix otherwise TC
		// let challanPrefix = 'ZC'; // Default prefix

		// if (packingListData && packingListData.length > 0) {
		// 	// Check if any of the item_for values is 'thread' or 'sample_thread'
		// 	challanPrefix = packingListData.some((data) =>
		// 		['thread', 'sample_thread'].includes(data.updatedId)
		// 	)
		// 		? 'TC'
		// 		: 'ZC';
		// }

		const challanPromise = db
			.delete(challan)
			.where(eq(challan.uuid, uuid))
			.returning({
				deletedId: sql`${challan_number}`,
			});

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
	const { delivery_date, vehicle, type, own_uuid } = req.query;

	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
	SELECT
		main_query.*,
		sub_query.packing_list_uuids,
		sub_query.packing_numbers,
		sub_query.packing_list_numbers,
		sub_query.total_quantity,
		sub_query.total_poly_quantity,
		sub_query.gate_pass
	FROM
		(
			SELECT
				DISTINCT challan.uuid AS uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) ELSE
					CONCAT('TC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) END AS challan_number,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					challan.order_info_uuid ELSE
					challan.thread_order_info_uuid END AS order_info_uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) ELSE
					CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END AS order_number,
				packing_list_count.packing_list_count AS total_carton_quantity,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					zipper.order_info.buyer_uuid ELSE
					toi.buyer_uuid END AS buyer_uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					public.buyer.name ELSE
					pb.name END AS buyer_name,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					zipper.order_info.party_uuid ELSE
					toi.party_uuid END AS party_uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					public.party.name ELSE
					pp.name END AS party_name,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					zipper.order_info.merchandiser_uuid ELSE
					toi.merchandiser_uuid END AS merchandiser_uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					public.merchandiser.name ELSE
					pm.name END AS merchandiser_name,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					zipper.order_info.factory_uuid ELSE
					toi.factory_uuid END AS factory_uuid,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					public.factory.name ELSE
					pf.name END AS factory_name,
				CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
					public.factory.address ELSE
					pf.address END AS factory_address,
				challan.vehicle_uuid AS vehicle_uuid,
				vehicle.name AS vehicle_name,
				vehicle.driver_name AS vehicle_driver_name,
				CAST(challan.carton_quantity AS NUMERIC) AS carton_quantity,
				challan.receive_status AS receive_status,
				challan.name AS name,
				CAST(challan.delivery_cost AS NUMERIC) AS delivery_cost,
				challan.is_hand_delivery AS is_hand_delivery,
				challan.created_by AS created_by,
				hr.users.name AS created_by_name,
				challan.created_at AS created_at,
				challan.updated_at AS updated_at,
				challan.remarks AS remarks,
				challan.delivery_date,
				packing_list.item_for,
				challan.is_own,
				challan.delivery_type,
				challan.is_delivered
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
				thread.order_info toi ON delivery.packing_list.thread_order_info_uuid = toi.uuid
			LEFT JOIN
				public.buyer pb ON toi.buyer_uuid = pb.uuid
			LEFT JOIN
				public.party pp ON toi.party_uuid = pp.uuid
			LEFT JOIN
				public.merchandiser pm ON toi.merchandiser_uuid = pm.uuid
			LEFT JOIN
				public.factory pf ON toi.factory_uuid = pf.uuid
			LEFT JOIN (
				SELECT
					COUNT(packing_list.uuid) AS packing_list_count,
					packing_list.challan_uuid
				FROM
					delivery.packing_list
				GROUP BY
					packing_list.challan_uuid
			) AS packing_list_count ON challan.uuid = packing_list_count.challan_uuid
			WHERE
			  	${delivery_date ? sql`DATE(challan.delivery_date) = ${delivery_date}` : sql`TRUE`}
				${vehicle && vehicle !== 'null' && vehicle !== 'undefined' && vehicle !== 'all' ? sql`AND challan.vehicle_uuid = ${vehicle}` : sql``}
				${
					type === 'pending'
						? sql`AND challan.gate_pass = 0`
						: type === 'gate_pass'
							? sql`AND challan.gate_pass = 1 AND challan.is_delivered = 0`
							: type === 'delivered'
								? sql`AND challan.is_delivered = 1 AND challan.receive_status = 0`
								: type === 'received'
									? sql`AND challan.receive_status = 1`
									: sql``
				}
				${own_uuid == null || own_uuid == 'null' || own_uuid == undefined ? sql`` : sql`AND (order_info.marketing_uuid = ${marketingUuid} OR toi.marketing_uuid = ${marketingUuid})`}
		) AS main_query
	LEFT JOIN (
		SELECT
			packing_list.challan_uuid,
			ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
			ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
			jsonb_agg(
				DISTINCT jsonb_build_object(
					'packing_list_uuid', packing_list.uuid, 
					'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')),
					'carton_weight', packing_list.carton_weight
				)
			) AS packing_list_numbers,
			SUM(packing_list_entry.quantity)::float8 AS total_quantity,
			SUM(packing_list_entry.poli_quantity)::float8 AS total_poly_quantity,
			CASE
				WHEN COUNT(packing_list.uuid) = SUM(CASE WHEN packing_list.gate_pass = 1 THEN 1 ELSE 0 END) 
				THEN 1
				ELSE 0
			END AS gate_pass
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
										challan.uuid as uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) ELSE
										CONCAT('TC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) END AS challan_number,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										challan.order_info_uuid ELSE
										challan.thread_order_info_uuid END AS order_info_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) ELSE
										CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END AS order_number,
									packing_list_count.packing_list_count AS total_carton_quantity,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										zipper.order_info.buyer_uuid ELSE
										toi.buyer_uuid END AS buyer_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.buyer.name ELSE
										pb.name END AS buyer_name,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										zipper.order_info.party_uuid ELSE
										toi.party_uuid END AS party_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.party.name ELSE
										pp.name END AS party_name,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										zipper.order_info.merchandiser_uuid ELSE
										toi.merchandiser_uuid END AS merchandiser_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.merchandiser.name ELSE
										pm.name END AS merchandiser_name,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										zipper.order_info.factory_uuid ELSE
										toi.factory_uuid END AS factory_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.factory.name ELSE
										pf.name END AS factory_name,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.factory.address ELSE
										pf.address END AS factory_address,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										zipper.order_info.marketing_uuid ELSE
										toi.marketing_uuid END AS marketing_uuid,
									CASE WHEN packing_list.item_for = 'zipper' OR packing_list.item_for = 'sample_zipper' OR packing_list.item_for = 'slider' OR packing_list.item_for = 'tape' THEN
										public.marketing.name ELSE
										pmm.name END AS marketing_name,
									challan.vehicle_uuid,
									vehicle.name AS vehicle_name,
									vehicle.driver_name AS vehicle_driver_name,
									CAST(challan.carton_quantity AS NUMERIC) AS carton_quantity,
									challan.receive_status AS receive_status,
									packing_list.gate_pass AS gate_pass,
									challan.name AS name,
									CAST(challan.delivery_cost AS NUMERIC) AS delivery_cost,
									challan.is_hand_delivery AS is_hand_delivery,
									challan.created_by AS created_by,
									hr.users.name AS created_by_name,
									challan.created_at AS created_at,
									challan.updated_at AS updated_at,
									challan.remarks AS remarks,
									challan.delivery_date,
									packing_list.item_for,
									challan.is_own,
									pi_cash.pi_cash_numbers,
									challan.delivery_type,
									challan.is_delivered
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
									public.marketing ON zipper.order_info.marketing_uuid = public.marketing.uuid
								LEFT JOIN
									delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
								LEFT JOIN
									thread.order_info toi on delivery.packing_list.thread_order_info_uuid = toi.uuid
								LEFT JOIN
									public.buyer pb on toi.buyer_uuid = pb.uuid
								LEFT JOIN
									public.party pp on toi.party_uuid = pp.uuid
								LEFT JOIN
									public.merchandiser pm on toi.merchandiser_uuid = pm.uuid
								LEFT JOIN
									public.factory pf on toi.factory_uuid = pf.uuid
								LEFT JOIN 
									public.marketing pmm on toi.marketing_uuid = pmm.uuid
								LEFT JOIN (
											SELECT 
												array_agg(DISTINCT CASE 
													WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
													ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
												END ) AS pi_cash_numbers,
												vodf.order_info_uuid,
												toi.uuid AS thread_order_info_uuid
											FROM
												commercial.pi_cash
											LEFT JOIN
												commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
											LEFT JOIN
												zipper.sfg ON pi_cash_entry.sfg_uuid = zipper.sfg.uuid
											LEFT JOIN
												zipper.order_entry ON sfg.order_entry_uuid = zipper.order_entry.uuid
											LEFT JOIN
												zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
											LEFT JOIN
												thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
											LEFT JOIN
												thread.order_info toi ON toe.order_info_uuid = toi.uuid
											GROUP BY
												vodf.order_info_uuid, toi.uuid
											
										) AS pi_cash ON challan.order_info_uuid = pi_cash.order_info_uuid OR challan.thread_order_info_uuid = pi_cash.thread_order_info_uuid
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
								jsonb_agg(
									DISTINCT jsonb_build_object(
										'packing_list_uuid', packing_list.uuid, 
										'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')),
										'carton_weight', packing_list.carton_weight
									)
								) AS packing_list_numbers,
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

		// sort packing list numbers on packing_number ascending order
		data.rows[0].packing_list_numbers.sort((a, b) =>
			a.packing_number.localeCompare(b.packing_number)
		);

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

export async function updateReceivedStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { receive_status } = req.body;

	const query = sql`
		UPDATE
			delivery.challan
		SET
			receive_status = ${receive_status}
		WHERE
			uuid = ${req.params.uuid}
		RETURNING
			concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) as challan_number,
			receive_status
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `Challan Receive Status Updated`,
		};

		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateDelivered(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { is_delivered, updated_at } = req.body;
	// console.log('is_delivered', is_delivered);
	// console.log('updated_at', updated_at);
	const query = sql`
		UPDATE
			delivery.challan
		SET
			updated_at = ${updated_at},
			is_delivered = ${is_delivered}
		WHERE
			uuid = ${req.params.uuid}
		RETURNING
			concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) as challan_number,
			receive_status
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data.rows[0].challan_number} Delivered Status Updated`,
		};

		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
