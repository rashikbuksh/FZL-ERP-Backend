import { asc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { vendor } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.insert(vendor)
		.values(req.body)
		.returning({ insertedId: vendor.name });
	try {
		const data = await vendorPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.update(vendor)
		.set(req.body)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning({ updatedID: vendor.name });
	try {
		const data = await vendorPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedID} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.delete(vendor)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning({ deletedId: vendor.name });
	try {
		const data = await vendorPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { s_type } = req.query;

	const resultPromise = db
		.select({
			uuid: vendor.uuid,
			name: vendor.name,
			contact_name: vendor.contact_name,
			email: vendor.email,
			office_address: vendor.office_address,
			contact_number: vendor.contact_number,
			created_at: vendor.created_at,
			updated_at: vendor.updated_at,
			created_by: vendor.created_by,
			created_by_name: hrSchema.users.name,
			remarks: vendor.remarks,
			store_type: vendor.store_type,
		})
		.from(vendor)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, vendor.created_by))
		.where(s_type ? eq(vendor.store_type, s_type) : sql`TRUE`)
		.orderBy(asc(vendor.name));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'vendors',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.select({
			uuid: vendor.uuid,
			name: vendor.name,
			contact_name: vendor.contact_name,
			email: vendor.email,
			office_address: vendor.office_address,
			contact_number: vendor.contact_number,
			created_at: vendor.created_at,
			updated_at: vendor.updated_at,
			created_by: vendor.created_by,
			created_by_name: hrSchema.users.name,
			remarks: vendor.remarks,
			store_type: vendor.store_type,
		})
		.from(vendor)
		.leftJoin(hrSchema.users, eq(hrSchema.users.uuid, vendor.created_by))
		.where(eq(vendor.uuid, req.params.uuid));
	try {
		const data = await vendorPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'vendor by uuid',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
