import { Router } from 'express';
import * as buyerOperations from './query/buyer.js';
import * as factoryOperations from './query/factory.js';
import * as machineOperations from './query/machine.js';
import * as marketingOperations from './query/marketing.js';
import * as merchandiserOperations from './query/merchandiser.js';
import * as partyOperations from './query/party.js';
import * as propertiesOperations from './query/properties.js';
import * as sectionOperations from './query/section.js';
import * as marketingTeamOperations from './query/marketing_team.js';
import * as marketingTeamMemberTargetOperations from './query/marketing_team_member_target.js';
import * as marketingTeamEntryOperations from './query/marketing_team_entry.js';
import * as productionCapacityOperations from './query/production_capacity.js';

import apicache from 'apicache';

const cache = apicache.middleware;

// Enable debugging for apicache
apicache.options({
	debug: true,
});

const publicRouter = Router();

// Route to fetch buyers with caching and a custom cache key
publicRouter.get('/buyer', cache('2 minutes'), buyerOperations.selectAll);
publicRouter.get('/buyer/:uuid', buyerOperations.select);

publicRouter.post('/buyer', async (req, res, next) => {
	try {
		await buyerOperations.insert(req, res, next);
		apicache.clear('/public/buyer'); // Clear the cache for /buyer
	} catch (error) {
		next(error);
	}
});
publicRouter.put('/buyer/:uuid', async (req, res, next) => {
	try {
		await buyerOperations.update(req, res, next);
		apicache.clear('/public/buyer'); // Clear the cache for /buyer
	} catch (error) {
		next(error);
	}
});
publicRouter.delete('/buyer/:uuid', async (req, res, next) => {
	try {
		await buyerOperations.remove(req, res, next);
		apicache.clear('/public/buyer'); // Clear the cache for /buyer
	} catch (error) {
		next(error);
	}
});

// factory routes
publicRouter.get('/factory', factoryOperations.selectAll);
publicRouter.get(
	'/factory/:uuid',

	factoryOperations.select
);
publicRouter.post('/factory', factoryOperations.insert);
publicRouter.put('/factory/:uuid', factoryOperations.update);
publicRouter.delete(
	'/factory/:uuid',

	factoryOperations.remove
);

// marketing routes
publicRouter.get('/marketing', marketingOperations.selectAll);
publicRouter.get(
	'/marketing/:uuid',

	marketingOperations.select
);
publicRouter.post('/marketing', marketingOperations.insert);
publicRouter.put('/marketing/:uuid', marketingOperations.update);
publicRouter.delete(
	'/marketing/:uuid',

	marketingOperations.remove
);

// merchandiser routes
publicRouter.get('/merchandiser', merchandiserOperations.selectAll);
publicRouter.get(
	'/merchandiser/:uuid',

	merchandiserOperations.select
);
publicRouter.post('/merchandiser', merchandiserOperations.insert);
publicRouter.put('/merchandiser/:uuid', merchandiserOperations.update);
publicRouter.delete(
	'/merchandiser/:uuid',

	merchandiserOperations.remove
);

// party routes
publicRouter.get('/party', partyOperations.selectAll);
publicRouter.get('/party/:uuid', partyOperations.select);
publicRouter.post('/party', partyOperations.insert);
publicRouter.put('/party/:uuid', partyOperations.update);
publicRouter.delete(
	'/party/:uuid',

	partyOperations.remove
);

// properties routes
publicRouter.get('/properties', propertiesOperations.selectAll);
publicRouter.get(
	'/properties/:uuid',

	propertiesOperations.select
);
publicRouter.post('/properties', propertiesOperations.insert);
publicRouter.put('/properties/:uuid', propertiesOperations.update);
publicRouter.delete(
	'/properties/:uuid',

	propertiesOperations.remove
);

// section routes
publicRouter.get('/section', sectionOperations.selectAll);
publicRouter.get(
	'/section/:uuid',

	sectionOperations.select
);
publicRouter.post('/section', sectionOperations.insert);
publicRouter.put('/section/:uuid', sectionOperations.update);
publicRouter.delete(
	'/section/:uuid',

	sectionOperations.remove
);

// machine routes
publicRouter.get('/machine', machineOperations.selectAll);
publicRouter.get('/machine/:uuid', machineOperations.select);
publicRouter.post('/machine', machineOperations.insert);
publicRouter.put('/machine/:uuid', machineOperations.update);
publicRouter.delete('/machine/:uuid', machineOperations.remove);
publicRouter.get('/machine/by/:date', machineOperations.selectByDate);

// marketing_team routes
publicRouter.get('/marketing-team', marketingTeamOperations.selectAll);
publicRouter.get('/marketing-team/:uuid', marketingTeamOperations.select);
publicRouter.post('/marketing-team', marketingTeamOperations.insert);
publicRouter.put('/marketing-team/:uuid', marketingTeamOperations.update);
publicRouter.delete('/marketing-team/:uuid', marketingTeamOperations.remove);
publicRouter.get(
	'/marketing-team-details/by/marketing-team-uuid/:marketing_team_uuid',
	marketingTeamOperations.selectMarketingTeamDetailsByMarketingTeamUuid
);

// marketing_team_member_target routes
publicRouter.get(
	'/marketing-team-member-target',
	marketingTeamMemberTargetOperations.selectAll
);
publicRouter.get(
	'/marketing-team-member-target/:uuid',
	marketingTeamMemberTargetOperations.select
);
publicRouter.post(
	'/marketing-team-member-target',
	marketingTeamMemberTargetOperations.insert
);
publicRouter.put(
	'/marketing-team-member-target/:uuid',
	marketingTeamMemberTargetOperations.update
);
publicRouter.delete(
	'/marketing-team-member-target/:uuid',
	marketingTeamMemberTargetOperations.remove
);

// marketing_team_entry routes
publicRouter.get(
	'/marketing-team-entry',
	marketingTeamEntryOperations.selectAll
);
publicRouter.get(
	'/marketing-team-entry/:uuid',
	marketingTeamEntryOperations.select
);
publicRouter.post('/marketing-team-entry', marketingTeamEntryOperations.insert);
publicRouter.put(
	'/marketing-team-entry/:uuid',
	marketingTeamEntryOperations.update
);
publicRouter.delete(
	'/marketing-team-entry/:uuid',
	marketingTeamEntryOperations.remove
);
publicRouter.get(
	'/marketing-team-entry/by/:marketing_team_uuid',
	marketingTeamEntryOperations.selectAllByMarketingTeamUuid
);

// production_capacity routes

publicRouter.get(
	'/production-capacity',
	productionCapacityOperations.selectAll
);
publicRouter.get(
	'/production-capacity/:uuid',
	productionCapacityOperations.select
);
publicRouter.post('/production-capacity', productionCapacityOperations.insert);
publicRouter.put(
	'/production-capacity/:uuid',
	productionCapacityOperations.update
);
publicRouter.delete(
	'/production-capacity/:uuid',
	productionCapacityOperations.remove
);

export { publicRouter };
