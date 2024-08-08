import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { bank } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db.insert(bank).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: bankPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db
		.update(bank)
		.set(req.body)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ updateName: bank.name });
	bankPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updateName} updated`,
			};

			handleResponse({
				promise: bankPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating bank - ${error.message}`,
			};

			handleResponse({
				promise: bankPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db
		.delete(bank)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ deletedName: bank.name });

	bankPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: bankPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting bank - ${error.message}`,
			};

			handleResponse({
				promise: bankPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(bank);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Bank list',
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

	const bankPromise = db
		.select()
		.from(bank)
		.where(eq(bank.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Bank',
	};

	handleResponse({
		promise: bankPromise,
		res,
		next,
		...toast,
	});
}
