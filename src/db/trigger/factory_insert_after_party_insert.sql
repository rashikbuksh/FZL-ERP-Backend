-- Step 1: Create the function
CREATE OR REPLACE FUNCTION factory_insert_after_party_insert_funct()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.factory (uuid, party_uuid, name, address, created_at, created_by, remarks)
    VALUES (NEW.uuid, NEW.uuid, NEW.name, NEW.address, NEW.created_at, NEW.created_by, NEW.remarks);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger
CREATE OR REPLACE TRIGGER factory_insert_after_party_insert
AFTER INSERT ON public.party
FOR EACH ROW
EXECUTE FUNCTION factory_insert_after_party_insert_funct();