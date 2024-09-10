import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { department } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.insert(department)
		.values(req.body)
		.returning({ insertedName: department.department });

	try {
		const data = await departmentPromise;
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

	const departmentPromise = db
		.update(department)
		.set(req.body)
		.where(eq(department.uuid, req.params.uuid))
		.returning({ updatedName: department.department });

	try {
		const data = await departmentPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const departmentPromise = db
		.delete(department)
		.where(eq(department.uuid, req.params.uuid))
		.returning({ deletedName: department.department });

	try {
		const data = await departmentPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select()
		.from(department)
		.orderBy(desc(department.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Designation list',
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

	const departmentPromise = db
		.select()
		.from(department)
		.where(eq(department.uuid, req.params.uuid));

	try {
		const data = await departmentPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Department',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
