import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { marketing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db.insert(marketing).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.update(marketing)
		.set(req.body)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ updatedName: marketing.name });

	marketingPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: marketingPromise,
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
				msg: `Error updating marketing - ${error.message}`,
			};

			handleResponse({
				promise: marketingPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.delete(marketing)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ deletedName: marketing.name });

	marketingPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: marketingPromise,
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
				msg: `Error deleting marketing - ${error.message}`,
			};

			handleResponse({
				promise: marketingPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: marketing.uuid,
			name: marketing.name,
			user_uuid: marketing.user_uuid,
			user_designation: hrSchema.designation.designation,
			remarks: marketing.remarks,
		})
		.from(marketing)
		.leftJoin(hrSchema.users, eq(marketing.user_uuid, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Marketing list',
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

	const marketingPromise = db
		.select({
			uuid: marketing.uuid,
			name: marketing.name,
			user_uuid: marketing.user_uuid,
			user_designation: hrSchema.designation.designation,
			remarks: marketing.remarks,
		})
		.from(marketing)
		.leftJoin(hrSchema.users, eq(marketing.user_uuid, hrSchema.users.uuid))
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.where(eq(marketing.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Marketing',
	};

	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}
