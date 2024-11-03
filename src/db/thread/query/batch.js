import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import { batch } from '../schema.js';

const labCreated = alias(hrSchema.users, 'labCreated');
const yarnIssueCreated = alias(hrSchema.users, 'yarnIssueCreated');
const dyeingOperator = alias(hrSchema.users, 'dyeingOperator');
const dyeingSupervisor = alias(hrSchema.users, 'dyeingSupervisor');
const coningCreatedBy = alias(hrSchema.users, 'coningCreatedBy');
const passBy = alias(hrSchema.users, 'passBy');
const coningOperator = alias(hrSchema.users, 'coningOperator');
const coningSupervisor = alias(hrSchema.users, 'coningSupervisor');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const resultPromise = db
		.insert(batch)
		.values(req.body)
		.returning({
			insertedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
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
		.update(batch)
		.set(req.body)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({
			updatedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
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
		.delete(batch)
		.where(eq(batch.uuid, req.params.uuid))
		.returning({
			deletedId: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
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
	// const resultPromise = db
	// 	.select({
	// 		uuid: batch.uuid,
	// 		id: batch.id,
	// 		batch_id: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
	// 		machine_uuid: batch.machine_uuid,
	// 		machine_name: publicSchema.machine.name,
	// 		slot: batch.slot,
	// 		lab_created_by: batch.lab_created_by,
	// 		lab_created_by_name: labCreated.name,
	// 		lab_created_at: batch.lab_created_at,
	// 		lab_updated_at: batch.lab_updated_at,
	// 		dyeing_operator: batch.dyeing_operator,
	// 		dyeing_operator_name: dyeingOperator.name,
	// 		reason: batch.reason,
	// 		category: batch.category,
	// 		status: batch.status,
	// 		pass_by: batch.pass_by,
	// 		pass_by_name: passBy.name,
	// 		shift: batch.shift,
	// 		dyeing_supervisor: batch.dyeing_supervisor,
	// 		dyeing_supervisor_name: dyeingSupervisor.name,
	// 		dyeing_created_at: batch.dyeing_created_at,
	// 		dyeing_updated_at: batch.dyeing_updated_at,
	// 		yarn_quantity: decimalToNumber(batch.yarn_quantity),
	// 		yarn_issue_created_by: batch.yarn_issue_created_by,
	// 		yarn_issue_created_by_name: yarnIssueCreated.name,
	// 		yarn_issue_created_at: batch.yarn_issue_created_at,
	// 		yarn_issue_updated_at: batch.yarn_issue_updated_at,
	// 		is_drying_complete: batch.is_drying_complete,
	// 		drying_created_at: batch.drying_created_at,
	// 		drying_updated_at: batch.drying_updated_at,
	// 		coning_operator: batch.coning_operator,
	// 		coning_operator_name: coningOperator.name,
	// 		coning_supervisor: batch.coning_supervisor,
	// 		coning_supervisor_name: coningSupervisor.name,
	// 		coning_machines: batch.coning_machines,
	// 		coning_created_by: batch.coning_created_by,
	// 		coning_created_by_name: coningCreatedBy.name,
	// 		coning_created_at: batch.coning_created_at,
	// 		coning_updated_at: batch.coning_updated_at,
	// 		created_by: batch.created_by,
	// 		created_by_name: hrSchema.users.name,
	// 		created_at: batch.created_at,
	// 		updated_at: batch.updated_at,
	// 		remarks: batch.remarks,
	// 		total_yarn_quantity: db
	// 			.sum('batch_entry.yarn_quantity')
	// 			.as('total_yarn_quantity'),
	// 	})
	// 	.from(batch)
	// 	.leftJoin(hrSchema.users, eq(batch.created_by, hrSchema.users.uuid))
	// 	.leftJoin(
	// 		publicSchema.machine,
	// 		eq(batch.machine_uuid, publicSchema.machine.uuid)
	// 	)
	// 	.leftJoin(labCreated, eq(batch.lab_created_by, labCreated.uuid))
	// 	.leftJoin(
	// 		yarnIssueCreated,
	// 		eq(batch.yarn_issue_created_by, yarnIssueCreated.uuid)
	// 	)
	// 	.leftJoin(
	// 		dyeingOperator,
	// 		eq(batch.dyeing_operator, dyeingOperator.uuid)
	// 	)
	// 	.leftJoin(
	// 		dyeingSupervisor,
	// 		eq(batch.dyeing_supervisor, dyeingSupervisor.uuid)
	// 	)
	// 	.leftJoin(
	// 		coningCreatedBy,
	// 		eq(batch.coning_created_by, coningCreatedBy.uuid)
	// 	)
	// 	.leftJoin(passBy, eq(batch.pass_by, passBy.uuid))
	// 	.leftJoin(
	// 		coningOperator,
	// 		eq(batch.coning_operator, coningOperator.uuid)
	// 	)
	// 	.leftJoin(
	// 		coningSupervisor,
	// 		eq(batch.coning_supervisor, coningSupervisor.uuid)
	// 	)
	// 	.leftJoin('batch_entry', 'batch.uuid', 'batch_entry.batch_uuid') // Join with batch_entry table
	// 	.groupBy(
	// 		batch.coning_machines,
	// 		batch.coning_created_by,
	// 		coningCreatedBy.name,
	// 		batch.coning_created_at,
	// 		batch.coning_updated_at,
	// 		batch.created_by,
	// 		hrSchema.users.name,
	// 		batch.created_at,
	// 		batch.updated_at,
	// 		batch.remarks
	// 	)
	// 	.orderBy(desc(batch.created_at));

	const query = sql`
					SELECT
						batch.uuid,
						batch.id,
						concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_id,
						batch.machine_uuid,
						CONCAT(pm.name, ' (', pm.min_capacity::float8, '-', pm.max_capacity::float8, ')') as machine_name,
						batch.slot,
						batch.lab_created_by,
						labCreated.name as lab_created_by_name,
						batch.lab_created_at,
						batch.lab_updated_at,
						batch.dyeing_operator,
						dyeingOperator.name as dyeing_operator_name,
						batch.reason,
						batch.category,
						batch.status,
						batch.pass_by,
						passBy.name as pass_by_name,
						batch.shift,
						batch.dyeing_supervisor,
						dyeingSupervisor.name as dyeing_supervisor_name,
						batch.dyeing_created_at,
						batch.dyeing_updated_at,
						batch.yarn_quantity::float8 as yarn_quantity,
						batch.yarn_issue_created_by,
						yarnIssueCreated.name as yarn_issue_created_by_name,
						batch.yarn_issue_created_at,
						batch.yarn_issue_updated_at,
						batch.is_drying_complete,
						batch.drying_created_at,
						batch.drying_updated_at,
						batch.coning_operator,
						coningOperator.name as coning_operator_name,
						batch.coning_supervisor,
						coningSupervisor.name as coning_supervisor_name,
						batch.coning_machines,
						batch.coning_created_by,
						coningCreatedBy.name as coning_created_by_name,
						batch.coning_created_at,
						batch.coning_updated_at,
						batch.created_by,
						createdBy.name as created_by_name,
						batch.created_at,
						batch.updated_at,
						batch.remarks,
						SUM(batch_entry.yarn_quantity)::float8 as total_yarn_quantity,
						SUM(batch_entry.quantity * cl.max_weight)::float8 as total_expected_weight,
						SUM(batch_entry.quantity)::float8 as total_cone,
						jsonb_agg(
							DISTINCT concat('TO', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))
						) as order_numbers
					FROM
						thread.batch
						LEFT JOIN hr.users as labCreated ON batch.lab_created_by = labCreated.uuid
						LEFT JOIN hr.users as dyeingOperator ON batch.dyeing_operator = dyeingOperator.uuid
						LEFT JOIN hr.users as passBy ON batch.pass_by = passBy.uuid
						LEFT JOIN hr.users as dyeingSupervisor ON batch.dyeing_supervisor = dyeingSupervisor.uuid
						LEFT JOIN hr.users as yarnIssueCreated ON batch.yarn_issue_created_by = yarnIssueCreated.uuid
						LEFT JOIN hr.users as coningSupervisor ON batch.coning_supervisor = coningSupervisor.uuid
						LEFT JOIN hr.users as coningCreatedBy ON batch.coning_created_by = coningCreatedBy.uuid
						LEFT JOIN hr.users as coningOperator ON batch.coning_operator = coningOperator.uuid
						LEFT JOIN hr.users as createdBy ON batch.created_by = createdBy.uuid
						LEFT JOIN public.machine pm ON batch.machine_uuid = pm.uuid
						LEFT JOIN thread.batch_entry ON batch.uuid = batch_entry.batch_uuid
						LEFT JOIN thread.order_entry oe ON batch_entry.order_entry_uuid = oe.uuid
						LEFT JOIN thread.count_length cl ON oe.count_length_uuid = cl.uuid
						LEFT JOIN thread.order_info order_info ON oe.order_info_uuid = order_info.uuid
					GROUP BY
						batch.uuid,
						batch.id,
						pm.name,
						pm.min_capacity,
						pm.max_capacity,
						batch.slot,
						labCreated.name,
						batch.lab_created_at,
						batch.lab_updated_at,
						dyeingOperator.name,
						batch.reason,
						batch.category,
						batch.status,
						passBy.name,
						batch.shift,
						dyeingSupervisor.name,
						batch.dyeing_created_at,
						batch.dyeing_updated_at,
						batch.yarn_quantity,
						yarnIssueCreated.name,
						batch.yarn_issue_created_at,
						batch.yarn_issue_updated_at,
						batch.is_drying_complete,
						batch.drying_created_at,
						batch.drying_updated_at,
						coningOperator.name,
						coningSupervisor.name,
						batch.coning_machines,
						coningCreatedBy.name,
						batch.coning_created_at,
						batch.coning_updated_at,
						createdBy.name,
						batch.created_at,
						batch.updated_at,
						batch.remarks
					ORDER BY
						batch.created_at DESC
				`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'batch list',
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
						batch.uuid,
						batch.id,
						concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0')) as batch_id,
						batch.machine_uuid,
						pm.name as machine_name,
						pm.water_capacity,
						batch.slot,
						batch.lab_created_by,
						labCreated.name as lab_created_by_name,
						batch.lab_created_at,
						batch.lab_updated_at,
						batch.dyeing_operator,
						dyeingOperator.name as dyeing_operator_name,
						batch.reason,
						batch.category,
						batch.status,
						batch.pass_by,
						passBy.name as pass_by_name,
						batch.shift,
						batch.dyeing_supervisor,
						dyeingSupervisor.name as dyeing_supervisor_name,
						batch.dyeing_created_at,
						batch.dyeing_updated_at,
						batch.yarn_quantity::float8 as yarn_quantity,
						batch.yarn_issue_created_by,
						yarnIssueCreated.name as yarn_issue_created_by_name,
						batch.yarn_issue_created_at,
						batch.yarn_issue_updated_at,
						batch.is_drying_complete,
						batch.drying_created_at,
						batch.drying_updated_at,
						batch.coning_operator,
						coningOperator.name as coning_operator_name,
						batch.coning_supervisor,
						coningSupervisor.name as coning_supervisor_name,
						batch.coning_machines,
						batch.coning_created_by,
						coningCreatedBy.name as coning_created_by_name,
						batch.coning_created_at,
						batch.coning_updated_at,
						batch.created_by,
						createdBy.name as created_by_name,
						batch.created_at,
						batch.updated_at,
						batch.remarks,
						SUM(batch_entry.yarn_quantity)::float8 as total_yarn_quantity,
						SUM(batch_entry.quantity * cl.max_weight)::float8 as total_expected_weight
					FROM
						thread.batch
					LEFT JOIN hr.users as labCreated ON batch.lab_created_by = labCreated.uuid
					LEFT JOIN hr.users as dyeingOperator ON batch.dyeing_operator = dyeingOperator.uuid
					LEFT JOIN hr.users as passBy ON batch.pass_by = passBy.uuid
					LEFT JOIN hr.users as dyeingSupervisor ON batch.dyeing_supervisor = dyeingSupervisor.uuid
					LEFT JOIN hr.users as yarnIssueCreated ON batch.yarn_issue_created_by = yarnIssueCreated.uuid
					LEFT JOIN hr.users as coningSupervisor ON batch.coning_supervisor = coningSupervisor.uuid
					LEFT JOIN hr.users as coningCreatedBy ON batch.coning_created_by = coningCreatedBy.uuid
					LEFT JOIN hr.users as coningOperator ON batch.coning_operator = coningOperator.uuid
					LEFT JOIN hr.users as createdBy ON batch.created_by = createdBy.uuid
					LEFT JOIN public.machine pm ON batch.machine_uuid = pm.uuid
					LEFT JOIN thread.batch_entry ON batch.uuid = batch_entry.batch_uuid
					LEFT JOIN thread.order_entry oe ON batch_entry.order_entry_uuid = oe.uuid
					LEFT JOIN thread.count_length cl ON oe.count_length_uuid = cl.uuid
					WHERE
						batch.uuid = ${req.params.uuid}
					GROUP BY
						batch.uuid,
						batch.id,
						pm.name,
						pm.water_capacity,
						batch.slot,
						labCreated.name,
						batch.lab_created_at,
						batch.lab_updated_at,
						dyeingOperator.name,
						batch.reason,
						batch.category,
						batch.status,
						passBy.name,
						batch.shift,
						dyeingSupervisor.name,
						batch.dyeing_created_at,
						batch.dyeing_updated_at,
						batch.yarn_quantity,
						yarnIssueCreated.name,
						batch.yarn_issue_created_at,
						batch.yarn_issue_updated_at,
						batch.is_drying_complete,
						batch.drying_created_at,
						batch.drying_updated_at,
						coningOperator.name,
						coningSupervisor.name,
						batch.coning_machines,
						coningCreatedBy.name,
						batch.coning_created_at,
						batch.coning_updated_at,
						createdBy.name,
						batch.created_at,
						batch.updated_at,
						batch.remarks
				`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'batch',
		};

		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBatchDetailsByBatchUuid(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		const api = await createApi(req);

		const { batch_uuid } = req.params;

		const fetchData = async (endpoint) =>
			await api.get(`/thread/${endpoint}/${batch_uuid}`);

		const [batch, batch_entry] = await Promise.all([
			fetchData('batch'),
			fetchData('batch-entry/by'),
		]);

		const response = {
			...batch?.data?.data,
			batch_entry: batch_entry?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			message: 'batch',
		};

		return await res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}
