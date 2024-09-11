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
			(stock.sa_prod + transaction.trx_quantity) as max_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
    ORDER BY transaction.created_at DESC
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
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
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
			(stock.sa_prod + transaction.trx_quantity) as max_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
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
			st_given.trx_quantity as total_trx_quantity,
			(stock.sa_prod + transaction.trx_quantity) as max_sa_quantity,
			(stock.coloring_stock + transaction.trx_quantity) as max_coloring_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
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
