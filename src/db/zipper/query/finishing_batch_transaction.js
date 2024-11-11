import { desc, eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import {
	finishing_batch_entry,
	finishing_batch_transaction,
	order_entry,
	sfg,
} from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchTransactionPromise = db
		.insert(finishing_batch_transaction)
		.values(req.body)
		.returning({
			insertedId: finishing_batch_transaction.finishing_batch_entry_uuid,
		});

	try {
		const data = await finishingBatchTransactionPromise;
		const orderDescription = sql`
			SELECT
				concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text), ' -> ',vodf.order_number, ' - ', vodf.item_description) as inserted_id
			FROM
				zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN zipper.finishing_batch_entry fbe ON sfg.uuid = fbe.sfg_uuid
				LEFT JOIN zipper.finishing_batch zfb ON fbe.finishing_batch_uuid = zfb.uuid
			WHERE
				finishing_batch_entry.uuid = ${data[0].insertedId}
			`;

		const order_details = await db.execute(orderDescription);

		const toast = {
			status: 201,
			type: 'insert',
			message: `${order_details.rows[0].inserted_id} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const finishingBatchTransactionPromise = db
		.update(finishing_batch_transaction)
		.set(req.body)
		.where(eq(finishing_batch_transaction.uuid, req.params.uuid))
		.returning({
			updatedId: finishing_batch_transaction.finishing_batch_entry_uuid,
		});

	try {
		const data = await finishingBatchTransactionPromise;

		const orderDescription = sql`
			SELECT
				concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text), ' -> ',vodf.order_number, ' - ', vodf.item_description) as inserted_id
			FROM
				zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN zipper.finishing_batch_entry fbe ON sfg.uuid = fbe.sfg_uuid
				LEFT JOIN zipper.finishing_batch zfb ON fbe.finishing_batch_uuid = zfb.uuid
			WHERE
				finishing_batch_entry.uuid = ${data[0].updatedId}
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

	const finishingBatchTransactionPromise = db
		.delete(finishing_batch_transaction)
		.where(eq(finishing_batch_transaction.uuid, req.params.uuid))
		.returning({
			deletedId: finishing_batch_transaction.finishing_batch_entry_uuid,
		});

	try {
		const data = await finishingBatchTransactionPromise;

		const orderDescription = sql`
			SELECT
				concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text), ' -> ',vodf.order_number, ' - ', vodf.item_description) as inserted_id
			FROM
				zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN zipper.finishing_batch_entry fbe ON sfg.uuid = fbe.sfg_uuid
				LEFT JOIN zipper.finishing_batch zfb ON fbe.finishing_batch_uuid = zfb.uuid
			WHERE
				finishing_batch_entry.uuid = ${data[0].deletedId}
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
			uuid: finishing_batch_transaction.uuid,
			finishing_batch_entry_uuid:
				finishing_batch_transaction.finishing_batch_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: decimalToNumber(order_entry.quantity),
			trx_from: finishing_batch_transaction.trx_from,
			trx_to: finishing_batch_transaction.trx_to,
			trx_quantity: decimalToNumber(
				finishing_batch_transaction.trx_quantity
			),
			trx_quantity_in_kg: decimalToNumber(
				finishing_batch_transaction.trx_quantity_in_kg
			),
			slider_item_uuid: finishing_batch_transaction.slider_item_uuid,
			created_by: finishing_batch_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_transaction.created_at,
			updated_at: finishing_batch_transaction.updated_at,
			remarks: finishing_batch_transaction.remarks,
		})
		.from(finishing_batch_transaction)
		.leftJoin(
			finishing_batch_entry,
			eq(
				finishing_batch_transaction.finishing_batch_entry_uuid,
				finishing_batch_entry.uuid
			)
		)
		.leftJoin(sfg, eq(finishing_batch_entry.sfg_uuid, sfg.uuid))
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch_transaction.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(finishing_batch_transaction.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Finishing Batch Transaction list',
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

	const finishingBatchTransactionPromise = db
		.select({
			uuid: finishing_batch_transaction.uuid,
			finishing_batch_entry_uuid:
				finishing_batch_transaction.finishing_batch_entry_uuid,
			order_description_uuid: order_entry.order_description_uuid,
			order_quantity: decimalToNumber(order_entry.quantity),
			trx_from: finishing_batch_transaction.trx_from,
			trx_to: finishing_batch_transaction.trx_to,
			trx_quantity: decimalToNumber(
				finishing_batch_transaction.trx_quantity
			),
			trx_quantity_in_kg: decimalToNumber(
				finishing_batch_transaction.trx_quantity_in_kg
			),
			slider_item_uuid: finishing_batch_transaction.slider_item_uuid,
			created_by: finishing_batch_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: finishing_batch_transaction.created_at,
			updated_at: finishing_batch_transaction.updated_at,
			remarks: finishing_batch_transaction.remarks,
		})
		.from(finishing_batch_transaction)
		.leftJoin(
			finishing_batch_entry,
			eq(
				finishing_batch_transaction.finishing_batch_entry_uuid,
				finishing_batch_entry.uuid
			)
		)
		.leftJoin(sfg, eq(finishing_batch_entry.sfg_uuid, sfg.uuid))
		.leftJoin(order_entry, eq(sfg.order_entry_uuid, order_entry.uuid))
		.leftJoin(
			hrSchema.users,
			eq(finishing_batch_transaction.created_by, hrSchema.users.uuid)
		)
		.where(eq(finishing_batch_transaction.uuid, req.params.uuid));

	try {
		const data = await finishingBatchTransactionPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Finishing Batch Transaction ',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByTrxFrom(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_name, nylon_stopper } = req.query;

	const query = sql`
		SELECT
			finishing_batch_transaction.uuid,
			finishing_batch_transaction.finishing_batch_entry_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			sfg.order_entry_uuid,
			vodf.order_description_uuid,
			vodf.order_number, 
			vodf.item_description,
			oe.style,
			oe.color,
			oe.size,
			concat(oe.style, '-', oe.color, '-', CASE 
                        WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                        ELSE CAST(oe.size AS NUMERIC)
                    END) AS style_color_size, 
			oe.quantity::float8 as order_quantity,
			fbe.quantity::float8 as batch_quantity,
			finishing_batch_transaction.trx_from,
			finishing_batch_transaction.trx_to,
			coalesce(finishing_batch_transaction.trx_quantity_in_kg::numeric,0)::float8 as trx_quantity_in_kg,
			coalesce(finishing_batch_transaction.trx_quantity::numeric,0)::float8 as trx_quantity,
			finishing_batch_transaction.created_by,
			users.name AS created_by_name,
			finishing_batch_transaction.created_at,
			finishing_batch_transaction.updated_at,
			finishing_batch_transaction.remarks,
			coalesce(sfg.dying_and_iron_prod::numeric,0)::float8 as dying_and_iron_prod,
			coalesce(sfg.teeth_molding_stock::numeric,0)::float8 as teeth_molding_stock,
			coalesce(sfg.teeth_molding_prod::numeric,0)::float8 as teeth_molding_prod,
			coalesce(sfg.teeth_coloring_stock::numeric,0)::float8 as teeth_coloring_stock,
			coalesce(sfg.teeth_coloring_prod::numeric,0)::float8 as teeth_coloring_prod,
			coalesce(sfg.finishing_stock::numeric,0)::float8 as finishing_stock,
			coalesce(sfg.finishing_prod::numeric,0)::float8 as finishing_prod,
			coalesce(sfg.coloring_prod::numeric,0)::float8 as coloring_prod,
			coalesce(sfg.warehouse::numeric,0)::float8 as warehouse,
			coalesce(sfg.delivered::numeric,0)::float8 as delivered,
			coalesce(sfg.pi::numeric,0)::float8 as pi,
			coalesce(sfg.short_quantity,0)::float8 as short_quantity,
			coalesce(sfg.reject_quantity,0)::float8 as reject_quantity
		FROM
			zipper.finishing_batch_transaction
		LEFT JOIN
			hr.users ON finishing_batch_transaction.created_by = users.uuid
		LEFT JOIN
			zipper.finishing_batch_entry fbe ON finishing_batch_transaction.finishing_batch_entry_uuid = fbe.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON fbe.finishing_batch_uuid = zfb.uuid
		LEFT JOIN
			zipper.sfg ON fbe.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid AND zfb.order_description_uuid = vodf.order_description_uuid
		WHERE
			finishing_batch_transaction.trx_from = ${req.params.trx_from} ${item_name ? sql`AND lower(vodf.item_name) = lower(${item_name})` : sql``}
			${nylon_stopper ? sql`AND lower(vodf.nylon_stopper_name) = lower(${nylon_stopper})` : sql``}
	`;

	const sfgProductionPromise = db.execute(query);

	try {
		const data = await sfgProductionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'SFG Transaction',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
