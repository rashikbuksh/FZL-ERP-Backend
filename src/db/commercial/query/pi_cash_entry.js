import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as zipperSchema from '../../zipper/schema.js';
import { pi_cash_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.insert(pi_cash_entry)
		.values(req.body)
		.returning({ insertId: pi_cash_entry.uuid });
	try {
		const data = await pi_entryPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piEntryPromise = db
		.update(pi_cash_entry)
		.set(req.body)
		.where(eq(pi_cash_entry.uuid, req.params.uuid))
		.returning({ updatedId: pi_cash_entry.uuid });

	try {
		const data = await piEntryPromise;
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

	const piEntryPromise = db
		.delete(pi_cash_entry)
		.where(eq(pi_cash_entry.uuid, req.params.uuid))
		.returning({ deletedId: pi_cash_entry.uuid });

	try {
		const data = await piEntryPromise;
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
			uuid: pi_cash_entry.uuid,
			pi_cash_uuid: pi_cash_entry.pi_cash_uuid,
			sfg_uuid: pi_cash_entry.sfg_uuid,
			thread_order_entry_uuid: pi_cash_entry.thread_order_entry_uuid,
			pi_cash_quantity: pi_cash_entry.pi_cash_quantity,
			created_at: pi_cash_entry.created_at,
			updated_at: pi_cash_entry.updated_at,
			remarks: pi_cash_entry.remarks,
		})
		.from(pi_cash_entry)
		.orderBy(desc(pi_cash_entry.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'pi_cash_entry list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.select({
			uuid: pi_cash_entry.uuid,
			pi_cash_uuid: pi_cash_entry.pi_cash_uuid,
			sfg_uuid: pi_cash_entry.sfg_uuid,
			thread_order_entry_uuid: pi_cash_entry.thread_order_entry_uuid,
			pi_cash_quantity: pi_cash_entry.pi_cash_quantity,
			created_at: pi_cash_entry.created_at,
			updated_at: pi_cash_entry.updated_at,
			remarks: pi_cash_entry.remarks,
		})
		.from(pi_cash_entry)
		.where(eq(pi_cash_entry.uuid, req.params.uuid));

	try {
		const data = await pi_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiEntryByPiUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const query = sql`
				SELECT
	                pe.uuid as uuid,
	                sfg.uuid as sfg_uuid,
	                vodf.order_info_uuid as order_info_uuid,
					vodf.order_description_uuid as order_description_uuid,
	                vodf.order_number as order_number,
					vodf.buyer_name as buyer_name,
	                oe.style as style,
	                oe.color as color,
	                oe.quantity as quantity,
	                vodf.item_description as item_description,
	                oe.size as size,
	                pe.pi_cash_quantity as pi_cash_quantity,
	                oe.quantity as max_quantity,
	                oe.party_price as unit_price,
					sfg.pi as given_pi_cash_quantity,
	                (pe.pi_cash_quantity * oe.party_price) as value,
	                (oe.quantity - sfg.pi) as balance_quantity,
	                pe.created_at as created_at,
	                pe.updated_at as updated_at,
					CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked
	            FROM
					zipper.sfg sfg
	                LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
	                LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
				WHERE 
					pe.pi_cash_uuid = ${req.params.pi_cash_uuid}
				ORDER BY
	                vodf.order_number ASC,
					vodf.item_description ASC,
					oe.style ASC,
					oe.color ASC,
					oe.size ASC `;

		const pi_entryPromise = db.execute(query);

		const data = await pi_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry By Pi Cash Uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiEntryByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
        SELECT
            sfg.uuid as uuid,
            sfg.uuid as sfg_uuid,
            vod.order_info_uuid,
            vod.order_number as order_number,
            vod.item_description as item_description,
            oe.style as style,
            oe.color as color,
            oe.size as size,
            oe.quantity as quantity,
            sfg.pi as given_pi_cash_quantity,
            (oe.quantity - sfg.pi) as max_quantity,
            (oe.quantity - sfg.pi) as pi_cash_quantity,
            (oe.quantity - sfg.pi) as balance_quantity,
            CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked
        FROM
            zipper.sfg sfg
            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
			LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
        WHERE
            vod.order_info_uuid = ${req.params.order_info_uuid}
        ORDER BY 
            vod.order_number ASC,
            vod.item_description ASC, 
            oe.style ASC, 
            oe.color ASC, 
            oe.size ASC
    `;

	const pi_entryPromise = db.execute(query);

	try {
		const data = await pi_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry By Order Info Uuid',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiEntryByPiDetailsByOrderInfoUuids(req, res, next) {
	try {
		const api = await createApi(req);
		let { order_info_uuids, party_uuid, marketing_uuid } = req?.params;

		if (order_info_uuids === 'null') {
			return res.status(400).json({ error: 'Order Number is required' });
		}

		order_info_uuids = order_info_uuids
			.split(',')
			.map(String)
			.map((String) => [String]);

		const fetchData = async (endpoint) =>
			await api.get(`/commercial/pi-cash-entry/details/by/${endpoint}`);

		const results = await Promise.all(
			order_info_uuids.flat().map((uuid) => fetchData(uuid))
		);

		order_info_uuids = order_info_uuids.flat();

		const response = {
			party_uuid,
			marketing_uuid,
			order_info_uuids,
			pi_cash_entry: results?.reduce((acc, result) => {
				return [...acc, ...result?.data?.data];
			}, []),
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Pi Details By Order Info Uuids',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		return res.status(500).json(error);
	}
}
