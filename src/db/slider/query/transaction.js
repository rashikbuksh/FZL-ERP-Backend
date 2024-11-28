import { eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
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
			transaction.trx_quantity::float8,
			transaction.weight::float8,
			transaction.created_by,
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item ELSE vodf_sfg_trx.item END as item,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_name ELSE vodf_sfg_trx.item_name END as item_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_short_name ELSE vodf_sfg_trx.item_short_name END as item_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number ELSE vodf_sfg_trx.zipper_number END as zipper_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_name ELSE vodf_sfg_trx.zipper_number_name END as zipper_number_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_short_name ELSE vodf_sfg_trx.zipper_number_short_name END as zipper_number_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type ELSE vodf_sfg_trx.end_type END as end_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_name ELSE vodf_sfg_trx.end_type_name END as end_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_short_name ELSE vodf_sfg_trx.end_type_short_name END as end_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type ELSE vodf_sfg_trx.lock_type END as lock_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_name ELSE vodf_sfg_trx.lock_type_name END as lock_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_short_name ELSE vodf_sfg_trx.lock_type_short_name END as lock_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type ELSE vodf_sfg_trx.puller_type END as puller_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_name ELSE vodf_sfg_trx.puller_type_name END as puller_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_short_name ELSE vodf_sfg_trx.puller_type_short_name END as puller_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color ELSE vodf_sfg_trx.puller_color END as puller_color,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_name ELSE vodf_sfg_trx.puller_color_name END as puller_color_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_short_name ELSE vodf_sfg_trx.puller_color_short_name END as puller_color_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type ELSE vodf_sfg_trx.logo_type END as logo_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_name ELSE vodf_sfg_trx.logo_type_name END as logo_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_short_name ELSE vodf_sfg_trx.logo_type_short_name END as logo_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider ELSE vodf_sfg_trx.slider END as slider,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_name ELSE vodf_sfg_trx.slider_name END as slider_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_short_name ELSE vodf_sfg_trx.slider_short_name END as slider_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape ELSE vodf_sfg_trx.slider_body_shape END as slider_body_shape,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_name ELSE vodf_sfg_trx.slider_body_shape_name END as slider_body_shape_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_short_name ELSE vodf_sfg_trx.slider_body_shape_short_name END as slider_body_shape_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type ELSE vodf_sfg_trx.coloring_type END as coloring_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_name ELSE vodf_sfg_trx.coloring_type_name END as coloring_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_short_name ELSE vodf_sfg_trx.coloring_type_short_name END as coloring_type_short_name,
			stock.batch_quantity::float8,
			stock.swatch_approved_quantity::float8,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_info_uuid ELSE vodf_sfg_trx.order_info_uuid END as order_info_uuid,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_number ELSE vodf_sfg_trx.order_number END as order_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_description ELSE vodf_sfg_trx.item_description END as item_description,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_type ELSE vodf_sfg_trx.order_type END as order_type,
			stock.sa_prod::float8,
			stock.coloring_stock::float8,
			stock.coloring_prod::float8,
			stock.trx_to_finishing::float8,
			transaction.assembly_stock_uuid,
			assembly_stock.name as assembly_stock_name,
			assembly_stock.quantity::float8 as assembly_stock_quantity,
			assembly_stock.quantity::float8 + transaction.trx_quantity::float8 as max_assembly_stock_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON zfb.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
		LEFT JOIN zipper.sfg ON sfg.uuid = transaction.sfg_uuid
		LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN zipper.v_order_details_full vodf_sfg_trx ON oe.order_description_uuid = vodf_sfg_trx.order_description_uuid
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
			transaction.trx_quantity::float8,
			transaction.weight::float8,
			transaction.created_by,
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item ELSE vodf_sfg_trx.item END as item,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_name ELSE vodf_sfg_trx.item_name END as item_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_short_name ELSE vodf_sfg_trx.item_short_name END as item_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number ELSE vodf_sfg_trx.zipper_number END as zipper_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_name ELSE vodf_sfg_trx.zipper_number_name END as zipper_number_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_short_name ELSE vodf_sfg_trx.zipper_number_short_name END as zipper_number_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type ELSE vodf_sfg_trx.end_type END as end_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_name ELSE vodf_sfg_trx.end_type_name END as end_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_short_name ELSE vodf_sfg_trx.end_type_short_name END as end_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type ELSE vodf_sfg_trx.lock_type END as lock_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_name ELSE vodf_sfg_trx.lock_type_name END as lock_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_short_name ELSE vodf_sfg_trx.lock_type_short_name END as lock_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type ELSE vodf_sfg_trx.puller_type END as puller_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_name ELSE vodf_sfg_trx.puller_type_name END as puller_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_short_name ELSE vodf_sfg_trx.puller_type_short_name END as puller_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color ELSE vodf_sfg_trx.puller_color END as puller_color,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_name ELSE vodf_sfg_trx.puller_color_name END as puller_color_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_short_name ELSE vodf_sfg_trx.puller_color_short_name END as puller_color_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type ELSE vodf_sfg_trx.logo_type END as logo_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_name ELSE vodf_sfg_trx.logo_type_name END as logo_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_short_name ELSE vodf_sfg_trx.logo_type_short_name END as logo_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider ELSE vodf_sfg_trx.slider END as slider,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_name ELSE vodf_sfg_trx.slider_name END as slider_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_short_name ELSE vodf_sfg_trx.slider_short_name END as slider_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape ELSE vodf_sfg_trx.slider_body_shape END as slider_body_shape,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_name ELSE vodf_sfg_trx.slider_body_shape_name END as slider_body_shape_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_short_name ELSE vodf_sfg_trx.slider_body_shape_short_name END as slider_body_shape_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type ELSE vodf_sfg_trx.coloring_type END as coloring_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_name ELSE vodf_sfg_trx.coloring_type_name END as coloring_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_short_name ELSE vodf_sfg_trx.coloring_type_short_name END as coloring_type_short_name,
			stock.batch_quantity::float8,
			stock.swatch_approved_quantity::float8,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_info_uuid ELSE vodf_sfg_trx.order_info_uuid END as order_info_uuid,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_number ELSE vodf_sfg_trx.order_number END as order_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_description ELSE vodf_sfg_trx.item_description END as item_description,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_type ELSE vodf_sfg_trx.order_type END as order_type,
			stock.sa_prod::float8,
			stock.coloring_stock::float8,
			stock.coloring_prod::float8,
			stock.trx_to_finishing::float8,
			transaction.assembly_stock_uuid,
			assembly_stock.name as assembly_stock_name,
			assembly_stock.quantity::float8 as assembly_stock_quantity,
			assembly_stock.quantity::float8 + transaction.trx_quantity::float8 as max_assembly_stock_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON zfb.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
		LEFT JOIN zipper.sfg ON sfg.uuid = transaction.sfg_uuid
		LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN zipper.v_order_details_full vodf_sfg_trx ON oe.order_description_uuid = vodf_sfg_trx.order_description_uuid
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
			transaction.trx_quantity::float8,
			transaction.weight::float8,
			transaction.created_by,
			users.name as created_by_name,
			transaction.created_at,
			transaction.updated_at,
			transaction.remarks,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item ELSE vodf_sfg_trx.item END as item,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_name ELSE vodf_sfg_trx.item_name END as item_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_short_name ELSE vodf_sfg_trx.item_short_name END as item_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number ELSE vodf_sfg_trx.zipper_number END as zipper_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_name ELSE vodf_sfg_trx.zipper_number_name END as zipper_number_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.zipper_number_short_name ELSE vodf_sfg_trx.zipper_number_short_name END as zipper_number_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type ELSE vodf_sfg_trx.end_type END as end_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_name ELSE vodf_sfg_trx.end_type_name END as end_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.end_type_short_name ELSE vodf_sfg_trx.end_type_short_name END as end_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type ELSE vodf_sfg_trx.lock_type END as lock_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_name ELSE vodf_sfg_trx.lock_type_name END as lock_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.lock_type_short_name ELSE vodf_sfg_trx.lock_type_short_name END as lock_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type ELSE vodf_sfg_trx.puller_type END as puller_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_name ELSE vodf_sfg_trx.puller_type_name END as puller_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_type_short_name ELSE vodf_sfg_trx.puller_type_short_name END as puller_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color ELSE vodf_sfg_trx.puller_color END as puller_color,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_name ELSE vodf_sfg_trx.puller_color_name END as puller_color_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.puller_color_short_name ELSE vodf_sfg_trx.puller_color_short_name END as puller_color_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type ELSE vodf_sfg_trx.logo_type END as logo_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_name ELSE vodf_sfg_trx.logo_type_name END as logo_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.logo_type_short_name ELSE vodf_sfg_trx.logo_type_short_name END as logo_type_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider ELSE vodf_sfg_trx.slider END as slider,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_name ELSE vodf_sfg_trx.slider_name END as slider_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_short_name ELSE vodf_sfg_trx.slider_short_name END as slider_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape ELSE vodf_sfg_trx.slider_body_shape END as slider_body_shape,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_name ELSE vodf_sfg_trx.slider_body_shape_name END as slider_body_shape_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_body_shape_short_name ELSE vodf_sfg_trx.slider_body_shape_short_name END as slider_body_shape_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link ELSE vodf_sfg_trx.slider_link END as slider_link,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_name ELSE vodf_sfg_trx.slider_link_name END as slider_link_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.slider_link_short_name ELSE vodf_sfg_trx.slider_link_short_name END as slider_link_short_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type ELSE vodf_sfg_trx.coloring_type END as coloring_type,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_name ELSE vodf_sfg_trx.coloring_type_name END as coloring_type_name,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.coloring_type_short_name ELSE vodf_sfg_trx.coloring_type_short_name END as coloring_type_short_name,
			stock.batch_quantity::float8,
			stock.swatch_approved_quantity::float8,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_info_uuid ELSE vodf_sfg_trx.order_info_uuid END as order_info_uuid,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_number ELSE vodf_sfg_trx.order_number END as order_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.item_description ELSE vodf_sfg_trx.item_description END as item_description,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			CASE WHEN transaction.sfg_uuid IS NULL THEN vodf.order_type ELSE vodf_sfg_trx.order_type END as order_type,
			stock.sa_prod::float8,
			stock.coloring_stock::float8,
			stock.coloring_prod::float8,
			st_given.trx_quantity::float8 as total_trx_quantity,
			(stock.sa_prod::float8 + transaction.trx_quantity::float8) as max_sa_quantity,
			(stock.coloring_prod::float8 + transaction.trx_quantity::float8) as max_coloring_quantity,
			(stock.trx_to_finishing::float8 + transaction.trx_quantity::float8) as max_trx_to_finishing_quantity,
			transaction.assembly_stock_uuid,
			assembly_stock.name as assembly_stock_name,
			assembly_stock.quantity::float8 as assembly_stock_quantity,
			assembly_stock.quantity::float8 + transaction.trx_quantity::float8 as max_assembly_stock_quantity
		FROM
			slider.transaction
		LEFT JOIN
			slider.stock ON transaction.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON transaction.created_by = users.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON zfb.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			(
				SELECT stock.uuid, SUM(trx_quantity)::float8 as trx_quantity
				FROM slider.transaction
				LEFT JOIN slider.stock ON transaction.stock_uuid = stock.uuid
				WHERE transaction.from_section = ${from_section}
				GROUP BY stock.uuid
			) as st_given ON transaction.stock_uuid = st_given.uuid
		LEFT JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
		LEFT JOIN zipper.sfg ON sfg.uuid = transaction.sfg_uuid
		LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
		LEFT JOIN zipper.v_order_details_full vodf_sfg_trx ON oe.order_description_uuid = vodf_sfg_trx.order_description_uuid
		WHERE 
			transaction.from_section = ${from_section}
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
