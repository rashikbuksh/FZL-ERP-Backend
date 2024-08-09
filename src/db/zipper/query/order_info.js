import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { eq, sql } from 'drizzle-orm';
import * as hrSchema from '../../hr/schema.js';
import * as publicSchema from '../../public/schema.js';
import { order_info } from '../schema.js';

export function insert(req, res, next) {
	// insert issue persists (insert issue)
	if (!validateRequest(req, next)) return;

	const {
		uuid,
		buyer_uuid,
		party_uuid,
		reference_order_info_uuid,
		marketing_uuid,
		merchandiser_uuid,
		factory_uuid,
		is_sample,
		is_bill,
		is_cash,
		marketing_priority,
		factory_priority,
		status,
		created_by,
		created_at,
		remarks,
	} = req.body;

	const orderInfoPromise = db
		.insert(order_info)
		.values({
			uuid,
			buyer_uuid,
			party_uuid,
			reference_order_info_uuid,
			marketing_uuid,
			merchandiser_uuid,
			factory_uuid,
			is_sample,
			is_bill,
			is_cash,
			marketing_priority,
			factory_priority,
			status,
			created_by,
			created_at,
			remarks,
		})
		.returning({
			insertedId: order_info.uuid,
		});

	orderInfoPromise
		.then((result) => {
			console.log('result', result);
			const toast = {
				status: 201,
				type: 'create',
				msg: `Order Info created`,
			};

			handleResponse({
				promise: orderInfoPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'create',
				msg: `Error creating Order Info - ${error.message}`,
			};

			handleResponse({
				promise: orderInfoPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		buyer_uuid,
		party_uuid,
		reference_order_info_uuid,
		marketing_uuid,
		merchandiser_uuid,
		factory_uuid,
		is_sample,
		is_bill,
		is_cash,
		marketing_priority,
		factory_priority,
		status,
		created_by,
		created_at,
		updated_at,
		remarks,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			buyer_uuid,
			party_uuid,
			reference_order_info_uuid,
			marketing_uuid,
			merchandiser_uuid,
			factory_uuid,
			is_sample,
			is_bill,
			is_cash,
			marketing_priority,
			factory_priority,
			status,
			created_by,
			created_at,
			updated_at,
			remarks,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: order_info.buyer_uuid,
		});

	orderInfoPromise
		.then((result) => {
			console.log('result', result);

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
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating Order Info - ${error.message}`,
			};

			handleResponse({
				promise: orderInfoPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderInfoPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			deletedId: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

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
			order_number: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
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
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
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
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		);
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
			factory_priority: order_info.factory_priority,
			status: order_info.status,
			created_by: order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_info.created_at,
			updated_at: order_info.updated_at,
			remarks: order_info.remarks,
		})
		.from(order_info)
		.leftJoin(
			publicSchema.buyer,
			eq(order_info.buyer_uuid, publicSchema.buyer.uuid)
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
			publicSchema.merchandiser,
			eq(order_info.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(order_info.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_info.created_by, hrSchema.users.uuid)
		)
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
