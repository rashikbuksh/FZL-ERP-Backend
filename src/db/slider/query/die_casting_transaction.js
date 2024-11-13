import { and, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { die_casting, die_casting_transaction } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingTransactionPromise = db
		.insert(die_casting_transaction)
		.values(req.body)
		.returning({ insertedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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

	const dieCastingTransactionPromise = db
		.update(die_casting_transaction)
		.set(req.body)
		.where(eq(die_casting_transaction.uuid, req.params.uuid))
		.returning({ updatedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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

	const dieCastingTransactionPromise = db
		.delete(die_casting_transaction)
		.where(eq(die_casting_transaction.uuid, req.params.uuid))
		.returning({ deletedId: die_casting_transaction.uuid });
	try {
		const data = await dieCastingTransactionPromise;
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
			dct.uuid as uuid,
			dc.name,
			dc.uuid as die_casting_uuid,
			dct.stock_uuid,
			concat(vod.order_number, ' - ', vod.item_description) as order_item_description,
			vod.order_info_uuid,
			vod.order_number,
			vod.order_description_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
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
			dc.slider_link,
			op_slider_link.name AS slider_link_name,
			op_slider_link.short_name AS slider_link_short_name,
			dct.trx_quantity::float8,
			dct.weight::float8,
			(dc.weight + dct.weight)::float8 as max_weight,
			dc.type,
			dct.created_by,
			u.name as created_by_name,
			dct.created_at,
			dct.updated_at,
			dct.remarks,
			(dc.quantity + dct.trx_quantity)::float8 as max_quantity
		FROM
			slider.die_casting_transaction dct
		LEFT JOIN
			slider.die_casting dc ON dct.die_casting_uuid = dc.uuid
		LEFT JOIN
			hr.users u ON dct.created_by = u.uuid
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
			public.properties op_slider_link ON dc.slider_link = op_slider_link.uuid
		LEFT JOIN 
			slider.stock ON dct.stock_uuid = stock.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON zfb.order_description_uuid = vod.order_description_uuid
		ORDER BY
			dct.created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'die_casting_transaction',
		};
		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT
			dct.uuid as uuid,
			dc.name,
			dc.uuid as die_casting_uuid,
			dct.stock_uuid,
			concat(vod.order_number, ' - ', vod.item_description) as order_item_description,
			vod.order_info_uuid,
			vod.order_number,
			vod.order_description_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
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
			dc.slider_link,
			op_slider_link.name AS slider_link_name,
			op_slider_link.short_name AS slider_link_short_name,
			dct.trx_quantity::float8,
			dct.weight::float8,
			(dc.weight + dct.weight)::float8 as max_weight,
			dc.type,
			dct.created_by,
			u.name as created_by_name,
			dct.created_at,
			dct.updated_at,
			dct.remarks,
			(dc.quantity + dct.trx_quantity)::float8 as max_quantity
		FROM
			slider.die_casting_transaction dct
		LEFT JOIN
			slider.die_casting dc ON dct.die_casting_uuid = dc.uuid
		LEFT JOIN
			hr.users u ON dct.created_by = u.uuid
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
			public.properties op_slider_link ON dc.slider_link = op_slider_link.uuid
		LEFT JOIN 
			slider.stock ON dct.stock_uuid = stock.uuid
		LEFT JOIN 
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON zfb.order_description_uuid = vod.order_description_uuid
		WHERE dct.uuid = ${req.params.uuid}
	`;

	const dieCastingTransactionPromise = db.execute(query);

	try {
		const data = await dieCastingTransactionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'die_casting_transaction by uuid',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDieCastingForSliderStockByOrderInfoUuid(
	req,
	res,
	next
) {
	const { order_info_uuid } = req.params;

	const fetchData = sql`
		SELECT 
			stock.uuid as stock_uuid,
			dc.uuid as die_casting_uuid,
			dc.quantity as die_casting_quantity,
			vod.order_number,
			vod.item_description,
			vod.order_info_uuid,
			zfb.uuid as finishing_batch_uuid,
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
			stock.item,
			item_properties.name as item_name,
			item_properties.short_name as item_short_name,
			stock.zipper_number,
			zipper_properties.name as zipper_number_name,
			zipper_properties.short_name as zipper_number_short_name,
			stock.end_type,
			end_type_properties.name as end_type_name,
			end_type_properties.short_name as end_type_short_name,
			stock.logo_type,
			logo_type_properties.name as logo_type_name,
			logo_type_properties.short_name as logo_type_short_name,
			stock.puller_type,
			puller_type_properties.name as puller_type_name,
			puller_type_properties.short_name as puller_type_short_name,
			stock.puller_color,
			puller_color_properties.name as puller_color_name,
			puller_color_properties.short_name as puller_color_short_name,
			stock.slider_body_shape,
			slider_body_shape_properties.name as slider_body_shape_name,
			slider_body_shape_properties.short_name as slider_body_shape_short_name,
			stock.slider_link,
			slider_slider_link_properties.name as slider_link_name,
			slider_slider_link_properties.short_name as slider_link_short_name,
			coalesce(stock.batch_quantity, 0)::float8 as batch_quantity,
			coalesce(stock.stock.swatch_approved_quantity::float8, 0) as swatch_approved_quantity,
			coalesce(die_casting_transaction_given.quantity,0)::float8 as provided_quantity,
			coalesce(stock.swatch_approved_quantity::float8,, 0)::float8 - coalesce(die_casting_transaction_given.quantity, 0)::float8 as balance_quantity
		FROM
			slider.stock stock
		LEFT JOIN
			public.properties item_properties ON stock.item = item_properties.uuid
		LEFT JOIN
			public.properties zipper_properties ON stock.zipper_number = zipper_properties.uuid
		LEFT JOIN
			public.properties end_type_properties ON stock.end_type = end_type_properties.uuid
		LEFT JOIN
			public.properties puller_type_properties ON stock.puller_type = puller_type_properties.uuid
		LEFT JOIN
			public.properties puller_color_properties ON stock.puller_color = puller_color_properties.uuid
		LEFT JOIN
			public.properties logo_type_properties ON stock.logo_type = logo_type_properties.uuid
		LEFT JOIN
			public.properties slider_body_shape_properties ON stock.slider_body_shape = slider_body_shape_properties.uuid
		LEFT JOIN
			public.properties slider_slider_link_properties ON stock.slider_link = slider_slider_link_properties.uuid
		LEFT JOIN
			zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON zfb.order_description_uuid = vod.order_description_uuid
		LEFT JOIN
			(
				SELECT
					stock.uuid as stock_uuid,
					SUM(dct.trx_quantity) as quantity
				FROM
					slider.die_casting_transaction dct
				LEFT JOIN
					slider.stock ON dct.stock_uuid =
					stock.uuid
				GROUP BY
					stock.uuid
			) die_casting_transaction_given ON stock.uuid = die_casting_transaction_given.stock_uuid
		LEFT JOIN 
			slider.die_casting dc ON (dc.item = stock.item AND
			dc.zipper_number = stock.zipper_number AND
			dc.end_type = stock.end_type AND
			dc.logo_type = stock.logo_type AND
			dc.puller_type = stock.puller_type AND
			dc.logo_type = stock.logo_type AND 
			dc.slider_body_shape = stock.slider_body_shape AND
			dc.slider_link = stock.slider_link)
		WHERE
			zfb.order_description_uuid = ${order_info_uuid}
		`;

	const results = db.execute(fetchData);
	try {
		const data = await results;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Die Casting For Slider Stock',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDieCastingForSliderStockByOrderInfoUuids(
	req,
	res,
	next
) {
	const { order_info_uuids } = req.params;
	const orderInfoUuidArray = order_info_uuids.split(',').map((uuid) => uuid);

	try {
		const api = await createApi(req);
		const fetchData = async (uuid) =>
			await api.get(`/slider/die-casting/for/slider-stock/${uuid}`);

		const data = await Promise.all(
			orderInfoUuidArray.map((uuid) => {
				return fetchData(uuid);
			})
		);

		const response = {
			stocks: data?.reduce((acc, result) => {
				return [...acc, ...result?.data?.data];
			}, []),
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Die Casting For Slider Stock',
		};
		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
