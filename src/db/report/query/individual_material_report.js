import { sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

export async function selectIndividualMaterialReport(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { material_uuid } = req?.params;

	try {
		const query = sql`
            SELECT
                info.uuid AS material_uuid,
                info.name AS material_name,
                info.store_type,
                purchase_entry.quantity,
                purchase_entry.price,
                info.unit,
                purchase_description.uuid as purchase_description_uuid,
                purchase_description.is_local,
                purchase_description.lc_number,
                purchase_description.challan_number,
                purchase_description.created_at AS purchase_created_at,
                CASE WHEN purchase_description.store_type = 'rm' 
					THEN CONCAT('SR', to_char(purchase_description.created_at, 'YY'), '-', LPAD(purchase_description.id::text, 4, '0')) 
					ELSE CONCAT('SRA', to_char(purchase_description.created_at, 'YY'), '-', LPAD(purchase_description.id::text, 4, '0')) 
				END AS purchase_id,
                vendor.uuid as vendor_uuid,
                vendor.name as vendor_name,
                purchase_description.remarks as purchase_description_remarks
            FROM
                purchase.entry AS purchase_entry
            LEFT JOIN purchase.description AS purchase_description ON purchase_entry.purchase_description_uuid = purchase_description.uuid
            LEFT JOIN purchase.vendor AS vendor ON purchase_description.vendor_uuid = vendor.uuid
            LEFT JOIN material.info AS info ON purchase_entry.material_uuid = info.uuid
            WHERE
                info.uuid = ${material_uuid}
        `;

		const resultPromise = db.execute(query);

		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'success',
			message: 'Individual Material Report Retrieved Successfully',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
