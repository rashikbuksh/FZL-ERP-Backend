import { desc, eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';

import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';

import { bank, lc, pi_cash } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		order_info_uuids,
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
		conversion_rate,
		receive_amount,
	} = req.body;

	const piPromise = db
		.insert(pi_cash)
		.values({
			uuid,
			order_info_uuids,
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
			conversion_rate,
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
			updatedId: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			deletedId: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
	const is_cash = req.query.is_cash;

	const resultPromise = db
		.select({
			uuid: pi_cash.uuid,
			id: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			conversion_rate: pi_cash.conversion_rate,
			receive_amount: pi_cash.receive_amount,
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
		.where(
			is_cash == null
				? ''
				: is_cash == 'true'
					? eq(pi_cash.is_pi, 0)
					: eq(pi_cash.is_pi, 1)
		)

		.orderBy(desc(pi_cash.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Pi Cash list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const piPromise = db
		.select({
			uuid: pi_cash.uuid,
			id: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			conversion_rate: pi_cash.conversion_rate,
			receive_amount: pi_cash.receive_amount,
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
		.where(eq(pi_cash.uuid, req.params.uuid));

	try {
		const data = await piPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Pi',
		};
		return res.status(200).json({ toast, data: data[0] });
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

		const response = {
			...pi_cash?.data?.data,
			pi_cash_entry: pi_cash_entry?.data?.data || [],
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

	const api = await createApi(req);

	const fetchPiUuid = async () =>
		await api
			.get(`/commercial/pi-cash-uuid/${pi_cash_id}`)
			.then((response) => response);

	const piCashUuid = await fetchPiUuid();

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${piCashUuid.data.data[0].uuid}`)
				.then((response) => response);

		const [pi_cash, pi_cash_entry] = await Promise.all([
			fetchData('/commercial/pi-cash'),
			fetchData('/commercial/pi-cash-entry/by'),
		]);

		const response = {
			...pi_cash?.data?.data,
			pi_cash_entry: pi_cash_entry?.data?.data || [],
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
			updatedId: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			updatedId: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			id: sql`concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))`,
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
			conversion_rate: pi_cash.conversion_rate,
			receive_amount: pi_cash.receive_amount,
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

	const toast = {
		status: 200,
		type: 'select',
		message: 'Pi',
	};

	handleResponse({
		promise: piPromise,
		res,
		next,
		...toast,
	});
}
