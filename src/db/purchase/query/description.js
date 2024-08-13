import { eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { description, vendor } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.insert(description)
		.values(req.body)
		.returning({ insertedId: description.uuid });

	try {
		const data = await descriptionPromise;
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

	const descriptionPromise = db
		.update(description)
		.set(req.body)
		.where(eq(description.uuid, req.params.uuid))
		.returning({ updatedId: description.uuid });

	try {
		const data = await descriptionPromise;
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

	const descriptionPromise = db
		.delete(description)
		.where(eq(description.uuid, req.params.uuid))
		.returning({ deletedId: description.uuid });

	try {
		const data = await descriptionPromise;
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
			uuid: description.uuid,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			created_by: description.created_by,
			created_by_name: hrSchema.users.name,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Description list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.select({
			uuid: description.uuid,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			created_by: description.created_by,
			created_by_name: hrSchema.users.name,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)

		.where(eq(description.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Description',
	};

	handleResponse({ promise: descriptionPromise, res, next, ...toast });
}

export async function selectDescriptionByPurchaseDescriptionUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.select({
			uuid: description.uuid,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			created_by: description.created_by,
			created_by_name: hrSchema.users.name,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)
		.where(eq(description.uuid, req.params.purchase_description_uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Description',
	};

	handleResponse({ promise: descriptionPromise, res, next, ...toast });
}

export async function selectPurchaseDetailsByPurchaseDescriptionUuid(
	req,
	res,
	next
) {
	if (!(await validateRequest(req, next))) return;

	const { purchase_description_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/by/${purchase_description_uuid}`)
				.then((response) => response);

		const [purchase_description, purchase] = await Promise.all([
			fetchData('/purchase/description'),
			fetchData('/purchase/entry'),
		]);

		const response = {
			...purchase_description?.data?.data[0],
			purchase: purchase?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select_all',
			msg: 'Purchase Details',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
