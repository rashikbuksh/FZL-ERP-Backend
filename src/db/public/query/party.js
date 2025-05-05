import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { party } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.insert(party)
		.values(req.body)
		.returning({ insertedName: party.name });

	try {
		const data = await partyPromise;
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

	const partyPromise = db
		.update(party)
		.set(req.body)
		.where(eq(party.uuid, req.params.uuid))
		.returning({ updatedName: party.name });

	try {
		const data = await partyPromise;
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

	const partyPromise = db
		.delete(party)
		.where(eq(party.uuid, req.params.uuid))
		.returning({ deletedName: party.name });

	try {
		const data = await partyPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({
			error,
			res,
		});
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: party.uuid,
			name: party.name,
			short_name: party.short_name,
			address: party.address,
			remarks: party.remarks,
			created_at: party.created_at,
			updated_at: party.updated_at,
			created_by: party.created_by,
			created_by_name: hrSchema.users.name,
		})
		.from(party)
		.leftJoin(hrSchema.users, eq(party.created_by, hrSchema.users.uuid))
		.orderBy(desc(party.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Party list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const partyPromise = db
		.select({
			uuid: party.uuid,
			name: party.name,
			short_name: party.short_name,
			address: party.address,
			remarks: party.remarks,
			created_at: party.created_at,
			updated_at: party.updated_at,
			created_by: party.created_by,
			created_by_name: hrSchema.users.name,
		})
		.from(party)
		.leftJoin(hrSchema.users, eq(party.created_by, hrSchema.users.uuid))
		.where(eq(party.uuid, req.params.uuid));

	try {
		const data = await partyPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: `${data[0].name} selected`,
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
