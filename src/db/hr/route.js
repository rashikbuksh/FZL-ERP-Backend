/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        name:
 *          type: string
 *          description: Full name of the user
 *        email:
 *          type: string
 *          description: Email of the user
 *        password:
 *          type: string
 *          description: Password of the user
 *      example:
 *        name: John Doe
 *        email: jogndoe@gmail.com
 *        password: password
 *    Department:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the department
 *      example:
 *        name: HR
 *    Designation:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the designation
 *      example:
 *        name: Manager
 *    Response:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 */

import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as departmentOperations from "./query/department.js";
import * as designationOperations from "./query/designation.js";
import * as userOperations from "./query/users.js";

const hrRouter = Router();

// user routes
hrRouter.get("/user", userOperations.selectAll);
hrRouter.get("/user/:uuid", validateUuidParam(), userOperations.select);
hrRouter.post("/user", userOperations.insert);
hrRouter.put("/user/:uuid", userOperations.update);
hrRouter.delete("/user/:uuid", validateUuidParam(), userOperations.remove);

// department routes
hrRouter.get("/department", departmentOperations.selectAll);
hrRouter.get(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.select
);
hrRouter.post("/department", departmentOperations.insert);
hrRouter.put("/department/:uuid", departmentOperations.update);
hrRouter.delete(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.remove
);

// designation routes
hrRouter.get("/designation", designationOperations.selectAll);
hrRouter.get(
	"/designation/:uuid",
	validateUuidParam(),
	designationOperations.select
);
hrRouter.post("/designation", designationOperations.insert);
hrRouter.put("/designation/:uuid", designationOperations.update);
hrRouter.delete(
	"/designation/:uuid",
	validateUuidParam(),
	designationOperations.remove
);

export { hrRouter };
