import { Router } from 'express';

import SE, { SED } from '../../util/swagger_example.js';
import * as reportOperations from './query/query.js';

const reportRouter = Router();

// * Zipper Production Status Report
reportRouter.get(
	'/zipper-production-status-report',
	reportOperations.zipperProductionStatusReport
);

// * Daily Challan Report
reportRouter.get('/daily-challan-report', reportOperations.dailyChallanReport);

export const pathReport = {
	'/report/zipper-production-status-report': {
		get: {
			summary: 'Zipper Production Status Report',
			description: 'Zipper Production Status Report',
			tags: ['report'],
			operationId: 'zipperProductionStatusReport',
			parameters: [],
			responses: {
				200: {
					description: 'Zipper Production Status Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('zipperProductionStatusReport'),
							},
						},
					},
				},
			},
		},
	},
	'/report/daily-challan-report': {
		get: {
			summary: 'Daily Challan Report',
			description: 'Daily Challan Report',
			tags: ['report'],
			operationId: 'dailyChallanReport',
			parameters: [],
			responses: {
				200: {
					description: 'Daily Challan Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('dailyChallanReport'),
							},
						},
					},
				},
			},
		},
	},
};

export const tagReport = [
	{
		name: 'report',
		description: 'Report Operations',
	},
];

export { reportRouter };
