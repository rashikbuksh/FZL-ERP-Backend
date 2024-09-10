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
	const resultPromise = db
		.select({
			uuid: production.uuid,
			stock_uuid: production.stock_uuid,
			production_quantity: production.production_quantity,
			wastage: production.wastage,
			section: production.section,
			created_by: production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production.created_at,
			updated_at: production.updated_at,
			remarks: production.remarks,
		})
		.from(production)
		.leftJoin(
			hrSchema.users,
			eq(production.created_by, hrSchema.users.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'production list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: production.uuid,
			stock_uuid: production.stock_uuid,
			production_quantity: production.production_quantity,
			wastage: production.wastage,
			section: production.section,
			created_by: production.created_by,
			created_by_name: hrSchema.users.name,
			created_at: production.created_at,
			updated_at: production.updated_at,
			remarks: production.remarks,
		})
		.from(production)
		.leftJoin(
			hrSchema.users,
			eq(production.created_by, hrSchema.users.uuid)
		)
		.where(eq(production.uuid, req.params.uuid));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'production',
		};

		return await res.status(200).json({ toast, data: data[0] });
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
			stock.item,
			op_item.name AS item_name,
			op_item.short_name as item_short_name,
			stock.zipper_number,
			op_zipper_number.name AS zipper_number_name,
			op_zipper_number.short_name AS zipper_number_short_name,
			stock.end_type,
			op_end_type.name AS end_type_name,
			op_end_type.short_name AS end_type_short_name,
			stock.lock_type,
			op_lock_type.name AS lock_type_name,
			op_lock_type.short_name AS lock_type_short_name,
			stock.puller_type,
			op_puller_type.name AS puller_type_name,
			op_puller_type.short_name AS puller_type_short_name,
			stock.puller_color,
			op_puller_color.name AS puller_color_name,
			op_puller_color.short_name AS puller_color_short_name,
			stock.logo_type,
			op_logo_type.name AS logo_type_name,
			op_logo_type.short_name AS logo_type_short_name,
			stock.puller_link,
			op_puller_link.name AS puller_link_name,
			op_puller_link.short_name AS puller_link_short_name,
			stock.slider,
			op_slider.name AS slider_name,
			op_slider.short_name AS slider_short_name,
			stock.slider_body_shape,
			op_slider_body_shape.name AS slider_body_shape_name,
			op_slider_body_shape.short_name AS slider_body_shape_short_name,
			stock.slider_link,
			op_slider_link.name AS slider_link_name,
			op_slider_link.short_name AS slider_link_short_name,
			stock.coloring_type,
			op_coloring_type.name AS coloring_type_name,
			op_coloring_type.short_name AS coloring_type_short_name,
			stock.is_logo_body,
			stock.is_logo_puller,
			stock.order_quantity,
			vodf.order_info_uuid,
			vodf.order_number,
			stock.sa_prod,
			stock.coloring_stock,
			stock.coloring_prod
		FROM
			slider.production
		LEFT JOIN
			slider.stock ON production.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON production.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details vodf ON stock.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			public.properties op_item ON stock.item = op_item.uuid
		LEFT JOIN
			public.properties op_zipper_number ON stock.zipper_number = op_zipper_number.uuid
		LEFT JOIN
			public.properties op_end_type ON stock.end_type = op_end_type.uuid
		LEFT JOIN
			public.properties op_puller_type ON stock.puller_type = op_puller_type.uuid
		LEFT JOIN
			public.properties op_puller_color ON stock.puller_color = op_puller_color.uuid
		LEFT JOIN
			public.properties op_logo_type ON stock.logo_type = op_logo_type.uuid
		LEFT JOIN
			public.properties op_puller_link ON stock.puller_link = op_puller_link.uuid
		LEFT JOIN
			public.properties op_slider ON stock.slider = op_slider.uuid
		LEFT JOIN
			public.properties op_lock_type ON stock.lock_type = op_lock_type.uuid
		LEFT JOIN
			public.properties op_slider_body_shape ON stock.slider_body_shape = op_slider_body_shape.uuid
		LEFT JOIN
			public.properties op_slider_link ON stock.slider_link = op_slider_link.uuid
		LEFT JOIN
			public.properties op_coloring_type ON stock.coloring_type = op_coloring_type.uuid
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
