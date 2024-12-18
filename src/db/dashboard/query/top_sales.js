import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectTopSales(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                    SELECT 
                        pm.name AS name,
                        SUM(
                            CASE 
                                WHEN ple.sfg_uuid IS NOT NULL 
                                THEN 
                                    CASE 
                                        WHEN od.order_type = 'tape' 
                                        THEN ple.quantity::float8 * oe.company_price 
                                        ELSE ple.quantity * oe.company_price/12
                                    END
                                ELSE ple.quantity * toe.company_price 
                        END)::float8 AS sales
                    FROM 
                        delivery.packing_list_entry ple
                    LEFT JOIN 
                        delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
                    LEFT JOIN
                        zipper.sfg sfg ON ple.sfg_uuid = sfg.uuid
                    LEFT JOIN
                        zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN
                        zipper.order_description od ON oe.order_description_uuid = od.uuid
                    LEFT JOIN
                        zipper.order_info oi ON od.order_info_uuid = oi.uuid
                    LEFT JOIN 
                        thread.order_entry toe ON ple.thread_order_entry_uuid = toe.uuid
                    LEFT JOIN 
                        thread.order_info toi ON toe.order_info_uuid = toi.uuid
                    LEFT JOIN
                        public.marketing pm ON oi.marketing_uuid = pm.uuid OR toi.marketing_uuid = pm.uuid
                    WHERE pl.challan_uuid IS NOT NULL
                    GROUP BY 
                        pm.name
                    ORDER BY 
                        sales DESC
                    LIMIT 10;
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows.map((row) => ({
			name: row.name,
			sales: row.sales,
		}));

		const toast = {
			status: 200,
			type: 'select',
			message: 'Top sales data selected successfully',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}
