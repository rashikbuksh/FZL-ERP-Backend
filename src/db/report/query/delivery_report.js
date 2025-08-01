import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function selectDeliveryReportZipper(req, res, next) {
	const { own_uuid, from, to, order_type } = req?.query;

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
					array_agg(DISTINCT CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) END) as pi_numbers,
					array_agg(DISTINCT lc.lc_number) as lc_numbers
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.sfg_uuid = sfg.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
				LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
				WHERE pi_cash.id IS NOT NULL
				GROUP BY vodf.order_info_uuid
			)
            SELECT 
                challan.uuid AS uuid,
				CONCAT('ZC', to_char(challan.created_at, 'YY'), '-', challan.id::text) AS challan_number,
                challan.delivery_date,
                challan.receive_status,
                challan.is_delivered,
                challan.is_delivered_date,
                challan.is_delivered_by,
                is_delivered_by.name AS is_delivered_by_name,
                receive_status_by.name AS receive_status_by_name,
                challan.receive_status_date,
                vpld.item_for,
                vpld.marketing_name,
                vpld.party_name,
                vpld.order_info_uuid,
                vpld.order_number,
                vpld.order_description_uuid,
                vpld.item_description,
                vpld.style,
                vpld.color,
                vpld.color_ref,
                vpld.color_ref_entry_date,
                vpld.color_ref_update_date,
                vpld.size,
                vpld.packing_number,
                vpld.order_quantity,
                vpld.quantity as delivered_quantity,
                vpld.poli_quantity,
                vpld.short_quantity,
                vpld.reject_quantity,
                vpld.order_type,
                coalesce(oe.party_price,0)::float8 as rate_per_dzn,
                CASE 
					WHEN vpld.order_type = 'tape' 
					THEN coalesce(oe.party_price,0)::float8
					ELSE ROUND(coalesce(oe.party_price/12,0)::NUMERIC, 2)
				END as rate_per_piece,
                CASE 
                    WHEN oe.party_price = 0
                    THEN 0::float8
                    ELSE ROUND(coalesce(oe.party_price - oe.company_price, 0)::NUMERIC, 2)
                END as commission,
                CASE 
                    WHEN vpld.order_type = 'tape'
                    THEN (vpld.quantity * oe.party_price)::float8
                    ELSE ROUND((vpld.quantity * oe.party_price/12)::NUMERIC, 2)
                END as total_value,
                CASE 
                    WHEN vpld.order_type = 'tape'
                    THEN ROUND((vpld.quantity * oe.company_price)::NUMERIC, 2)
                    ELSE ROUND((vpld.quantity * oe.company_price/12)::NUMERIC, 2)
                END as total_value_company,
                CASE 
                    WHEN oe.party_price = 0
                    THEN 0
                    WHEN vpld.order_type = 'tape'
                    THEN ROUND((vpld.quantity * oe.party_price - vpld.quantity * oe.company_price)::NUMERIC, 2)
                    ELSE ROUND((vpld.quantity * oe.party_price/12 - vpld.quantity * oe.company_price/12)::NUMERIC, 2)
                END as total_commission,
                pcg.pi_numbers,
                pcg.lc_numbers,
                CASE 
					WHEN vpld.order_type = 'tape' THEN 'Meter' 
					WHEN vpld.order_type = 'slider' THEN 'Pcs'
					WHEN vpld.is_inch = 1 THEN 'Inch'
					ELSE 'CM' 
				END as unit
            FROM delivery.v_packing_list_details vpld 
            LEFT JOIN delivery.challan challan ON vpld.challan_uuid = challan.uuid
            LEFT JOIN zipper.sfg sfg ON vpld.sfg_uuid = sfg.uuid
            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN pi_cash_grouped pcg ON vpld.order_info_uuid = pcg.order_info_uuid
            LEFT JOIN hr.users is_delivered_by ON challan.is_delivered_by = is_delivered_by.uuid
            LEFT JOIN hr.users receive_status_by ON challan.receive_status_by = receive_status_by.uuid
            WHERE 
                vpld.item_for IN ('zipper', 'slider', 'tape', 'sample_zipper')
                AND ${from && to ? sql`challan.delivery_date BETWEEN ${from} AND ${to}` : sql`TRUE`}
                AND ${own_uuid == null ? sql`TRUE` : sql`vpld.marketing_uuid = ${marketingUuid}`}
                AND ${order_type == 'sample' ? sql` vodf.is_sample = 1` : order_type == 'bulk' ? sql` vodf.is_sample = 0` : sql`TRUE`}
                
        `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'delivery report zipper',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDeliveryReportThread(req, res, next) {
	const { own_uuid, from, to, order_type } = req?.query;

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
            WITH pi_cash_grouped_thread AS (
				SELECT 
					toi.uuid as order_info_uuid,
					array_agg(DISTINCT CASE WHEN pi_cash.is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) END) as pi_numbers,
					array_agg(DISTINCT lc.lc_number) as lc_numbers
				FROM
					thread.order_info toi
				LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
				LEFT JOIN commercial.lc ON pi_cash.lc_uuid = lc.uuid
				WHERE pi_cash.id IS NOT NULL
				GROUP BY toi.uuid
			)
            SELECT 
                challan.uuid AS uuid,
				CONCAT('TC', to_char(challan.created_at, 'YY'), '-', challan.id::text) AS challan_number,
                challan.delivery_date,
                challan.receive_status,
                challan.is_delivered,
                challan.is_delivered_date,
                challan.is_delivered_by,
                is_delivered_by.name AS is_delivered_by_name,
                receive_status_by.name AS receive_status_by_name,
                challan.receive_status_date,
                vpld.item_for,
                vpld.marketing_name,
                vpld.party_name,
                vpld.order_info_uuid,
                vpld.order_number,
                vpld.item_description,
                vpld.style,
                vpld.color,
                vpld.color_ref,
                vpld.color_ref_entry_date,
                vpld.color_ref_update_date,
                vpld.packing_number,
                vpld.order_quantity,
                vpld.quantity as delivered_quantity,
                vpld.poli_quantity,
                vpld.short_quantity,
                vpld.reject_quantity,
			    coalesce(oe.party_price,0)::float8 as rate_per_piece,
                CASE 
                    WHEN oe.party_price = 0
                    THEN 0::float8
                    ELSE coalesce(oe.party_price - oe.company_price, 0)::float8
                END as commission,
                ROUND(coalesce(vpld.quantity * oe.party_price, 0)::NUMERIC, 2) as total_value,
                ROUND(coalesce(vpld.quantity * oe.company_price, 0)::NUMERIC, 2) as total_value_company,
                CASE 
                    WHEN oe.party_price = 0
                    THEN 0::float8
                    ELSE ROUND(coalesce(vpld.quantity * oe.party_price - vpld.quantity * oe.company_price, 0)::NUMERIC, 2)
                END as total_commission,
                pcg.pi_numbers,
                pcg.lc_numbers,
                'Cone' as unit
            FROM delivery.v_packing_list_details vpld 
            LEFT JOIN delivery.challan challan ON vpld.challan_uuid = challan.uuid
            LEFT JOIN thread.order_entry oe ON vpld.order_entry_uuid = oe.uuid
            LEFT JOIN thread.order_info toi ON oe.order_info_uuid = toi.uuid
            LEFT JOIN pi_cash_grouped_thread pcg ON vpld.order_info_uuid = pcg.order_info_uuid
            LEFT JOIN hr.users is_delivered_by ON challan.is_delivered_by = is_delivered_by.uuid
            LEFT JOIN hr.users receive_status_by ON challan.receive_status_by = receive_status_by.uuid
            WHERE 
                vpld.item_for IN ('thread', 'sample_thread')
                AND ${from && to ? sql`challan.delivery_date BETWEEN ${from} AND ${to}` : sql`TRUE`}
                AND ${own_uuid == null ? sql`TRUE` : sql`vpld.marketing_uuid = ${marketingUuid}`}
                AND ${order_type == 'sample' ? sql` toi.is_sample = 1` : order_type == 'bulk' ? sql` toi.is_sample = 0` : sql`TRUE`}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'delivery report zipper',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
