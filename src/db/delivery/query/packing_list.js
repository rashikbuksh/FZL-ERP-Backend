import { desc, eq, is, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';
import { challan, packing_list, packing_list_entry } from '../schema.js';

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
	const resultPromise = db
		.select({
			uuid: packing_list.uuid,
			order_info_uuid: packing_list.order_info_uuid,
			packing_number: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
			order_number: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			challan_uuid: packing_list.challan_uuid,
			challan_number: sql`CONCAT('C', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			carton_size: packing_list.carton_size,
			carton_weight: packing_list.carton_weight,
			created_by: packing_list.created_by,
			created_by_name: hrSchema.users.name,
			created_at: packing_list.created_at,
			updated_at: packing_list.updated_at,
			remarks: packing_list.remarks,
		})
		.from(packing_list)
		.leftJoin(
			hrSchema.users,
			eq(packing_list.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			zipperSchema.order_info,
			eq(packing_list.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(challan, eq(packing_list.challan_uuid, challan.uuid))
		.orderBy(desc(packing_list.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Packing list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.select({
			uuid: packing_list.uuid,
			order_info_uuid: packing_list.order_info_uuid,
			packing_number: sql`CONCAT('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))`,
			order_number: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			challan_uuid: packing_list.challan_uuid,
			challan_number: sql`CONCAT('C', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			carton_size: packing_list.carton_size,
			carton_weight: packing_list.carton_weight,
			created_by: packing_list.created_by,
			created_by_name: hrSchema.users.name,
			created_at: packing_list.created_at,
			updated_at: packing_list.updated_at,
			remarks: packing_list.remarks,
		})
		.from(packing_list)
		.leftJoin(
			hrSchema.users,
			eq(packing_list.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			zipperSchema.order_info,
			eq(packing_list.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(challan, eq(packing_list.challan_uuid, challan.uuid))
		.where(eq(packing_list.uuid, req.params.uuid));

	try {
		const data = await packing_listPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Packing list',
		};
		return await res.status(200).json({ toast, data: data[0] });
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
					ple.uuid,
					ple.packing_list_uuid,
					ple.sfg_uuid,
					ple.quantity::float8,
					ple.short_quantity::float8,
					ple.reject_quantity::float8,
					ple.created_at,
					ple.updated_at,
					ple.remarks,
					vodf.order_info_uuid as order_info_uuid,
					vodf.order_number,
					vodf.item_description,
					vodf.order_description_uuid,
					oe.style,
					oe.color,
					oe.size,
					concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
					oe.quantity::float8 as order_quantity,
					sfg.uuid as sfg_uuid,
					sfg.warehouse::float8 as warehouse,
					sfg.delivered::float8 as delivered,
					(oe.quantity - sfg.delivered)::float8  as balance_quantity,
					false as is_checked
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN
					zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN
					zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN delivery.packing_list_entry ple ON ple.sfg_uuid = sfg.uuid
				WHERE 
					vodf.order_info_uuid = ${order_info_uuid} AND ple.uuid IS NULL
				ORDER BY
					ple.created_at, ple.uuid DESC
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
                WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS TEXT)
                ELSE oe.size
                END as size,
			vodf.is_inch,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity::float8  as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse::float8 as warehouse,
			sfg.delivered::float8 as delivered,
			(oe.quantity - sfg.delivered)::float8  as balance_quantity
		FROM
			zipper.v_order_details_full vodf
		LEFT JOIN
			zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		LEFT JOIN
			zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
		WHERE
			(oe.quantity - sfg.delivered) > 0 AND vodf.order_info_uuid = ${req.params.order_info_uuid}
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
