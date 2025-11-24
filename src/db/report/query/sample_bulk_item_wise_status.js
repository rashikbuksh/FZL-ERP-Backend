import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectSampleBulkItemWiseStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { item_type, order_type, status } = req.query;

	const query = sql`
    WITH zipper_results AS (
        SELECT
            CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', oi.id::text) AS order_no,
            oi.uuid as order_uuid,
            oi.created_at AS issue_date,
            CASE 
                WHEN (MAX(pl.challan_uuid) IS NOT NULL AND SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) >= oe_sum.order_quantity) THEN 'Complete'
                WHEN MAX(pl.challan_uuid) IS NULL THEN 'Pending' 
                ELSE 'Processing' 
            END AS status,
            MAX(c.created_at) AS delivery_last_date,
            SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) AS delivery_quantity,
            oe_sum.order_quantity AS order_quantity,
            oe_sum.color_count AS color_count,
            CONCAT(SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END), '/', oe_sum.order_quantity) AS delivery_order_quantity,
            vodf.party_name,
            vodf.marketing_name
        FROM
            zipper.order_info oi
            LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON od.uuid = vodf.order_description_uuid
            LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    SUM(CASE WHEN vodf.order_type = 'tape' THEN COALESCE(oe.size::float8, 0) ELSE COALESCE(oe.quantity::float8, 0) END) AS order_quantity,
                    COUNT(DISTINCT oe.color)::float8 as color_count,
                    vodf.order_description_uuid
                FROM
                    zipper.order_entry oe
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                WHERE
                    ${order_type == 'sample' ? sql` vodf.is_sample = 1` : order_type == 'bulk' ? sql` vodf.is_sample = 0` : sql`1=1`}
                GROUP BY
                    vodf.order_description_uuid
            ) oe_sum ON oe.order_description_uuid = oe_sum.order_description_uuid
            LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
            LEFT JOIN delivery.packing_list_entry ple ON sfg.uuid = ple.sfg_uuid
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN delivery.challan c ON pl.challan_uuid = c.uuid
        WHERE
           od.uuid IS NOT NULL
           AND vodf.is_cancelled = FALSE
           ${order_type == 'sample' ? sql` AND oi.is_sample = 1` : order_type == 'bulk' ? sql` AND oi.is_sample = 0` : sql``}
        GROUP BY
            oi.uuid, oi.id, oi.is_sample, oi.created_at, oe_sum.order_quantity, vodf.party_name, vodf.marketing_name, oe_sum.color_count
        HAVING
            ${
				status == 'pending'
					? sql`MAX(pl.challan_uuid) IS NULL`
					: status == 'processing'
						? sql`MAX(pl.challan_uuid) IS NOT NULL AND SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) < oe_sum.order_quantity`
						: status == 'complete'
							? sql`MAX(pl.challan_uuid) IS NOT NULL AND SUM(CASE WHEN (pl.challan_uuid IS NOT NULL AND ple.sfg_uuid IS NOT NULL) THEN COALESCE(ple.quantity::float8, 0) ELSE 0 END) >= oe_sum.order_quantity`
							: sql`1=1`
			}
    ),
    thread_results AS (
        SELECT
            CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) AS order_no,
            toi.uuid as order_uuid,
            toi.created_at AS issue_date,
            CASE 
                WHEN (MAX(tc.uuid) IS NOT NULL AND SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) >= SUM(toe.quantity::float8)) THEN 'Complete'
                WHEN MAX(tc.uuid) IS NULL THEN 'Pending' 
                ELSE 'Processing' 
            END AS status,
            MAX(tc.created_at) AS delivery_last_date,
            SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) AS delivery_quantity,
            SUM(toe.quantity::float8) AS order_quantity,
            COUNT(DISTINCT toe.color)::float8 AS color_count,
            CONCAT(SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END), '/', SUM(toe.quantity::float8)) AS delivery_order_quantity,
            pm.name AS marketing_name,
            pp.name AS party_name
        FROM
            thread.order_info toi
            LEFT JOIN public.marketing pm ON toi.marketing_uuid = pm.uuid
            LEFT JOIN public.party pp ON toi.party_uuid = pp.uuid
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN delivery.packing_list_entry ple ON toe.uuid = ple.thread_order_entry_uuid
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
            LEFT JOIN delivery.challan tc ON pl.challan_uuid = tc.uuid
        WHERE 
            ${order_type == 'sample' ? sql` toi.is_sample = 1` : order_type == 'bulk' ? sql` toi.is_sample = 0` : sql` 1=1`}
            AND toi.is_cancelled = FALSE
        GROUP BY
            toi.uuid, toi.id, toi.is_sample, toi.created_at, pm.name, pp.name
        HAVING
            ${
				status == 'pending'
					? sql`MAX(tc.uuid) IS NULL`
					: status == 'processing'
						? sql`MAX(tc.uuid) IS NOT NULL AND SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) < SUM(toe.quantity::float8)`
						: status == 'complete'
							? sql`MAX(tc.uuid) IS NOT NULL AND SUM(CASE WHEN (tc.uuid IS NULL AND ple.thread_order_entry_uuid IS NULL) THEN 0 ELSE ple.quantity::float8 END) >= SUM(toe.quantity::float8)`
							: sql`1=1`
			}
    )
    SELECT * 
    FROM (
        ${
			item_type == 'zipper'
				? sql`SELECT * FROM zipper_results`
				: item_type == 'thread'
					? sql`SELECT * FROM thread_results`
					: sql`
                    SELECT * FROM zipper_results
                    UNION ALL
                    SELECT * FROM thread_results`
		}
        
    ) AS combined_results
    ORDER BY issue_date DESC;
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Sample Lead Time',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
