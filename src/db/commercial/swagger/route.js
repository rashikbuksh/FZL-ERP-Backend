import SE from '../../../util/swagger_example.js';

// * Commercial Bank * //
export const pathCommercialBank = {
	'/commercial/bank': {
		get: {
			tags: ['commercial.bank'],
			summary: 'Get all banks',
			description: 'All banks',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/bank'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['commercial.bank'],
			summary: 'Create a bank',
			description: 'Create a bank',
			requestBody: SE.requestBody_schema_ref('commercial/bank'),
			responses: {
				201: SE.response_schema_ref(201, 'commercial/bank'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},

	'/commercial/bank/{uuid}': {
		get: {
			tags: ['commercial.bank'],
			summary: 'Get a bank',
			description: ' Get a bank by uuid',
			//operationId: "getBankByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/bank'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.bank'],
			summary: 'Update a bank',
			description: 'Update a bank by uuid',
			//operationId: "updateBankByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/bank'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/bank'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		delete: {
			tags: ['commercial.bank'],
			summary: 'Delete a bank',
			description: 'Delete a bank by uuid',
			//operationId: "deleteBankByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Commercial LC * //

export const pathCommercialLc = {
	'/commercial/lc': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get all lcs',
			description: 'All lcs',
			parameters: [SE.parameter_query('own_uuid', 'own_uuid', SE.uuid())],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid('igD0v9DIJQhJeet'),
					pi_ids: SE.array(SE.string('PI24-0001')),
					id: SE.integer(1),
					file_number: SE.string('LC24-0001'),
					party_uuid: SE.uuid('igD0v9DIJQhJeet'),
					party_name: SE.string('ABC'),
					total_value: SE.number(12.3456),
					lc_number: SE.string('123456'),
					lc_date: SE.string('2021-12-12'),
					payment_value: SE.number(12.3456),
					payment_date: SE.date_time(),
					ldbc_fdc: SE.string('ldbc_fdc'),
					acceptance_date: SE.date_time(),
					maturity_date: SE.date_time(),
					commercial_executive: SE.string('commercial_executive'),
					party_bank: SE.string('party_bank'),
					production_complete: SE.integer(1),
					lc_cancel: SE.integer(1),
					handover_date: SE.date_time(),
					document_receive_date: SE.date_time(),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					at_sight: SE.string('at_sight'),
					amd_date: SE.date_time(),
					amd_count: SE.integer(1),
					problematical: SE.integer(1),
					epz: SE.integer(1),
					is_rtgs: SE.integer(1),
					is_old_pi: SE.integer(0),
					pi_number: SE.string('123456'),
					lc_value: SE.number(12.3456),
					created_by: SE.uuid('igD0v9DIJQhJeet'),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
		post: {
			tags: ['commercial.lc'],
			summary: 'Create a lc',
			description: 'Create a lc',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('commercial/lc'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},

	'/commercial/lc/{uuid}': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get a lc',
			description: ' Get a lc by uuid',
			//operationId: "getLcByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid('igD0v9DIJQhJeet'),
					pi_ids: SE.array(SE.string('PI24-0001')),
					id: SE.integer(1),
					file_number: SE.string('LC24-0001'),
					party_uuid: SE.uuid('igD0v9DIJQhJeet'),
					party_name: SE.string('ABC'),
					total_value: SE.number(12.3456),
					lc_number: SE.string('123456'),
					lc_date: SE.string('2021-12-12'),
					commercial_executive: SE.string('commercial_executive'),
					party_bank: SE.string('party_bank'),
					production_complete: SE.integer(1),
					lc_cancel: SE.integer(1),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					at_sight: SE.string('at_sight'),
					amd_date: SE.date_time(),
					amd_count: SE.integer(1),
					problematical: SE.integer(1),
					epz: SE.integer(1),
					is_rtgs: SE.integer(1),
					is_old_pi: SE.integer(0),
					pi_number: SE.string('123456'),
					lc_value: SE.number(12.3456),
					created_by: SE.uuid('igD0v9DIJQhJeet'),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.lc'],
			summary: 'Update a lc',
			description: 'Update a lc by uuid',
			//operationId: "updateLcByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/lc'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['commercial.lc'],
			summary: 'Delete a lc',
			description: 'Delete a lc by uuid',
			//operationId: "deleteLcByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-pi-cash/by/{lc_uuid}': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get a lc by lc_uuid',
			description: ' Get a lc by lc_uuid',
			//operationId: "getLcByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'lc_uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid('igD0v9DIJQhJeet'),
					pi_ids: SE.array(SE.uuid('igD0v9DIJQhJeet')),
					id: SE.integer(1),
					file_number: SE.string('LC24-0001'),
					party_uuid: SE.uuid(),
					party_name: SE.string('ABC'),
					total_value: SE.number(12.3456),
					lc_number: SE.number(123456),
					lc_date: SE.date_time(),
					commercial_executive: SE.string('John Doe'),
					party_bank: SE.string('Bangladesh Bank'),
					production_complete: SE.integer(1),
					lc_cancel: SE.integer(1),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					at_sight: SE.string('at_sight'),
					amd_date: SE.date_time(),
					amd_count: SE.integer(1),
					problematical: SE.integer(1),
					epz: SE.integer(1),
					is_rtgs: SE.integer(1),
					is_old_pi: SE.integer(0),
					pi_number: SE.string('123456'),
					lc_value: SE.number(12.3456),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
					lc_entry: SE.sub_response_schema({
						uuid: SE.uuid(),
						lc_uuid: SE.uuid(),
						ldbc_fdbc: SE.string('ldbc_fdc'),
						handover_date: SE.date_time(),
						document_receive_date: SE.date_time(),
						acceptance_date: SE.date_time(),
						maturity_date: SE.date_time(),
						payment_date: SE.date_time(),
						payment_value: SE.number(12.3456),
						amount: SE.number(12.3456),
						created_at: SE.date_time(),
						update_at: SE.date_time(),
						remarks: SE.string('remarks'),
					}),
					lc_entry_others: SE.sub_response_schema({
						uuid: SE.uuid(),
						lc_uuid: SE.uuid(),
						ud_no: SE.string('ud_no'),
						ud_received: SE.date_time(),
						up_number: SE.string('up_number'),
						up_number_updated_at: SE.date_time(),
						created_at: SE.date_time(),
						update_at: SE.date_time(),
						remarks: SE.string('remarks'),
					}),
					pi_cash: SE.sub_response_schema({
						uuid: SE.uuid(),
						id: SE.string('PI24-0001'),
						lc_uuid: SE.uuid(),
						lc_number: SE.number(123456),
						order_info_uuids: SE.array([SE.uuid()]),
						marketing_uuid: SE.uuid(),
						marketing_name: SE.string('marketing'),
						pi_ids: SE.array([SE.uuid()]),
						party_uuid: SE.uuid(),
						party_name: SE.string('party'),
						total_value: SE.number(12.3456),
						merchandiser_uuid: SE.uuid(),
						merchandiser_name: SE.string('merchandiser'),
						factory_uuid: SE.uuid(),
						factory_name: SE.string('ABC'),
						bank_uuid: SE.uuid(),
						bank_name: SE.string('Bangladesh Bank'),
						bank_swift_code: SE.string('BB'),
						bank_address: SE.string('address'),
						routing_no: SE.string('routing_no'),
						factory_address: SE.string('address'),
						validity: SE.date_time(),
						payment: SE.string('paid'),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						update_at: SE.date_time(),
						remarks: SE.string('remarks'),
					}),
				}),
			},
		},
	},
	'/commercial/lc/by/lc-number/{lc_number}': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get a lc by lc_number',
			description: ' Get a lc by lc_number',
			//operationId: "getLcByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'LC number to get data',
					'lc_number',
					'string',
					'77'
				),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid(),
					pi_ids: SE.array(SE.uuid()),
					id: SE.integer(1),
					file_number: SE.string('LC24-0001'),
					party_uuid: SE.uuid(),
					party_name: SE.string('ABC'),
					total_value: SE.number(12.3456),
					lc_number: SE.number(123456),
					lc_date: SE.date_time(),
					payment_value: SE.number(12.3456),
					payment_date: SE.date_time(),
					ldbc_fdc: SE.string('ldbc_fdc'),
					acceptance_date: SE.date_time(),
					maturity_date: SE.date_time(),
					commercial_executive: SE.string('John Doe'),
					party_bank: SE.string('Bangladesh Bank'),
					production_complete: SE.integer(1),
					lc_cancel: SE.integer(1),
					handover_date: SE.date_time(),
					document_receive_date: SE.date_time(),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					at_sight: SE.string('at_sight'),
					amd_date: SE.date_time(),
					amd_count: SE.integer(1),
					problematical: SE.integer(1),
					epz: SE.integer(1),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
			},
		},
	},
};

// * Commercial LC Entry * //

export const pathCommercialLcEntry = {
	'/commercial/lc-entry': {
		get: {
			tags: ['commercial.lc_entry'],
			summary: 'Get all lc entries',
			description: 'All lc entries',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['commercial.lc_entry'],
			summary: 'Create a lc entry',
			description: 'Create a lc entry',
			requestBody: SE.requestBody_schema_ref('commercial/lc_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry/{uuid}': {
		get: {
			tags: ['commercial.lc_entry'],
			summary: 'Get a lc entry',
			description: ' Get a lc entry by uuid',
			//operationId: "getLcEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.lc_entry'],
			summary: 'Update a lc entry',
			description: 'Update a lc entry by uuid',
			//operationId: "updateLcEntryByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/lc_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		delete: {
			tags: ['commercial.lc_entry'],
			summary: 'Delete a lc entry',
			description: 'Delete a lc entry by uuid',
			//operationId: "deleteLcEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry/by/{lc_uuid}': {
		get: {
			tags: ['commercial.lc_entry'],
			summary: 'Get a lc entry by lc_uuid',
			description: ' Get a lc entry by lc_uuid',
			//operationId: "getLcEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'lc_uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry/by/lc-number/{lc_number}': {
		get: {
			tags: ['commercial.lc_entry'],
			summary: 'Get a lc entry by lc_number',
			description: ' Get a lc entry by lc_number',
			//operationId: "getLcEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'lc_number',
					'string',
					'77'
				),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Commercial LC Entry Others * //

export const pathCommercialLcEntryOthers = {
	'/commercial/lc-entry-others': {
		get: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Get all lc entry others',
			description: 'All lc entry others',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Create a lc entry others',
			description: 'Create a lc entry others',
			requestBody: SE.requestBody_schema_ref(
				'commercial/lc_entry_others'
			),
			responses: {
				201: SE.response_schema_ref(201, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry-others/{uuid}': {
		get: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Get a lc entry others',
			description: ' Get a lc entry others by uuid',
			//operationId: "getLcEntryOthersByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Update a lc entry others',
			description: 'Update a lc entry others by uuid',
			//operationId: "updateLcEntryOthersByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref(
				'commercial/lc_entry_others'
			),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		delete: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Delete a lc entry others',
			description: 'Delete a lc entry others by uuid',
			//operationId: "deleteLcEntryOthersByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry-others/by/{lc_uuid}': {
		get: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Get a lc entry others by lc_uuid',
			description: ' Get a lc entry others by lc_uuid',
			//operationId: "getLcEntryOthersByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'lc_uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/lc-entry-others/by/lc-number/{lc_number}': {
		get: {
			tags: ['commercial.lc_entry_others'],
			summary: 'Get a lc entry others by lc_number',
			description: ' Get a lc entry others by lc_number',
			//operationId: "getLcEntryOthersByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'lc_number',
					'string',
					'77'
				),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/lc_entry_others'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Commercial Manual Pi * //

export const pathCommercialManualPi = {
	'/commercial/manual-pi': {
		get: {
			tags: ['commercial.manual_pi'],
			summary: 'Get all manual pis',
			description: 'All manual pis',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['commercial.manual_pi'],
			summary: 'Create a manual pi',
			description: 'Create a manual pi',
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash'),
			responses: {
				201: SE.response_schema_ref(201, 'commercial/pi_cash'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/manual-pi/{uuid}': {
		get: {
			tags: ['commercial.manual_pi'],
			summary: 'Get a manual pi',
			description: ' Get a manual pi by uuid',
			//operationId: "getManualPiByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.manual_pi'],
			summary: 'Update a manual pi',
			description: 'Update a manual pi by uuid',
			//operationId: "updateManualPiByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		delete: {
			tags: ['commercial.manual_pi'],
			summary: 'Delete a manual pi',
			description: 'Delete a manual pi by uuid',
			//operationId: "deleteManualPiByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/manual-pi/details/by/{manual_pi_uuid}': {
		get: {
			tags: ['commercial.manual_pi'],
			summary: 'Get a manual pi by manual_pi_uuid',
			description: ' Get a manual pi by manual_pi_uuid',
			//operationId: "getManualPiByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'manual_pi_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Commercial Manual Pi Entry * //

export const pathCommercialManualPiEntry = {
	'/commercial/manual-pi-entry': {
		get: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Get all manual pi entries',
			description: 'All manual pi entries',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		post: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Create a manual pi entry',
			description: 'Create a manual pi entry',
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash_entry'),
			responses: {
				201: SE.response_schema_ref(201, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/manual-pi-entry/{uuid}': {
		get: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Get a manual pi entry',
			description: ' Get a manual pi entry by uuid',
			//operationId: "getManualPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Update a manual pi entry',
			description: 'Update a manual pi entry by uuid',
			//operationId: "updateManualPiEntryByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		delete: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Delete a manual pi entry',
			description: 'Delete a manual pi entry by uuid',
			//operationId: "deleteManualPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/manual-pi-entry/by/{manual_pi_uuid}': {
		get: {
			tags: ['commercial.manual_pi_entry'],
			summary: 'Get a manual pi entry by manual_pi_uuid',
			description: ' Get a manual pi entry by manual_pi_uuid',
			//operationId: "getManualPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'manual_pi_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

// * Commercial Pi* //

export const pathCommercialPiCash = {
	'/commercial/pi-cash': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get all pis',
			description: 'All pis',
			parameters: [
				SE.parameter_query('is_cash', 'is_cash', 'false'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid(),
					id: SE.integer(1),
					lc_uuid: SE.uuid(),
					lc_number: SE.number(123456),
					order_info_uuids: SE.array([SE.uuid()]),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('marketing'),
					party_uuid: SE.uuid(),
					party_name: SE.string('party'),
					party_address: SE.string('address'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('merchandiser'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('ABC'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bangladesh Bank'),
					bank_swift_code: SE.string('BB'),
					bank_address: SE.string('address'),
					routing_no: SE.string('routing_no'),
					factory_address: SE.string('address'),
					validity: SE.date_time(),
					payment: SE.string('paid'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
					is_pi: SE.integer(0),
					is_rtgs: SE.boolean(false),
					conversion_rate: SE.number(1000.0),
					weight: SE.number(1000.0),
					receive_amount: SE.number(1000.0),
				}),
			},
		},
		post: {
			tags: ['commercial.pi_cash'],
			summary: 'Create a pi cash',
			description: 'Create a pi cash',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				405: SE.response(405),
			},
		},
	},

	'/commercial/pi-cash/{uuid}': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get a pi',
			description: ' Get a pi cash by uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.pi_cash'],
			summary: 'Update a pi cash',
			description: 'Update a pi cash by uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['commercial.pi_cash'],
			summary: 'Delete a pi cash',
			description: 'Delete a pi cash by uuid',
			//operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash/details/{pi_cash_uuid}': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get a pi details by pi_cash_uuid',
			description: ' Get a pi cash details by pi_cash_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'pi_cash_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid(),
					id: SE.string('PI24-0001'),
					lc_uuid: SE.uuid(),
					lc_number: SE.number(123456),
					order_info_uuids: SE.array([SE.uuid()]),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('marketing'),
					party_uuid: SE.uuid(),
					party_name: SE.string('party'),
					party_address: SE.string('address'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('merchandiser'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('ABC'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bangladesh Bank'),
					bank_swift_code: SE.string('BB'),
					bank_address: SE.string('address'),
					routing_no: SE.string('routing_no'),
					factory_address: SE.string('address'),
					validity: SE.date_time(),
					payment: SE.string('paid'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
					is_pi: SE.integer(0),
					is_rtgs: SE.boolean(false),
					conversion_rate: SE.number(1000.0),
					weight: SE.number(1000.0),
					receive_amount: SE.number(1000.0),
					pi_cash_entry: SE.sub_response_schema({
						uuid: SE.uuid(),
						pi_cash_uuid: SE.uuid(),
						pi_cash_number: SE.string('PI24-0001'),
						pi_cash_date: SE.date_time(),
						amount: SE.number(123456),
						created_by: SE.uuid(),
						created_by_name: SE.string('John Doe'),
						created_at: SE.date_time(),
						update_at: SE.date_time(),
						remarks: SE.string('remarks'),
					}),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash-lc-uuid/{pi_cash_uuid}': {
		put: {
			tags: ['commercial.pi_cash'],
			summary: 'Update a pi cash put lc',
			description: 'Update a pi cash put lc by pi_uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Update data using uuid',
					'pi_cash_uuid',
					'uuid'
				),
			],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/commercial/pi-cash-lc-null/{pi_cash_uuid}': {
		put: {
			tags: ['commercial.pi_cash'],
			summary: 'Update a pi cash put lc to null',
			description: 'Update a pi cash put lc to null by pi_uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Update data using uuid',
					'pi_cash_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
	'/commercial/pi-cash-lc/{lc_uuid}': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get a pi by lc_uuid',
			description: ' Get a pi cash by lc_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'lc_uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid(),
					id: SE.string('PI24-0001'),
					lc_uuid: SE.uuid(),
					lc_number: SE.number(123456),
					order_info_uuids: SE.array([SE.uuid()]),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('marketing'),
					party_uuid: SE.uuid(),
					party_name: SE.string('party'),
					party_address: SE.string('address'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('merchandiser'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('ABC'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bangladesh Bank'),
					bank_swift_code: SE.string('BB'),
					bank_address: SE.string('address'),
					routing_no: SE.string('routing_no'),
					factory_address: SE.string('address'),
					validity: SE.date_time(),
					payment: SE.string('paid'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
					is_pi: SE.integer(0),
					is_rtgs: SE.boolean(false),
					conversion_rate: SE.number(1000.0),
					weight: SE.number(1000.0),
					receive_amount: SE.number(1000.0),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash-uuid/{pi_cash_id}': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get a pi cash by pi_cash_id',
			description: ' Get a pi cash by pi_cash_id',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Pi to get',
					'pi_cash_id',
					'string',
					'PI24-0001'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
				}),
			},
		},
	},
	'/commercial/pi-cash/details/by/pi-cash-id/{pi_cash_id}': {
		get: {
			tags: ['commercial.pi_cash'],
			summary: 'Get a pi cash details by pi_cash_id',
			description: ' Get a pi cash details by pi_cash_id',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Pi to get',
					'pi_cash_id',
					'string',
					'PI24-0001'
				),
			],
			responses: {
				200: SE.response_schema('200', {
					uuid: SE.uuid(),
					id: SE.string('PI24-0001'),
					lc_uuid: SE.uuid(),
					lc_number: SE.number(123456),
					order_info_uuids: SE.array([SE.uuid()]),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('marketing'),
					party_uuid: SE.uuid(),
					party_name: SE.string('party'),
					party_address: SE.string('address'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('merchandiser'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('ABC'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bangladesh Bank'),
					bank_swift_code: SE.string('BB'),
					bank_address: SE.string('address'),
					routing_no: SE.string('routing_no'),
					factory_address: SE.string('address'),
					validity: SE.date_time(),
					payment: SE.string('paid'),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
					is_pi: SE.integer(0),
					is_rtgs: SE.boolean(false),
					conversion_rate: SE.number(1000.0),
					weight: SE.number(1000.0),
					receive_amount: SE.number(1000.0),
				}),
			},
		},
	},
	'/commercial/pi-cash-update-is-completed/{pi_cash_uuid}': {
		put: {
			tags: ['commercial.pi_cash'],
			summary: 'Update a pi cash to completed',
			description: 'Update a pi cash to completed by pi_uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Update data using uuid',
					'pi_cash_uuid',
					'uuid'
				),
			],
			requestBody: SE.requestBody({
				is_completed: SE.boolean(false),
				updated_at: SE.date_time(),
			}),
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
	},
};

// * Commercial Pi_Entry* //

export const pathCommercialPiCashEntry = {
	'/commercial/pi-cash-entry': {
		get: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Get all pi_cash_entries',
			description: 'All pi_cash_entries',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
			},
		},
		post: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Create a pi_cash_entry',
			description: 'Create a pi_cash_entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				405: SE.response(405),
			},
		},
	},

	'/commercial/pi-cash-entry/{uuid}': {
		get: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Get a pi_cash_entry',
			description: ' Get a pi_cash_entry by uuid',
			//operationId: "getPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Update a pi_cash_entry',
			description: 'Update a pi_cash_entry by uuid',
			//operationId: "updatePiEntryByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/pi_cash_entry'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/pi_cash_entry'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Delete a pi_cash_entry',
			description: 'Delete a pi_cash_entry by uuid',
			//operationId: "deletePiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash-entry/by/{pi_cash_uuid}': {
		get: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Get a pi_cash_entry by pi_cash_uuid',
			description: ' Get a pi_cash_entry by pi_cash_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'pi_cash_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					pi_cash_uuid: SE.uuid(),
					pi_number: SE.number(123456),
					pi_date: SE.date_time(),
					amount: SE.number(12.3456),
					created_by: SE.uuid(),
					created_by_name: SE.string('John Doe'),
					created_at: SE.date_time(),
					update_at: SE.date_time(),
					remarks: SE.string('remarks'),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash-entry/details/by/{order_info_uuid}': {
		get: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Get a pi_cash_entry by order_info_uuid',
			description: ' Get a pi_cash_entry by order_info_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'order_info_uuid',
					'uuid'
				),
				SE.parameter_query('is_update', 'is_update', ['false', 'true']),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('NM-8-OE-RP'),
					style: SE.string('St-1'),
					color: SE.string('Red'),
					size: SE.number(10),
					quantity: SE.number(100),
					given_pi_cash_quantity: SE.number(100),
					max_quantity: SE.number(100),
					pi_cash_quantity: SE.number(100),
					is_checked: SE.boolean(true),
				}),
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi-cash-entry/thread-details/by/{order_info_uuid}': {
		get: {
			tags: ['commercial.pi_cash_entry'],
			summary: 'Get a pi_cash_entry by order_info_uuid',
			description: ' Get a pi_cash_entry by order_info_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params(
					'Get data using uuid',
					'order_info_uuid',
					'uuid'
				),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					sfg_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z24-0001'),
					item_description: SE.string('NM-8-OE-RP'),
					style: SE.string('St-1'),
					color: SE.string('Red'),
					size: SE.number(10),
					quantity: SE.number(100),
					given_pi_cash_quantity: SE.number(100),
					max_quantity: SE.number(100),
					pi_cash_quantity: SE.number(100),
					is_checked: SE.boolean(true),
				}),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
	'/commercial/pi-cash/details/by/order-info-ids/{order_info_uuids}/{marketing_uuid}/{party_uuid}':
		{
			get: {
				tags: ['commercial.pi_cash_entry'],
				summary: 'Get a pi_cash_entry by order_info_uuids',
				description: ' Get a pi_cash_entry by order_info_uuids',
				//operationId: "getPet",
				produces: ['application/json'],
				parameters: [
					SE.parameter_params(
						'Get data using uuid',
						'order_info_uuids',
						'uuid'
					),
					SE.parameter_params(
						'Get data using uuid',
						'party_uuid',
						'uuid'
					),
					SE.parameter_params(
						'Get data using uuid',
						'marketing_uuid',
						'uuid'
					),
					SE.parameter_query('is_update', 'is_update', [
						'false',
						'true',
					]),
				],
				responses: {
					200: SE.response_schema(200, {
						uuid: SE.uuid(),
						sfg_uuid: SE.uuid(),
						order_info_uuid: SE.uuid(),
						order_number: SE.string('Z24-0001'),
						item_description: SE.string('NM-8-OE-RP'),
						style: SE.string('St-1'),
						color: SE.string('Red'),
						size: SE.number(10),
						quantity: SE.number(100),
						given_pi_cash_quantity: SE.number(100),
						max_quantity: SE.number(100),
						pi_cash_quantity: SE.number(100),
						balance_quantity: SE.number(100),
						is_checked: SE.boolean(true),
						is_thread_order: SE.boolean(false),
					}),
					400: SE.response(400),
					404: SE.response(404),
				},
			},
		},
	'/commercial/pi-cash/thread-details/by/order-info-ids/{order_info_uuids}/{party_uuid}/{marketing_uuid}':
		{
			get: {
				tags: ['commercial.pi_cash_entry'],
				summary: 'Get a pi_cash_entry by order_info_uuids',
				description: ' Get a pi_cash_entry by order_info_uuids',
				//operationId: "getPet",
				produces: ['application/json'],
				parameters: [
					SE.parameter_params(
						'Get data using uuid',
						'order_info_uuids',
						'uuid',
						'zN6v0dRLd4VRvmX'
					),
					SE.parameter_params(
						'Get data using uuid',
						'party_uuid',
						'uuid',
						'cf-daf86b3eedf1'
					),
					SE.parameter_params(
						'Get data using uuid',
						'marketing_uuid',
						'uuid',
						'j14NcevenyrWSei'
					),
				],
				responses: {
					200: SE.response_schema(200, {
						uuid: SE.uuid(),
						thread_order_entry_uuid: SE.uuid(),
						order_number: SE.string('TO24-0001'),
						style: SE.string('style 1'),
						color: SE.string('Red'),
						size: SE.number(10),
						quantity: SE.number(100),
						given_pi_cash_quantity: SE.number(100),
						max_quantity: SE.number(100),
						pi_cash_quantity: SE.number(100),
						balance_quantity: SE.number(100),
						is_checked: SE.boolean(true),
						is_thread_order: SE.boolean(true),
					}),
					400: SE.response(400),
					404: SE.response(404),
				},
			},
		},
};
export const pathCommercialCashReceive = {
	'/commercial/cash-receive': {
		get: {
			tags: ['commercial.cash_receive'],
			summary: 'Get all cash receives',
			description: 'All cash receives',
			responses: {
				200: SE.response_schema_ref(200, 'commercial/cash_receive'),
			},
		},
		post: {
			tags: ['commercial.cash_receive'],
			summary: 'Create a cash receive',
			description: 'Create a cash receive',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: SE.requestBody_schema_ref('commercial/cash_receive'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/cash_receive'),
				405: SE.response(405),
			},
		},
	},

	'/commercial/cash-receive/{uuid}': {
		get: {
			tags: ['commercial.cash_receive'],
			summary: 'Get a cash receive',
			description: ' Get a cash receive by uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Get data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response_schema_ref(200, 'commercial/cash_receive'),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
		put: {
			tags: ['commercial.cash_receive'],
			summary: 'Update a cash receive',
			description: 'Update a cash receive by uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Update data using uuid', 'uuid', 'uuid'),
			],
			requestBody: SE.requestBody_schema_ref('commercial/cash_receive'),
			responses: {
				200: SE.response_schema_ref(200, 'commercial/cash_receive'),
				400: SE.response(400),
				404: SE.response(404),
				405: SE.response(405),
			},
		},
		delete: {
			tags: ['commercial.cash_receive'],
			summary: 'Delete a cash receive',
			description: 'Delete a cash receive by uuid',
			//operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				SE.parameter_params('Delete data using uuid', 'uuid', 'uuid'),
			],
			responses: {
				200: SE.response(200),
				400: SE.response(400),
				404: SE.response(404),
			},
		},
	},
};

export const pathCommercial = {
	...pathCommercialBank,
	...pathCommercialLc,
	...pathCommercialLcEntry,
	...pathCommercialLcEntryOthers,
	...pathCommercialPiCash,
	...pathCommercialPiCashEntry,
	...pathCommercialManualPi,
	...pathCommercialManualPiEntry,
	...pathCommercialCashReceive,
};
