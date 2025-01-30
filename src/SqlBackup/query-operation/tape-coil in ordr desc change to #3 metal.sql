
SELECT tape_coil_uuid FROM zipper.order_description WHERE uuid = 'ew9RfKRAPhO4cqe';

#3 Metal tape uuid -> hNglHy9HZHjyH3F;

# Set tape coil uuid to #3 metal tape
UPDATE zipper.order_description SET tape_coil_uuid = 'hNglHy9HZHjyH3F' WHERE uuid = 'ew9RfKRAPhO4cqe';
