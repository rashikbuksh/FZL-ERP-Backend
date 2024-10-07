import { and, desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { planning, planning_entry, sfg } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		planning_week,
		sfg_uuid,
		sno_quantity,
		sno_remarks,
		factory_remarks,
		created_at,
		uuid,
		updated_at,
	} = req.body;

	const query = sql`SELECT planning_entry.uuid
						FROM zipper.planning_entry
						WHERE planning_week = ${planning_week} AND sfg_uuid = ${sfg_uuid};`;

	const sfgExistsPromise = db.execute(query);

	const sfgExists = await sfgExistsPromise;

	// if planning entry and sfg already exists, then update the existing entry
	if (sfgExists.rowCount > 0) {
		try {
			const planningEntryPromise = await db
				.update(planning_entry)
				.set({
					sno_quantity: sno_quantity,
					updatedAt: updated_at,
					sno_remarks: sno_remarks,
					factory_remarks: factory_remarks,
				})
				.where(
					and(
						eq(planning_entry.planning_week, planning_week),
						eq(planning_entry.sfg_uuid, sfg_uuid)
					)
				)
				.returning({ updatedUuid: planning_entry.uuid });

			const data = planningEntryPromise;
			const toast = {
				status: 201,
				type: 'update',
				message: `${data[0].updatedUuid} updated`,
			};

			res.status(201).json({ toast, data });
		} catch (error) {
			await handleError({ error, res });
		}
		return;
	}
	// if planning entry already exists, but sfg_uuid does not exist, then insert a new entry
	else {
		const planningEntryPromise = db
			.insert(planning_entry)
			.values({
				planning_week,
				sfg_uuid,
				sno_quantity,
				sno_remarks: sno_remarks,
				factory_remarks: factory_remarks,
				created_at,
				uuid,
				updated_at,
			})
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
			planning_week: planning_entry.planning_week,
			sfg_uuid: planning_entry.sfg_uuid,
			sno_quantity: decimalToNumber(planning_entry.sno_quantity),
			factory_quantity: decimalToNumber(planning_entry.factory_quantity),
			production_quantity: decimalToNumber(
				planning_entry.production_quantity
			),
			batch_production_quantity: decimalToNumber(
				planning_entry.batch_production_quantity
			),
			created_at: planning_entry.created_at,
			updated_at: planning_entry.updated_at,
			sno_remarks: planning_entry.sno_remarks,
			factory_remarks: planning_entry.factory_remarks,
		})
		.from(planning_entry)
		.leftJoin(sfg, eq(sfg.uuid, planning_entry.sfg_uuid))
		.leftJoin(planning, eq(planning.uuid, planning_entry.planning_week))
		.orderBy(desc(planning_entry.created_at));

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
			planning_week: planning_entry.planning_week,
			sfg_uuid: planning_entry.sfg_uuid,
			sno_quantity: decimalToNumber(planning_entry.sno_quantity),
			factory_quantity: decimalToNumber(planning_entry.factory_quantity),
			production_quantity: decimalToNumber(
				planning_entry.production_quantity
			),
			batch_production_quantity: decimalToNumber(
				planning_entry.batch_production_quantity
			),
			created_at: planning_entry.created_at,
			updated_at: planning_entry.updated_at,
			sno_remarks: planning_entry.sno_remarks,
			factory_remarks: planning_entry.factory_remarks,
		})
		.from(planning_entry)
		.leftJoin(sfg, eq(sfg.uuid, planning_entry.sfg_uuid))
		.leftJoin(planning, eq(planning.uuid, planning_entry.planning_week))
		.where(eq(planning_entry.uuid, req.params.uuid));

	try {
		const data = await planningEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'planning_entry',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPlanningEntryByPlanningWeek(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			pe.uuid as planning_entry_uuid,
			pe.planning_week,
			pe.sfg_uuid,
			pe.sno_quantity::float8,
			pe.factory_quantity::float8,
			pe.production_quantity::float8,
			pe.batch_production_quantity::float8,
			pe.created_at,
			pe.updated_at,
			pe.sno_remarks as sno_remarks,
			pe.factory_remarks as factory_remarks,
			oe.style,
			oe.color,
			oe.size,
			oe.quantity::float8 as order_quantity,
			vod.order_number,
			vod.item_description,
			pe_given.given_sno_quantity::float8 as given_sno_quantity,
			pe_given.given_factory_quantity::float8 as given_factory_quantity,
			pe_given.given_production_quantity::float8 as given_production_quantity,
			pe_given.given_batch_production_quantity::float8 as given_batch_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_sno_quantity,0))::float8 as balance_sno_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_factory_quantity,0))::float8 as balance_factory_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_production_quantity,0))::float8 as balance_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_batch_production_quantity,0))::float8 as balance_batch_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_sno_quantity,0) + coalesce(pe.sno_quantity,0))::float8 as max_sno_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_factory_quantity,0) + coalesce(pe.factory_quantity,0))::float8 as max_factory_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_production_quantity,0) + coalesce(pe.production_quantity,0))::float8 as max_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_batch_production_quantity,0) + coalesce(pe.batch_production_quantity,0))::float8 as max_batch_production_quantity
		FROM
			zipper.planning_entry pe
		LEFT JOIN
			zipper.planning p ON pe.planning_week = p.week
		LEFT JOIN 
			zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
		LEFT JOIN
			(
				SELECT 
					sfg.uuid as sfg_uuid,
					SUM(pe.sno_quantity) as given_sno_quantity, 
					SUM(pe.factory_quantity) as given_factory_quantity,
					SUM(pe.production_quantity) as given_production_quantity,
					SUM(pe.batch_production_quantity) as given_batch_production_quantity
				FROM 
					zipper.planning_entry pe
				LEFT JOIN 
					zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
				GROUP BY
					sfg.uuid
			) as pe_given ON pe_given.sfg_uuid = sfg.uuid
		WHERE
			pe.planning_week = ${req.params.planning_week}
		GROUP BY 
			sfg.uuid, 
			pe.uuid,
			oe.style, 
			oe.color, 
			oe.size, 
			oe.quantity, 
			vod.order_number, 
			vod.item_description,
			pe_given.given_sno_quantity,
			pe_given.given_factory_quantity,
			pe_given.given_production_quantity,
			pe_given.given_batch_production_quantity
	`;

	//  AND oe.swatch_status_enum = 'approved' // removed because of development purpose

	const planningEntryPromise = db.execute(query);

	try {
		const data = await planningEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'planning_entry By Planning Week',
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
			sfg.uuid as sfg_uuid,
			oe.style,
			oe.color,
			oe.size,
			oe.quantity::float8 as order_quantity,
			vod.order_number,
			vod.item_description,
			pe_given.given_sno_quantity::float8 as given_sno_quantity,
			pe_given.given_factory_quantity::float8 as given_factory_quantity,
			pe_given.given_production_quantity::float8 as given_production_quantity,
			pe_given.given_batch_production_quantity::float8 as given_batch_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_sno_quantity,0))::float8  as balance_sno_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_factory_quantity,0))::float8 as balance_factory_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_production_quantity,0))::float8 as balance_production_quantity,
			(coalesce(oe.quantity,0) - coalesce(pe_given.given_batch_production_quantity,0))::float8 as balance_batch_production_quantity
		FROM
			zipper.order_entry oe
		LEFT JOIN
			zipper.v_order_details vod
			ON oe.order_description_uuid = vod.order_description_uuid
		LEFT JOIN 
			zipper.sfg sfg
			ON oe.uuid = sfg.order_entry_uuid
		LEFT JOIN
			(
				SELECT 
					sfg.uuid as sfg_uuid,
					SUM(pe.sno_quantity) as given_sno_quantity, 
					SUM(pe.factory_quantity) as given_factory_quantity,
					SUM(pe.production_quantity) as given_production_quantity,
					SUM(pe.batch_production_quantity) as given_batch_production_quantity
				FROM 
					zipper.planning_entry pe
				LEFT JOIN 
					zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
				GROUP BY
					sfg.uuid
			) as pe_given ON pe_given.sfg_uuid = sfg.uuid
		WHERE 
			sfg.recipe_uuid IS NOT NULL
		GROUP BY 
			sfg.uuid, 
			oe.style, 
			oe.color, 
			oe.size, 
			oe.quantity, 
			vod.order_number, 
			vod.item_description,
			pe_given.given_sno_quantity,
			pe_given.given_factory_quantity,
			pe_given.given_production_quantity,
			pe_given.given_batch_production_quantity
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

export async function insertOrUpdatePlanningEntryByFactory(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		planning_week,
		sfg_uuid,
		factory_quantity,
		production_quantity,
		batch_production_quantity,
		sno_remarks,
		factory_remarks,
		created_at,
		updated_at,
	} = req.body;

	const query = sql`SELECT planning_entry.uuid
						FROM zipper.planning_entry
						WHERE planning_week = ${planning_week} AND sfg_uuid = ${sfg_uuid};`;

	const sfgExistsPromise = db.execute(query);

	const sfgExists = await sfgExistsPromise;

	// if planning entry and sfg already exists, then update the existing entry
	if (sfgExists.rowCount > 0) {
		const planningEntryPromise = db
			.update(planning_entry)
			.set({
				factory_quantity,
				production_quantity,
				batch_production_quantity,
				sno_remarks,
				factory_remarks,
				updated_at,
			})
			.where(
				and(
					eq(planning_entry.planning_week, planning_week),
					eq(planning_entry.sfg_uuid, sfg_uuid)
				)
			)
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
	// if planning entry already exists, but sfg_uuid does not exist, then insert a new entry
	else {
		const planningEntryPromise = db
			.insert(planning_entry)
			.values({
				uuid,
				planning_week,
				sfg_uuid,
				factory_quantity,
				production_quantity,
				batch_production_quantity,
				sno_remarks,
				factory_remarks,
				created_at,
			})
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
}
