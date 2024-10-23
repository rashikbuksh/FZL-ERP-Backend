import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

export async function selectAmountAndDoc(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_doc_rcv_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_doc_rcv,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_acceptance_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_acceptance_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_maturity_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_maturity_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_payment_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_payment_due
                        FROM (
                            SELECT 
                                lc.*,
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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];

		response.chart_data = [
			{
				name: 'Acceptance Due',
				amount: response.total_acceptance_due,
				no_of_doc: response.number_of_pending_acceptance_due,
			},
			{
				name: 'Maturity Due',
				amount: response.total_maturity_due,
				no_of_doc: response.number_of_pending_maturity_due,
			},
			{
				name: 'Payment Due',
				amount: response.total_payment_due,
				no_of_doc: response.number_of_pending_payment_due,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Amount and Doc',
		};

		return res.status(200).json({ toast, data: response });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectDocumentRcvDue(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_doc_rcv_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_doc_rcv
                        FROM (
                            SELECT 
                                lc.*,
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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];
		const chart_data = [
			{
				label: 'Document Receive Due',
				value: response.total_doc_rcv_due,
			},
			{
				label: 'Number of Pending Document Receive',
				value: response.number_of_pending_doc_rcv,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Document Receive Due',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAcceptanceDue(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_acceptance_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_acceptance_due
                        FROM (
                            SELECT 
                                lc.*,
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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];
		const chart_data = [
			{
				label: 'Acceptance Due',
				value: response.total_acceptance_due,
			},
			{
				label: 'Number of Pending Acceptance',
				value: response.number_of_pending_acceptance_due,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Acceptance Due',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}
export async function selectMaturityDue(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_maturity_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_maturity_due
                        FROM (
                            SELECT 
                                lc.*,
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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];

		const chart_data = [
			{
				label: 'Maturity Due',
				value: response.total_maturity_due,
			},
			{
				label: 'Number of Pending Maturity',
				value: response.number_of_pending_maturity_due,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Maturity Due',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectPaymentDue(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_payment_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_payment_due
                        FROM (
                            SELECT 
                                lc.*,
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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];

		const chart_data = [
			{
				label: 'Payment Due',
				value: response.total_payment_due,
			},
			{
				label: 'Number of Pending Payment',
				value: response.number_of_pending_payment_due,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Payment Due',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectAmountPercentage(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_doc_rcv_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_doc_rcv,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_acceptance_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_acceptance_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_maturity_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_maturity_due,
                            
                            SUM(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN total_value
                                ELSE 0 END)::float8 AS total_payment_due,
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_payment_due
                        FROM (
                            SELECT 
                                lc.*,
                                CASE WHEN is_old_pi = 0 THEN(	
                                    SELECT 
                                        SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
                                    FROM commercial.pi_cash 
                                        LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
                                        LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                                        LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
                                    WHERE pi_cash.lc_uuid = lc.uuid
                                ) ELSE lc.lc_value::float8
                                END AS total_value

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
                        ) AS lc
                    `;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];

		const amounts = [
			{
				name: 'total_acceptance_due',
				amount: response.total_acceptance_due,
			},
			{
				name: 'total_maturity_due',
				amount: response.total_maturity_due,
			},
			{
				name: 'total_payment_due',
				amount: response.total_payment_due,
			},
		];

		// Calculate the total amount
		const totalAmount = amounts.reduce((sum, item) => sum + item.amount, 0);

		// Calculate the percentage for each amount and update the Amount field
		const amountsWithPercentage = amounts.map((item) => ({
			...item,
			amount: parseFloat(((item.amount / totalAmount) * 100).toFixed(2)),
		}));

		const chart_data = amountsWithPercentage;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Amount and Doc',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function selectNoOfDoc(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                        SELECT 
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_doc_rcv,
                            
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_acceptance_due,
                            
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_maturity_due,
                            
                            COUNT(CASE 
                                WHEN lc.document_receive_date IS NOT NULL AND lc.acceptance_date IS NOT NULL AND lc.maturity_date IS NOT NULL AND lc.payment_date IS NULL THEN 1 
                                ELSE NULL END)::float8 AS number_of_pending_payment_due
                        FROM (
                            SELECT 
                                lc.*,
                                CASE WHEN is_old_pi = 0 THEN(	
                                    SELECT 
                                        SUM(coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)/12)
                                    FROM commercial.pi_cash 
                                        LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
                                        LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
                                        LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
                                    WHERE pi_cash.lc_uuid = lc.uuid
                                ) ELSE lc.lc_value::float8
                                END AS total_value

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
                        ) AS lc
                    `;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		const response = data.rows[0];
		const chart_data = [
			{
				name: 'total_acceptance_due',
				amount: response.number_of_pending_acceptance_due,
			},
			{
				name: 'total_maturity_due',
				amount: response.number_of_pending_maturity_due,
			},
			{
				name: 'total_payment_due',
				amount: response.number_of_pending_payment_due,
			},
		];

		const toast = {
			status: 200,
			type: 'select',
			message: 'Number of Doc',
		};

		return res.status(200).json({ toast, data: chart_data });
	} catch (error) {
		handleError({ error, res });
	}
}
