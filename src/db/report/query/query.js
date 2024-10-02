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
                challan.created_at AS challan_uuid,
                challan.id AS challan_id,
                challan.order_info_uuid,
                challan.created_at AS challan_created_at,
                challan.carton_quantity,
                challan.gate_pass,
                challan.receive_status,
                challan.created_by,
                oe.color,
                oe.style,
                oe.size,
                packing_list_entry.quantity,
                packing_list_entry.short_quantity,
                packing_list_entry.reject_quantity,
                packing_list_entry.created_at AS packing_list_entry_created_at,
                packing_list_entry.updated_at AS packing_list_entry_updated_at,
                packing_list_entry.remarks AS packing_list_entry_remarks
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
            WHERE challan.uuid IS NOT NULL
            ORDER BY challan.created_at DESC
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
