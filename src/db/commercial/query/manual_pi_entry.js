import { asc, desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { bank, manual_pi_entry } from '../schema.js';

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
			quantity: manual_pi_entry.quantity,
			unit_price: manual_pi_entry.unit_price,
			is_zipper: manual_pi_entry.is_zipper,
			created_at: manual_pi_entry.created_at,
			updated_at: manual_pi_entry.updated_at,
			remarks: manual_pi_entry.remarks,
		})
		.from(manual_pi_entry)
		.orderBy(asc(manual_pi_entry.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'manual_pi_entry list',
	};

	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
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
			quantity: manual_pi_entry.quantity,
			unit_price: manual_pi_entry.unit_price,
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
			quantity: manual_pi_entry.quantity,
			unit_price: manual_pi_entry.unit_price,
			is_zipper: manual_pi_entry.is_zipper,
			created_at: manual_pi_entry.created_at,
			updated_at: manual_pi_entry.updated_at,
			remarks: manual_pi_entry.remarks,
		})
		.from(manual_pi_entry)
		.where(eq(manual_pi_entry.manual_pi_uuid, req.params.manual_pi_uuid));

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
