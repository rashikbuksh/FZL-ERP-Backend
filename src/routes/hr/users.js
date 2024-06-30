import { insert, remove, select, selectAll, update } from "@/db/hr/users";
import { validateUuidParam } from "@/lib/validator";
import { Router } from "express";

const hrUserRouter = Router();

hrUserRouter.get("/user", selectAll);
hrUserRouter.get("/user/:uuid", validateUuidParam(), select);
hrUserRouter.post("/user", insert);
hrUserRouter.put("/user/:uuid", update);
hrUserRouter.delete("/user/:uuid", validateUuidParam(), remove);

export default hrUserRouter;
