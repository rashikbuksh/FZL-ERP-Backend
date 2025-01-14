-- Dyed Tape Transfer using query
-- TAPE transferred FROM backend (Dyed Tape to order without entry to dyed_tape)
UPDATE zipper.order_description SET tape_transferred = 1 WHERE uuid = 'a6a4SznRRILsy15';

