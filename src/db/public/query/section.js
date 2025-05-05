import { eq } from 'drizzle-orm';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { section } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.insert(section)
		.values(req.body)
		.returning({ insertedName: section.name });

	try {
		const data = await sectionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.update(section)
		.set(req.body)
		.where(eq(section.uuid, req.params.uuid))
		.returning({ updatedName: section.name });
	try {
		const data = await sectionPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.delete(section)
		.where(eq(section.uuid, req.params.uuid))
		.returning({ deletedName: section.name });

	try {
		const data = await sectionPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(section);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Sections list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.select()
		.from(section)
		.where(eq(section.uuid, req.params.uuid));

	try {
		const data = await sectionPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Section',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
