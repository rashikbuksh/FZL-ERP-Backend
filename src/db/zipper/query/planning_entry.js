import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { planning, planning_entry, sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const planningEntryPromise = db
		.insert(planning_entry)
		.values(req.body)
		.returning({ insertedUuid: planning_entry.uuid });

	try {
		const data = await planningEntryPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const planningEntryPromise = db
		.update(planning_entry)
		.set(req.body)
		.where(eq(planning_entry.uuid, req.params.uuid))
		.returning({ updatedUuid: planning_entry.uuid });

	try {
		const data = await planningEntryPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const planningEntryPromise = db
		.delete(planning_entry)
		.where(eq(planning_entry.uuid, req.params.uuid))
		.returning({ deletedUuid: planning_entry.uuid });

	try {
		const data = await planningEntryPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: planning_entry.uuid,
			planning_uuid: planning_entry.planning_uuid,
			sfg_uuid: planning_entry.sfg_uuid,
			sno_quantity: planning_entry.sno_quantity,
			factory_quantity: planning_entry.factory_quantity,
			production_quantity: planning_entry.production_quantity,
			batch_production_quantity: planning_entry.batch_production_quantity,
			created_at: planning_entry.created_at,
			updated_at: planning_entry.updated_at,
			remarks: planning_entry.remarks,
		})
		.from(planning_entry)
		.leftJoin(sfg, eq(sfg.uuid, planning_entry.sfg_uuid))
		.leftJoin(planning, eq(planning.uuid, planning_entry.planning_uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'batch entry list',
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

	const planningEntryPromise = db
		.select({
			uuid: planning_entry.uuid,
			planning_uuid: planning_entry.planning_uuid,
			sfg_uuid: planning_entry.sfg_uuid,
			sno_quantity: planning_entry.sno_quantity,
			factory_quantity: planning_entry.factory_quantity,
			production_quantity: planning_entry.production_quantity,
			batch_production_quantity: planning_entry.batch_production_quantity,
			created_at: planning_entry.created_at,
			updated_at: planning_entry.updated_at,
			remarks: planning_entry.remarks,
		})
		.from(planning_entry)
		.leftJoin(sfg, eq(sfg.uuid, planning_entry.sfg_uuid))
		.leftJoin(planning, eq(planning.uuid, planning_entry.planning_uuid))
		.where(eq(planning_entry.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'batch entry',
	};
	handleResponse({
		promise: planningEntryPromise,
		res,
		next,
		...toast,
	});
}

export async function selectPlanningEntryByPlanningUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			pe.uuid as planning_entry_uuid,
			pe.planning_uuid,
			pe.sfg_uuid,
			pe.sno_quantity,
			pe.factory_quantity,
			pe.production_quantity,
			pe.batch_production_quantity,
			pe.created_at,
			pe.updated_at,
			pe.remarks as plan_entry_remarks,
			oe.style,
			oe.color,
			oe.size,
			oe.quantity as order_quantity,
			vod.order_number,
			vod.item_description
		FROM
			zipper.planning_entry pe
		LEFT JOIN
			zipper.planning p
		ON
			pe.planning_uuid = p.uuid
		LEFT JOIN 
			zipper.sfg sfg
		ON
			pe.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe
		ON
			sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details vod
		ON
			oe.order_description_uuid = vod.order_description_uuid
		WHERE
			pe.planning_uuid = ${req.params.planning_uuid}
	`;

	//  AND oe.swatch_status_enum = 'approved' removed because of development purpose

	const planningEntryPromise = db.execute(query);

	try {
		const data = await planningEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'planning_entry By Planning Uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsForPlanningEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			pe.uuid as planning_entry_uuid,
			pe.planning_uuid,
			sfg.uuid as sfg_uuid,
			0 as pe.sno_quantity,
			pe.factory_quantity,
			pe.production_quantity,
			pe.batch_production_quantity,
			pe.created_at,
			pe.updated_at,
			null as pe.remarks,
			oe.style,
			oe.color,
			oe.size,
			oe.quantity as order_quantity,
			vod.order_number,
			vod.item_description,
			pe.sno_quantity as given_sno_quantity,
			pe.factory_quantity as given_factory_quantity,
			pe.production_quantity as given_production_quantity,
			pe.batch_production_quantity as given_batch_production_quantity
		FROM
			zipper.order_entry oe
		LEFT JOIN
			zipper.v_order_details vod
			ON oe.order_description_uuid = vod.order_description_uuid
		LEFT JOIN 
			zipper.sfg sfg
			ON oe.uuid = sfg.order_entry_uuid
		LEFT JOIN
			zipper.planning_entry pe
			ON sfg.uuid = pe.sfg_uuid
		WHERE 
			sfg.recipe_uuid IS NOT NULL
	`;

	const orderDetailsPromise = db.execute(query);

	try {
		const data = await orderDetailsPromise;

		const ggdata = { planning_entry: data?.rows };

		const toast = {
			status: 200,
			type: 'select',
			message: 'order details',
		};

		return res.status(200).json({ toast, data: ggdata });
	} catch (error) {
		await handleError({ error, res });
	}
}
