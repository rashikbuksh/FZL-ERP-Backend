import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
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
			msg: `${data[0].insertedName} inserted`,
		};
		handleResponse({
			promise: propertiesPromise,
			res,
			next,
			...toast,
		});
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
			status: 200,
			type: 'update',
			msg: `${data[0].updatedName} updated`,
		};
		handleResponse({
			promise: propertiesPromise,
			res,
			next,
			...toast,
		});
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
			status: 200,
			type: 'remove',
			msg: `${data[0].deletedName} deleted`,
		};
		handleResponse({
			promise: propertiesPromise,
			res,
			next,
			...toast,
		});
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
		);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Property list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
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
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Property',
	};
	handleResponse({
		promise: propertiesPromise,
		res,
		next,
		...toast,
	});
}
