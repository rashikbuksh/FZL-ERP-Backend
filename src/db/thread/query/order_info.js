import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { order_info } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(order_info)
		.values(req.body)
		.returning({
			insertedId: sql`concat('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await resultPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.update(order_info)
		.set(req.body)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await resultPromise;

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

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.delete(order_info)
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await resultPromise;

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
	const { own_uuid, type } = req.query;

	let marketing_uuid = null;

	// get marketing uuid from own_uuid
	const marketingUuidQuery = sql`
		SELECT 
			uuid
		FROM 
			public.marketing
		WHERE 
			user_uuid = ${own_uuid};
	`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			if (
				marketingUuidData &&
				marketingUuidData.rows &&
				marketingUuidData.rows.length > 0
			) {
				marketing_uuid = marketingUuidData.rows[0].uuid;
			} else {
				marketing_uuid = null;
			}
		}

		const query = sql`
		SELECT 
			order_info.uuid,
			order_info.id,
			CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			pi_cash_grouped.pi_numbers,
			order_info.party_uuid,
			party.name AS party_name,
			order_info.marketing_uuid,
			marketing.name AS marketing_name,
			order_info.factory_uuid,
			factory.name AS factory_name,
			factory.address AS factory_address,
			order_info.merchandiser_uuid,
			merchandiser.name AS merchandiser_name,
			order_info.buyer_uuid,
			buyer.name AS buyer_name,
			order_info.is_sample,
			order_info.is_bill,
			order_info.is_cash,
			order_info.delivery_date,
			order_info.created_by,
			hr.users.name AS created_by_name,
			order_info.created_at,
			order_info.updated_at,
			order_info.remarks,
			order_entry_counts.swatch_approval_count,
			order_entry_counts.order_entry_count,
			CASE WHEN price_approval_counts.price_approval_count IS NULL THEN 0 ELSE price_approval_counts.price_approval_count END AS price_approval_count,
			CASE WHEN order_entry_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatches_approved,
			order_info.revision_no,
			order_info.is_cancelled,
			order_info.sno_from_head_office,
			order_info.sno_from_head_office_time,
			order_info.sno_from_head_office_by,
			sno_from_head_office_by.name AS sno_from_head_office_by_name,
			order_info.receive_by_factory,
			order_info.receive_by_factory_time,
			order_info.receive_by_factory_by,
			receive_by_factory_by.name AS receive_by_factory_by_name,
			order_info.production_pause,
			order_info.production_pause_time,
			order_info.production_pause_by,
			production_pause_by.name AS production_pause_by_name,
			order_info.is_swatch_attached
		FROM 
			thread.order_info
		LEFT JOIN 
			hr.users ON order_info.created_by = hr.users.uuid
		LEFT JOIN 
			public.party ON order_info.party_uuid = public.party.uuid
		LEFT JOIN 
			public.marketing ON order_info.marketing_uuid = public.marketing.uuid
		LEFT JOIN 
			public.factory ON order_info.factory_uuid = public.factory.uuid
		LEFT JOIN 
			public.merchandiser ON order_info.merchandiser_uuid = public.merchandiser.uuid
		LEFT JOIN 
			public.buyer ON order_info.buyer_uuid = public.buyer.uuid
		 LEFT JOIN (
					SELECT COUNT(*) AS price_approval_count, toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					WHERE toe.party_price > 0 AND toe.company_price > 0
					GROUP BY toe.order_info_uuid
		) price_approval_counts ON order_info.uuid = price_approval_counts.order_info_uuid
		LEFT JOIN (
					SELECT 
						COUNT(*) AS order_entry_count,
						COUNT(toe.swatch_approval_date) AS swatch_approval_count,
						toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					GROUP BY toe.order_info_uuid
		) order_entry_counts ON order_info.uuid = order_entry_counts.order_info_uuid
		LEFT JOIN (
			SELECT toi.uuid as order_info_uuid, array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers
			FROM
				thread.order_info toi
				LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
			WHERE pi_cash.id IS NOT NULL
			GROUP BY toi.uuid
		) pi_cash_grouped ON order_info.uuid = pi_cash_grouped.order_info_uuid
		LEFT JOIN hr.users sno_from_head_office_by ON order_info.sno_from_head_office_by = sno_from_head_office_by.uuid
		LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
		LEFT JOIN hr.users production_pause_by ON order_info.production_pause_by = production_pause_by.uuid
		 WHERE 
        	${own_uuid ? sql`order_info.marketing_uuid = ${marketing_uuid}` : sql`1 = 1`}
			${
				type === 'bulk'
					? sql`AND order_info.is_sample = 0`
					: type === 'sample'
						? sql`AND order_info.is_sample = 1`
						: sql`AND 1=1`
			}
		ORDER BY 
			order_info.created_at DESC;
	`;
		const resultPromise = db.execute(query);

		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order info',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			order_info.uuid,
			order_info.id,
			CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
			pi_cash_grouped.pi_numbers,
			order_info.party_uuid,
			party.name AS party_name,
			order_info.marketing_uuid,
			marketing.name AS marketing_name,
			order_info.factory_uuid,
			factory.name AS factory_name,
			factory.address AS factory_address,
			order_info.merchandiser_uuid,
			merchandiser.name AS merchandiser_name,
			order_info.buyer_uuid,
			buyer.name AS buyer_name,
			order_info.is_sample,
			order_info.is_bill,
			order_info.is_cash,
			order_info.delivery_date,
			order_info.created_by,
			hr.users.name AS created_by_name,
			order_info.created_at,
			order_info.updated_at,
			order_info.remarks,
			order_entry_counts.swatch_approval_count,
			order_entry_counts.order_entry_count,
			CASE WHEN price_approval_counts.price_approval_count IS NULL THEN 0 ELSE price_approval_counts.price_approval_count END AS price_approval_count,
			CASE WHEN order_entry_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatches_approved,
			order_info.revision_no,
			order_info.is_cancelled,
			order_info.sno_from_head_office,
			order_info.sno_from_head_office_time,
			order_info.sno_from_head_office_by,
			sno_from_head_office_by.name AS sno_from_head_office_by_name,
			order_info.receive_by_factory,
			order_info.receive_by_factory_time,
			order_info.receive_by_factory_by,
			receive_by_factory_by.name AS receive_by_factory_by_name,
			order_info.production_pause,
			order_info.production_pause_time,
			order_info.production_pause_by,
			production_pause_by.name AS production_pause_by_name,
			order_info.is_swatch_attached
		FROM 
			thread.order_info
		LEFT JOIN 
			hr.users ON order_info.created_by = hr.users.uuid
		LEFT JOIN 
			public.party ON order_info.party_uuid = public.party.uuid
		LEFT JOIN 
			public.marketing ON order_info.marketing_uuid = public.marketing.uuid
		LEFT JOIN 
			public.factory ON order_info.factory_uuid = public.factory.uuid
		LEFT JOIN 
			public.merchandiser ON order_info.merchandiser_uuid = public.merchandiser.uuid
		LEFT JOIN 
			public.buyer ON order_info.buyer_uuid = public.buyer.uuid
		 LEFT JOIN (
					SELECT COUNT(*) AS price_approval_count, toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					WHERE toe.party_price > 0 AND toe.company_price > 0
					GROUP BY toe.order_info_uuid
		) price_approval_counts ON order_info.uuid = price_approval_counts.order_info_uuid
		LEFT JOIN (
					SELECT 
						COUNT(*) AS order_entry_count,
						COUNT(toe.swatch_approval_date) AS swatch_approval_count,
						toe.order_info_uuid as order_info_uuid
					FROM thread.order_entry toe
					GROUP BY toe.order_info_uuid
		) order_entry_counts ON order_info.uuid = order_entry_counts.order_info_uuid
		LEFT JOIN (
			SELECT toi.uuid as order_info_uuid, array_agg(DISTINCT concat('PI', to_char(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0'))) as pi_numbers
			FROM
				thread.order_info toi
				LEFT JOIN thread.order_entry toe ON toi.uuid = toe.order_info_uuid
				LEFT JOIN commercial.pi_cash_entry pe ON pe.thread_order_entry_uuid = toe.uuid
				LEFT JOIN commercial.pi_cash ON pe.pi_cash_uuid = pi_cash.uuid
			WHERE pi_cash.id IS NOT NULL
			GROUP BY toi.uuid
		) pi_cash_grouped ON order_info.uuid = pi_cash_grouped.order_info_uuid
		LEFT JOIN hr.users sno_from_head_office_by ON order_info.sno_from_head_office_by = sno_from_head_office_by.uuid
		LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
		LEFT JOIN hr.users production_pause_by ON order_info.production_pause_by = production_pause_by.uuid
		WHERE order_info.uuid = ${req.params.uuid}
		ORDER BY 
			order_info.created_at DESC;`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order info',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDetailsByOrderInfoUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.params;

	try {
		const api = await createApi(req);

		const fetchData = async (endpoint) =>
			await api.get(`/thread/${endpoint}/${order_info_uuid}`);

		const [order_info, order_info_entry] = await Promise.all([
			fetchData('order-info'),
			fetchData('order-entry/by'),
		]);

		const response = {
			...order_info?.data?.data,
			order_info_entry: order_info_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'Thread Order info',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectThreadSwatch(req, res, next) {
	const { type, order_type } = req.query;

	const query = sql`
	SELECT 
		order_info.uuid,
		CONCAT('ST', 
			CASE 
				WHEN order_info.is_sample = 1 THEN 'S' 
				ELSE '' 
			END, 
			TO_CHAR(order_info.created_at, 'YY'), '-', 
			LPAD(order_info.id::text, 4, '0')
		) AS order_number,
		order_entry.uuid AS order_entry_uuid,
		order_entry.style,
		order_entry.color,
		order_entry.recipe_uuid,
		lab_dip_recipe.name AS recipe_name,
		order_entry.bleaching,
		order_entry.count_length_uuid,
		count_length.count,
		count_length.length,
		CONCAT(count_length.count, ' - ', count_length.length) AS count_length_name,
		order_entry.quantity::float8 AS order_quantity,
		order_info.created_at,
		order_info.updated_at,
		order_info.remarks,
		order_entry.swatch_approval_date,
		COALESCE(batch_status.is_batch_created, FALSE) AS is_batch_created,
		order_info.is_cancelled,
		order_info.sno_from_head_office,
		order_info.sno_from_head_office_time,
		order_info.receive_by_factory,
		order_info.receive_by_factory_time,
		order_info.receive_by_factory_by,
		receive_by_factory_by.name AS receive_by_factory_by_name,
		order_info.production_pause,
		order_info.is_swatch_attached
	FROM 
		thread.order_info
	LEFT JOIN 
		thread.order_entry ON order_info.uuid = order_entry.order_info_uuid
	LEFT JOIN 
		thread.count_length ON order_entry.count_length_uuid = count_length.uuid
	LEFT JOIN 
		lab_dip.recipe AS lab_dip_recipe ON order_entry.recipe_uuid = lab_dip_recipe.uuid
	LEFT JOIN (
		SELECT 
			batch_entry.order_entry_uuid,
			CASE 
				WHEN SUM(batch_entry.quantity) > 0 THEN TRUE 
				ELSE FALSE 
			END AS is_batch_created
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) AS batch_status ON order_entry.uuid = batch_status.order_entry_uuid
	LEFT JOIN hr.users receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
	WHERE 
		order_info.is_cancelled = FALSE
		AND order_info.production_pause = FALSE
		AND order_info.receive_by_factory = TRUE
		${
			type === 'pending'
				? sql`AND order_entry.recipe_uuid IS NULL`
				: type === 'completed'
					? sql`AND order_entry.recipe_uuid IS NOT NULL`
					: sql``
		}
		${
			order_type === 'complete_order'
				? sql`AND order_entry.quantity <= order_entry.delivered AND order_entry.recipe_uuid IS NOT NULL`
				: order_type === 'incomplete_order'
					? sql`AND order_entry.quantity > order_entry.delivered`
					: sql``
		}
	ORDER BY 
		order_entry.created_at DESC, 
		order_info.created_at DESC, 
		order_entry.uuid ASC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Swatch',
		};

		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSendFromHeadOffice(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		sno_from_head_office,
		sno_from_head_office_time,
		sno_from_head_office_by,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			sno_from_head_office,
			sno_from_head_office_time,
			sno_from_head_office_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateReceiveByFactory(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		receive_by_factory,
		receive_by_factory_time,
		receive_by_factory_by,
	} = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			receive_by_factory,
			receive_by_factory_time,
			receive_by_factory_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateProductionPause(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { production_pause, production_pause_time, production_pause_by } =
		req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			production_pause,
			production_pause_time,
			production_pause_by,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function updateSwatchAttachment(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { is_swatch_attached } = req.body;

	const orderInfoPromise = db
		.update(order_info)
		.set({
			is_swatch_attached,
		})
		.where(eq(order_info.uuid, req.params.uuid))
		.returning({
			updatedId: sql`CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		});

	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
