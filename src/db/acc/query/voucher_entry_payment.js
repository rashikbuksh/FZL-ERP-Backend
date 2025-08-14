import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { voucher_entry_payment, voucher_entry } from '../schema.js';

import * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const paymentPromise = db
		.insert(voucher_entry_payment)
		.values(req.body)
		.returning({ insertedIndex: voucher_entry_payment.index });

	try {
		const data = await paymentPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Voucher Entry Payment #${data[0].insertedIndex} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const paymentPromise = db
		.update(voucher_entry_payment)
		.set(req.body)
		.where(eq(voucher_entry_payment.uuid, req.params.uuid))
		.returning({ updatedIndex: voucher_entry_payment.index });

	try {
		const data = await paymentPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `Voucher Entry Payment #${data[0].updatedIndex} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const paymentPromise = db
		.delete(voucher_entry_payment)
		.where(eq(voucher_entry_payment.uuid, req.params.uuid))
		.returning({ deletedIndex: voucher_entry_payment.index });

	try {
		const data = await paymentPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Voucher Entry Payment #${data[0].deletedIndex} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: voucher_entry_payment.uuid,
			index: voucher_entry_payment.index,
			voucher_entry_uuid: voucher_entry_payment.voucher_entry_uuid,
			payment_type: voucher_entry_payment.payment_type,
			trx_no: voucher_entry_payment.trx_no,
			date: voucher_entry_payment.date,
			created_by: voucher_entry_payment.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher_entry_payment.created_at,
			updated_by: voucher_entry_payment.updated_by,
			updated_at: voucher_entry_payment.updated_at,
			remarks: voucher_entry_payment.remarks,
		})
		.from(voucher_entry_payment)
		.leftJoin(
			hrSchema.users,
			eq(voucher_entry_payment.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(voucher_entry_payment.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entry Payments',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const paymentPromise = db
		.select({
			uuid: voucher_entry_payment.uuid,
			index: voucher_entry_payment.index,
			voucher_entry_uuid: voucher_entry_payment.voucher_entry_uuid,
			payment_type: voucher_entry_payment.payment_type,
			trx_no: voucher_entry_payment.trx_no,
			date: voucher_entry_payment.date,
			created_by: voucher_entry_payment.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher_entry_payment.created_at,
			updated_by: voucher_entry_payment.updated_by,
			updated_at: voucher_entry_payment.updated_at,
			remarks: voucher_entry_payment.remarks,
		})
		.from(voucher_entry_payment)
		.leftJoin(
			hrSchema.users,
			eq(voucher_entry_payment.created_by, hrSchema.users.uuid)
		)
		.where(eq(voucher_entry_payment.uuid, req.params.uuid));

	try {
		const data = await paymentPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher Entry Payment',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
