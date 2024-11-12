import { asc, desc, eq } from 'drizzle-orm';
import { description } from '../../../db/purchase/schema.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { booking } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bookingPromise = db.insert(booking).values(req.body).returning({
		insertedId: booking.uuid,
	});

	try {
		const data = await bookingPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		res.status(201).json({ data, toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bookingPromise = db
		.update(booking)
		.set(req.body)
		.where(eq(booking.uuid, req.params.uuid))
		.returning({ updatedId: booking.uuid });

	try {
		const data = await bookingPromise;
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

	const bookingPromise = db
		.delete(booking)
		.where(eq(booking.uuid, req.params.uuid))
		.returning({ deletedId: booking.uuid });

	try {
		const data = await bookingPromise;
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
	const bookingPromise = db.select(booking).orderBy(asc(booking.created_at));

	try {
		const data = await bookingPromise;
		return await handleResponse({ data, res });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const bookingPromise = db
		.select(booking)
		.where(eq(booking.uuid, req.params.uuid));

	try {
		const data = await bookingPromise;
		return await handleResponse({ data, res });
	} catch (error) {
		await handleError({ error, res });
	}
}
