import { Router } from 'express';
import * as issueOperations from './query/issue.js';
import * as issueProcurementOperations from './query/issue_procurement.js';
import * as sectionMachineOperations from './query/section_machine.js';
import * as maintenanceDashboardOperations from './query/maintenance_dashboard.js';
import * as utilityOperations from './query/utility.js';
import * as utilityEntryOperations from './query/utility_entry.js';
const maintainRouter = Router();

// info routes

maintainRouter.get('/section-machine', sectionMachineOperations.selectAll);
maintainRouter.get('/section-machine/:uuid', sectionMachineOperations.select);
maintainRouter.post('/section-machine', sectionMachineOperations.insert);
maintainRouter.put('/section-machine/:uuid', sectionMachineOperations.update);
maintainRouter.delete(
	'/section-machine/:uuid',
	sectionMachineOperations.remove
);

// issue routes

maintainRouter.get('/issue', issueOperations.selectAll);
maintainRouter.get('/issue/:uuid', issueOperations.select);
maintainRouter.post('/issue', issueOperations.insert);
maintainRouter.put('/issue/:uuid', issueOperations.update);
maintainRouter.delete('/issue/:uuid', issueOperations.remove);

// issue_procurement routes

maintainRouter.get('/issue-procurement', issueProcurementOperations.selectAll);
maintainRouter.get(
	'/issue-procurement/:uuid',
	issueProcurementOperations.select
);
maintainRouter.post('/issue-procurement', issueProcurementOperations.insert);
maintainRouter.put(
	'/issue-procurement/:uuid',
	issueProcurementOperations.update
);
maintainRouter.delete(
	'/issue-procurement/:uuid',
	issueProcurementOperations.remove
);
maintainRouter.get(
	'/issue-procurement/by/:issue_uuid',
	issueProcurementOperations.selectByIssueUuid
);

// dashboard routes
maintainRouter.get(
	'/maintenance/dashboard',
	maintenanceDashboardOperations.maintenanceDashboard
);

// * utility routes

maintainRouter.get('/utility', utilityOperations.selectAll);
maintainRouter.get('/utility/:uuid', utilityOperations.select);
maintainRouter.post('/utility', utilityOperations.insert);
maintainRouter.put('/utility/:uuid', utilityOperations.update);
maintainRouter.delete('/utility/:uuid', utilityOperations.remove);

// * utility_entry routes
maintainRouter.get('/utility-entry', utilityEntryOperations.selectAll);
maintainRouter.get('/utility-entry/:uuid', utilityEntryOperations.select);
maintainRouter.post('/utility-entry', utilityEntryOperations.insert);
maintainRouter.put('/utility-entry/:uuid', utilityEntryOperations.update);
maintainRouter.delete('/utility-entry/:uuid', utilityEntryOperations.remove);

export { maintainRouter };
