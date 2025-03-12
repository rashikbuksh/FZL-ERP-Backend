import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { bank, manual_pi } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db.insert(manual_pi).values(req.body).returning({
		insertedName: manual_pi.pi_number,
	});
	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedName} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db
		.update(manual_pi)
		.set(req.body)
		.where(eq(manual_pi.uuid, req.params.uuid))
		.returning({ updatedName: manual_pi.pi_number });

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db
		.delete(manual_pi)
		.where(eq(manual_pi.uuid, req.params.uuid))
		.returning({ deletedName: manual_pi.pi_number });

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { own_uuid } = req.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const query = sql`
						SELECT
							cmp.uuid,
							cmp.pi_uuids,
							jsonb_agg(DISTINCT concat('PI', to_char(pi_cash_id.created_at, 'YY'), '-', LPAD(pi_cash_id.id::text, 4, '0'))) AS pi_ids,
							cmpe_total_value.total_value AS total_value,
							cmpe_total_value.order_number AS order_number,
							cmp.marketing_uuid,
							pm.name AS marketing_name,
							cmp.party_uuid,
							pp.name AS party_name,
							pp.address AS party_address,
							cmp.buyer_uuid,
							pb.name AS buyer_name,
							cmp.merchandiser_uuid,
							pmr.name AS merchandiser_name,
							cmp.factory_uuid,
							pf.name AS factory_name,
							cmp.bank_uuid,
							cb.name AS bank_name,
							cb.address AS bank_address,
							cb.swift_code AS bank_swift_code,
							cb.policy AS bank_policy,
							cb.routing_no,
							cmp.validity,
							cmp.payment,
							cmp.remarks,
							cmp.created_by,
							hs.name AS created_by_name,
							cmp.receive_amount,
							cmp.weight,
							cmp.date,
							cmp.pi_number,
							cmp.created_at,
							cmp.updated_at
						FROM
							commercial.manual_pi cmp
						LEFT JOIN
							hr.users hs ON cmp.created_by = hs.uuid
						LEFT JOIN
							public.marketing pm ON cmp.marketing_uuid = pm.uuid
						LEFT JOIN
							public.merchandiser pmr ON cmp.merchandiser_uuid = pmr.uuid
						LEFT JOIN
							public.factory pf ON cmp.factory_uuid = pf.uuid
						LEFT JOIN
							public.party pp ON cmp.party_uuid = pp.uuid
						LEFT JOIN
							public.buyer pb ON cmp.buyer_uuid = pb.uuid
						LEFT JOIN
							commercial.bank cb ON cmp.bank_uuid = cb.uuid
						LEFT JOIN (
									SELECT 
										cpc.id,
										cpc.uuid,
										cpc.created_at
									FROM
										commercial.pi_cash cpc
								) AS pi_cash_id ON pi_cash_id.uuid = ANY(cmp.pi_uuids)
						LEFT JOIN (
									SELECT 
										cmpe.manual_pi_uuid,
										SUM(CASE 
											WHEN cmpe.is_zipper = true THEN (cmpe.unit_price / 12) * cmpe.quantity::float8 
											ELSE (cmpe.unit_price * cmpe.quantity::float8) 
										END) AS total_value,
										jsonb_agg(DISTINCT cmpe.order_number) AS order_number
									FROM commercial.manual_pi_entry cmpe
									GROUP BY cmpe.manual_pi_uuid
								) AS cmpe_total_value ON cmpe_total_value.manual_pi_uuid = cmp.uuid
						WHERE
							${own_uuid ? sql`cmp.marketing_uuid = ${marketingUuid}` : sql`1=1`}
						GROUP BY
							cmp.uuid,
							cmp.pi_uuids,
							cmp.marketing_uuid,
							pm.name,
							cmp.party_uuid,
							pp.name,
							pp.address,
							cmp.buyer_uuid,
							pb.name,
							cmp.merchandiser_uuid,
							pmr.name,
							cmp.factory_uuid,
							pf.name,
							cmp.bank_uuid,
							cb.name,
							cb.address,
							cb.swift_code,
							cb.policy,
							cb.routing_no,
							cmp.validity,
							cmp.payment,
							cmp.remarks,
							cmp.created_by,
							hs.name,
							cmp.receive_amount,
							cmp.weight,
							cmp.date,
							cmp.pi_number,
							cmp.created_at,
							cmp.updated_at,
							cmpe_total_value.total_value,
							cmpe_total_value.order_number
						ORDER BY
							cmp.created_at ASC`;

		const resultPromise = db.execute(query);

		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'manual_pi list',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const manualPiPromise = db
		.select({
			uuid: manual_pi.uuid,
			pi_uuids: manual_pi.pi_uuids,
			marketing_uuid: manual_pi.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: manual_pi.party_uuid,
			party_name: publicSchema.party.name,
			party_address: publicSchema.party.address,
			buyer_uuid: manual_pi.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			merchandiser_uuid: manual_pi.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: manual_pi.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: manual_pi.bank_uuid,
			bank_name: bank.name,
			bank_address: bank.address,
			bank_swift_code: bank.swift_code,
			bank_policy: bank.policy,
			routing_no: bank.routing_no,
			validity: manual_pi.validity,
			payment: manual_pi.payment,
			remarks: manual_pi.remarks,
			created_by: manual_pi.created_by,
			created_by_name: hrSchema.users.name,
			receive_amount: decimalToNumber(manual_pi.receive_amount),
			weight: decimalToNumber(manual_pi.weight),
			date: manual_pi.date,
			pi_number: manual_pi.pi_number,
			created_at: manual_pi.created_at,
			updated_at: manual_pi.updated_at,
		})
		.from(manual_pi)
		.leftJoin(hrSchema.users, eq(manual_pi.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(manual_pi.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(manual_pi.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(manual_pi.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(manual_pi.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(manual_pi.buyer_uuid, publicSchema.buyer.uuid)
		)
		.leftJoin(bank, eq(manual_pi.bank_uuid, bank.uuid))
		.where(eq(manual_pi.uuid, req.params.uuid));

	try {
		const data = await manualPiPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'manual_pi',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectManualPiByManualPiUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { manual_pi_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${manual_pi_uuid}`)
				.then((response) => response);

		const [manual_pi, manual_pi_entry] = await Promise.all([
			fetchData('/commercial/manual-pi'),
			fetchData('/commercial/manual-pi-entry/by'),
		]);

		const manual_zipper_pi_entry = manual_pi_entry?.data?.data
			.filter((e) => e.is_zipper === true)
			.sort((a, b) => a.item.localeCompare(b.item));

		const manual_thread_pi_entry = manual_pi_entry?.data?.data
			.filter((e) => e.is_zipper === false)
			.sort((a, b) => a.order_number.localeCompare(b.order_number))
			.sort((a, b) => a.size.localeCompare(b.size));

		const response = {
			...manual_pi?.data?.data,
			manual_zipper_pi_entry: manual_zipper_pi_entry || [],
			manual_thread_pi_entry: manual_thread_pi_entry || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Manual Pi Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
