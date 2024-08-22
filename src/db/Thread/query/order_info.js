import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { order_info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(order_info)
		.values(req.body)
		.returning({ insertedId: order_info.uuid });

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
		.update(order_info)
		.set(req.body)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({ updatedId: order_info.uuid });

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
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({ deletedId: order_info.uuid });

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
			uuid: order_info.uuid,
			id: order_info.id,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			delivery_date: order_info.delivery_date,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(order_info.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Order info list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			delivery_date: order_info.delivery_date,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(order_info.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(order_info.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
		)
		.where(eq(order_info.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Order info',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}
