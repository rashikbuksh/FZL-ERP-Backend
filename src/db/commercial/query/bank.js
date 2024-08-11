import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { bank } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db.insert(bank).values(req.body).returning({
		insertedName: bank.name,
	});
	try {
		const data = await bankPromise;
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

	const bankPromise = db
		.update(bank)
		.set(req.body)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ updatedName: bank.name });

	try {
		const data = await bankPromise;
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

	const bankPromise = db
		.delete(bank)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ deletedName: bank.name });

	try {
		const data = await bankPromise;
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
	const resultPromise = db.select().from(bank);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Bank list',
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

	const bankPromise = db
		.select()
		.from(bank)
		.where(eq(bank.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Bank',
	};

	handleResponse({
		promise: bankPromise,
		res,
		next,
		...toast,
	});
}
