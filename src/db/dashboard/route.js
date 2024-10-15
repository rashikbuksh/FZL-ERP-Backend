import e, { Router } from 'express';
import * as challanRegistrationOperations from './query/challan_register.js';

const dashBoardRouter = Router();

//challan register routes

dashBoardRouter.get(
	'/challan-register',
	challanRegistrationOperations.selectChallanRegister
);

dashBoardRouter.get(
	'/goods-in-warehouse',
	challanRegistrationOperations.selectGoodsInWarehouse
);

const pathDashboard = {
	'/dashboard/challan-register': {
		get: {
			tags: ['Dashboard'],
			summary: 'Get challan register summary',
			description: 'Get challan register summary',
			parameters: [
				{
					name: 'start_date',
					in: 'query',
					required: false,
					description: 'Start date for the summary',
					schema: {
						type: 'string',
						format: 'date',
					},
				},
				{
					name: 'end_date',
					in: 'query',
					required: false,
					description: 'End date for the summary',
					schema: {
						type: 'string',
						format: 'date',
					},
				},
			],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							example: {
								item_name: {
									number_of_challan: 0,
									amount: 0,
								},
							},
						},
					},
				},
				500: {
					description: 'Internal server error',
					content: {
						'application/json': {
							example: {
								error: 'error message',
							},
						},
					},
				},
			},
		},
	},
};

export const pathDashboards = {
	...pathDashboard,
};

export const tagDashboards = [
	{
		name: 'Dashboard',
	},
];

export { dashBoardRouter };
