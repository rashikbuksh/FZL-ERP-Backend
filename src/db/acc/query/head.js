import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { head } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const headPromise = db
		.insert(head)
		.values(req.body)
		.returning({ insertedName: head.name });

	try {
		const data = await headPromise;
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

	const headPromise = db
		.update(head)
		.set(req.body)
		.where(eq(head.uuid, req.params.uuid))
		.returning({ updatedName: head.name });

	try {
		const data = await headPromise;
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

	const headPromise = db
		.delete(head)
		.where(eq(head.uuid, req.params.uuid))
		.returning({ deletedName: head.name });

	try {
		const data = await headPromise;
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
			uuid: head.uuid,
			name: head.name,
			title: head.title,
			bs: head.bs,
			is_fixed: head.is_fixed,
			created_by: head.created_by,
			created_by_name: hrSchema.users.name,
			created_at: head.created_at,
			updated_by: head.updated_by,
			updated_at: head.updated_at,
			remarks: head.remarks,
		})
		.from(head)
		.leftJoin(hrSchema.users, eq(head.created_by, hrSchema.users.uuid))
		.orderBy(desc(head.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Heads',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const headPromise = db
		.select({
			uuid: head.uuid,
			name: head.name,
			title: head.title,
			bs: head.bs,
			is_fixed: head.is_fixed,
			created_by: head.created_by,
			created_by_name: hrSchema.users.name,
			created_at: head.created_at,
			updated_by: head.updated_by,
			updated_at: head.updated_at,
			remarks: head.remarks,
		})
		.from(head)
		.leftJoin(hrSchema.users, eq(head.created_by, hrSchema.users.uuid))
		.where(eq(head.uuid, req.params.uuid));

	try {
		const data = await headPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Head',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
