import { asc, desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { section } from '../schema.js';

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
		})
		.from(section)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, section.created_by))
		.orderBy(asc(section.name));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Section list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
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
