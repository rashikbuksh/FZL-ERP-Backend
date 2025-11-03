import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function selectThreadBatchReport(req, res, next) {
	const { own_uuid, from, to } = req?.query;

	let marketingUuid = null;
	const marketingUuidQuery = sql`
        SELECT uuid
        FROM public.marketing
        WHERE user_uuid = ${own_uuid};
    `;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const query = sql`
            SELECT
				batch.uuid,
				batch.id,
				concat('TB', to_char(batch.created_at, 'YY'), '-', (batch.id::text)) as batch_id,
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
				jsonb_agg(DISTINCT 
					jsonb_build_object(
						'order_info_uuid', order_info.uuid, 
						'order_number', 
                        concat('ST', 
                                    CASE WHEN order_info.is_sample = 1 
									THEN 'S' ELSE '' 
									END, 
								to_char(order_info.created_at, 'YY'), '-', (order_info.id::text)))
				) AS order_numbers,
				jsonb_agg(
					DISTINCT order_info.uuid 
				) as order_uuids,
				batch.production_date::date as production_date,
				party.name as party_name,
				ARRAY_AGG(DISTINCT oe.color) as color,
				ARRAY_AGG(DISTINCT oe.color_ref) as color_ref,
				ARRAY_AGG(DISTINCT recipe.name) as recipe_name,
				ARRAY_AGG(DISTINCT oe.style) as style,
				batch.batch_type,
				batch.order_info_uuid,
				CASE WHEN batch.batch_type = 'extra' THEN concat('ST', CASE WHEN oi_v2.is_sample = 1 THEN 'S' ELSE '' END, to_char(oi_v2.created_at, 'YY'), '-', (oi_v2.id::text)) ELSE null END as order_number,
				oi_v2.is_sample
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
				LEFT JOIN lab_dip.recipe recipe ON oe.recipe_uuid = recipe.uuid
				LEFT JOIN thread.count_length cl ON oe.count_length_uuid = cl.uuid
				LEFT JOIN thread.order_info order_info ON oe.order_info_uuid = order_info.uuid
				LEFT JOIN public.party party ON order_info.party_uuid = party.uuid
				LEFT JOIN thread.order_info oi_v2 ON batch.order_info_uuid = oi_v2.uuid
            WHERE
				batch.is_drying_complete = 'true'
                ${from && to ? sql` AND batch.drying_created_at BETWEEN ${from} AND ${to}` : sql``}
                ${own_uuid == null ? sql`` : sql` AND order_info.marketing_uuid = ${marketingUuid}`}
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
				batch.remarks,
				party.name,
				oi_v2.is_sample,
				oi_v2.created_at,
				oi_v2.id
			ORDER BY
				batch.drying_created_at DESC
        `;
		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'thread batch report',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
