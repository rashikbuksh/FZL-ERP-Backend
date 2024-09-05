import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { stock, transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.insert(transaction)
		.values(req.body)
		.returning({ insertedSection: transaction.uuid });

	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedSection} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.update(transaction)
		.set(req.body)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning({ updatedSection: transaction.uuid });
	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedSection} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const transactionPromise = db
		.delete(transaction)
		.where(eq(transaction.uuid, req.params.uuid))
		.returning({ deletedSection: transaction.uuid });
	try {
		const data = await transactionPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedSection} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { from_section } = req.query;

	const query = sql`
		SELECT
			transaction.uuid,
			transaction.stock_uuid,
			transaction.from_section,
			transaction.to_section,
			transaction.trx_quantity,
			transaction.created_by,
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
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
			oi.uuid as order_info_uuid,
			concat('Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) as order_number,
			stock.sa_prod
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.order_info oi ON stock.order_info_uuid = oi.uuid
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
	`;

	if (from_section) {
		query.append(sql`WHERE transaction.from_section = ${from_section}`);
	}

	const transactionPromise = db.execute(query);

	try {
		const data = await transactionPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Transaction list',
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
			transaction.uuid,
			transaction.stock_uuid,
			transaction.from_section,
			transaction.to_section,
			transaction.trx_quantity,
			transaction.created_by,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
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
			oi.uuid as order_info_uuid,
			concat('Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0'))
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			zipper.order_info oi ON stock.order_info_uuid = oi.uuid
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
			transaction.uuid = ${req.params.uuid}
	`;

	const transactionPromise = db.execute(query);

	try {
		const data = await transactionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'transaction',
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTransactionByFromSection(req, res, next) {
	const { from_section } = req.params;

	const query = sql`
		SELECT
			transaction.uuid,
			transaction.stock_uuid,
			transaction.from_section,
			transaction.to_section,
			transaction.trx_quantity,
			transaction.created_by,
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
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
			oi.uuid as order_info_uuid,
			concat('Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) as order_number,
			stock.sa_prod,
			stock.coloring_stock,
			stock.coloring_prod,
			st_given.trx_quantity as total_trx_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.order_info oi ON stock.order_info_uuid = oi.uuid
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
		LEFT JOIN 
			(
				SELECT stock.uuid, SUM(trx_quantity) as trx_quantity
				FROM slider.transaction
				LEFT JOIN slider.stock ON transaction.stock_uuid = stock.uuid
				WHERE transaction.from_section = ${from_section}
				GROUP BY stock.uuid
			) as st_given ON transaction.stock_uuid = st_given.uuid
	`;

	const transactionPromise = db.execute(query);

	try {
		const data = await transactionPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Transaction list',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
