import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { description } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.insert(description)
		.values(req.body)
		.returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: descriptionPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.update(description)
		.set(req.body)
		.where(eq(description.uuid, req.params.uuid))
		.returning({ updatedName: description.name });

	descriptionPromise

		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: descriptionPromise,
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
				msg: `Error updating description - ${error.message}`,
			};

			handleResponse({
				promise: descriptionPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.delete(description)
		.where(eq(description.uuid, req.params.uuid))
		.returning({ deletedName: description.name });

	descriptionPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: descriptionPromise,
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
				msg: `Error deleting description - ${error.message}`,
			};

			handleResponse({
				promise: descriptionPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: description.uuid,
			vendor_uuid: description.vendor_uuid,
			is_local: description.is_local,
			lc_number: description.lc_number,
			created_by: description.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
		})
		.from(description)
		.leftJoin(hrSchema.users)
		.on(description.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Description list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const descriptionPromise = db
		.select({
			uuid: description.uuid,
			vendor_uuid: description.vendor_uuid,
			is_local: description.is_local,
			lc_number: description.lc_number,
			created_by: description.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: description.created_at,
			updated_at: description.updated_at,
			remarks: description.remarks,
		})
		.from(description)
		.leftJoin(hrSchema.users)
		.on(description.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		)
		.where(eq(description.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Description',
	};

	handleResponse({ promise: descriptionPromise, res, next, ...toast });
}
