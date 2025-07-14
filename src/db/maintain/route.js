import { Router } from 'express';
import * as issueOperations from './query/issue.js';
import * as issueProcurementOperations from './query/issue_procurement.js';
import * as sectionMachineOperations from './query/section_machine.js';
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
maintainRouter.delete(
	'/issue/:uuid',
	issueOperations.remove
);

// issue_procurement routes

maintainRouter.get(
	'/issue-procurement',
	issueProcurementOperations.selectAll
);
maintainRouter.get(
	'/issue-procurement/:uuid',
	issueProcurementOperations.select
);
maintainRouter.post(
	'/issue-procurement',
	issueProcurementOperations.insert
);
maintainRouter.put(
	'/issue-procurement/:uuid',
	issueProcurementOperations.update
);
maintainRouter.delete(
	'/issue-procurement/:uuid',
	issueProcurementOperations.remove
);

export { maintainRouter };
