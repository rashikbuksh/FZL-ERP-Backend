import { asc, desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { booking, info, stock } from '../schema.js';

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
	const { s_type, from_date, to_date } = req.query;

	const bookingPromise = db
		.select({
			uuid: booking.uuid,
			id: booking.id,
			material_uuid: booking.material_uuid,
			material_name: info.name,
			short_name: info.short_name,
			marketing_uuid: booking.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			unit: info.unit,
			stock: decimalToNumber(stock.stock),
			quantity: decimalToNumber(booking.quantity),
			trx_quantity: decimalToNumber(booking.trx_quantity),
			max_quantity: decimalToNumber(
				sql`COALESCE(${stock.stock}, 0) + COALESCE(${booking.quantity}, 0)`
			),
			created_by: booking.created_by,
			created_by_name: hrSchema.users.name,
			created_at: booking.created_at,
			updated_at: booking.updated_at,
			remarks: booking.remarks,
			store_type: info.store_type,
		})
		.from(booking)
		.leftJoin(hrSchema.users, eq(booking.created_by, hrSchema.users.uuid))
		.leftJoin(info, eq(booking.material_uuid, info.uuid))
		.leftJoin(stock, eq(booking.material_uuid, stock.material_uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(booking.marketing_uuid, publicSchema.marketing.uuid)
		);

	if (s_type) bookingPromise.where(eq(info.store_type, s_type));

	if (from_date && to_date) {
		bookingPromise.where(
			and(
				sql`${booking.created_at} >= ${from_date}`,
				sql`${booking.created_at} <= ${to_date}`
			)
		);
	}

	bookingPromise.orderBy(desc(booking.created_at));

	try {
		const data = await bookingPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'All booking',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const bookingPromise = db
		.select({
			uuid: booking.uuid,
			id: booking.id,
			material_uuid: booking.material_uuid,
			material_name: info.name,
			short_name: info.short_name,
			marketing_uuid: booking.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			unit: info.unit,
			stock: decimalToNumber(stock.stock),
			quantity: decimalToNumber(booking.quantity),
			trx_quantity: decimalToNumber(booking.trx_quantity),
			max_quantity: decimalToNumber(
				sql`COALESCE(${stock.stock}, 0) + COALESCE(${booking.quantity},0)`
			),
			created_by: booking.created_by,
			created_by_name: hrSchema.users.name,
			created_at: booking.created_at,
			updated_at: booking.updated_at,
			remarks: booking.remarks,
		})
		.from(booking)
		.leftJoin(hrSchema.users, eq(booking.created_by, hrSchema.users.uuid))
		.leftJoin(info, eq(booking.material_uuid, info.uuid))
		.leftJoin(stock, eq(booking.material_uuid, stock.material_uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(booking.marketing_uuid, publicSchema.marketing.uuid)
		)
		.where(eq(booking.uuid, req.params.uuid));

	try {
		const data = await bookingPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Booking',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
