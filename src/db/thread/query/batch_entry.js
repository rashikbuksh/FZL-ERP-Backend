import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { batch_entry, order_entry } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	let {
		uuid,
		batch_uuid,
		order_entry_uuid,
		quantity,
		coning_production_quantity,
		coning_carton_quantity,
		coning_created_at,
		coning_updated_at,
		transfer_quantity,
		transfer_carton_quantity,
		created_at,
		updated_at,
		remarks,
		yarn_quantity,
	} = req.body;

	quantity = quantity ? Number(quantity) : 0;
	coning_production_quantity = coning_production_quantity
		? Number(coning_production_quantity)
		: 0;
	coning_carton_quantity = coning_carton_quantity
		? Number(coning_carton_quantity)
		: 0;
	yarn_quantity = yarn_quantity ? Number(yarn_quantity) : 0;

	const resultPromise = db
		.insert(batch_entry)
		.values({
			uuid,
			batch_uuid,
			order_entry_uuid,
			quantity,
			coning_production_quantity,
			coning_carton_quantity,
			coning_created_at,
			coning_updated_at,
			transfer_quantity,
			transfer_carton_quantity,
			created_at,
			updated_at,
			remarks,
			yarn_quantity,
		})
		.returning({ insertedId: batch_entry.uuid });

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

	let {
		uuid,
		batch_uuid,
		order_entry_uuid,
		quantity,
		coning_production_quantity,
		coning_carton_quantity,
		coning_created_at,
		coning_updated_at,
		transfer_quantity,
		transfer_carton_quantity,
		created_at,
		updated_at,
		remarks,
		yarn_quantity,
	} = req.body;

	quantity = quantity ? Number(quantity) : 0;
	coning_production_quantity = coning_production_quantity
		? Number(coning_production_quantity)
		: 0;
	coning_carton_quantity = coning_carton_quantity
		? Number(coning_carton_quantity)
		: 0;
	yarn_quantity = yarn_quantity ? Number(yarn_quantity) : 0;

	const resultPromise = db
		.update(batch_entry)
		.set({
			uuid,
			batch_uuid,
			order_entry_uuid,
			quantity,
			coning_production_quantity,
			coning_carton_quantity,
			coning_created_at,
			coning_updated_at,
			transfer_quantity,
			transfer_carton_quantity,
			created_at,
			updated_at,
			remarks,
			yarn_quantity,
		})
		.where(eq(batch_entry.uuid, req.params.uuid))
		.returning({ updatedId: batch_entry.uuid });

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
	const resultPromise = db
		.delete(batch_entry)
		.where(eq(batch_entry.uuid, req.params.uuid));

	try {
		await resultPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${req.params.uuid} removed`,
		};

		return await res.status(201).json({ toast });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry.uuid,
			batch_uuid: batch_entry.batch_uuid,
			order_entry_uuid: batch_entry.order_entry_uuid,
			quantity: decimalToNumber(batch_entry.quantity),
			coning_production_quantity: decimalToNumber(
				batch_entry.coning_production_quantity
			),
			coning_carton_quantity: decimalToNumber(
				batch_entry.coning_carton_quantity
			),
			transfer_quantity: decimalToNumber(batch_entry.transfer_quantity),
			transfer_carton_quantity: decimalToNumber(
				batch_entry.transfer_carton_quantity
			),
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
			yarn_quantity: decimalToNumber(batch_entry.yarn_quantity),
		})
		.from(batch_entry)
		.leftJoin(
			order_entry,
			eq(batch_entry.order_entry_uuid, order_entry.uuid)
		)
		.orderBy(desc(batch_entry.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'batch_entry list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			uuid: batch_entry.uuid,
			batch_uuid: batch_entry.batch_uuid,
			order_entry_uuid: batch_entry.order_entry_uuid,
			quantity: decimalToNumber(batch_entry.quantity),
			coning_production_quantity: decimalToNumber(
				batch_entry.coning_production_quantity
			),
			coning_carton_quantity: decimalToNumber(
				batch_entry.coning_carton_quantity
			),
			transfer_quantity: decimalToNumber(batch_entry.transfer_quantity),
			transfer_carton_quantity: decimalToNumber(
				batch_entry.transfer_carton_quantity
			),
			created_at: batch_entry.created_at,
			updated_at: batch_entry.updated_at,
			remarks: batch_entry.remarks,
			yarn_quantity: decimalToNumber(batch_entry.yarn_quantity),
		})
		.from(batch_entry)
		.leftJoin(
			order_entry,
			eq(batch_entry.order_entry_uuid, order_entry.uuid)
		)
		.where(eq(batch_entry.uuid, req.params.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 201,
			type: 'select',
			message: 'batch_entry',
		};
		return await res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getOrderDetailsForBatchEntry(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	const query = sql`
	SELECT 
		oe.uuid as order_entry_uuid,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.count_length_uuid as count_length_uuid,
		oe.quantity::float8 as order_quantity,
		oe.bleaching as bleaching,
		cl.count,
		cl.length,
		CONCAT(cl.count, '/', cl.length) as count_length,
		cl.cone_per_carton,
		cl.min_weight::float8,
		cl.max_weight::float8,
		oe.recipe_uuid as recipe_uuid,
		re.name as recipe_name,
		re.sub_streat,
		CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
		CASE WHEN be_given.total_quantity IS NULL THEN 0 ELSE
			be_given.total_quantity::float8
		END as total_trx_quantity,
		CASE WHEN be.transfer_quantity IS NULL THEN 0 ELSE be.transfer_quantity::float8 END as transfer_quantity,
		CASE WHEN be.transfer_carton_quantity IS NULL THEN 0 ELSE be.transfer_carton_quantity::float8 END as transfer_carton_quantity,
		CASE WHEN be.yarn_quantity IS NULL THEN 0 ELSE
			be.yarn_quantity::float8
		END as yarn_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0))::float8 as balance_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0))::float8 as max_quantity
	FROM
		thread.order_entry oe
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN
		lab_dip.recipe re ON oe.recipe_uuid = re.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN 
	(
		SELECT 
			batch_entry.order_entry_uuid,
			SUM(batch_entry.quantity) as total_quantity
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) as be_given ON be_given.order_entry_uuid = oe.uuid
	 LEFT JOIN 
	 	thread.batch_entry be ON be.order_entry_uuid = oe.uuid
	WHERE
		oe.recipe_uuid IS NOT NULL AND (oe.quantity - coalesce(be_given.total_quantity,0)) > 0
	ORDER BY
		oe.created_at DESC
	`;

	const batchEntryPromise = db.execute(query);

	try {
		const data = await batchEntryPromise;
		const batch_data = { batch_entry: data?.rows };
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order details',
		};

		return await res.status(200).json({ toast, data: batch_data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getBatchEntryByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
	SELECT 
		be.uuid as batch_entry_uuid,
		be.batch_uuid,
		oe.uuid as order_entry_uuid,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.count_length_uuid as count_length_uuid,
		oe.quantity::float8 as order_quantity,
		oe.bleaching as bleaching,
		cl.count,
		cl.length,
		CONCAT(cl.count, '/', cl.length) as count_length,
		cl.cone_per_carton,
		cl.min_weight::float8,
		cl.max_weight::float8,
		oe.recipe_uuid as recipe_uuid,
		re.name as recipe_name,
		re.sub_streat,
		CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
		be.quantity::float8 as quantity,
		be.coning_production_quantity::float8,
		be.coning_carton_quantity::float8,
		CASE WHEN be.transfer_quantity IS NULL THEN 0 ELSE be.transfer_quantity::float8 END as transfer_quantity,
		CASE WHEN be.transfer_carton_quantity IS NULL THEN 0 ELSE be.transfer_carton_quantity::float8 END as transfer_carton_quantity,
		be_given.total_quantity::float8 as total_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0))::float8 as balance_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0))::float8 + be.quantity::float8 as max_quantity,
		(oe.quantity - coalesce(be_given.total_quantity,0) + be.quantity)::float8 as can_trx_quantity,
		CEIL(be.quantity / cl.cone_per_carton)::float8 as total_carton,
		be.created_at,
		be.updated_at,
		be.remarks as batch_remarks,
		CASE WHEN be.yarn_quantity IS NULL THEN 0 ELSE be.yarn_quantity::float8 END as yarn_quantity,
		oe.carton_quantity
	FROM
		thread.batch_entry be
	LEFT JOIN 
		thread.order_entry oe ON be.order_entry_uuid = oe.uuid
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN
		lab_dip.recipe re ON oe.recipe_uuid = re.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN 
	(
		SELECT 
			batch_entry.order_entry_uuid,
			SUM(batch_entry.quantity) as total_quantity
		FROM 
			thread.batch_entry
		GROUP BY 
			batch_entry.order_entry_uuid
	) as be_given ON be_given.order_entry_uuid = oe.uuid
	WHERE
		be.batch_uuid = ${req.params.batch_uuid}
	`;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function getBatchEntryDetails(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
	WITH calculated_balance AS (SELECT 
		be.uuid as batch_entry_uuid,
		be.batch_uuid,
		CONCAT('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_number,
		be.order_entry_uuid,
		oe.order_info_uuid,
		CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) as order_number,
	    oe.color as color,
		oe.po as po,
		oe.style as style,
		oe.bleaching as bleaching,
		oe.count_length_uuid as count_length_uuid,
		CONCAT(cl.count, '/', cl.length) as count_length,
		cl.cone_per_carton,
		be.quantity::float8 as batch_quantity,
		be.coning_production_quantity::float8,
		be.coning_carton_quantity::float8,
		be.transfer_quantity::float8 as transfer_quantity,
		be.transfer_carton_quantity::float8,
		(be.quantity - be.coning_production_quantity - be.transfer_quantity)::float8 as balance_quantity,
		be.created_at,
		be.updated_at,
		be.remarks as batch_remarks,
		be.yarn_quantity::float8 as yarn_quantity,
		batch.is_drying_complete
	FROM
		thread.batch_entry be
	LEFT JOIN 
		thread.order_entry oe ON be.order_entry_uuid = oe.uuid
	LEFT JOIN
		thread.count_length cl ON oe.count_length_uuid = cl.uuid
	LEFT JOIN 
		thread.order_info ON oe.order_info_uuid = order_info.uuid
	LEFT JOIN
		thread.batch ON be.batch_uuid = batch.uuid
)
	SELECT * FROM calculated_balance
WHERE transfer_quantity != batch_quantity AND is_drying_complete = 'true'
ORDER BY created_at DESC, batch_entry_uuid ASC
;
	`;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch_entry_details list',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
