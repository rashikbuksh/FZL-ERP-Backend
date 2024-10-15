import { Router } from 'express';

import SE, { SED } from '../../util/swagger_example.js';
import { marketing } from '../public/schema.js';
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

// * LCReport
reportRouter.get('/lc-report', reportOperations.LCReport);

// * Thread Batch Wise Report
reportRouter.get(
	'/thread-production-batch-wise-report',
	reportOperations.threadProductionStatusBatchWise
);

// * Production Report Director

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
	'/report/lc-report': {
		get: {
			summary: 'LCReport',
			description: 'LCReport',
			tags: ['report'],
			operationId: 'LCReport',
			parameters: [
				SE.parameter_query('document_receiving', 'document_receiving', [
					true,
					false,
				]),
				SE.parameter_query('acceptance', 'acceptance', [true, false]),
				SE.parameter_query('maturity', 'maturity', [true, false]),
				SE.parameter_query('payment', 'payment', [true, false]),
			],
			responses: {
				200: SE.response_schema(200, {
					file_number: SE.string('LC24-0001'),
					uuid: SE.uuid(),
					lc_number: SE.number(610),
					lc_date: SE.date_time(),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					payment_value: SE.number(101555),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					commercial_executive: SE.string('Commercial Executive'),
					handover_date: SE.date_time(),
					document_receive_date: SE.date_time(),
					acceptance_date: SE.date_time(),
					maturity_date: SE.date_time(),
					payment_date: SE.date_time(),
					ldbc_fdbc: SE.string('LDBC/FDBC'),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					ud_no: SE.string('UD No'),
					ud_received: SE.string('UD Received'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('Marketing Name'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bank Name'),
					party_bank: SE.string('Party Bank'),
				}),
			},
		},
	},
	'/report/thread-production-batch-wise-report': {
		get: {
			summary: 'Thread Batch Wise Report',
			description: 'Thread Batch Wise Report',
			tags: ['report'],
			operationId: 'threadProductionStatusBatchWise',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					batch_number: SE.string('Batch Number'),
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
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
