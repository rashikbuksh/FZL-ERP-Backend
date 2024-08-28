import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { sfg_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.insert(sfg_production)
		.values(req.body)
		.returning({ insertedSection: sfg_production.section });
	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedSection} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.update(sfg_production)
		.set(req.body)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning({ updatedSection: sfg_production.section });

	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedSection} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sfgProductionPromise = db
		.delete(sfg_production)
		.where(eq(sfg_production.uuid, req.params.uuid))
		.returning({ deletedSection: sfg_production.section });
	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedSection} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: sfg_production.uuid,
			sfg_uuid: sfg_production.sfg_uuid,
			section: sfg_production.section,
			production_quantity_in_kg: sfg_production.production_quantity_in_kg,
			production_quantity: sfg_production.production_quantity,
			wastage: sfg_production.wastage,
			created_by: sfg_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_production.created_at,
			updated_at: sfg_production.updated_at,
			remarks: sfg_production.remarks,
		})
		.from(sfg_production)
		.leftJoin(
			hrSchema.users,
			eq(sfg_production.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'SFG Production list',
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

	const sfgProductionPromise = db
		.select({
			uuid: sfg_production.uuid,
			sfg_uuid: sfg_production.sfg_uuid,
			section: sfg_production.section,
			production_quantity_in_kg: sfg_production.production_quantity_in_kg,
			production_quantity: sfg_production.production_quantity,
			wastage: sfg_production.wastage,
			created_by: sfg_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: sfg_production.created_at,
			updated_at: sfg_production.updated_at,
			remarks: sfg_production.remarks,
		})
		.from(sfg_production)
		.leftJoin(
			hrSchema.users,
			eq(sfg_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(sfg_production.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'SFG Production',
	};
	handleResponse({
		promise: sfgProductionPromise,
		res,
		next,
		...toast,
	});
}
