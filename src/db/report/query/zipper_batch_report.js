import { sql } from 'drizzle-orm';
import { handleError } from '../../../util/index.js';
import db from '../../index.js';

export async function zipperBatchReportOnReceivedDate(req, res, next) {
	const { from, to, order_type, filter_type } = req.query;
	const query = sql`
		SELECT 
			DISTINCT dyeing_batch.uuid,
			dyeing_batch.id,
			concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', (dyeing_batch.id::text)) as batch_id,
			dyeing_batch.batch_status,
			dyeing_batch.batch_status_date,
			dyeing_batch.machine_uuid,
			concat(public.machine.name, ' (', public.machine.min_capacity::float8, '-', public.machine.max_capacity::float8, ')') as machine_name,
			dyeing_batch.slot,
			dyeing_batch.received,
			dyeing_batch.received_date,
			dyeing_batch.created_by,
			users.name as created_by_name,
			dyeing_batch.created_at,
			dyeing_batch.updated_at,
			dyeing_batch.remarks,
			expected.total_quantity::float8,
			expected.expected_kg::float8,
			expected.order_numbers,
			item_descriptions.item_descriptions,
			ROUND(expected.total_actual_production_quantity::numeric, 3)::float8 AS total_actual_production_quantity,
			dyeing_batch.production_date::date as production_date,
			expected.party_name,
			oe_colors.colors as color,
			oe_colors.color_refs as color_refs,
			oe_colors.styles as style,
			oe_colors.bulk_approval_date as bulk_approval_date,
			dyeing_batch.batch_type as batch_type,
			dyeing_batch.order_info_uuid,
			machine.water_capacity::float8 as water_capacity,
			dyeing_batch.yarn_issued::float8 as yarn_issued,
			dyeing_batch.yarn_issued_date
		FROM zipper.dyeing_batch
		LEFT JOIN hr.users ON dyeing_batch.created_by = users.uuid
		LEFT JOIN public.machine ON dyeing_batch.machine_uuid = public.machine.uuid
		LEFT JOIN zipper.v_order_details_full vodf ON dyeing_batch.order_info_uuid = vodf.order_info_uuid
		LEFT JOIN zipper.dyeing_batch_entry ON dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
		LEFT JOIN zipper.sfg ON dyeing_batch_entry.sfg_uuid = zipper.sfg.uuid
		LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
		LEFT JOIN (
			SELECT
				ARRAY_AGG(DISTINCT style) as styles,
				ARRAY_AGG(DISTINCT color) as colors,
				ARRAY_AGG(
					DISTINCT color_ref
				) as color_refs,
				MAX(bulk_approval_date) as bulk_approval_date,
				dyeing_batch_uuid as uuid
			FROM (
				SELECT
					order_entry.style,
					order_entry.color,
					order_entry.color_ref,
					order_entry.bulk_approval_date,
					dyeing_batch.uuid as dyeing_batch_uuid
				FROM zipper.order_entry
					LEFT JOIN zipper.sfg ON order_entry.uuid = sfg.order_entry_uuid
					LEFT JOIN zipper.dyeing_batch_entry on dyeing_batch_entry.sfg_uuid = sfg.uuid
					LEFT JOIN zipper.dyeing_batch on dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
			) distinct_data
			GROUP BY
				dyeing_batch_uuid
		) AS oe_colors ON dyeing_batch.uuid = oe_colors.uuid
		LEFT JOIN (
			SELECT 
				ROUND(
					SUM((
						CASE 
							WHEN vodf.order_type = 'tape' 
								THEN ((tcr.top + tcr.bottom + be.quantity) * 1) / 100 / tcr.dyed_mtr_per_kg::float8
							ELSE ((tcr.top + tcr.bottom + CASE 
									WHEN vodf.is_inch = 1 
										THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
									ELSE CAST(oe.size AS NUMERIC)
									END) * be.quantity::float8) / 100 / tcr.dyed_mtr_per_kg::float8
						END
				)::numeric), 3) as expected_kg, 
				be.dyeing_batch_uuid, 
				jsonb_agg(DISTINCT vodf.order_number) as order_numbers, 
				jsonb_agg(DISTINCT vodf.party_name) as party_name,
				SUM(be.quantity::float8) as total_quantity, 
				SUM(be.production_quantity_in_kg::float8) as total_actual_production_quantity
			FROM zipper.dyeing_batch_entry be
				LEFT JOIN zipper.sfg ON be.sfg_uuid = zipper.sfg.uuid
				LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				LEFT JOIN 
					zipper.tape_coil_required tcr ON oe.order_description_uuid = vodf.order_description_uuid AND vodf.item = tcr.item_uuid 
					AND vodf.zipper_number = tcr.zipper_number_uuid 
					AND (CASE WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE vodf.end_type = tcr.end_type_uuid END)
				LEFT JOIN
					zipper.tape_coil tc ON  vodf.tape_coil_uuid = tc.uuid
			WHERE 
				(lower(vodf.item_name) != 'nylon' 
				OR vodf.nylon_stopper = tcr.nylon_stopper_uuid)
                AND ${
					order_type === 'bulk'
						? sql` vodf.is_sample = 0`
						: order_type === 'sample'
							? sql` vodf.is_sample = 1`
							: sql` 1=1`
				}
			GROUP BY be.dyeing_batch_uuid
		) AS expected ON dyeing_batch.uuid = expected.dyeing_batch_uuid
		LEFT JOIN (
			SELECT
				jsonb_agg(
					json_build_object(
						'order_description_uuid', order_description_uuid,
						'item_description', item_description,
						'order_number', order_number
					)
				) as item_descriptions,
				dyeing_batch_uuid
			FROM (
				SELECT DISTINCT
					vodf.order_description_uuid,
					vodf.item_description,
					vodf.order_number,
					dyeing_batch.uuid as dyeing_batch_uuid
				FROM zipper.dyeing_batch_entry be
					LEFT JOIN zipper.dyeing_batch dyeing_batch ON be.dyeing_batch_uuid = dyeing_batch.uuid
					LEFT JOIN zipper.sfg ON be.sfg_uuid = zipper.sfg.uuid
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
			) distinct_items
			GROUP BY dyeing_batch_uuid
		) AS item_descriptions ON dyeing_batch.uuid = item_descriptions.dyeing_batch_uuid
		WHERE expected.order_numbers IS NOT NULL
        AND ${from && to && filter_type == 'received_date' ? sql` dyeing_batch.received_date BETWEEN ${from} AND ${to}` : sql` TRUE`}
		AND ${from && to && filter_type == 'dyeing_status_date' ? sql` dyeing_batch.batch_status_date BETWEEN ${from} AND ${to}` : sql` TRUE`}
		AND ${from && to && filter_type == 'yarn_issued_date' ? sql` dyeing_batch.yarn_issued_date::date BETWEEN ${from} AND ${to}` : sql` TRUE`}
		ORDER BY expected.order_numbers DESC, dyeing_batch.id DESC
	`;
	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'dyeing_batch list',
		};
		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		handleError({ error, res });
	}
}
