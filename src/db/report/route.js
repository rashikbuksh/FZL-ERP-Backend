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

// * Pi Register Report
reportRouter.get('/pi-register-report', reportOperations.PiRegister);

// * Pi To Be Register Report
reportRouter.get('/pi-to-be-register-report', reportOperations.PiToBeRegister);

// * Pi To Be Register Report Thread
reportRouter.get(
	'/pi-to-be-register-report-thread',
	reportOperations.PiToBeRegisterThread
);

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
	'/report/pi-register-report': {
		get: {
			summary: 'Pi Register Report',
			description: 'Pi Register Report',
			tags: ['report'],
			operationId: 'PiRegister',
			parameters: [],
			responses: {
				200: {
					description: 'Pi Register Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('PiRegister'),
							},
						},
					},
				},
			},
		},
	},
	'/report/pi-to-be-register-report': {
		get: {
			summary: 'Pi To Be Register Report',
			description: 'Pi To Be Register Report',
			tags: ['report'],
			operationId: 'PiToBeRegister',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/pi-to-be-register-report-thread': {
		get: {
			summary: 'Pi To Be Register Report Thread',
			description: 'Pi To Be Register Report Thread',
			tags: ['report'],
			operationId: 'PiToBeRegisterThread',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
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
