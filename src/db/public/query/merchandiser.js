import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { merchandiser, party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.insert(merchandiser)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.update(merchandiser)
		.set(req.body)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning({ updatedName: merchandiser.name });

	merchandiserPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: merchandiserPromise,
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
				msg: `Error updating merchandiser - ${error.message}`,
			};

			handleResponse({
				promise: merchandiserPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const merchandiserPromise = db
		.delete(merchandiser)
		.where(eq(merchandiser.uuid, req.params.uuid))
		.returning({ deletedName: merchandiser.name });

	merchandiserPromise
		.then((result) => {
			const toast = {
				status: 200,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: merchandiserPromise,
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
				msg: `Error deleting merchandiser - ${error.message}`,
			};

			handleResponse({
				promise: merchandiserPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: merchandiser.uuid,
			party_uuid: merchandiser.party_uuid,
			party_name: party.name,
			name: merchandiser.name,
			email: merchandiser.email,
			phone: merchandiser.phone,
			address: merchandiser.address,
			created_at: merchandiser.created_at,
			updated_at: merchandiser.updated_at,
		})
		.from(merchandiser)
		.leftJoin(party, eq(merchandiser.party_uuid, party.uuid));
	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Merchandiser list',
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

	const merchandiserPromise = db
		.select({
			uuid: merchandiser.uuid,
			party_uuid: merchandiser.party_uuid,
			party_name: party.name,
			name: merchandiser.name,
			email: merchandiser.email,
			phone: merchandiser.phone,
			address: merchandiser.address,
			created_at: merchandiser.created_at,
			updated_at: merchandiser.updated_at,
		})
		.from(merchandiser)
		.leftJoin(party, eq(merchandiser.party_uuid, party.uuid))
		.where(eq(merchandiser.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Merchandiser',
	};
	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}
