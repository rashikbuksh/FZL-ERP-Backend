import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import {
	finishing_batch_entry,
	finishing_batch_production,
} from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchProductionPromise = db
		.insert(finishing_batch_production)
		.values(req.body)
		.returning({
			insertedId: finishing_batch_production.finishing_batch_entry_uuid,
		});
	try {
		const data = await finishingBatchProductionPromise;

		const orderDescription = sql`
			SELECT
				concat(vodf.order_number, ' - ', vodf.item_description) as inserted_id
			FROM
				zipper.finishing_batch_entry fbe 
				LEFT JOIN zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
			WHERE
				fbe.uuid = ${data[0].insertedId}
			`;

		const order_details = await db.execute(orderDescription);

		const toast = {
			status: 201,
			type: 'insert',
			message: `${order_details.rows[0].inserted_id} production inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchProductionPromise = db
		.update(finishing_batch_production)
		.set(req.body)
		.where(eq(finishing_batch_production.uuid, req.params.uuid))
		.returning({
			updatedId: finishing_batch_production.finishing_batch_entry_uuid,
		});

	try {
		const data = await finishingBatchProductionPromise;
		const orderDescription = sql`
			SELECT
				concat(vodf.order_number, ' - ', vodf.item_description) as updated_id
			FROM
				zipper.finishing_batch_entry fbe 
				LEFT JOIN zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
			WHERE
				fbe.uuid = ${data[0].updatedId}
			`;

		const order_details = await db.execute(orderDescription);

		const toast = {
			status: 201,
			type: 'update',
			message: `${order_details.rows[0].updated_id} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchProductionPromise = db
		.delete(finishing_batch_production)
		.where(eq(finishing_batch_production.uuid, req.params.uuid))
		.returning({
			deletedId: finishing_batch_production.finishing_batch_entry_uuid,
		});

	try {
		const data = await finishingBatchProductionPromise;
		const orderDescription = sql`
			SELECT
				concat(vodf.order_number, ' - ', vodf.item_description) as deleted_id
			FROM
				zipper.finishing_batch_entry fbe 
				LEFT JOIN zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
			WHERE
				fbe.uuid = ${data[0].deletedId}
			`;

		const order_details = await db.execute(orderDescription);

		const toast = {
			status: 201,
			type: 'delete',
			message: `${order_details.rows[0].deleted_id} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: finishing_batch_production.uuid,
			finishing_batch_entry_uuid:
				finishing_batch_production.finishing_batch_entry_uuid,
			section: finishing_batch_production.section,
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_production.dyed_tape_used_in_kg
			),
			production_quantity_in_kg: decimalToNumber(
				finishing_batch_production.production_quantity_in_kg
			),
			production_quantity: decimalToNumber(
				finishing_batch_production.production_quantity
			),
			wastage: decimalToNumber(finishing_batch_production.wastage),
			created_by: finishing_batch_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_production.created_at,
			updated_at: finishing_batch_production.updated_at,
			remarks: finishing_batch_production.remarks,
		})
		.from(finishing_batch_production)
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch_production.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(finishing_batch_production.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'Finishing Batch Production list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchProductionPromise = db
		.select({
			uuid: finishing_batch_production.uuid,
			finishing_batch_entry_uuid:
				finishing_batch_production.finishing_batch_entry_uuid,
			section: finishing_batch_production.section,
			production_quantity_in_kg: decimalToNumber(
				finishing_batch_production.production_quantity_in_kg
			),
			production_quantity: decimalToNumber(
				finishing_batch_production.production_quantity
			),
			dyed_tape_used_in_kg: decimalToNumber(
				finishing_batch_production.dyed_tape_used_in_kg
			),
			wastage: decimalToNumber(finishing_batch_production.wastage),
			created_by: finishing_batch_production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_production.created_at,
			updated_at: finishing_batch_production.updated_at,
			remarks: finishing_batch_production.remarks,
		})
		.from(finishing_batch_production)
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch_production.created_by, hrSchema.users.uuid)
		)
		.where(eq(finishing_batch_production.uuid, req.params.uuid));

	try {
		const data = await finishingBatchProductionPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Finishing Batch Production',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_name, nylon_stopper } = req.query;

	const query = sql`
		SELECT
			finishing_batch_production.uuid,
			finishing_batch_production.finishing_batch_entry_uuid,
			sfg.order_entry_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			vodf.order_description_uuid,
			vodf.order_number,
			vodf.item_description,
			oe.style,
			oe.color,
			oe.size,
			concat(oe.style, '-', oe.color, '-', 
					CASE 
                        WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                        ELSE CAST(oe.size AS NUMERIC)
                    END) AS style_color_size,
			CASE 
				WHEN vodf.order_type = 'tape' 
				THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
				ELSE oe.quantity::float8 
			END as order_quantity,
			fbe.quantity::float8 as batch_quantity,
			finishing_batch_production.section,
			COALESCE(finishing_batch_production.dyed_tape_used_in_kg,0)::float8 as dyed_tape_used_in_kg,
			COALESCE(finishing_batch_production.production_quantity_in_kg,0)::float8 as production_quantity_in_kg,
			COALESCE(finishing_batch_production.production_quantity,0)::float8 as production_quantity,
			COALESCE(finishing_batch_production.wastage,0)::float8 as wastage,
			finishing_batch_production.created_by,
			users.name AS created_by_name,
			finishing_batch_production.created_at,
			finishing_batch_production.updated_at,
			finishing_batch_production.remarks,
			CASE WHEN fbe.finishing_prod != 0 
			THEN (fbe.quantity - COALESCE(fbe.finishing_prod, 0) - COALESCE(sfg.warehouse, 0)) 
			ELSE (fbe.quantity - COALESCE(sfg.warehouse, 0))::float8 END as balance_quantity,
			COALESCE(sfg.dying_and_iron_prod,0)::float8 as dying_and_iron_prod,
			COALESCE(sfg.teeth_molding_stock,0)::float8 as teeth_molding_stock,
			COALESCE(sfg.teeth_molding_prod,0)::float8 as teeth_molding_prod,
			COALESCE(sfg.teeth_coloring_stock,0)::float8 as teeth_coloring_stock,
			COALESCE(sfg.teeth_coloring_prod,0)::float8 as teeth_coloring_prod,
			COALESCE(sfg.finishing_stock,0)::float8 as finishing_stock,
			COALESCE(sfg.finishing_prod,0)::float8 as finishing_prod,
			COALESCE(sfg.coloring_prod,0)::float8 as coloring_prod,
			COALESCE(sfg.warehouse,0)::float8 as warehouse,
			COALESCE(sfg.delivered,0)::float8 as delivered,
			COALESCE(sfg.pi,0)::float8 as pi,
			COALESCE(sfg.short_quantity,0)::float8 as short_quantity,
			COALESCE(sfg.reject_quantity,0)::float8 as reject_quantity,
			COALESCE(vodf.tape_received,0)::float8 as tape_received,
			COALESCE(vodf.tape_transferred,0)::float8 as tape_transferred,
			COALESCE(sfg.dyed_tape_used_in_kg,0)::float8 as sfg_dyed_tape_used_in_kg,
			(COALESCE(tape_transferred,0)::float8 - COALESCE(sfg.dyed_tape_used_in_kg,0)::float8)::float8 as tape_stock,
			COALESCE(vodf.slider_finishing_stock,0)::float8 as slider_finishing_stock
		FROM
			zipper.finishing_batch_production
		LEFT JOIN
			hr.users ON finishing_batch_production.created_by = users.uuid
		LEFT JOIN 
			zipper.finishing_batch_entry fbe ON finishing_batch_production.finishing_batch_entry_uuid = fbe.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON fbe.finishing_batch_uuid = zfb.uuid
		LEFT JOIN
			zipper.sfg ON fbe.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid AND zfb.order_description_uuid = vodf.order_description_uuid
		WHERE
			finishing_batch_production.section = ${req.params.section} ${item_name ? sql`AND lower(vodf.item_name) = lower(${item_name})` : sql``}
			${nylon_stopper ? sql`AND lower(vodf.nylon_stopper_name) = lower(${nylon_stopper})` : sql``}
		ORDER BY 
			finishing_batch_production.created_at DESC
	`;

	const finishingBatchProductionPromise = db.execute(query);

	try {
		const data = await finishingBatchProductionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'SFG Production',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
