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
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';

import {
	challan,
	challan_entry,
	packing_list,
	packing_list_entry,
	vehicle,
} from '../schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');

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
			challan.uuid,
			CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) AS challan_number,
			challan.order_info_uuid,
			CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
			ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
			jsonb_agg(DISTINCT jsonb_build_object('packing_list_uuid', packing_list.uuid, 'packing_number', CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')))) AS packing_list_numbers,
			SUM(packing_list_entry.quantity)::float8 AS total_quantity,
			SUM(packing_list_entry.poli_quantity)::float8 AS total_poly_quantity,
			packing_list_count.packing_list_count AS total_carton_quantity,
			zipper.order_info.buyer_uuid,
			public.buyer.name AS buyer_name,
			zipper.order_info.party_uuid,
			public.party.name AS party_name,
			zipper.order_info.merchandiser_uuid,
			public.merchandiser.name AS merchandiser_name,
			zipper.order_info.factory_uuid,
			public.factory.name AS factory_name,
			public.factory.address AS factory_address,
			challan.vehicle_uuid,
			vehicle.name AS vehicle_name,
			vehicle.driver_name AS vehicle_driver_name,
			CAST(challan.carton_quantity AS NUMERIC) AS carton_quantity,
			challan.receive_status,
			challan.gate_pass,
			challan.name,
			CAST(challan.delivery_cost AS NUMERIC) AS delivery_cost,
			challan.is_hand_delivery,
			challan.created_by,
			hr.users.name AS created_by_name,
			challan.created_at,
			challan.updated_at,
			challan.remarks
		FROM
			delivery.challan
		LEFT JOIN
			hr.users ON challan.created_by = hr.users.uuid
		LEFT JOIN
			zipper.order_info ON challan.order_info_uuid = zipper.order_info.uuid
		LEFT JOIN
			delivery.packing_list ON challan.uuid = packing_list.challan_uuid
		LEFT JOIN 
			delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
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
		LEFT JOIN (
			SELECT
				COUNT(packing_list.uuid) AS packing_list_count,
				packing_list.challan_uuid
			FROM
				delivery.packing_list
			GROUP BY
				packing_list.challan_uuid
		) AS packing_list_count ON challan.uuid = packing_list_count.challan_uuid
		GROUP BY
			challan.uuid,
			challan.order_info_uuid,
			zipper.order_info.created_at,
			zipper.order_info.id,
			users.name,
			zipper.order_info.buyer_uuid,
			public.buyer.name,
			zipper.order_info.party_uuid,
			public.party.name,
			zipper.order_info.merchandiser_uuid,
			public.merchandiser.name,
			zipper.order_info.factory_uuid,
			public.factory.address,
			public.factory.name,
			challan.vehicle_uuid,
			vehicle.name,
			vehicle.driver_name,
			challan.carton_quantity,
			challan.receive_status,
			challan.gate_pass,
			challan.name,
			challan.delivery_cost,
			challan.is_hand_delivery,
			challan.created_by,
			challan.created_at,
			challan.updated_at,
			challan.remarks,
			packing_list_count.packing_list_count
		ORDER BY
			challan.created_at DESC;
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
			challan.uuid,
			CONCAT('ZC', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) AS challan_number,
			challan.order_info_uuid,
			CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			ARRAY_AGG(DISTINCT packing_list.uuid) AS packing_list_uuids,
			ARRAY_AGG(DISTINCT CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))) AS packing_numbers,
			SUM(packing_list_entry.quantity)::float8 AS total_quantity,
			SUM(packing_list_entry.poli_quantity)::float8 AS total_poly_quantity,
			packing_list_count.packing_list_count AS total_carton_quantity,
			zipper.order_info.buyer_uuid,
			public.buyer.name AS buyer_name,
			zipper.order_info.party_uuid,
			public.party.name AS party_name,
			zipper.order_info.merchandiser_uuid,
			public.merchandiser.name AS merchandiser_name,
			zipper.order_info.factory_uuid,
			public.factory.name AS factory_name,
			public.factory.address AS factory_address,
			challan.vehicle_uuid,
			vehicle.name AS vehicle_name,
			vehicle.driver_name AS vehicle_driver_name,
			CAST(challan.carton_quantity AS NUMERIC) AS carton_quantity,
			challan.receive_status,
			challan.gate_pass,
			challan.name,
			CAST(challan.delivery_cost AS NUMERIC) AS delivery_cost,
			challan.is_hand_delivery,
			challan.created_by,
			hr.users.name AS created_by_name,
			challan.created_at,
			challan.updated_at,
			challan.remarks
		FROM
			delivery.challan
		LEFT JOIN
			hr.users ON challan.created_by = hr.users.uuid
		LEFT JOIN
			zipper.order_info ON challan.order_info_uuid = zipper.order_info.uuid
		LEFT JOIN
			delivery.packing_list ON challan.uuid = packing_list.challan_uuid
		LEFT JOIN 
			delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
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
			challan.uuid = ${req.params.uuid}
		GROUP BY
			challan.uuid,
			challan.order_info_uuid,
			zipper.order_info.created_at,
			zipper.order_info.id,
			users.name,
			zipper.order_info.buyer_uuid,
			public.buyer.name,
			zipper.order_info.party_uuid,
			public.party.name,
			zipper.order_info.merchandiser_uuid,
			public.merchandiser.name,
			zipper.order_info.factory_uuid,
			public.factory.address,
			public.factory.name,
			challan.vehicle_uuid,
			vehicle.name,
			vehicle.driver_name,
			challan.carton_quantity,
			challan.receive_status,
			challan.gate_pass,
			challan.name,
			challan.delivery_cost,
			challan.is_hand_delivery,
			challan.created_by,
			challan.created_at,
			challan.updated_at,
			challan.remarks,
			packing_list_count.packing_list_count
		ORDER BY
			challan.created_at DESC;
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
			fetchData('/delivery/challan-entry/by'),
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
