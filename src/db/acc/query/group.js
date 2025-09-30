import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { group, head } from '../schema.js';

import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const groupPromise = db
		.insert(group)
		.values(req.body)
		.returning({ insertedName: group.name });

	try {
		const data = await groupPromise;
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

	const groupPromise = db
		.update(group)
		.set(req.body)
		.where(eq(group.uuid, req.params.uuid))
		.returning({ updatedName: group.name });

	try {
		const data = await groupPromise;
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

	const groupPromise = db
		.delete(group)
		.where(eq(group.uuid, req.params.uuid))
		.returning({ deletedName: group.name });

	try {
		const data = await groupPromise;
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
			uuid: group.uuid,
			name: group.name,
			head_uuid: group.head_uuid,
			head_name: head.name,
			code: group.code,
			is_fixed: group.is_fixed,
			created_by: group.created_by,
			created_by_name: createdByUser.name,
			created_at: group.created_at,
			updated_by: group.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: group.updated_at,
			remarks: group.remarks,
			group_number: group.group_number,
			index: group.index,
		})
		.from(group)
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(group.created_by, hrSchema.users.uuid))
		.leftJoin(createdByUser, eq(group.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(group.updated_by, updatedByUser.uuid))
		.orderBy(asc(group.index));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Groups',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const groupPromise = db
		.select({
			uuid: group.uuid,
			name: group.name,
			head_uuid: group.head_uuid,
			head_name: head.name,
			code: group.code,
			is_fixed: group.is_fixed,
			created_by: group.created_by,
			created_by_name: createdByUser.name,
			created_at: group.created_at,
			updated_by: group.updated_by,
			updated_by_name: updatedByUser.name,
			updated_at: group.updated_at,
			remarks: group.remarks,
			group_number: group.group_number,
			index: group.index,
		})
		.from(group)
		.leftJoin(head, eq(group.head_uuid, head.uuid))
		.leftJoin(hrSchema.users, eq(group.created_by, hrSchema.users.uuid))
		.leftJoin(createdByUser, eq(group.created_by, createdByUser.uuid))
		.leftJoin(updatedByUser, eq(group.updated_by, updatedByUser.uuid))
		.where(eq(group.uuid, req.params.uuid));

	try {
		const data = await groupPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Group',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
