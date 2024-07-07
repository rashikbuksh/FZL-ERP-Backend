import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as infoOperations from "./query/info.js";
import * as recipeOperations from "./query/recipe.js";
import * as recipeEntryOperations from "./query/recipe_entry.js";

const labDipRouter = Router();

// info routes
labDipRouter.get("/info", infoOperations.selectAll);
labDipRouter.get("/info/:uuid", validateUuidParam(), infoOperations.select);
labDipRouter.post("/info", infoOperations.insert);
labDipRouter.put("/info/:uuid", infoOperations.update);
labDipRouter.delete("/info/:uuid", validateUuidParam(), infoOperations.remove);

// recipe routes
labDipRouter.get("/recipe", recipeOperations.selectAll);
labDipRouter.get("/recipe/:uuid", validateUuidParam(), recipeOperations.select);
labDipRouter.post("/recipe", recipeOperations.insert);
labDipRouter.put("/recipe/:uuid", recipeOperations.update);
labDipRouter.delete(
	"/recipe/:uuid",
	validateUuidParam(),
	recipeOperations.remove
);

// recipe_entry routes
labDipRouter.get("/recipe_entry", recipeEntryOperations.selectAll);
labDipRouter.get(
	"/recipe_entry/:uuid",
	validateUuidParam(),
	recipeEntryOperations.select
);
labDipRouter.post("/recipe_entry", recipeEntryOperations.insert);
labDipRouter.put("/recipe_entry/:uuid", recipeEntryOperations.update);
labDipRouter.delete(
	"/recipe_entry/:uuid",
	validateUuidParam(),
	recipeEntryOperations.remove
);

export { labDipRouter };
