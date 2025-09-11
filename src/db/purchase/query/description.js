import { and, desc, eq, sql, asc } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { decimalToNumber } from '../../variables.js';
import { description, entry, vendor } from '../schema.js';
import { nanoid } from '../../../lib/nanoid.js';
import { cost_center, currency } from '../../acc/schema.js';
import {
	insertFile,
	updateFile,
	deleteFile,
} from '../../../util/upload_files.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const formData = req.body;
	const file = req.file;

	const filePath = file
		? await insertFile(file, 'purchase/description')
		: null;

	// check if formdata has 'null' then make it actual null
	Object.keys(formData).forEach((key) => {
		if (formData[key] === 'null') {
			formData[key] = null;
		}
	});

	const descriptionPromise = db
		.insert(description)
		.values({
			...formData,
			file: filePath,
		})
		.returning({
			insertedId: sql`
            CASE WHEN description.store_type = 'rm' 
                THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
                ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
            END`,
		});

	try {
		// Insert description first to get the generated ID
		const descriptionData = await descriptionPromise;
		const generatedPurchaseId = descriptionData[0].insertedId;

		// Now insert cost_center using the generated purchase ID as the name
		const costCenterPromise = db
			.insert(cost_center)
			.values({
				uuid: nanoid(),
				name: generatedPurchaseId, // Use the exact generated ID from description
				ledger_uuid: null,
				table_name: 'purchase.description',
				table_uuid: formData.uuid,
				invoice_no: null,
				created_at: formData.created_at,
				created_by: formData.created_by,
				updated_by: formData.updated_by || null,
				updated_at: formData.updated_at || null,
				remarks: formData.remarks || null,
			})
			.returning({ insertedName: cost_center.name });

		const costCenterData = await costCenterPromise;

		const toast = {
			status: 201,
			type: 'create',
			message: `${generatedPurchaseId} AND Cost Center ${costCenterData[0].insertedName} created`,
		};
		return await res.status(201).json({ toast, data: descriptionData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const formData = req.body;
	const file = req.file;

	// check if formdata has 'null' then make it actual null
	Object.keys(formData).forEach((key) => {
		if (formData[key] === 'null') {
			formData[key] = null;
		}
	});

	if (file) {
		// If a new file is uploaded, we need to handle the file update
		const oldFilePath = db
			.select()
			.from(description)
			.where(eq(description.uuid, req.params.uuid))
			.returning(description.file);
		const oldFile = await oldFilePath;

		if (oldFile && oldFile[0].file) {
			// If there is an old file, delete it
			const filePath = updateFile(
				file,
				oldFile[0].file,
				'purchase/description'
			);
			formData.file = filePath;
		} else {
			// If no new file is uploaded, keep the old file path
			const filePath = insertFile(file, 'purchase/description');
			formData.file = filePath;
		}
	}

	const descriptionPromise = db
		.update(description)
		.set(req.body)
		.where(eq(description.uuid, req.params.uuid))
		.returning({
			updatedId: sql`
			CASE WHEN description.store_type = 'rm' 
				THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
				ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
			END`,
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

	// First, we need to check if the document exists and get its file path
	const oldFilePath = db
		.select()
		.from(description)
		.where(eq(description.uuid, req.params.uuid));

	const oldFile = await oldFilePath;

	if (oldFile && oldFile[0].file) {
		// If there is an old file, delete it
		try {
			await deleteFile(oldFile[0].file);
		} catch (error) {
			console.error('Error deleting file:', error);
		}
	}

	const descriptionPromise = db
		.delete(description)
		.where(eq(description.uuid, req.params.uuid))
		.returning({
			deletedId: sql`CASE WHEN description.store_type = 'rm' 
								THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
								ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
							END`,
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
	const { s_type } = req.query;

	const resultPromise = db
		.select({
			uuid: description.uuid,
			purchase_id: sql`CASE WHEN description.store_type = 'rm' 
								THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
								ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
							END`,
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
			store_type: description.store_type,
			transport_cost: decimalToNumber(description.transport_cost),
			misc_cost: decimalToNumber(description.misc_cost),
			file: description.file,
			currency_uuid: description.currency_uuid,
			conversion_rate: decimalToNumber(description.conversion_rate),
			currency_name: currency.name,
			currency_symbol: currency.symbol,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(currency, eq(description.currency_uuid, currency.uuid));

	if (s_type) {
		resultPromise.where(eq(description.store_type, s_type));
	}

	resultPromise.orderBy(desc(description.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Description list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.select({
			uuid: description.uuid,
			purchase_id: sql`CASE WHEN description.store_type = 'rm' 
								THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
								ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
							END`,
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
			store_type: description.store_type,
			transport_cost: description.transport_cost,
			misc_cost: description.misc_cost,
			file: description.file,
			currency_uuid: description.currency_uuid,
			conversion_rate: decimalToNumber(description.conversion_rate),
			currency_name: currency.name,
			currency_symbol: currency.symbol,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(
			hrSchema.users,
			eq(description.created_by, hrSchema.users.uuid)
		)
		.leftJoin(currency, eq(description.currency_uuid, currency.uuid))
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
	const { s_type, from_date, to_date } = req.query;

	const resultPromise = db
		.select({
			uuid: description.uuid,
			purchase_id: sql`CASE WHEN description.store_type = 'rm' 
								THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
								ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0')) 
							END`,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			is_local: description.is_local,
			lc_number: description.lc_number,
			challan_number: description.challan_number,
			purchase_entry_uuid: entry.uuid,
			material_uuid: entry.material_uuid,
			material_name: materialSchema.info.name,
			quantity: decimalToNumber(entry.quantity),
			price: decimalToNumber(entry.price),
			unit: materialSchema.info.unit,
			created_by: description.created_by,
			created_by_name: hrSchema.users.name,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
			entry_remarks: entry.remarks,
			store_type: description.store_type,
			transport_cost: description.transport_cost,
			misc_cost: description.misc_cost,
			file: description.file,
			currency_uuid: description.currency_uuid,
			conversion_rate: decimalToNumber(description.conversion_rate),
			currency_name: currency.name,
			currency_symbol: currency.symbol,
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
		)
		.leftJoin(currency, eq(description.currency_uuid, currency.uuid));

	if (s_type != undefined && from_date != undefined && to_date != undefined) {
		resultPromise.where(
			and(
				sql`description.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`,
				eq(materialSchema.info.store_type, s_type)
			)
		);
	} else if (s_type != undefined) {
		resultPromise.where(eq(materialSchema.info.store_type, s_type));
	} else if (from_date != undefined && to_date != undefined) {
		resultPromise.where(
			sql`description.created_at BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
		);
	}

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

export async function selectAllPurchaseDescriptionWithEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// const { s_type } = req.query;

	const resultPromise = db
		.select({
			uuid: description.uuid,
			purchase_id: sql`CASE WHEN description.store_type = 'rm'
								THEN CONCAT('SR', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))
								ELSE CONCAT('SRA', to_char(description.created_at, 'YY'), '-', LPAD(description.id::text, 4, '0'))
							END`,
			vendor_uuid: description.vendor_uuid,
			vendor_name: vendor.name,
			total_price: sql`SUM(entry.price::float8)`,
			store_type: description.store_type,
			created_at: description.created_at,
		})
		.from(description)
		.leftJoin(vendor, eq(description.vendor_uuid, vendor.uuid))
		.leftJoin(entry, eq(description.uuid, entry.purchase_description_uuid))
		.groupBy(
			description.uuid,
			description.id,
			description.store_type,
			description.created_at,
			vendor.uuid,
			vendor.name
		)
		.orderBy(asc(description.id));

	// if (s_type) {
	// 	resultPromise.where(eq(description.store_type, s_type));
	// }
	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Description list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
