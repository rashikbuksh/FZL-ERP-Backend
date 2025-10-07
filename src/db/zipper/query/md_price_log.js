import { eq, or } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { md_price_log } from '../schema.js';

import * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryLogPromise = db.orderEntryLog
		.insert(md_price_log)
		.values(req.body)
		.returning({
			insertedUuid: md_price_log.id,
		});

	try {
		const data = await orderEntryLogPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryLogPromise = db.orderEntryLog
		.update(md_price_log)
		.set(req.body)
		.where(eq(md_price_log.id, req.params.id))
		.returning({
			updatedUuid: md_price_log.id,
		});

	try {
		const data = await orderEntryLogPromise;

		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const orderEntryLogPromise = db.orderEntryLog
		.delete()
		.where(eq(md_price_log.id, req.params.id))
		.returning({
			deletedUuid: md_price_log.id,
		});

	try {
		const data = await orderEntryLogPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const orderEntryLogPromise = db
		.select({
			id: md_price_log.id,
			order_description_uuid: md_price_log.order_description_uuid,
			thread_order_info_uuid: md_price_log.thread_order_info_uuid,
			md_price: decimalToNumber(md_price_log.md_price),
			mkt_company_price: decimalToNumber(md_price_log.mkt_company_price),
			mkt_party_price: decimalToNumber(md_price_log.mkt_party_price),
			created_by: md_price_log.created_by,
			created_by_name: hrSchema.users.name,
			created_at: md_price_log.created_at,
		})
		.from(md_price_log)
		.leftJoin(
			hrSchema.users,
			eq(md_price_log.created_by, hrSchema.users.uuid)
		)
		.where(eq(md_price_log.id, req.params.id));

	try {
		const data = await orderEntryLogPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'md_price_log selected',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { order_description_uuid } = req.query;
	const orderEntryLogPromise = db
		.select({
			id: md_price_log.id,
			order_description_uuid: md_price_log.order_description_uuid,
			thread_order_info_uuid: md_price_log.thread_order_info_uuid,
			md_price: decimalToNumber(md_price_log.md_price),
			mkt_company_price: decimalToNumber(md_price_log.mkt_company_price),
			mkt_party_price: decimalToNumber(md_price_log.mkt_party_price),
			created_by: md_price_log.created_by,
			created_by_name: hrSchema.users.name,
			created_at: md_price_log.created_at,
		})
		.from(md_price_log)
		.leftJoin(
			hrSchema.users,
			eq(md_price_log.created_by, hrSchema.users.uuid)
		);

	if (order_description_uuid) {
		orderEntryLogPromise.where(
			or(
				eq(md_price_log.order_description_uuid, order_description_uuid),
				eq(md_price_log.thread_order_info_uuid, order_description_uuid)
			)
		);
	}

	try {
		const data = await orderEntryLogPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'md_price_log select all',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
