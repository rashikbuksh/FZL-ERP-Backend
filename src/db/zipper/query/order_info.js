import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { eq } from 'drizzle-orm';
import * as hrSchema from '../../hr/schema.js';
import * as publicSchema from '../../public/schema.js';
import { order_info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db.insert(order_info).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.id} created`,
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.update(order_info)
		.set(req.body)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({ updatedId: order_info.id });

	const toast = {
		status: 201,
		type: 'update',
		msg: `Order Info updated`,
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Order Info deleted',
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	const orderInfoPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			reference_order_info_uuid: order_info.reference_order_info_uuid,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			is_cash: order_info.is_cash,
			marketing_priority: order_info.marketing_priority,
			merchandiser_priority: order_info.merchandiser_priority,
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(publicSchema.buyer)
		.on(eq(order_info.buyer_uuid, publicSchema.buyer.uuid))
		.leftJoin(publicSchema.party)
		.on(eq(order_info.party_uuid, publicSchema.party.uuid))
		.leftJoin(publicSchema.marketing)
		.on(eq(order_info.marketing_uuid, publicSchema.marketing.uuid))
		.leftJoin(publicSchema.merchandiser)
		.on(eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid))
		.leftJoin(publicSchema.factory)
		.on(eq(order_info.factory_uuid, publicSchema.factory.uuid))
		.leftJoin(hrSchema.users)
		.on(eq(order_info.created_by, hrSchema.users.uuid));
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order Info list',
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.select({
			uuid: order_info.uuid,
			id: order_info.id,
			reference_order_info_uuid: order_info.reference_order_info_uuid,
			buyer_uuid: order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			merchandiser_uuid: order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			is_sample: order_info.is_sample,
			is_bill: order_info.is_bill,
			is_cash: order_info.is_cash,
			marketing_priority: order_info.marketing_priority,
			merchandiser_priority: order_info.merchandiser_priority,
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(publicSchema.buyer)
		.on(eq(order_info.buyer_uuid, publicSchema.buyer.uuid))
		.leftJoin(publicSchema.party)
		.on(eq(order_info.party_uuid, publicSchema.party.uuid))
		.leftJoin(publicSchema.marketing)
		.on(eq(order_info.marketing_uuid, publicSchema.marketing.uuid))
		.leftJoin(publicSchema.merchandiser)
		.on(eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid))
		.leftJoin(publicSchema.factory)
		.on(eq(order_info.factory_uuid, publicSchema.factory.uuid))
		.leftJoin(hrSchema.users)
		.on(eq(order_info.created_by, hrSchema.users.uuid))
		.where(eq(order_info.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Order Info',
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}
