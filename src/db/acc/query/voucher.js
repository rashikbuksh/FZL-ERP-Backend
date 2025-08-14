import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { voucher } from '../schema.js';

import hr, * as hrSchema from '../../hr/schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.insert(voucher)
		.values(req.body)
		.returning({ insertedDate: voucher.date });

	try {
		const data = await voucherPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Voucher for ${data[0].insertedDate} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.update(voucher)
		.set(req.body)
		.where(eq(voucher.uuid, req.params.uuid))
		.returning({ updatedDate: voucher.date });

	try {
		const data = await voucherPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `Voucher for ${data[0].updatedDate} updated`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.delete(voucher)
		.where(eq(voucher.uuid, req.params.uuid))
		.returning({ deletedDate: voucher.date });

	try {
		const data = await voucherPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Voucher for ${data[0].deletedDate} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: voucher.uuid,
			date: voucher.date,
			category: voucher.category,
			vat_deduction: voucher.vat_deduction,
			tax_deduction: voucher.tax_deduction,
			created_by: voucher.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher.created_at,
			updated_by: voucher.updated_by,
			updated_at: voucher.updated_at,
			remarks: voucher.remarks,
		})
		.from(voucher)
		.leftJoin(hrSchema.users, eq(voucher.created_by, hrSchema.users.uuid))
		.orderBy(desc(voucher.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Vouchers',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const voucherPromise = db
		.select({
			uuid: voucher.uuid,
			date: voucher.date,
			category: voucher.category,
			vat_deduction: voucher.vat_deduction,
			tax_deduction: voucher.tax_deduction,
			created_by: voucher.created_by,
			created_by_name: hrSchema.users.name,
			created_at: voucher.created_at,
			updated_by: voucher.updated_by,
			updated_at: voucher.updated_at,
			remarks: voucher.remarks,
		})
		.from(voucher)
		.leftJoin(hrSchema.users, eq(voucher.created_by, hrSchema.users.uuid))
		.where(eq(voucher.uuid, req.params.uuid));

	try {
		const data = await voucherPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Voucher',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
