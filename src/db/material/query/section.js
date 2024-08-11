import { eq } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import { section } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { uuid, name, short_name, remarks } = req.body;

	const sectionPromise = db
		.insert(section)
		.values({ uuid, name, short_name, remarks })
		.returning({ createdName: section.name });

	try {
		const data = await sectionPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].createdName} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { name, short_name, remarks } = req.body;

	const sectionPromise = db
		.update(section)
		.set({ name, short_name, remarks })
		.where(eq(section.uuid, req.params.uuid))
		.returning({ updatedName: section.name });

	try {
		const data = await sectionPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(200).json({ toast, data });
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

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(section);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Section list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const sectionPromise = db
		.select()
		.from(section)
		.where(eq(section.uuid, req.params.uuid));
	const toast = {
		status: 200,
		type: 'select',
		message: 'Section',
	};

	handleResponse({ promise: sectionPromise, res, next, ...toast });
}
