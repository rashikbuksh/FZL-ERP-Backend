import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db.insert(type).values(req.body).returning({
		insertedId: type.name,
	});
	try {
		const data = await typePromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.update(type)
		.set(req.body)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ updatedName: type.name });

	try {
		const data = await typePromise;
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

	const typePromise = db
		.delete(type)
		.where(eq(type.uuid, req.params.uuid))
		.returning({ deletedName: type.name });

	try {
		const data = await typePromise;
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
			uuid: type.uuid,
			name: type.name,
			short_name: type.short_name,
			remarks: type.remarks,
			created_at: type.created_at,
			updated_at: type.updated_at,
			created_by: type.created_by,
			created_by_name: hrSchema.users.name,
			store_type: type.store_type,
		})
		.from(type)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, type.created_by))
		.orderBy(desc(type.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Type list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const typePromise = db
		.select({
			uuid: type.uuid,
			name: type.name,
			short_name: type.short_name,
			remarks: type.remarks,
			created_at: type.created_at,
			updated_at: type.updated_at,
			created_by: type.created_by,
			created_by_name: hrSchema.users.name,
			store_type: type.store_type,
		})
		.from(type)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, type.created_by))
		.where(eq(type.uuid, req.params.uuid));

	try {
		const data = await typePromise;
		const toast = {
			status: 201,
			type: 'select',
			message: `Select type`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
