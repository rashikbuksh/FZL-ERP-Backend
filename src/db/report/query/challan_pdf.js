import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectChallanPdf(req, res, next) {
	const { order_info_uuid } = req.params;
	const { from, to, own_uuid } = req.query;

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
		sub_query.challan_entry,
		sub_query.gate_pass,
		sub_query.packing_list_uuids,
		sub_query.packing_numbers,
		sub_query.packing_list_numbers,
		sub_query.total_quantity,
		sub_query.total_poly_quantity
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
            WHERE (challan.order_info_uuid = ${order_info_uuid} OR challan.thread_order_info_uuid = ${order_info_uuid})
		) AS main_query
	LEFT JOIN (
		SELECT
			packing_list.challan_uuid,
			jsonb_agg(
				DISTINCT jsonb_build_object(
					'packing_list_entry_uuid', ple.uuid,
                    'style', CASE WHEN packing_list.item_for NOT IN ('thread', 'sample_thread') THEN oe.style ELSE toe.style END,
                    'color', CASE WHEN packing_list.item_for NOT IN ('thread', 'sample_thread') THEN oe.color ELSE toe.color END,
                    'item_description', CASE WHEN ple.sfg_uuid IS NOT NULL THEN vodf.item_description ELSE cl.count::text END,
                    'specification', 
                    CASE WHEN ple.sfg_uuid IS NOT NULL 
                        THEN CONCAT(
                            vodf.lock_type_name, 
                            CASE WHEN (vodf.teeth_color_name IS NOT NULL OR vodf.teeth_color_name != '---') THEN ', teeth: ' ELSE '' END,
                            vodf.teeth_color_name, 
                            CASE WHEN (vodf.puller_color_name IS NOT NULL OR vodf.puller_color_name != '---') THEN ', puller: ' ELSE '' END,
                            vodf.puller_color_name, 
                            CASE WHEN (vodf.hand_name IS NOT NULL OR vodf.hand_name != '---') THEN ', ' ELSE '' END,
                            vodf.hand_name, 
                            CASE WHEN (vodf.coloring_type_name IS NOT NULL OR vodf.coloring_type_name != '---') THEN ', type: ' ELSE '' END, 
                            vodf.coloring_type_name, 
                            CASE WHEN (vodf.slider_name IS NOT NULL OR vodf.slider_name != '---') THEN ', ' ELSE '' END,
                            vodf.slider_name, 
                            CASE WHEN (vodf.top_stopper_name IS NOT NULL OR vodf.top_stopper_name != '---') THEN ', ' ELSE '' END,
                            vodf.top_stopper_name, 
                            CASE WHEN (vodf.bottom_stopper_name IS NOT NULL OR vodf.bottom_stopper_name != '---') THEN ', ' ELSE '' END,
                            vodf.bottom_stopper_name, 
                            CASE WHEN (vodf.logo_type_name IS NOT NULL OR vodf.logo_type_name != '---') THEN ', ' ELSE '' END,
                            vodf.logo_type_name, 
                            CASE WHEN (vodf.logo_type_name IS NOT NULL AND vodf.logo_type_name != '---') THEN 
                                CONCAT(
                                    ' (', 
                                    CASE WHEN vodf.is_logo_body = 1 THEN 'B' ELSE '' END, 
                                    CASE WHEN vodf.is_logo_puller = 1 THEN ' P' ELSE '' END, 
                                    ')'
                                ) 
                            ELSE '' 
                            END
                        ) 
                        ELSE null END,
                    'size', CASE WHEN packing_list.item_for NOT IN ('thread', 'sample_thread') THEN oe.size::float8 ELSE cl.length::float8 END,
                    'count', CASE WHEN packing_list.item_for NOT IN ('thread', 'sample_thread') THEN null ELSE cl.count END,
                    'length', CASE WHEN packing_list.item_for NOT IN ('thread', 'sample_thread') THEN null ELSE cl.length END,
                    'sfg_uuid', ple.sfg_uuid,
                    'quantity', ple.quantity,
                    'poli_quantity', ple.poli_quantity,
                    'short_quantity', ple.short_quantity,
                    'reject_quantity', ple.reject_quantity,
                    'thread_order_entry_uuid', ple.thread_order_entry_uuid
				)
			) AS challan_entry,
			CASE
				WHEN COUNT(packing_list.uuid) = SUM(CASE WHEN packing_list.gate_pass = 1 THEN 1 ELSE 0 END) 
				THEN 1
				ELSE 0
			END AS gate_pass,
			ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
			ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
			jsonb_agg(
					DISTINCT jsonb_build_object(
					'packing_list_uuid', packing_list.uuid, 
					'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')),
					'carton_weight', packing_list.carton_weight)
					) AS packing_list_numbers,
			SUM(ple.quantity)::float8 AS total_quantity,
			SUM(ple.poli_quantity)::float8 AS total_poly_quantity
		FROM
			delivery.packing_list
		LEFT JOIN
			delivery.packing_list_entry ple ON packing_list.uuid = ple.packing_list_uuid
        LEFT JOIN
            thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
        LEFT JOIN 
            thread.count_length cl ON toe.count_length_uuid = cl.uuid
        LEFT JOIN
            zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
        LEFT JOIN
            zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN
            zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
		WHERE (vodf.order_info_uuid = ${order_info_uuid} OR toe.order_info_uuid = ${order_info_uuid})
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
