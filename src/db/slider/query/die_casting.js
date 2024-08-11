import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { die_casting } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.insert(die_casting)
		.values(req.body)
		.returning({ insertedName: die_casting.name });
	try {
		const data = await dieCastingPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.update(die_casting)
		.set(req.body)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning({ updatedName: die_casting.name });
	try {
		const data = await dieCastingPromise;
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

	const dieCastingPromise = db
		.delete(die_casting)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning({ deletedName: die_casting.name });
	try {
		const data = await dieCastingPromise;
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
	const resultPromise = db.select().from(die_casting);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.select()
		.from(die_casting)
		.where(eq(die_casting.uuid, req.params.uuid));
	handleResponse(dieCastingPromise, res, next);
}
