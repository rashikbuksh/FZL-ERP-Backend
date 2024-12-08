import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';

import { cash_receive } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.insert(cash_receive)
		.values(req.body)
		.returning({
			insertedUuid: cash_receive.uuid,
		});
	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedUuid} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.update(cash_receive)
		.set(req.body)
		.where(eq(cash_receive.uuid, req.params.uuid))
		.returning({ updatedUuid: cash_receive.uuid });

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.delete(cash_receive)
		.where(eq(cash_receive.uuid, req.params.uuid))
		.returning({ deletedUuid: cash_receive.uuid });

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const cashReceivePromise = db.select(cash_receive).from(cash_receive);

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'cash_receive list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const cashReceivePromise = db
		.select(cash_receive)
		.from(cash_receive)
		.where(eq(cash_receive.uuid, req.params.uuid));

	try {
		const data = await cashReceivePromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `cash_receive`,
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
