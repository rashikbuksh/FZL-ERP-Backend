import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { planning } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// if planning week already exists, then update the existing entry

	const planningExistsPromise = db
		.select(1)
		.from(planning)
		.where(eq(planning.week, req.body.week));

	try {
		const planningExists = await planningExistsPromise;

		if (planningExists.length) {
			const planningPromise = db
				.update(planning)
				.set(req.body)
				.where(eq(planning.week, req.body.week))
				.returning({
					updatedWeek: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
				});

			try {
				const data = await planningPromise;
				const toast = {
					status: 201,
					type: 'update',
					message: `${data[0].updatedWeek} updated`,
				};

				res.status(201).json({ toast, data });
			} catch (error) {
				await handleError({ error, res });
			}
			return;
		} else {
			const planningPromise = db
				.insert(planning)
				.values(req.body)
				.returning({
					insertedWeek: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
				});
			try {
				const data = await planningPromise;

				const toast = {
					status: 201,
					type: 'insert',
					message: `${data[0].insertedWeek} inserted`,
				};

				res.status(201).json({ toast, data });
			} catch (error) {
				await handleError({ error, res });
			}
		}
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const planningPromise = db
		.update(planning)
		.set(req.body)
		.where(eq(planning.week, req.params.week))
		.returning({
			updatedWeek: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
		});

	try {
		const data = await planningPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedWeek} updated`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const planningPromise = db
		.delete(planning)
		.where(eq(planning.week, req.params.week))
		.returning({
			deletedWeek: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
		});

	try {
		const data = await planningPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedWeek} deleted`,
		};

		res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			week: planning.week,
			week_id: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
			created_by: planning.created_by,
			created_by_name: hrSchema.users.name,
			created_at: planning.created_at,
			updated_at: planning.updated_at,
			remarks: planning.remarks,
		})

		.from(planning)
		.leftJoin(hrSchema.users, eq(planning.created_by, hrSchema.users.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'planning list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	const resultPromise = db
		.select({
			week: planning.week,
			week_id: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
			created_by: planning.created_by,
			created_by_name: hrSchema.users.name,
			created_at: planning.created_at,
			updated_at: planning.updated_at,
			remarks: planning.remarks,
		})
		.from(planning)
		.leftJoin(hrSchema.users, eq(planning.created_by, hrSchema.users.uuid))
		.where(eq(planning.week, req.params.week));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'planning',
		};

		res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPlanningByPlanningWeek(req, res, next) {
	const resultPromise = db
		.select({
			week: planning.week,
			week_id: sql` CONCAT('DP-',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 1),'-W',SPLIT_PART(CAST(${planning.week} AS TEXT), '-', 2))`,
			created_by: hrSchema.users.uuid,
			created_by_name: hrSchema.users.name,
			created_at: planning.created_at,
			updated_at: planning.updated_at,
			remarks: planning.remarks,
		})
		.from(planning)
		.leftJoin(hrSchema.users, eq(planning.created_by, hrSchema.users.uuid))
		.where(eq(planning.week, req.params.planning_week));

	const toast = {
		status: 200,
		type: 'select',
		message: 'planning',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function selectPlanningAndPlanningEntryByPlanningWeek(
	req,
	res,
	next
) {
	try {
		const api = await createApi(req);

		const { planning_week } = req.params;

		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/by/${planning_week}`)
				.then((response) => response);

		const [planning, planning_entry] = await Promise.all([
			fetchData('/zipper/planning'),
			fetchData('/zipper/planning-entry'),
		]);

		const response = {
			...planning?.data?.data[0],
			planning_entry: planning_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Planning Details by Planning Week',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
