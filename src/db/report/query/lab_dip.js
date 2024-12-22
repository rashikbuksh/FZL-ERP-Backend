import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectLabDip(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
                    SELECT DISTINCT
                        concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0')) as info_id,
                        info.name as lab_dip_name,
                        info.lab_status as lab_status,
                        concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name ) as recipe_id,
                        recipe.name as recipe_name,
                        recipe.status as recipe_status,
                        order_entry.created_at as order_entry_created_at
                    FROM lab_dip.info
                    LEFT JOIN lab_dip.info_entry ON info.uuid = info_entry.lab_dip_info_uuid
                    LEFT JOIN lab_dip.recipe ON recipe.uuid = info_entry.recipe_uuid
                    LEFT JOIN lab_dip.recipe_entry ON recipe.uuid = recipe_entry.recipe_uuid
                    LEFT JOIN zipper.order_info ON info.order_info_uuid = zipper.order_info.uuid
                    LEFT JOIN zipper.order_description ON zipper.order_info.uuid = zipper.order_description.order_info_uuid
                    LEFT JOIN zipper.order_entry ON zipper.order_description.uuid = zipper.order_entry.order_description_uuid

                    `;

	const resultPromise = db.execute(query);
	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'success',
			message: 'lab dip data',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
