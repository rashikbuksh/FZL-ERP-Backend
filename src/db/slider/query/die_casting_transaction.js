import { and, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
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
			dct.trx_quantity,
			dct.type,
			dct.created_by,
			u.name as created_by_name,
			dct.created_at,
			dct.updated_at,
			dct.remarks
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
			public.properties op_puller_link ON dc.puller_link = op_puller_link.uuid
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
			dct.trx_quantity,
			dct.type,
			dct.created_by,
			u.name as created_by_name,
			dct.created_at,
			dct.updated_at,
			dct.remarks
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
			public.properties op_puller_link ON dc.puller_link = op_puller_link.uuid
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
			stock.order_info_uuid,
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
			stock.puller_link,
			slider_puller_link_properties.name as puller_link_name,
			slider_puller_link_properties.short_name as puller_link_short_name,
			coalesce(stock.order_quantity, 0) as order_quantity,
			coalesce(die_casting_transaction_given.quantity,0) as provided_quantity,
			coalesce(stock.order_quantity, 0) - coalesce(die_casting_transaction_given.quantity, 0) as balance_quantity
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
			public.properties slider_puller_link_properties ON stock.puller_link = slider_puller_link_properties.uuid
		LEFT JOIN 
			zipper.v_order_details vod ON stock.order_info_uuid = vod.order_info_uuid
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
			dc.puller_link = stock.puller_link)
		WHERE
			stock.order_info_uuid = ${order_info_uuid}
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

export async function insertDieCastingTransactionByOrder(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { is_body, is_cap, is_puller, is_link } = req.body;

	let dcUUIDisBody, dcUUIDisCap, dcUUIDisPuller, dcUUIDisLink;

	let dcUUIDisBody_data,
		dcUUIDisCap_data,
		dcUUIDisPuller_data,
		dcUUIDisLink_data;

	let dcUUIDisBody_toast,
		dcUUIDisCap_toast,
		dcUUIDisPuller_toast,
		dcUUIDisLink_toast;

	const {
		is_body_uuid,
		is_cap_uuid,
		is_link_uuid,
		is_puller_uuid,
		stock_uuid,
		trx_quantity,
		created_by,
		created_at,
		remarks,
	} = req.body;

	if (is_body_uuid) {
		const dieCastingPromise = db
			.select({
				uuid: die_casting.uuid,
			})
			.from(die_casting)
			.where(
				and(
					eq(die_casting.item, req.body.item),
					eq(die_casting.zipper_number, req.body.zipper_number),
					eq(die_casting.end_type, req.body.end_type),
					eq(die_casting.logo_type, req.body.logo_type),
					eq(die_casting.puller_type, req.body.puller_type),
					eq(
						die_casting.slider_body_shape,
						req.body.slider_body_shape
					),
					eq(die_casting.puller_link, req.body.puller_link)
				)
			);
		dcUUIDisBody = await dieCastingPromise;

		if (dcUUIDisBody.length !== 0) {
			const dieCastingTransactionPromise = db
				.insert(die_casting_transaction)
				.values({
					uuid: is_body_uuid,
					die_casting_uuid: dcUUIDisBody[0].uuid,
					stock_uuid: stock_uuid,
					trx_quantity: trx_quantity,
					type: 'body',
					created_by: created_by,
					created_at: created_at,
					remarks: remarks,
				})
				.returning({ insertedId: die_casting_transaction.uuid });
			try {
				dcUUIDisBody_data = await dieCastingTransactionPromise;

				dcUUIDisBody_toast = {
					status: 201,
					type: 'insert',
					message: `${dcUUIDisBody_data[0].insertedId} inserted`,
				};
			} catch (error) {
				await handleError({ error, res });
			}
		}
	}

	if (is_cap_uuid) {
		const dieCastingPromise = db
			.select({
				uuid: die_casting.uuid,
			})
			.from(die_casting)
			.where(
				and(
					eq(die_casting.item, req.body.item),
					eq(die_casting.zipper_number, req.body.zipper_number),
					eq(die_casting.end_type, req.body.end_type),
					eq(die_casting.logo_type, req.body.logo_type),
					eq(die_casting.puller_type, req.body.puller_type),
					eq(
						die_casting.slider_body_shape,
						req.body.slider_body_shape
					),
					eq(die_casting.puller_link, req.body.puller_link)
				)
			);
		dcUUIDisCap = await dieCastingPromise;

		if (dcUUIDisCap.length !== 0) {
			const dieCastingTransactionPromise = db
				.insert(die_casting_transaction)
				.values({
					uuid: is_cap_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: stock_uuid,
					trx_quantity: trx_quantity,
					type: 'cap',
					created_by: created_by,
					created_at: created_at,
					remarks: remarks,
				})
				.returning({ insertedId: die_casting_transaction.uuid });
			try {
				dcUUIDisCap_data = await dieCastingTransactionPromise;
				dcUUIDisCap_toast = {
					status: 201,
					type: 'insert',
					message: `${dcUUIDisCap_data[0].insertedId} inserted`,
				};
			} catch (error) {
				await handleError({ error, res });
			}
		}
	}

	if (is_puller_uuid) {
		const dieCastingPromise = db
			.select({
				uuid: die_casting.uuid,
			})
			.from(die_casting)
			.where(
				and(
					eq(die_casting.item, req.body.item),
					eq(die_casting.zipper_number, req.body.zipper_number),
					eq(die_casting.end_type, req.body.end_type),
					eq(die_casting.logo_type, req.body.logo_type),
					eq(die_casting.puller_type, req.body.puller_type),
					eq(
						die_casting.slider_body_shape,
						req.body.slider_body_shape
					),
					eq(die_casting.puller_link, req.body.puller_link)
				)
			);
		dcUUIDisPuller = await dieCastingPromise;

		if (dcUUIDisPuller.length !== 0) {
			const dieCastingTransactionPromise = db
				.insert(die_casting_transaction)
				.values({
					uuid: is_puller_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: stock_uuid,
					trx_quantity: trx_quantity,
					type: 'puller',
					created_by: created_by,
					created_at: created_at,
					remarks: remarks,
				})
				.returning({ insertedId: die_casting_transaction.uuid });
			try {
				dcUUIDisPuller_data = await dieCastingTransactionPromise;
				dcUUIDisPuller_toast = {
					status: 201,
					type: 'insert',
					message: `${dcUUIDisPuller_data[0].insertedId} inserted`,
				};
			} catch (error) {
				await handleError({ error, res });
			}
		}
	}

	if (is_link_uuid) {
		const dieCastingPromise = db
			.select({
				uuid: die_casting.uuid,
			})
			.from(die_casting)
			.where(
				and(
					eq(die_casting.item, req.body.item),
					eq(die_casting.zipper_number, req.body.zipper_number),
					eq(die_casting.end_type, req.body.end_type),
					eq(die_casting.logo_type, req.body.logo_type),
					eq(die_casting.puller_type, req.body.puller_type),
					eq(
						die_casting.slider_body_shape,
						req.body.slider_body_shape
					),
					eq(die_casting.puller_link, req.body.puller_link)
				)
			);
		dcUUIDisLink = await dieCastingPromise;

		if (dcUUIDisLink.length !== 0) {
			const dieCastingTransactionPromise = db
				.insert(die_casting_transaction)
				.values({
					uuid: is_link_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: stock_uuid,
					trx_quantity: trx_quantity,
					type: 'link',
					created_by: created_by,
					created_at: created_at,
					remarks: remarks,
				})
				.returning({ insertedId: die_casting_transaction.uuid });
			try {
				dcUUIDisLink_data = await dieCastingTransactionPromise;
				dcUUIDisLink_toast = {
					status: 201,
					type: 'insert',
					message: `${dcUUIDisLink_data[0].insertedId} inserted`,
				};
			} catch (error) {
				await handleError({ error, res });
			}
		}
	}

	const data = {
		dcUUIDisBody_data,
		dcUUIDisCap_data,
		dcUUIDisPuller_data,
		dcUUIDisLink_data,
	};

	const toast = {
		status: 201,
		type: 'insert',
		message: 'Die Casting Transaction By Order',
	};

	console.log('toast', toast, 'data', data);

	res.status(201).json({ toast, data });
}
