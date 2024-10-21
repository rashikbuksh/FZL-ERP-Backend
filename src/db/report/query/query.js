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
                CONCAT(MIN(CASE 
                        WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS TEXT)
                        ELSE oe.size
                    END), ' - ', MAX(CASE 
                        WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS TEXT)
                        ELSE oe.size
                    END)) AS sizes,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity)::float8 AS total_quantity,
                stock.uuid as stock_uuid,
                COALESCE(production_sum.assembly_production_quantity, 0)::float8 AS assembly_production_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0)::float8 AS coloring_production_quantity,
                (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) + COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0))::float8 AS total_dyeing_transaction_quantity,
                COALESCE(sfg_production_sum.teeth_molding_quantity, 0)::float8 AS teeth_molding_quantity,
                CASE WHEN lower(vodf.item_name) = 'vislon' THEN 'KG' ELSE 'PCS' END AS teeth_molding_unit,
                COALESCE(sfg_production_sum.teeth_coloring_quantity, 0)::float8 AS teeth_coloring_quantity,
                COALESCE(sfg_production_sum.finishing_quantity, 0)::float8 AS finishing_quantity,
                COALESCE(delivery_sum.total_delivery_delivered_quantity, 0)::float8 AS total_delivery_delivered_quantity,
                COALESCE(delivery_sum.total_delivery_balance_quantity, 0)::float8 AS total_delivery_balance_quantity,
                COALESCE(delivery_sum.total_short_quantity, 0)::float8 AS total_short_quantity,
                COALESCE(delivery_sum.total_reject_quantity, 0)::float8 AS total_reject_quantity,
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
                    SUM(packing_list_entry.short_quantity)AS total_short_quantity,
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
} //* tape_preparation is missing

export async function dailyChallanReport(req, res, next) {
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
                CONCAT(oe.style, ' - ', oe.color, ' - ', 
                    CASE 
                        WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS TEXT)
                        ELSE oe.size
                    END) AS style_color_size,
                null as count_length_name,
                packing_list_grouped.total_quantity::float8,
                challan.receive_status,
                packing_list_grouped.total_short_quantity::float8,
                packing_list_grouped.total_reject_quantity::float8,
                'zipper' as product
            FROM
                delivery.challan
            LEFT JOIN 
                hr.users ON challan.created_by = users.uuid
            LEFT JOIN (
                SELECT 
                    packing_list.challan_uuid,
                    SUM(packing_list_entry.quantity)::float8 AS total_quantity,
                    SUM(packing_list_entry.short_quantity)::float8 AS total_short_quantity,
                    SUM(packing_list_entry.reject_quantity)::float8 AS total_reject_quantity,
                    oe.quantity::float8 AS order_quantity,
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
                thread_challan_entry_grouped.total_quantity::float8,
                thread_challan.received as receive_status,
                thread_challan_entry_grouped.total_short_quantity::float8,
                thread_challan_entry_grouped.total_reject_quantity::float8,
                'thread' as product
            FROM
                thread.challan thread_challan
            LEFT JOIN
                hr.users ON thread_challan.created_by = users.uuid
            LEFT JOIN (
                SELECT 
                    challan_entry.challan_uuid,
                    SUM(challan_entry.quantity)::float8 AS total_quantity,
                    SUM(challan_entry.short_quantity)::float8 AS total_short_quantity,
                    SUM(challan_entry.reject_quantity)::float8 AS total_reject_quantity,
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

export async function PiRegister(req, res, next) {
	const query = sql`
            SELECT 
                pi_cash.uuid,
                CASE WHEN is_pi = 1 THEN concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE concat('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END AS pi_cash_number,
                pi_cash.created_at AS pi_cash_created_date,
                pi_cash_entry_order_numbers.order_numbers,
                pi_cash_entry_order_numbers.thread_order_numbers,
                pi_cash.party_uuid,
                party.name as party_name,
                pi_cash.bank_uuid,
                bank.name as bank_name,
                pi_cash.marketing_uuid,
                marketing.name as marketing_name,
                pi_cash.conversion_rate,
                pi_cash_entry_order_numbers.total_pi_quantity::float8,
                (pi_cash_entry_order_numbers.total_zipper_pi_price + pi_cash_entry_order_numbers.total_thread_pi_price)::float8 as total_pi_value,
                pi_cash.lc_uuid,
                lc.lc_number,
                lc.lc_date,
                lc.lc_value::float8,
                CASE WHEN lc.uuid IS NOT NULL THEN concat('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) ELSE NULL END as file_number,
                lc.created_at as lc_created_at
            FROM
                commercial.pi_cash
            LEFT JOIN
                hr.users ON pi_cash.created_by = users.uuid
            LEFT JOIN 
                commercial.bank ON pi_cash.bank_uuid = bank.uuid
            LEFT JOIN
                commercial.lc ON pi_cash.lc_uuid = lc.uuid
            LEFT JOIN
                public.marketing ON pi_cash.marketing_uuid = marketing.uuid
            LEFT JOIN
                public.party ON pi_cash.party_uuid = party.uuid
            LEFT JOIN
                public.factory ON pi_cash.factory_uuid = factory.uuid
            LEFT JOIN (
				SELECT 
                    array_agg(DISTINCT vodf.order_number) as order_numbers, 
                    array_agg(DISTINCT CASE WHEN toi.uuid is NOT NULL THEN concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) ELSE NULL END) as thread_order_numbers, 
                    pi_cash_uuid, 
                    SUM(pe.pi_cash_quantity)::float8 as total_pi_quantity,
                    SUM(pe.pi_cash_quantity * (oe.party_price/12))::float8 as total_zipper_pi_price, 
                    SUM(pe.pi_cash_quantity * toe.party_price)::float8 as total_thread_pi_price
				FROM
					commercial.pi_cash_entry pe 
					LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
				GROUP BY pi_cash_uuid
			) pi_cash_entry_order_numbers ON pi_cash.uuid = pi_cash_entry_order_numbers.pi_cash_uuid
            WHERE pi_cash_entry_order_numbers.order_numbers IS NOT NULL OR pi_cash_entry_order_numbers.thread_order_numbers IS NOT NULL
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// * remove the null values in order_numbers and thread_order_numbers
		data?.rows.forEach((row) => {
			row.order_numbers = row.order_numbers.filter(
				(order_number) => order_number !== null
			);
			row.thread_order_numbers = row.thread_order_numbers.filter(
				(order_number) => order_number !== null
			);
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function PiToBeRegister(req, res, next) {
	const query = sql`
            SELECT 
                party.uuid,
                party.name,
                vodf_grouped.total_quantity::float8,
                vodf_grouped.total_pi::float8,
                vodf_grouped.total_balance_pi_quantity::float8,
                vodf_grouped.total_balance_pi_value::float8,
                vodf_grouped.total_delivered::float8,
                vodf_grouped.total_undelivered_balance_quantity::float8
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    SUM(order_entry.quantity) AS total_quantity,
                    SUM(order_entry.quantity - sfg.pi) AS total_balance_pi_quantity,
                    SUM((order_entry.quantity - sfg.pi) * order_entry.party_price) AS total_balance_pi_value,
                    SUM(sfg.pi) AS total_pi,
                    SUM(sfg.delivered) AS total_delivered,
                    SUM(sfg.pi - sfg.delivered) AS total_undelivered_balance_quantity,
                    vodf.party_uuid,
                    vodf.party_name
                FROM
                    zipper.sfg
                LEFT JOIN
                    zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
                LEFT JOIN 
                    zipper.v_order_details_full vodf ON order_entry.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    vodf.party_uuid, vodf.party_name
            ) vodf_grouped ON party.uuid = vodf_grouped.party_uuid
            WHERE 
                vodf_grouped.total_quantity > 0 OR vodf_grouped.total_delivered > 0 OR vodf_grouped.total_balance_pi_quantity > 0 OR vodf_grouped.total_undelivered_balance_quantity > 0
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI To Be Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function PiToBeRegisterThread(req, res, next) {
	const query = sql`
            SELECT 
                party.uuid,
                party.name,
                toi_grouped.total_quantity::float8,
                toi_grouped.total_pi::float8,
                toi_grouped.total_balance_pi_quantity::float8,
                toi_grouped.total_balance_pi_value::float8,
                toi_grouped.total_delivered::float8,
                toi_grouped.total_undelivered_balance_quantity::float8
            FROM
                public.party party
            LEFT JOIN (
                SELECT 
                    SUM(order_entry.quantity) AS total_quantity,
                    SUM(order_entry.quantity - order_entry.pi) AS total_balance_pi_quantity,
                    SUM((order_entry.quantity - order_entry.pi) * order_entry.party_price) AS total_balance_pi_value,
                    SUM(order_entry.pi) AS total_pi,
                    SUM(order_entry.delivered) AS total_delivered,
                    SUM(order_entry.pi - order_entry.delivered) AS total_undelivered_balance_quantity,
                    toi.party_uuid
                FROM
                    thread.order_entry
                LEFT JOIN 
                    thread.order_info toi ON order_entry.order_info_uuid = toi.uuid
                GROUP BY
                    toi.party_uuid
            ) toi_grouped ON party.uuid = toi_grouped.party_uuid
            WHERE 
                toi_grouped.total_quantity > 0 OR toi_grouped.total_delivered > 0 OR toi_grouped.total_balance_pi_quantity > 0 OR toi_grouped.total_undelivered_balance_quantity > 0
        `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI To Be Register',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function LCReport(req, res, next) {
	const { document_receiving, acceptance, maturity, payment } = req.query;

	console.log(document_receiving, acceptance, maturity, payment);

	const query = sql`
            SELECT 
                CONCAT('LC', to_char(lc.created_at, 'YY'), '-', LPAD(lc.id::text, 4, '0')) AS file_number,
                lc.uuid,
                lc.lc_number,
                lc.lc_date,
                party.uuid as party_uuid,
                party.name as party_name,
                lc.created_at,
                lc.updated_at,
                lc.remarks,
                lc.commercial_executive,
                lc.handover_date,
                lc.document_receive_date,
                lc.acceptance_date,
                lc.maturity_date,
                lc.payment_date,
                lc.ldbc_fdbc,
                lc.shipment_date,
                lc.expiry_date,
                lc.ud_no,
                lc.ud_received,
                pi_cash.marketing_uuid,
                marketing.name as marketing_name,
                pi_cash.bank_uuid,
                bank.name as bank_name,
                lc.party_bank,
                CASE WHEN is_old_pi = 0 THEN(	
				SELECT 
					SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
				WHERE pi_cash.lc_uuid = lc.uuid
			) ELSE lc.lc_value::float8 END AS total_value
            FROM
                commercial.lc
            LEFT JOIN
                public.party ON lc.party_uuid = party.uuid
            LEFT JOIN 
                commercial.pi_cash ON lc.uuid = pi_cash.lc_uuid
            LEFT JOIN 
                public.marketing ON pi_cash.marketing_uuid = marketing.uuid
            LEFT JOIN
                hr.users ON lc.created_by = users.uuid
            LEFT JOIN
                commercial.bank ON pi_cash.bank_uuid = bank.uuid
            WHERE
                lc.handover_date IS NOT NULL
        `;

	if (document_receiving) {
		query.append(sql`AND lc.document_receive_date IS NULL`);
	} else if (acceptance) {
		query.append(
			sql`AND lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL`
		);
	} else if (maturity) {
		query.append(
			sql`AND lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL`
		);
	} else if (payment) {
		query.append(
			sql`AND lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL`
		);
	}

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'LC Report',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function threadProductionStatusBatchWise(req, res, next) {
	const query = sql`
            SELECT
                batch.uuid,
                CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) AS batch_number,
                batch.created_at AS batch_created_at,
                order_entry.uuid as order_entry_uuid,
                order_info.uuid as order_info_uuid,
                CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_info.created_at as order_created_at,
                order_info.updated_at as order_updated_at,
                order_info.party_uuid,
                party.name as party_name,
                order_info.marketing_uuid,
                marketing.name as marketing_name,
                order_entry.style,
                order_entry.color,
                order_entry.swatch_approval_date,
                order_entry.count_length_uuid,
                count_length.count,
                count_length.length,
                batch_entry_quantity_length.total_quantity,
                batch_entry_quantity_length.total_weight,
                batch.yarn_quantity,
                batch.is_drying_complete,
                batch_entry_coning.total_coning_production_quantity,
                coalesce(thread_challan_sum.total_delivery_delivered_quantity,0) as total_delivery_delivered_quantity,
                coalesce(thread_challan_sum.total_delivery_balance_quantity,0) as total_delivery_balance_quantity,
                coalesce(thread_challan_sum.total_short_quantity,0) as total_short_quantity,
                coalesce(thread_challan_sum.total_reject_quantity,0) as total_reject_quantity,
                batch.remarks
            FROM
                thread.order_entry
            LEFT JOIN 
                thread.batch_entry ON batch_entry.order_entry_uuid = order_entry.uuid
            LEFT JOIN
                 thread.batch ON batch.uuid = batch_entry.batch_uuid
            LEFT JOIN
                thread.order_info ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT 
                    SUM(batch_entry.quantity) as total_quantity,
                    SUM(count_length.max_weight * batch_entry.quantity) as total_weight,
                    batch_entry.batch_uuid
                FROM
                    thread.batch_entry
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                LEFT JOIN thread.count_length ON order_entry.count_length_uuid = count_length.uuid
                GROUP BY
                    batch_entry.batch_uuid
            ) batch_entry_quantity_length ON batch.uuid = batch_entry.batch_uuid
            LEFT JOIN (
                SELECT 
                    SUM(coning_production_quantity) as total_coning_production_quantity,
                    batch_uuid
                FROM
                    thread.batch_entry
                GROUP BY
                    batch_uuid
            ) batch_entry_coning ON batch.uuid = batch_entry_coning.batch_uuid
             LEFT JOIN (
                SELECT 
                    toe.uuid as order_entry_uuid,
                    SUM(CASE WHEN challan.gate_pass = 1 THEN challan_entry.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN challan.gate_pass = 0 THEN challan_entry.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(challan_entry.short_quantity)AS total_short_quantity,
                    SUM(challan_entry.reject_quantity) AS total_reject_quantity
                FROM
                    thread.challan
                LEFT JOIN
                    thread.challan_entry ON challan.uuid = challan_entry.challan_uuid
                LEFT JOIN
                    thread.order_entry toe ON challan_entry.order_entry_uuid = toe.uuid
                GROUP BY
                    toe.uuid
            ) thread_challan_sum ON thread_challan_sum.order_entry_uuid = order_entry.uuid
            WHERE batch.uuid IS NOT NULL
            `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Production Status Batch Wise',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportDirector(req, res, next) {
	const query = sql`
            SELECT 
                vodf.order_info_uuid,
                vodf.item,
                vodf.item_name,
                vodf.order_number,
                vodf.party_uuid,
                vodf.party_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.end_type,
                vodf.end_type_name,
                coalesce(close_end_sum.total_close_end_quantity,0) as total_close_end_quantity,
                coalesce(open_end_sum.total_open_end_quantity,0) as total_open_end_quantity,
                coalesce(close_end_sum.total_close_end_quantity + open_end_sum.total_open_end_quantity,0) as total_quantity
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'close end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_close_end_quantity,
                    oe.order_description_uuid
                FROM
                    zipper.sfg_production
                    LEFT JOIN zipper.sfg ON sfg_production.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.order_description_uuid
            ) close_end_sum ON vodf.order_description_uuid = close_end_sum.order_description_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'open end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_open_end_quantity,
                    oe.order_description_uuid
                FROM
                    zipper.sfg_production
                    LEFT JOIN zipper.sfg ON sfg_production.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.order_description_uuid
            ) open_end_sum ON vodf.order_description_uuid = open_end_sum.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL
            ORDER BY vodf.item_name DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// row group using item_name, then party_name, then order_number, then item_description
		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				item_name,
				party_name,
				order_number,
				item_description,
				total_close_end_quantity,
				total_open_end_quantity,
				total_quantity,
			} = row;

			const findOrCreate = (array, key, value, createFn) => {
				let index = array.findIndex((item) => item[key] === value);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const item = findOrCreate(acc, 'item_name', item_name, () => ({
				item_name,
				parties: [],
			}));

			const party = findOrCreate(
				item.parties,
				'party_name',
				party_name,
				() => ({
					party_name,
					orders: [],
				})
			);

			const order = findOrCreate(
				party.orders,
				'order_number',
				order_number,
				() => ({
					order_number,
					descriptions: [],
				})
			);

			order.descriptions.push({
				item_description,
				total_close_end_quantity,
				total_open_end_quantity,
				total_quantity,
			});

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director',
		};

		res.status(200).json({ toast, data: groupedData });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadDirector(req, res, next) {
	const query = sql`
            SELECT 
                order_info.uuid,
                'Sewing Thread' as item_name,
                order_info.party_uuid,
                party.name as party_name,
                CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0) as total_quantity,
                coalesce(prod_quantity.total_coning_carton_quantity,0) as total_coning_carton_quantity
            FROM
                thread.order_info
            LEFT JOIN
                thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry_production.production_quantity) as total_quantity,
                    SUM(batch_entry_production.coning_carton_quantity) as total_coning_carton_quantity,
                    order_entry.order_info_uuid
                FROM
                    thread.batch_entry_production
                LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.order_info_uuid
            ) prod_quantity ON order_info.uuid = prod_quantity.order_info_uuid
            GROUP BY 
                order_info.uuid, party.name, order_info.created_at, count_length.count, count_length.length, prod_quantity.total_quantity, prod_quantity.total_coning_carton_quantity
            ORDER BY party.name DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// first group by item_name, then party_name, then order_number, then count_length_name
		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		count_length_name,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			count_lengths: [],
		// 		})
		// 	);

		// 	order.count_lengths.push({
		// 		count_length_name,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportSnm(req, res, next) {
	const query = sql`
            SELECT 
                vodf.order_info_uuid,
                vodf.item,
                vodf.item_name,
                vodf.order_number,
                vodf.party_uuid,
                vodf.party_name,
                vodf.order_description_uuid,
                vodf.item_description,
                vodf.end_type,
                vodf.end_type_name,
                oe,uuid as order_entry_uuid,
                oe.size,
                coalesce(close_end_sum.total_close_end_quantity,0) as total_close_end_quantity,
                coalesce(open_end_sum.total_open_end_quantity,0) as total_open_end_quantity,
                coalesce(close_end_sum.total_close_end_quantity + open_end_sum.total_open_end_quantity,0) as total_quantity
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN 
                zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'close end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_close_end_quantity,
                    oe.uuid as order_entry_uuid
                FROM
                    zipper.sfg_production
                    LEFT JOIN zipper.sfg ON sfg_production.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.uuid
            ) close_end_sum ON oe.uuid = close_end_sum.order_entry_uuid
            LEFT JOIN (
                SELECT 
                    coalesce(SUM(CASE WHEN lower(vodf.end_type_name) = 'open end' THEN sfg_production.production_quantity::float8 ELSE 0 END), 0)::float8 AS total_open_end_quantity,
                    oe.uuid as order_entry_uuid
                FROM
                    zipper.sfg_production
                    LEFT JOIN zipper.sfg ON sfg_production.sfg_uuid = sfg.uuid
                    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
                GROUP BY
                    oe.uuid
            ) open_end_sum ON oe.uuid = open_end_sum.order_entry_uuid
            WHERE vodf.order_description_uuid IS NOT NULL
            ORDER BY vodf.item_name DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// row group using firstly item_name, secondly party_name, thirdly order_number, fourthly item_description, fifth size

		const groupedData = data?.rows.reduce((acc, row) => {
			const {
				item_name,
				party_name,
				order_number,
				item_description,
				size,
				total_close_end_quantity,
				total_open_end_quantity,
				total_quantity,
			} = row;

			const findOrCreate = (array, key, value, createFn) => {
				let index = array.findIndex((item) => item[key] === value);
				if (index === -1) {
					array.push(createFn());
					index = array.length - 1;
				}
				return array[index];
			};

			const item = findOrCreate(acc, 'item_name', item_name, () => ({
				item_name,
				parties: [],
			}));

			const party = findOrCreate(
				item.parties,
				'party_name',
				party_name,
				() => ({
					party_name,
					orders: [],
				})
			);

			const order = findOrCreate(
				party.orders,
				'order_number',
				order_number,
				() => ({
					order_number,
					items: [],
				})
			);

			const itemEntry = findOrCreate(
				order.items,
				'item_description',
				item_description,
				() => ({
					item_description,
					sizes: [],
				})
			);

			itemEntry.sizes.push({
				size,
				total_close_end_quantity,
				total_open_end_quantity,
				total_quantity,
			});

			return acc;
		}, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report S&M',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function ProductionReportThreadSnm(req, res, next) {
	const query = sql`
            SELECT 
                order_info.uuid,
                'Sewing Thread' as item_name,
                order_info.party_uuid,
                party.name as party_name,
                CONCAT('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
                order_entry.uuid as order_entry_uuid,
                count_length.count,
                CONCAT(count_length.count, ' - ', count_length.length) as count_length_name,
                coalesce(prod_quantity.total_quantity,0) as total_quantity,
                coalesce(prod_quantity.total_coning_carton_quantity,0) as total_coning_carton_quantity
            FROM
                thread.order_info
            LEFT JOIN
                thread.order_entry ON order_entry.order_info_uuid = order_info.uuid
            LEFT JOIN
                thread.count_length ON order_entry.count_length_uuid = count_length.uuid
            LEFT JOIN
                public.party ON order_info.party_uuid = party.uuid
            LEFT JOIN
                public.marketing ON order_info.marketing_uuid = marketing.uuid
            LEFT JOIN (
                SELECT
                    SUM(batch_entry_production.production_quantity) as total_quantity,
                    SUM(batch_entry_production.coning_carton_quantity) as total_coning_carton_quantity,
                    order_entry.uuid as order_entry_uuid
                FROM
                    thread.batch_entry_production
                LEFT JOIN thread.batch_entry ON batch_entry_production.batch_entry_uuid = batch_entry.uuid
                LEFT JOIN thread.order_entry ON batch_entry.order_entry_uuid = order_entry.uuid
                GROUP BY
                    order_entry.uuid
            ) prod_quantity ON order_entry.uuid = prod_quantity.order_entry_uuid
            ORDER BY party.name DESC
    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// first group by item_name, then party_name, then order_number, then count_length_name
		// const groupedData = data?.rows.reduce((acc, row) => {
		// 	const {
		// 		item_name,
		// 		party_name,
		// 		order_number,
		// 		count_length_name,
		// 		count,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	} = row;

		// 	const findOrCreate = (array, key, value, createFn) => {
		// 		let index = array.findIndex((item) => item[key] === value);
		// 		if (index === -1) {
		// 			array.push(createFn());
		// 			index = array.length - 1;
		// 		}
		// 		return array[index];
		// 	};

		// 	const item = findOrCreate(acc, 'item_name', item_name, () => ({
		// 		item_name,
		// 		parties: [],
		// 	}));

		// 	const party = findOrCreate(
		// 		item.parties,
		// 		'party_name',
		// 		party_name,
		// 		() => ({
		// 			party_name,
		// 			orders: [],
		// 		})
		// 	);

		// 	const order = findOrCreate(
		// 		party.orders,
		// 		'order_number',
		// 		order_number,
		// 		() => ({
		// 			order_number,
		// 			count_lengths: [],
		// 		})
		// 	);

		// 	const count_length = findOrCreate(
		// 		order.count_lengths,
		// 		'count_length_name',
		// 		count_length_name,
		// 		() => ({
		// 			count_length_name,
		// 			count: [],
		// 		})
		// 	);

		// 	count_length.count.push({
		// 		count,
		// 		total_quantity,
		// 		total_coning_carton_quantity,
		// 	});

		// 	return acc;
		// }, []);

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Production Report Director Thread',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
