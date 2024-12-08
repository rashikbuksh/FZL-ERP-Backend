import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import slider, { stock, transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid, finishing_batch_uuid, batch_quantity, created_at } = req.body;

	const stockPromise = db
		.insert(stock)
		.values({
			uuid,
			finishing_batch_uuid,
			batch_quantity,
			created_at,
		})
		.returning({ insertedId: stock.uuid });

	try {
		const data = await stockPromise;
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

	const { uuid, finishing_batch_uuid, batch_quantity, created_at } = req.body;

	const stockPromise = db
		.update(stock)
		.set({ uuid, finishing_batch_uuid, batch_quantity, created_at })
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ updatedId: stock.uuid });
	try {
		const data = await stockPromise;
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

	const stockPromise = db
		.delete(stock)
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ deletedId: stock.uuid });
	try {
		const data = await stockPromise;
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
		DISTINCT stock.uuid,
		stock.finishing_batch_uuid,
		finishing_batch.order_description_uuid,
		concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text)) as batch_number,
		order_description.order_info_uuid,
		vodf.order_number,
		vodf.item_description,
		CAST(stock.batch_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.swatch_approved_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.body_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.cap_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.puller_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.link_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.sa_prod::float8 AS DOUBLE PRECISION),
		CAST(stock.sa_prod_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_stock::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_stock_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_prod::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_prod_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.finishing_stock::float8 AS DOUBLE PRECISION),
		CAST(stock.finishing_stock_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.trx_to_finishing::float8 AS DOUBLE PRECISION),
		CAST(stock.trx_to_finishing_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.u_top_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.h_bottom_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.box_pin_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.two_way_pin_quantity::float8 AS DOUBLE PRECISION),
		stock.created_at,
		stock.updated_at,
		stock.remarks,
		vodf.party_uuid,
		vodf.party_name,
		vodf.item,
		vodf.item_name,
		vodf.item_short_name,
		vodf.zipper_number,
		vodf.zipper_number_name,
		vodf.zipper_number_short_name,
		vodf.end_type,
		vodf.end_type_name,
		vodf.end_type_short_name,
		vodf.lock_type,
		vodf.lock_type_name,
		vodf.lock_type_short_name,
		vodf.puller_type,
		vodf.puller_type_name,
		vodf.puller_type_short_name,
		vodf.puller_color,
		vodf.puller_color_name,
		vodf.puller_color_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.slider,
		vodf.slider_name,
		vodf.slider_short_name,
		vodf.slider_body_shape,
		vodf.slider_body_shape_name,
		vodf.slider_body_shape_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.coloring_type,
		vodf.coloring_type_name,
		vodf.coloring_type_short_name,
		vodf.logo_type,
		vodf.logo_type_name,
		vodf.logo_type_short_name,
		vodf.is_logo_body,
		vodf.is_logo_puller,
		vodf.order_type,
		vodf.is_waterproof,
		finishing_batch.slider_lead_time,
		finishing_batch.production_date
	FROM
		slider.stock
	LEFT JOIN
		zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
	LEFT JOIN
		zipper.order_description ON finishing_batch.order_description_uuid = order_description.uuid
	LEFT JOIN 
		zipper.v_order_details_full vodf ON order_description.uuid = vodf.order_description_uuid
	LEFT JOIN
    (
        SELECT
            stock.uuid AS stock_uuid,
            SUM(transaction.trx_quantity)::float8 AS trx_quantity,
			SUM(transaction.weight)::float8 AS trx_weight
        FROM
            slider.transaction
        LEFT JOIN
            slider.stock ON transaction.stock_uuid = stock.uuid
        WHERE
            transaction.from_section = 'coloring_prod'
        GROUP BY
            stock.uuid
    ) AS slider_transaction_given ON stock.uuid = slider_transaction_given.stock_uuid
	WHERE 
		(stock.batch_quantity - COALESCE(slider_transaction_given.trx_quantity, 0)) > 0
	ORDER BY stock.created_at DESC
	;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'stock',
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
		stock.uuid,
		stock.finishing_batch_uuid,
		finishing_batch.order_description_uuid,
		concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text)) as batch_number,
		order_description.order_info_uuid,
		vodf.order_number,
		vodf.item_description,
		CAST(stock.batch_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.swatch_approved_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.body_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.cap_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.puller_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.link_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.sa_prod::float8 AS DOUBLE PRECISION),
		CAST(stock.sa_prod_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_stock::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_stock_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_prod::float8 AS DOUBLE PRECISION),
		CAST(stock.coloring_prod_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.finishing_stock::float8 AS DOUBLE PRECISION),
		CAST(stock.finishing_stock_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.trx_to_finishing::float8 AS DOUBLE PRECISION),
		CAST(stock.trx_to_finishing_weight::float8 AS DOUBLE PRECISION),
		CAST(stock.u_top_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.h_bottom_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.box_pin_quantity::float8 AS DOUBLE PRECISION),
		CAST(stock.two_way_pin_quantity::float8 AS DOUBLE PRECISION),
		stock.created_at,
		stock.updated_at,
		stock.remarks,
		vodf.party_uuid,
		vodf.party_name,
		vodf.item,
		vodf.item_name,
		vodf.item_short_name,
		vodf.zipper_number,
		vodf.zipper_number_name,
		vodf.zipper_number_short_name,
		vodf.end_type,
		vodf.end_type_name,
		vodf.end_type_short_name,
		vodf.lock_type,
		vodf.lock_type_name,
		vodf.lock_type_short_name,
		vodf.puller_type,
		vodf.puller_type_name,
		vodf.puller_type_short_name,
		vodf.puller_color,
		vodf.puller_color_name,
		vodf.puller_color_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.slider,
		vodf.slider_name,
		vodf.slider_short_name,
		vodf.slider_body_shape,
		vodf.slider_body_shape_name,
		vodf.slider_body_shape_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.coloring_type,
		vodf.coloring_type_name,
		vodf.coloring_type_short_name,
		vodf.logo_type,
		vodf.logo_type_name,
		vodf.logo_type_short_name,
		vodf.is_logo_body,
		vodf.is_logo_puller,
		vodf.order_type,
		vodf.is_waterproof
	FROM
		slider.stock
	LEFT JOIN
		zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
	LEFT JOIN
		zipper.order_description ON finishing_batch.order_description_uuid = order_description.uuid
	LEFT JOIN
		zipper.order_info ON order_description.order_info_uuid = order_info.uuid
	LEFT JOIN 
		zipper.v_order_details_full vodf ON order_description.uuid = vodf.order_description_uuid
	WHERE
		stock.uuid = ${req.params.uuid};
	`;

	const stockPromise = db.execute(query);

	try {
		const data = await stockPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'stock',
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectStockByFromSection(req, res, next) {
	const { from_section } = req.params;

	const query = sql`
	SELECT
		DISTINCT stock.uuid,
		stock.finishing_batch_uuid,
		finishing_batch.order_description_uuid,
		concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', lpad((finishing_batch.id)::text, 4, '0'::text)) as batch_number,
		order_description.order_info_uuid,
		pp.name AS party_name,
		vodf.order_number,
		vodf.item_description,
		vodf.party_uuid,
		vodf.party_name,
		vodf.item,
		vodf.item_name,
		vodf.item_short_name,
		vodf.zipper_number,
		vodf.zipper_number_name,
		vodf.zipper_number_short_name,
		vodf.end_type,
		vodf.end_type_name,
		vodf.end_type_short_name,
		vodf.lock_type,
		vodf.lock_type_name,
		vodf.lock_type_short_name,
		vodf.puller_type,
		vodf.puller_type_name,
		vodf.puller_type_short_name,
		vodf.puller_color,
		vodf.puller_color_name,
		vodf.puller_color_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.slider,
		vodf.slider_name,
		vodf.slider_short_name,
		vodf.slider_body_shape,
		vodf.slider_body_shape_name,
		vodf.slider_body_shape_short_name,
		vodf.slider_link,
		vodf.slider_link_name,
		vodf.slider_link_short_name,
		vodf.coloring_type,
		vodf.coloring_type_name,
		vodf.coloring_type_short_name,
		vodf.logo_type,
		vodf.logo_type_name,
		vodf.logo_type_short_name,
		vodf.is_logo_body as logo_is_body,
		vodf.is_logo_puller as logo_is_puller,
		vodf.order_type,
		stock.batch_quantity::float8,
		stock.swatch_approved_quantity::float8,
		stock.body_quantity::float8,
		stock.cap_quantity::float8,
		stock.puller_quantity::float8,
		stock.link_quantity::float8,
		stock.sa_prod::float8,
		stock.sa_prod_weight::float8,
		stock.coloring_stock::float8,
		stock.coloring_stock_weight::float8,
		stock.coloring_prod::float8,
		stock.coloring_prod_weight::float8,
		stock.finishing_stock::float8,
		stock.finishing_stock_weight::float8,
		stock.trx_to_finishing::float8,
		stock.trx_to_finishing_weight::float8,
		stock.u_top_quantity::float8,
		stock.h_bottom_quantity::float8,
		stock.box_pin_quantity::float8,
		stock.two_way_pin_quantity::float8,
		LEAST(
				stock.body_quantity::float8,
				stock.cap_quantity::float8,
				stock.puller_quantity::float8,
				stock.link_quantity::float8,
				stock.batch_quantity::float8 - COALESCE(slider_transaction_given.trx_quantity, 0)
		) 
		AS max_sa_quantity_with_link,
		LEAST(
				stock.body_quantity::float8,
				stock.cap_quantity::float8,
				stock.puller_quantity::float8,
				stock.batch_quantity::float8 - COALESCE(slider_transaction_given.trx_quantity, 0)
		) 
		AS max_sa_quantity_without_link,
		stock.created_at,
		stock.updated_at,
		stock.remarks,
		slider_transaction_given.trx_quantity::float8 as total_trx_quantity,
		slider_transaction_given.trx_weight::float8 as trx_weight,
		slider_production_given.total_production_quantity::float8 as total_production_quantity,
		slider_production_given.total_production_weight::float8 as total_production_weight,
		stock.batch_quantity::float8 - COALESCE(slider_transaction_given.trx_quantity, 0) as balance_quantity,
		vodf.is_waterproof,
		styles_colors.style_object
	FROM
		slider.stock
	LEFT JOIN
		zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
	LEFT JOIN
		zipper.order_description ON finishing_batch.order_description_uuid = order_description.uuid
	LEFT JOIN 
		zipper.order_info ON order_description.order_info_uuid = order_info.uuid
	LEFT JOIN 
		zipper.v_order_details_full vodf ON order_description.uuid = vodf.order_description_uuid
	LEFT JOIN
		public.party pp ON order_info.party_uuid = pp.uuid
	LEFT JOIN (
		SELECT jsonb_agg(jsonb_build_object('label', oe.style, 'value', sfg.uuid, 'given_quantity', fbe.finishing_prod, 'left_quantity', (fbe.quantity - fbe.finishing_prod))) as style_object, stock.uuid
		FROM zipper.sfg
		LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN zipper.finishing_batch_entry fbe ON sfg.uuid = fbe.sfg_uuid
		LEFT JOIN slider.stock ON fbe.finishing_batch_uuid = stock.finishing_batch_uuid
		GROUP BY stock.uuid
	) styles_colors ON stock.uuid = styles_colors.uuid
	LEFT JOIN
    (
        SELECT
            stock.uuid AS stock_uuid,
            SUM(transaction.trx_quantity)::float8 AS trx_quantity,
			SUM(transaction.weight)::float8 AS trx_weight
        FROM
            slider.transaction
        LEFT JOIN
            slider.stock ON transaction.stock_uuid = stock.uuid
        WHERE
            transaction.from_section = ${from_section}
        GROUP BY
            stock.uuid
    ) AS slider_transaction_given ON stock.uuid = slider_transaction_given.stock_uuid
	LEFT JOIN
    (
        SELECT
            stock.uuid AS stock_uuid,
            SUM(production.production_quantity)::float8 AS total_production_quantity,
			SUM(production.weight)::float8 AS total_production_weight
        FROM
            slider.production
        LEFT JOIN
            slider.stock ON production.stock_uuid = stock.uuid
        WHERE
            production.section = CASE WHEN ${from_section} = 'coloring_prod' THEN 'coloring' ELSE ${from_section} END
        GROUP BY
            stock.uuid
    ) AS slider_production_given ON stock.uuid = slider_production_given.stock_uuid
	 WHERE 
	 	(stock.batch_quantity - COALESCE(slider_transaction_given.trx_quantity, 0)) > 0
	 ;`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: 'stock',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
