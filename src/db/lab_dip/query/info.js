import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.insert(info)
		.values(req.body)
		.returning({ insertedName: info.name });

	try {
		const data = await infoPromise;

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

		return res.status(201).json({ toast, data });
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
	const resultPromise = db.select().from(info);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Info list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.select()
		.from(info)
		.where(eq(info.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Info',
	};
	handleResponse({ promise: infoPromise, res, next, ...toast });
}
