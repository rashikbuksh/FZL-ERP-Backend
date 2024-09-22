import { desc, eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { packing_list, packing_list_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const packing_listPromise = db
		.insert(packing_list)
		.values(req.body)
		.returning({ insertedId: packing_list.uuid });
	try {
		const data = await packing_listPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
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
		.returning({ updatedId: packing_list.uuid });

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
		.returning({ deletedId: packing_list.uuid });

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

		const response = {
			...packing_list?.data?.data,
			challan_entry: packing_list_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Challan Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		console.error(error);
		handleError({ error, res });
	}
}

export async function selectAllOrderForPackingList(req, res, next) {
	const query = sql`
		SELECT 
			vodf.order_info_uuid as order_info_uuid,
			vodf.order_number,
			vodf.item_description,
			vodf.order_description_uuid,
			concat(oe.style, ' / ', oe.color, ' / ', oe.size) as style_color_size,
			oe.quantity as order_quantity,
			sfg.uuid as sfg_uuid,
			sfg.warehouse as warehouse,
			sfg.delivered as delivered,
			(oe.quantity - sfg.delivered) as balance_quantity
		FROM
			zipper.v_order_details_full vodf
		LEFT JOIN
			zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
		LEFT JOIN
			zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
		WHERE
			(oe.quantity - sfg.delivered) > 0
		ORDER BY
			oe.created_at, oe.uuid DESC
		`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: `Order list for packing list`,
		};
		return await res.status(201).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
