import { asc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { section, store_type_enum } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.insert(section)
		.values(req.body)
		.returning({ createdName: section.name });

	try {
		const data = await sectionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].createdName} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.update(section)
		.set(req.body)
		.where(eq(section.uuid, req.params.uuid))
		.returning({ updatedName: section.name });

	try {
		const data = await sectionPromise;
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

	const sectionPromise = db
		.delete(section)
		.where(eq(section.uuid, req.params.uuid))
		.returning({ deletedName: section.name });

	try {
		const data = await sectionPromise;
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
	const { s_type } = req.query;

	const resultPromise = db
		.select({
			uuid: section.uuid,
			name: section.name,
			short_name: section.short_name,
			remarks: section.remarks,
			created_at: section.created_at,
			updated_at: section.updated_at,
			created_by: section.created_by,
			created_by_name: hrSchema.users.name,
			index: section.index,
			store_type: section.store_type,
		})
		.from(section)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, section.created_by))
		.where(
			s_type ? eq(section.store_type, s_type) : sql`true` // If no type is specified, select all sections
		)
		.orderBy(asc(section.name));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Section list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.select({
			uuid: section.uuid,
			name: section.name,
			short_name: section.short_name,
			remarks: section.remarks,
			created_at: section.created_at,
			updated_at: section.updated_at,
			created_by: section.created_by,
			created_by_name: hrSchema.users.name,
			index: section.index,
			store_type: section.store_type,
		})
		.from(section)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, section.created_by))
		.where(eq(section.uuid, req.params.uuid));

	try {
		const data = await sectionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Section',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
