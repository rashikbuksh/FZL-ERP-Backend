import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { bank, lc, pi_cash } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		order_info_uuids,
		thread_order_info_uuids,
		marketing_uuid,
		party_uuid,
		merchandiser_uuid,
		factory_uuid,
		bank_uuid,
		validity,
		payment,
		created_by,
		created_at,
		remarks,
		is_pi,
		is_rtgs,
		conversion_rate,
		weight,
		receive_amount,
	} = req.body;

	const piPromise = db
		.insert(pi_cash)
		.values({
			uuid,
			order_info_uuids,
			thread_order_info_uuids,
			marketing_uuid,
			party_uuid,
			merchandiser_uuid,
			factory_uuid,
			bank_uuid,
			validity,
			payment,
			created_by,
			created_at,
			remarks,
			is_pi,
			is_rtgs,
			conversion_rate,
			weight,
			receive_amount,
		})
		.returning({
			insertedId: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
		});
	try {
		const data = await piPromise;
		const toast = {
			status: 201,
			type: 'create',
			message: `${data[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.update(pi_cash)
		.set(req.body)
		.where(eq(pi_cash.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CASE WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END`,
		});

	try {
		const data = await piPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `updated by ${data[0].updatedId} `,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.delete(pi_cash)
		.where(eq(pi_cash.uuid, req.params.uuid))
		.returning({
			deletedId: sql`CASE WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END`,
		});

	try {
		const data = await piPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { is_cash, own_uuid } = req?.query;

	const query = sql`
		SELECT 
			pi_cash.uuid,
			CASE 
				WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
				ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
			END AS id,
			pi_cash.lc_uuid,
			lc.lc_number,
			COALESCE(pi_cash.order_info_uuids, '[]') AS order_info_uuids,
			COALESCE(
				jsonb_agg(DISTINCT jsonb_build_object('order_info_uuid', zipper_order_numbers.order_info_uuid, 'order_number', zipper_order_numbers.order_number))
				FILTER (WHERE zipper_order_numbers.order_number IS NOT NULL), '[]'
			) AS order_numbers,
			COALESCE(pi_cash.thread_order_info_uuids, '[]') AS thread_order_info_uuids,
			COALESCE(
				jsonb_agg(DISTINCT jsonb_build_object('thread_order_info_uuid', thread_order_numbers.order_info_uuid, 'thread_order_number', thread_order_numbers.thread_order_number))
				FILTER (WHERE thread_order_numbers.thread_order_number IS NOT NULL), '[]'
    		) AS thread_order_numbers,
			pi_cash.marketing_uuid,
			public.marketing.name AS marketing_name,
			pi_cash.party_uuid,
			public.party.name AS party_name,
			public.party.address AS party_address,
			pi_cash.merchandiser_uuid,
			public.merchandiser.name AS merchandiser_name,
			pi_cash.factory_uuid,
			public.factory.name AS factory_name,
			pi_cash.bank_uuid,
			bank.name AS bank_name,
			bank.swift_code AS bank_swift_code,
			bank.address AS bank_address,
			bank.policy AS bank_policy,
			bank.routing_no AS routing_no,
			public.factory.address AS factory_address,
			pi_cash.validity::float8,
			pi_cash.payment::float8,
			pi_cash.created_by,
			hr.users.name AS created_by_name,
			pi_cash.created_at,
			pi_cash.updated_at,
			pi_cash.remarks,
			pi_cash.is_pi::float8,
			pi_cash.is_rtgs,
			pi_cash.conversion_rate::float8,
			pi_cash.weight::float8,
			pi_cash.receive_amount::float8,
			CASE 
				WHEN pi_cash.is_pi = 1 
				THEN ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) 
				ELSE ROUND((total_pi_amount.total_amount::numeric + total_pi_amount_thread.total_amount::numeric), 2) * pi_cash.conversion_rate::float8 END AS total_amount,
			jsonb_agg(DISTINCT od.order_type) AS order_type
		FROM 
			commercial.pi_cash
		LEFT JOIN 
			hr.users ON pi_cash.created_by = hr.users.uuid
		LEFT JOIN 
			public.marketing ON pi_cash.marketing_uuid = public.marketing.uuid
		LEFT JOIN 
			public.party ON pi_cash.party_uuid = public.party.uuid
		LEFT JOIN 
			public.merchandiser ON pi_cash.merchandiser_uuid = public.merchandiser.uuid
		LEFT JOIN 
			public.factory ON pi_cash.factory_uuid = public.factory.uuid
		LEFT JOIN 
			commercial.bank ON pi_cash.bank_uuid = bank.uuid
		LEFT JOIN 
			commercial.lc ON pi_cash.lc_uuid = lc.uuid
		LEFT JOIN
			commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
		LEFT JOIN 
			zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
		LEFT JOIN
			zipper.order_description od ON order_entry.order_description_uuid = od.uuid
		LEFT JOIN
				(
					SELECT
						DISTINCT oi.uuid::text AS order_info_uuid,
						vodf.order_number
					FROM
						zipper.order_info oi
					LEFT JOIN
						zipper.v_order_details_full vodf ON oi.uuid = vodf.order_info_uuid::text
				) AS zipper_order_numbers 
				ON zipper_order_numbers.order_info_uuid = ANY(
					SELECT DISTINCT elem
					FROM jsonb_array_elements_text(pi_cash.order_info_uuids::jsonb) AS elem
					WHERE elem IS NOT NULL AND elem != 'null'
				)
		LEFT JOIN
				(
					SELECT
						DISTINCT toi.uuid::text AS order_info_uuid,
						CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS thread_order_number
					FROM
						thread.order_info toi
				) AS thread_order_numbers 
				ON thread_order_numbers.order_info_uuid = ANY(
					SELECT DISTINCT elem
					FROM jsonb_array_elements_text(pi_cash.thread_order_info_uuids::jsonb) AS elem
					WHERE elem IS NOT NULL AND elem != 'null'
				)
		LEFT JOIN 
			(
				SELECT 
					SUM(
						CASE 
							WHEN od.order_type = 'tape' 
							THEN order_entry.size::float8 * coalesce(order_entry.party_price,0)
							ELSE coalesce(pi_cash_entry.pi_cash_quantity,0) * coalesce(order_entry.party_price/12,0)
						END)::float8 
					as total_amount, 
					pi_cash.uuid as pi_cash_uuid
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid 
					LEFT JOIN zipper.order_description od ON order_entry.order_description_uuid = od.uuid
				GROUP BY pi_cash.uuid
		) total_pi_amount ON total_pi_amount.pi_cash_uuid = pi_cash.uuid
		LEFT JOIN 
			(
				SELECT 
					(
						SUM(
							coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(order_entry.party_price,0)
						)
					)::float8 as total_amount, 
					pi_cash.uuid as pi_cash_uuid
				FROM commercial.pi_cash 
					LEFT JOIN commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid 
					LEFT JOIN thread.order_entry ON pi_cash_entry.thread_order_entry_uuid = order_entry.uuid 
				GROUP BY pi_cash.uuid
		) total_pi_amount_thread ON total_pi_amount_thread.pi_cash_uuid = pi_cash.uuid
		WHERE 
			${is_cash ? (is_cash == 'true' ? sql`pi_cash.is_pi = 0` : sql`pi_cash.is_pi = 1`) : sql`TRUE`}
    		AND ${own_uuid ? sql`pi_cash.marketing_uuid = ${own_uuid}` : sql`TRUE`}
		GROUP BY
			pi_cash.uuid, 
			lc.lc_number, 
			public.marketing.name, 
			public.party.name, 
			public.party.address, 
			public.merchandiser.name, 
			public.factory.name, 
			bank.name, 
			bank.swift_code, 
			bank.address, 
			bank.policy, 
			bank.routing_no, 
			public.factory.address, 
			hr.users.name,
			pi_cash.validity,
			pi_cash.payment,
			pi_cash.created_at,
			pi_cash.updated_at,
			pi_cash.remarks,
			pi_cash.is_pi,
			pi_cash.is_rtgs,
			pi_cash.conversion_rate,
			pi_cash.weight,
			pi_cash.receive_amount,
			pi_cash.order_info_uuids,
			pi_cash.thread_order_info_uuids,
			pi_cash.lc_uuid,
			pi_cash.marketing_uuid,
			pi_cash.party_uuid,
			pi_cash.merchandiser_uuid,
			pi_cash.factory_uuid,
			pi_cash.bank_uuid,
			pi_cash.created_by,
			pi_cash.id,
			total_pi_amount.total_amount,
			total_pi_amount_thread.total_amount
		ORDER BY 
			pi_cash.created_at DESC;`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;

		// Filter order_numbers and thread_order_numbers to remove null values

		data.rows.forEach((item) => {
			item.order_numbers = item.order_numbers.filter(
				(x) => x !== null && x !== 'null'
			);
			item.thread_order_numbers = item.thread_order_numbers.filter(
				(x) => x !== null && x !== 'null'
			);
		});

		data?.rows?.forEach((item) => {
			item.order_info_uuids = JSON.parse(item.order_info_uuids).filter(
				(x) => x !== null && x !== 'null'
			);
			item.thread_order_info_uuids = JSON.parse(
				item.thread_order_info_uuids
			).filter((x) => x !== null && x !== 'null');

			// Convert back to JSON strings if needed
			item.order_info_uuids =
				JSON.stringify(item.order_info_uuids) || '[]';
			item.thread_order_info_uuids =
				JSON.stringify(item.thread_order_info_uuids) || '[]';
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Pi Cash list',
		};
		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
			SELECT 
				pi_cash.uuid,
				CASE 
					WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
					ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) 
				END AS id,
				pi_cash.lc_uuid,
				lc.lc_number,
				COALESCE(pi_cash_entry_order_numbers.order_info_uuids, '[]') AS order_info_uuids,
				COALESCE(pi_cash_entry_order_numbers.order_numbers, '[]') AS order_numbers,
				COALESCE(pi_cash_entry_order_numbers.thread_order_info_uuids, '[]') AS thread_order_info_uuids,
				COALESCE(pi_cash_entry_order_numbers.thread_order_numbers, '[]') AS thread_order_numbers,
				pi_cash.marketing_uuid,
				public.marketing.name AS marketing_name,
				pi_cash.party_uuid,
				public.party.name AS party_name,
				public.party.address AS party_address,
				pi_cash.merchandiser_uuid,
				public.merchandiser.name AS merchandiser_name,
				pi_cash.factory_uuid,
				public.factory.name AS factory_name,
				pi_cash.bank_uuid,
				bank.name AS bank_name,
				bank.swift_code AS bank_swift_code,
				bank.address AS bank_address,
				bank.policy AS bank_policy,
				bank.routing_no AS bank_routing_no,
				public.factory.address AS factory_address,
				pi_cash.validity::float8,
				pi_cash.payment::float8,
				pi_cash.created_by,
				users.name AS created_by_name,
				pi_cash.created_at,
				pi_cash.updated_at,
				pi_cash.remarks,
				pi_cash.is_pi::float8,
				pi_cash.is_rtgs,
				pi_cash.conversion_rate::float8,
				pi_cash.weight::float8,
				pi_cash.receive_amount::float8
			FROM 
				commercial.pi_cash
			LEFT JOIN 
				hr.users ON pi_cash.created_by = hr.users.uuid
			LEFT JOIN 
				public.marketing ON pi_cash.marketing_uuid = public.marketing.uuid
			LEFT JOIN 
				public.party ON pi_cash.party_uuid = public.party.uuid
			LEFT JOIN 
				public.merchandiser ON pi_cash.merchandiser_uuid = public.merchandiser.uuid
			LEFT JOIN 
				public.factory ON pi_cash.factory_uuid = public.factory.uuid
			LEFT JOIN 
				commercial.bank ON pi_cash.bank_uuid = bank.uuid
			LEFT JOIN 
				commercial.lc ON pi_cash.lc_uuid = lc.uuid
			LEFT JOIN 
			(
				SELECT 
						jsonb_agg(DISTINCT vodf.order_info_uuid) as order_info_uuids, 
						jsonb_agg(DISTINCT vodf.order_number) AS order_numbers, 
						jsonb_agg(DISTINCT toi.uuid) as thread_order_info_uuids, 
						jsonb_agg(DISTINCT CASE WHEN toi.id IS NOT NULL THEN CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) ELSE NULL END) as thread_order_numbers, pi_cash_uuid
				FROM
					commercial.pi_cash_entry pe 
					LEFT JOIN zipper.sfg sfg ON pe.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN thread.order_entry toe ON pe.thread_order_entry_uuid = toe.uuid
					LEFT JOIN thread.order_info toi ON toe.order_info_uuid = toi.uuid
				GROUP BY pi_cash_uuid
			) pi_cash_entry_order_numbers ON pi_cash.uuid = pi_cash_entry_order_numbers.pi_cash_uuid
			WHERE 
				pi_cash.uuid = ${req.params.uuid};
	`;

	const piPromise = db.execute(query);

	try {
		const data = await piPromise;

		data.rows.forEach((item) => {
			item.order_numbers = item.order_numbers.filter(
				(x) => x !== null && x !== 'null'
			);
			item.thread_order_numbers = item.thread_order_numbers.filter(
				(x) => x !== null && x !== 'null'
			);
		});

		data?.rows?.forEach((item) => {
			item.order_info_uuids = JSON.parse(item.order_info_uuids).filter(
				(x) => x !== null && x !== 'null'
			);
			item.thread_order_info_uuids = JSON.parse(
				item.thread_order_info_uuids
			).filter((x) => x !== null && x !== 'null');

			// Convert back to JSON strings if needed
			item.order_info_uuids =
				JSON.stringify(item.order_info_uuids) || '[]';
			item.thread_order_info_uuids =
				JSON.stringify(item.thread_order_info_uuids) || '[]';
		});

		const toast = {
			status: 200,
			type: 'select',
			message: 'Pi',
		};
		return res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiDetailsByPiUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { pi_cash_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${pi_cash_uuid}`)
				.then((response) => response);

		const [pi_cash, pi_cash_entry] = await Promise.all([
			fetchData('/commercial/pi-cash'),
			fetchData('/commercial/pi-cash-entry/by'),
		]);

		const pi_cash_entry_thread = pi_cash_entry?.data?.data.filter(
			(fields) => fields.is_thread_order == true
		);
		const zipper_pi_entry = pi_cash_entry?.data?.data.filter(
			(fields) => fields.is_thread_order == false
		);

		const response = {
			...pi_cash?.data?.data,
			pi_cash_entry: zipper_pi_entry || [],
			pi_cash_entry_thread: pi_cash_entry_thread || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Recipe Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiUuidByPiId(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { pi_cash_id } = req.params;

	const piPromise = db
		.select({
			uuid: pi_cash.uuid,
		})
		.from(pi_cash)
		.where(eq(pi_cash.id, sql`split_part(${pi_cash_id}, '-', 2)::int`));
	try {
		const data = await piPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Pi uuid',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiDetailsByPiId(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { pi_cash_id } = req.params;
	try {
		const api = await createApi(req);

		const fetchPiUuid = async () =>
			await api
				.get(`/commercial/pi-cash-uuid/${pi_cash_id}`)
				.then((response) => response);

		const piCashUuid = await fetchPiUuid();

		if (!piCashUuid.data.data.length) {
			const toast = {
				status: 404,
				type: 'select',
				message: 'No data found',
			};
			return res.status(404).json({ toast });
		}

		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${piCashUuid.data.data[0].uuid}`)
				.then((response) => response);

		const [pi_cash, pi_cash_entry] = await Promise.all([
			fetchData('/commercial/pi-cash'),
			fetchData('/commercial/pi-cash-entry/by'),
		]);

		const pi_cash_entry_thread = pi_cash_entry?.data?.data.filter(
			(fields) => fields.is_thread_order == true
		);
		const zipper_pi_entry = pi_cash_entry?.data?.data.filter(
			(fields) => fields.is_thread_order == false
		);

		const response = {
			...pi_cash?.data?.data,
			pi_cash_entry: zipper_pi_entry || [],
			pi_cash_entry_thread: pi_cash_entry_thread || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Recipe Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updatePiPutLcByPiUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { pi_cash_uuid } = req.params;

	const { lc_uuid } = req.body;

	const piPromise = db
		.update(pi_cash)
		.set({ lc_uuid })
		.where(eq(pi_cash.uuid, pi_cash_uuid))
		.returning({
			updatedId: sql`CASE WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END`,
		});

	try {
		const data = await piPromise;
		if (data.length === 0) {
			const toast = {
				status: 404,
				type: 'update',
				message: `No record found to update`,
			};
			return res.status(404).json({ toast, data });
		}

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updatePiToNullByPiUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { pi_cash_uuid } = req.params;

	const piPromise = db
		.update(pi_cash)
		.set({ lc_uuid: null })
		.where(eq(pi_cash.uuid, pi_cash_uuid))
		.returning({
			updatedId: sql`CASE WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END`,
		});

	try {
		const data = await piPromise;
		if (data.length === 0) {
			const toast = {
				status: 404,
				type: 'update',
				message: `No record found to update`,
			};
			return res.status(404).json({ toast, data });
		}
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPiByLcUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { lc_uuid } = req.params;

	const piPromise = db
		.select({
			uuid: pi_cash.uuid,
			id: sql`CASE WHEN pi_cash.is_pi = 1 THEN CONCAT('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) ELSE CONCAT('CI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) END`,
			lc_uuid: pi_cash.lc_uuid,
			lc_number: lc.lc_number,
			order_info_uuids: pi_cash.order_info_uuids,
			marketing_uuid: pi_cash.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			party_uuid: pi_cash.party_uuid,
			party_name: publicSchema.party.name,
			merchandiser_uuid: pi_cash.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: pi_cash.factory_uuid,
			factory_name: publicSchema.factory.name,
			bank_uuid: pi_cash.bank_uuid,
			bank_name: bank.name,
			bank_swift_code: bank.swift_code,
			bank_address: bank.address,
			factory_address: publicSchema.factory.address,
			validity: pi_cash.validity,
			payment: pi_cash.payment,
			created_by: pi_cash.created_by,
			created_by_name: hrSchema.users.name,
			created_at: pi_cash.created_at,
			updated_at: pi_cash.updated_at,
			remarks: pi_cash.remarks,
			is_pi: pi_cash.is_pi,
			is_rtgs: pi_cash.is_rtgs,
			conversion_rate: decimalToNumber(pi_cash.conversion_rate),
			weight: decimalToNumber(pi_cash.weight),
			receive_amount: decimalToNumber(pi_cash.receive_amount),
		})
		.from(pi_cash)
		.leftJoin(hrSchema.users, eq(pi_cash.created_by, hrSchema.users.uuid))
		.leftJoin(
			publicSchema.marketing,
			eq(pi_cash.marketing_uuid, publicSchema.marketing.uuid)
		)
		.leftJoin(
			publicSchema.party,
			eq(pi_cash.party_uuid, publicSchema.party.uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(pi_cash.merchandiser_uuid, publicSchema.merchandiser.uuid)
		)
		.leftJoin(
			publicSchema.factory,
			eq(pi_cash.factory_uuid, publicSchema.factory.uuid)
		)
		.leftJoin(bank, eq(pi_cash.bank_uuid, bank.uuid))
		.leftJoin(lc, eq(pi_cash.lc_uuid, lc.uuid))
		.where(eq(pi_cash.lc_uuid, lc_uuid));

	try {
		const data = await piPromise;

		data.forEach((item) => {
			item.order_info_uuids = JSON.parse(item.order_info_uuids);
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Pi Cash list',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
