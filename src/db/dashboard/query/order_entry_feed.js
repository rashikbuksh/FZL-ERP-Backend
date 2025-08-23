import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderEntryFeed(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
        SELECT 
            CONCAT('Z', CASE WHEN oi.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi.created_at, 'YY'), '-', oi.id::text) as order_no,
            vodf.party_name,
            vodf.marketing_name,
            vodf.item_description as item,
            sum(oe.quantity)::float8 as quantity
        FROM
            zipper.order_info oi
            LEFT JOIN zipper.order_description od ON oi.uuid = od.order_info_uuid
            LEFT JOIN zipper.order_entry oe ON od.uuid = oe.order_description_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON od.uuid = vodf.order_description_uuid
        WHERE 
            od.uuid IS NOT NULL AND vodf.is_cancelled = false
        GROUP BY
            order_no, vodf.party_name, vodf.item_description, vodf.marketing_name
        UNION 
        SELECT 
            CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', TO_CHAR(toi.id, 'FM000000')) as order_no,
            pp.name as party_name,
            pm.name as marketing_name,
            'Sewing Thread' as item,
            sum(toe.carton_quantity)::float8 as quantity
        FROM
            thread.order_info toi
            LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
            LEFT JOIN public.party pp ON toi.party_uuid = pp.uuid
            LEFT JOIN public.marketing pm ON toi.marketing_uuid = pm.uuid
        WHERE 
            toi.is_cancelled = false
        GROUP BY
            order_no, pp.name, pm.name
        ORDER BY
            order_no DESC
        LIMIT 10;
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order entry feed fetched successfully',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
