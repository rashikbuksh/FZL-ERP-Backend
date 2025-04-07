import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { buyer } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.insert(buyer)
		.values(req.body)
		.returning({ insertedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.update(buyer)
		.set(req.body)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning({ updatedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.delete(buyer)
		.where(eq(buyer.uuid, req.params.uuid))
		.returning({ deletedName: buyer.name });

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const buyerPromise = db
		.select({
			uuid: buyer.uuid,
			name: buyer.name,
			short_name: buyer.short_name,
			created_at: buyer.created_at,
			updated_at: buyer.updated_at,
			created_by: buyer.created_by,
			created_by_name: hrSchema.users.name,
			remarks: buyer.remarks,
		})
		.from(buyer)
		.leftJoin(hrSchema.users, eq(buyer.created_by, hrSchema.users.uuid))
		.orderBy(desc(buyer.created_at));

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Buyer',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const buyerPromise = db
		.select({
			uuid: buyer.uuid,
			name: buyer.name,
			short_name: buyer.short_name,
			created_at: buyer.created_at,
			updated_at: buyer.updated_at,
			created_by: buyer.created_by,
			created_by_name: hrSchema.users.name,
			remarks: buyer.remarks,
		})
		.from(buyer)
		.leftJoin(hrSchema.users, eq(buyer.created_by, hrSchema.users.uuid))
		.where(eq(buyer.uuid, req.params.uuid));

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Buyer by uuid',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
