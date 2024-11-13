import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { marketing } from '../schema.js';

const hr = alias(hrSchema.users, 'hr');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.insert(marketing)
		.values(req.body)
		.returning({ insertedName: marketing.name });

	try {
		const data = await marketingPromise;
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

	const marketingPromise = db
		.update(marketing)
		.set(req.body)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ updatedName: marketing.name });

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.delete(marketing)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ deletedName: marketing.name });

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} removed`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: marketing.uuid,
			name: marketing.name,
			short_name: marketing.short_name,
			user_uuid: marketing.user_uuid,
			user_designation: hrSchema.designation.designation,
			created_at: marketing.created_at,
			updated_at: marketing.updated_at,
			created_by: marketing.created_by,
			created_by_name: hr.name,
			remarks: marketing.remarks,
		})
		.from(marketing)
		.leftJoin(hrSchema.users, eq(marketing.user_uuid, hrSchema.users.uuid))
		.leftJoin(hr, eq(marketing.created_by, hr.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.orderBy(desc(marketing.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Marketing list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.select({
			uuid: marketing.uuid,
			name: marketing.name,
			short_name: marketing.short_name,
			user_uuid: marketing.user_uuid,
			user_designation: hrSchema.designation.designation,
			created_at: marketing.created_at,
			updated_at: marketing.updated_at,
			created_by: marketing.created_by,
			created_by_name: hr.name,
			remarks: marketing.remarks,
		})
		.from(marketing)
		.leftJoin(hrSchema.users, eq(marketing.user_uuid, hrSchema.users.uuid))
		.leftJoin(hr, eq(marketing.created_by, hr.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.where(eq(marketing.uuid, req.params.uuid));

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Marketing',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
