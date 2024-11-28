import { desc, eq, ne, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import zipper, {
	dyed_tape_transaction_from_stock,
	tape_coil,
} from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
);

// export async function insert(req, res, next) {
//     if (!(await validateRequest(req, next))) return;

//     const dyedTapeTransactionFromStockPromise = db
//         .insert(dyedTapeTransactionFromStock)
//         .values(req.body)
//         .returning({ insertedUuid: dyedTapeTransactionFromStock.uuid });

//     try {
//         const data = await dyedTapeTransactionFromStockPromise;

//         const toast = {
//             status: 201,
//             type: 'insert',
//             message: `${data[0].insertedUuid} inserted`,
//         };

//         res.status(201).json({ toast, data });
//     } catch (error) {
//         await handleError({ error, res });
//     }
// }

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyedTapeTransactionFromStockPromise = db
		.insert(dyed_tape_transaction_from_stock)
		.values(req.body)
		.returning({ insertedUuid: dyed_tape_transaction_from_stock.uuid });

	try {
		const data = await dyedTapeTransactionFromStockPromise;

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedUuid} inserted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyedTapeTransactionFromStockPromise = db
		.update(dyed_tape_transaction_from_stock)
		.set(req.body)
		.where(eq(dyed_tape_transaction_from_stock.uuid, req.params.uuid))
		.returning({ updatedUuid: dyed_tape_transaction_from_stock.uuid });

	try {
		const data = await dyedTapeTransactionFromStockPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyedTapeTransactionFromStockPromise = db
		.delete(dyed_tape_transaction_from_stock)
		.where(eq(dyed_tape_transaction_from_stock.uuid, req.params.uuid))
		.returning({ deletedUuid: dyed_tape_transaction_from_stock.uuid });

	try {
		const data = await dyedTapeTransactionFromStockPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const item = req.query.item;

	const query = sql`
			SELECT 
				dyed_tape_transaction_from_stock.uuid,
				dyed_tape_transaction_from_stock.order_description_uuid,
				dyed_tape_transaction_from_stock.trx_quantity::float8,
				dyed_tape_transaction_from_stock.tape_coil_uuid,
				vodf.order_number,
				vodf.item_description,
				vod.order_type,
				tape_coil.name AS tape_coil_name,
				tape_coil.stock_quantity::float8,
				tape_coil.item_uuid,
				item_properties.name AS item_name,
				tape_coil.zipper_number_uuid,
				zipper_number_properties.name AS zipper_number_name,
				dyed_tape_transaction_from_stock.created_by,
				users.name AS created_by_name,
				dyed_tape_transaction_from_stock.created_at,
				dyed_tape_transaction_from_stock.updated_at,
				dyed_tape_transaction_from_stock.remarks,
				dyed_tape_transaction_from_stock.sfg_uuid,
				oe.color,
				oe.style,
				CONCAT(oe.color, ' - ', oe.style) as color_style
			FROM 
				zipper.dyed_tape_transaction_from_stock
			LEFT JOIN 
				hr.users ON dyed_tape_transaction_from_stock.created_by = users.uuid
			LEFT JOIN 
				zipper.tape_coil ON dyed_tape_transaction_from_stock.tape_coil_uuid = tape_coil.uuid
			LEFT JOIN 
				public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
			LEFT JOIN 
				public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
			LEFT JOIN
				zipper.v_order_details_full vodf ON dyed_tape_transaction_from_stock.order_description_uuid = vodf.order_description_uuid
			LEFT JOIN zipper.sfg sfg ON dyed_tape_transaction_from_stock.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			WHERE 
				${
					item === 'nylon'
						? sql`LOWER(item_properties.name) = 'nylon'`
						: sql`LOWER(item_properties.name) != 'nylon'`
				}
			ORDER BY 
				dyed_tape_transaction_from_stock.created_at DESC;
	`;

	const dyedTapeTransactionFromStockPromise = db.execute(query);

	try {
		const data = await dyedTapeTransactionFromStockPromise;

		const toast = {
			status: 201,
			type: 'select_all',
			message: 'dyed_tape_transaction_from_stock list',
		};

		res.status(201).json({ toast, data: data.rows });
	} catch (error) {
		handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
			SELECT 
				dyed_tape_transaction_from_stock.uuid,
				dyed_tape_transaction_from_stock.order_description_uuid,
				dyed_tape_transaction_from_stock.trx_quantity::float8,
				dyed_tape_transaction_from_stock.tape_coil_uuid,
				vodf.order_number,
				vodf.item_description,
				vod.order_type,
				tape_coil.name AS tape_coil_name,
				tape_coil.stock_quantity::float8,
				tape_coil.item_uuid,
				item_properties.name AS item_name,
				tape_coil.zipper_number_uuid,
				zipper_number_properties.name AS zipper_number_name,
				dyed_tape_transaction_from_stock.created_by,
				users.name AS created_by_name,
				dyed_tape_transaction_from_stock.created_at,
				dyed_tape_transaction_from_stock.updated_at,
				dyed_tape_transaction_from_stock.remarks,
				dyed_tape_transaction_from_stock.sfg_uuid,
				oe.color,
				oe.style,
				CONCAT(oe.color, ' - ', oe.style) as color_style
			FROM 
				zipper.dyed_tape_transaction_from_stock
			LEFT JOIN 
				hr.users ON dyed_tape_transaction_from_stock.created_by = users.uuid
			LEFT JOIN 
				zipper.tape_coil ON dyed_tape_transaction_from_stock.tape_coil_uuid = tape_coil.uuid
			LEFT JOIN 
				public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
			LEFT JOIN 
				public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
			LEFT JOIN
				zipper.v_order_details_full vodf ON dyed_tape_transaction_from_stock.order_description_uuid = vodf.order_description_uuid
			LEFT JOIN zipper.sfg sfg ON dyed_tape_transaction_from_stock.sfg_uuid = sfg.uuid
			LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
			WHERE 
				dyed_tape_transaction_from_stock.uuid = ${req.params.uuid};
	`;

	const dyedTapeTransactionFromStockPromise = db.execute(query);

	try {
		const data = await dyedTapeTransactionFromStockPromise;
		const toast = {
			status: 201,
			type: 'select',
			message: 'dyed_tape_transaction_from_stock list',
		};

		res.status(201).json({ toast, data: data.rows[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
