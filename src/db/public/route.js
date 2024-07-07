import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as buyerOperations from "./query/buyer.js";
import * as factoryOperations from "./query/factory.js";
import * as marketingOperations from "./query/marketing.js";
import * as merchandiserOperations from "./query/merchandiser.js";
import * as partyOperations from "./query/party.js";
import * as propertiesOperations from "./query/properties.js";
import * as sectionOperations from "./query/section.js";

const publicRouter = Router();

// buyer routes
publicRouter.get("/buyer", buyerOperations.selectAll);
publicRouter.get("/buyer/:uuid", validateUuidParam(), buyerOperations.select);
publicRouter.post("/buyer", buyerOperations.insert);
publicRouter.put("/buyer/:uuid", buyerOperations.update);
publicRouter.delete(
	"/buyer/:uuid",
	validateUuidParam(),
	buyerOperations.remove
);

// factory routes
publicRouter.get("/factory", factoryOperations.selectAll);
publicRouter.get(
	"/factory/:uuid",
	validateUuidParam(),
	factoryOperations.select
);
publicRouter.post("/factory", factoryOperations.insert);
publicRouter.put("/factory/:uuid", factoryOperations.update);
publicRouter.delete(
	"/factory/:uuid",
	validateUuidParam(),
	factoryOperations.remove
);

// marketing routes
publicRouter.get("/marketing", marketingOperations.selectAll);
publicRouter.get(
	"/marketing/:uuid",
	validateUuidParam(),
	marketingOperations.select
);
publicRouter.post("/marketing", marketingOperations.insert);
publicRouter.put("/marketing/:uuid", marketingOperations.update);
publicRouter.delete(
	"/marketing/:uuid",
	validateUuidParam(),
	marketingOperations.remove
);

// merchandiser routes
publicRouter.get("/merchandiser", merchandiserOperations.selectAll);
publicRouter.get(
	"/merchandiser/:uuid",
	validateUuidParam(),
	merchandiserOperations.select
);
publicRouter.post("/merchandiser", merchandiserOperations.insert);
publicRouter.put("/merchandiser/:uuid", merchandiserOperations.update);
publicRouter.delete(
	"/merchandiser/:uuid",
	validateUuidParam(),
	merchandiserOperations.remove
);

// party routes
publicRouter.get("/party", partyOperations.selectAll);
publicRouter.get("/party/:uuid", validateUuidParam(), partyOperations.select);
publicRouter.post("/party", partyOperations.insert);
publicRouter.put("/party/:uuid", partyOperations.update);
publicRouter.delete(
	"/party/:uuid",
	validateUuidParam(),
	partyOperations.remove
);

// properties routes
publicRouter.get("/properties", propertiesOperations.selectAll);
publicRouter.get(
	"/properties/:uuid",
	validateUuidParam(),
	propertiesOperations.select
);
publicRouter.post("/properties", propertiesOperations.insert);
publicRouter.put("/properties/:uuid", propertiesOperations.update);
publicRouter.delete(
	"/properties/:uuid",
	validateUuidParam(),
	propertiesOperations.remove
);

// section routes
publicRouter.get("/section", sectionOperations.selectAll);
publicRouter.get(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.select
);
publicRouter.post("/section", sectionOperations.insert);
publicRouter.put("/section/:uuid", sectionOperations.update);
publicRouter.delete(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.remove
);

export { publicRouter };
