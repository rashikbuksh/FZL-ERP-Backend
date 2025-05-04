CREATE OR REPLACE FUNCTION commercial.refresh_v_pi_cash()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW commercial.v_pi_cash;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_v_pi_cash_trigger
AFTER INSERT OR UPDATE OR DELETE
ON commercial.pi_cash
FOR EACH STATEMENT
EXECUTE FUNCTION commercial.refresh_v_pi_cash();