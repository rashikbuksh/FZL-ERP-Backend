import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as departmentOperations from "./query/department.js";
import * as designationOperations from "./query/designation.js";
import * as userOperations from "./query/users.js";

const hrRouter = Router();

// user routes

/**
 * @swagger
 * db:
 *   user:
 *     schema:
 *       type: object
 *       required:
 *         - uuid
 *         - name
 *         - email
 *         - pass
 *         - designation_uuid
 *         - can_access
 *         - ext
 *         - phone
 *         - created_at
 *         - updated_at
 *       properties:
 *         uuid:
 *           type: uuid
 *         name:
 *          type: string
 *         email:
 *          type: string
 *         pass:
 *          type: string
 *         designation_uuid:
 *          type: uuid
 *         can_access:
 *          type: string
 *         ext:
 *          type: string
 *         phone:
 *          type: string
 *         created_at:
 *          type: string
 *         updated_at:
 *          type: string
 *         status:
 *          type: integer
 * 
 * '/hr/user':
 *   get:
 *     summary: get all users
 *     description: my hosted api docs
 *     responses:
 *      '200':
 *         description: OK
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 thing:
 *                   $ref: 'src/db/hr/schema.js'
 *   post:
 *     summary: create new user
 *     description: my hosted api docs
 *     requestBody:
 *       required: true
 *       content:
 *         'application/json':
 *            schema:
 *              $ref: 'src/db/hr/schema.js'
 *     responses:
 *      '200':
 *         description: OK
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 thing:
 *                   $ref: 'src/db/hr/schema.js'
 * 
 * '/hr/user/{uuid}':
 *  get:
 *     summary: get user by uuid
 *     description: my hosted api docs
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         description: user uuid
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 thing:
 *                   $ref: 'src/db/hr/schema.js'
 *      
 */
hrRouter.get("/user", userOperations.selectAll);
hrRouter.get("/user/:uuid", validateUuidParam(), userOperations.select);
hrRouter.post("/user", userOperations.insert);
hrRouter.put("/user/:uuid", userOperations.update);
hrRouter.delete("/user/:uuid", validateUuidParam(), userOperations.remove);

// department routes

/**
 * @swagger
 * department:
 *     schema:
 *       type: object
 *       required:
 *         - uuid
 *         - department
 *       properties:
 *         uuid:
 *           type: uuid
 *         department:
 *           type: string
 *
 * '/hr/department':
 *   get:
 *     description: my hosted api docs
 *     summary: api docs
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 thing:
 *                   $ref: 'src/db/hr/schema.js'
 *
 */
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
