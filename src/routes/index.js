/**
 * @swagger
 * '/hr/user':
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

import express from "express";
import { commercialRouter } from "../db/commercial/route.js";
import { deliveryRouter } from "../db/delivery/route.js";
import { hrRouter } from "../db/hr/route.js";
import { labDipRouter } from "../db/lab_dip/route.js";
import { materialRouter } from "../db/material/route.js";
import { publicRouter } from "../db/public/route.js";
import { purchaseRouter } from "../db/purchase/route.js";
import { zipperRouter } from "../db/zipper/route.js";

const route = express.Router();

// All the routes are defined here

// use the /hr route and /delivery route as reference, change the routes accordingly, also in query folder, then test with postman

// TODO: Add your routes here
// FIXME: Add your routes here
// NOTE: Add your routes here
// INFO: Add your routes here
// WARNING: Add your routes here
// REVIEW: Add your routes here

// commercial routes
route.use("/commercial", commercialRouter);

// delivery routes
route.use("/delivery", deliveryRouter);

// hr routes
route.use("/hr", hrRouter);

// lab dip routes
route.use("/lab-dip", labDipRouter);

// material routes
route.use("/material", materialRouter);

// public routes
route.use("/public", publicRouter);

// purchase routes
route.use("/purchase", purchaseRouter);

// zipper routes
route.use("/zipper", zipperRouter);

export { route };
