import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { designation } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.insert(designation)
		.values(req.body)
		.returning({ insertedName: designation.designation });

	try {
		const data = await designationPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.update(designation)
		.set(req.body)
		.where(eq(designation.uuid, req.params.uuid))
		.returning({ updatedName: designation.designation });

	try {
		const data = await designationPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.delete(designation)
		.where(eq(designation.uuid, req.params.uuid))
		.returning({ deletedName: designation.designation });

	try {
		const data = await designationPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: designation.uuid,
			designation: designation.designation,
			created_at: designation.created_at,
			updated_at: designation.updated_at,
			remarks: designation.remarks,
		})
		.from(designation)
		.orderBy(desc(designation.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Designations',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const designationPromise = db
		.select({
			uuid: designation.uuid,
			designation: designation.designation,
			created_at: designation.created_at,
			updated_at: designation.updated_at,
			remarks: designation.remarks,
		})
		.from(designation)
		.where(eq(designation.uuid, req.params.uuid));

	try {
		const data = await designationPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Designation',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
