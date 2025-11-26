import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { lc } from '../schema.js';
import { GetMarketingOwnUUID } from '../../variables.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.insert(lc)
		.values(req.body)
		.returning({ insertedId: lc.lc_number });
	try {
		const data = await lcPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.update(lc)
		.set(req.body)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ updatedId: lc.lc_number });
	try {
		const data = await lcPromise;
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

	const lcPromise = db
		.delete(lc)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ deletedId: lc.lc_number });
	try {
		const data = await lcPromise;
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
	const { own_uuid } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
		WITH
            lc_entry_agg AS (
                SELECT lc_uuid, JSONB_AGG(
                        JSONB_BUILD_OBJECT(
                            'payment_date', payment_date, 'ldbc_fdbc', ldbc_fdbc, 'acceptance_date', acceptance_date, 'maturity_date', maturity_date, 'handover_date', handover_date, 'receive_date', receive_date, 'document_submission_date', document_submission_date, 'bank_forward_date', bank_forward_date, 'document_receive_date', document_receive_date, 'payment_value', payment_value, 'amount', amount
                        )
                    ) AS lc_entry
                FROM commercial.lc_entry
                GROUP BY lc_uuid
            ),

            -- precompute pi-cash derived money value per LC
            pi_cash_value AS (
                SELECT
                    pi_cash.lc_uuid,
                    COALESCE(SUM(
                        CASE
                            WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type = 'tape'
                                THEN coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price,0)
                            WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type != 'tape'
                                THEN coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price,0) / 12
                            ELSE coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(toe.party_price,0)
                        END
                    ), 0)::float8 AS pi_cash_value
                FROM commercial.pi_cash
                LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
                LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                GROUP BY pi_cash.lc_uuid
            ),

            -- aggregated pi/manual pi identifiers
            pi_ids_agg AS (
                SELECT
                    lc.uuid AS lc_uuid,
                    array_remove(
                        (array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at,'YY'), '-', pi_cash.id::text)) FILTER (WHERE pi_cash.uuid IS NOT NULL)),
                        NULL
                    ) AS pi_ids,
                    array_remove(
                        (array_agg(DISTINCT manual_pi.pi_number) FILTER (WHERE manual_pi.uuid IS NOT NULL)),
                        NULL
                    ) AS manual_pi_ids
                FROM commercial.lc lc
                LEFT JOIN commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
                LEFT JOIN commercial.manual_pi ON lc.uuid = manual_pi.lc_uuid
                GROUP BY lc.uuid
            ),

            -- aggregated v_pi_cash orders (zipper/thread)
            vpc_agg AS (
                SELECT
                    pi_cash.lc_uuid,
                    COALESCE(jsonb_agg(DISTINCT vpc.order_numbers) FILTER (WHERE vpc.order_numbers IS NOT NULL), '[]') AS zipper_orders,
                    COALESCE(jsonb_agg(DISTINCT vpc.thread_order_numbers) FILTER (WHERE vpc.thread_order_numbers IS NOT NULL), '[]') AS thread_orders
                FROM commercial.pi_cash
                LEFT JOIN commercial.v_pi_cash vpc ON vpc.pi_cash_uuid = pi_cash.uuid
                GROUP BY pi_cash.lc_uuid
            ),

            -- marketing & bank names from pi_cash
            pi_meta_agg AS (
                SELECT
                    pi_cash.lc_uuid,
                    array_remove(
                        (array_agg(DISTINCT marketing.name) FILTER (WHERE marketing.name IS NOT NULL)),
                        NULL
                    ) AS marketing_names,
                    array_remove(
                        (array_agg(DISTINCT bank.name) FILTER (WHERE bank.name IS NOT NULL)),
                        NULL
                    ) AS bank_names
                FROM commercial.pi_cash
                LEFT JOIN public.marketing ON pi_cash.marketing_uuid = marketing.uuid
                LEFT JOIN commercial.bank ON pi_cash.bank_uuid = bank.uuid
                GROUP BY pi_cash.lc_uuid
            ),

            -- manual pi marketing & bank
            manual_meta_agg AS (
                SELECT
                    manual_pi.lc_uuid,
                    array_remove(
                        (array_agg(DISTINCT manual_marketing.name) FILTER (WHERE manual_marketing.name IS NOT NULL)),
                        NULL
                    ) AS manual_marketing_names,
                    array_remove(
                        (array_agg(DISTINCT manual_bank.name) FILTER (WHERE manual_bank.name IS NOT NULL)),
                        NULL
                    ) AS manual_bank_names
                FROM commercial.manual_pi
                LEFT JOIN public.marketing manual_marketing ON manual_pi.marketing_uuid = manual_marketing.uuid
                LEFT JOIN commercial.bank manual_bank ON manual_pi.bank_uuid = manual_bank.uuid
                GROUP BY manual_pi.lc_uuid
            ),

            -- manual pi summed value (existing logic)
            manual_pi_values AS (
                SELECT 
                    manual_pi.lc_uuid,
                    SUM(
                        CASE
                            WHEN manual_pi_entry.is_zipper = true THEN manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8 / 12
                            WHEN manual_pi_entry.is_zipper = false THEN manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8
                            ELSE 0
                        END
                    ) AS manual_pi_value
                FROM commercial.manual_pi_entry
                LEFT JOIN commercial.manual_pi ON manual_pi_entry.manual_pi_uuid = manual_pi.uuid
                WHERE manual_pi.lc_uuid IS NOT NULL
                GROUP BY manual_pi.lc_uuid
            )

        SELECT
            lc.uuid,
            lc.party_uuid,
            -- prefer pi_ids from pi_cash/manual_pi; fallback to lc.pi_number if none exist
            COALESCE(pi_ids_agg.pi_ids, ARRAY[lc.pi_number]) AS pi_ids,
            -- zipper orders only meaningful for non-old pi
            CASE WHEN lc.is_old_pi = 0 THEN COALESCE(vpc_agg.zipper_orders, '[]') END AS zipper,
            COALESCE(vpc_agg.thread_orders, '[]') AS thread,
            party.name AS party_name,
            -- prefer manual marketing names when is_old_pi = 1, else use pi meta
            COALESCE(manual_meta_agg.manual_marketing_names, pi_meta_agg.marketing_names, ARRAY[]::text[]) AS marketing_name,
            COALESCE(manual_meta_agg.manual_bank_names, pi_meta_agg.bank_names, ARRAY[]::text[]) AS bank_name,
            -- total_value using precomputed pi_cash_value or manual_pi_values or lc value
            CASE
                WHEN lc.is_old_pi = 0 THEN COALESCE(pi_cash_value.pi_cash_value, 0)
                WHEN manual_pi_values.manual_pi_value IS NOT NULL AND manual_pi_values.manual_pi_value::float8 > 0 THEN manual_pi_values.manual_pi_value::float8
                ELSE lc.lc_value::float8
            END AS total_value,
            concat('LC', to_char(lc.created_at, 'YY'), '-', lc.id::text) as file_number,
            CONCAT('_', lc.lc_number) as lc_number,
            lc.lc_date,
            lc.commercial_executive,
            lc.party_bank,
            lc.production_complete,
            lc.expiry_date,
            lc.at_sight,
            lc.amd_date,
            lc.amd_count,
            lc.problematical,
            lc.epz,
            lc.is_rtgs,
            lc.is_old_pi,
            lc.lc_cancel,
            lc.shipment_date,
            lc.pi_number,
            lc.lc_value::float8,
            lc.export_lc_number,
            lc.export_lc_date,
            lc.export_lc_expire_date,
            lc.up_date,
            lc.up_number,
            lc.created_by,
            users.name AS created_by_name,
            lc.created_at,
            lc.updated_at,
            lc.remarks,
            COALESCE(lc_entry_agg.lc_entry, '[]') AS lc_entry
        FROM commercial.lc lc
        LEFT JOIN lc_entry_agg ON lc.uuid = lc_entry_agg.lc_uuid
        LEFT JOIN hr.users ON lc.created_by = users.uuid
        LEFT JOIN public.party ON lc.party_uuid = party.uuid
        LEFT JOIN pi_ids_agg ON lc.uuid = pi_ids_agg.lc_uuid
        LEFT JOIN vpc_agg ON lc.uuid = vpc_agg.lc_uuid
        LEFT JOIN pi_cash_value ON lc.uuid = pi_cash_value.lc_uuid
        LEFT JOIN pi_meta_agg ON lc.uuid = pi_meta_agg.lc_uuid
        LEFT JOIN manual_meta_agg ON lc.uuid = manual_meta_agg.lc_uuid
        LEFT JOIN manual_pi_values ON lc.uuid = manual_pi_values.lc_uuid
        WHERE ${own_uuid == null ? sql`TRUE` : sql`EXISTS (SELECT 1 FROM commercial.pi_cash pc WHERE pc.lc_uuid = lc.uuid AND pc.marketing_uuid = ${marketingUuid})`}
        ORDER BY lc.created_at DESC
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// flatten arrays if needed (keep old behavior)
		data.rows.forEach((row) => {
			row.zipper = row.zipper ? row.zipper : [];
			row.thread = row.thread ? row.thread : [];
			// ensure pi_ids is an array
			row.pi_ids = Array.isArray(row.pi_ids) ? row.pi_ids : [row.pi_ids];
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'lc list',
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
			lc.uuid,
			lc.party_uuid,
			array_agg(
				CASE WHEN pi_cash.uuid IS NOT NULL 
					THEN concat(
						'PI',
						to_char(pi_cash.created_at, 'YY'),
						'-',
						pi_cash.id::text
					) 
				WHEN manual_pi.uuid IS NOT NULL
					THEN manual_pi.pi_number
				ELSE lc.pi_number 
				END
			) as pi_ids,
			party.name AS party_name,
			CASE
				WHEN is_old_pi = 0 THEN (
					SELECT SUM(
							CASE
								WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type = 'tape' THEN coalesce(
									pi_cash_entry.pi_cash_quantity, 0
								) * coalesce(order_entry.party_price, 0)
								WHEN pi_cash_entry.thread_order_entry_uuid IS NULL AND vodf.order_type != 'tape' THEN coalesce(
									pi_cash_entry.pi_cash_quantity, 0
								) * coalesce(order_entry.party_price, 0) / 12
								ELSE coalesce(
									pi_cash_entry.pi_cash_quantity, 0
								) * coalesce(toe.party_price, 0)
							END
						)
					FROM commercial.pi_cash
						LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
						LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
						LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
						LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
					WHERE
						pi_cash.lc_uuid = lc.uuid
				)
				WHEN manual_pi_values.manual_pi_value > 0 THEN manual_pi_values.manual_pi_value
				ELSE lc.lc_value::float8
			END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', lc.id::text
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.expiry_date,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
			lc.is_rtgs,
			lc.is_old_pi,
			lc.lc_cancel,
			lc.shipment_date,
			lc.pi_number,
			lc.lc_value::float8,
			lc.export_lc_number,
			lc.export_lc_date,
			lc.export_lc_expire_date,
			lc.up_date,
			lc.up_number,
			lc.created_by,
			users.name AS created_by_name,
			lc.created_at,
			lc.updated_at,
			lc.remarks
		FROM
			commercial.lc
		LEFT JOIN
			hr.users ON lc.created_by = users.uuid
		LEFT JOIN
			public.party ON lc.party_uuid = party.uuid
		LEFT JOIN
			commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
		LEFT JOIN commercial.manual_pi ON lc.uuid = manual_pi.lc_uuid
		LEFT JOIN commercial.bank manual_bank ON manual_pi.bank_uuid = manual_bank.uuid
		LEFT JOIN public.marketing manual_marketing ON manual_pi.marketing_uuid = manual_marketing.uuid
		LEFT JOIN (
			SELECT 
				manual_pi.lc_uuid,
				SUM(manual_pi_entry.quantity * manual_pi_entry.unit_price / 12) AS manual_pi_value
			FROM commercial.manual_pi_entry
			LEFT JOIN commercial.manual_pi ON manual_pi_entry.manual_pi_uuid = manual_pi.uuid
			WHERE manual_pi.lc_uuid IS NOT NULL
			GROUP BY 
				manual_pi.lc_uuid
		) manual_pi_values ON manual_pi_values.lc_uuid = lc.uuid
		WHERE lc.uuid = ${req.params.uuid}
		GROUP BY lc.uuid, party.name, users.name, manual_pi_values.manual_pi_value`;

	const lcPromise = db.execute(query);

	try {
		const data = await lcPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcPiByLcUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const api = await createApi(req);

		const { lc_uuid } = req.params;

		const fetchData = async (endpoint) =>
			await api.get(`/commercial/${endpoint}/${lc_uuid}`);

		const [lc, lc_entry, lc_entry_others, pi_cash, manual_pi] =
			await Promise.all([
				fetchData('lc'),
				fetchData('lc-entry/by'),
				fetchData('lc-entry-others/by'),
				fetchData('pi-cash-lc'),
				fetchData('manual-pi/by/lc-uuid'),
			]);

		const response = {
			...lc?.data?.data,
			lc_entry: lc_entry?.data?.data || [],
			lc_entry_others: lc_entry_others?.data?.data || [],
			pi: pi_cash.data.data || [],
			manual_pi: manual_pi?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'lc',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLcByLcNumber(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { lc_number } = req.params;
	const query = sql`
		SELECT
			lc.uuid,
			lc.party_uuid,
			array_agg(
			CASE WHEN is_old_pi = 0 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) ELSE lc.pi_number END
			) as pi_cash_ids,
			party.name AS party_name,
			CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(
						CASE 
							WHEN pi_cash_entry.thread_order_entry_uuid IS NULL 
							THEN coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price,0)/12 
							ELSE coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(toe.party_price,0) 
						END
					)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value,
			concat(
			'LC', to_char(lc.created_at, 'YY'), '-', lc.id::text
			) as file_number,
			lc.lc_number,
			lc.lc_date,
			lc.commercial_executive,
			lc.party_bank,
			lc.production_complete,
			lc.lc_cancel,
			lc.shipment_date,
			lc.expiry_date,
			lc.at_sight,
			lc.amd_date,
			lc.amd_count,
			lc.problematical,
			lc.epz,
			lc.is_rtgs,
			lc.is_old_pi,
			lc.pi_number,
			lc.lc_value::float8,
			lc.created_by,
			users.name AS created_by_name,
			lc.created_at,
			lc.updated_at,
			lc.remarks,
			lc.export_lc_number,
			lc.export_lc_date,
			lc.export_lc_expire_date,
			lc.up_date,
			lc.up_number
		FROM
			commercial.lc
		LEFT JOIN
			hr.users ON lc.created_by = users.uuid
		LEFT JOIN
			public.party ON lc.party_uuid = party.uuid
		LEFT JOIN
			commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
		WHERE lc.lc_number = ${req.params.lc_number}
		GROUP BY lc.uuid, party.name, users.name`;

	try {
		const data = await db.execute(query);
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api.get(`/commercial/${endpoint}/${lc_number}`);

		const [lc_entry, lc_entry_others] = await Promise.all([
			fetchData('lc-entry/by/lc-number'),
			fetchData('lc-entry-others/by/lc-number'),
		]);

		const response = {
			...data?.rows[0],
			lc_entry: lc_entry?.data?.data || [],
			lc_entry_others: lc_entry_others?.data?.data || [],
		};
		const toast = {
			status: 200,
			type: 'select',
			message: 'lc by lc number',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
