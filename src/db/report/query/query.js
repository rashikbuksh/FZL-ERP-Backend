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
                swatch_approval_counts.swatch_approval_count,
				order_entry_counts.order_entry_count,
                ARRAY_AGG(DISTINCT oe.style) AS styles,
                CONCAT(MIN(oe.size), ' - ', MAX(oe.size)) AS sizes,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity) AS total_quantity,
                stock.uuid as stock_uuid,
                COALESCE(production_sum.assembly_production_quantity, 0) AS assembly_production_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0) AS coloring_production_quantity
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
                production_sum.coloring_production_quantity
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
} // incomplete
