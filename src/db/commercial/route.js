import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as bankOperations from "./query/bank.js";
import * as lcOperations from "./query/lc.js";
import * as piOperations from "./query/pi.js";
import * as piEntryOperations from "./query/pi_entry.js";

const commercialRouter = Router();

// bank routes
commercialRouter.get("/bank", bankOperations.selectAll);
commercialRouter.get("/bank/:uuid", validateUuidParam(), bankOperations.select);
commercialRouter.post("/bank", bankOperations.insert);
commercialRouter.put("/bank/:uuid", bankOperations.update);
commercialRouter.delete(
	"/bank/:uuid",
	validateUuidParam(),
	bankOperations.remove
);

// lc routes
commercialRouter.get("/lc", lcOperations.selectAll);
commercialRouter.get("/lc/:uuid", validateUuidParam(), lcOperations.select);
commercialRouter.post("/lc", lcOperations.insert);
commercialRouter.put("/lc/:uuid", lcOperations.update);
commercialRouter.delete("/lc/:uuid", validateUuidParam(), lcOperations.remove);

// pi routes
commercialRouter.get("/pi", piOperations.selectAll);
commercialRouter.get("/pi/:uuid", validateUuidParam(), piOperations.select);
commercialRouter.post("/pi", piOperations.insert);
commercialRouter.put("/pi/:uuid", piOperations.update);
commercialRouter.delete("/pi/:uuid", validateUuidParam(), piOperations.remove);

// pi_entry routes
commercialRouter.get("/pi-entry", piEntryOperations.selectAll);
commercialRouter.get(
	"/pi-entry/:uuid",
	validateUuidParam(),
	piEntryOperations.select
);
commercialRouter.post("/pi-entry", piEntryOperations.insert);
commercialRouter.put("/pi-entry/:uuid", piEntryOperations.update);
commercialRouter.delete(
	"/pi-entry/:uuid",
	validateUuidParam(),
	piEntryOperations.remove
);

export { commercialRouter };
