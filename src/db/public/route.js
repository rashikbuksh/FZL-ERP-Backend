import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as buyerOperations from "./query/buyer.js";
import * as factoryOperations from "./query/factory.js";
import * as marketingOperations from "./query/marketing.js";
import * as merchandiserOperations from "./query/merchandiser.js";
import * as partyOperations from "./query/party.js";
import * as propertiesOperations from "./query/properties.js";
import * as sectionOperations from "./query/section.js";

const publicBuyerRouter = Router();
const publicFactoryRouter = Router();
const publicMarketingRouter = Router();
const publicMerchandiserRouter = Router();
const publicPartyRouter = Router();
const publicPropertiesRouter = Router();
const publicSectionRouter = Router();

publicBuyerRouter.get("/buyer", buyerOperations.selectAll);
publicBuyerRouter.get(
	"/buyer/:uuid",
	validateUuidParam(),
	buyerOperations.select
);
publicBuyerRouter.post("/buyer", buyerOperations.insert);
publicBuyerRouter.put("/buyer/:uuid", buyerOperations.update);
publicBuyerRouter.delete(
	"/buyer/:uuid",
	validateUuidParam(),
	buyerOperations.remove
);

publicFactoryRouter.get("/factory", factoryOperations.selectAll);
publicFactoryRouter.get(
	"/factory/:uuid",
	validateUuidParam(),
	factoryOperations.select
);
publicFactoryRouter.post("/factory", factoryOperations.insert);
publicFactoryRouter.put("/factory/:uuid", factoryOperations.update);
publicFactoryRouter.delete(
	"/factory/:uuid",
	validateUuidParam(),
	factoryOperations.remove
);

publicMarketingRouter.get("/marketing", marketingOperations.selectAll);
publicMarketingRouter.get(
	"/marketing/:uuid",
	validateUuidParam(),
	marketingOperations.select
);
publicMarketingRouter.post("/marketing", marketingOperations.insert);
publicMarketingRouter.put("/marketing/:uuid", marketingOperations.update);
publicMarketingRouter.delete(
	"/marketing/:uuid",
	validateUuidParam(),
	marketingOperations.remove
);

publicMerchandiserRouter.get("/merchandiser", merchandiserOperations.selectAll);
publicMerchandiserRouter.get(
	"/merchandiser/:uuid",
	validateUuidParam(),
	merchandiserOperations.select
);
publicMerchandiserRouter.post("/merchandiser", merchandiserOperations.insert);
publicMerchandiserRouter.put(
	"/merchandiser/:uuid",
	merchandiserOperations.update
);
publicMerchandiserRouter.delete(
	"/merchandiser/:uuid",
	validateUuidParam(),
	merchandiserOperations.remove
);

publicPartyRouter.get("/party", partyOperations.selectAll);
publicPartyRouter.get(
	"/party/:uuid",
	validateUuidParam(),
	partyOperations.select
);
publicPartyRouter.post("/party", partyOperations.insert);
publicPartyRouter.put("/party/:uuid", partyOperations.update);
publicPartyRouter.delete(
	"/party/:uuid",
	validateUuidParam(),
	partyOperations.remove
);

publicPropertiesRouter.get("/properties", propertiesOperations.selectAll);
publicPropertiesRouter.get(
	"/properties/:uuid",
	validateUuidParam(),
	propertiesOperations.select
);
publicPropertiesRouter.post("/properties", propertiesOperations.insert);
publicPropertiesRouter.put("/properties/:uuid", propertiesOperations.update);
publicPropertiesRouter.delete(
	"/properties/:uuid",
	validateUuidParam(),
	propertiesOperations.remove
);

publicSectionRouter.get("/section", sectionOperations.selectAll);
publicSectionRouter.get(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.select
);
publicSectionRouter.post("/section", sectionOperations.insert);
publicSectionRouter.put("/section/:uuid", sectionOperations.update);
publicSectionRouter.delete(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.remove
);

export {
	publicBuyerRouter,
	publicFactoryRouter,
	publicMarketingRouter,
	publicMerchandiserRouter,
	publicPartyRouter,
	publicPropertiesRouter,
	publicSectionRouter,
};
