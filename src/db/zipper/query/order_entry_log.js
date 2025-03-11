import { asc, desc, eq, sql, sum, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as deliverySchema from '../../delivery/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { order_entry_log } from '../schema.js';

import * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderEntryLogPromise = db.orderEntryLog
		.insert(order_entry_log)
		.values(req.body)
		.returning({
			insertedUuid: order_entry_log.uuid,
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
		.update(order_entry_log)
		.set(req.body)
		.where(order_entry_log.uuid.eq(req.params.uuid))
		.returning({
			updatedUuid: order_entry_log.uuid,
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
		.where(order_entry_log.uuid.eq(req.params.uuid))
		.returning({
			deletedUuid: order_entry_log.uuid,
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
	console.log(req.params.id);
	const orderEntryLogPromise = db
		.select({
			id: order_entry_log.id,
			order_entry_uuid: order_entry_log.order_entry_uuid,
			thread_order_entry_uuid: order_entry_log.thread_order_entry_uuid,
			style: order_entry_log.style,
			color: order_entry_log.color,
			size: order_entry_log.size,
			quantity: decimalToNumber(order_entry_log.quantity),
			company_price: decimalToNumber(order_entry_log.company_price),
			party_price: decimalToNumber(order_entry_log.party_price),
			created_by: order_entry_log.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry_log.created_at,
		})
		.from(order_entry_log)
		.leftJoin(
			hrSchema.users,
			eq(order_entry_log.created_by, hrSchema.users.uuid)
		)
		.where(eq(order_entry_log.id, req.params.id));

	try {
		const data = await orderEntryLogPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry_log selected',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { order_entry_uuid } = req.query;
	const orderEntryLogPromise = db
		.select({
			id: order_entry_log.id,
			order_entry_uuid: order_entry_log.order_entry_uuid,
			thread_order_entry_uuid: order_entry_log.thread_order_entry_uuid,
			style: order_entry_log.style,
			color: order_entry_log.color,
			size: order_entry_log.size,
			quantity: decimalToNumber(order_entry_log.quantity),
			company_price: decimalToNumber(order_entry_log.company_price),
			party_price: decimalToNumber(order_entry_log.party_price),
			created_by: order_entry_log.created_by,
			created_by_name: hrSchema.users.name,
			created_at: order_entry_log.created_at,
		})
		.from(order_entry_log)
		.leftJoin(
			hrSchema.users,
			eq(order_entry_log.created_by, hrSchema.users.uuid)
		);

	if (order_entry_uuid) {
		orderEntryLogPromise.where(
			or(
				eq(order_entry_log.order_entry_uuid, order_entry_uuid),
				eq(order_entry_log.thread_order_entry_uuid, order_entry_uuid)
			)
		);
	}

	try {
		const data = await orderEntryLogPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'order_entry_log select all',
		};

		res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
