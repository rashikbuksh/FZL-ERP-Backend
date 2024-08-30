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
	const resultPromise = db
		.select({
			uuid: die_casting_transaction.uuid,
			die_casting_uuid: die_casting_transaction.die_casting_uuid,
			die_casting_name: die_casting.name,
			stock_uuid: die_casting_transaction.stock_uuid,
			trx_quantity: die_casting_transaction.trx_quantity,
			created_by: die_casting_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_transaction.created_at,
			updated_at: die_casting_transaction.updated_at,
			remarks: die_casting_transaction.remarks,
		})
		.from(die_casting_transaction)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_transaction.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_transaction.created_by)
		);
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'die_casting_transaction list,',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingTransactionPromise = db
		.select({
			uuid: die_casting_transaction.uuid,
			die_casting_uuid: die_casting_transaction.die_casting_uuid,
			die_casting_name: die_casting.name,
			stock_uuid: die_casting_transaction.stock_uuid,
			trx_quantity: die_casting_transaction.trx_quantity,
			created_by: die_casting_transaction.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting_transaction.created_at,
			updated_at: die_casting_transaction.updated_at,
			remarks: die_casting_transaction.remarks,
		})
		.from(die_casting_transaction)
		.leftJoin(
			die_casting,
			eq(die_casting.uuid, die_casting_transaction.die_casting_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, die_casting_transaction.created_by)
		)
		.where(eq(die_casting_transaction.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'die_casting_transaction',
	};

	handleResponse({
		promise: dieCastingTransactionPromise,
		res,
		next,
		...toast,
	});
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

	console.log('req.body', req.body);

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

	if (is_body) {
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

		console.log('dcUUIDisBody', dcUUIDisBody);

		if (dcUUIDisBody.length !== 0) {
			const dieCastingTransactionPromise = db
				.insert(die_casting_transaction)
				.values({
					uuid: req.body.is_body_uuid,
					die_casting_uuid: dcUUIDisBody[0].uuid,
					stock_uuid: req.body.stock_uuid,
					trx_quantity: req.body.trx_quantity,
					created_by: req.body.created_by,
					remarks: req.body.remarks,
				})
				.returning({ insertedId: die_casting_transaction.uuid });
			try {
				dcUUIDisBody_data = await dieCastingTransactionPromise;

				console.log('dcUUIDisBody_data in body', dcUUIDisBody_data);

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

	if (is_cap) {
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
					uuid: req.body.is_cap_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: req.body.stock_uuid,
					trx_quantity: req.body.trx_quantity,
					created_by: req.body.created_by,
					remarks: req.body.remarks,
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

	if (is_puller) {
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
					uuid: req.body.is_puller_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: req.body.stock_uuid,
					trx_quantity: req.body.trx_quantity,
					created_by: req.body.created_by,
					remarks: req.body.remarks,
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

	if (is_link) {
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
					uuid: req.body.is_link_uuid,
					die_casting_uuid: dcUUIDisCap[0].uuid,
					stock_uuid: req.body.stock_uuid,
					trx_quantity: req.body.trx_quantity,
					created_by: req.body.created_by,
					remarks: req.body.remarks,
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
		message:
			dcUUIDisBody_toast.message +
			' - ' +
			dcUUIDisCap_toast.message +
			' - ' +
			dcUUIDisPuller_toast.message +
			' - ' +
			dcUUIDisLink_toast.message,
	};

	res.status(201).json({ toast, data });
}
