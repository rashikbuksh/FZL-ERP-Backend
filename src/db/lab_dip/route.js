import { request, Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as infoOperations from './query/info.js';
import * as recipeOperations from './query/recipe.js';
import * as recipeEntryOperations from './query/recipe_entry.js';
import * as shadeRecipeOperations from './query/shade_recipe.js';
import * as shadeRecipeEntryOperations from './query/shade_recipe_entry.js';

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

// recipe routes

labDipRouter.get('/recipe', recipeOperations.selectAll);
labDipRouter.get('/recipe/:uuid', recipeOperations.select);
labDipRouter.post('/recipe', recipeOperations.insert);
labDipRouter.put('/recipe/:uuid', recipeOperations.update);
labDipRouter.delete(
	'/recipe/:uuid',
	recipeOperations.remove
);
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

// shade recipe routes

labDipRouter.get('/shade-recipe', shadeRecipeOperations.selectAll);
labDipRouter.get('/shade-recipe/:uuid', shadeRecipeOperations.select);
labDipRouter.post('/shade-recipe', shadeRecipeOperations.insert);
labDipRouter.put('/shade-recipe/:uuid', shadeRecipeOperations.update);
labDipRouter.delete('/shade-recipe/:uuid', shadeRecipeOperations.remove);
labDipRouter.get(
	'/shade-recipe-details/by/:shade_recipe_uuid',
	shadeRecipeOperations.selectShadeRecipeDetailsByShadeRecipeUuid
);

// shade recipe entry routes

labDipRouter.get('/shade-recipe-entry', shadeRecipeEntryOperations.selectAll);
labDipRouter.get(
	'/shade-recipe-entry/:uuid',
	validateUuidParam(),
	shadeRecipeEntryOperations.select
);
labDipRouter.post('/shade-recipe-entry', shadeRecipeEntryOperations.insert);
labDipRouter.put(
	'/shade-recipe-entry/:uuid',
	shadeRecipeEntryOperations.update
);
labDipRouter.delete(
	'/shade-recipe-entry/:uuid',
	validateUuidParam(),
	shadeRecipeEntryOperations.remove
);
labDipRouter.get(
	'/shade-recipe-entry/by/:shade_recipe_uuid',
	shadeRecipeEntryOperations.selectShadeRecipeEntryByShadeRecipeUuid
);

export { labDipRouter };
