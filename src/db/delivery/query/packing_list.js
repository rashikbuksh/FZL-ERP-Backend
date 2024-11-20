import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { packing_list } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const item_for = req.body.item_for;

	if (item_for == 'thread') {
		const { order_info_uuid } = req.body;
		req.body.thread_order_info_uuid = order_info_uuid;
		req.body.order_info_uuid = null;
	}

	const packing_listPromise = db
		.insert(packing_list)
		.values(req.body)
		.returning({
			insertedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
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

	if (item_for == 'thread') {
		const { order_info_uuid } = req.body;
		req.body.thread_order_info_uuid = order_info_uuid;
		req.body.order_info_uuid = null;
	}

	const packing_listPromise = db
		.update(packing_list)
		.set(req.body)
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
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
			deletedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
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
	const { challan_uuid } = req.query;

	const query = sql`
		SELECT dvl.*,
		SUM(ple.quantity)::float8 as total_quantity,
		SUM(ple.poli_quantity)::float8 as total_poly_quantity
		FROM delivery.v_packing_list dvl
		LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
		${challan_uuid ? sql`WHERE dvl.challan_uuid = ${challan_uuid}` : sql``}
		GROUP BY 
			dvl.uuid,
			dvl.order_info_uuid,
			dvl.packing_list_wise_rank,
			dvl.packing_list_wise_count,
			dvl.packing_number,
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
			dvl.created_by,
			dvl.created_by_name,
			dvl.created_at,
			dvl.updated_at,
			dvl.remarks,
			dvl.gate_pass
		ORDER BY 
			dvl.created_at DESC
	`;

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
		SUM(ple.poli_quantity)::float8 as total_poly_quantity
		FROM delivery.v_packing_list dvl
		LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
		WHERE dvl.uuid = ${req.params.uuid}
		GROUP BY 
			dvl.uuid,
			dvl.order_info_uuid,
			dvl.packing_list_wise_rank,
			dvl.packing_list_wise_count,
			dvl.packing_number,
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
			dvl.created_by,
			dvl.created_by_name,
			dvl.created_at,
			dvl.updated_at,
			dvl.remarks,
			dvl.gate_pass
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

	if (item_for == 'zipper') {
		query = sql`
		SELECT 
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			oe.style,
			oe.color,
			CASE 
                WHEN vodf.is_inch = 1 
					THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                ELSE CAST(oe.size AS NUMERIC)
            END as size,
			vodf.is_inch,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity::float8  as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as balance_quantity,
			(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as max_quantity,
			0 as quantity,
			0 as poli_quantity,
			0 as short_quantity,
			0 as reject_quantity,
			sfg.finishing_prod
		FROM
			zipper.v_order_details_full vodf
		LEFT JOIN
			zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		LEFT JOIN
			zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
		WHERE
			(oe.quantity - sfg.delivered - sfg.delivered) > 0 AND vodf.order_info_uuid = ${req.params.order_info_uuid}
		ORDER BY
			oe.created_at, oe.uuid DESC
		`;
	} else {
		query = sql`
		SELECT 
			toi.uuid as order_info_uuid,
			CONCAT('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
			CONCAT(cl.count) as item_description,
			cl.length as size,
			toe.style,
			toe.color,
			cl.count,
			cl.length,
			toe.quantity::float8  as order_quantity,
			toe.uuid as order_entry_uuid,
			toe.warehouse::float8 as warehouse,
			toe.delivered::float8 as delivered,
			(toe.quantity::float8 - toe.warehouse::float8 - toe.delivered::float8)::float8 as balance_quantity,
			(toe.quantity::float8 - toe.warehouse::float8 - toe.delivered::float8)::float8 as max_quantity,
			0 as quantity,
			0 as poli_quantity,
			0 as short_quantity,
			0 as reject_quantity,
			total_production_quantity.total_production_quantity as finishing_prod
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		LEFT JOIN 
			thread.count_length cl ON toe.count_length_uuid = cl.uuid
		LEFT JOIN
			(SELECT 
				tbe.order_entry_uuid,
				SUM(tbe.coning_production_quantity) as total_production_quantity,
				
			FROM
				thread.batch_entry tbe
			GROUP BY
				tbe.order_entry_uuid) as total_production_quantity ON total_production_quantity.order_entry_uuid = toe.uuid
		WHERE
			(toe.quantity - toe.delivered - toe.delivered) > 0 AND toe.order_info_uuid = ${req.params.order_info_uuid}
		ORDER BY
			toe.created_at, toe.uuid DESC
		`;
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

	const { challan_uuid } = req.body;

	const packingListPromise = db
		.update(packing_list)
		.set({ challan_uuid })
		.where(eq(packing_list.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
		});

	try {
		const data = await packingListPromise;
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
