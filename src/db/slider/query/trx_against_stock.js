import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { die_casting, trx_against_stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(trx_against_stock)
		.values(req.body)
		.returning({ insertedId: trx_against_stock.uuid });

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
		.update(trx_against_stock)
		.set(req.body)
		.where(eq(trx_against_stock.uuid, req.params.uuid))
		.returning({ updatedId: trx_against_stock.uuid });

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
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(trx_against_stock)
		.where(eq(trx_against_stock.uuid, req.params.uuid))
		.returning({ deletedId: trx_against_stock.uuid });

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
			tas.uuid as uuid,
			dc.name,
			dc.uuid as die_casting_uuid,
			dc.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			dc.zipper_number,
			op_zipper.name AS zipper_number_name,
			op_zipper.short_name AS zipper_number_short_name,
			dc.end_type,
			op_end.name AS end_type_name,
			op_end.short_name AS end_type_short_name,
			dc.puller_type,
			op_puller.name AS puller_type_name,
			op_puller.short_name AS puller_type_short_name,
			dc.slider_body_shape,
			op_slider_body_shape.name AS slider_body_shape_name,
			op_slider_body_shape.short_name AS slider_body_shape_short_name,
			dc.puller_link,
			op_puller_link.name AS puller_link_name,
			op_puller_link.short_name AS puller_link_short_name,
			tas.quantity,
			tas.weight,
			(dc.weight + tas.weight) as max_weight,
			tas.created_by,
			u.name as created_by_name,
			tas.created_at,
			tas.updated_at,
			tas.remarks,
			(dc.quantity + tas.quantity) as max_quantity
		FROM
			slider.trx_against_stock tas
		LEFT JOIN
			slider.die_casting dc ON tas.die_casting_uuid = dc.uuid
		LEFT JOIN
			hr.users u ON tas.created_by = u.uuid
		LEFT JOIN
			public.properties op_item ON dc.item = op_item.uuid
		LEFT JOIN
			public.properties op_zipper ON dc.zipper_number = op_zipper.uuid
		LEFT JOIN
			public.properties op_end ON dc.end_type = op_end.uuid
		LEFT JOIN
			public.properties op_puller ON dc.puller_type = op_puller.uuid
		LEFT JOIN
			public.properties op_slider_body_shape ON dc.slider_body_shape = op_slider_body_shape.uuid
		LEFT JOIN
			public.properties op_puller_link ON dc.puller_link = op_puller_link.uuid
		ORDER BY
			tas.created_at DESC;
			`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `trx against stock list`,
		};
		return await res.status(201).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid } = req.params;

	const query = sql`
		SELECT
			tas.uuid as uuid,
			dc.name,
			dc.uuid as die_casting_uuid,
			dc.item,
			op_item.name as item_name,
			op_item.short_name as item_short_name,
			dc.zipper_number,
			op_zipper.name AS zipper_number_name,
			op_zipper.short_name AS zipper_number_short_name,
			dc.end_type,
			op_end.name AS end_type_name,
			op_end.short_name AS end_type_short_name,
			dc.puller_type,
			op_puller.name AS puller_type_name,
			op_puller.short_name AS puller_type_short_name,
			dc.slider_body_shape,
			op_slider_body_shape.name AS slider_body_shape_name,
			op_slider_body_shape.short_name AS slider_body_shape_short_name,
			dc.puller_link,
			op_puller_link.name AS puller_link_name,
			op_puller_link.short_name AS puller_link_short_name,
			tas.quantity,
			tas.weight,
			(dc.weight + tas.weight) as max_weight,
			tas.created_by,
			u.name as created_by_name,
			tas.created_at,
			tas.updated_at,
			tas.remarks,
			(dc.quantity + tas.quantity) as max_quantity
		FROM
			slider.trx_against_stock tas
		LEFT JOIN
			slider.die_casting dc ON tas.die_casting_uuid = dc.uuid
		LEFT JOIN
			hr.users u ON tas.created_by = u.uuid
		LEFT JOIN
			public.properties op_item ON dc.item = op_item.uuid
		LEFT JOIN
			public.properties op_zipper ON dc.zipper_number = op_zipper.uuid
		LEFT JOIN
			public.properties op_end ON dc.end_type = op_end.uuid
		LEFT JOIN
			public.properties op_puller ON dc.puller_type = op_puller.uuid
		LEFT JOIN
			public.properties op_slider_body_shape ON dc.slider_body_shape = op_slider_body_shape.uuid
		LEFT JOIN
			public.properties op_puller_link ON dc.puller_link = op_puller_link.uuid
		WHERE
			tas.uuid = ${uuid};
			`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'select',
			message: `trx against stock`,
		};
		return await res.status(201).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
