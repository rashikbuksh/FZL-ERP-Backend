import { eq, sql } from 'drizzle-orm';
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

	const orderInfoUuidArray = order_info_uuid
		.split(',')
		.map((uuid) => `'${uuid}'`)
		.join(',');

	const query = sql`
		SELECT 
			stock.uuid as stock_uuid,
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
		WHERE
			stock.order_info_uuid IN (${orderInfoUuidArray})
		ORDER BY
			stock.created_at DESC
	`;

	console.log(query.queryChunks, 'query');

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

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
