import { desc, eq } from 'drizzle-orm';
import { description } from '../../../db/purchase/schema.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { info, section, stock, type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db.insert(info).values(req.body).returning({
		createdName: info.name,
	});

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].createdName} created`,
		};

		res.status(201).json({ data, toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.update(info)
		.set(req.body)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ updatedName: info.name });

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.delete(info)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ deletedName: info.name });

	try {
		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: info.uuid,
			section_uuid: info.section_uuid,
			section_name: section.name,
			type_uuid: info.type_uuid,
			type_name: type.name,
			name: info.name,
			short_name: info.short_name,
			stock: stock.stock,
			unit: info.unit,
			threshold: info.threshold,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			created_by: info.created_by,
			created_by_name: hrSchema.users.name,
			remarks: info.remarks,
		})
		.from(info)
		.leftJoin(section, eq(info.section_uuid, section.uuid))
		.leftJoin(type, eq(info.type_uuid, type.uuid))
		.leftJoin(stock, eq(info.uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
		.orderBy(desc(info.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Info list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.select({
			uuid: info.uuid,
			section_uuid: info.section_uuid,
			section_name: section.name,
			type_uuid: info.type_uuid,
			type_name: type.name,
			name: info.name,
			short_name: info.short_name,
			stock: stock.stock,
			unit: info.unit,
			threshold: info.threshold,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			created_by: info.created_by,
			created_by_name: hrSchema.users.name,
			remarks: info.remarks,
		})
		.from(info)
		.leftJoin(section, eq(info.section_uuid, section.uuid))
		.leftJoin(type, eq(info.type_uuid, type.uuid))
		.leftJoin(stock, eq(info.uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
		.where(eq(info.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'Info',
	};
	handleResponse({ promise: infoPromise, res, next, ...toast });
}
