import { eq } from 'drizzle-orm';
import { description } from '../../../db/purchase/schema.js';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { info, section, type } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db.insert(info).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: infoPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.update(info)
		.set(req.body)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ updatedName: info.name });

	infoPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: infoPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating info - ${error.message}`,
			};

			handleResponse({
				promise: infoPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.delete(info)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ deletedName: info.name });

	infoPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: infoPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting info - ${error.message}`,
			};

			handleResponse({
				promise: infoPromise,
				res,
				next,
				...toast,
			});
		});
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
			unit: info.unit,
			threshold: info.threshold,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			remarks: info.remarks,
		})
		.from(info)
		.join(section)
		.on(eq(info.section_uuid, section.uuid))
		.join(type)
		.on(eq(info.type_uuid, type.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Info list',
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
			unit: info.unit,
			threshold: info.threshold,
			description: info.description,
			created_at: info.created_at,
			updated_at: info.updated_at,
			remarks: info.remarks,
		})
		.from(info)
		.join(section)
		.on(eq(info.section_uuid, section.uuid))
		.join(type)
		.on(eq(info.type_uuid, type.uuid))
		.where(eq(info.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Info',
	};
	handleResponse({ promise: infoPromise, res, next, ...toast });
}
