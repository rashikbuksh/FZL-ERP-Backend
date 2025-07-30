import { Router } from 'express';
import * as globalAuditLogOperations from './query/global_audit_log.js';

const auditRouter = Router();

// Global Audit Log routes
auditRouter.get('/global-audit-log', globalAuditLogOperations.selectAll);
auditRouter.get('/global-audit-log/:id', globalAuditLogOperations.select);
auditRouter.get(
	'/global-audit-log/record-history/:schema_name/:table_name/:record_id',
	globalAuditLogOperations.getRecordHistory
);
auditRouter.get('/audit-stats', globalAuditLogOperations.getAuditStats);
auditRouter.get('/recent-activity', globalAuditLogOperations.getRecentActivity);
auditRouter.get('/search', globalAuditLogOperations.searchAuditLogs);
auditRouter.get('/schema-names', globalAuditLogOperations.getAllSchemaNames);
auditRouter.get('/table-names', globalAuditLogOperations.getAllTableNames);

// Admin operations
auditRouter.post(
	'/toggle-logging',
	globalAuditLogOperations.toggleAuditLogging
);
auditRouter.post('/cleanup-old-logs', globalAuditLogOperations.cleanupOldLogs);

export { auditRouter };
export default auditRouter;
