import { desc, eq, ne, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import * as publicSchema from '../../public/schema.js';

import db from '../../index.js';

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

	const dyedTapeTransactionFromStockPromise = db
		.select({
			uuid: dyed_tape_transaction_from_stock.uuid,
			order_description_uuid:
				dyed_tape_transaction_from_stock.order_description_uuid,
			trx_quantity: dyed_tape_transaction_from_stock.trx_quantity,
			tape_coil_uuid: dyed_tape_transaction_from_stock.tape_coil_uuid,
			tape_coil_name: tape_coil.name,
			stock_quantity: tape_coil.stock_quantity,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			created_by: dyed_tape_transaction_from_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dyed_tape_transaction_from_stock.created_at,
			updated_at: dyed_tape_transaction_from_stock.updated_at,
			remarks: dyed_tape_transaction_from_stock.remarks,
		})
		.from(dyed_tape_transaction_from_stock)
		.leftJoin(
			hrSchema.users,
			eq(dyed_tape_transaction_from_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			tape_coil,
			eq(dyed_tape_transaction_from_stock.tape_coil_uuid, tape_coil.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(
			item == 'nylon'
				? eq(sql`lower(item_properties.name)`, 'nylon')
				: ne(sql`lower(item_properties.name)`, 'nylon')
		)
		.orderBy(desc(dyed_tape_transaction_from_stock.created_at));

	const toast = {
		status: 201,
		type: 'select all',
		message: 'dyed_tape_transaction_from_stock list',
	};

	handleResponse({
		promise: dyedTapeTransactionFromStockPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dyedTapeTransactionFromStockPromise = db
		.select({
			uuid: dyed_tape_transaction_from_stock.uuid,
			order_description_uuid:
				dyed_tape_transaction_from_stock.order_description_uuid,
			trx_quantity: dyed_tape_transaction_from_stock.trx_quantity,
			tape_coil_uuid: dyed_tape_transaction_from_stock.tape_coil_uuid,
			tape_coil_name: tape_coil.name,
			stock_quantity: tape_coil.stock_quantity,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			created_by: dyed_tape_transaction_from_stock.created_by,
			created_by_name: hrSchema.users.name,
			created_at: dyed_tape_transaction_from_stock.created_at,
			updated_at: dyed_tape_transaction_from_stock.updated_at,
			remarks: dyed_tape_transaction_from_stock.remarks,
		})
		.from(dyed_tape_transaction_from_stock)
		.leftJoin(
			hrSchema.users,
			eq(dyed_tape_transaction_from_stock.created_by, hrSchema.users.uuid)
		)
		.leftJoin(
			tape_coil,
			eq(dyed_tape_transaction_from_stock.tape_coil_uuid, tape_coil.uuid)
		)
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.where(eq(dyed_tape_transaction_from_stock.uuid, req.params.uuid));

	try {
		const data = await dyedTapeTransactionFromStockPromise;
		const toast = {
			status: 201,
			type: 'select',
			message: 'dyed_tape_transaction_from_stock list',
		};

		res.status(201).json({ toast, data: data[0] });
	} catch (error) {
		handleError({ error, res });
	}
}
