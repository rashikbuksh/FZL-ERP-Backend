import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as bankOperations from "./query/bank.js";
import * as lcOperations from "./query/lc.js";
import * as piOperations from "./query/pi.js";
import * as piEntryOperations from "./query/pi_entry.js";

const commercialBankRouter = Router();
const commercialLcRouter = Router();
const commercialPiRouter = Router();
const commercialPiEntryRouter = Router();

commercialBankRouter.get("/bank", bankOperations.selectAll);
commercialBankRouter.get(
	"/bank/:uuid",
	validateUuidParam(),
	bankOperations.select
);
commercialBankRouter.post("/bank", bankOperations.insert);
commercialBankRouter.put("/bank/:uuid", bankOperations.update);
commercialBankRouter.delete(
	"/bank/:uuid",
	validateUuidParam(),
	bankOperations.remove
);

commercialLcRouter.get("/lc", lcOperations.selectAll);
commercialLcRouter.get("/lc/:uuid", validateUuidParam(), lcOperations.select);
commercialLcRouter.post("/lc", lcOperations.insert);
commercialLcRouter.put("/lc/:uuid", lcOperations.update);
commercialLcRouter.delete(
	"/lc/:uuid",
	validateUuidParam(),
	lcOperations.remove
);

commercialPiRouter.get("/pi", piOperations.selectAll);
commercialPiRouter.get("/pi/:uuid", validateUuidParam(), piOperations.select);
commercialPiRouter.post("/pi", piOperations.insert);
commercialPiRouter.put("/pi/:uuid", piOperations.update);
commercialPiRouter.delete(
	"/pi/:uuid",
	validateUuidParam(),
	piOperations.remove
);

commercialPiEntryRouter.get("/pi_entry", piEntryOperations.selectAll);
commercialPiEntryRouter.get(
	"/pi_entry/:uuid",
	validateUuidParam(),
	piEntryOperations.select
);
commercialPiEntryRouter.post("/pi_entry", piEntryOperations.insert);
commercialPiEntryRouter.put("/pi_entry/:uuid", piEntryOperations.update);
commercialPiEntryRouter.delete(
	"/pi_entry/:uuid",
	validateUuidParam(),
	piEntryOperations.remove
);

export {
	commercialBankRouter,
	commercialLcRouter,
	commercialPiEntryRouter,
	commercialPiRouter,
};
