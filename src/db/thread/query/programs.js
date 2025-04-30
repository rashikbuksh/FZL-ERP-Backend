import { asc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';

import { decimalToNumber } from '../../variables.js';
import { dyes_category, programs } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(programs)
		.values(req.body)
		.returning({ insertedId: programs.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(programs)
		.set(req.body)
		.where(eq(programs.uuid, req.params.uuid))
		.returning({ updatedId: programs.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(programs)
		.where(eq(programs.uuid, req.params.uuid))
		.returning({ deletedId: programs.uuid });

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: programs.uuid,
			dyes_category_uuid: programs.dyes_category_uuid,
			dyes_category_name: dyes_category.name,
			material_uuid: programs.material_uuid,
			material_name: materialSchema.info.name,
			dyes_category_id: dyes_category.id,
			bleaching: dyes_category.bleaching,
			quantity: decimalToNumber(programs.quantity),
			created_by: programs.created_by,
			created_by_name: hrSchema.users.name,
			created_at: programs.created_at,
			updated_at: programs.updated_at,
			remarks: programs.remarks,
		})
		.from(programs)
		.leftJoin(
			dyes_category,
			eq(programs.dyes_category_uuid, dyes_category.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(programs.material_uuid, materialSchema.info.uuid)
		)
		.leftJoin(hrSchema.users, eq(programs.created_by, hrSchema.users.uuid))
		.orderBy(asc(dyes_category.id));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'programs list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.select({
			uuid: programs.uuid,
			dyes_category_uuid: programs.dyes_category_uuid,
			dyes_category_name: dyes_category.name,
			material_uuid: programs.material_uuid,
			material_name: materialSchema.info.name,
			dyes_category_id: dyes_category.id,
			bleaching: dyes_category.bleaching,
			quantity: decimalToNumber(programs.quantity),
			created_by: programs.created_by,
			created_by_name: hrSchema.users.name,
			created_at: programs.created_at,
			updated_at: programs.updated_at,
			remarks: programs.remarks,
		})
		.from(programs)
		.leftJoin(hrSchema.users, eq(programs.created_by, hrSchema.users.uuid))
		.leftJoin(
			dyes_category,
			eq(programs.dyes_category_uuid, dyes_category.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(programs.material_uuid, materialSchema.info.uuid)
		)
		.where(eq(programs.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'programs',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
