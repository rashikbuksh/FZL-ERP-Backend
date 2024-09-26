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
					pe.pi_cash_quantity as pi_cash_quantity,
					pe.created_at as created_at,
	                pe.updated_at as updated_at,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN true ELSE false END as is_thread_order,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN sfg.uuid ELSE NULL END as sfg_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.order_info_uuid ELSE NULL END as order_info_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.order_description_uuid ELSE NULL END as order_description_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.order_number ELSE NULL END as order_number,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.buyer_name ELSE NULL END as buyer_name,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.style ELSE NULL END as style,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.color ELSE NULL END as color,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.quantity ELSE NULL END as quantity,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.item_description ELSE NULL END as item_description,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.size ELSE NULL END as size,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.quantity ELSE NULL END as max_quantity,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.party_price ELSE NULL END as unit_price,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN sfg.pi ELSE NULL END as given_pi_cash_quantity,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN (pe.pi_cash_quantity * oe.party_price) ELSE NULL END as value,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN (oe.quantity - sfg.pi) ELSE NULL END as balance_quantity,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN pe.thread_order_entry_uuid ELSE NULL END as thread_order_entry_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) ELSE NULL END as thread_order_number,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN toe.color ELSE NULL END as toe_color,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN toe.style ELSE NULL END as toe_style,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN toe.count_length_uuid ELSE NULL END as count_length_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN CONCAT(count_length.count,' ', count_length.) ELSE NULL END as count_length_name,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN toe.pi ELSE NULL END as given_pi_cash_quantity_thread,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN (pe.pi_cash_quantity * toe.party_price) ELSE NULL END as value_thread,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN (oe.quantity - toe.pi) ELSE NULL END as balance_quantity_thread,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN toe.quantity ELSE NULL END as thread_max_quantity,
					CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked
	            FROM
					zipper.sfg sfg
	                LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
	                LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
					LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.order_info toi ON vodf.order_info_uuid = toi.uuid
					LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
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
            CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked,
			false as is_thread_order
        FROM
            zipper.sfg sfg
            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
			LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
        WHERE
            vod.order_info_uuid = ${req.params.order_info_uuid} AND (oe.quantity - sfg.pi) > 0
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

export async function selectPiEntryByThreadOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
        SELECT
            toe.uuid as uuid,
            toe.uuid as thread_order_entry_uuid,
            toi.uuid as order_info_uuid,
            CONCAT('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
            toe.style as style,
            toe.color as color,
            toe.quantity as quantity,
            toe.pi as given_pi_cash_quantity,
            (toe.quantity - toe.pi) as max_quantity,
            (toe.quantity - toe.pi) as pi_cash_quantity,
            (toe.quantity - toe.pi) as balance_quantity,
            CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked,
			true as is_thread_order
        FROM
            thread.order_entry toe
            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
			LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
        WHERE
            toe.order_info_uuid = ${req.params.order_info_uuid} AND (toe.quantity - toe.pi) > 0
        ORDER BY 
            toe.id ASC,
            toe.style ASC, 
            toe.color ASC
    `;

	const pi_entryPromise = db.execute(query);

	try {
		const data = await pi_entryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry By thread Order Info Uuid',
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

		const fetchData = async (endpoint) => {
			await api.get(`/commercial/pi-cash-entry/details/by/${endpoint}`);
			await api.get(`/commercial/pi-cash-entry/thread-details/by/${endpoint}`);
		};

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
