import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectEDReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const query = sql`
            SELECT 
                ple.uuid as packing_list_entry_uuid,
                ple.packing_list_uuid,
                concat('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) as packing_list_number,
                CASE WHEN pl.item_for NOT IN ('thread', 'sample_thread') 
                    THEN concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
                    ELSE concat('TC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
                END AS challan_number,
                challan.created_at as challan_date,
                ple.quantity,
                challan.created_by,
                challan_created_by.name as challan_created_by_name,
                challan.vehicle_uuid,
                vehicle.name as vehicle_name,
                vehicle.number as vehicle_number,
                vehicle.driver_name,
                pi_cash.id as cash_invoice_number
            FROM 
                delivery.packing_list_entry ple
            LEFT JOIN 
                delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN 
                delivery.challan ON pl.challan_uuid = challan.uuid
            LEFT JOIN 
                delivery.vehicle ON challan.vehicle_uuid = vehicle.uuid
            LEFT JOIN 
                hr.users challan_created_by ON challan.created_by = challan_created_by.uuid
            LEFT JOIN 
                zipper.sfg ON ple.sfg_uuid = zipper.sfg.uuid
            LEFT JOIN 
                zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN 
                zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN 
                thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
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
            WHERE
                challan.uuid IS NOT NULL
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
