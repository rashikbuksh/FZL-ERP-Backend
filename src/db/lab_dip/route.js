import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as infoOperations from './query/info.js';
import * as infoEntryOperations from './query/info_entry.js';
import * as recipeOperations from './query/recipe.js';
import * as recipeEntryOperations from './query/recipe_entry.js';
import * as recipeEntryLogOperations from './query/recipe_entry_log.js';

const labDipRouter = Router();

// info routes

labDipRouter.get('/info', infoOperations.selectAll);
labDipRouter.get('/info/:uuid', infoOperations.select);
labDipRouter.post('/info', infoOperations.insert);
labDipRouter.put('/info/:uuid', infoOperations.update);
labDipRouter.delete('/info/:uuid', infoOperations.remove);
labDipRouter.get(
	'/info/details/:lab_dip_info_uuid',
	infoOperations.selectInfoRecipeByLabDipInfoUuid
);
labDipRouter.get(
	'/info-recipe-dashboard',
	infoOperations.infoRecipeWithOrderDashboard
);

// info_entry routes

labDipRouter.get('/info-entry', infoEntryOperations.selectAll);
labDipRouter.get('/info-entry/:uuid', infoEntryOperations.select);
labDipRouter.post('/info-entry', infoEntryOperations.insert);
labDipRouter.put('/info-entry/:uuid', infoEntryOperations.update);
labDipRouter.delete('/info-entry/:uuid', infoEntryOperations.remove);

// recipe routes

labDipRouter.get('/recipe', recipeOperations.selectAll);
labDipRouter.get('/recipe/:uuid', recipeOperations.select);
labDipRouter.post('/recipe', recipeOperations.insert);
labDipRouter.put('/recipe/:uuid', recipeOperations.update);
labDipRouter.delete('/recipe/:uuid', recipeOperations.remove);
labDipRouter.get(
	'/recipe/details/:recipe_uuid',
	recipeOperations.selectRecipeDetailsByRecipeUuid
);
labDipRouter.get(
	'/info-recipe/by/:lab_dip_info_uuid',
	recipeOperations.selectRecipeByLabDipInfoUuid
);
labDipRouter.put(
	'/update-recipe/by/:recipe_uuid',
	recipeOperations.updateRecipeByLabDipInfoUuid
);
labDipRouter.put(
	'/update-recipe/remove-lab-dip-info-uuid/by/:recipe_uuid',
	recipeOperations.updateRecipeWhenRemoveLabDipInfoUuid
);

// recipe_entry routes

labDipRouter.get('/recipe-entry', recipeEntryOperations.selectAll);
labDipRouter.get(
	'/recipe-entry/:uuid',
	validateUuidParam(),
	recipeEntryOperations.select
);
labDipRouter.post('/recipe-entry', recipeEntryOperations.insert);
labDipRouter.put('/recipe-entry/:uuid', recipeEntryOperations.update);
labDipRouter.delete(
	'/recipe-entry/:uuid',
	validateUuidParam(),
	recipeEntryOperations.remove
);
labDipRouter.get(
	'/recipe-entry/by/:recipe_uuid',
	recipeEntryOperations.selectRecipeEntryByRecipeUuid
);

// recipe_entry_log routes
labDipRouter.get('/recipe-entry-log', recipeEntryLogOperations.selectAll);
labDipRouter.get(
	'/recipe-entry-log/:uuid',
	validateUuidParam(),
	recipeEntryLogOperations.select
);
labDipRouter.post('/recipe-entry-log', recipeEntryLogOperations.insert);
labDipRouter.put(
	'/recipe-entry-log/:uuid',
	validateUuidParam(),
	recipeEntryLogOperations.update
);
labDipRouter.delete(
	'/recipe-entry-log/:uuid',
	validateUuidParam(),
	recipeEntryLogOperations.remove
);

export { labDipRouter };
