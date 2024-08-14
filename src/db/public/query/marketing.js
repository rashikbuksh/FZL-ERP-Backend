import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { marketing } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.insert(marketing)
		.values(req.body)
		.returning({ insertedName: marketing.name });

	try {
		const data = await marketingPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.update(marketing)
		.set(req.body)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ updatedName: marketing.name });

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const marketingPromise = db
		.delete(marketing)
		.where(eq(marketing.uuid, req.params.uuid))
		.returning({ deletedName: marketing.name });

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'remove',
			message: `${data[0].deletedName} removed`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: marketing.uuid,
			name: marketing.name,
			short_name: marketing.short_name,
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
		message: 'Marketing list',
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
			short_name: marketing.short_name,
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
		message: 'Marketing',
	};

	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}
