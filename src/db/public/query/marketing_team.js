import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { marketing_team } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketing_teamPromise = db
		.insert(marketing_team)
		.values(req.body)
		.returning({ insertedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
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

	const marketing_teamPromise = db
		.update(marketing_team)
		.set(req.body)
		.where(eq(marketing_team.uuid, req.params.uuid))
		.returning({ updatedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
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

	const marketing_teamPromise = db
		.delete(marketing_team)
		.where(eq(marketing_team.uuid, req.params.uuid))
		.returning({ deletedName: marketing_team.name });

	try {
		const data = await marketing_teamPromise;
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

export async function select(req, res, next) {
	const marketing_teamPromise = db
		.select({
			uuid: marketing_team.uuid,
			name: marketing_team.name,
			created_at: marketing_team.created_at,
			updated_at: marketing_team.updated_at,
			created_by: marketing_team.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team.remarks,
		})
		.from(marketing_team)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team.created_by, hrSchema.users.uuid)
		)
		.where(eq(marketing_team.uuid, req.params.uuid));

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			message: 'marketing_team select',
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
	const marketing_teamPromise = db
		.select({
			uuid: marketing_team.uuid,
			name: marketing_team.name,
			created_at: marketing_team.created_at,
			updated_at: marketing_team.updated_at,
			created_by: marketing_team.created_by,
			created_by_name: hrSchema.users.name,
			remarks: marketing_team.remarks,
		})
		.from(marketing_team)
		.leftJoin(
			hrSchema.users,
			eq(marketing_team.created_by, hrSchema.users.uuid)
		);

	try {
		const data = await marketing_teamPromise;
		const toast = {
			status: 200,
			message: 'marketing_team list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}
