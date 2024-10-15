import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';

export async function selectGoodsInWarehouse(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const { start_date, end_date } = req.query;
	let query = sql`
        SELECT 
            ple.quantity::float8 as amount,
            null as sewing_thread,
            CASE 
                WHEN vodf.nylon_stopper_name = 'Metallic' THEN vodf.item_name || ' Metallic'
                WHEN vodf.nylon_stopper_name = 'Plastic' THEN vodf.item_name || ' Plastic'
                ELSE vodf.item_name
            END as item_name
        FROM
            delivery.packing_list pl
            LEFT JOIN delivery.packing_list_entry ple ON pl.uuid = ple.packing_list_uuid
            LEFT JOIN zipper.v_order_details_full vodf ON pl.order_info_uuid = vodf.order_info_uuid
        UNION 
        SELECT 
            ce.quantity::float8 as amount,
            null as item_name,
            concat('ST', to_char(oi.created_at, 'YY'), '-', lpad(oi.id::text, 4, '0')) AS sewing_thread
        
        FROM
            thread.challan c 
            LEFT JOIN thread.order_info oi ON c.order_info_uuid = oi.uuid
            LEFT JOIN thread.challan_entry ce ON c.uuid = ce.challan_uuid

    `;
	if (start_date && end_date) {
		query = sql`${query} WHERE (pl.created_at BETWEEN ${start_date} AND ${end_date} OR ce.created_at BETWEEN ${start_date} AND ${end_date})`;
	}
	const resultPromise = db.execute(query);
	try {
		const result = await resultPromise;
		// Accessing the rows directly, assuming result.rows contains the data
		const data = result.rows || result; // Adjust this based on the structure of result

		let totalChallanCount = 0;
		const summary = data.reduce((acc, row) => {
			const key = row.item_name || row.sewing_thread;
			if (key.startsWith('ST')) {
				if (!acc.sewing_thread) {
					acc.sewing_thread = {
						number_of_challan: 0,
						amount: 0,
					};
				}
				acc.sewing_thread.number_of_challan += 1;
				acc.sewing_thread.amount += row.amount;
			} else {
				if (!acc.item) {
					acc.item = {};
				}
				if (!acc.item[key]) {
					acc.item[key] = {
						number_of_challan: 0,
						amount: 0,
					};
				}
				acc.item[key].number_of_challan += 1;
				acc.item[key].amount += row.amount;
			}
			totalChallanCount += 1;
			return acc;
		}, {});
		summary.totalChallanCount = totalChallanCount;
		handleResponse(res, summary);
	} catch (error) {
		handleError({ error, res });
	}
}
