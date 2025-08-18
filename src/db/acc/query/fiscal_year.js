import { desc, eq } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { fiscal_year } from '../schema.js';
import { alias } from 'drizzle-orm/pg-core';

import * as hrSchema from '../../hr/schema.js';

const createdByUser = alias(hrSchema.users, 'createdByUser');
const updatedByUser = alias(hrSchema.users, 'updatedByUser');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.insert(fiscal_year)
		.values(req.body)
		.returning({ insertedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `Fiscal Year ${data[0].insertedYear} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.update(fiscal_year)
		.set(req.body)
		.where(eq(fiscal_year.uuid, req.params.uuid))
		.returning({ updatedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `Fiscal Year ${data[0].updatedYear} updated`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.delete(fiscal_year)
		.where(eq(fiscal_year.uuid, req.params.uuid))
		.returning({ deletedYear: fiscal_year.year_no });

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `Fiscal Year ${data[0].deletedYear} deleted`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select()
		.from(fiscal_year)
		.orderBy(desc(fiscal_year.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Fiscal Years',
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const fyPromise = db
		.select()
		.from(fiscal_year)
		.where(eq(fiscal_year.uuid, req.params.uuid));

	try {
		const data = await fyPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Fiscal Year',
		};
		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
