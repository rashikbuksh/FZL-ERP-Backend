SELECT * FROM slider.transaction WHERE to_section = 'trx_to_finishing';

SELECT * FROM zipper.finishing_batch_production WHERE section = 'finishing';

-- make a combined query too update finishing batch and order description to restore slider_finishing_stock 

--  updated slider_finishing_stock from slider.transaction using stock_uuid which connects with zipper.finishing_batch 

-- summation of trx_quantity from slider.transaction to update zipper.finishing_batch.slider_finishing_stock

UPDATE zipper.finishing_batch fb
SET slider_finishing_stock = subquery.total_trx_quantity
FROM (
    SELECT 
        ss.finishing_batch_uuid,
        SUM(st.trx_quantity) AS total_trx_quantity
    FROM 
        slider.transaction st
    LEFT JOIN 
        slider.stock ss ON st.stock_uuid = ss.uuid
    WHERE to_section = 'trx_to_finishing'
    GROUP BY 
        ss.finishing_batch_uuid
) subquery
WHERE 
    fb.uuid = subquery.finishing_batch_uuid;

UPDATE zipper.order_description od
SET slider_finishing_stock = subquery.total_trx_quantity
FROM (
    SELECT 
        fb.order_description_uuid,
        SUM(st.trx_quantity) AS total_trx_quantity
    FROM 
        slider.transaction st
    LEFT JOIN 
        slider.stock ss ON st.stock_uuid = ss.uuid
    LEFT JOIN 
        zipper.finishing_batch fb ON ss.finishing_batch_uuid = fb.uuid
    WHERE to_section = 'trx_to_finishing'
    GROUP BY 
        fb.order_description_uuid
) subquery
WHERE 
    od.uuid = subquery.order_description_uuid;

-- update zipper.finishing_batch_production to restore the reduced slider_finishing_stock

UPDATE zipper.finishing_batch
SET slider_finishing_stock = slider_finishing_stock - subquery.total_trx_quantity
FROM (
    SELECT 
        fbe.finishing_batch_uuid,
        SUM(fbp.production_quantity) AS total_trx_quantity
    FROM 
        zipper.finishing_batch_production fbp
    LEFT JOIN 
        zipper.finishing_batch_entry fbe ON fbp.finishing_batch_entry_uuid = fbe.uuid
    WHERE section = 'finishing'
    GROUP BY 
        fbe.finishing_batch_uuid
) subquery
WHERE 
    zipper.finishing_batch.uuid = subquery.finishing_batch_uuid;


UPDATE zipper.order_description
SET slider_finishing_stock = slider_finishing_stock - subquery.total_trx_quantity
FROM (
    SELECT 
        fb.order_description_uuid,
        SUM(fbp.production_quantity) AS total_trx_quantity
    FROM 
        zipper.finishing_batch_production fbp
    LEFT JOIN 
        zipper.finishing_batch_entry fbe ON fbp.finishing_batch_entry_uuid = fbe.uuid
    LEFT JOIN
        zipper.finishing_batch fb ON fbe.finishing_batch_uuid = fb.uuid
    WHERE section = 'finishing'
    GROUP BY 
        fb.order_description_uuid
) subquery
WHERE 
    zipper.order_description.uuid = subquery.order_description_uuid;


