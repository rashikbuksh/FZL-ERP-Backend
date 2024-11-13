import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { properties } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.insert(properties)
		.values(req.body)
		.returning({ insertedName: properties.name });

	try {
		const data = await propertiesPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0]?.insertedName} inserted`,
		};
		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.update(properties)
		.set(req.body)
		.where(eq(properties.uuid, req.params.uuid))
		.returning({ updatedName: properties.name });

	try {
		const data = await propertiesPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.delete(properties)
		.where(eq(properties.uuid, req.params.uuid))
		.returning({ deletedName: properties.name });

	try {
		const data = await propertiesPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: properties.uuid,
			item_for: properties.item_for,
			type: properties.type,
			name: properties.name,
			short_name: properties.short_name,
			order_sheet_name: properties.order_sheet_name,
			created_by: properties.created_by,
			created_by_name: hrSchema.users.name,
			created_at: properties.created_at,
			updated_at: properties.updated_at,
			remarks: properties.remarks,
		})
		.from(properties)
		.leftJoin(
			hrSchema.users,
			eq(properties.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(properties.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Properties list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const propertiesPromise = db
		.select({
			uuid: properties.uuid,
			item_for: properties.item_for,
			type: properties.type,
			name: properties.name,
			short_name: properties.short_name,
			order_sheet_name: properties.order_sheet_name,
			created_by: properties.created_by,
			created_by_name: hrSchema.users.name,
			created_at: properties.created_at,
			updated_at: properties.updated_at,
			remarks: properties.remarks,
		})
		.from(properties)
		.leftJoin(
			hrSchema.users,
			eq(properties.created_by, hrSchema.users.uuid)
		)
		.where(eq(properties.uuid, req.params.uuid));

	try {
		const data = await propertiesPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Property by uuid',
		};
		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
