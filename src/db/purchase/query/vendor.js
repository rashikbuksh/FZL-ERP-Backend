import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { vendor } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db.insert(vendor).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: vendorPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.update(vendor)
		.set(req.body)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning({ updatedName: vendor.name });

	vendorPromise

		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: vendorPromise,
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
				msg: `Error updating vendor - ${error.message}`,
			};

			handleResponse({
				promise: vendorPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.delete(vendor)
		.where(eq(vendor.uuid, req.params.uuid))
		.returning({ deletedName: vendor.name });

	vendorPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: vendorPromise,
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
				msg: `Error deleting vendor - ${error.message}`,
			};

			handleResponse({
				promise: vendorPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(vendor);
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Vendor list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const vendorPromise = db
		.select()
		.from(vendor)
		.where(eq(vendor.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Vendor',
	};
	handleResponse({ promise: vendorPromise, res, next, ...toast });
}
