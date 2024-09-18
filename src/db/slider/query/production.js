import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

import * as hrSchema from '../../hr/schema.js';

import { production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(production)
		.values(req.body)
		.returning({ insertedId: production.uuid });

	try {
		const data = await resultPromise;

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

	const resultPromise = db
		.update(production)
		.set(req.body)
		.where(eq(production.uuid, req.params.uuid))
		.returning({ updatedId: production.uuid });

	try {
		const data = await resultPromise;

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
	const resultPromise = db
		.delete(production)
		.where(eq(production.uuid, req.params.uuid))
		.returning({ deletedId: production.uuid });

	try {
		const data = await resultPromise;

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
			production.uuid,
			production.stock_uuid,
			production.production_quantity,
			production.wastage,
			production.section,
			production.created_by,
			users.name as created_by_name,
			production.created_at,
			production.updated_at,
			production.remarks,
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
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.puller_link,
			vodf.puller_link_name,
			vodf.puller_link_short_name,
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
			stock.order_quantity,
			vodf.order_info_uuid,
			vodf.order_number,
			stock.sa_prod,
			stock.coloring_stock,
			stock.coloring_prod,
			stock.coloring_stock + production.production_quantity as max_coloring_quantity,
			production.with_link,
			CAST(
				CASE 
					WHEN production.with_link = 1
						THEN
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION),
								CAST(stock.link_quantity AS DOUBLE PRECISION)
							) 
						ELSE 
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION)
							) 
						END
			AS DOUBLE PRECISION) + production.production_quantity AS max_sa_quantity
		FROM
			slider.production
		LEFT JOIN
			slider.stock ON production.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON production.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
		ORDER BY
			production.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'production list',
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
			production.uuid,
			production.stock_uuid,
			production.production_quantity,
			production.wastage,
			production.section,
			production.created_by,
			users.name as created_by_name,
			production.created_at,
			production.updated_at,
			production.remarks,
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
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.puller_link,
			vodf.puller_link_name,
			vodf.puller_link_short_name,
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
			stock.order_quantity,
			vodf.order_info_uuid,
			vodf.order_number,
			stock.sa_prod,
			stock.coloring_stock,
			stock.coloring_prod,
			stock.coloring_stock + production.production_quantity as max_coloring_quantity,
			production.with_link,
			CAST(
				CASE 
					WHEN production.with_link = 1
						THEN
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION),
								CAST(stock.link_quantity AS DOUBLE PRECISION)
							) 
						ELSE 
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION)
							) 
						END
			AS DOUBLE PRECISION) + production.production_quantity AS max_sa_quantity
		FROM
			slider.production
		LEFT JOIN
			slider.stock ON production.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON production.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
		WHERE production.uuid = ${req.params.uuid}
		ORDER BY
			production.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'production list',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectProductionBySection(req, res, next) {
	const { section } = req.params;

	const query = sql`
		SELECT
			production.uuid,
			production.stock_uuid,
			production.production_quantity,
			production.wastage,
			production.section,
			production.created_by,
			users.name as created_by_name,
			production.created_at,
			production.updated_at,
			production.remarks,
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
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.puller_link,
			vodf.puller_link_name,
			vodf.puller_link_short_name,
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
			stock.order_quantity,
			vodf.order_info_uuid,
			vodf.order_number,
			stock.sa_prod,
			stock.coloring_stock,
			stock.coloring_prod,
			stock.coloring_stock + production.production_quantity as max_coloring_quantity,
			production.with_link,
			CAST(
				CASE 
					WHEN production.with_link = 1
						THEN
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION),
								CAST(stock.link_quantity AS DOUBLE PRECISION)
							) 
						ELSE 
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION)
							) 
						END
			AS DOUBLE PRECISION) + production.production_quantity AS max_sa_quantity
		FROM
			slider.production
		LEFT JOIN
			slider.stock ON production.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON production.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
		WHERE 
			production.section = ${section}
		ORDER BY
			production.created_at DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'production list by section',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
