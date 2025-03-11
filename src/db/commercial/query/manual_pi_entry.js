import { asc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { manual_pi_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiEntryPromise = db
		.insert(manual_pi_entry)
		.values(req.body)
		.returning({
			insertedName: manual_pi_entry.order_number,
		});
	try {
		const data = await manualPiEntryPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedName} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiEntryPromise = db
		.update(manual_pi_entry)
		.set(req.body)
		.where(eq(manual_pi_entry.uuid, req.params.uuid))
		.returning({ updatedName: manual_pi_entry.order_number });

	try {
		const data = await manualPiEntryPromise;
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

	const manualPiEntryPromise = db
		.delete(manual_pi_entry)
		.where(eq(manual_pi_entry.uuid, req.params.uuid))
		.returning({ deletedName: manual_pi_entry.order_number });

	try {
		const data = await manualPiEntryPromise;
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
	const resultPromise = db
		.select({
			uuid: manual_pi_entry.uuid,
			order_number: manual_pi_entry.order_number,
			po: manual_pi_entry.po,
			style: manual_pi_entry.style,
			item: manual_pi_entry.item,
			specification: manual_pi_entry.specification,
			size: manual_pi_entry.size,
			quantity: decimalToNumber(manual_pi_entry.quantity),
			unit_price: decimalToNumber(manual_pi_entry.unit_price),
			value: sql` ROUND(coalesce(manual_pi_entry.unit_price,0)::numeric / 12 * coalesce(manual_pi_entry.quantity,0)::numeric, 4) `,
			is_zipper: manual_pi_entry.is_zipper,
			created_at: manual_pi_entry.created_at,
			updated_at: manual_pi_entry.updated_at,
			remarks: manual_pi_entry.remarks,
		})
		.from(manual_pi_entry)
		.orderBy(asc(manual_pi_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'manual_pi_entry',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiEntryPromise = db
		.select({
			uuid: manual_pi_entry.uuid,
			order_number: manual_pi_entry.order_number,
			po: manual_pi_entry.po,
			style: manual_pi_entry.style,
			item: manual_pi_entry.item,
			specification: manual_pi_entry.specification,
			size: manual_pi_entry.size,
			quantity: decimalToNumber(manual_pi_entry.quantity),
			unit_price: decimalToNumber(manual_pi_entry.unit_price),
			value: sql` ROUND(coalesce(manual_pi_entry.unit_price,0)::numeric / 12 * coalesce(manual_pi_entry.quantity,0)::numeric, 4) `,
			is_zipper: manual_pi_entry.is_zipper,
			created_at: manual_pi_entry.created_at,
			updated_at: manual_pi_entry.updated_at,
			remarks: manual_pi_entry.remarks,
		})
		.from(manual_pi_entry)
		.where(eq(manual_pi_entry.uuid, req.params.uuid));

	try {
		const data = await manualPiEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'manual_pi_entry',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByManualPiUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiEntryPromise = db
		.select({
			uuid: manual_pi_entry.uuid,
			order_number: manual_pi_entry.order_number,
			po: manual_pi_entry.po,
			style: manual_pi_entry.style,
			item: manual_pi_entry.item,
			specification: manual_pi_entry.specification,
			size: manual_pi_entry.size,
			quantity: decimalToNumber(manual_pi_entry.quantity),
			unit_price: decimalToNumber(manual_pi_entry.unit_price),
			value: sql` ROUND(coalesce(manual_pi_entry.unit_price,0)::numeric / 12 * coalesce(manual_pi_entry.quantity,0)::numeric, 4) `,
			is_zipper: manual_pi_entry.is_zipper,
			created_at: manual_pi_entry.created_at,
			updated_at: manual_pi_entry.updated_at,
			remarks: manual_pi_entry.remarks,
		})
		.from(manual_pi_entry)
		.where(eq(manual_pi_entry.manual_pi_uuid, req.params.manual_pi_uuid))
		.orderBy(asc(manual_pi_entry.order_number));

	try {
		const data = await manualPiEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'manual_pi_entry',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
