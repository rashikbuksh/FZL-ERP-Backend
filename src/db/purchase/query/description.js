import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { description, entry, vendor } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.insert(description)
		.values(req.body)
		.returning({
			insertedId: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
		});

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
		.returning({
			updatedId: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
		});

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
		.returning({
			deletedId: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
		});

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
			purchase_id: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			challan_number: description.challan_number,
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
		.orderBy(desc(description.created_at));

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
			purchase_id: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			challan_number: description.challan_number,
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

	try {
		const data = await descriptionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Description',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
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
				.get(`${endpoint}/${purchase_description_uuid}`)
				.then((response) => response);

		const [purchase_description, purchase] = await Promise.all([
			fetchData('/purchase/description'),
			fetchData('/purchase/entry/by'),
		]);

		const response = {
			...purchase_description?.data?.data,
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

export async function selectAllPurchaseDescriptionAndEntry(req, res, next) {
	const resultPromise = db
		.select({
			uuid: description.uuid,
			purchase_id: sql`CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))`,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			challan_number: description.challan_number,
			purchase_entry_uuid: entry.uuid,
			material_uuid: entry.material_uuid,
			material_name: materialSchema.info.name,
			quantity: entry.quantity,
			price: entry.price,
			unit: materialSchema.info.unit,
			created_by: description.created_by,
			created_by_name: hrSchema.users.name,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
			entry_remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			description,
			eq(description.uuid, entry.purchase_description_uuid)
		)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_uuid, materialSchema.info.uuid)
		);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Description list',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
