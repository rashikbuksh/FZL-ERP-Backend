SELECT *
FROM delivery.packing_list
WHERE
    order_info_uuid = 'mffYjEcgjkqMV2L';

UPDATE delivery.packing_list
SET
    is_deleted = true,
    deleted_time = NOW(),
    deleted_by = 'igD0v9DIJQhJeet'
WHERE
    order_info_uuid = 'mffYjEcgjkqMV2L'
    AND is_deleted = false;