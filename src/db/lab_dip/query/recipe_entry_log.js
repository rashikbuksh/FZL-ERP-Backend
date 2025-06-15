import { asc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { decimalToNumber } from '../../variables.js';
import { recipe, recipe_entry_log } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entry_logPromise = db
		.insert(recipe_entry_log)
		.values(req.body)
		.returning({ insertedId: recipe_entry_log.id });

	try {
		const data = await recipe_entry_logPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entry_logPromise = db
		.update(recipe_entry_log)
		.set(req.body)
		.where(eq(recipe_entry_log.id, req.params.id))
		.returning({ updatedId: recipe_entry_log.id });

	try {
		const data = await recipe_entry_logPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entry_logPromise = db
		.delete(recipe_entry_log)
		.where(eq(recipe_entry_log.id, req.params.id))
		.returning({ deletedId: recipe_entry_log.id });

	try {
		const data = await recipe_entry_logPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			id: recipe_entry_log.id,
			recipe_uuid: recipe_entry_log.recipe_uuid,
			quantity: decimalToNumber(recipe_entry_log.quantity),
			updated_at: recipe_entry_log.updated_at,
			updated_by: recipe_entry_log.updated_by,
			updated_by_name: hrSchema.users.name,
			remarks: recipe_entry_log.remarks,
		})
		.from(recipe_entry_log)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, recipe_entry_log.updated_by)
		)
		.orderBy(asc(recipe_entry_log.updated_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'recipe_entry_log',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const recipe_entry_logPromise = db
		.select({
			id: recipe_entry_log.id,
			recipe_uuid: recipe_entry_log.recipe_uuid,
			quantity: decimalToNumber(recipe_entry_log.quantity),
			updated_at: recipe_entry_log.updated_at,
			updated_by: recipe_entry_log.updated_by,
			updated_by_name: hrSchema.users.name,
			remarks: recipe_entry_log.remarks,
		})
		.from(recipe_entry_log)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, recipe_entry_log.updated_by)
		)
		.where(eq(recipe_entry_log.id, req.params.id));

	try {
		const data = await recipe_entry_logPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'recipe_entry_log',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
