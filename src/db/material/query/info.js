import { and, asc, eq, lt, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { booking, info, section, stock, type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db.insert(info).values(req.body).returning({
		createdName: info.name,
	});

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].createdName} created`,
		};

		res.status(201).json({ data, toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.update(info)
		.set(req.body)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ updatedName: info.name });

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.delete(info)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ deletedName: info.name });

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { s_type, is_hidden } = req.query;

	const resultPromise = db
		.select({
			uuid: info.uuid,
			section_uuid: info.section_uuid,
			section_name: section.name,
			index: info.index,
			type_uuid: info.type_uuid,
			type_name: type.name,
			name: info.name,
			short_name: info.short_name,
			stock: decimalToNumber(stock.stock),
			booking_quantity: decimalToNumber(booking.quantity),
			is_below_threshold: lt(stock.stock, info.threshold),
			unit: info.unit,
			threshold: decimalToNumber(info.threshold),
			is_priority_material: info.is_priority_material,
			average_lead_time: info.average_lead_time,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			created_by: info.created_by,
			created_by_name: hrSchema.users.name,
			remarks: info.remarks,
			avg_price: decimalToNumber(sql`
							CASE 
								WHEN purchase_entry.total_price IS NULL OR purchase_entry.total_price = 0 
								THEN 0 
								ELSE purchase_entry.total_price / purchase_entry.total_quantity 
							END`),
			store_type: info.store_type,
			is_hidden: info.is_hidden,
		})
		.from(info)
		.leftJoin(section, eq(info.section_uuid, section.uuid))
		.leftJoin(type, eq(info.type_uuid, type.uuid))
		.leftJoin(stock, eq(info.uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
		.leftJoin(booking, eq(info.uuid, booking.material_uuid))
		.leftJoin(
			sql`(
				SELECT 
					material_uuid, 
					SUM(quantity - provided_quantity) as total_quantity, 
					SUM((price / quantity) * (quantity - provided_quantity)) as total_price
				FROM purchase.entry
				WHERE quantity - provided_quantity > 0
				GROUP BY material_uuid
			) as purchase_entry`,
			eq(info.uuid, sql`purchase_entry.material_uuid`)
		)
		.orderBy(asc(info.name));

	if (s_type && is_hidden) {
		resultPromise.where(
			and(eq(info.store_type, s_type), eq(info.is_hidden, is_hidden))
		);
	} else if (s_type) {
		resultPromise.where(eq(info.store_type, s_type));
	} else if (is_hidden) {
		resultPromise.where(eq(info.is_hidden, is_hidden));
	}

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Info',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.select({
			uuid: info.uuid,
			section_uuid: info.section_uuid,
			section_name: section.name,
			index: info.index,
			type_uuid: info.type_uuid,
			type_name: type.name,
			name: info.name,
			short_name: info.short_name,
			stock: decimalToNumber(stock.stock),
			booking_quantity: decimalToNumber(booking.quantity),
			is_below_threshold: lt(stock.stock, info.threshold),
			unit: info.unit,
			threshold: decimalToNumber(info.threshold),
			is_priority_material: info.is_priority_material,
			average_lead_time: info.average_lead_time,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			created_by: info.created_by,
			created_by_name: hrSchema.users.name,
			remarks: info.remarks,
			store_type: info.store_type,
			is_hidden: info.is_hidden,
		})
		.from(info)
		.leftJoin(section, eq(info.section_uuid, section.uuid))
		.leftJoin(type, eq(info.type_uuid, type.uuid))
		.leftJoin(stock, eq(info.uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
		.leftJoin(booking, eq(info.uuid, booking.material_uuid))
		.where(eq(info.uuid, req.params.uuid));

	try {
		const data = await infoPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Info',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
