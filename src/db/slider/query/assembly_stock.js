import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { assembly_stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const assemblyStockPromise = db
		.insert(assembly_stock)
		.values(req.body)
		.returning({ insertedId: assembly_stock.uuid });

	try {
		const data = await assemblyStockPromise;
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

	const assemblyStockPromise = db
		.update(assembly_stock)
		.set(req.body)
		.where(eq(assembly_stock.uuid, req.params.uuid))
		.returning({ updatedId: assembly_stock.uuid });
	try {
		const data = await assemblyStockPromise;
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

	const assemblyStockPromise = db
		.delete(assembly_stock)
		.where(eq(assembly_stock.uuid, req.params.uuid))
		.returning({ deletedId: assembly_stock.uuid });
	try {
		const data = await assemblyStockPromise;
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
	const query = sql`
		SELECT 
			assembly_stock.uuid,
			assembly_stock.name,
			assembly_stock.die_casting_body_uuid,
			diecastingbody.name AS die_casting_body_name,
			diecastingbody.quantity_in_sa AS die_casting_body_quantity,
			assembly_stock.die_casting_puller_uuid,
			diecastingpuller.name AS die_casting_puller_name,
			diecastingpuller.quantity_in_sa AS die_casting_puller_quantity,
			assembly_stock.die_casting_cap_uuid,
			diecastingcap.name AS die_casting_cap_name,
			diecastingcap.quantity_in_sa AS die_casting_cap_quantity,
			assembly_stock.die_casting_link_uuid,
			diecastinglink.name AS die_casting_link_name,
			diecastinglink.quantity_in_sa AS die_casting_link_quantity,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa, diecastinglink.quantity_in_sa) AS min_quantity_with_link,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa) AS min_quantity_no_link,
			assembly_stock.quantity,
			assembly_stock.weight,
			assembly_stock.created_by,
			users.name AS created_by_name,
			assembly_stock.created_at,
			assembly_stock.updated_at,
			assembly_stock.remarks,
			transaction_total_trx.total_transaction_quantity
		FROM 
			slider.assembly_stock
		LEFT JOIN 
			hr.users ON assembly_stock.created_by = users.uuid
		LEFT JOIN 
			slider.die_casting diecastingbody ON assembly_stock.die_casting_body_uuid = diecastingbody.uuid
		LEFT JOIN 
			slider.die_casting diecastingpuller ON assembly_stock.die_casting_puller_uuid = diecastingpuller.uuid
		LEFT JOIN 
			slider.die_casting diecastingcap ON assembly_stock.die_casting_cap_uuid = diecastingcap.uuid
		LEFT JOIN 
			slider.die_casting diecastinglink ON assembly_stock.die_casting_link_uuid = diecastinglink.uuid
		LEFT JOIN (
			SELECT
				assembly_stock.uuid AS assembly_stock_uuid,
				SUM(trx_quantity::numeric) AS total_transaction_quantity
			FROM slider.transaction
			JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
			GROUP BY assembly_stock.uuid
		) AS transaction_total_trx ON assembly_stock.uuid = transaction_total_trx.assembly_stock_uuid
		ORDER BY 
			assembly_stock.created_at DESC;
	`;

	const assemblyStockPromise = db.execute(query);

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock list`,
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
		SELECT 
			assembly_stock.uuid,
			assembly_stock.name,
			assembly_stock.die_casting_body_uuid,
			diecastingbody.name AS die_casting_body_name,
			diecastingbody.quantity_in_sa AS die_casting_body_quantity,
			assembly_stock.die_casting_puller_uuid,
			diecastingpuller.name AS die_casting_puller_name,
			diecastingpuller.quantity_in_sa AS die_casting_puller_quantity,
			assembly_stock.die_casting_cap_uuid,
			diecastingcap.name AS die_casting_cap_name,
			diecastingcap.quantity_in_sa AS die_casting_cap_quantity,
			assembly_stock.die_casting_link_uuid,
			diecastinglink.name AS die_casting_link_name,
			diecastinglink.quantity_in_sa AS die_casting_link_quantity,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa, diecastinglink.quantity_in_sa) AS min_quantity_with_link,
			LEAST(diecastingbody.quantity_in_sa, diecastingpuller.quantity_in_sa, diecastingcap.quantity_in_sa) AS min_quantity_no_link,
			assembly_stock.quantity,
			assembly_stock.weight,
			assembly_stock.created_by,
			users.name AS created_by_name,
			assembly_stock.created_at,
			assembly_stock.updated_at,
			assembly_stock.remarks,
			transaction_total_trx.total_transaction_quantity
		FROM 
			slider.assembly_stock
		LEFT JOIN 
			hr.users ON assembly_stock.created_by = users.uuid
		LEFT JOIN 
			slider.die_casting diecastingbody ON assembly_stock.die_casting_body_uuid = diecastingbody.uuid
		LEFT JOIN 
			slider.die_casting diecastingpuller ON assembly_stock.die_casting_puller_uuid = diecastingpuller.uuid
		LEFT JOIN 
			slider.die_casting diecastingcap ON assembly_stock.die_casting_cap_uuid = diecastingcap.uuid
		LEFT JOIN 
			slider.die_casting diecastinglink ON assembly_stock.die_casting_link_uuid = diecastinglink.uuid
		LEFT JOIN (
			SELECT
				assembly_stock.uuid AS assembly_stock_uuid,
				SUM(trx_quantity) AS total_transaction_quantity
			FROM slider.transaction
			JOIN slider.assembly_stock ON transaction.assembly_stock_uuid = assembly_stock.uuid
			GROUP BY assembly_stock.uuid
		) AS transaction_total_trx ON assembly_stock.uuid = transaction_total_trx.assembly_stock_uuid
		WHERE 
			assembly_stock.uuid = ${req.params.uuid}
		ORDER BY 
			assembly_stock.created_at DESC;
	`;

	const assemblyStockPromise = db.execute(query);

	try {
		const data = await assemblyStockPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `assembly_stock`,
		};
		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectProductionLogForAssembly(req, res, next) {
	const query = sql`
		SELECT
			production.uuid,
			production.stock_uuid,
			production.production_quantity::float8,
			production.weight::float8,
			production.wastage::float8,
			production.section,
			production.created_by,
			users.name as created_by_name,
			production.created_at,
			production.updated_at,
			production.remarks,
			vodf.item,
			vodf.item_name,
			vodf.item_short_name,
			vodf.zipper_number,
			vodf.zipper_number_name,
			vodf.zipper_number_short_name,
			vodf.end_type,
			vodf.end_type_name,
			vodf.end_type_short_name,
			vodf.lock_type,
			vodf.lock_type_name,
			vodf.lock_type_short_name,
			vodf.puller_type,
			vodf.puller_type_name,
			vodf.puller_type_short_name,
			vodf.puller_color,
			vodf.puller_color_name,
			vodf.puller_color_short_name,
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.slider_link,
			vodf.slider_link_name,
			vodf.slider_link_short_name,
			vodf.slider,
			vodf.slider_name,
			vodf.slider_short_name,
			vodf.slider_body_shape,
			vodf.slider_body_shape_name,
			vodf.slider_body_shape_short_name,
			vodf.coloring_type,
			vodf.coloring_type_name,
			vodf.coloring_type_short_name,
			stock.order_quantity,
			vodf.order_info_uuid,
			pp.name as party_name,
			vodf.order_number,
			vodf.item_description,
			stock.sa_prod::float8,
			stock.coloring_stock::float8,
			stock.coloring_prod::float8,
			stock.coloring_stock::float8 + production.production_quantity::float8 as max_coloring_quantity,
			production.with_link,
			CAST(
				CASE 
					WHEN production.with_link = 1
						THEN
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION),
								CAST(stock.link_quantity AS DOUBLE PRECISION)
							) 
						ELSE 
							LEAST(
								CAST(stock.body_quantity AS DOUBLE PRECISION),
								CAST(stock.cap_quantity AS DOUBLE PRECISION),
								CAST(stock.puller_quantity AS DOUBLE PRECISION)
							) 
						END
			AS DOUBLE PRECISION) + production.production_quantity::float8 AS max_sa_quantity,
			TRUE as against_order
		FROM
			slider.production
		LEFT JOIN
			slider.stock ON production.stock_uuid = stock.uuid
		LEFT JOIN 
			hr.users ON production.created_by = users.uuid
		LEFT JOIN 
			zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid
		LEFT JOIN 
			zipper.order_info ON vodf.order_info_uuid = order_info.uuid
		LEFT JOIN
			public.party pp ON order_info.party_uuid = pp.uuid
		WHERE production.section = 'sa_prod'
		UNION 
		SELECT 
			die_casting_to_assembly_stock.uuid,
			null as stock_uuid,
			die_casting_to_assembly_stock.production_quantity::float8,
			die_casting_to_assembly_stock.weight::float8,
			die_casting_to_assembly_stock.wastage::float8,
			'assembly' as section,
			die_casting_to_assembly_stock.created_by,
			users.name as created_by_name,
			die_casting_to_assembly_stock.created_at,
			die_casting_to_assembly_stock.updated_at,
			die_casting_to_assembly_stock.remarks,
			null as item,
			assembly_stock.name as item_name,
			null as item_short_name,
			null as zipper_number,
			null as zipper_number_name,
			null as zipper_number_short_name,
			null as end_type,
			null as end_type_name,
			null as end_type_short_name,
			null as lock_type,
			null as lock_type_name,
			null as lock_type_short_name,
			null as puller_type,
			diecastingpuller.name as puller_type_name,
			null as puller_type_short_name,
			null as puller_color,
			null as puller_color_name,
			null as puller_color_short_name,
			null as logo_type,
			null as logo_type_name,
			null as logo_type_short_name,
			null as slider_link,
			diecastinglink.name as slider_link_name,
			null as slider_link_short_name,
			null as slider,
			null as slider_name,
			null as slider_short_name,
			null as slider_body_shape,
			diecastingbody.name as slider_body_shape_name,
			null as slider_body_shape_short_name,
			null as coloring_type,
			null as coloring_type_name,
			null as coloring_type_short_name,
			null as order_quantity,
			null as order_info_uuid,
			null as party_name,
			'Assembly Stock' as order_number,
			null as item_description,
			null as sa_prod,
			null as coloring_stock,
			null as coloring_prod,
			null as max_coloring_quantity,
			die_casting_to_assembly_stock.with_link,
			CAST(
				CASE 
					WHEN die_casting_to_assembly_stock.with_link = 1
						THEN
							LEAST(
								CAST(diecastingbody.quantity_in_sa AS DOUBLE PRECISION),
								CAST(diecastingpuller.quantity_in_sa AS DOUBLE PRECISION),
								CAST(diecastingcap.quantity_in_sa AS DOUBLE PRECISION),
								CAST(diecastinglink.quantity_in_sa AS DOUBLE PRECISION)
							) 
						ELSE 
							LEAST(
								CAST(diecastingbody.quantity_in_sa AS DOUBLE PRECISION),
								CAST(diecastingpuller.quantity_in_sa AS DOUBLE PRECISION),
								CAST(diecastingcap.quantity_in_sa AS DOUBLE PRECISION)
							) 
						END
			AS DOUBLE PRECISION) + die_casting_to_assembly_stock.production_quantity::float8 AS max_sa_quantity,
			FALSE as against_order
		FROM
			slider.die_casting_to_assembly_stock
		LEFT JOIN 
			slider.assembly_stock ON die_casting_to_assembly_stock.assembly_stock_uuid = assembly_stock.uuid
		LEFT JOIN
			hr.users ON die_casting_to_assembly_stock.created_by = users.uuid
		LEFT JOIN
			slider.die_casting diecastingbody ON assembly_stock.die_casting_body_uuid = diecastingbody.uuid
		LEFT JOIN
			slider.die_casting diecastingpuller ON assembly_stock.die_casting_puller_uuid = diecastingpuller.uuid
		LEFT JOIN
			slider.die_casting diecastingcap ON assembly_stock.die_casting_cap_uuid = diecastingcap.uuid
		LEFT JOIN
			slider.die_casting diecastinglink ON assembly_stock.die_casting_link_uuid = diecastinglink.uuid
		ORDER BY
			created_at DESC;
	`;

	const productionLogPromise = db.execute(query);

	try {
		const data = await productionLogPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: `production log for assembly`,
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
