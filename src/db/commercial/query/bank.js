import { asc, desc, eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { bank } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db.insert(bank).values(req.body).returning({
		insertedName: bank.name,
	});
	try {
		const data = await bankPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedName} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db
		.update(bank)
		.set(req.body)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ updatedName: bank.name });

	try {
		const data = await bankPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db
		.delete(bank)
		.where(eq(bank.uuid, req.params.uuid))
		.returning({ deletedName: bank.name });

	try {
		const data = await bankPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: bank.uuid,
			name: bank.name,
			swift_code: bank.swift_code,
			address: bank.address,
			policy: bank.policy,
			routing_no: bank.routing_no,
			created_at: bank.created_at,
			updated_at: bank.updated_at,
			created_by: bank.created_by,
			created_by_name: hrSchema.users.name,
			remarks: bank.remarks,
		})
		.from(bank)
		.leftJoin(hrSchema.users, eq(bank.created_by, hrSchema.users.uuid))
		.orderBy(asc(bank.name));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Bank',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const bankPromise = db
		.select({
			uuid: bank.uuid,
			name: bank.name,
			swift_code: bank.swift_code,
			address: bank.address,
			policy: bank.policy,
			routing_no: bank.routing_no,
			created_at: bank.created_at,
			updated_at: bank.updated_at,
			created_by: bank.created_by,
			created_by_name: hrSchema.users.name,
			remarks: bank.remarks,
		})
		.from(bank)
		.leftJoin(hrSchema.users, eq(bank.created_by, hrSchema.users.uuid))
		.where(eq(bank.uuid, req.params.uuid));

	try {
		const data = await bankPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Bank',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
