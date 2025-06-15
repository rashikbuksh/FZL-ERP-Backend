import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectOrderSheetSendReceiveReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from_date, to_date, date_type, own_uuid, marketing, party } =
		req.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}
		const zipper_query = sql`
                        SELECT 
                            v_order_details_full.*, 
                            tape_coil_required.top::float8, 
                            tape_coil_required.bottom::float8,
                            tape_coil_required.raw_mtr_per_kg::float8 as raw_per_kg_meter,
                            tape_coil_required.dyed_mtr_per_kg::float8 as dyed_per_kg_meter
                        FROM 
                            zipper.v_order_details_full 
                        LEFT JOIN 
                            zipper.tape_coil_required 
                        ON 
                            v_order_details_full.item = tape_coil_required.item_uuid  
                            AND v_order_details_full.zipper_number = tape_coil_required.zipper_number_uuid 
                            AND v_order_details_full.end_type = tape_coil_required.end_type_uuid 
                            AND (
                                lower(v_order_details_full.item_name) != 'nylon' 
                                OR v_order_details_full.nylon_stopper = tape_coil_required.nylon_stopper_uuid
                            )
                        WHERE
                            ${
								date_type == 'factory'
									? sql`v_order_details_full.receive_by_factory_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
									: sql`v_order_details_full.sno_from_head_office_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
							}
                            ${marketing ? sql` AND v_order_details_full.marketing_uuid = ${marketing}` : sql``}
                            ${party ? sql` AND v_order_details_full.party_uuid = ${party}` : sql``}
                            ${own_uuid ? sql` AND v_order_details_full.marketing_uuid = ${marketingUuid}` : sql``}
                        ORDER BY
                            order_number ASC, item_description ASC;`;

		const zipperResultPromise = db.execute(zipper_query);

		const zipper_data = await zipperResultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Sheet Send/Receive report by date',
		};

		return res.status(200).json({
			toast,
			data: zipper_data?.rows || [],
		});
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderSheetSendReceiveReportThread(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { from_date, to_date, date_type, own_uuid, marketing, party } =
		req.query;

	// get marketing_uuid from own_uuid
	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		const thread_query = sql`
                        SELECT 
                            order_info.uuid,
                            order_info.id,
                            CONCAT('ST', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
                            order_info.party_uuid,
                            party.name AS party_name,
                            order_info.marketing_uuid,
                            marketing.name AS marketing_name,
                            order_info.factory_uuid,
                            factory.name AS factory_name,
                            factory.address AS factory_address,
                            order_info.merchandiser_uuid,
                            merchandiser.name AS merchandiser_name,
                            order_info.buyer_uuid,
                            buyer.name AS buyer_name,
                            order_info.is_sample,
                            order_info.is_bill,
                            order_info.is_cash,
                            order_info.delivery_date,
                            order_info.created_by,
                            hr.users.name AS created_by_name,
                            order_info.created_at,
                            order_info.updated_at,
                            order_info.remarks,
                            swatch_approval_counts.swatch_approval_count,
                            order_entry_counts.order_entry_count,
                            CASE WHEN swatch_approval_counts.swatch_approval_count > 0 THEN 1 ELSE 0 END AS is_swatches_approved,
                            order_info.revision_no,
                            order_info.is_cancelled,
                            order_info.sno_from_head_office,
                            order_info.sno_from_head_office_time,
                            order_info.sno_from_head_office_by,
                            sno_from_head_office_by.name as sno_from_head_office_by_name,
                            order_info.receive_by_factory,
                            order_info.receive_by_factory_time,
                            receive_by_factory_by.name AS receive_by_factory_by_name,
                            order_info.receive_by_factory_by
                        FROM 
                            thread.order_info
                        LEFT JOIN 
                            hr.users ON order_info.created_by = hr.users.uuid
                        LEFT JOIN 
                            public.party ON order_info.party_uuid = public.party.uuid
                        LEFT JOIN 
                            public.marketing ON order_info.marketing_uuid = public.marketing.uuid
                        LEFT JOIN 
                            public.factory ON order_info.factory_uuid = public.factory.uuid
                        LEFT JOIN 
                            public.merchandiser ON order_info.merchandiser_uuid = public.merchandiser.uuid
                        LEFT JOIN 
                            public.buyer ON order_info.buyer_uuid = public.buyer.uuid
                        LEFT JOIN (
                                    SELECT COUNT(toe.swatch_approval_date) AS swatch_approval_count, toe.order_info_uuid as order_info_uuid
                                    FROM thread.order_entry toe
                                    GROUP BY toe.order_info_uuid
                        ) swatch_approval_counts ON order_info.uuid = swatch_approval_counts.order_info_uuid
                        LEFT JOIN (
                                    SELECT COUNT(*) AS order_entry_count, toe.order_info_uuid as order_info_uuid
                                    FROM thread.order_entry toe
                                    GROUP BY toe.order_info_uuid
                        ) order_entry_counts ON order_info.uuid = order_entry_counts.order_info_uuid
                        LEFT JOIN 
                            hr.users AS sno_from_head_office_by ON order_info.sno_from_head_office_by = sno_from_head_office_by.uuid
                        LEFT JOIN
                            hr.users AS receive_by_factory_by ON order_info.receive_by_factory_by = receive_by_factory_by.uuid
                        WHERE
                            ${
								date_type == 'factory'
									? sql`order_info.receive_by_factory_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
									: sql`order_info.sno_from_head_office_time BETWEEN ${from_date}::TIMESTAMP AND ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'`
							}
                            ${marketing ? sql` AND order_info.marketing_uuid = ${marketing}` : sql``}
                            ${party ? sql` AND order_info.party_uuid = ${party}` : sql``}
                            ${own_uuid ? sql` AND order_info.marketing_uuid = ${marketingUuid}` : sql``}
                        ORDER BY
                            order_number ASC;
                    `;

		const threadResultPromise = db.execute(thread_query);
		const thread_data = await threadResultPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Sheet Send/Receive report by date',
		};

		return res.status(200).json({
			toast,
			data: thread_data?.rows || [],
		});
	} catch (error) {
		await handleError({ error, res });
	}
}
