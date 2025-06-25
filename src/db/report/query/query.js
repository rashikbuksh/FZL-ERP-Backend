import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

// * Zipper Production Status Report

// multiple rows shows for stock.uuid, coloring_production_quantity, teeth_molding_quantity,teeth_coloring_quantity,finishing_quantity columns
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
                finishing_dyeing_batch.finishing_batch,
                finishing_dyeing_batch.dyeing_batch,
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
                ARRAY_AGG(DISTINCT oe.color_ref) AS color_refs,
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
                CASE 
                    WHEN vodf.order_type = 'tape' THEN 'Meter' 
                    WHEN vodf.order_type = 'slider' THEN 'Pcs'
                    WHEN vodf.is_inch = 1 THEN 'Inch'
				    ELSE 'Cm'
			    END as unit,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity)::float8 AS total_quantity,
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
                vodf.remarks,
                expected.expected_kg::float8 AS total_tape_expected_kg
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
                    od.uuid as order_description_uuid,
                    SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity
                FROM slider.production
                LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
                LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
                LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
                GROUP BY od.uuid
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
                    SUM(CASE WHEN packing_list.gate_pass = 0 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_balance_quantity
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
            LEFT JOIN (
                SELECT
                    vod.order_description_uuid,
                    COALESCE(
                        jsonb_agg(DISTINCT jsonb_build_object('finishing_batch_uuid', finishing_batch.uuid, 'finishing_batch_number', concat('FB', to_char(finishing_batch.created_at, 'YY'::text), '-', (finishing_batch.id::text)), 'finishing_batch_date', finishing_batch.created_at::date, 'finishing_batch_quantity', finishing_batch_total.total_quantity::float8, 'balance_quantity', finishing_batch_total.total_quantity::float8 - finishing_batch_total.total_finishing_prod::float8))
                        FILTER (WHERE finishing_batch.uuid IS NOT NULL), '[]'
                    ) AS finishing_batch,
                    COALESCE(
                        jsonb_agg(DISTINCT 
                            jsonb_build_object(
                            'dyeing_batch_uuid', dyeing_batch.dyeing_batch_uuid, 
                            'dyeing_batch_number', dyeing_batch.dyeing_batch_number, 
                            'dyeing_batch_date', dyeing_batch.production_date, 
                            'dyeing_batch_quantity', dyeing_batch.total_quantity::float8, 
                            'received', dyeing_batch.received,
                            'total_production_quantity', dyeing_batch.total_production_quantity::float8
                            )
                        )
                        FILTER (WHERE dyeing_batch_uuid IS NOT NULL), '[]'
                    ) AS dyeing_batch
                FROM
                    zipper.v_order_details vod
                LEFT JOIN
                    zipper.finishing_batch ON vod.order_description_uuid = finishing_batch.order_description_uuid
                LEFT JOIN 
                    (
						SELECT
							finishing_batch.uuid as finishing_batch_uuid,
							SUM(finishing_batch_entry.quantity) as total_quantity,
                            SUM(finishing_batch_entry.finishing_prod) as total_finishing_prod
						FROM
							zipper.finishing_batch
						LEFT JOIN
							zipper.finishing_batch_entry finishing_batch_entry ON finishing_batch.uuid = finishing_batch_entry.finishing_batch_uuid
						GROUP BY
							finishing_batch.uuid
					) finishing_batch_total ON finishing_batch_total.finishing_batch_uuid = finishing_batch.uuid
                LEFT JOIN
                    (
						SELECT
							dyeing_batch.uuid as dyeing_batch_uuid,
                            CONCAT('B', to_char(dyeing_batch.created_at, 'YY'), '-', (dyeing_batch.id::text)) as dyeing_batch_number,
							dyeing_batch.production_date::date,
                            oe.order_description_uuid,
							SUM(dyeing_batch_entry.quantity) as total_quantity,
                            SUM(dyeing_batch_entry.production_quantity_in_kg) as total_production_quantity,
                            CASE WHEN dyeing_batch.received = 1 THEN TRUE ELSE FALSE END as received
						FROM
							zipper.dyeing_batch
                        LEFT JOIN
                            zipper.dyeing_batch_entry dyeing_batch_entry ON dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
                        LEFT JOIN 
                            zipper.sfg sfg ON dyeing_batch_entry.sfg_uuid = sfg.uuid
                        LEFT JOIN
                            zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        GROUP BY
                            dyeing_batch.uuid, oe.order_description_uuid
					) dyeing_batch ON vod.order_description_uuid = dyeing_batch.order_description_uuid
                GROUP BY
                    vod.order_description_uuid
            ) finishing_dyeing_batch ON finishing_dyeing_batch.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    ROUND(
                        SUM((
                            CASE 
                                WHEN vodf.order_type = 'tape' 
                                    THEN ((tcr.top + tcr.bottom + oe.quantity) * 1) / 100 / tcr.dyed_mtr_per_kg::float8
                                ELSE ((tcr.top + tcr.bottom + CASE 
                                        WHEN vodf.is_inch = 1 
                                            THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
                                        ELSE CAST(oe.size AS NUMERIC)
                                        END) * oe.quantity::float8) / 100 / tcr.dyed_mtr_per_kg::float8
                            END
                    )::numeric), 3) as expected_kg, 
                    vodf.order_description_uuid
                FROM zipper.order_entry oe
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    LEFT JOIN 
                        zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid AND vodf.item = tcr.item_uuid 
                        AND vodf.zipper_number = tcr.zipper_number_uuid 
                        AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
                    LEFT JOIN
                        zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid
                WHERE 
                    lower(vodf.item_name) != 'nylon' 
                    OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
                GROUP BY vodf.order_description_uuid
            ) AS expected ON vodf.order_description_uuid = expected.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL 
                AND vodf.is_cancelled = FALSE
                ${own_uuid == null ? sql`` : sql` AND vodf.marketing_uuid = ${marketingUuid}`}
            GROUP BY
                vodf.order_info_uuid,
                vodf.order_number,
                finishing_dyeing_batch.finishing_batch,
                finishing_dyeing_batch.dyeing_batch,
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
                vodf.remarks,
                expected.expected_kg,
                vodf.is_inch
        `;

		// HAVING clause logic remains the same
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
	const { own_uuid, from_date, to_date } = req?.query;

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
                    WITH pi_cash_grouped AS (
                        SELECT 
                            vodf.order_info_uuid, 
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'pi_number', CASE
                                        WHEN pi_cash.is_pi = 1 THEN concat(
                                            'PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id
                                        )
                                        ELSE concat(
                                            'CI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id
                                        )
                                    END, 'pi_cash_uuid', pi_cash.uuid
                                )
                            ) as pi_numbers, 
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number) ELSE NULL END, 'lc_uuid', lc.uuid
                                )
                            ) as lc_numbers
                        FROM
                            zipper.v_order_details_full vodf
                            LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                            LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                            LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
                            LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                            LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                        WHERE
                            pi_cash.id IS NOT NULL
                        GROUP BY
                            vodf.order_info_uuid
                    ),
                    pi_cash_grouped_thread AS (
                        SELECT 
                            toi.uuid as order_info_uuid, 
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'pi_number', CASE
                                        WHEN pi_cash.is_pi = 1 THEN concat(
                                            'PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id
                                        )
                                        ELSE concat(
                                            'CI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id
                                        )
                                    END, 'pi_cash_uuid', pi_cash.uuid
                                )
                            ) as pi_numbers, 
                            jsonb_agg(
                                DISTINCT jsonb_build_object(
                                    'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number) ELSE NULL END, 'lc_uuid', lc.uuid
                                )
                            ) as lc_numbers
                        FROM
                            thread.order_info toi
                            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
                            LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
                            LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                            LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                        WHERE
                            pi_cash.id IS NOT NULL
                        GROUP BY
                            toi.uuid
                    )
                    SELECT 
                        challan.uuid,
                        challan.created_at AS challan_date,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN CONCAT('TC', to_char(challan.created_at, 'YY'), '-', (challan.id::text)) 
                            ELSE CONCAT('ZC', to_char(challan.created_at, 'YY'), '-', (challan.id::text)) 
                        END AS challan_id,
                        packing_list_grouped.gate_pass,
                        challan.created_by,
                        users.name AS created_by_name,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN challan.thread_order_info_uuid 
                            ELSE challan.order_info_uuid 
                        END AS order_info_uuid,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN CONCAT('ST', 
                                CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END,
                                to_char(toi.created_at, 'YY'), '-', (toi.id::text)
                            ) 
                            ELSE vodf.order_number 
                        END AS order_number,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN pi_cash_grouped_thread.pi_numbers 
                            ELSE pi_cash_grouped.pi_numbers 
                        END AS pi_numbers,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN pi_cash_grouped_thread.lc_numbers 
                            ELSE pi_cash_grouped.lc_numbers 
                        END AS lc_numbers,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpm.uuid 
                            ELSE vodf.marketing_uuid 
                        END AS marketing_uuid,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpm.name 
                            ELSE vodf.marketing_name 
                        END AS marketing_name,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpp.uuid 
                            ELSE vodf.party_uuid 
                        END AS party_uuid,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpp.name 
                            ELSE vodf.party_name 
                        END AS party_name,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpf.uuid 
                            ELSE vodf.factory_uuid 
                        END AS factory_uuid,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpf.name 
                            ELSE vodf.factory_name 
                        END AS factory_name,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN toe.uuid 
                            ELSE oe.uuid 
                        END) AS order_entry_uuid,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN CONCAT(toe.style, ' - ', toe.color) 
                            ELSE CONCAT(oe.style, ' - ', oe.color, ' - ', 
                                CASE 
                                    WHEN vodf.is_inch = 1 
                                    THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                                    ELSE CAST(oe.size AS NUMERIC)
                                END) 
                        END) AS style_color_size,
                        ARRAY_AGG(CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN CONCAT(tcl.count, ' - ', tcl.length) 
                            ELSE NULL 
                        END )AS count_length_name,
                        packing_list_grouped.total_quantity::float8,
                        challan.receive_status,
                        challan.receive_status_by,
                        challan.receive_status_date,
                        receive_status_by.name AS receive_status_by_name,
                        packing_list_grouped.total_short_quantity::float8,
                        packing_list_grouped.total_reject_quantity::float8,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN 'thread' 
                            ELSE 'zipper' 
                        END AS product,
                        challan.is_delivered,
                        challan.is_delivered_date,
                        challan.is_delivered_by,
                        is_delivered_by.name AS is_delivered_by_name
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
                    LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
                    LEFT JOIN thread.order_entry toe ON toe.uuid = ple.thread_order_entry_uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN thread.count_length tcl ON toe.count_length_uuid = tcl.uuid
                    LEFT JOIN public.marketing tpm ON toi.marketing_uuid = tpm.uuid
                    LEFT JOIN public.party tpp ON toi.party_uuid = tpp.uuid
                    LEFT JOIN public.factory tpf ON toi.factory_uuid = tpf.uuid
                    LEFT JOIN pi_cash_grouped_thread ON toi.uuid = pi_cash_grouped_thread.order_info_uuid
                    LEFT JOIN hr.users receive_status_by ON challan.receive_status_by = receive_status_by.uuid
                    LEFT JOIN hr.users is_delivered_by ON challan.is_delivered_by = is_delivered_by.uuid
                    WHERE
                        ${own_uuid == null ? sql`TRUE` : sql`CASE WHEN pl.item_for IN ('thread', 'sample_thread') THEN toi.marketing_uuid = ${marketingUuid} ELSE vodf.marketing_uuid = ${marketingUuid} END`}
                        AND ${
							from_date && to_date
								? sql`challan.created_at BETWEEN ${from_date}::timestamp AND ${to_date}::timestamp + interval '23 hours 59 minutes 59 seconds'`
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
                        packing_list_grouped.total_reject_quantity,
                        pi_cash_grouped_thread.pi_numbers,
						pi_cash_grouped_thread.lc_numbers,
						pi_cash_grouped.pi_numbers,
						pi_cash_grouped.lc_numbers,
                        is_delivered_by.name,
                        receive_status_by.name,
                        challan.receive_status,
                        challan.receive_status_by,
                        challan.receive_status_date,
                        challan.is_delivered,
                        challan.is_delivered_date
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
	const { own_uuid, from, to } = req?.query;

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
                CASE WHEN is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)) END AS pi_cash_number,
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
                CASE WHEN lc.uuid IS NOT NULL THEN concat('LC', to_char(lc.created_at, 'YY'), '-', (lc.id::text)) ELSE NULL END as file_number,
                lc.created_at as lc_created_at,
                pi_cash_entry_order_numbers.order_object,
                pi_cash_entry_order_numbers.thread_order_object,
                pi_cash.is_lc_input_manual
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
                    array_agg(DISTINCT CASE WHEN toi.uuid is NOT NULL THEN concat('ST', to_char(toi.created_at, 'YY'), '-', (toi.id::text)) ELSE NULL END) as thread_order_numbers, 
                    jsonb_agg(DISTINCT jsonb_build_object('value', toi.uuid, 'label', CASE WHEN toi.uuid is NOT NULL THEN concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text)) ELSE NULL END)) as thread_order_object,
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
            WHERE (pi_cash_entry_order_numbers.order_numbers IS NOT NULL OR pi_cash_entry_order_numbers.thread_order_numbers IS NOT NULL)
            AND ${own_uuid ? sql`pi_cash.marketing_uuid = ${marketingUuid}` : sql`1=1`}
            AND ${from && to ? sql`pi_cash.created_at::date BETWEEN ${from} AND ${to}` : sql`1=1`}
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
	//console.log(own_uuid);

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			if (
				marketingUuidData &&
				marketingUuidData.rows &&
				marketingUuidData.rows.length > 0
			) {
				marketingUuid = marketingUuidData.rows[0].uuid;
			} else {
				marketingUuid = null;
			}
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
                vodf_grouped.total_non_pi_value::float8,
                true as is_zipper
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
                WHERE 
                    order_exists_in_pi.order_info_uuid IS NULL 
                    AND vodf.is_sample = 0
                    AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                GROUP BY
                    vodf.party_uuid
            ) vodf_grouped ON party.uuid = vodf_grouped.party_uuid
            WHERE 
                (vodf_grouped.total_quantity > 0 OR 
                vodf_grouped.total_delivered > 0 OR 
                vodf_grouped.total_pi > 0 OR
                vodf_grouped.total_non_pi > 0) 
            UNION 
            SELECT 
                party.uuid,
                party.name,
                toi_grouped.order_object,
                toi_grouped.total_quantity::float8,
                toi_grouped.total_delivered::float8,
                toi_grouped.total_pi::float8,
                toi_grouped.total_non_pi::float8,
                toi_grouped.total_quantity_value::float8,
                toi_grouped.total_delivered_value::float8,
                toi_grouped.total_pi_value::float8,
                toi_grouped.total_non_pi_value::float8,
                false as is_zipper
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    jsonb_agg(DISTINCT jsonb_build_object('value', toi.uuid, 'label', CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text)))) as order_object,
                    SUM(toe.quantity) AS total_quantity,
                    SUM(toe.delivered) AS total_delivered,
                    SUM(toe.pi) AS total_pi,
                    SUM(toe.quantity - toe.pi) AS total_non_pi,
                    SUM(toe.quantity * toe.party_price) AS total_quantity_value,
                    SUM(toe.delivered * toe.party_price) AS total_delivered_value,
                    SUM(toe.pi * toe.party_price) AS total_pi_value,
                    SUM((toe.quantity - toe.pi) * toe.party_price) AS total_non_pi_value,
                    toi.party_uuid
                FROM
                    thread.order_entry toe
                LEFT JOIN 
                    thread.order_info toi ON toe.order_info_uuid = toi.uuid
                LEFT JOIN (
                    SELECT DISTINCT toi.uuid
                    FROM commercial.pi_cash_entry
                    LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                ) order_exists_in_pi ON toi.uuid = order_exists_in_pi.uuid
                WHERE 
                    order_exists_in_pi.uuid IS NULL 
                    AND toi.is_sample = 0
                    AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
                GROUP BY
                    toi.party_uuid
            ) toi_grouped ON party.uuid = toi_grouped.party_uuid
            WHERE 
                (toi_grouped.total_quantity > 0 OR 
                toi_grouped.total_delivered > 0 OR 
                toi_grouped.total_pi > 0 OR 
                toi_grouped.total_non_pi > 0) 
                
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

export async function PiToBeRegisterMarketingWise(req, res, next) {
	const { own_uuid } = req?.query;
	//console.log(own_uuid);

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			if (
				marketingUuidData &&
				marketingUuidData.rows &&
				marketingUuidData.rows.length > 0
			) {
				marketingUuid = marketingUuidData.rows[0].uuid;
			} else {
				marketingUuid = null;
			}
		}
		const query = sql`
            SELECT 
                marketing.uuid,
                marketing.name,
                vodf_grouped.order_object,
                vodf_grouped.total_quantity::float8,
                vodf_grouped.total_delivered::float8,
                vodf_grouped.total_pi::float8,
                vodf_grouped.total_non_pi::float8,
                vodf_grouped.total_quantity_value::float8,
                vodf_grouped.total_delivered_value::float8,
                vodf_grouped.total_pi_value::float8,
                vodf_grouped.total_non_pi_value::float8,
                true as is_zipper
            FROM
                public.marketing marketing
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
                    vodf.marketing_uuid
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
                WHERE 
                    order_exists_in_pi.order_info_uuid IS NULL 
                    AND vodf.is_sample = 0
                    AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                GROUP BY
                    vodf.marketing_uuid
            ) vodf_grouped ON marketing.uuid = vodf_grouped.marketing_uuid
            WHERE 
                (vodf_grouped.total_quantity > 0 OR 
                vodf_grouped.total_delivered > 0 OR 
                vodf_grouped.total_pi > 0 OR
                vodf_grouped.total_non_pi > 0)
            UNION 
            SELECT 
                marketing.uuid,
                marketing.name,
                toi_grouped.order_object,
                toi_grouped.total_quantity::float8,
                toi_grouped.total_delivered::float8,
                toi_grouped.total_pi::float8,
                toi_grouped.total_non_pi::float8,
                toi_grouped.total_quantity_value::float8,
                toi_grouped.total_delivered_value::float8,
                toi_grouped.total_pi_value::float8,
                toi_grouped.total_non_pi_value::float8,
                false as is_zipper
            FROM
                public.marketing marketing
            LEFT JOIN (
                SELECT 
                    jsonb_agg(DISTINCT jsonb_build_object('value', toi.uuid, 'label', CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text)))) as order_object,
                    SUM(toe.quantity) AS total_quantity,
                    SUM(toe.delivered) AS total_delivered,
                    SUM(toe.pi) AS total_pi,
                    SUM(toe.quantity - toe.pi) AS total_non_pi,
                    SUM(toe.quantity * toe.party_price) AS total_quantity_value,
                    SUM(toe.delivered * toe.party_price) AS total_delivered_value,
                    SUM(toe.pi * toe.party_price) AS total_pi_value,
                    SUM((toe.quantity - toe.pi) * toe.party_price) AS total_non_pi_value,
                    toi.marketing_uuid
                FROM
                    thread.order_entry toe
                LEFT JOIN 
                    thread.order_info toi ON toe.order_info_uuid = toi.uuid
                LEFT JOIN (
                    SELECT DISTINCT toi.uuid
                    FROM commercial.pi_cash_entry
                    LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                ) order_exists_in_pi ON toi.uuid = order_exists_in_pi.uuid
                WHERE 
                    order_exists_in_pi.uuid IS NULL 
                    AND toi.is_sample = 0
                    AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
                GROUP BY
                    toi.marketing_uuid
            ) toi_grouped ON marketing.uuid = toi_grouped.marketing_uuid
            WHERE 
                (toi_grouped.total_quantity > 0 OR 
                toi_grouped.total_delivered > 0 OR 
                toi_grouped.total_pi > 0 OR 
                toi_grouped.total_non_pi > 0)
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
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', (lc.id::text)) AS file_number,
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
	const { status, own_uuid, time_from, time_to } = req.query;

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
                CONCAT('TB', to_char(batch.created_at, 'YY'), '-', (batch.id::text)) AS batch_number,
                batch.created_at AS batch_created_at,
                batch.machine_uuid,
                machine.name as machine_name,
                order_entry.uuid as order_entry_uuid,
                order_info.uuid as order_info_uuid,
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', (order_info.id::text)) as order_number,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.is_sample,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_entry.style,
                order_entry.color,
                order_entry.color_ref,
                recipe.name as recipe_name,
                order_entry.swatch_approval_date,
                order_entry.count_length_uuid,
                CONCAT('"',count_length.count) AS count,
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
            LEFT JOIN 
                public.machine ON batch.machine_uuid = machine.uuid
            LEFT JOIN (
                SELECT 
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as yarn_quantity,
                    SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                    batch_entry.batch_uuid,
                    count_length.uuid as count_length_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    batch_entry.batch_uuid, count_length.uuid
            ) batch_entry_quantity_length ON (batch.uuid = batch_entry_quantity_length.batch_uuid AND order_entry.count_length_uuid = batch_entry_quantity_length.count_length_uuid)
            LEFT JOIN (
                SELECT 
                    SUM(coning_production_quantity) as total_coning_production_quantity,
                    count_length.uuid as count_length_uuid,
                    batch_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    batch_uuid, count_length.uuid
            ) batch_entry_coning ON (batch.uuid = batch_entry_coning.batch_uuid AND count_length.uuid = batch_entry_coning.count_length_uuid)
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
                    SUM(CASE WHEN (pl.gate_pass = 0 AND ple.thread_order_entry_uuid IS NOT NULL) THEN ple.quantity ELSE 0 END) AS total_delivery_balance_quantity
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
            AND ${time_from && time_to ? sql`batch.created_at::TIMESTAMP >= ${time_from}::TIMESTAMP AND batch.created_at::TIMESTAMP <= ${time_to}::TIMESTAMP` : sql`TRUE`}
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

		query.append(sql` ORDER BY batch.created_at DESC`);

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
            WHERE vodf.order_description_uuid IS NOT NULL 
                AND vodf.is_cancelled = FALSE
                AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
            ORDER BY vodf.item_name DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

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
                CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', (order_info.id::text)) as order_number,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0)::float8 as total_quantity,
                coalesce(prod_quantity.total_coning_carton_quantity,0)::float8 as total_coning_carton_quantity
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
	const { own_uuid, from, to } = req?.query;

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
            WITH
                pi_cash_grouped AS (
                    SELECT 
                        vodf.order_info_uuid, 
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'pi_number', CASE
                                    WHEN pi_cash.is_pi = 1 THEN concat(
                                        'PI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)
                                    )
                                    ELSE concat(
                                        'CI', to_char(pi_cash.created_at, 'YY'), '-', (pi_cash.id::text)
                                    )
                                END, 'pi_cash_uuid', pi_cash.uuid
                            )
                        ) as pi_numbers, 
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                                'lc_number', CASE WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number) ELSE NULL END, 'lc_uuid', lc.uuid
                            )
                        ) as lc_numbers
                    FROM
                        zipper.v_order_details_full vodf
                        LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                        LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                        LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
                        LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
                        LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
                    WHERE
                        pi_cash.id IS NOT NULL
                    GROUP BY
                        vodf.order_info_uuid
                ),
                sfg_production_sum AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        SUM(
                            CASE
                                WHEN sfg_prod.section = 'finishing' THEN sfg_prod.production_quantity
                                ELSE 0
                            END
                        ) AS finishing_quantity
                    FROM
                        zipper.finishing_batch_production sfg_prod
                        LEFT JOIN zipper.finishing_batch_entry fbe ON sfg_prod.finishing_batch_entry_uuid = fbe.uuid
                        LEFT JOIN zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    GROUP BY
                        oe.uuid
                ),
                dyed_tape_transaction_sum AS (
                    SELECT dtt.order_description_uuid, SUM(dtt.trx_quantity) AS total_trx_quantity
                    FROM zipper.dyed_tape_transaction dtt
                    GROUP BY
                        dtt.order_description_uuid
                ),
                dyed_tape_transaction_from_stock_sum AS (
                    SELECT dttfs.order_description_uuid, SUM(dttfs.trx_quantity) AS total_trx_quantity
                    FROM zipper.dyed_tape_transaction_from_stock dttfs
                    GROUP BY
                        dttfs.order_description_uuid
                ),
                slider_production_sum AS (
                    SELECT
                        od.uuid as order_description_uuid,
                        SUM(
                            CASE
                                WHEN production.section = 'coloring' THEN production.production_quantity
                                ELSE 0
                            END
                        ) AS coloring_production_quantity,
                        SUM(
                            CASE
                                WHEN production.section = 'coloring' THEN production.weight
                                ELSE 0
                            END
                        ) as coloring_production_quantity_weight
                    FROM slider.production
                        LEFT JOIN slider.stock ON production.stock_uuid = stock.uuid
                        LEFT JOIN zipper.finishing_batch ON stock.finishing_batch_uuid = finishing_batch.uuid
                        LEFT JOIN zipper.order_description od ON finishing_batch.order_description_uuid = od.uuid
                    GROUP BY
                        od.uuid
                ),
                dyeing_batch_entry_sum AS (
                    SELECT
                        dyeing_batch_entry.dyeing_batch_uuid,
                        dyeing_batch_entry.sfg_uuid,
                        SUM(dyeing_batch_entry.quantity) as total_quantity,
                        SUM(
                            dyeing_batch_entry.production_quantity_in_kg
                        ) as total_production_quantity
                    FROM zipper.dyeing_batch_entry
                    GROUP BY
                        dyeing_batch_entry.dyeing_batch_uuid,
                        dyeing_batch_entry.sfg_uuid
                ),
                dyeing_batch_main AS (
                    SELECT
                        oe.uuid as order_entry_uuid,
                        dyeing_batch.uuid as dyeing_batch_uuid,
                        CONCAT(
                            'B',
                            to_char(dyeing_batch.created_at, 'YY'),
                            '-',
                            (dyeing_batch.id::text)
                        ) as dyeing_batch_number,
                        dyeing_batch.production_date as production_date,
                        dbes.total_quantity as total_quantity,
                        dbes.total_production_quantity as total_production_quantity,
                        CASE
                            WHEN dyeing_batch.received = 1 THEN TRUE
                            ELSE FALSE
                        END as received,
                        machine.name as dyeing_machine,
                        dyeing_batch.created_at as batch_created_at,
                        ROUND(
                            (
                                CASE
                                    WHEN vodf.order_type = 'tape' THEN (
                                        (
                                            tcr.top + tcr.bottom + dbes.total_quantity
                                        ) * 1
                                    ) / 100 / tcr.dyed_mtr_per_kg::float8
                                    ELSE (
                                        (
                                            tcr.top + tcr.bottom + CASE
                                                WHEN vodf.is_inch = 1 THEN CAST(
                                                    CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC
                                                )
                                                ELSE CAST(oe.size AS NUMERIC)
                                            END
                                        ) * dbes.total_quantity::float8
                                    ) / 100 / tcr.dyed_mtr_per_kg::float8
                                END
                            )::numeric,
                            3
                        ) as expected_kg
                    FROM
                        zipper.dyeing_batch dyeing_batch
                        LEFT JOIN public.machine machine ON dyeing_batch.machine_uuid = machine.uuid
                        LEFT JOIN dyeing_batch_entry_sum dbes ON dyeing_batch.uuid = dbes.dyeing_batch_uuid
                        LEFT JOIN zipper.sfg sfg ON dbes.sfg_uuid = sfg.uuid
                        LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                        LEFT JOIN zipper.tape_coil_required tcr ON vodf.item = tcr.item_uuid
                        AND vodf.zipper_number = tcr.zipper_number_uuid
                        AND (
                            CASE
                                WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT'
                                ELSE vodf.end_type = tcr.end_type_uuid
                            END
                        )
                    WHERE
                        vodf.order_description_uuid IS NOT NULL
                        AND vodf.is_cancelled = FALSE
                        AND (
                            lower(vodf.item_name) != 'nylon'
                            OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
                        )
                )
            SELECT
                vodf.order_info_uuid,
                vodf.item,
                vodf.created_at,
                vodf.updated_at,
                vodf.order_number,
                vodf.party_name,
                vodf.marketing_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.item_name,
                CONCAT(
                    vodf.item_name,
                    CASE
                        WHEN vodf.nylon_stopper_name IS NOT NULL THEN ' - '
                        ELSE ' '
                    END,
                    vodf.nylon_stopper_name
                ) as item_name_with_stopper,
                vodf.nylon_stopper_name,
                vodf.zipper_number_name,
                vodf.end_type_name,
                oe.uuid as order_entry_uuid,
                oe.style,
                oe.color,
                oe.color_ref,
                oe.color_ref_entry_date,
                oe.color_ref_update_date,
                oe.size::float8,
                oe.quantity::float8,
                oe.party_price::float8,
                oe.company_price::float8,
                oe.swatch_approval_date,
                CASE
                    WHEN sfg.recipe_uuid IS NOT NULL THEN oe.swatch_approval_date
                    ELSE null
                END as swatch_approval_date,
                CASE
                    WHEN sfg.recipe_uuid IS NULL THEN oe.quantity::float8
                    ELSE 0
                END as not_approved_quantity,
                CASE
                    WHEN sfg.recipe_uuid IS NOT NULL THEN oe.quantity::float8
                    ELSE 0
                END as approved_quantity,
                sfg.recipe_uuid,
                recipe.name as recipe_name,
                coalesce(oe.quantity, 0)::float8 as total_quantity,
                CASE
                    WHEN (
                        vodf.end_type_name = '2 Way - Close End'
                        OR vodf.end_type_name = '2 Way - Open End'
                    ) THEN oe.quantity::float8 * 2
                    ELSE oe.quantity::float8
                END as total_slider_required,
                sfg.delivered::float8,
                sfg.warehouse::float8,
                (
                    oe.quantity::float8 - sfg.delivered::float8
                ) as balance_quantity,
                vodf.order_type,
                vodf.is_inch,
                CASE
                    WHEN vodf.order_type = 'tape' THEN 'Meter'
                    WHEN vodf.order_type = 'slider' THEN 'Pcs'
                    WHEN vodf.is_inch = 1 THEN 'Inch'
                    ELSE 'Cm'
                END as unit,
                coalesce(
                    sfg_production_sum.finishing_quantity,
                    0
                )::float8 as total_finishing_quantity,
                (
                    COALESCE(
                        dyed_tape_transaction_sum.total_trx_quantity,
                        0
                    ) + COALESCE(
                        dyed_tape_transaction_from_stock_sum.total_trx_quantity,
                        0
                    )
                )::float8 AS total_dyeing_quantity,
                coalesce(
                    slider_production_sum.coloring_production_quantity,
                    0
                )::float8 as total_coloring_quantity,
                coalesce(
                    slider_production_sum.coloring_production_quantity_weight,
                    0
                )::float8 as total_coloring_quantity_weight,
                coalesce(
                    pi_cash_grouped.pi_numbers,
                    '[]'
                ) as pi_numbers,
                coalesce(
                    pi_cash_grouped.lc_numbers,
                    '[]'
                ) as lc_numbers,
                dyeing_batch_main.expected_kg,
                dyeing_batch_main.dyeing_batch_uuid,
                dyeing_batch_main.dyeing_batch_number,
                dyeing_batch_main.production_date,
                dyeing_batch_main.total_quantity::float8,
                dyeing_batch_main.total_production_quantity::float8,
                dyeing_batch_main.received,
                dyeing_batch_main.dyeing_machine,
                dyeing_batch_main.batch_created_at,
                dyeing_batch_main.expected_kg as batch_expected_kg,
                vodf.sno_from_head_office,
                vodf.sno_from_head_office_time,
                vodf.sno_from_head_office_by,
                vodf.sno_from_head_office_by_name,
                vodf.receive_by_factory,
                vodf.receive_by_factory_time,
                vodf.receive_by_factory_by,
                vodf.receive_by_factory_by_name,
                vodf.production_pause,
                vodf.production_pause_time,
                vodf.production_pause_by,
                vodf.production_pause_by_name
            FROM
                zipper.v_order_details_full vodf
                LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
                LEFT JOIN lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
                LEFT JOIN sfg_production_sum ON sfg_production_sum.order_entry_uuid = oe.uuid
                LEFT JOIN dyed_tape_transaction_sum ON dyed_tape_transaction_sum.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN dyed_tape_transaction_from_stock_sum ON dyed_tape_transaction_from_stock_sum.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN slider_production_sum ON slider_production_sum.order_description_uuid = vodf.order_description_uuid
                LEFT JOIN pi_cash_grouped ON vodf.order_info_uuid = pi_cash_grouped.order_info_uuid
                LEFT JOIN dyeing_batch_main ON oe.uuid = dyeing_batch_main.order_entry_uuid
            WHERE 
                vodf.order_description_uuid IS NOT NULL 
                AND vodf.is_cancelled = FALSE
                ${own_uuid ? sql` AND vodf.marketing_uuid = ${marketingUuid}` : sql``}
                ${from && to ? sql` AND vodf.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
            ORDER BY vodf.item_name DESC
    `;

		// AND (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8) > 0

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const filteredData = data?.rows?.reduce((acc, curr) => {
			const orderEntryExists = acc.some(
				(item) => item.order_entry_uuid === curr.order_entry_uuid
			);
			const orderDescriptionExists = acc.some(
				(item) =>
					item.order_description_uuid === curr.order_description_uuid
			);

			if (orderEntryExists && orderDescriptionExists) {
				// Both duplicate: dashes for all relevant fields
				acc.push({
					...curr,
					quantity: '-',
					approved_quantity: '-',
					not_approved_quantity: '-',
					total_quantity: '-',
					total_slider_required: '-',
					balance_quantity: '-',
					total_finishing_quantity: '-',
					expected_kg: '-',
					received: '-',
					total_dyeing_quantity: '-',
					total_coloring_quantity: '-',
					total_coloring_quantity_weight: '-',
				});
			} else if (orderEntryExists) {
				// Duplicate order_entry_uuid: dashes for entry-level fields
				acc.push({
					...curr,
					quantity: '-',
					approved_quantity: '-',
					not_approved_quantity: '-',
					total_quantity: '-',
					total_slider_required: '-',
					balance_quantity: '-',
					total_finishing_quantity: '-',
					expected_kg: '-',
					received: '-',
				});
			} else if (orderDescriptionExists) {
				// Duplicate order_description_uuid: dashes for description-level fields
				acc.push({
					...curr,
					total_dyeing_quantity: '-',
					total_coloring_quantity: '-',
					total_coloring_quantity_weight: '-',
				});
			} else {
				// First occurrence: real values
				acc.push(curr);
			}
			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report S&M',
		};

		res.status(200).json({ toast, data: filteredData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadSnm(req, res, next) {
	const { own_uuid, from, to } = req?.query;

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
    WITH
    pi_cash_grouped_thread AS (
        SELECT
            toi.uuid as order_info_uuid,
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'pi_number',
                    CASE
                        WHEN pi_cash.is_pi = 1 THEN concat(
                            'PI',
                            to_char(pi_cash.created_at, 'YY'),
                            '-',
                            (pi_cash.id::text)
                        )
                        ELSE concat(
                            'CI',
                            to_char(pi_cash.created_at, 'YY'),
                            '-',
                            (pi_cash.id::text)
                        )
                    END,
                    'pi_cash_uuid',
                    pi_cash.uuid
                )
            ) as pi_numbers,
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'lc_number',
                    CASE
                        WHEN lc.lc_number IS NOT NULL THEN concat('''', lc.lc_number)
                        ELSE NULL
                    END,
                    'lc_uuid',
                    lc.uuid
                )
            ) as lc_numbers
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
            LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
            LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
        WHERE
            pi_cash.id IS NOT NULL
        GROUP BY
            toi.uuid
    )
SELECT
    order_info.uuid,
    order_info.created_at,
    order_info.updated_at,
    'Sewing Thread' as item_name,
    order_info.party_uuid,
    party.name as party_name,
    order_info.marketing_uuid,
    marketing.name as marketing_name,
    CONCAT(
        'ST',
        CASE
            WHEN order_info.is_sample = 1 THEN 'S'
            ELSE ''
        END,
        to_char(order_info.created_at, 'YY'),
        '-',
        (order_info.id::text)
    ) as order_number,
    order_entry.uuid as order_entry_uuid,
    order_entry.style,
    order_entry.color,
    order_entry.color_ref,
    order_entry.color_ref_entry_date,
    order_entry.color_ref_update_date,
    order_entry.recipe_uuid,
    order_entry.quantity::float8,
    order_entry.party_price::float8,
    order_entry.company_price::float8,
    order_entry.swatch_approval_date,
    order_entry.recipe_uuid,
    recipe.name as recipe_name,
    order_entry.swatch_approval_date,
    CASE
        WHEN order_entry.recipe_uuid IS NULL THEN order_entry.quantity::float8
        ELSE 0
    END as not_approved_quantity,
    CASE
        WHEN order_entry.recipe_uuid IS NOT NULL THEN order_entry.quantity::float8
        ELSE 0
    END as approved_quantity,
    CONCAT('"', count_length.count) as count,
    count_length.length,
    CONCAT(
        '"',
        count_length.count,
        ' - ',
        count_length.length
    ) as count_length_name,
    order_info.uuid as order_info_uuid,
    order_entry.delivered::float8,
    order_entry.warehouse::float8,
    (
        order_entry.quantity::float8 - order_entry.delivered::float8
    ) as balance_quantity,
    coalesce(
        pi_cash_grouped_thread.pi_numbers,
        '[]'
    ) as pi_numbers,
    coalesce(
        pi_cash_grouped_thread.lc_numbers,
        '[]'
    ) as lc_numbers,
    coalesce(
        batch_production_sum.coning_production_quantity,
        0
    )::float8 as total_coning_production_quantity,
    coalesce(
        batch_production_sum.yarn_quantity,
        0
    )::float8 as total_yarn_quantity,
    (
        order_entry.quantity * count_length.max_weight
    )::float8 as total_expected_weight,
    batch.batch_uuid,
    batch.batch_number,
    batch.production_date,
    batch.total_quantity::float8,
    batch.yarn_issued::float8,
    batch.is_drying_complete,
    batch.machine,
    batch.batch_created_at,
    batch.expected_kg as batch_expected_kg,
    order_info.sno_from_head_office,
    order_info.sno_from_head_office_time,
    order_info.sno_from_head_office_by,
    sno_from_head_office_by.name as sno_from_head_office_by_name,
    order_info.receive_by_factory,
    order_info.receive_by_factory_time,
    order_info.receive_by_factory_by,
    receive_by_factory_by.name as receive_by_factory_by_name,
    order_info.production_pause,
    order_info.production_pause_time,
    order_info.production_pause_by,
    production_pause_by.name as production_pause_by_name
    FROM 
        thread.order_info
    LEFT JOIN thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
    LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
    LEFT JOIN lab_dip.recipe ON order_entry.recipe_uuid = recipe.uuid
    LEFT JOIN public.party ON order_info.party_uuid = party.uuid
    LEFT JOIN public.marketing ON order_info.marketing_uuid = marketing.uuid
    LEFT JOIN pi_cash_grouped_thread ON order_info.uuid = pi_cash_grouped_thread.order_info_uuid
    LEFT JOIN (
        SELECT
            toi.uuid as order_info_uuid,
            SUM(toe.quantity) as total_quantity
        FROM thread.order_entry toe
            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
        GROUP BY
            toi.uuid
    ) order_info_total_quantity ON order_info.uuid = order_info_total_quantity.order_info_uuid
    LEFT JOIN (
        SELECT
            order_entry.uuid as order_entry_uuid,
            SUM(
                batch_entry.coning_production_quantity
            ) AS coning_production_quantity,
            SUM(batch_entry.yarn_quantity) AS yarn_quantity
        FROM thread.batch_entry
            LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
            LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
        GROUP BY
            order_entry.uuid
    ) batch_production_sum ON batch_production_sum.order_entry_uuid = order_entry.uuid
    LEFT JOIN (
        SELECT
            order_entry.uuid as order_entry_uuid,
            batch.uuid as batch_uuid,
            CONCAT(
                'B',
                to_char(batch.created_at, 'YY'),
                '-',
                (batch.id::text)
            ) as batch_number,
            batch.production_date as production_date,
            batch_entry_quantity_length.total_quantity as total_quantity,
            batch_entry_quantity_length.total_weight as yarn_issued,
            batch.is_drying_complete,
            machine.name as machine,
            batch.created_at as batch_created_at,
            ROUND(
                batch_entry_quantity_length.total_quantity::numeric * tcl.max_weight::numeric,
                3
            ) as expected_kg
        FROM
            thread.batch
            LEFT JOIN public.machine ON batch.machine_uuid = machine.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(batch_entry.yarn_quantity) as total_weight,
                    batch_entry.batch_uuid,
                    batch_entry.order_entry_uuid
                FROM thread.batch_entry
                GROUP BY
                    batch_entry.batch_uuid,
                    batch_entry.order_entry_uuid
            ) batch_entry_quantity_length ON batch.uuid = batch_entry_quantity_length.batch_uuid
            LEFT JOIN thread.order_entry ON batch_entry_quantity_length.order_entry_uuid = order_entry.uuid
            LEFT JOIN thread.count_length tcl ON order_entry.count_length_uuid = tcl.uuid
    ) batch ON order_entry.uuid = batch.order_entry_uuid
    LEFT JOIN hr.users sno_from_head_office_by ON order_info.sno_from_head_office_by = sno_from_head_office_by.uuid
    LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
    LEFT JOIN hr.users production_pause_by ON order_info.production_pause_by = production_pause_by.uuid
    WHERE 
        order_entry.quantity > 0 AND order_entry.quantity IS NOT NULL
        ${own_uuid == null ? sql`` : sql` AND order_info.marketing_uuid = ${marketingUuid}`}
        ${from && to ? sql` AND order_info.created_at BETWEEN ${from}::TIMESTAMP AND ${to}::TIMESTAMP + INTERVAL '23 hours 59 minutes 59 seconds'` : sql``}
    ORDER BY order_info.created_at DESC
    `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const filteredData = data?.rows?.reduce((acc, curr) => {
			const exists = acc.some(
				(item) =>
					item.order_entry_uuid === curr.order_entry_uuid &&
					item.order_info_uuid === curr.order_info_uuid
			);
			if (exists) {
				// Push a duplicate with dashes
				acc.push({
					...curr,
					quantity: '-',
					not_approved_quantity: '-',
					approved_quantity: '-',
					total_yarn_quantity: '-',
					total_coning_production_quantity: '-',
					warehouse: '-',
					delivered: '-',
					balance_quantity: '-',
					party_price: '-',
					company_price: '-',
					total_expected_weight: '-',
					total_coning_carton_quantity: '-',
				});
			} else {
				// Push the original with real values
				acc.push(curr);
			}
			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: filteredData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function dailyProductionReport(req, res, next) {
	const { from_date, to_date, type } = req.query;
	const { own_uuid } = req?.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	const sort_of_type = ['Nylon', 'Vislon', 'Metal', 'Thread'];

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
                            CASE WHEN lower(vodf.end_type_name) = 'close end' THEN ple.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) = 'open end' THEN ple.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_open_end_quantity, 
                    coalesce(SUM(ple.quantity), 0)::float8 as total_prod_quantity
                FROM 
                    delivery.packing_list_entry ple
                    LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                    LEFT JOIN zipper.sfg ON ple.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid 
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid 
                WHERE 
                    ${from_date && to_date ? sql`pl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`} 
                    AND ${type == 'bulk' ? sql`vodf.is_sample = 0` : type == 'bulk' ? sql`vodf.is_sample = 1` : sql`1=1`}
                GROUP BY 
                    oe.uuid
                ),
                running_all_sum_thread AS (
                    SELECT 
                        toe.uuid as order_entry_uuid,
                        coalesce(
                            SUM(
                                CASE WHEN pl.item_for IN ('thread', 'sample_thread') THEN ple.quantity ::float8 ELSE 0 END
                            ),
                            0
                        )::float8 AS total_close_end_quantity,
                        0 as total_open_end_quantity,
                        coalesce(SUM(ple.quantity), 0)::float8 as total_prod_quantity
                    FROM
                        delivery.packing_list_entry ple
                        LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                        LEFT JOIN thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                        LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                        AND toi.uuid = toe.order_info_uuid
                    WHERE
                        ${from_date && to_date ? sql`pl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
                        AND ${type == 'bulk' ? sql`toi.is_sample = 0` : type == 'bulk' ? sql`toi.is_sample = 1` : sql`1=1`}
                    GROUP BY
                        toe.uuid
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
                    order_info_total_quantity.total_quantity,
					vodf.item_description,
					vodf.end_type,
					vodf.end_type_name,
					vodf.order_type,
					vodf.is_inch,
                    oe.color,
                    oe.color_ref,
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
                    SUM(COALESCE(running_all_sum.total_close_end_quantity, 0)::float8) as running_total_close_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_open_end_quantity, 0)::float8) as running_total_open_end_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8) as running_total_quantity, 
                    SUM(COALESCE(running_all_sum.total_prod_quantity, 0)::float8 / 12) as running_total_quantity_dzn
                FROM 
                    zipper.v_order_details_full vodf 
                LEFT JOIN 
                    zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid 
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
                WHERE 
                    vodf.item_description IS NOT NULL AND vodf.item_description != '---'
                    AND coalesce(running_all_sum.total_prod_quantity, 0) > 0 AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                    AND ${type == 'bulk' ? sql`vodf.is_sample = 0` : type == 'sample' ? sql`vodf.is_sample = 1` : sql`TRUE`}  
                GROUP BY 
                    oe.company_price,
                    oe.color,
                    oe.color_ref,
                    oe.size,
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
            UNION
                SELECT 
                    toi.marketing_uuid,
                    marketing.name as marketing_name,
                    toi.uuid as order_info_uuid,
                    CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text)) as order_number,
                    'Sewing Thread' as item_name,
                    'Thread' as type,
                    toi.party_uuid,
                    party.name as party_name,
                    count_length.uuid as order_description_uuid,
                    order_info_total_quantity.total_quantity,
                    CONCAT(count_length.count, ' - ', count_length.length) as item_description,
                    null as end_type,
                    null as end_type_name,
                    null as order_type,
                    null as is_inch,
                    toe.color,
                    toe.color_ref,
                    count_length.length::float8 as size,
                    'Mtr' as unit,
                    'Cone' as price_unit,
                    ROUND(toe.company_price::numeric, 3) as company_price_dzn,
                    ROUND(toe.company_price, 3) as company_price_pcs,
                    'running' as running,
                    SUM(COALESCE(running_all_sum_thread.total_close_end_quantity, 0)::float8) as running_total_close_end_quantity,
                    0 as running_total_open_end_quantity,
                    SUM(COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8) as running_total_quantity,
                    SUM(COALESCE(running_all_sum_thread.total_prod_quantity, 0)::float8 / 12) as running_total_quantity_dzn
                FROM
                    thread.order_info toi
                    LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
                    LEFT JOIN thread.count_length count_length ON toe.count_length_uuid = count_length.uuid
                    LEFT JOIN public.party party ON toi.party_uuid = party.uuid
                    LEFT JOIN public.marketing marketing ON toi.marketing_uuid = marketing.uuid
                    LEFT JOIN running_all_sum_thread ON toe.uuid = running_all_sum_thread.order_entry_uuid
                    LEFT JOIN (
                        SELECT 
                            toi.uuid as order_info_uuid,
                            SUM(toe.quantity) as total_quantity
                        FROM
                            thread.order_entry toe
                            LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                        GROUP BY
                            toi.uuid
                    ) order_info_total_quantity ON toi.uuid = order_info_total_quantity.order_info_uuid
                WHERE
                    coalesce(running_all_sum_thread.total_close_end_quantity, 0)::float8  > 0 AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
                    AND ${type == 'bulk' ? sql`toi.is_sample = 0` : type == 'sample' ? sql`toi.is_sample = 1` : sql`TRUE`}
                GROUP BY
                    toe.company_price,
                    toe.color,
                    toe.color_ref,
                    count_length.length,
                    toi.marketing_uuid,
                    marketing.name,
                    order_info_total_quantity.total_quantity,
                    toi.uuid,
                    toi.party_uuid,
                    count_length.uuid,
                    party.name,
                    count_length.count,
                    count_length.length
                ORDER BY
                    type DESC
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
				total_quantity,
				order_description_uuid,
				is_inch,
				color,
				color_ref,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				is_pi,
				conversion_rate,
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
					total_quantity,
					items: [],
				})
			);

			const item = findOrCreateArray(
				order.items,
				['item_description'],
				[item_description],
				() => ({
					item_description,
					other: [],
				})
			);

			item.other.push({
				is_inch,
				color,
				color_ref,
				size,
				unit,
				price_unit,
				company_price_dzn,
				company_price_pcs,
				running_total_close_end_quantity,
				running_total_open_end_quantity,
				running_total_quantity,
				running_total_quantity_dzn,
				running_total_close_end_value,
				running_total_open_end_value,
				running_total_value,
				is_pi,
				conversion_rate,
			});

			return acc;
		}, []);

		groupedData.sort(
			(a, b) =>
				sort_of_type.indexOf(a.type) - sort_of_type.indexOf(b.type)
		);

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
