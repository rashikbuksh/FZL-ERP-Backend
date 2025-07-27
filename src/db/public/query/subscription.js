import { eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { subscription } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const subscriptionPromise = db
		.insert(subscription)
		.values(req.body)
		.returning({ insertedName: subscription.id });

	try {
		const data = await subscriptionPromise;
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

	const subscriptionPromise = db
		.update(subscription)
		.set(req.body)
		.where(eq(subscription.uuid, req.params.uuid))
		.returning({ updatedName: subscription.id });

	try {
		const data = await subscriptionPromise;
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

	const subscriptionPromise = db
		.delete(subscription)
		.where(eq(subscription.uuid, req.params.uuid))
		.returning({ deletedName: subscription.name });

	try {
		const data = await subscriptionPromise;
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
	const subscriptionPromise = db
		.select({
			uuid: subscription.uuid,
			id: subscription.id,
			endpoint: subscription.endpoint,
		})
		.from(subscription);

	try {
		const data = await subscriptionPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'subscription',
		};

		const combinedData = {
			toast,
			data,
		};

		return combinedData;
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const subscriptionPromise = db
		.select({
			uuid: subscription.uuid,
			id: subscription.id,
			endpoint: subscription.endpoint,
		})
		.from(subscription)
		.leftJoin(
			hrSchema.users,
			eq(subscription.created_by, hrSchema.users.uuid)
		)
		.where(eq(subscription.uuid, req.params.uuid));

	try {
		const data = await subscriptionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'subscription by uuid',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
