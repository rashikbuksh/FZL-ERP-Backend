import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
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
	const resultPromise = db
		.select({
			uuid: challan.uuid,
			challan_id: sql`concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			order_info_uuid: challan.order_info_uuid,
			carton_quantity: challan.carton_quantity,
			gate_pass: challan.gate_pass,
			received: challan.received,
			assign_to: challan.assign_to,
			assign_to_name: assignToUser.name,
			created_by: challan.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(hrSchema.users, eq(challan.created_by, hrSchema.users.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.orderBy(desc(challan.created_at));

	const toast = {
		status: 200,
		type: 'select all',
		message: 'challan list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: challan.uuid,
			challan_id: sql`concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			order_info_uuid: challan.order_info_uuid,
			carton_quantity: challan.carton_quantity,
			gate_pass: challan.gate_pass,
			received: challan.received,
			assign_to: challan.assign_to,
			assign_to_name: assignToUser.name,
			created_by: challan.created_by,
			created_by_name: hrSchema.users.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(hrSchema.users, eq(challan.created_by, hrSchema.users.uuid))
		.leftJoin(assignToUser, eq(challan.assign_to, assignToUser.uuid))
		.where(eq(challan.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};

		return await res.status(200).json({ toast, data: data[0] });
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
			toe.quantity as order_quantity,
			toe.delivered as delivered,
			toe.warehouse as warehouse,
			toe.bleaching as bleaching,
			(toe.quantity - toe.delivered) as balance_quantity,
			false as is_checked,
			toe.carton_quantity as carton_quantity
		FROM thread.order_entry toe
		LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
		LEFT JOIN thread.count_length cl ON toe.count_length_uuid = cl.uuid
		WHERE toe.order_info_uuid = ${req.params.order_info_uuid} AND (toe.quantity - toe.delivered) > 0
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

		const response = {
			...challan?.data?.data,
			challan_entry: challan_entry?.data?.data || [],
		};

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
