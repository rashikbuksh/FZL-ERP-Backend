import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { factory, party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.insert(factory)
		.values(req.body)
		.returning({ insertedName: factory.name });

	try {
		const data = await factoryPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.update(factory)
		.set(req.body)
		.where(eq(factory.uuid, req.params.uuid))
		.returning({ updatedName: factory.name });

	try {
		const data = await factoryPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const factoryPromise = db
		.delete(factory)
		.where(eq(factory.uuid, req.params.uuid))
		.returning({ deletedName: factory.name });

	try {
		const data = await factoryPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
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
			created_by: factory.created_by,
			created_by_name: hrSchema.users.name,
			remarks: factory.remarks,
		})
		.from(factory)
		.leftJoin(party, eq(factory.party_uuid, party.uuid))
		.leftJoin(hrSchema.users, eq(factory.created_by, hrSchema.users.uuid))
		.orderBy(desc(factory.created_at));
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Factory list',
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
			created_by: factory.created_by,
			created_by_name: hrSchema.users.name,
			remarks: factory.remarks,
		})
		.from(factory)
		.leftJoin(party, eq(factory.party_uuid, party.uuid))
		.leftJoin(hrSchema.users, eq(factory.created_by, hrSchema.users.uuid))
		.where(eq(factory.uuid, req.params.uuid));

	try {
		const data = await factoryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Factory by uuid',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
