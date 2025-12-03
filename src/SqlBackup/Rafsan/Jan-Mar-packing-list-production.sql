-- Audit Report: Packing List Wise Production Value by Order Number (Jan to Mar 2025)
SELECT 
    vodf.id,
    vodf.party_name,
    vodf.marketing_name,
    vodf.order_number,
    vodf.is_bill,
    SUM(vpl.quantity) AS total_quantity,
    coalesce(SUM(vpl.quantity * CASE
        WHEN vodf.order_type = 'tape' THEN oe.party_price
        ELSE (oe.party_price / 12)
    END), 0)::float8 as total_prod_value_party,
    coalesce(SUM(vpl.quantity * CASE
        WHEN vodf.order_type = 'tape' THEN oe.company_price
        ELSE (oe.company_price / 12)
    END), 0)::float8 as total_prod_value_company
FROM 
    delivery.v_packing_list_details vpl 
    LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
    LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
    AND oe.order_description_uuid = vodf.order_description_uuid 
WHERE 
    vpl.created_at between '2025-01-01'::TIMESTAMP and '2025-03-31'::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'
    AND vpl.item_for NOT IN ('thread', 'sample_thread')
    AND LOWER(vodf.end_type_name) NOT IN ('close end', 'open end')
GROUP BY
    vodf.party_name,
    vodf.marketing_name,
    vodf.order_number,
    vodf.is_bill,
    vodf.id
ORDER BY
    vodf.id asc;