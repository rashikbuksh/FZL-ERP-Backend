import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';
import { GetMarketingOwnUUID } from '../../variables.js';

// * Zipper Production Status Report

// multiple rows shows for stock.uuid, coloring_production_quantity, teeth_molding_quantity,teeth_coloring_quantity,finishing_quantity columns
export async function zipperProductionStatusReport(req, res, next) {
	const { own_uuid, status } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity END)::float8 AS total_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0)::float8 AS coloring_production_quantity,
                COALESCE(tape_coil_to_dyeing_sum.total_tape_coil_to_dyeing_quantity, 0)::float8 AS total_tape_coil_to_dyeing_quantity,
                COALESCE(dyed_tape_transaction_combined.total_trx_quantity, 0)::float8 AS total_dyeing_transaction_quantity,
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
                    order_description_uuid, 
                    SUM(trx_quantity) AS total_trx_quantity
                FROM (
                    SELECT dtt.order_description_uuid, dtt.trx_quantity
                    FROM zipper.dyed_tape_transaction dtt
                    UNION ALL
                    SELECT dttfs.order_description_uuid, dttfs.trx_quantity
                    FROM zipper.dyed_tape_transaction_from_stock dttfs
                ) combined_transactions
                GROUP BY order_description_uuid
            ) dyed_tape_transaction_combined ON dyed_tape_transaction_combined.order_description_uuid = vodf.order_description_uuid
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
                dyed_tape_transaction_combined.total_trx_quantity,
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

export async function zipperProductionStatusReportV2(req, res, next) {
	const { own_uuid, marketing_price, price_lock } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                ARRAY_AGG(DISTINCT oe.color_ref) AS color_refs,
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
                SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity END)::float8 AS total_quantity,
                CASE WHEN lower(vodf.item_name) = 'vislon' THEN 'KG' ELSE 'PCS' END AS teeth_molding_unit,
                vodf.remarks,
                CONCAT(
                    CASE WHEN vodf.item_name IS NOT NULL AND vodf.item_name != '---' THEN vodf.item_name ELSE '' END,
                    CASE WHEN vodf.zipper_number_name IS NOT NULL AND vodf.zipper_number_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.zipper_number_name IS NOT NULL AND vodf.zipper_number_name != '---' THEN vodf.zipper_number_name ELSE '' END,
                    CASE WHEN vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.end_type_name IS NOT NULL AND vodf.end_type_name != '---' THEN vodf.end_type_name ELSE '' END,
                    CASE WHEN vodf.hand_name IS NOT NULL AND vodf.hand_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.hand_name IS NOT NULL AND vodf.hand_name != '---' THEN vodf.hand_name ELSE '' END,
                    CASE WHEN vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.teeth_type_name IS NOT NULL AND vodf.teeth_type_name != '---' THEN vodf.teeth_type_name ELSE '' END,
                    CASE WHEN vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.teeth_color_name IS NOT NULL AND vodf.teeth_color_name != '---' THEN vodf.teeth_color_name ELSE '' END,
                    CASE WHEN vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---' THEN ', ' ELSE '' END,
                    CASE WHEN vodf.nylon_stopper_name IS NOT NULL AND vodf.nylon_stopper_name != '---' THEN vodf.nylon_stopper_name ELSE '' END
                ) AS item_details,
                CONCAT(
                    COALESCE(vodf.puller_type_name, ''),
                    CASE WHEN vodf.puller_color_name IS NOT NULL THEN ', Puller: ' ELSE '' END,
                    COALESCE(vodf.puller_color_name, ''),
                    CASE WHEN vodf.coloring_type_name IS NOT NULL THEN ', Slider: ' ELSE '' END,
                    COALESCE(vodf.coloring_type_name, ''),
                    CASE WHEN vodf.slider_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.slider_name, ''),
                    CASE WHEN vodf.top_stopper_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.top_stopper_name, ''),
                    CASE WHEN vodf.bottom_stopper_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.bottom_stopper_name, ''),
                    CASE WHEN vodf.logo_type_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.logo_type_name, ''),
                    CASE WHEN vodf.slider_body_shape_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.slider_body_shape_name, ''),
                    CASE WHEN vodf.slider_link_name IS NOT NULL THEN ', ' ELSE '' END,
                    COALESCE(vodf.slider_link_name, '')
                ) AS slider_details,
                CONCAT(
                    vodf.garment,
                    COALESCE(vodf.end_user_name, ''),
                    CASE WHEN vodf.light_preference_name IS NOT NULL THEN ' ,' ELSE '' END,
                    COALESCE(vodf.light_preference_name, '')
                ) AS other_details,
                 vodf.md_price::float8,
                 vodf.mkt_company_price::float8,
                 vodf.mkt_party_price::float8,
                 vodf.is_price_confirmed,
                COALESCE(size_wise_sum.size_wise_quantity, '{}'::jsonb) AS size_wise_quantity,
                md_price_log.md_price_history,
                md_price_log.mkt_price_history
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
             LEFT JOIN (
                SELECT
                    order_description_uuid,
                    jsonb_object_agg(size_key, qty_sum) FILTER (WHERE size_key IS NOT NULL) AS size_wise_quantity
                FROM (
                    SELECT
                        oe.order_description_uuid,
                        to_char(
                            CASE 
                                WHEN vodf.is_inch = 1 THEN CAST(oe.size AS NUMERIC) * 2.54 
                                ELSE CAST(oe.size AS NUMERIC) 
                            END, 'FM999999.###'
                        ) AS size_key,
                        SUM(
                            CASE WHEN vodf.order_type = 'tape' THEN oe.size::float8 ELSE oe.quantity::float8 END
                        )::float8 AS qty_sum
                    FROM zipper.order_entry oe
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                    GROUP BY oe.order_description_uuid, size_key
                ) t
                GROUP BY order_description_uuid
            ) size_wise_sum ON size_wise_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                /* Price histories based on changes vs previous log (LAG), not vs current live values */
                SELECT
                    base.order_description_uuid,
                    COALESCE(md_hist.md_price_history, '[]'::jsonb) AS md_price_history,
                    COALESCE(mkt_hist.mkt_price_history, '[]'::jsonb) AS mkt_price_history
                FROM (
                    SELECT DISTINCT order_description_uuid FROM zipper.md_price_log
                ) base
                /* MD price change history: include only rows where md_price differs from previous md_price */
                LEFT JOIN (
                    WITH md_changes AS (
                        SELECT
                            order_description_uuid,
                            md_price,
                            created_at,
                            LAG(md_price) OVER (PARTITION BY order_description_uuid ORDER BY created_at) AS prev_md_price
                        FROM zipper.md_price_log
                        WHERE COALESCE(md_price,0) <> 0
                    )
                    SELECT
                        order_description_uuid,
                        jsonb_agg(
                            jsonb_build_object(
                                'md_price', md_price,
                                'created_at', created_at
                            ) ORDER BY created_at DESC
                        ) AS md_price_history
                    FROM md_changes
                    WHERE md_price IS DISTINCT FROM prev_md_price
                    GROUP BY order_description_uuid
                ) md_hist ON md_hist.order_description_uuid = base.order_description_uuid
                /* Marketing price change history: only rows where either component changed vs previous */
                LEFT JOIN (
                    WITH mkt_changes AS (
                        SELECT
                            order_description_uuid,
                            mkt_company_price,
                            mkt_party_price,
                            created_at,
                            LAG(mkt_company_price) OVER (PARTITION BY order_description_uuid ORDER BY created_at) AS prev_mkt_company_price,
                            LAG(mkt_party_price) OVER (PARTITION BY order_description_uuid ORDER BY created_at) AS prev_mkt_party_price
                        FROM zipper.md_price_log
                        WHERE COALESCE(mkt_company_price,0) <> 0 OR COALESCE(mkt_party_price,0) <> 0
                    )
                    SELECT
                        order_description_uuid,
                        jsonb_agg(
                            jsonb_build_object(
                                'mkt_company_price', mkt_company_price,
                                'mkt_party_price', mkt_party_price,
                                'created_at', created_at
                            ) ORDER BY created_at DESC
                        ) AS mkt_price_history
                    FROM mkt_changes
                    WHERE (mkt_company_price IS DISTINCT FROM prev_mkt_company_price)
                       OR (mkt_party_price IS DISTINCT FROM prev_mkt_party_price)
                    GROUP BY order_description_uuid
                ) mkt_hist ON mkt_hist.order_description_uuid = base.order_description_uuid
            ) md_price_log ON md_price_log.order_description_uuid = vodf.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL 
                AND vodf.is_cancelled = FALSE AND vodf.is_sample != 1 AND vodf.is_bill != 0 
                ${own_uuid == null ? sql`` : sql` AND vodf.marketing_uuid = ${marketingUuid}`} 
                ${marketing_price === 'true' ? sql` AND (vodf.mkt_company_price > 0 OR vodf.mkt_party_price > 0)` : sql``}
                ${price_lock === 'true' ? sql` AND vodf.is_price_confirmed = TRUE` : price_lock === 'false' ? sql` AND vodf.is_price_confirmed = FALSE` : sql``}
            GROUP BY
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
                vodf.item_name,
                vodf.remarks,
                vodf.is_inch,
                vodf.puller_type_name,
                vodf.puller_color_name,
                vodf.coloring_type_name,
                vodf.slider_name,
                vodf.top_stopper_name,
                vodf.bottom_stopper_name,
                vodf.logo_type_name,
                vodf.slider_body_shape_name,
                vodf.slider_link_name,
                vodf.garment,
                vodf.end_user_name,
                vodf.light_preference_name,
                vodf.item_name,
                vodf.zipper_number_name,
                vodf.end_type_name,
                vodf.hand_name,
                vodf.teeth_type_name,
                vodf.teeth_color_name,
                vodf.nylon_stopper_name,
                vodf.md_price,
                vodf.mkt_company_price,
                vodf.mkt_party_price,
                vodf.is_price_confirmed,
                size_wise_sum.size_wise_quantity,
                vodf.order_description_created_at,
                vodf.id,
                md_price_log.md_price_history,
                md_price_log.mkt_price_history
            ORDER BY 
                vodf.id DESC, vodf.order_description_created_at DESC
        `;

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
	const { own_uuid, from_date, to_date, type } = req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpb.uuid 
                            ELSE vodf.buyer_uuid 
                        END AS buyer_uuid,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN tpb.name 
                            ELSE vodf.buyer_name 
                        END AS buyer_name,
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
                        packing_list_grouped.gate_pass,
                        CASE 
                            WHEN pl.item_for IN ('thread', 'sample_thread') 
                            THEN 'thread' 
                            ELSE 'zipper' 
                        END AS product,
                        challan.is_delivered,
                        challan.is_delivered_date,
                        challan.is_delivered_by,
                        is_delivered_by.name AS is_delivered_by_name,
                        challan.is_out_for_delivery,
                        challan.is_out_for_delivery_date,
                        challan.is_out_for_delivery_by,
                        is_out_for_delivery_by.name AS is_out_for_delivery_by_name
                    FROM
                        delivery.challan
                    LEFT JOIN 
                        hr.users ON challan.created_by = users.uuid
                    LEFT JOIN delivery.packing_list pl ON challan.uuid = pl.challan_uuid
                    LEFT JOIN (
                        SELECT 
                            packing_list.challan_uuid,
                            SUM(packing_list_entry.quantity)::float8 AS total_quantity,
                            SUM(packing_list_entry.short_quantity)::float8 AS total_short_quantity,
                            SUM(packing_list_entry.reject_quantity)::float8 AS total_reject_quantity,
                            SUM(CASE 
                                WHEN packing_list_entry.sfg_uuid IS NULL 
                                THEN toe.quantity::float8 
                                WHEN vodf.order_type = 'tape'
                                THEN CAST(CAST(oe.size AS NUMERIC) AS NUMERIC)
                                ELSE oe.quantity::float8 
                            END) AS order_quantity,
                            CASE
                                WHEN COUNT(packing_list.uuid) = SUM(CASE WHEN packing_list.gate_pass = 1 THEN 1 ELSE 0 END) 
                                THEN 1
                                ELSE 0
                            END AS gate_pass
                        FROM
                            delivery.packing_list
                        LEFT JOIN
                            delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
                        LEFT JOIN
                            zipper.sfg ON packing_list_entry.sfg_uuid = sfg.uuid
                        LEFT JOIN
                            zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                        LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
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
                    LEFT JOIN public.buyer tpb ON toi.buyer_uuid = tpb.uuid
                    LEFT JOIN pi_cash_grouped_thread ON toi.uuid = pi_cash_grouped_thread.order_info_uuid
                    LEFT JOIN hr.users receive_status_by ON challan.receive_status_by = receive_status_by.uuid
                    LEFT JOIN hr.users is_delivered_by ON challan.is_delivered_by = is_delivered_by.uuid
                    LEFT JOIN hr.users is_out_for_delivery_by ON challan.is_out_for_delivery_by = is_out_for_delivery_by.uuid
                    WHERE
                        ${own_uuid == null ? sql`TRUE` : sql`CASE WHEN pl.item_for IN ('thread', 'sample_thread') THEN toi.marketing_uuid = ${marketingUuid} ELSE vodf.marketing_uuid = ${marketingUuid} END`}
                        ${
							type === 'pending'
								? sql` AND packing_list_grouped.gate_pass = 0`
								: type === 'gate_pass'
									? sql` AND packing_list_grouped.gate_pass = 1 AND challan.is_delivered = 0`
									: type === 'delivered'
										? sql` AND challan.is_delivered = 1 AND challan.receive_status = 0`
										: type === 'received'
											? sql` AND challan.receive_status = 1`
											: sql``
						}
                        ${
							from_date && to_date
								? sql` AND challan.created_at BETWEEN ${from_date}::timestamp AND ${to_date}::timestamp + interval '23 hours 59 minutes 59 seconds'`
								: sql``
						}
                    GROUP BY
                        challan.uuid,
                        challan.created_at,
                        pl.item_for,
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
                        vodf.buyer_uuid,
                        vodf.buyer_name,
                        tpb.uuid,
                        tpb.name,
                        packing_list_grouped.total_quantity,
                        packing_list_grouped.total_short_quantity,
                        packing_list_grouped.total_reject_quantity,
                        packing_list_grouped.gate_pass,
                        pi_cash_grouped_thread.pi_numbers,
						pi_cash_grouped_thread.lc_numbers,
						pi_cash_grouped.pi_numbers,
						pi_cash_grouped.lc_numbers,
                        receive_status_by.name,
                        challan.receive_status,
                        challan.receive_status_by,
                        challan.receive_status_date,
                        challan.is_delivered,
                        challan.is_delivered_date,
                        challan.is_delivered_by,
                        is_delivered_by.name,
                        challan.is_out_for_delivery,
                        challan.is_out_for_delivery_date,
                        challan.is_out_for_delivery_by,
                        is_out_for_delivery_by.name
                    ORDER BY
                        challan.created_at DESC; 
        `;

		// * Uncomment the following lines if you want to filter by date range
		// ${
		// 	from_date && to_date
		// 		? sql` AND challan.created_at BETWEEN ${from_date}::timestamp AND ${to_date}::timestamp + interval '23 hours 59 minutes 59 seconds'`
		// 		: sql``
		// }

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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                -- aggregate per order_number first, then aggregate those per party to include per-order quantity in order_object
                SELECT
                    per_order.party_uuid,
                    jsonb_agg(DISTINCT jsonb_build_object(
                        'value', per_order.order_number,
                        'label', CONCAT(per_order.order_number, ' - ', per_order.marketing_name, ' - Q:', per_order.total_qty),
                        'quantity', per_order.total_qty
                    )) AS order_object,
                    SUM(per_order.total_qty) AS total_quantity,
                    SUM(per_order.total_delivered) AS total_delivered,
                    SUM(per_order.total_pi) AS total_pi,
                    SUM(per_order.total_qty - per_order.total_pi) AS total_non_pi,
                    SUM(per_order.total_qty_value) AS total_quantity_value,
                    SUM(per_order.total_delivered_value) AS total_delivered_value,
                    SUM(per_order.total_pi_value) AS total_pi_value,
                    SUM(per_order.total_non_pi_value) AS total_non_pi_value
                FROM (
                    SELECT
                        vodf.party_uuid,
                        vodf.order_number,
                        vodf.marketing_name,
                        SUM(order_entry.quantity)::float8 AS total_qty,
                        SUM(sfg.delivered)::float8 AS total_delivered,
                        SUM(sfg.pi)::float8 AS total_pi,
                        SUM(order_entry.quantity * order_entry.party_price)::float8 AS total_qty_value,
                        SUM(sfg.delivered * order_entry.party_price)::float8 AS total_delivered_value,
                        SUM(sfg.pi * order_entry.party_price)::float8 AS total_pi_value,
                        SUM((order_entry.quantity - sfg.pi) * order_entry.party_price)::float8 AS total_non_pi_value
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
                        AND vodf.is_cancelled = FALSE
                        AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                    GROUP BY
                        vodf.party_uuid, vodf.order_number, vodf.marketing_name
                ) per_order
                GROUP BY per_order.party_uuid
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
                -- aggregate per thread order (toi) first, then aggregate per party to include per-order quantity
                SELECT
                    per_order.party_uuid,
                    jsonb_agg(DISTINCT jsonb_build_object(
                        'value', per_order.toi_uuid,
                        'label', CONCAT('ST', CASE WHEN per_order.is_sample = 1 THEN 'S' ELSE '' END, to_char(per_order.created_at, 'YY'), '-', per_order.id_text, ' - ', per_order.marketing_name, ' - Q:', per_order.total_qty),
                        'quantity', per_order.total_qty
                    )) AS order_object,
                    SUM(per_order.total_qty) AS total_quantity,
                    SUM(per_order.total_delivered) AS total_delivered,
                    SUM(per_order.total_pi) AS total_pi,
                    SUM(per_order.total_qty - per_order.total_pi) AS total_non_pi,
                    SUM(per_order.total_qty_value) AS total_quantity_value,
                    SUM(per_order.total_delivered_value) AS total_delivered_value,
                    SUM(per_order.total_pi_value) AS total_pi_value,
                    SUM(per_order.total_non_pi_value) AS total_non_pi_value
                FROM (
                    SELECT
                        toi.party_uuid,
                        toi.uuid AS toi_uuid,
                        toi.is_sample,
                        toi.created_at,
                        toi.id::text AS id_text,
                        marketing.name AS marketing_name,
                        SUM(toe.quantity)::float8 AS total_qty,
                        SUM(toe.delivered)::float8 AS total_delivered,
                        SUM(toe.pi)::float8 AS total_pi,
                        SUM(toe.quantity * toe.party_price)::float8 AS total_qty_value,
                        SUM(toe.delivered * toe.party_price)::float8 AS total_delivered_value,
                        SUM(toe.pi * toe.party_price)::float8 AS total_pi_value,
                        SUM((toe.quantity - toe.pi) * toe.party_price)::float8 AS total_non_pi_value
                    FROM thread.order_entry toe
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN public.marketing ON toi.marketing_uuid = marketing.uuid
                    LEFT JOIN (
                        SELECT DISTINCT toi.uuid
                        FROM commercial.pi_cash_entry
                        LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                        LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    ) order_exists_in_pi ON toi.uuid = order_exists_in_pi.uuid
                    WHERE
                        order_exists_in_pi.uuid IS NULL
                        AND toi.is_sample = 0
                        AND toi.is_cancelled = FALSE
                        AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
                    GROUP BY
                        toi.party_uuid, toi.uuid, toi.is_sample, toi.created_at, toi.id, marketing.name
                ) per_order
                GROUP BY per_order.party_uuid
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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            SELECT 
                marketing.uuid,
                marketing.name as marketing_name,
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
                -- First aggregate per order_number to compute the SUMs, then aggregate those per marketing
                SELECT
                    per_order.marketing_uuid,
                    jsonb_agg(DISTINCT jsonb_build_object('value', per_order.order_number, 'label', CONCAT(per_order.order_number, ' - ', per_order.party_name, ' - Q:', per_order.total_qty))) AS order_object,
                    SUM(per_order.total_qty) AS total_quantity,
                    SUM(per_order.total_delivered) AS total_delivered,
                    SUM(per_order.total_pi) AS total_pi,
                    SUM(per_order.total_qty - per_order.total_pi) AS total_non_pi,
                    SUM(per_order.total_qty_value) AS total_quantity_value,
                    SUM(per_order.total_delivered_value) AS total_delivered_value,
                    SUM(per_order.total_pi_value) AS total_pi_value,
                    SUM(per_order.total_non_pi_value) AS total_non_pi_value
                FROM (
                    SELECT
                        vodf.marketing_uuid,
                        vodf.order_number,
                        vodf.party_name,
                        SUM(order_entry.quantity)::float8 AS total_qty,
                        SUM(sfg.delivered)::float8 AS total_delivered,
                        SUM(sfg.pi)::float8 AS total_pi,
                        SUM(order_entry.quantity * order_entry.party_price)::float8 AS total_qty_value,
                        SUM(sfg.delivered * order_entry.party_price)::float8 AS total_delivered_value,
                        SUM(sfg.pi * order_entry.party_price)::float8 AS total_pi_value,
                        SUM((order_entry.quantity - sfg.pi) * order_entry.party_price)::float8 AS total_non_pi_value
                    FROM
                        zipper.sfg
                    LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
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
                        AND vodf.is_cancelled = FALSE
                        AND ${own_uuid == null ? sql`TRUE` : sql`vodf.marketing_uuid = ${marketingUuid}`}
                    GROUP BY
                        vodf.marketing_uuid, vodf.order_number, vodf.party_name
                ) per_order
                GROUP BY per_order.marketing_uuid
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
                -- Aggregate per thread order (toi) first, then aggregate per marketing
                SELECT
                    per_order.marketing_uuid,
                    jsonb_agg(DISTINCT jsonb_build_object('value', per_order.toi_uuid, 'label', CONCAT('ST', CASE WHEN per_order.is_sample = 1 THEN 'S' ELSE '' END, to_char(per_order.created_at, 'YY'), '-', per_order.id_text, ' - ', per_order.party_name, ' - Q:', per_order.total_qty))) AS order_object,
                    SUM(per_order.total_qty) AS total_quantity,
                    SUM(per_order.total_delivered) AS total_delivered,
                    SUM(per_order.total_pi) AS total_pi,
                    SUM(per_order.total_qty - per_order.total_pi) AS total_non_pi,
                    SUM(per_order.total_qty_value) AS total_quantity_value,
                    SUM(per_order.total_delivered_value) AS total_delivered_value,
                    SUM(per_order.total_pi_value) AS total_pi_value,
                    SUM(per_order.total_non_pi_value) AS total_non_pi_value
                FROM (
                    SELECT
                        toi.marketing_uuid,
                        toi.uuid AS toi_uuid,
                        toi.is_sample,
                        toi.created_at,
                        toi.id::text AS id_text,
                        party.name AS party_name,
                        SUM(toe.quantity)::float8 AS total_qty,
                        SUM(toe.delivered)::float8 AS total_delivered,
                        SUM(toe.pi)::float8 AS total_pi,
                        SUM(toe.quantity * toe.party_price)::float8 AS total_qty_value,
                        SUM(toe.delivered * toe.party_price)::float8 AS total_delivered_value,
                        SUM(toe.pi * toe.party_price)::float8 AS total_pi_value,
                        SUM((toe.quantity - toe.pi) * toe.party_price)::float8 AS total_non_pi_value
                    FROM thread.order_entry toe
                    LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN public.party ON toi.party_uuid = party.uuid
                    LEFT JOIN (
                        SELECT DISTINCT toi.uuid
                        FROM commercial.pi_cash_entry
                        LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                        LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    ) order_exists_in_pi ON toi.uuid = order_exists_in_pi.uuid
                    WHERE
                        order_exists_in_pi.uuid IS NULL
                        AND toi.is_sample = 0
                        AND toi.is_cancelled = FALSE
                        AND ${own_uuid == null ? sql`TRUE` : sql`toi.marketing_uuid = ${marketingUuid}`}
                    GROUP BY
                        toi.marketing_uuid, toi.uuid, toi.is_sample, toi.created_at, toi.id, party.name
                ) per_order
                GROUP BY per_order.marketing_uuid
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
	const { own_uuid, document_receiving, acceptance, maturity, payment } =
		req?.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                jsonb_agg(lc_entry_others.ud_no) as ud_no,
                jsonb_agg(lc_entry_others.ud_received) as ud_received,
                (jsonb_agg(pi_cash.marketing_uuid))[1] as marketing_uuid,
                (jsonb_agg(marketing.name))[1] as marketing_name,
                (jsonb_agg(pi_cash.bank_uuid))[1] as bank_uuid,
                (jsonb_agg(bank.name))[1] as bank_name,
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
		} else if (maturity) {
			query.append(
				sql`AND lc_entry.document_receive_date IS NOT NULL AND lc_entry.maturity_date IS NULL`
			);
		} else if (payment) {
			query.append(
				sql`AND lc_entry.document_receive_date IS NOT NULL AND lc_entry.maturity_date IS NOT NULL AND lc_entry.payment_date IS NULL`
			);
		}

		query.append(sql`GROUP BY lc.uuid, party.uuid, lc_entry.uuid`);

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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                order_entry.color_ref_entry_date,
                order_entry.color_ref_update_date,
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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = '%close end%' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_close_end_quantity,
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
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = '%open end%' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_open_end_quantity,
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

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

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

export async function dailyProductionReport(req, res, next) {
	const { from_date, to_date, type } = req.query;
	const { own_uuid } = req?.query;

	const sort_of_type = ['Nylon', 'Vislon', 'Metal', 'Thread'];

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
            WITH running_all_sum AS (
                SELECT 
                    oe.uuid as order_entry_uuid, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) LIKE '%close end%' THEN ple.quantity ::float8 ELSE 0 END
                        ), 
                        0
                    )::float8 AS total_close_end_quantity, 
                    coalesce(
                        SUM(
                            CASE WHEN lower(vodf.end_type_name) LIKE '%open end%' THEN ple.quantity ::float8 ELSE 0 END
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
                    ${from_date && to_date ? sql`pl.created_at between ${from_date}::timestamp and ${to_date}::timestamp + interval '1 day'` : sql`1=1`} 
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
                        ${from_date && to_date ? sql`pl.created_at between ${from_date}::timestamp and ${to_date}::timestamp + interval '1 day'` : sql`1=1`}
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
				marketing_name,
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
				marketing: [],
			}));

			const marketing = findOrCreate(
				typeEntry.marketing,
				'marketing_name',
				marketing_name,
				() => ({
					marketing_name: marketing_name,
					parties: [],
				})
			);

			const party = findOrCreate(
				marketing.parties,
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
