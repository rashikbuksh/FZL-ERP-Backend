import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
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
			pi_cash_quantity: decimalToNumber(pi_cash_entry.pi_cash_quantity),
			created_at: pi_cash_entry.created_at,
			updated_at: pi_cash_entry.updated_at,
			remarks: pi_cash_entry.remarks,
		})
		.from(pi_cash_entry)
		.orderBy(desc(pi_cash_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const pi_entryPromise = db
		.select({
			uuid: pi_cash_entry.uuid,
			pi_cash_uuid: pi_cash_entry.pi_cash_uuid,
			sfg_uuid: pi_cash_entry.sfg_uuid,
			thread_order_entry_uuid: pi_cash_entry.thread_order_entry_uuid,
			pi_cash_quantity: decimalToNumber(pi_cash_entry.pi_cash_quantity),
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
                    pe.pi_cash_uuid as pi_cash_uuid,
					pe.pi_cash_quantity::float8 as pi_cash_quantity,
					ROUND(pe.pi_cash_quantity / 12, 2)::float8 as pi_cash_quantity_dzn,
					pe.created_at as created_at,
	                pe.updated_at as updated_at,
					CASE WHEN pe.thread_order_entry_uuid IS NOT NULL THEN true ELSE false END as is_thread_order,
					sfg.uuid as sfg_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.order_info_uuid ELSE toe.order_info_uuid END as order_info_uuid,
					vodf.order_description_uuid as order_description_uuid,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.order_number ELSE concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END as order_number,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN vodf.buyer_name ELSE thread_buyer.name END as buyer_name,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.style ELSE toe.style END as style,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.color ELSE toe.color END as color,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.quantity::float8 ELSE toe.quantity::float8 END as quantity,
					vodf.item_description as item_description,
					ARRAY[
							vodf.nylon_stopper_name,
							vodf.teeth_color_name,
							vodf.puller_color_name,
							vodf.hand_name,
							vodf.coloring_type_name,
							vodf.slider_name,
							vodf.top_stopper_name,
							vodf.bottom_stopper_name,
							vodf.logo_type_name,
							vodf.slider_body_shape_name,
							vodf.end_user_name,
							vodf.light_preference_name,
							vodf.slider_link_name,
							vodf.teeth_type_name,
							vodf.description
						] as short_names,
					vodf.special_requirement,
					CONCAT(vodf.item_name, ' Zipper', '-', vodf.zipper_number_short_name, '-', vodf.end_type_short_name, '-', vodf.puller_type_short_name) as pi_item_description,
					vodf.is_inch,
					oe.size::float8,
					CASE
						WHEN vodf.is_inch = 1
							THEN 'Inch'
						WHEN vodf.order_type = 'tape'
							THEN 'Meter'
						ELSE 'CM'
					END as size_unit,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.quantity::float8 ELSE toe.quantity::float8 END as max_quantity,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN oe.party_price::float8 ELSE toe.party_price::float8 END as unit_price,
					CASE 
						WHEN pe.thread_order_entry_uuid IS NULL 
						THEN 
							CASE 
								WHEN vodf.order_type = 'tape' 
								THEN oe.party_price::float8 
								ELSE ROUND(oe.party_price/12,2)::float8 
							END
						ELSE toe.party_price::float8 
					END as unit_price_pcs,
					CASE WHEN pe.thread_order_entry_uuid IS NULL THEN sfg.pi::float8 ELSE toe.pi::float8 END as given_pi_cash_quantity,
					CASE 
						WHEN pe.thread_order_entry_uuid IS NULL 
						THEN 
							CASE 
								WHEN vodf.order_type = 'tape' 
								THEN oe.size::float8 * (oe.party_price::float8)::float8 
								ELSE ROUND(pe.pi_cash_quantity * oe.party_price/12, 2)::float8 
							END
						ELSE ROUND(pe.pi_cash_quantity * toe.party_price, 2)::float8 
					END as value,
					CASE 
						WHEN pe.thread_order_entry_uuid IS NULL 
						THEN 
							CASE 
								WHEN vodf.order_type = 'tape'
								THEN oe.size::float8 * (oe.party_price::float8)::float8
								ELSE ROUND(pe.pi_cash_quantity/12 * oe.party_price, 2)::float8
							END
						ELSE ROUND(pe.pi_cash_quantity * toe.party_price, 2)::float8 
					END as value_dzn,
					CASE 
						WHEN vodf.order_type = 'tape'
						THEN 'Meter'
						ELSE 'Dzn'
					END as price_unit,
					CASE 
						WHEN pe.thread_order_entry_uuid IS NULL 
						THEN (oe.quantity - sfg.pi)::float8 
						ELSE (toe.quantity - toe.pi)::float8 
					END as balance_quantity,
					pe.thread_order_entry_uuid as thread_order_entry_uuid,
					toe.count_length_uuid as count_length_uuid,
					CONCAT(count_length.count,' ', count_length.length) as count_length_name,
					count_length.count,
					count_length.length,
					CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked,
					vodf.order_type
	            FROM
					commercial.pi_cash_entry pe 
					LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
	                LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
	                LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
					LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                    LEFT JOIN public.buyer thread_buyer ON toi.buyer_uuid = thread_buyer.uuid
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

		const uuids = new Set();

		data?.rows?.forEach((row) => {
			if (JSON.parse(row?.special_requirement)) {
				try {
					const specialRequirement = JSON.parse(
						row?.special_requirement
					);

					// specialRequirement.values is still a string, so we need to parse it
					const nestedValuesObject = JSON.parse(
						specialRequirement?.values
					);

					// Extract the UUID from the nested values array
					const [uuid] = nestedValuesObject?.values;

					if (uuid) {
						uuids.add(uuid);
					}
				} catch (error) {}
			}
		});

		let s_short_name = [];
		const uuidArray = Array.from(uuids);

		const shortNameQuery = sql`
								SELECT
									pp.uuid,
									pp.short_name
								FROM public.properties as pp
								WHERE pp.uuid IN (${sql.join(uuidArray, sql`, `)})
								 `;

		try {
			const result = await db.execute(shortNameQuery);

			if (result.rows.length > 0) {
				s_short_name = result.rows.map((row) => row.short_name);
			} else {
				s_short_name = [];
			}
		} catch (error) {}

		const toast = {
			status: 200,
			type: 'select',
			message: 'pi_cash_entry By Pi Cash Uuid',
		};
		data.rows.forEach((row) => {
			if (Array.isArray(row.short_names)) {
				row.short_names = [...row.short_names, ...s_short_name];
			} else {
				row.short_names = [...s_short_name];
			}
		});

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiEntryByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	let { is_update } = req?.query;

	if (is_update == undefined && is_update == null) {
		is_update = 'false';
	}

	const query = sql`
        SELECT
            sfg.uuid as uuid,
            sfg.uuid as sfg_uuid,
            vod.order_info_uuid,
            vod.order_number as order_number,
            vod.item_description as item_description,
            oe.style as style,
            oe.color as color,
			oe.size,
			CASE 
				WHEN vod.is_inch = 1
					THEN 'Inch'
				WHEN vod.order_type = 'tape' 
					THEN 'Meter' 
				ELSE 'CM' 
			END as size_unit,
			vod.is_inch,
			vod.is_meter,
			vod.order_type,
            CASE 
                WHEN vod.is_inch = 1 THEN (oe.size::numeric * 2.54)::float8 
                ELSE 0
            END as size_inch,
            oe.quantity::float8 as quantity,
            sfg.pi::float8 as given_pi_cash_quantity,
            (oe.quantity - sfg.pi)::float8 as max_quantity,
            (oe.quantity - sfg.pi)::float8 as pi_cash_quantity,
            (oe.quantity - sfg.pi)::float8 as balance_quantity,
			oe.party_price::float8 as unit_price,
			CASE WHEN vod.order_type = 'tape' THEN oe.party_price::float8 ELSE oe.party_price/12::float8 END as unit_price_pcs,
			CASE 
				WHEN vod.order_type = 'tape'
				THEN 'Meter'
				ELSE 'Dzn'
			END as price_unit,
            CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked,
			false as is_thread_order
        FROM
            zipper.sfg sfg
            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN zipper.v_order_details vod ON oe.order_description_uuid = vod.order_description_uuid
			LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
        WHERE
            vod.order_info_uuid = ${req.params.order_info_uuid} AND (oe.quantity - sfg.pi) > 0 ${is_update == 'true' ? sql`AND pe.uuid IS NULL` : sql`AND TRUE`}
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

	let { is_update } = req?.query;

	if (is_update == undefined && is_update == null) {
		is_update = 'false';
	}

	const query = sql`
        SELECT
            toe.uuid as uuid,
            toe.uuid as thread_order_entry_uuid,
            toi.uuid as order_info_uuid,
            CONCAT('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) as order_number,
            toe.style as style,
            toe.color as color,
            toe.quantity::float8 as quantity,
            toe.pi::float8 as given_pi_cash_quantity,
            (toe.quantity - toe.pi)::float8 as max_quantity,
            (toe.quantity - toe.pi)::float8 as pi_cash_quantity,
            (toe.quantity - toe.pi)::float8 as balance_quantity,
			toe.party_price::float8 as unit_price,
            CASE WHEN pe.uuid IS NOT NULL THEN true ELSE false END as is_checked,
			true as is_thread_order
        FROM
            thread.order_entry toe
            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
			LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
        WHERE
            toe.order_info_uuid = ${req.params.order_info_uuid} AND (toe.quantity - toe.pi) > 0 ${is_update == 'true' ? sql`AND pe.uuid IS NULL` : sql`AND TRUE`}
        ORDER BY 
            toi.id ASC,
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

		let { is_update } = req?.query;

		if (is_update == undefined && is_update == null) {
			is_update = 'false';
		}

		if (order_info_uuids === 'null') {
			return res.status(400).json({ error: 'Order Number is required' });
		}

		order_info_uuids = order_info_uuids
			.split(',')
			.map(String)
			.map((String) => [String]);

		const fetchData = async (endpoint, data) => {
			try {
				const response = await api.get(
					`${endpoint}/${data}?${is_update == 'true' ? 'is_update=true' : 'is_update=false'}`
				);
				return response.data; // Ensure to return the data from the response
			} catch (error) {
				console.error(error);
				return null; // Return null or handle the error as needed
			}
		};

		const results = await Promise.all(
			order_info_uuids.flat().map((uuid) => {
				return Promise.all([
					fetchData('/commercial/pi-cash-entry/details/by', uuid),
					// fetchData(
					// 	'/commercial/pi-cash-entry/thread-details/by',
					// 	uuid
					// ),
				]);
			})
		);

		// Flatten the results array
		const flattenedResults = results;

		// Extract pi_cash_entry and pi_cash_entry_thread from flattenedResults
		const pi_cash_entry = flattenedResults.map((result) => result[0]);
		// const pi_cash_entry_thread = flattenedResults.map(
		// 	(result) => result[1]
		// );

		// Check if both pi_cash_entry and pi_cash_entry_thread are undefined
		// const allUndefined =
		// 	pi_cash_entry.every((entry) => entry === undefined) &&
		// 	pi_cash_entry_thread.every((entry) => entry === undefined);

		// if (allUndefined) {
		// 	throw new Error(
		// 		'Both pi_cash_entry and pi_cash_entry_thread are undefined'
		// 	);
		// }

		order_info_uuids = order_info_uuids.flat();

		const response = {
			party_uuid,
			marketing_uuid,
			order_info_uuids,
			pi_cash_entry: pi_cash_entry?.reduce((acc, result) => {
				return [...acc, ...(result?.data || [])];
			}, []),
			// pi_cash_entry_thread: pi_cash_entry_thread?.reduce(
			// 	(acc, result) => {
			// 		return [...acc, ...(result?.data || [])];
			// 	},
			// 	[]
			// ),
			// Other response properties
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

export async function selectPiEntryByPiDetailsByThreadOrderInfoUuids(
	req,
	res,
	next
) {
	try {
		const api = await createApi(req);
		let { order_info_uuids, party_uuid, marketing_uuid } = req?.params;

		let { is_update } = req?.query;

		if (is_update == undefined && is_update == null) {
			is_update = 'false';
		}

		if (order_info_uuids === 'null') {
			return res.status(400).json({ error: 'Order Number is required' });
		}

		order_info_uuids = order_info_uuids
			.split(',')
			.map(String)
			.map((String) => [String]);

		const fetchDataThread = async (endpoint) =>
			await api.get(
				`/commercial/pi-cash-entry/thread-details/by/${endpoint}?${is_update == 'true' ? 'is_update=true' : 'is_update=false'}`
			);

		const result2 = await Promise.all(
			order_info_uuids.flat().map((uuid) => fetchDataThread(uuid))
		);

		order_info_uuids = order_info_uuids.flat();

		const response = {
			party_uuid,
			marketing_uuid,
			order_info_uuids,
			pi_cash_entry_thread: result2?.reduce((acc, result) => {
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
