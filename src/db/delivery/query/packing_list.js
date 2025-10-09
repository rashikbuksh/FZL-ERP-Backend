import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { GetDateTime } from '../../variables.js';
import { packing_list } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const item_for = req.body.item_for;

	if (item_for == 'thread' || item_for == 'sample_thread') {
		const { order_info_uuid } = req.body;
		req.body.thread_order_info_uuid = order_info_uuid;
		req.body.order_info_uuid = null;
	}

	if (item_for == 'sample_thread' || item_for == 'sample_zipper') {
		req.body.is_warehouse_received = true;
		req.body.warehouse_received_date = req.body.created_at;
		req.body.warehouse_received_by = req.body.created_by;
	}

	const packing_listPromise = db
		.insert(packing_list)
		.values(req.body)
		.returning({
			insertedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY-MM'), '-', packing_list.id::text)`,
			insertedUuid: packing_list.uuid,
		});
	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_for } = req.body;

	if (item_for == 'thread' || item_for == 'sample_thread') {
		const { order_info_uuid } = req.body;
		req.body.thread_order_info_uuid = order_info_uuid;
		req.body.order_info_uuid = null;
	}
	if (item_for == 'sample_thread' || item_for == 'sample_zipper') {
		req.body.is_warehouse_received = true;
	}

	const packing_listPromise = db
		.update(packing_list)
		.set(req.body)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY-MM'), '-', packing_list.id::text)`,
		});

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.delete(packing_list)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({
			deletedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY-MM'), '-', packing_list.id::text)`,
		});

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} removed`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { challan_uuid, can_show, type, order_type } = req.query;

	let query = sql`
    SELECT dvl.*,
        SUM(ple.quantity)::float8 as total_quantity,
        SUM(ple.poli_quantity)::float8 as total_poly_quantity,
		CASE 
            WHEN (vod.item_name = 'Nylon' AND LOWER(vod.nylon_stopper_name) LIKE 'plastic%')
            THEN vod.item_name || ' ' || 'Plastic'
            WHEN (vod.item_name = 'Nylon' AND LOWER(vod.nylon_stopper_name) = 'invisible')
            THEN vod.item_name || ' ' || 'Invisible'
            WHEN (vod.item_name = 'Nylon' AND LOWER(vod.nylon_stopper_name) NOT LIKE 'plastic%') 
			THEN vod.item_name
			WHEN item_for IN ('thread', 'sample_thread')
			THEN 'Thread'
            ELSE vod.item_name
        END as item_name,
		ARRAY_AGG(DISTINCT CASE 
            WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END
		) as color,
		ARRAY_AGG(DISTINCT CASE
			WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END
		) as color_ref,
		CEIL(AVG(cl.cone_per_carton))::float8 as cone_per_carton
    FROM delivery.v_packing_list dvl
    LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
	LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
	LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
	LEFT JOIN zipper.v_order_details vod ON vod.order_description_uuid = oe.order_description_uuid
	LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
	LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
    WHERE 1=1
    ${challan_uuid ? sql` AND dvl.challan_uuid = ${challan_uuid}` : sql``}
    ${
		type === 'pending'
			? sql` AND dvl.challan_uuid IS NULL AND dvl.is_deleted = false`
			: type === 'challan'
				? sql` AND dvl.challan_uuid IS NOT NULL AND dvl.gate_pass = 0 AND dvl.is_deleted = false`
				: type === 'gate_pass'
					? sql` AND dvl.gate_pass = 1 AND dvl.is_deleted = false`
					: type === 'deleted'
						? sql` AND dvl.is_deleted = true`
						: sql` AND dvl.is_deleted = false`
	}
`;

	// can_show contains comma separated values like zipper,thread or zipper,sample_zipper but if it is thread then show both thread and sample_thread
	if (can_show && can_show != 'all') {
		const can_show_array = can_show.split(',');
		if (can_show_array.includes('thread')) {
			can_show_array.push('sample_thread');
		}

		if (can_show_array.includes('zipper')) {
			can_show_array.push('tape');
			can_show_array.push('slider');
		}

		can_show_array.forEach((item, index) => {
			if (index == 0) {
				query.append(sql`AND (dvl.item_for = ${item}`);
			} else {
				query.append(sql` OR dvl.item_for = ${item}`);
			}
		});
		query.append(sql`)`);
	}

	if (order_type == 'bulk') {
		query.append(sql`AND dvl.is_sample = 0`);
	} else if (order_type == 'sample') {
		query.append(sql`AND dvl.is_sample = 1`);
	}

	query.append(
		sql`
    GROUP BY 
        dvl.uuid,
        dvl.order_info_uuid,
        dvl.packing_list_wise_rank,
        dvl.packing_list_wise_count,
        dvl.packing_number,
		dvl.packing_number_v1,
        dvl.order_number,
        dvl.item_for,
        dvl.challan_uuid,
        dvl.challan_number,
        dvl.carton_size,
        dvl.carton_weight,
        dvl.carton_uuid,
        dvl.carton_name,
        dvl.is_warehouse_received,
        dvl.factory_uuid,
        dvl.factory_name,
        dvl.buyer_uuid,
        dvl.buyer_name,
        dvl.party_uuid,
        dvl.party_name,
        dvl.created_by,
        dvl.created_by_name,
        dvl.created_at,
        dvl.updated_at,
        dvl.remarks,
        dvl.gate_pass,
		dvl.marketing_uuid,
		dvl.marketing_name,
		dvl.warehouse_received_date,
		dvl.gate_pass_date,
		vod.item_name,
		vod.nylon_stopper_name,
		dvl.warehouse_received_by,
		dvl.warehouse_received_by_name,
		dvl.gate_pass_by,
		dvl.gate_pass_by_name,
		dvl.is_sample,
		dvl.is_deleted,
		dvl.deleted_time,
		dvl.deleted_by,
		dvl.deleted_by_name
    ORDER BY 
        ${type === 'deleted' ? sql` dvl.deleted_time DESC NULLS LAST` : sql` dvl.created_at DESC`}`
	);

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT dvl.*,
		SUM(ple.quantity)::float8 as total_quantity,
		SUM(ple.poli_quantity)::float8 as total_poly_quantity,
		COALESCE(CEIL(SUM(ple.quantity)::float8 / (AVG(cl.cone_per_carton))::float8), 1) as carton_quantity
		FROM delivery.v_packing_list dvl
		LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
		LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
		LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
		WHERE dvl.uuid = ${req.params.uuid}
		GROUP BY 
			dvl.uuid,
			dvl.order_info_uuid,
			dvl.packing_list_wise_rank,
			dvl.packing_list_wise_count,
			dvl.packing_number,
			dvl.packing_number_v1,
			dvl.order_number,
			dvl.item_for,
			dvl.challan_uuid,
			dvl.challan_number,
			dvl.carton_size,
			dvl.carton_weight,
			dvl.carton_uuid,
			dvl.carton_name,
			dvl.is_warehouse_received,
			dvl.factory_uuid,
			dvl.factory_name,
			dvl.buyer_uuid,
			dvl.buyer_name,
			dvl.party_uuid,
			dvl.party_name,
			dvl.created_by,
			dvl.created_by_name,
			dvl.created_at,
			dvl.updated_at,
			dvl.remarks,
			dvl.gate_pass,
			dvl.marketing_uuid,
			dvl.marketing_name,
			dvl.warehouse_received_date,
			dvl.gate_pass_date,
			dvl.warehouse_received_by,
			dvl.warehouse_received_by_name,
			dvl.gate_pass_by,
			dvl.gate_pass_by_name,
			dvl.is_sample,
			dvl.is_deleted,
			dvl.deleted_time,
			dvl.deleted_by,
			dvl.deleted_by_name
		ORDER BY 
			dvl.created_at DESC
	`;

	const packing_listPromise = db.execute(query);

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list',
		};
		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectPackingListDetailsByPackingListUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { packing_list_uuid } = req.params;
	const { is_update } = req.query;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${packing_list_uuid}`)
				.then((response) => response);

		const [packing_list, packing_list_entry] = await Promise.all([
			fetchData('/delivery/packing-list'),
			fetchData('/delivery/packing-list-entry/by'),
		]);

		let query_data;

		if (is_update == 'true') {
			const order_info_uuid = packing_list?.data?.data?.order_info_uuid;
			const item_for = packing_list?.data?.data?.item_for;
			const fetchOrderDataForPacking = async () =>
				await api
					.get(
						`/delivery/order-for-packing-list/${order_info_uuid}?item_for=${item_for}`
					)
					.then((response) => response);

			query_data = await fetchOrderDataForPacking();

			// remove the order_entry_uuid from the packing_list_entry if that exists in the order_details_for_challan

			if (item_for == 'thread' || item_for == 'sample_thread') {
				const order_entry_uuid = packing_list_entry?.data?.data?.map(
					(entry) => entry?.thread_order_entry_uuid
				);

				if (order_entry_uuid) {
					query_data.data.data.packing_list_entry =
						query_data.data.data.packing_list_entry.filter(
							(uuid) =>
								!order_entry_uuid.includes(
									uuid.order_entry_uuid
								)
						);
				}
			} else {
				const sfg_uuid = packing_list_entry?.data?.data?.map(
					(entry) => entry?.sfg_uuid
				);

				if (sfg_uuid) {
					query_data.data.data.packing_list_entry =
						query_data.data.data.packing_list_entry.filter(
							(uuid) => !sfg_uuid.includes(uuid.sfg_uuid)
						);
				}
			}
		}

		const response = {
			...packing_list?.data?.data,
			packing_list_entry: packing_list_entry?.data?.data || [],
			new_packing_list_entry: [],
		};
		// if is_update true then add the query_data to the existing packing_list_entry
		if (is_update == 'true') {
			response.new_packing_list_entry = [
				...query_data?.data?.data?.packing_list_entry,
			];
		}

		const toast = {
			status: 200,
			type: 'select',
			message: 'packing list Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectAllOrderForPackingList(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_for } = req.query;

	let query;

	if (
		item_for == 'zipper' ||
		item_for == 'sample_zipper' ||
		item_for == 'slider' ||
		item_for == 'tape'
	) {
		query = sql`
		SELECT DISTINCT
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			oe.style,
			oe.color,
			oe.color_ref,
			oe.size,
			CASE 
				WHEN vodf.order_type = 'tape' THEN 'Meter' 
				WHEN vodf.order_type = 'slider' THEN 'Pcs'
				WHEN vodf.is_inch = 1 THEN 'Inch'
				ELSE 'CM' 
			END as unit,
			vodf.is_inch,
			vodf.is_meter,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8  ELSE oe.quantity::float8 END as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			CASE 
				WHEN vodf.order_type = 'tape' THEN (oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 
				ELSE (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 
			END as balance_quantity,
			CASE 
				WHEN ${item_for} = 'sample_zipper' THEN (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 
				WHEN vodf.order_type = 'tape' THEN LEAST(oe.size::float8 - sfg.warehouse::float8 - sfg.delivered::float8, sfg.finishing_prod::float8) 
				ELSE LEAST(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8, sfg.finishing_prod::float8) 
			END as max_quantity,
			0 as quantity,
			0 as poli_quantity,
			0 as short_quantity,
			0 as reject_quantity,
			COALESCE(sfg.finishing_prod::float8, 0) as finishing_prod,
			oe.uuid as order_entry_uuid,
			oe.created_at,
			vodf.order_type,
			'zipper' as item_for
		FROM
			zipper.v_order_details_full vodf
		LEFT JOIN
			zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		LEFT JOIN
			zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
		WHERE
			(oe.quantity - sfg.warehouse - sfg.delivered) > 0 AND vodf.order_info_uuid = ${req.params.order_info_uuid} AND 
			CASE 
				WHEN ${item_for} = 'sample_zipper' AND vodf.order_type = 'tape' 
				THEN (oe.size::float8 - sfg.warehouse - sfg.delivered) > 0
				WHEN ${item_for} = 'sample_zipper'
				THEN (oe.quantity - sfg.warehouse - sfg.delivered) > 0
				ELSE sfg.finishing_prod > 0 
			END
			AND 
				CASE 
					WHEN ${item_for} = 'zipper' THEN (vodf.is_sample = 0 AND vodf.order_type = 'full')
					WHEN ${item_for} = 'sample_zipper' THEN vodf.is_sample = 1
					WHEN ${item_for} = 'slider' THEN (vodf.order_type = 'slider' AND vodf.is_sample = 0)
					WHEN ${item_for} = 'tape' THEN (vodf.order_type = 'tape' AND vodf.is_sample = 0)
					ELSE TRUE
				END
		ORDER BY
			oe.created_at, oe.uuid DESC
		`; // ! (oe.quantity - sfg.warehouse - sfg.delivered) > 0  Removed from the query for packing list issues
	} else {
		query = sql`
		SELECT DISTINCT
			toi.uuid as order_info_uuid,
			CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) as order_number,
			CONCAT(cl.count) as item_description,
			cl.length as size,
			toe.style,
			toe.color,
			toe.color_ref,
			cl.count,
			cl.length,
			toe.quantity::float8  as order_quantity,
			toe.uuid as order_entry_uuid,
			toe.warehouse::float8 as warehouse,
			toe.delivered::float8 as delivered,
			(toe.quantity::float8 - toe.warehouse::float8 - toe.delivered::float8)::float8 as balance_quantity,
			LEAST(toe.quantity::float8 - toe.warehouse::float8 - toe.delivered::float8 + toe.production_quantity::float8, toe.production_quantity::float8) as max_quantity,
			cl.cone_per_carton,
			0 as quantity,
			0 as poli_quantity,
			0 as short_quantity,
			0 as reject_quantity,
			COALESCE(toe.production_quantity::float8,0) as finishing_prod,
			toe.uuid as order_entry_uuid,
			toe.created_at,
			'thread' as item_for
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		LEFT JOIN 
			thread.count_length cl ON toe.count_length_uuid = cl.uuid
		WHERE
			toe.production_quantity > 0 AND toe.order_info_uuid = ${req.params.order_info_uuid} 
		ORDER BY
			toe.created_at, toe.uuid DESC

		`;

		// FOR extra production quantity, cannot deliver more than order quantity
		// (toe.quantity - toe.warehouse - toe.delivered) > 0  (REMOVED)

		// AND
		// CASE
		// 	WHEN ${item_for} = 'sample_thread'
		// 	THEN (toe.quantity - toe.warehouse - toe.delivered) > 0
		// 	ELSE toe.production_quantity::float8 > 0
		// END -- // * NOTE: this is for the sample thread

		// sfg.dying_and_iron_prod > 0
		// * NOTE: this is for the sample zipper
	}

	try {
		const data = await db.execute(query);

		const packingListData = { packing_list_entry: data?.rows };

		const toast = {
			status: 200,
			type: 'select',
			message: `Order list for packing list`,
		};
		return await res.status(200).json({ toast, data: packingListData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function setChallanUuidOfPackingList(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { challan_uuid, item_for } = req.body;

	let gate_pass = 0;
	let gate_pass_date = null;

	if (item_for == 'sample_zipper' || item_for == 'sample_thread') {
		gate_pass = 1;
		gate_pass_date = GetDateTime();
	}

	const packingListPromise = db
		.update(packing_list)
		.set({ challan_uuid, gate_pass, gate_pass_date })
		.where(eq(packing_list.uuid, req.params.packing_list_uuid))
		.returning({
			updatedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY-MM'), '-', packing_list.id::text)`,
		});

	// const packingListGatePassPromise = db
	// 	.update(packing_list)
	// 	.set({ gate_pass })
	// 	.where(eq(packing_list.uuid, req.params.packing_list_uuid))
	// 	.returning({
	// 		updatedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY-MM'), '-', packing_list.id::text)`,
	// 	});

	try {
		const data = await packingListPromise;
		// const dataGatePass = await packingListGatePassPromise;
		const toast = {
			status: 201,
			type: challan_uuid != null ? 'insert' : 'delete',
			message: `${data[0].updatedId} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectPackingListReceivedLog(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to, is_sample } = req.query;

	const query = sql`
					SELECT dvl.*,
						JSONB_AGG(DISTINCT 
							JSONB_BUILD_OBJECT('item_description', vodf.item_description, 'order_description_uuid', vodf.order_description_uuid)
						) as item_description,
						CASE 
							WHEN item_for IN ('thread', 'sample_thread') 
							THEN 'Thread' 
							ELSE 
								CASE 
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
									THEN vodf.item_name || ' ' || 'Plastic'
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
									THEN vodf.item_name
								ELSE vodf.item_name 
                        	END 
						END as item_name,
						SUM(ple.quantity)::float8 as total_quantity,
						SUM(ple.poli_quantity)::float8 as total_poly_quantity,
						ARRAY_AGG(DISTINCT CASE 
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END) as color,
						ARRAY_AGG(DISTINCT CASE
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END) as color_ref,
						COALESCE(cl.cone_per_carton, 0) as cone_per_carton
					FROM delivery.v_packing_list dvl
					LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
					LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
					WHERE 
						dvl.is_warehouse_received = TRUE 
						AND dvl.is_deleted = FALSE
						AND dvl.warehouse_received_date BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
						${is_sample ? sql` AND dvl.is_sample = ${is_sample}` : sql``}
					GROUP BY
						dvl.uuid,
						dvl.order_info_uuid,
						vodf.item_name,
						vodf.nylon_stopper_name,
						dvl.packing_list_wise_rank,
						dvl.packing_list_wise_count,
						dvl.packing_number,
						dvl.packing_number_v1,
						dvl.order_number,
						dvl.item_for,
						dvl.challan_uuid,
						dvl.challan_number,
						dvl.carton_size,
						dvl.carton_weight,
						dvl.carton_uuid,
						dvl.carton_name,
						dvl.is_warehouse_received,
						dvl.factory_uuid,
						dvl.factory_name,
						dvl.buyer_uuid,
						dvl.buyer_name,
						dvl.party_uuid,
						dvl.party_name,
						dvl.created_by,
						dvl.created_by_name,
						dvl.created_at,
						dvl.updated_at,
						dvl.remarks,
						dvl.gate_pass,
						dvl.marketing_uuid,
						dvl.marketing_name,
						dvl.warehouse_received_date,
						dvl.gate_pass_date,
						dvl.warehouse_received_by,
						dvl.warehouse_received_by_name,
						dvl.gate_pass_by,
						dvl.gate_pass_by_name,
						dvl.is_sample,
						cl.cone_per_carton,
						dvl.is_deleted,
						dvl.deleted_time,
						dvl.deleted_by,
						dvl.deleted_by_name
					HAVING SUM(ple.quantity) IS NOT NULL
					ORDER BY
						dvl.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list received log',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListWarehouseOutLog(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to, is_sample } = req.query;

	const query = sql`
					SELECT dvl.*,
						JSONB_AGG(DISTINCT 
							JSONB_BUILD_OBJECT('item_description', vodf.item_description, 'order_description_uuid', vodf.order_description_uuid)
						) as item_description,
						CASE 
							WHEN item_for IN ('thread', 'sample_thread') 
							THEN 'Thread' 
							ELSE 
								CASE 
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
									THEN vodf.item_name || ' ' || 'Plastic'
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
									THEN vodf.item_name
								ELSE vodf.item_name 
                        	END 
						END as item_name,
						SUM(ple.quantity)::float8 as total_quantity,
						SUM(ple.poli_quantity)::float8 as total_poly_quantity,
						ARRAY_AGG(DISTINCT CASE 
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END) as color,
						ARRAY_AGG(DISTINCT CASE
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END) as color_ref,
						COALESCE(cl.cone_per_carton, 0) as cone_per_carton
					FROM delivery.v_packing_list dvl
					LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
					LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
					WHERE 
						dvl.gate_pass = 1 
						AND dvl.is_deleted = FALSE
						AND dvl.gate_pass_date BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
						${is_sample ? sql` AND dvl.is_sample = ${is_sample}` : sql``}
					GROUP BY
						dvl.uuid,
						dvl.order_info_uuid,
						vodf.item_name,
						vodf.nylon_stopper_name,
						dvl.packing_list_wise_rank,
						dvl.packing_list_wise_count,
						dvl.packing_number,
						dvl.packing_number_v1,
						dvl.order_number,
						dvl.item_for,
						dvl.challan_uuid,
						dvl.challan_number,
						dvl.carton_size,
						dvl.carton_weight,
						dvl.carton_uuid,
						dvl.carton_name,
						dvl.is_warehouse_received,
						dvl.factory_uuid,
						dvl.factory_name,
						dvl.buyer_uuid,
						dvl.buyer_name,
						dvl.party_uuid,
						dvl.party_name,
						dvl.created_by,
						dvl.created_by_name,
						dvl.created_at,
						dvl.updated_at,
						dvl.remarks,
						dvl.gate_pass,
						dvl.marketing_uuid,
						dvl.marketing_name,
						dvl.warehouse_received_date,
						dvl.gate_pass_date,
						dvl.warehouse_received_by,
						dvl.warehouse_received_by_name,
						dvl.gate_pass_by,
						dvl.gate_pass_by_name,
						dvl.is_sample,
						cl.cone_per_carton,
						dvl.is_deleted,
						dvl.deleted_time,
						dvl.deleted_by,
						dvl.deleted_by_name
					HAVING SUM(ple.quantity) IS NOT NULL
					ORDER BY
						dvl.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list warehouse out log',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPackingListReceivedWarehouseLog(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to, is_sample } = req.query;

	const query = sql`
					SELECT dvl.*,
						JSONB_AGG(DISTINCT 
							JSONB_BUILD_OBJECT('item_description', vodf.item_description, 'order_description_uuid', vodf.order_description_uuid)
						) as item_description,
						CASE 
							WHEN item_for IN ('thread', 'sample_thread') 
							THEN 'Thread' 
							ELSE 
								CASE 
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
									THEN vodf.item_name || ' ' || 'Plastic'
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
									THEN vodf.item_name
								ELSE vodf.item_name 
                        	END 
						END as item_name,
						SUM(ple.quantity)::float8 as total_quantity,
						SUM(ple.poli_quantity)::float8 as total_poly_quantity,
						ARRAY_AGG(DISTINCT CASE 
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END) as color,
						ARRAY_AGG(DISTINCT CASE
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END) as color_ref,
						COALESCE(cl.cone_per_carton, 0) as cone_per_carton
					FROM delivery.v_packing_list dvl
					LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
					LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
					WHERE 
						dvl.is_warehouse_received = TRUE 
						AND dvl.gate_pass = 0 
						AND dvl.is_deleted = FALSE
						AND dvl.warehouse_received_date BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
						${is_sample ? sql` AND dvl.is_sample = ${is_sample}` : sql``}
					GROUP BY
						dvl.uuid,
						dvl.order_info_uuid,
						vodf.item_name,
						vodf.nylon_stopper_name,
						dvl.packing_list_wise_rank,
						dvl.packing_list_wise_count,
						dvl.packing_number,
						dvl.packing_number_v1,
						dvl.order_number,
						dvl.item_for,
						dvl.challan_uuid,
						dvl.challan_number,
						dvl.carton_size,
						dvl.carton_weight,
						dvl.carton_uuid,
						dvl.carton_name,
						dvl.is_warehouse_received,
						dvl.factory_uuid,
						dvl.factory_name,
						dvl.buyer_uuid,
						dvl.buyer_name,
						dvl.party_uuid,
						dvl.party_name,
						dvl.created_by,
						dvl.created_by_name,
						dvl.created_at,
						dvl.updated_at,
						dvl.remarks,
						dvl.gate_pass,
						dvl.marketing_uuid,
						dvl.marketing_name,
						dvl.warehouse_received_date,
						dvl.gate_pass_date,
						dvl.warehouse_received_by,
						dvl.warehouse_received_by_name,
						dvl.gate_pass_by,
						dvl.gate_pass_by_name,
						dvl.is_sample,
						cl.cone_per_carton,
						dvl.is_deleted,
						dvl.deleted_time,
						dvl.deleted_by,
						dvl.deleted_by_name
					HAVING SUM(ple.quantity) IS NOT NULL
					ORDER BY
						dvl.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list warehouse out log',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function syncPackingListAndChallanForAllOrder(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfg_query = sql`
	UPDATE zipper.sfg
	SET 
		warehouse = subquery.warehouse_quantity, 
		delivered = subquery.delivered_quantity
	FROM (
		SELECT 
			ple.sfg_uuid,
			SUM(CASE WHEN pl.is_warehouse_received = true AND pl.gate_pass = 0 THEN ple.quantity ELSE 0 END) AS warehouse_quantity,
			SUM(CASE WHEN pl.gate_pass = 1 THEN ple.quantity ELSE 0 END) AS delivered_quantity
		FROM delivery.packing_list_entry ple
		LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
		WHERE pl.is_deleted = false
		GROUP BY ple.sfg_uuid
	) AS subquery
	WHERE zipper.sfg.uuid = subquery.sfg_uuid;`;

	const thread_query = sql`
	UPDATE thread.order_entry
	SET
		warehouse = subquery.warehouse_quantity,
		delivered = subquery.delivered_quantity
	FROM (
			SELECT
				ple.thread_order_entry_uuid, SUM(
					CASE
						WHEN pl.is_warehouse_received = true
						AND pl.gate_pass = 0 THEN ple.quantity
						ELSE 0
					END
				) AS warehouse_quantity, SUM(
					CASE
						WHEN pl.gate_pass = 1 THEN ple.quantity
						ELSE 0
					END
				) AS delivered_quantity
			FROM delivery.packing_list_entry ple
				LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
			WHERE pl.is_deleted = false
			GROUP BY
				ple.thread_order_entry_uuid
		) AS subquery
	WHERE
		thread.order_entry.uuid = subquery.thread_order_entry_uuid;`;

	const resultPromise = db.execute(sfg_query);
	const resultPromise2 = db.execute(thread_query);

	try {
		const data = await resultPromise;
		const data2 = await resultPromise2;
		const toast = {
			status: 201,
			type: 'update',
			message: `All Order's Packing list and challan updated`,
		};
		return await res
			.status(201)
			.json({ toast, data: { ...data, ...data2 } });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectDeletedPackingList(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to, is_sample } = req.query;

	const query = sql`
					SELECT dvl.*,
						JSONB_AGG(DISTINCT 
							JSONB_BUILD_OBJECT('item_description', vodf.item_description, 'order_description_uuid', vodf.order_description_uuid)
						) as item_description,
						CASE 
							WHEN item_for IN ('thread', 'sample_thread') 
							THEN 'Thread' 
							ELSE 
								CASE 
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) LIKE 'plastic%')
									THEN vodf.item_name || ' ' || 'Plastic'
									WHEN (vodf.item_name = 'Nylon' AND LOWER(vodf.nylon_stopper_name) NOT LIKE 'plastic%')
									THEN vodf.item_name
								ELSE vodf.item_name 
                        	END 
						END as item_name,
						SUM(ple.quantity)::float8 as total_quantity,
						SUM(ple.poli_quantity)::float8 as total_poly_quantity,
						ARRAY_AGG(DISTINCT CASE 
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color ELSE toe.color END) as color,
						ARRAY_AGG(DISTINCT CASE
							WHEN dvl.item_for IN ('zipper', 'sample_zipper', 'slider', 'tape') THEN oe.color_ref ELSE toe.color_ref END) as color_ref,
						COALESCE(cl.cone_per_carton, 0) as cone_per_carton
					FROM delivery.v_packing_list dvl
					LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
					LEFT JOIN zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
					WHERE dvl.is_deleted = TRUE
					GROUP BY
						dvl.uuid,
						dvl.order_info_uuid,
						vodf.item_name,
						vodf.nylon_stopper_name,
						dvl.packing_list_wise_rank,
						dvl.packing_list_wise_count,
						dvl.packing_number,
						dvl.packing_number_v1,
						dvl.order_number,
						dvl.item_for,
						dvl.challan_uuid,
						dvl.challan_number,
						dvl.carton_size,
						dvl.carton_weight,
						dvl.carton_uuid,
						dvl.carton_name,
						dvl.is_warehouse_received,
						dvl.factory_uuid,
						dvl.factory_name,
						dvl.buyer_uuid,
						dvl.buyer_name,
						dvl.party_uuid,
						dvl.party_name,
						dvl.created_by,
						dvl.created_by_name,
						dvl.created_at,
						dvl.updated_at,
						dvl.remarks,
						dvl.gate_pass,
						dvl.marketing_uuid,
						dvl.marketing_name,
						dvl.warehouse_received_date,
						dvl.gate_pass_date,
						dvl.warehouse_received_by,
						dvl.warehouse_received_by_name,
						dvl.gate_pass_by,
						dvl.gate_pass_by_name,
						dvl.is_sample,
						cl.cone_per_carton,
						dvl.is_deleted,
						dvl.deleted_time,
						dvl.deleted_by,
						dvl.deleted_by_name
					ORDER BY
						dvl.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list warehouse out log',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
