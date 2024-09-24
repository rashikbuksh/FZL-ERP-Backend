import { eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';

import db from '../../index.js';

import { dyed_tape_transaction_from_stock } from '../schema.js';

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

	const dyedTapeTransactionFromStockPromise = db
		.select({
			uuid: dyed_tape_transaction_from_stock.uuid,
			order_description_uuid:
				dyed_tape_transaction_from_stock.order_description_uuid,
			trx_quantity: dyed_tape_transaction_from_stock.trx_quantity,
			tape_coil_uuid: dyed_tape_transaction_from_stock.tape_coil_uuid,
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
		);

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
		.where(eq(dyed_tape_transaction_from_stock.uuid, req.params.uuid));

	const toast = {
		status: 201,
		type: 'select',
		message: 'dyed_tape_transaction_from_stock',
	};

	handleResponse({
		promise: dyedTapeTransactionFromStockPromise,
		res,
		next,
		...toast,
	});
}
