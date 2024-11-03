import { desc, eq, is, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';
import {
	carton,
	challan,
	packing_list,
	packing_list_entry,
} from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

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
	const query = sql`
		SELECT dvl.*,
		SUM(ple.quantity)::float8 as total_quantity,
		SUM(ple.poli_quantity)::float8 as total_poly_quantity
		FROM delivery.v_packing_list dvl
		LEFT JOIN delivery.packing_list_entry ple ON dvl.uuid = ple.packing_list_uuid
		GROUP BY 
			dvl.uuid,
			dvl.order_info_uuid,
			dvl.packing_list_wise_rank,
			dvl.packing_list_wise_count,
			dvl.packing_number,
			dvl.order_number,
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
			dvl.remarks
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
		SELECT v_packing_list.* 
		FROM delivery.v_packing_list
		WHERE uuid = ${req.params.uuid}
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
			const query = sql`
				SELECT 
					null as uuid,
					null as packing_list_uuid,
					null as sfg_uuid,
					null as quantity,
					null as poli_quantity,
					null as short_quantity,
					null as reject_quantity,
					null as created_at,
					null as updated_at,
					null as remarks,
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
					concat(oe.style, ' / ', oe.color, ' / ', CASE 
						WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
						ELSE CAST(oe.size AS NUMERIC)
					END) as style_color_size,
					oe.quantity::float8 as order_quantity,
					sfg.uuid as sfg_uuid,
					sfg.warehouse::float8 as warehouse,
					sfg.delivered::float8 as delivered,
					(oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as balance_quantity,
					false as is_checked
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN
					zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN
					zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN 
					delivery.packing_list_entry ple ON ple.sfg_uuid = sfg.uuid
				WHERE 
					vodf.order_info_uuid = ${order_info_uuid} AND ple.uuid IS NULL
				ORDER BY
					ple.created_at DESC, ple.uuid DESC;
			`;
			query_data = await db.execute(query);
		}

		const response = {
			...packing_list?.data?.data,
			packing_list_entry: packing_list_entry?.data?.data || [],
		};
		// if is_update true then add the query_data to the existing packing_list_entry
		if (is_update == 'true') {
			response.packing_list_entry = [
				...response.packing_list_entry,
				...query_data?.rows,
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
	const query = sql`
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
			0 as short_quantity,
			0 as reject_quantity
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
