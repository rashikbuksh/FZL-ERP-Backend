CREATE OR REPLACE FUNCTION order_entry_log_after_zipper_order_entry_update_funct() RETURNS TRIGGER AS $$

BEGIN 
     INSERT INTO zipper.order_entry_log (uuid, order_entry_uuid, style, color, size, quantity, company_price, party_price, created_by, created_at)
        VALUES (NEW.uuid, NEW.uuid, NEW.style, NEW.color, NEW.size, NEW.quantity, NEW.company_price, NEW.party_price, NEW.created_by, NEW.created_at);
    

