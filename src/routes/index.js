import express from 'express';
import { commercialRouter } from '../db/commercial/route.js';
import { dashBoardRouter } from '../db/dashboard/route.js';
import { deliveryRouter } from '../db/delivery/route.js';
import { hrRouter } from '../db/hr/route.js';
import { labDipRouter } from '../db/lab_dip/route.js';
import { materialRouter } from '../db/material/route.js';
import { otherRouter } from '../db/others/route.js';
import { publicRouter } from '../db/public/route.js';
import { purchaseRouter } from '../db/purchase/route.js';
import { reportRouter } from '../db/report/route.js';
import { sliderRouter } from '../db/slider/route.js';
import { threadRouter } from '../db/thread/route.js';
import { threadRouterV2 } from '../db/thread/routev2.js';
import { zipperRouter } from '../db/zipper/route.js';
import { zipperRouterV2 } from '../db/zipper/routev2.js';
import { maintainRouter } from '../db/maintain/route.js';

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
route.use('/commercial', commercialRouter);

// delivery routes
route.use('/delivery', deliveryRouter);

// hr routes
route.use('/hr', hrRouter);

// lab dip routes
route.use('/lab-dip', labDipRouter);

// material routes
route.use('/material', materialRouter);

// maintain routes
route.use('/maintain', maintainRouter);

// public routes
route.use('/public', publicRouter);

// purchase routes
route.use('/purchase', purchaseRouter);

// zipper routes
route.use('/zipper', zipperRouter);

// * zipper routes v2
route.use('/v2/zipper', zipperRouterV2);

// slider routes
route.use('/slider', sliderRouter);

// other routes
route.use('/other', otherRouter);

// thread routes
route.use('/thread', threadRouter);

route.use('/v2/thread', threadRouterV2);

//* report routes
route.use('/report', reportRouter);

// dashboard routes
route.use('/dashboard', dashBoardRouter);

export default route;
