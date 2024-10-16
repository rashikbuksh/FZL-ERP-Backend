import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectProductionStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                SELECT 
                        vodf.item_name,
                        vodf.nylon_stopper_name,
                        SUM(
                            sfg.teeth_molding_stock::float8 + 
                            sfg.teeth_molding_prod::float8 + 
                            sfg.teeth_coloring_stock::float8 + 
                            sfg.teeth_coloring_prod::float8 + 
                            sfg.finishing_stock::float8 + 
                            sfg.finishing_prod::float8
                        )::float8 AS total_quantity
                FROM
                    zipper.v_order_details_full vodf
                LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
                LEFT JOIN zipper.sfg ON oe.uuid = sfg.order_entry_uuid

                WHERE vodf.order_description_uuid IS NOT NULL

                GROUP BY 
                vodf.item_name, vodf.nylon_stopper_name

                UNION    

                SELECT
                        'Sewing Thread' as item_name,
                        null as nylon_stopper_name,
                        SUM(prod_quantity.total_quantity) as total_quantity
                FROM 
                    thread.order_info
                LEFT JOIN (
                    SELECT
                        SUM(batch_entry_production.production_quantity) as total_quantity,
                        order_entry.order_info_uuid
                    FROM
                        thread.batch_entry_production
                    LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                    LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                    GROUP BY
                        order_entry.order_info_uuid
                ) prod_quantity ON order_info.uuid = prod_quantity.order_info_uuid
                GROUP BY item_name, nylon_stopper_name;
    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Production Status',
		};

		return res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
