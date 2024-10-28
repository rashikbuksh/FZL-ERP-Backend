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
	const resultPromise = db
		.select({
			uuid: challan.uuid,
			challan_number: sql`concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			order_info_uuid: challan.order_info_uuid,
			order_number: sql`concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			buyer_uuid: zipperSchema.order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: zipperSchema.order_info.party_uuid,
			party_name: publicSchema.party.name,
			merchandiser_uuid: zipperSchema.order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: zipperSchema.order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			factory_address: publicSchema.factory.address,
			vehicle_uuid: challan.vehicle_uuid,
			vehicle_name: vehicle.name,
			vehicle_driver_name: vehicle.driver_name,
			carton_quantity: decimalToNumber(challan.carton_quantity),
			receive_status: challan.receive_status,
			gate_pass: challan.gate_pass,
			name: challan.name,
			delivery_cost: decimalToNumber(challan.delivery_cost),
			is_hand_delivery: challan.is_hand_delivery,
			created_by: challan.created_by,
			created_by_name: createdByUser.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(challan.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(zipperSchema.order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(zipperSchema.order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(
				zipperSchema.order_info.merchandiser_uuid,
				publicSchema.merchandiser.uuid
			)
		)
		.leftJoin(
			publicSchema.factory,
			eq(zipperSchema.order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(vehicle, eq(challan.vehicle_uuid, vehicle.uuid))
		.orderBy(desc(challan.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'challan',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const challanPromise = db
		.select({
			uuid: challan.uuid,
			challan_number: sql`concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))`,
			order_info_uuid: challan.order_info_uuid,
			order_number: sql`concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			packing_list_uuids: sql`array_agg(packing_list.uuid)`,
			packing_numbers: sql`
				array_agg(
					concat('PL', to_char(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0'))
				)
			`,
			buyer_uuid: zipperSchema.order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: zipperSchema.order_info.party_uuid,
			party_name: publicSchema.party.name,
			merchandiser_uuid: zipperSchema.order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: zipperSchema.order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			factory_address: publicSchema.factory.address,
			vehicle_uuid: challan.vehicle_uuid,
			vehicle_name: vehicle.name,
			vehicle_driver_name: vehicle.driver_name,
			carton_quantity: decimalToNumber(challan.carton_quantity),
			receive_status: challan.receive_status,
			gate_pass: challan.gate_pass,
			name: challan.name,
			delivery_cost: decimalToNumber(challan.delivery_cost),
			is_hand_delivery: challan.is_hand_delivery,
			created_by: challan.created_by,
			created_by_name: createdByUser.name,
			created_at: challan.created_at,
			updated_at: challan.updated_at,
			remarks: challan.remarks,
		})
		.from(challan)
		.leftJoin(createdByUser, eq(challan.created_by, createdByUser.uuid))
		.leftJoin(
			zipperSchema.order_info,
			eq(challan.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(challan_entry, eq(challan.uuid, challan_entry.challan_uuid))
		.leftJoin(
			packing_list,
			eq(challan_entry.packing_list_uuid, packing_list.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(zipperSchema.order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(zipperSchema.order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(
				zipperSchema.order_info.merchandiser_uuid,
				publicSchema.merchandiser.uuid
			)
		)
		.leftJoin(
			publicSchema.factory,
			eq(zipperSchema.order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(vehicle, eq(challan.vehicle_uuid, vehicle.uuid))
		.where(eq(challan.uuid, req.params.uuid))
		.groupBy(
			challan.uuid,
			challan.order_info_uuid,
			zipperSchema.order_info.created_at,
			zipperSchema.order_info.id,
			createdByUser.name,
			zipperSchema.order_info.buyer_uuid,
			publicSchema.buyer.name,
			zipperSchema.order_info.party_uuid,
			publicSchema.party.name,
			zipperSchema.order_info.merchandiser_uuid,
			publicSchema.merchandiser.name,
			zipperSchema.order_info.factory_uuid,
			publicSchema.factory.address,
			publicSchema.factory.name,
			challan.vehicle_uuid,
			vehicle.name,
			vehicle.driver_name,
			challan.carton_quantity,
			challan.receive_status,
			challan.gate_pass
		);

	try {
		const data = await challanPromise;
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
