import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';

import * as otherOperations from './query/query.js';

const otherRouter = Router();

otherRouter.get('/party/value/label', otherOperations.selectParty);
otherRouter.get(
	'/marketing-user/value/label',
	otherOperations.selectMarketingUser
);

export const pathOthers = {
	'/other/marketing-user/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all marketing users',
			description: 'All marketing users',
			operationId: 'getAllMarketingUsers',
			responses: {
				200: {
					description: 'Returns a all marketing user.',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/party/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all parties',
			description: 'All parties',
			operationId: 'getAllParties',
			responses: {
				200: {
					description: 'Returns a all parties.',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									value: { type: 'string' },
									label: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	},
};

export const tagOthers = [
	{
		name: 'others',
	},
];

export { otherRouter };
