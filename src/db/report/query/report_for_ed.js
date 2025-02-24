import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectEDReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from, to } = req.query;

	try {
		const query = sql`
            SELECT 
                vplf.packing_list_entry_uuid,
                vplf.packing_list_uuid,
                challan.uuid as challan_uuid,
                vplf.challan_number,
                challan.created_at as challan_date,
                vplf.quantity,
                challan.created_by,
                challan_created_by.name as challan_created_by_name,
                challan.vehicle_uuid,
                vehicle.name as vehicle_name,
                vehicle.number as vehicle_number,
                vehicle.driver_name,
                vplf.order_info_uuid as order_info_uuid,
                vplf.order_number,
                vplf.item_description,
                vpl.marketing_name,
                vpl.party_name,
                vplf.style,
                vplf.color,
                vplf.size,
                vplf.style_color_size,
                CASE WHEN sfg.uuid IS NOT NULL THEN oe.party_price::float8 ELSE toe.party_price::float8 END as party_price,
                CASE WHEN vodf.is_inch = 1 THEN 'Inch' ELSE CASE WHEN vodf.is_cm = 1 THEN 'CM' ELSE 'Meter' END END AS unit,
                vplf.order_quantity as order_quantity,
                CASE WHEN (sfg.recipe_uuid IS NOT NULL OR toe.recipe_uuid IS NOT NULL) 
                    THEN vplf.order_quantity::float8
                    ELSE 0 
                END as approved_quantity,
                CASE WHEN (sfg.recipe_uuid IS NULL OR toe.recipe_uuid IS NULL) 
                    THEN vplf.order_quantity::float8
                    ELSE 0 
                END as not_approved_quantity,
                CASE WHEN sfg.uuid IS NOT NULL 
                    THEN oe.swatch_approval_date 
                    ELSE toe.swatch_approval_date 
                END as swatch_approval_date,
                CASE WHEN pi_cash.uuid IS NOT NULL THEN 
                    CASE 
                        WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', TO_CHAR(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
                        ELSE CONCAT('CI', TO_CHAR(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
			        END
                ELSE NULL END as pi_number,
                CASE WHEN sfg.uuid IS NOT NULL THEN sfg.pi::float8 ELSE toe.pi::float8 END as pi,
                CASE WHEN sfg.uuid IS NOT NULL THEN (CASE WHEN vodf.order_type = 'tape' THEN (oe.party_price*oe.quantity)::float8 ELSE (oe.party_price/12)::float8*oe.quantity::float8 END) ELSE (toe.party_price*toe.quantity)::float8 END as pi_value,
                lc.lc_number,
                CASE WHEN lc.is_old_pi = 0 
                    THEN(	
                        SELECT 
                            SUM(
                                CASE 
                                    WHEN pi_cash_entry.thread_order_entry_uuid IS NULL 
                                    THEN (coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price,0)/12)::float8 
                                    ELSE (coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(toe.party_price,0))::float8 
                                END
                            )
                        FROM commercial.pi_cash 
                            LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
                            LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                            LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
                            LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
                        WHERE pi_cash.lc_uuid = lc.uuid
                    )::float8
                    ELSE lc.lc_value::float8 
                END AS lc_value,
                vplf.warehouse,
                vplf.delivered,
                vplf.balance_quantity,
                COALESCE(dyeing_finishing_batch_total.finishing_batch, '[]'::jsonb) as finishing_batch,
                CASE WHEN sfg.uuid IS NOT NULL THEN COALESCE(dyeing_finishing_batch_total.dyeing_batch, '[]'::jsonb) ELSE thread_batch.thread_batch END as dyeing_batch,
                COALESCE(dyeing_finishing_batch_total.total_quantity, 0)::float8 as total_batch_quantity,
                COALESCE(dyeing_finishing_batch_total.teeth_molding_prod, 0)::float8 as teeth_molding_prod,
                COALESCE(dyeing_finishing_batch_total.total_finished_quantity, 0)::float8 as total_finished_quantity,
                COALESCE(dyeing_finishing_batch_total.slider_finishing_stock, 0)::float8 as slider_finishing_stock,
                CASE WHEN sfg.uuid IS NOT NULL THEN vodf.created_at ELSE toi.created_at END as order_created_at,
                CASE WHEN sfg.uuid IS NOT NULL THEN vodf.updated_at ELSE toi.updated_at END as order_updated_at
            FROM 
                delivery.v_packing_list_details vplf
            LEFT JOIN
                delivery.v_packing_list vpl ON vplf.packing_list_uuid = vpl.uuid
            LEFT JOIN
                delivery.challan ON vplf.challan_uuid = challan.uuid
            LEFT JOIN 
                delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
            LEFT JOIN 
                hr.users challan_created_by ON challan.created_by = challan_created_by.uuid
            LEFT JOIN 
                zipper.sfg ON vplf.sfg_uuid = zipper.sfg.uuid
            LEFT JOIN
                lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
            LEFT JOIN
                lab_dip.recipe_entry ON recipe.uuid = recipe_entry.recipe_uuid
            LEFT JOIN 
                zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN 
                zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN 
                thread.order_entry toe ON vplf.thread_order_entry_uuid = toe.uuid
            LEFT JOIN 
                thread.order_info toi ON toe.order_info_uuid = toi.uuid
            LEFT JOIN 
                commercial.pi_cash ON toi.uuid = ANY(
					SELECT elem
					FROM jsonb_array_elements_text(pi_cash.thread_order_info_uuids::jsonb) AS elem
					WHERE elem IS NOT NULL AND elem != 'null'
				) OR vodf.order_info_uuid = ANY(
                    SELECT elem
                    FROM jsonb_array_elements_text(pi_cash.order_info_uuids::jsonb) AS elem
                    WHERE elem IS NOT NULL AND elem != 'null'
                )
            LEFT JOIN
                commercial.lc ON pi_cash.lc_uuid = lc.uuid
            LEFT JOIN 
                (
                    SELECT 
                        sfg.uuid as sfg_uuid,
                        jsonb_agg(
                            jsonb_build_object(
                                'finishing_batch_uuid', fb.uuid,
                                'finishing_batch_number', CONCAT('FB', TO_CHAR(fb.created_at, 'YY'), '-', LPAD(fb.id::text, 4, '0')),
                                'finishing_batch_date', fb.created_at,
                                'finishing_batch_quantity', fbe.quantity,
                                'finishing_batch_balance_quantity', fbe.quantity - fbe.finishing_prod
                            )
                        ) as finishing_batch,
                        jsonb_agg(
                            DISTINCT jsonb_build_object(
                            'dyeing_batch_uuid', dyeing_batch.dyeing_batch_uuid, 
                            'dyeing_batch_number', dyeing_batch.dyeing_batch_number, 
                            'dyeing_batch_date', dyeing_batch.production_date, 
                            'dyeing_batch_quantity', dyeing_batch.total_quantity::float8, 
                            'received', dyeing_batch.received
                            )
                        ) as dyeing_batch,
                        SUM(fb.slider_finishing_stock) as slider_finishing_stock,
                        SUM(fbe.quantity) as total_quantity,
                        SUM(fbe.teeth_molding_prod) as teeth_molding_prod,
                        SUM(fbe.finishing_prod) as total_finished_quantity
                    FROM
                        zipper.finishing_batch fb
                    LEFT JOIN
                        (
                            SELECT 
                                sfg_uuid,
                                finishing_batch_uuid,
                                SUM(quantity) as quantity,
                                SUM(teeth_molding_prod) as teeth_molding_prod,
                                SUM(finishing_prod) as finishing_prod
                            FROM
                                zipper.finishing_batch_entry
                            GROUP BY
                                sfg_uuid, finishing_batch_uuid
                        ) fbe ON fbe.finishing_batch_uuid = fb.uuid
                    LEFT JOIN
                        zipper.sfg ON fbe.sfg_uuid = sfg.uuid
                    LEFT JOIN
                    (
						SELECT
							dyeing_batch.uuid as dyeing_batch_uuid,
                            CONCAT('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0')) as dyeing_batch_number,
							dyeing_batch.production_date::date,
                            sfg.uuid as sfg_uuid,
							SUM(dyeing_batch_entry.quantity) as total_quantity,
                            CASE WHEN dyeing_batch.received = 1 THEN TRUE ELSE FALSE END as received
						FROM
							zipper.dyeing_batch
                        LEFT JOIN
                            zipper.dyeing_batch_entry dyeing_batch_entry ON dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
                        LEFT JOIN 
                            zipper.sfg sfg ON dyeing_batch_entry.sfg_uuid = sfg.uuid
                        GROUP BY
                            dyeing_batch.uuid, sfg.uuid
					) dyeing_batch ON dyeing_batch.sfg_uuid = sfg.uuid
                    GROUP BY
                        sfg.uuid
                ) dyeing_finishing_batch_total ON vplf.sfg_uuid = dyeing_finishing_batch_total.sfg_uuid
                LEFT JOIN (
                SELECT 
                    toe.uuid as order_entry_uuid,
                    COALESCE(
                        jsonb_agg(DISTINCT jsonb_build_object(
                            'batch_uuid', batch.uuid, 
                            'batch_number', batch.batch_number, 
                            'batch_date', batch.production_date, 
                            'batch_quantity', batch.total_quantity::float8, 
                            'balance_quantity', batch.total_quantity::float - batch.transfer_quantity::float8)
                        )
                        FILTER (WHERE batch.uuid IS NOT NULL), '[]'
                    ) AS thread_batch
                FROM
                    thread.order_entry toe
                LEFT JOIN (
                    SELECT 
                        batch.uuid,
                        CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_number,
                        batch.production_date::date as production_date,
                        SUM(batch_entry.quantity) as total_quantity,
                        SUM(batch_entry.transfer_quantity) as transfer_quantity,
                        order_entry.uuid as order_entry_uuid
                    FROM
                        thread.batch_entry
                    LEFT JOIN thread.batch ON batch_entry.batch_uuid = batch.uuid
                    LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                    GROUP BY
                        batch.uuid, order_entry.uuid
                ) batch ON toe.uuid = batch.order_entry_uuid
                GROUP BY
                    toe.uuid
            ) thread_batch ON thread_batch.order_entry_uuid = vplf.thread_order_entry_uuid
            WHERE
                challan.uuid IS NOT NULL
                ${from && to ? sql`AND challan.created_at::date BETWEEN ${from} AND ${to}` : sql``}
            ORDER BY challan.created_at DESC
            `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All cash invoices fetched',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError(error, res);
	}
}
