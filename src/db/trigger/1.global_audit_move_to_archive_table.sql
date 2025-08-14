------ * Move Old Audit Logs to Archive Table * ------

CREATE OR REPLACE FUNCTION audit.move_old_audit_logs()
RETURNS void AS $$
BEGIN
  INSERT INTO audit.global_audit_archive_log
    SELECT * FROM audit.global_audit_log
    WHERE changed_at < NOW() - INTERVAL '15 days';

  DELETE FROM audit.global_audit_log
    WHERE changed_at < NOW() - INTERVAL '15 days';
END;
$$ LANGUAGE plpgsql;

SELECT audit.move_old_audit_logs();