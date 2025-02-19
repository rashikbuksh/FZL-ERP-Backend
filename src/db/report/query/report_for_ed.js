import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectEDReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const query = sql`
          SELECT 
                vplf.packing_list_entry_uuid,
                vplf.packing_list_uuid,
                vplf.challan_number,
                challan.created_at as challan_date,
                vplf.quantity,
                challan.created_by,
                challan_created_by.name as challan_created_by_name,
                challan.vehicle_uuid,
                vehicle.name as vehicle_name,
                vehicle.number as vehicle_number,
                vehicle.driver_name,
                pi_cash.id as cash_invoice_number,
                vodf.order_info_uuid as order_info_uuid,
                vplf.order_number,
                vplf.item_description,
                vpl.marketing_name,
                vpl.party_name,
                vplf.style,
                vplf.color,
                vplf.size,
                vplf.style_color_size,
                CASE WHEN vodf.is_inch = 1 THEN 'Inch' ELSE CASE WHEN vodf.is_cm = 1 THEN 'CM' ELSE 'Meter' END END AS unit,
                vplf.order_quantity as order_quantity,
                CASE WHEN (sfg.recipe_uuid  IS NOT NULL OR toe.recipe_uuid  IS NOT NULL) THEN vplf.order_quantity ELSE 0 END as  approved_quantity,
                CASE WHEN (sfg.recipe_uuid  IS  NULL OR toe.recipe_uuid  IS NULL) THEN vplf.order_quantity ELSE 0 END as  not_approved_quantity,

                CASE WHEN sfg.uuid 
                    IS NOT NULL THEN oe.swatch_approval_date ELSE toe.swatch_approval_date END as swatch_approval_date,
                CASE 
				WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', TO_CHAR(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
				ELSE CONCAT('CI', TO_CHAR(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
			    END AS pi_number,
               CASE WHEN sfg.uuid IS NOT NULL THEN sfg.pi ELSE toe.pi END as pi,
               CASE WHEN sfg.uuid IS NOT NULL THEN (CASE WHEN vodf.order_type = 'tape' THEN (oe.party_price*oe.quantity) ELSE (oe.party_price/12)*oe.quantity END) ELSE toe.party_price*toe.quantity END as pi_value,
                lc.lc_number,
                CASE WHEN lc.is_old_pi = 0 THEN(	
				SELECT 
					SUM(
						CASE 
							WHEN pi_cash_entry.thread_order_entry_uuid IS NULL 
							THEN coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12 
							ELSE coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(toe.party_price,0) 
						END
					)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN thread.order_entry toe ON pi_cash_entry.thread_order_entry_uuid = toe.uuid
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS lc_value,
                vplf.warehouse,
                vplf.delivered,
                vplf.balance_quantity

            FROM 
                delivery.v_packing_list_details vplf
            LEFT JOIN
                delivery.v_packing_list vpl ON vplf.packing_list_uuid = vpl.uuid
            LEFT JOIN
                delivery.challan  ON vplf.challan_uuid = challan.uuid
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
            WHERE
                challan.uuid IS NOT NULL

            ORDER BY challan.created_at DESC;
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
