import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { factory, party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db.insert(factory).values(req.body).returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.update(factory)
		.set(req.body)
		.where(eq(factory.uuid, req.params.uuid))
		.returning({ updatedName: factory.name });

	factoryPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: factoryPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.log(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating factory - ${error.message}`,
			};

			handleResponse({
				promise: factoryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.delete(factory)
		.where(eq(factory.uuid, req.params.uuid))
		.returning({ deletedName: factory.name });

	factoryPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: factoryPromise,
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
				msg: `Error deleting factory - ${error.message}`,
			};

			handleResponse({
				promise: factoryPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: factory.uuid,
			party_uuid: factory.party_uuid,
			party_name: party.name,
			name: factory.name,
			phone: factory.phone,
			address: factory.address,
			created_at: factory.created_at,
			updated_at: factory.updated_at,
		})
		.from(factory)
		.leftJoin(party, eq(factory.party_uuid, party.uuid));
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Factory list',
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

	const factoryPromise = db
		.select({
			uuid: factory.uuid,
			party_uuid: factory.party_uuid,
			party_name: party.name,
			name: factory.name,
			phone: factory.phone,
			address: factory.address,
			created_at: factory.created_at,
			updated_at: factory.updated_at,
		})
		.from(factory)
		.leftJoin(party, eq(factory.party_uuid, party.uuid))
		.where(eq(factory.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		msg: 'Factory',
	};
	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}
