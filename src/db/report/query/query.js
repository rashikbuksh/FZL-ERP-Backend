import { and, eq, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

// * Zipper Production Status Report

// multiple rows shows for stock.uuid, assembly_production_quantity,coloring_production_quantity, teeth_molding_quantity,teeth_coloring_quantity,finishing_quantity columns
export async function zipperProductionStatusReport(req, res, next) {
	const { status } = req.query;
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
            SELECT 
                vodf.order_info_uuid,
                vodf.order_number,
                vodf.created_at AS order_created_at,
                vodf.order_description_updated_at as order_description_updated_at,
                vodf.marketing_uuid,
                vodf.marketing_name,
                vodf.party_uuid,
                vodf.party_name,
                vodf.is_cash,
                vodf.is_bill,
                vodf.is_sample,
                vodf.order_description_uuid,
                vodf.order_type,
                vodf.item_description,
                ARRAY_AGG(DISTINCT oe.color) AS colors,
                CONCAT(swatch_approval_counts.swatch_approval_count, ' / ',
				order_entry_counts.order_entry_count) AS swatch_approval_count,
                ARRAY_AGG(DISTINCT oe.style) AS styles,
                CONCAT(MIN(CASE 
                    WHEN vodf.is_inch = 1 
                        THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                    ELSE CAST(oe.size AS NUMERIC)
                END), ' - ', 
                MAX(CASE 
                    WHEN vodf.is_inch = 1 
                        THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                    ELSE CAST(oe.size AS NUMERIC)
                END)) AS sizes,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity)::float8 AS total_quantity,
                COALESCE(production_sum.assembly_production_quantity, 0)::float8 AS assembly_production_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0)::float8 AS coloring_production_quantity,
                COALESCE(tape_coil_to_dyeing_sum.total_tape_coil_to_dyeing_quantity, 0)::float8 AS total_tape_coil_to_dyeing_quantity,
                (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) + COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0))::float8 AS total_dyeing_transaction_quantity,
                COALESCE(sfg_production_sum.teeth_molding_quantity, 0)::float8 AS teeth_molding_quantity,
                CASE WHEN lower(vodf.item_name) = 'vislon' THEN 'KG' ELSE 'PCS' END AS teeth_molding_unit,
                COALESCE(sfg_production_sum.teeth_coloring_quantity, 0)::float8 AS teeth_coloring_quantity,
                COALESCE(sfg_production_sum.finishing_quantity, 0)::float8 AS finishing_quantity,
                COALESCE(packing_list_sum.total_packing_list_quantity, 0)::float8 AS total_packing_list_quantity,
                COALESCE(delivery_sum.total_delivery_delivered_quantity, 0)::float8 AS total_delivery_delivered_quantity,
                COALESCE(delivery_sum.total_delivery_balance_quantity, 0)::float8 AS total_delivery_balance_quantity,
                COALESCE(delivery_sum.total_short_quantity, 0)::float8 AS total_short_quantity,
                COALESCE(delivery_sum.total_reject_quantity, 0)::float8 AS total_reject_quantity,
                vodf.remarks
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
						SELECT COUNT(oe.swatch_approval_date) AS swatch_approval_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
			) swatch_approval_counts ON vodf.order_description_uuid = swatch_approval_counts.order_description_uuid
			LEFT JOIN (
						SELECT COUNT(*) AS order_entry_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
			) order_entry_counts ON vodf.order_description_uuid = order_entry_counts.order_description_uuid
            LEFT JOIN (
                SELECT 
                    oe.order_description_uuid,
                    SUM(CASE WHEN section = 'sa_prod' THEN production_quantity ELSE 0 END) AS assembly_production_quantity,
                    SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity
                FROM slider.production
                LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
                LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
                LEFT JOIN zipper.order_entry oe ON finishing_batch.order_description_uuid = oe.order_description_uuid
                GROUP BY oe.order_description_uuid
            ) production_sum ON production_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT 
                    SUM(dtt.trx_quantity) AS total_trx_quantity, dtt.order_description_uuid
                FROM zipper.dyed_tape_transaction dtt
                GROUP BY dtt.order_description_uuid
            ) dyed_tape_transaction_sum ON dyed_tape_transaction_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT SUM(dttfs.trx_quantity) AS total_trx_quantity, dttfs.order_description_uuid
                FROM zipper.dyed_tape_transaction_from_stock dttfs
                GROUP BY dttfs.order_description_uuid
            ) dyed_tape_transaction_from_stock_sum ON dyed_tape_transaction_from_stock_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT tape_coil_to_dyeing.order_description_uuid, SUM(tape_coil_to_dyeing.trx_quantity) as total_tape_coil_to_dyeing_quantity
                FROM zipper.tape_coil_to_dyeing
                GROUP BY order_description_uuid
            ) tape_coil_to_dyeing_sum ON tape_coil_to_dyeing_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT 
                    od.uuid as order_description_uuid,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'teeth_molding' THEN 
                            CASE 
                                WHEN sfg_prod.production_quantity > 0 THEN sfg_prod.production_quantity 
                                ELSE sfg_prod.production_quantity_in_kg 
                            END 
                        ELSE 0 
                    END) AS teeth_molding_quantity,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'teeth_coloring' THEN sfg_prod.production_quantity 
                        ELSE 0 
                    END) AS teeth_coloring_quantity,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'finishing' THEN sfg_prod.production_quantity 
                        ELSE 0 
                    END) AS finishing_quantity
                FROM 
                    zipper.finishing_batch_production sfg_prod
                LEFT JOIN
                    zipper.finishing_batch_entry fbe ON sfg_prod.finishing_batch_entry_uuid = fbe.uuid
               LEFT JOIN
                    zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
                LEFT JOIN 
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN 
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY 
                   od.uuid
            ) sfg_production_sum ON sfg_production_sum.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    od.uuid as order_description_uuid,
                    SUM(ple.quantity) as total_packing_list_quantity
                FROM 
                    delivery.packing_list_entry ple
                LEFT JOIN
                    zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY
                    od.uuid
            ) packing_list_sum ON packing_list_sum.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    od.uuid as order_description_uuid,
                    SUM(CASE WHEN packing_list.gate_pass = 1 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN packing_list.gate_pass = 0 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(packing_list_entry.short_quantity)AS total_short_quantity,
                    SUM(packing_list_entry.reject_quantity) AS total_reject_quantity
                FROM
                    delivery.challan
                LEFT JOIN
                    delivery.packing_list ON challan.uuid = packing_list.challan_uuid
                LEFT JOIN
                    delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
                LEFT JOIN
                    zipper.sfg ON packing_list_entry.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY
                    od.uuid
            ) delivery_sum ON delivery_sum.order_description_uuid = oe.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
        `;

		query.append(
			sql` GROUP BY
                vodf.order_info_uuid,
                vodf.order_number,
                vodf.created_at,
                vodf.order_description_updated_at,
                vodf.marketing_uuid,
                vodf.marketing_name,
                vodf.party_uuid,
                vodf.party_name,
                vodf.is_cash,
                vodf.is_bill,
                vodf.is_sample,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.order_type,
                swatch_approval_counts.swatch_approval_count,
                order_entry_counts.order_entry_count,
                production_sum.assembly_production_quantity,
                production_sum.coloring_production_quantity,
                tape_coil_to_dyeing_sum.total_tape_coil_to_dyeing_quantity,
                dyed_tape_transaction_sum.total_trx_quantity,
                dyed_tape_transaction_from_stock_sum.total_trx_quantity,
                sfg_production_sum.teeth_molding_quantity,
                sfg_production_sum.teeth_coloring_quantity,
                sfg_production_sum.finishing_quantity,
                vodf.item_name,
                packing_list_sum.total_packing_list_quantity,
                delivery_sum.total_delivery_delivered_quantity,
                delivery_sum.total_delivery_balance_quantity,
                delivery_sum.total_short_quantity,
                delivery_sum.total_reject_quantity,
                vodf.remarks`
		);

		if (status === 'completed') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) = SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 0`
			);
		} else if (status === 'pending') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) < SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 0`
			);
		} else if (status === 'over_delivered') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) > SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 0`
			);
		} else if (status === 'sample_completed') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) = SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 1`
			);
		} else if (status === 'sample_pending') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) < SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 1`
			);
		} else if (status === 'sample_over_delivered') {
			query.append(
				sql` HAVING coalesce(delivery_sum.total_delivery_delivered_quantity,0) > SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END) AND vodf.is_sample = 1`
			);
		}

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Zipper Production Status Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function dailyChallanReport(req, res, next) {
	const { own_uuid, status } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;
	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
                    SELECT 
                        challan.uuid,
                        challan.created_at AS challan_date,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN CONCAT('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
                            ELSE CONCAT('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) 
                        END AS challan_id,
                        packing_list_grouped.gate_pass,
                        challan.created_by,
                        users.name AS created_by_name,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN challan.thread_order_info_uuid 
                            ELSE challan.order_info_uuid 
                        END AS order_info_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN CONCAT('ST', 
                                CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END,
                                to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')
                            ) 
                            ELSE vodf.order_number 
                        END AS order_number,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpc.uuid 
                            ELSE pi_cash.uuid 
                        END AS pi_cash_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN CASE 
                                WHEN tpc.uuid IS NOT NULL 
                                THEN concat('PI', to_char(tpc.created_at, 'YY'), '-', LPAD(tpc.id::text, 4, '0')) 
                                ELSE NULL 
                            END 
                            ELSE CASE 
                                WHEN pi_cash.uuid IS NOT NULL 
                                THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                                ELSE NULL 
                            END 
                        END AS pi_cash_id,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tlc.uuid 
                            ELSE lc.uuid 
                        END AS lc_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tlc.lc_number 
                            ELSE lc.lc_number 
                        END AS lc_number,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpm.uuid 
                            ELSE vodf.marketing_uuid 
                        END AS marketing_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpm.name 
                            ELSE vodf.marketing_name 
                        END AS marketing_name,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpp.uuid 
                            ELSE vodf.party_uuid 
                        END AS party_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpp.name 
                            ELSE vodf.party_name 
                        END AS party_name,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpf.uuid 
                            ELSE vodf.factory_uuid 
                        END AS factory_uuid,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN tpf.name 
                            ELSE vodf.factory_name 
                        END AS factory_name,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN toe.uuid 
                            ELSE oe.uuid 
                        END) AS order_entry_uuid,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN CONCAT(toe.style, ' - ', toe.color) 
                            ELSE CONCAT(oe.style, ' - ', oe.color, ' - ', 
                                CASE 
                                    WHEN vodf.is_inch = 1 
                                    THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                                    ELSE CAST(oe.size AS NUMERIC)
                                END) 
                        END) AS style_color_size,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN CONCAT(tcl.count, ' - ', tcl.length) 
                            ELSE NULL 
                        END )AS count_length_name,
                        packing_list_grouped.total_quantity::float8,
                        challan.receive_status,
                        packing_list_grouped.total_short_quantity::float8,
                        packing_list_grouped.total_reject_quantity::float8,
                        CASE 
                            WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' 
                            THEN 'thread' 
                            ELSE 'zipper' 
                        END AS product
                    FROM
                        delivery.challan
                    LEFT JOIN 
                        hr.users ON challan.created_by = users.uuid
                    LEFT JOIN delivery.packing_list pl ON challan.uuid = pl.challan_uuid
                    LEFT JOIN (
                        SELECT 
                            packing_list.challan_uuid,
                            packing_list.gate_pass,
                            SUM(packing_list_entry.quantity)::float8 AS total_quantity,
                            SUM(packing_list_entry.short_quantity)::float8 AS total_short_quantity,
                            SUM(packing_list_entry.reject_quantity)::float8 AS total_reject_quantity,
                            SUM(CASE 
                                WHEN packing_list_entry.sfg_uuid IS NOT NULL 
                                THEN oe.quantity::float8 
                                ELSE toe.quantity::float8 
                            END) AS order_quantity
                        FROM
                            delivery.packing_list
                        LEFT JOIN
                            delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
                        LEFT JOIN
                            zipper.sfg ON packing_list_entry.sfg_uuid = sfg.uuid
                        LEFT JOIN
                            zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN thread.order_entry toe ON packing_list_entry.thread_order_entry_uuid = toe.uuid
                        GROUP BY
                            packing_list.challan_uuid, packing_list.gate_pass
                    ) packing_list_grouped ON challan.uuid = packing_list_grouped.challan_uuid
                    LEFT JOIN delivery.packing_list_entry ple ON ple.packing_list_uuid = pl.uuid
                    LEFT JOIN
                        zipper.sfg ON ple.sfg_uuid = sfg.uuid
                    LEFT JOIN
                        zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN 
                        zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    LEFT JOIN 
                        commercial.pi_cash pi_cash ON pi_cash.order_info_uuids IN (vodf.order_info_uuid)
                    LEFT JOIN
                        commercial.lc ON pi_cash.lc_uuid = lc.uuid
                    LEFT JOIN thread.order_entry toe ON toe.uuid = ple.thread_order_entry_uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN thread.count_length tcl ON toe.count_length_uuid = tcl.uuid
                    LEFT JOIN public.marketing tpm ON toi.marketing_uuid = tpm.uuid
                    LEFT JOIN public.party tpp ON toi.party_uuid = tpp.uuid
                    LEFT JOIN public.factory tpf ON toi.factory_uuid = tpf.uuid
                    LEFT JOIN commercial.pi_cash tpc ON tpc.thread_order_info_uuids IN (toi.uuid)
                    LEFT JOIN commercial.lc tlc ON tpc.lc_uuid = tlc.uuid 
                    WHERE
                        ${own_uuid == null ? sql`TRUE` : sql`CASE WHEN pl.item_for = 'thread' OR pl.item_for = 'sample_thread' THEN toi.marketing_uuid = ${marketingUuid} ELSE vodf.marketing_uuid = ${marketingUuid} END`}
                        AND ${
							status == 'pending'
								? sql`challan.receive_status = 0`
								: status == 'completed'
									? sql`challan.receive_status = 1`
									: sql`TRUE`
						}
                    GROUP BY
                        challan.uuid,
                        challan.created_at,
                        pl.item_for,
                        packing_list_grouped.gate_pass,
                        challan.created_by,
                        users.name,
                        challan.thread_order_info_uuid,
                        challan.order_info_uuid,
                        toi.is_sample,
                        toi.created_at,
                        toi.id,
                        vodf.order_number,
                        tpc.uuid,
                        pi_cash.uuid,
                        tpc.created_at,
                        tpc.id,
                        pi_cash.created_at,
                        pi_cash.id,
                        tlc.uuid,
                        lc.uuid,
                        tlc.lc_number,
                        lc.lc_number,
                        tpm.uuid,
                        vodf.marketing_uuid,
                        tpm.name,
                        vodf.marketing_name,
                        tpp.uuid,
                        vodf.party_uuid,
                        tpp.name,
                        vodf.party_name,
                        tpf.uuid,
                        vodf.factory_uuid,
                        tpf.name,
                        vodf.factory_name,
                        packing_list_grouped.total_quantity,
                        packing_list_grouped.total_short_quantity,
                        packing_list_grouped.total_reject_quantity
                    ORDER BY
                        challan.created_at DESC; 
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Daily Challan Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function PiRegister(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                pi_cash.uuid,
                CASE WHEN is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END AS pi_cash_number,
                pi_cash.created_at AS pi_cash_created_date,
                pi_cash_entry_order_numbers.order_numbers,
                pi_cash_entry_order_numbers.thread_order_numbers,
                pi_cash.party_uuid,
                party.name as party_name,
                pi_cash.bank_uuid,
                bank.name as bank_name,
                pi_cash.marketing_uuid,
                marketing.name as marketing_name,
                pi_cash.conversion_rate,
                pi_cash_entry_order_numbers.total_pi_quantity::float8,
                (pi_cash_entry_order_numbers.total_zipper_pi_price + pi_cash_entry_order_numbers.total_thread_pi_price)::float8 as total_pi_value,
                pi_cash_entry_order_numbers.order_type,
                pi_cash.lc_uuid,
                lc.lc_number,
                lc.lc_date,
                lc.lc_value::float8,
                CASE WHEN lc.uuid IS NOT NULL THEN concat('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) ELSE NULL END as file_number,
                lc.created_at as lc_created_at
            FROM
                commercial.pi_cash
            LEFT JOIN
                hr.users ON pi_cash.created_by = users.uuid
            LEFT JOIN 
                commercial.bank ON pi_cash.bank_uuid = bank.uuid
            LEFT JOIN
                commercial.lc ON pi_cash.lc_uuid = lc.uuid
            LEFT JOIN
                public.marketing ON pi_cash.marketing_uuid = marketing.uuid
            LEFT JOIN
                public.party ON pi_cash.party_uuid = party.uuid
            LEFT JOIN
                public.factory ON pi_cash.factory_uuid = factory.uuid
            LEFT JOIN (
				SELECT 
                    array_agg(DISTINCT vodf.order_number) as order_numbers, 
                    jsonb_agg(DISTINCT jsonb_build_object('value', vodf.order_info_uuid, 'label', vodf.order_number)) as order_object,
                    array_agg(DISTINCT CASE WHEN toi.uuid is NOT NULL THEN concat('ST', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) ELSE NULL END) as thread_order_numbers, 
                    jsonb_agg(DISTINCT jsonb_build_object('value', toi.uuid, 'label', CASE WHEN toi.uuid is NOT NULL THEN concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) ELSE NULL END)) as thread_order_object,
                    pi_cash_uuid, 
                    SUM(pe.pi_cash_quantity)::float8 as total_pi_quantity,
                    SUM(pe.pi_cash_quantity * coalesce(CASE WHEN vodf.order_type = 'tape' THEN oe.party_price ELSE oe.party_price/12 END, 0))::float8 as total_zipper_pi_price, 
                    SUM(pe.pi_cash_quantity * coalesce(toe.party_price, 0))::float8 as total_thread_pi_price,
                    vodf.order_type
				FROM
					commercial.pi_cash_entry pe 
					LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
				GROUP BY pi_cash_uuid, vodf.order_type
			) pi_cash_entry_order_numbers ON pi_cash.uuid = pi_cash_entry_order_numbers.pi_cash_uuid
            WHERE  pi_cash_entry_order_numbers.order_numbers IS NOT NULL OR pi_cash_entry_order_numbers.thread_order_numbers IS NOT NULL  AND ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${marketingUuid}`}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// * remove the null values in order_numbers and thread_order_numbers
		data?.rows.forEach((row) => {
			row.order_numbers = row.order_numbers.filter(
				(order_number) => order_number !== null
			);
			row.thread_order_numbers = row.thread_order_numbers.filter(
				(order_number) => order_number !== null
			);
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function PiToBeRegister(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                party.uuid,
                party.name,
                vodf_grouped.order_object,
                vodf_grouped.total_quantity::float8,
                vodf_grouped.total_delivered::float8,
                vodf_grouped.total_pi::float8,
                vodf_grouped.total_non_pi::float8,
                vodf_grouped.total_quantity_value::float8,
                vodf_grouped.total_delivered_value::float8,
                vodf_grouped.total_pi_value::float8,
                vodf_grouped.total_non_pi_value::float8
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    jsonb_agg(DISTINCT jsonb_build_object('value', vodf.order_info_uuid, 'label', vodf.order_number)) as order_object,
                    SUM(order_entry.quantity) AS total_quantity,
                    SUM(sfg.delivered) AS total_delivered,
                    SUM(sfg.pi) AS total_pi,
                    SUM(order_entry.quantity - sfg.pi) AS total_non_pi,
                    SUM(order_entry.quantity * order_entry.party_price) AS total_quantity_value,
                    SUM(sfg.delivered * order_entry.party_price) AS total_delivered_value,
                    SUM(sfg.pi * order_entry.party_price) AS total_pi_value,
                    SUM((order_entry.quantity - sfg.pi) * order_entry.party_price) AS total_non_pi_value,
                    vodf.party_uuid
                FROM
                    zipper.sfg
                LEFT JOIN
                    zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN 
                    zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN (
                    SELECT DISTINCT vodf.order_info_uuid
                    FROM commercial.pi_cash_entry
                    LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                ) order_exists_in_pi ON vodf.order_info_uuid = order_exists_in_pi.order_info_uuid
                WHERE order_exists_in_pi.order_info_uuid IS NULL
                GROUP BY
                    vodf.party_uuid
            ) vodf_grouped ON party.uuid = vodf_grouped.party_uuid
            WHERE 
                vodf_grouped.total_quantity > 0 OR 
                vodf_grouped.total_delivered > 0 OR 
                vodf_grouped.total_pi > 0 OR
                vodf_grouped.total_non_pi > 0 AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI To Be Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function PiToBeRegisterThread(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                party.uuid,
                party.name,
                toi_grouped.total_quantity::float8,
                toi_grouped.total_pi::float8,
                toi_grouped.total_balance_pi_quantity::float8,
                toi_grouped.total_balance_pi_value::float8,
                toi_grouped.total_delivered::float8,
                toi_grouped.total_undelivered_balance_quantity::float8
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    SUM(order_entry.quantity) AS total_quantity,
                    SUM(order_entry.quantity - order_entry.pi) AS total_balance_pi_quantity,
                    SUM((order_entry.quantity - order_entry.pi) * order_entry.party_price) AS total_balance_pi_value,
                    SUM(order_entry.pi) AS total_pi,
                    SUM(order_entry.delivered) AS total_delivered,
                    SUM(order_entry.pi - order_entry.delivered) AS total_undelivered_balance_quantity,
                    toi.party_uuid
                FROM
                    thread.order_entry
                LEFT JOIN 
                    thread.order_info toi ON order_entry.order_info_uuid = toi.uuid
                GROUP BY
                    toi.party_uuid
            ) toi_grouped ON party.uuid = toi_grouped.party_uuid
            WHERE 
                toi_grouped.total_quantity > 0 OR toi_grouped.total_delivered > 0 OR toi_grouped.total_balance_pi_quantity > 0 OR toi_grouped.total_undelivered_balance_quantity > 0 AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI To Be Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function LCReport(req, res, next) {
	const { document_receiving, acceptance, maturity, payment } = req.query;

	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
            SELECT 
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) AS file_number,
                lc.uuid,
                lc.lc_number,
                lc.lc_date,
                party.uuid as party_uuid,
                party.name as party_name,
                lc.created_at,
                lc.updated_at,
                lc.remarks,
                lc.commercial_executive,
                lc_entry.handover_date,
                lc_entry.document_receive_date,
                lc_entry.acceptance_date,
                lc_entry.maturity_date,
                lc_entry.payment_date,
                lc_entry.ldbc_fdbc,
                lc.shipment_date,
                lc.expiry_date,
                lc_entry.amount::float8,
                lc_entry.payment_value,
                lc_entry_others.ud_no,
                lc_entry_others.ud_received,
                pi_cash.marketing_uuid,
                marketing.name as marketing_name,
                pi_cash.bank_uuid,
                bank.name as bank_name,
                lc.party_bank,
                CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			)::float8 ELSE lc.lc_value::float8 END AS total_value
            FROM
                commercial.lc
            LEFT JOIN 
                commercial.lc_entry ON lc.uuid = lc_entry.lc_uuid
            LEFT JOIN
                commercial.lc_entry_others ON lc.uuid = lc_entry_others.lc_uuid
            LEFT JOIN
                public.party ON lc.party_uuid = party.uuid
            LEFT JOIN 
                commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
            LEFT JOIN 
                public.marketing ON pi_cash.marketing_uuid = marketing.uuid
            LEFT JOIN
                hr.users ON lc.created_by = users.uuid
            LEFT JOIN
                commercial.bank ON pi_cash.bank_uuid = bank.uuid
            WHERE
                lc_entry.handover_date IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`pi_cash.marketing_uuid = ${marketingUuid}`}
        `;

		if (document_receiving) {
			query.append(sql`AND lc_entry.document_receive_date IS NULL`);
		} else if (acceptance) {
			query.append(
				sql`AND lc_entry.document_receive_date IS NOT NULL AND lc_entry.acceptance_date IS NULL`
			);
		} else if (maturity) {
			query.append(
				sql`AND lc_entry.document_receive_date IS NOT NULL AND lc_entry.acceptance_date IS NOT NULL AND lc_entry.maturity_date IS NULL`
			);
		} else if (payment) {
			query.append(
				sql`AND lc_entry.document_receive_date IS NOT NULL AND lc_entry.acceptance_date IS NOT NULL AND lc_entry.maturity_date IS NOT NULL AND lc_entry.payment_date IS NULL`
			);
		}

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'LC Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

// shows multiple rows for order_entry.count_length_uuid, count_length.count,count_length.length,order_entry.uuid as order_entry_uuid,order_info.uuid as order_info_uuid columns

export async function threadProductionStatusBatchWise(req, res, next) {
	const { status } = req.query;
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT
                batch.uuid,
                CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) AS batch_number,
                batch.created_at AS batch_created_at,
                order_entry.uuid as order_entry_uuid,
                order_info.uuid as order_info_uuid,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.is_sample,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_entry.style,
                order_entry.color,
                recipe.name as recipe_name,
                order_entry.swatch_approval_date,
                order_entry.count_length_uuid,
                count_length.count,
                count_length.length,
                batch_entry_quantity_length.total_quantity::float8,
                batch_entry_quantity_length.total_weight::float8,
                batch_entry_quantity_length.yarn_quantity::float8,
                batch.is_drying_complete,
                batch_entry_coning.total_coning_production_quantity::float8,
                order_entry.warehouse::float8,
                coalesce(thread_packing_list_sum.total_packing_list_quantity,0)::float8 as total_packing_list_quantity,
                coalesce(thread_challan_sum.total_delivery_delivered_quantity,0)::float8 as total_delivery_delivered_quantity,
                coalesce(thread_challan_sum.total_delivery_balance_quantity,0)::float8 as total_delivery_balance_quantity,
                coalesce(thread_challan_sum.total_short_quantity,0)::float8 as total_short_quantity,
                coalesce(thread_challan_sum.total_reject_quantity,0)::float8 as total_reject_quantity,
                batch.remarks
            FROM
                thread.batch_entry
            LEFT JOIN 
                thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
            LEFT JOIN 
                lab_dip.recipe ON order_entry.recipe_uuid = recipe.uuid
            LEFT JOIN
                thread.batch ON batch.uuid = batch_entry.batch_uuid
            LEFT JOIN
                thread.order_info ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT 
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as yarn_quantity,
                    SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                    batch_entry.batch_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    batch_entry.batch_uuid
            ) batch_entry_quantity_length ON batch.uuid = batch_entry_quantity_length.batch_uuid
            LEFT JOIN (
                SELECT 
                    SUM(coning_production_quantity) as total_coning_production_quantity,
                    batch_uuid
                FROM
                    thread.batch_entry
                GROUP BY
                    batch_uuid
            ) batch_entry_coning ON batch.uuid = batch_entry_coning.batch_uuid
            LEFT JOIN (
                SELECT
                    toe.uuid as order_entry_uuid,
                    SUM(ple.quantity) as total_packing_list_quantity
                FROM
                    delivery.packing_list_entry ple
                LEFT JOIN
                    thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                GROUP BY
                    toe.uuid
            ) thread_packing_list_sum ON thread_packing_list_sum.order_entry_uuid = order_entry.uuid
            LEFT JOIN (
                SELECT 
                    toe.uuid as order_entry_uuid,
                    SUM(CASE WHEN (pl.gate_pass = 1 AND ple.thread_order_entry_uuid IS NOT NULL) THEN ple.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN (pl.gate_pass = 0 AND ple.thread_order_entry_uuid IS NOT NULL) THEN ple.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(ple.short_quantity)AS total_short_quantity,
                    SUM(ple.reject_quantity) AS total_reject_quantity
                FROM
                    delivery.challan
                LEFT JOIN
                    delivery.packing_list pl ON challan.uuid = pl.challan_uuid
                LEFT JOIN 
                    delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
                LEFT JOIN
                    thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                GROUP BY
                    toe.uuid
            ) thread_challan_sum ON thread_challan_sum.order_entry_uuid = order_entry.uuid
            WHERE batch.uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`}
            `;

		if (status === 'completed') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity = coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0`
			);
		} else if (status === 'pending') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity > coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0`
			);
		} else if (status === 'over_delivered') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity < coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 0`
			);
		} else if (status === 'sample_completed') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity = coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1`
			);
		} else if (status === 'sample_pending') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity > coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1`
			);
		} else if (status === 'sample_over_delivered') {
			query.append(
				sql` AND batch_entry_quantity_length.total_quantity < coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) AND order_info.is_sample = 1`
			);
		}

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Production Status Batch Wise',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportDirector(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		// OKAY
		const query = sql`
            SELECT 
                vodf.order_info_uuid,
                vodf.item,
                vodf.item_name,
                vodf.order_number,
                vodf.party_uuid,
                vodf.party_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.end_type,
                vodf.end_type_name,
                coalesce(close_end_sum.total_close_end_quantity,0) as total_close_end_quantity,
                coalesce(open_end_sum.total_open_end_quantity,0) as total_open_end_quantity,
                coalesce(close_end_sum.total_close_end_quantity + open_end_sum.total_open_end_quantity,0) as total_quantity
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'close end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_close_end_quantity,
                    oe.order_description_uuid
                FROM
                    zipper.finishing_batch_production sfg_production
                    LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_production.finishing_batch_entry_uuid = fbe.uuid
                    LEFT JOIN zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.order_description_uuid
            ) close_end_sum ON vodf.order_description_uuid = close_end_sum.order_description_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'open end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_open_end_quantity,
                    oe.order_description_uuid
                FROM
                    zipper.finishing_batch_production sfg_production
                    LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_production.finishing_batch_entry_uuid = fbe.uuid
                    LEFT JOIN zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.order_description_uuid
            ) open_end_sum ON vodf.order_description_uuid = open_end_sum.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
            ORDER BY vodf.item_name DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// row group using item_name, then party_name, then order_number, then item_description
		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		item_description,
		// 		total_close_end_quantity,
		// 		total_open_end_quantity,
		// 		total_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			descriptions: [],
		// 		})
		// 	);

		// 	order.descriptions.push({
		// 		item_description,
		// 		total_close_end_quantity,
		// 		total_open_end_quantity,
		// 		total_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadDirector(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                order_info.uuid,
                'Sewing Thread' as item_name,
                order_info.party_uuid,
                party.name as party_name,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0) as total_quantity,
                coalesce(prod_quantity.total_coning_carton_quantity,0) as total_coning_carton_quantity
            FROM
                thread.order_info
            LEFT JOIN
                thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry_production.production_quantity) as total_quantity,
                    SUM(batch_entry_production.coning_carton_quantity) as total_coning_carton_quantity,
                    order_entry.order_info_uuid
                FROM
                    thread.batch_entry_production
                LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.order_info_uuid
            ) prod_quantity ON order_info.uuid = prod_quantity.order_info_uuid
            WHERE ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`}
            GROUP BY 
                order_info.uuid, party.name, order_info.created_at, count_length.count, count_length.length, prod_quantity.total_quantity, prod_quantity.total_coning_carton_quantity
            ORDER BY party.name DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// first group by item_name, then party_name, then order_number, then count_length_name
		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		count_length_name,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			count_lengths: [],
		// 		})
		// 	);

		// 	order.count_lengths.push({
		// 		count_length_name,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportSnm(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                vodf.order_info_uuid,
                vodf.item,
                vodf.item_name,
                vodf.order_number,
                vodf.party_uuid,
                vodf.party_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.end_type,
                vodf.end_type_name,
                oe,uuid as order_entry_uuid,
                oe.size,
                coalesce(close_end_sum.total_close_end_quantity,0) as total_close_end_quantity,
                coalesce(open_end_sum.total_open_end_quantity,0) as total_open_end_quantity,
                coalesce(close_end_sum.total_close_end_quantity + open_end_sum.total_open_end_quantity,0) as total_quantity
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN 
                zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'close end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_close_end_quantity,
                    oe.uuid as order_entry_uuid
                FROM
                    zipper.finishing_batch_production sfg_production
                    LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_production.finishing_batch_entry_uuid = fbe.uuid
                    LEFT JOIN zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.uuid
            ) close_end_sum ON oe.uuid = close_end_sum.order_entry_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'open end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_open_end_quantity,
                    oe.uuid as order_entry_uuid
                FROM
                    zipper.finishing_batch_production sfg_production
                    LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_production.finishing_batch_entry_uuid = fbe.uuid
                    LEFT JOIN zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.uuid
            ) open_end_sum ON oe.uuid = open_end_sum.order_entry_uuid
            WHERE vodf.order_description_uuid IS NOT NULL AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
            ORDER BY vodf.item_name DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// row group using firstly item_name, secondly party_name, thirdly order_number, fourthly item_description, fifth size

		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		item_description,
		// 		size,
		// 		total_close_end_quantity,
		// 		total_open_end_quantity,
		// 		total_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			items: [],
		// 		})
		// 	);

		// 	const itemEntry = findOrCreate(
		// 		order.items,
		// 		'item_description',
		// 		item_description,
		// 		() => ({
		// 			item_description,
		// 			sizes: [],
		// 		})
		// 	);

		// 	itemEntry.sizes.push({
		// 		size,
		// 		total_close_end_quantity,
		// 		total_open_end_quantity,
		// 		total_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report S&M',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadSnm(req, res, next) {
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            SELECT 
                order_info.uuid,
                'Sewing Thread' as item_name,
                order_info.party_uuid,
                party.name as party_name,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_entry.uuid as order_entry_uuid,
                count_length.count,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0) as total_quantity,
                coalesce(prod_quantity.total_coning_carton_quantity,0) as total_coning_carton_quantity
            FROM
                thread.order_info
            LEFT JOIN
                thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry_production.production_quantity) as total_quantity,
                    SUM(batch_entry_production.coning_carton_quantity) as total_coning_carton_quantity,
                    order_entry.uuid as order_entry_uuid
                FROM
                    thread.batch_entry_production
                LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.uuid
            ) prod_quantity ON order_entry.uuid = prod_quantity.order_entry_uuid
            WHERE ${own_uuid == null ? sql`TRUE` : sql`order_info.marketing_uuid = ${marketingUuid}`}
            ORDER BY party.name DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// first group by item_name, then party_name, then order_number, then count_length_name
		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		count_length_name,
		// 		count,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			count_lengths: [],
		// 		})
		// 	);

		// 	const count_length = findOrCreate(
		// 		order.count_lengths,
		// 		'count_length_name',
		// 		count_length_name,
		// 		() => ({
		// 			count_length_name,
		// 			count: [],
		// 		})
		// 	);

		// 	count_length.count.push({
		// 		count,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function dailyProductionReport(req, res, next) {
	const { from_date, to_date } = req.query;
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            WITH running_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    vpl.is_warehouse_received = true 
                    AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`} 
                GROUP BY 
                    oe.uuid, vodf.order_type
                ) 
                SELECT 
                    vodf.marketing_uuid,
					vodf.marketing_name,
					vodf.order_info_uuid,
					vodf.order_number,
					vodf.item_name,
					CASE WHEN vodf.order_type = 'slider' THEN 'Slider' ELSE vodf.item_name END as type,
					vodf.party_uuid,
					vodf.party_name,
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch,
                    oe.size::float8,
                    CASE 
                        WHEN vodf.is_inch = 1 THEN 'Inch'
                        WHEN vodf.order_type = 'tape' THEN 'Meter'
                        ELSE 'Pcs'
                    END as unit,
                    CASE WHEN 
                        vodf.order_type = 'tape' THEN 'Mtr'
                        ELSE 'Dzn'
                    END as price_unit,
                    ROUND(oe.company_price::numeric, 3) as company_price_dzn, 
                    ROUND(oe.company_price / 12::numeric, 3) as company_price_pcs, 
                    'running' as running, 
                    coalesce(
                        running_all_sum.total_close_end_quantity, 
                        0
                    )::float8 as running_total_close_end_quantity, 
                    coalesce(
                        running_all_sum.total_open_end_quantity, 
                        0
                    )::float8 as running_total_open_end_quantity, 
                    coalesce(running_all_sum.total_prod_quantity)::float8 as running_total_quantity, 
                    (
                        coalesce(running_all_sum.total_prod_quantity, 0) / 12
                    )::float8 as running_total_quantity_dzn, 
                    coalesce(
                        running_all_sum.total_close_end_value, 
                        0
                    )::float8 as running_total_close_end_value, 
                    coalesce(
                        running_all_sum.total_open_end_value, 
                        0
                    )::float8 as running_total_open_end_value, 
                    coalesce(total_prod_value, 0)::float8 as running_total_value
                FROM 
                    zipper.v_order_details_full vodf 
                LEFT JOIN 
                    zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid 
                LEFT JOIN 
                    running_all_sum ON oe.uuid = running_all_sum.order_entry_uuid 
                WHERE 
                    vodf.is_bill = 1 AND vodf.item_description IS NOT NULL AND vodf.item_description != '---'
                    AND coalesce(running_all_sum.total_prod_quantity, 0)::float8 > 0 AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                ORDER BY 
                    vodf.party_name DESC, oe.size ASC;
    `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// first group by type, then party_name, then order_number, then item_description, then size
		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				type,
				party_name,
				order_number,
				item_description,
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			} = row;

			const findOrCreateArray = (array, key, value, createFn) => {
				let index = array.findIndex((item) =>
					key
						.map((indKey, index) => item[indKey] === value[index])
						.every((item) => item)
				);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const findOrCreate = (array, key, value, createFn) => {
				let index = array.findIndex((item) => item[key] === value);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const typeEntry = findOrCreateArray(acc, ['type'], [type], () => ({
				type,
				parties: [],
			}));

			const party = findOrCreate(
				typeEntry.parties,
				'party_name',
				party_name,
				() => ({
					party_name,
					orders: [],
				})
			);

			const order = findOrCreate(
				party.orders,
				'order_number',
				order_number,
				() => ({
					order_number,
					items: [],
				})
			);

			const item = findOrCreate(
				order.items,
				'item_description',
				item_description,
				() => ({
					item_description,
					other: [],
				})
			);

			item.other.push({
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			});

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Delivery Statement Report',
		};

		res.status(200).json({ toast, data: groupedData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function deliveryStatementReport(req, res, next) {
	const { from_date, to_date } = req.query;

	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
            WITH opening_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    vpl.is_warehouse_received = true 
                    AND ${from_date ? sql`vpl.created_at < ${from_date}::TIMESTAMP` : sql`1=1`}
                GROUP BY 
                    oe.uuid, vodf.order_type
                ), 
                running_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_close_end_value, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN vpl.quantity ::float8 ELSE 0 END
                        ) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
                        0
                    )::float8 as total_open_end_value,
                    coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
                    coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
                FROM 
                    delivery.v_packing_list_details vpl 
                    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
                    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
                    AND oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    vpl.is_warehouse_received = true 
                    AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`} 
                GROUP BY 
                    oe.uuid, vodf.order_type
                ) 
                SELECT 
                    vodf.marketing_uuid,
					vodf.marketing_name,
					vodf.order_info_uuid,
					vodf.order_number,
					vodf.item_name,
					CASE WHEN vodf.order_type = 'slider' THEN 'Slider' ELSE vodf.item_name END as type,
					vodf.party_uuid,
					vodf.party_name,
                    order_info_total_quantity.total_quantity,
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch,
                    description_wise_price_size.size,
                    CASE 
                        WHEN vodf.order_type = 'tape' THEN 'Meter'
                        WHEN vodf.is_inch = 1 THEN 'Inch'
                        ELSE 'Cm'
                    END as unit,
                    CASE WHEN 
                        vodf.order_type = 'tape' THEN 'Mtr'
                        ELSE 'Dzn'
                    END as price_unit,
                    ROUND(description_wise_price_size.company_price::numeric, 3) as company_price_dzn, 
                    ROUND(description_wise_price_size.company_price / 12::numeric, 3) as company_price_pcs, 
                    'opening' as opening, 
                    SUM(COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8) as opening_total_close_end_quantity, 
                    SUM(COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8) as opening_total_open_end_quantity, 
                    SUM(COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) as opening_total_quantity, 
                    SUM(COALESCE(opening_all_sum.total_prod_quantity, 0)::float8 / 12) as opening_total_quantity_dzn, 
                    SUM(COALESCE(opening_all_sum.total_close_end_value, 0)::float8) as opening_total_close_end_value, 
                    SUM(COALESCE(opening_all_sum.total_open_end_value, 0)::float8) as opening_total_open_end_value, 
                    SUM(COALESCE(opening_all_sum.total_prod_value, 0)::float8) as opening_total_value, 
                    'running' as running, 
                    SUM(COALESCE(running_all_sum.total_close_end_quantity, 0)::float8) as running_total_close_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_open_end_quantity, 0)::float8) as running_total_open_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8) as running_total_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8 / 12) as running_total_quantity_dzn, 
                    SUM(COALESCE(running_all_sum.total_close_end_value, 0)::float8) as running_total_close_end_value, 
                    SUM(COALESCE(running_all_sum.total_open_end_value, 0)::float8) as running_total_open_end_value, 
                    SUM(COALESCE(running_all_sum.total_prod_value, 0)::float8) as running_total_value, 
                    'closing' as closing, 
                    SUM(COALESCE(running_all_sum.total_close_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_close_end_quantity, 0)::float8) as closing_total_close_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_open_end_quantity, 0)::float8 + COALESCE(opening_all_sum.total_open_end_quantity, 0)::float8) as closing_total_open_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) as closing_total_quantity, 
                    SUM((COALESCE(running_all_sum.total_prod_quantity, 0)::float8 + COALESCE(opening_all_sum.total_prod_quantity, 0)::float8) / 12) as closing_total_quantity_dzn, 
                    SUM(COALESCE(running_all_sum.total_close_end_value, 0)::float8 + COALESCE(opening_all_sum.total_close_end_value, 0)::float8) as closing_total_close_end_value, 
                    SUM(COALESCE(running_all_sum.total_open_end_value, 0)::float8 + COALESCE(opening_all_sum.total_open_end_value, 0)::float8) as closing_total_open_end_value, 
                    SUM(COALESCE(running_all_sum.total_prod_value, 0)::float8 + COALESCE(opening_all_sum.total_prod_value, 0)::float8) as closing_total_value
                FROM 
                    zipper.v_order_details_full vodf 
                LEFT JOIN 
                    zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid 
                LEFT JOIN 
                    opening_all_sum ON oe.uuid = opening_all_sum.order_entry_uuid 
                LEFT JOIN 
                    running_all_sum ON oe.uuid = running_all_sum.order_entry_uuid 
                LEFT JOIN (
                    SELECT
                        vodf.order_info_uuid,
                        SUM(oe.quantity) as total_quantity
                    FROM
                        zipper.order_entry oe
                    LEFT JOIN
                        zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    GROUP BY
                        vodf.order_info_uuid
                ) order_info_total_quantity ON vodf.order_info_uuid = order_info_total_quantity.order_info_uuid
                LEFT JOIN (
					SELECT 
						oe.order_description_uuid, 
						oe.company_price,
						CASE 
							WHEN MAX(oe.size::float8) = MIN(oe.size::float8) 
							THEN MAX(oe.size::float8)::text 
							ELSE CONCAT(MAX(oe.size::float8)::text, ' - ', MIN(oe.size::float8)::text) 
						END as size
					FROM
						zipper.order_entry oe
					GROUP BY
						oe.order_description_uuid, oe.company_price
				) description_wise_price_size ON vodf.order_description_uuid = description_wise_price_size.order_description_uuid
                WHERE 
                    vodf.is_bill = 1 AND vodf.item_description IS NOT NULL AND vodf.item_description != '---' 
                    AND coalesce(
                            coalesce(
                            running_all_sum.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            running_all_sum.total_open_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum.total_close_end_quantity, 
                            0
                            )::float8 + coalesce(
                            opening_all_sum.total_open_end_quantity, 
                            0
                            )::float8, 
                            0
                        )::float8 > 0 AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                GROUP BY 
                    description_wise_price_size.company_price, 
                    description_wise_price_size.size,
                    vodf.marketing_uuid,
					vodf.marketing_name,
					vodf.order_info_uuid,
					vodf.order_number,
					vodf.item_name,
					vodf.party_uuid,
					vodf.party_name,
                    order_info_total_quantity.total_quantity,
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch
                ORDER BY 
                    vodf.party_name, vodf.marketing_name DESC;
                
    `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		// first group by type, then party_name, then order_number, then item_description, then size
		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				type,
				party_name,
				total_quantity,
				marketing_name,
				order_number,
				item_description,
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			} = row;

			// group using (type, party and marketing) together then order_number, item_description, size

			const findOrCreateArray = (array, key, value, createFn) => {
				let index = array.findIndex((item) =>
					key
						.map((indKey, index) => item[indKey] === value[index])
						.every((item) => item)
				);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const findOrCreate = (array, key, value, createFn) => {
				let index = array.findIndex((item) => item[key] === value);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const typeEntry = findOrCreateArray(
				acc,
				['type', 'party_name', 'marketing_name'],
				[type, party_name, marketing_name],
				() => ({
					type,
					party_name,
					marketing_name,
					orders: [],
				})
			);

			const order = findOrCreateArray(
				typeEntry.orders,
				['order_number'],
				[order_number],
				() => ({
					order_number,
					total_quantity,
					items: [],
				})
			);

			const item = findOrCreate(
				order.items,
				'item_description',
				item_description,
				() => ({
					item_description,
					other: [],
				})
			);

			item.other.push({
				is_inch,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				opening_total_close_end_quantity,
				opening_total_open_end_quantity,
				opening_total_quantity,
				opening_total_quantity_dzn,
				opening_total_close_end_value,
				opening_total_open_end_value,
				opening_total_value,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				closing_total_close_end_quantity,
				closing_total_open_end_quantity,
				closing_total_quantity,
				closing_total_quantity_dzn,
				closing_total_close_end_value,
				closing_total_open_end_value,
				closing_total_value,
			});

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Delivery Statement Report',
		};

		res.status(200).json({ toast, data: groupedData });
	} catch (error) {
		await handleError({ error, res });
	}
}
