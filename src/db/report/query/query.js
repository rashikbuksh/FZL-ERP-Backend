import { and, eq, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

// * Zipper Production Status Report

export async function zipperProductionStatusReport(req, res, next) {
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
                vodf.item_description,
                ARRAY_AGG(DISTINCT oe.color) AS colors,
                CONCAT(swatch_approval_counts.swatch_approval_count, ' / ',
				order_entry_counts.order_entry_count) AS swatch_approval_count,
                ARRAY_AGG(DISTINCT oe.style) AS styles,
                CONCAT(MIN(oe.size), ' - ', MAX(oe.size)) AS sizes,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity) AS total_quantity,
                stock.uuid as stock_uuid,
                COALESCE(production_sum.assembly_production_quantity, 0) AS assembly_production_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0) AS coloring_production_quantity,
                (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) + COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0)) AS total_dyeing_transaction_quantity,
                COALESCE(sfg_production_sum.teeth_molding_quantity, 0) AS teeth_molding_quantity,
                CASE WHEN lower(vodf.item_name) = 'vislon' THEN 'KG' ELSE 'PCS' END AS teeth_molding_unit,
                COALESCE(sfg_production_sum.teeth_coloring_quantity, 0) AS teeth_coloring_quantity,
                COALESCE(sfg_production_sum.finishing_quantity, 0) AS finishing_quantity,
                COALESCE(delivery_sum.total_delivery_delivered_quantity, 0) AS total_delivery_delivered_quantity,
                COALESCE(delivery_sum.total_delivery_balance_quantity, 0) AS total_delivery_balance_quantity,
                COALESCE(delivery_sum.total_short_quantity, 0) AS total_short_quantity,
                COALESCE(delivery_sum.total_reject_quantity, 0) AS total_reject_quantity,
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
            LEFT JOIN slider.stock ON stock.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT 
                    stock_uuid,
                    SUM(CASE WHEN section = 'sa_prod' THEN production_quantity ELSE 0 END) AS assembly_production_quantity,
                    SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity
                FROM slider.production
                GROUP BY stock_uuid
            ) production_sum ON production_sum.stock_uuid = stock.uuid
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
                SELECT 
                    sfg_prod.sfg_uuid AS sfg_uuid,
                    oe.uuid AS order_entry_uuid,
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
                    zipper.sfg_production sfg_prod
                LEFT JOIN 
                    zipper.sfg ON sfg_prod.sfg_uuid = sfg.uuid
                LEFT JOIN 
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN 
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY 
                    sfg_prod.sfg_uuid, oe.uuid, od.uuid
            ) sfg_production_sum ON sfg_production_sum.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    sfg.uuid as sfg_uuid,
                    od.uuid as order_description_uuid,
                    oe.uuid as order_entry_uuid,
                    SUM(CASE WHEN challan.gate_pass = 1 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN challan.gate_pass = 0 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(packing_list_entry.short_quantity) AS total_short_quantity,
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
                    sfg.uuid, oe.uuid, od.uuid
            ) delivery_sum ON delivery_sum.order_description_uuid = oe.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL
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
                swatch_approval_counts.swatch_approval_count,
                order_entry_counts.order_entry_count,
                stock.uuid,
                production_sum.assembly_production_quantity,
                production_sum.coloring_production_quantity,
                dyed_tape_transaction_sum.total_trx_quantity,
                dyed_tape_transaction_from_stock_sum.total_trx_quantity,
                sfg_production_sum.teeth_molding_quantity,
                sfg_production_sum.teeth_coloring_quantity,
                sfg_production_sum.finishing_quantity,
                vodf.item_name,
                delivery_sum.total_delivery_delivered_quantity,
                delivery_sum.total_delivery_balance_quantity,
                delivery_sum.total_short_quantity,
                delivery_sum.total_reject_quantity,
                vodf.remarks
        `;

	const resultPromise = db.execute(query);

	try {
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

export async function DailyChallanReport(req, res, next) {
	const query = sql`
            SELECT 
                challan.uuid,
                challan.created_at AS challan_date,
                concat('ZC', to_char(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0')) AS challan_id,
                challan.gate_pass,
                challan.created_by,
                users.name AS created_by_name,
                challan.order_info_uuid,
                vodf.order_number,
                pi_cash.uuid as pi_cash_uuid,
                CASE WHEN pi_cash.uuid IS NOT NULL THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE NULL END AS pi_cash_number,
                lc.uuid as lc_uuid,
                lc.lc_number,
                vodf.marketing_uuid,
                vodf.marketing_name,
                vodf.party_uuid,
                vodf.party_name,
                vodf.factory_uuid,
                vodf.factory_name,
                oe.uuid as order_entry_uuid,
                CONCAT(oe.style, ' - ', oe.color, ' - ', oe.size) AS style_color_size,
                null as count_length_name,
                packing_list_grouped.total_quantity,
                challan.receive_status,
                packing_list_grouped.total_short_quantity,
                packing_list_grouped.total_reject_quantity,
                'zipper' as product
            FROM
                delivery.challan
            LEFT JOIN 
                hr.users ON challan.created_by = users.uuid
            LEFT JOIN (
                SELECT 
                    packing_list.challan_uuid,
                    SUM(packing_list_entry.quantity) AS total_quantity,
                    SUM(packing_list_entry.short_quantity) AS total_short_quantity,
                    SUM(packing_list_entry.reject_quantity) AS total_reject_quantity,
                    oe.quantity AS order_quantity,
                    oe.uuid AS order_entry_uuid
                FROM
                    delivery.packing_list
                LEFT JOIN
                    delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
                LEFT JOIN
                    zipper.sfg ON packing_list_entry.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                GROUP BY
                    packing_list.challan_uuid, oe.uuid
            ) packing_list_grouped ON challan.uuid = packing_list_grouped.challan_uuid
            LEFT JOIN 
                zipper.order_entry oe ON packing_list_grouped.order_entry_uuid = oe.uuid
            LEFT JOIN 
                zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN 
                commercial.pi_cash pi_cash ON pi_cash.order_info_uuids IN (vodf.order_info_uuid)
            LEFT JOIN
                commercial.lc ON pi_cash.lc_uuid = lc.uuid
            UNION 
            SELECT
                thread_challan.uuid,
                thread_challan.created_at AS thread_challan_date,
                concat('TC', to_char(thread_challan.created_at, 'YY'), '-', LPAD(thread_challan.id::text, 4, '0')) AS thread_challan_id,
                thread_challan.gate_pass,
                thread_challan.created_by,
                users.name AS created_by_name,
                order_info.uuid as order_info_uuid,
                CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                pi_cash.uuid as pi_cash_uuid,
                CASE WHEN pi_cash.uuid IS NOT NULL THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE NULL END AS pi_cash_number,
                lc.uuid as lc_uuid,
                lc.lc_number,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_info.party_uuid,
                party.name as party_name,
                order_info.factory_uuid,
                factory.name as factory_name,
                oe.uuid as order_entry_uuid,
                CONCAT(oe.style, ' - ', oe.color) AS style_color_size,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                thread_challan_entry_grouped.total_quantity,
                thread_challan.received as receive_status,
                thread_challan_entry_grouped.total_short_quantity,
                thread_challan_entry_grouped.total_reject_quantity,
                'thread' as product
            FROM
                thread.challan thread_challan
            LEFT JOIN
                hr.users ON thread_challan.created_by = users.uuid
            LEFT JOIN (
                SELECT 
                    challan_entry.challan_uuid,
                    SUM(challan_entry.quantity) AS total_quantity,
                    SUM(challan_entry.short_quantity) AS total_short_quantity,
                    SUM(challan_entry.reject_quantity) AS total_reject_quantity,
                    challan_entry.order_entry_uuid
                FROM 
                    thread.challan_entry challan_entry
                GROUP BY
                    challan_entry.challan_uuid, challan_entry.order_entry_uuid
            ) thread_challan_entry_grouped ON thread_challan.uuid = thread_challan_entry_grouped.challan_uuid
            LEFT JOIN 
                thread.order_entry oe ON thread_challan_entry_grouped.order_entry_uuid = oe.uuid
            LEFT JOIN
                thread.order_info ON oe.order_info_uuid = order_info.uuid
            LEFT JOIN 
                thread.count_length ON oe.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.factory ON order_info.factory_uuid = factory.uuid
            LEFT JOIN
                commercial.pi_cash pi_cash ON pi_cash.thread_order_info_uuids IN (order_info.uuid)
            LEFT JOIN
                commercial.lc ON pi_cash.lc_uuid = lc.uuid
        `;

	const resultPromise = db.execute(query);

	try {
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
