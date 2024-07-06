import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as infoOperations from "./query/info.js";
import * as recipeOperations from "./query/recipe.js";
import * as recipeEntryOperations from "./query/recipe_entry.js";

const labDipInfoRouter = Router();
const labDipRecipeRouter = Router();
const labDipRecipeEntryRouter = Router();

labDipInfoRouter.get("/info", infoOperations.selectAll);
labDipInfoRouter.get("/info/:uuid", validateUuidParam(), infoOperations.select);
labDipInfoRouter.post("/info", infoOperations.insert);
labDipInfoRouter.put("/info/:uuid", infoOperations.update);
labDipInfoRouter.delete(
	"/info/:uuid",
	validateUuidParam(),
	infoOperations.remove
);

labDipRecipeRouter.get("/recipe", recipeOperations.selectAll);
labDipRecipeRouter.get(
	"/recipe/:uuid",
	validateUuidParam(),
	recipeOperations.select
);
labDipRecipeRouter.post("/recipe", recipeOperations.insert);
labDipRecipeRouter.put("/recipe/:uuid", recipeOperations.update);
labDipRecipeRouter.delete(
	"/recipe/:uuid",
	validateUuidParam(),
	recipeOperations.remove
);

labDipRecipeEntryRouter.get("/recipe_entry", recipeEntryOperations.selectAll);
labDipRecipeEntryRouter.get(
	"/recipe_entry/:uuid",
	validateUuidParam(),
	recipeEntryOperations.select
);
labDipRecipeEntryRouter.post("/recipe_entry", recipeEntryOperations.insert);
labDipRecipeEntryRouter.put(
	"/recipe_entry/:uuid",
	recipeEntryOperations.update
);
labDipRecipeEntryRouter.delete(
	"/recipe_entry/:uuid",
	validateUuidParam(),
	recipeEntryOperations.remove
);

export { labDipInfoRouter, labDipRecipeEntryRouter, labDipRecipeRouter };
