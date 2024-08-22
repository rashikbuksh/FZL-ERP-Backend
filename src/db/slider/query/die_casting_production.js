import { eq, sql } from 'drizzle-orm';
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
	const query = sql`
		SELECT
			dcp.uuid,
			dcp.die_casting_uuid,
			die_casting.name AS die_casting_name,
			dcp.order_info_uuid,
			v_order_details.order_number,
			dcp.mc_no,
			dcp.cavity_goods,
			dcp.cavity_defect,
			dcp.push,
			dcp.cavity_goods * dcp.push AS production_quantity,
			dcp.weight,
			(dcp.cavity_goods * dcp.push) / dcp.weight AS pcs_per_kg,
			dcp.order_info_uuid,
			dcp.created_by,
			users.name AS created_by_name,
			dcp.created_at,
			dcp.updated_at,
			dcp.remarks
		FROM
			slider.die_casting_production dcp
		LEFT JOIN
			slider.die_casting ON die_casting.uuid = dcp.die_casting_uuid
		LEFT JOIN
			hr.users ON users.uuid = dcp.created_by
		LEFT JOIN
			zipper.v_order_details ON v_order_details.order_info_uuid = dcp.order_info_uuid
		`;

	const dcpPromise = db.execute(query);

	try {
		const data = await dcpPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'die_casting_production list',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			dcp.uuid,
			dcp.die_casting_uuid,
			die_casting.name AS die_casting_name,
			dcp.order_info_uuid,
			v_order_details.order_number,
			dcp.mc_no,
			dcp.cavity_goods,
			dcp.cavity_defect,
			dcp.push,
			dcp.cavity_goods * dcp.push AS production_quantity,
			dcp.weight,
			(dcp.cavity_goods * dcp.push) / dcp.weight AS pcs_per_kg,
			dcp.order_info_uuid,
			dcp.created_by,
			users.name AS created_by_name,
			dcp.created_at,
			dcp.updated_at,
			dcp.remarks
		FROM
			slider.die_casting_production dcp
		LEFT JOIN
			slider.die_casting ON die_casting.uuid = dcp.die_casting_uuid
		LEFT JOIN
			hr.users ON users.uuid = dcp.created_by
		LEFT JOIN
			zipper.v_order_details ON v_order_details.order_info_uuid = dcp.order_info_uuid
		WHERE dcp.uuid = ${req.params.uuid}
		`;

	const dcpPromise = db.execute(query);

	try {
		const data = await dcpPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'die_casting_production',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
