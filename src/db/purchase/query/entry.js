import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db.insert(entry).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.material_name} created`,
	};

	handleResponse({ promise: entryPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.update(entry)
		.set(req.body)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ updatedName: entry.material_name });

	entryPromise

		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: entryPromise,
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
				msg: `Error updating entry - ${error.message}`,
			};

			handleResponse({
				promise: entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.delete(entry)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ deletedName: entry.material_name });

	entryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: entryPromise,
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
				msg: `Error deleting entry - ${error.message}`,
			};

			handleResponse({
				promise: entryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_info_uuid: entry.material_info_uuid,
			material_name: materialSchema.info.name,
			quantity: entry.quantity,
			price: entry.price,
			created_by: entry.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(materialSchema.info)
		.on(entry.material_info_uuid.equals(materialSchema.info.uuid))
		.leftJoin(hrSchema.users)
		.on(entry.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid));
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Entry list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_info_uuid: entry.material_info_uuid,
			quantity: entry.quantity,
			price: entry.price,
			created_by: entry.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(hrSchema.users)
		.on(entry.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(hrSchema.users.department_uuid.equals(hrSchema.department.uuid))
		.where(eq(entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Entry',
	};

	handleResponse({ promise: entryPromise, res, next, ...toast });
}
