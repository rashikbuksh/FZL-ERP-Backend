import { Router } from 'express';
import * as machineProblemOperations from './query/machine_problem.js';
import * as machineProblemProcurementOperations from './query/machine_problem_procurement.js';
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

// machine_problem routes

maintainRouter.get('/machine-problem', machineProblemOperations.selectAll);
maintainRouter.get('/machine-problem/:uuid', machineProblemOperations.select);
maintainRouter.post('/machine-problem', machineProblemOperations.insert);
maintainRouter.put('/machine-problem/:uuid', machineProblemOperations.update);
maintainRouter.delete(
	'/machine-problem/:uuid',
	machineProblemOperations.remove
);

// machine_problem_procurement routes

maintainRouter.get(
	'/machine-problem-procurement',
	machineProblemProcurementOperations.selectAll
);
maintainRouter.get(
	'/machine-problem-procurement/:uuid',
	machineProblemProcurementOperations.select
);
maintainRouter.post(
	'/machine-problem-procurement',
	machineProblemProcurementOperations.insert
);
maintainRouter.put(
	'/machine-problem-procurement/:uuid',
	machineProblemProcurementOperations.update
);
maintainRouter.delete(
	'/machine-problem-procurement/:uuid',
	machineProblemProcurementOperations.remove
);

export { maintainRouter };
