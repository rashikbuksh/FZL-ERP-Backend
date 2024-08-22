import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { die_casting, die_casting_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.insert(die_casting_production)
		.values(req.body)
		.returning({ insertedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.update(die_casting_production)
		.set(req.body)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning({ updatedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
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

	const dieCastingProductionPromise = db
		.delete(die_casting_production)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning({ deletedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: die_casting_production.uuid,
			die_casting_uuid: die_casting_production.die_casting_uuid,
			die_casting_name: die_casting.name,
			mc_no: die_casting_production.mc_no,
			cavity_goods: die_casting_production.cavity_goods,
			cavity_defect: die_casting_production.cavity_defect,
			push: die_casting_production.push,
			production_quantity:
				die_casting_production.cavity_goods *
				die_casting_production.push,
			weight: die_casting_production.weight,
			pcs_per_kg:
				(die_casting_production.cavity_goods *
					die_casting_production.push) /
				die_casting_production.weight,
			order_info_uuid: die_casting_production.order_info_uuid,
			created_by: die_casting_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_production.created_at,
			updated_at: die_casting_production.updated_at,
			remarks: die_casting_production.remarks,
		})
		.from(die_casting_production)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_production.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_production.created_by)
		);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'die_casting_production list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.select({
			uuid: die_casting_production.uuid,
			die_casting_uuid: die_casting_production.die_casting_uuid,
			die_casting_name: die_casting.name,
			mc_no: die_casting_production.mc_no,
			cavity_goods: die_casting_production.cavity_goods,
			cavity_defect: die_casting_production.cavity_defect,
			push: die_casting_production.push,
			production_quantity:
				die_casting_production.cavity_goods *
				die_casting_production.push,
			weight: die_casting_production.weight,
			pcs_per_kg:
				(die_casting_production.cavity_goods *
					die_casting_production.push) /
				die_casting_production.weight,
			order_info_uuid: die_casting_production.order_info_uuid,
			created_by: die_casting_production.created_by,
			created_by_name: hrSchema.users.name,

			created_at: die_casting_production.created_at,
			updated_at: die_casting_production.updated_at,
			remarks: die_casting_production.remarks,
		})
		.from(die_casting_production)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_production.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_production.created_by)
		)

		.where(eq(die_casting_production.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'die_casting_production ',
	};

	handleResponse({
		promise: dieCastingProductionPromise,
		res,
		next,
		...toast,
	});
}
