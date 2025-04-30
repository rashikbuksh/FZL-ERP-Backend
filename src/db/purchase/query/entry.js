import { desc, eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import { decimalToNumber } from '../../variables.js';
import { entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.insert(entry)
		.values(req.body)
		.returning({ insertedId: entry.uuid });

	try {
		const data = await entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.update(entry)
		.set(req.body)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ updatedId: entry.uuid });

	try {
		const data = await entryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.delete(entry)
		.where(eq(entry.uuid, req.params.uuid))
		.returning({ deletedId: entry.uuid });

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_uuid: entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			quantity: decimalToNumber(entry.quantity),
			price: decimalToNumber(entry.price),
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_uuid, materialSchema.info.uuid)
		)
		.orderBy(desc(entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Entry list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_uuid: entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			quantity: decimalToNumber(entry.quantity),
			price: decimalToNumber(entry.price),
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_uuid, materialSchema.info.uuid)
		)
		.where(eq(entry.uuid, req.params.uuid));

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Entry',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectEntryByPurchaseDescriptionUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const entryPromise = db
		.select({
			uuid: entry.uuid,
			purchase_description_uuid: entry.purchase_description_uuid,
			material_uuid: entry.material_uuid,
			material_name: materialSchema.info.name,
			unit: materialSchema.info.unit,
			quantity: decimalToNumber(entry.quantity),
			price: decimalToNumber(entry.price),
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			remarks: entry.remarks,
		})
		.from(entry)
		.leftJoin(
			materialSchema.info,
			eq(entry.material_uuid, materialSchema.info.uuid)
		)
		.where(
			eq(
				entry.purchase_description_uuid,
				req.params.purchase_description_uuid
			)
		)
		.orderBy(desc(entry.created_at));

	try {
		const data = await entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Entry by purchase description uuid',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
