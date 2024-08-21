// * Commercial Bank * //
export const pathCommercialBank = {
	'/commercial/bank': {
		get: {
			tags: ['commercial.bank'],
			summary: 'Get all banks',
			description: 'All banks',
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/commercial/bank',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['commercial.bank'],
			summary: 'Create a bank',
			description: 'Create a bank',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/bank',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},

				405: {
					description: 'Invalid input',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: "Bank's uuid",
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/bank',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Bank not found',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'bank to update',
					required: true,
					type: 'string',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/bank',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/bank',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Bank not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.bank'],
			summary: 'Delete a bank',
			description: 'Delete a bank by uuid',
			//operationId: "deleteBankByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: "Bank's uuid",
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/bank',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Bank not found',
				},
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
			responses: {
				200: {
					description: 'Returns a all lcs',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pi_ids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'PI24-0001',
										},
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'ABC',
									},
									total_value: {
										type: 'number',
										example: 12.3456,
									},
									file_no: {
										type: 'string',
										example: '123456',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									lc_date: {
										type: 'string',
										example: '2021-12-12',
									},
									payment_value: {
										type: 'number',
										example: 12.3456,
									},
									payment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ldbc_fdc: {
										type: 'string',
										example: 'ldbc_fdc',
									},
									acceptance_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									maturity_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									commercial_executive: {
										type: 'string',
										example: 'commercial_executive',
									},
									party_bank: {
										type: 'string',
										example: 'party_bank',
									},
									production_complete: {
										type: 'integer',
										example: 1,
									},
									lc_cancel: {
										type: 'integer',
										example: 1,
									},
									handover_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									shipment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									expiry_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ud_no: {
										type: 'string',
										example: 'ud_no',
									},
									ud_received: {
										type: 'string',
										example: 'ud_received',
									},
									at_sight: {
										type: 'string',
										example: 'at_sight',
									},
									amd_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									amd_count: {
										type: 'integer',
										example: 1,
									},
									problematical: {
										type: 'integer',
										example: 1,
									},
									epz: {
										type: 'integer',
										example: 1,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'Manager',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['commercial.lc'],
			summary: 'Create a lc',
			description: 'Create a lc',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/lc',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/lc',
						},
					},
				},

				405: {
					description: 'Invalid input',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'Lc to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/lc',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lc not found',
				},
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
				{
					name: 'uuid',
					in: 'path',
					description: 'lc to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/lc',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/lc',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lc not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.lc'],
			summary: 'Delete a lc',
			description: 'Delete a lc by uuid',
			//operationId: "deleteLcByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Lc to delete',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/lc',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Lc not found',
				},
			},
		},
	},
	'/commercial/lc-pi/by/{lc_uuid}': {
		get: {
			tags: ['commercial.lc'],
			summary: 'Get a lc by lc_uuid',
			description: ' Get a lc by lc_uuid',
			//operationId: "getLcByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'lc_uuid',
					in: 'path',
					description: 'Lc to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pi_ids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'PI24-0001',
										},
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'ABC',
									},
									total_value: {
										type: 'number',
										example: 12.3456,
									},
									file_no: {
										type: 'string',
										example: '123456',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									lc_date: {
										type: 'string',
										example: '2021-12-12',
									},
									payment_value: {
										type: 'number',
										example: 12.3456,
									},
									payment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ldbc_fdc: {
										type: 'string',
										example: 'ldbc_fdc',
									},
									acceptance_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									maturity_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									commercial_executive: {
										type: 'string',
										example: 'commercial_executive',
									},
									party_bank: {
										type: 'string',
										example: 'party_bank',
									},
									production_complete: {
										type: 'integer',
										example: 1,
									},
									lc_cancel: {
										type: 'integer',
										example: 1,
									},
									handover_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									shipment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									expiry_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ud_no: {
										type: 'string',
										example: 'ud_no',
									},
									ud_received: {
										type: 'string',
										example: 'ud_received',
									},
									at_sight: {
										type: 'string',
										example: 'at_sight',
									},
									amd_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									amd_count: {
										type: 'integer',
										example: 1,
									},
									problematical: {
										type: 'integer',
										example: 1,
									},
									epz: {
										type: 'integer',
										example: 1,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
									pi: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												id: {
													type: 'string',
													example: 'PI24-0001',
												},
												lc_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												lc_number: {
													type: 'string',
													example: '123456',
												},
												order_info_uuids: {
													type: 'array',
													items: {
														type: 'string',
														example:
															'igD0v9DIJQhJeet',
													},
												},
												marketing_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												marketing_name: {
													type: 'string',
													example: 'marketing',
												},
												pi_ids: {
													type: 'array',
													items: {
														type: 'string',
														example: 'PI24-0001',
													},
												},
												party_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												party_name: {
													type: 'string',
													example: 'ABC',
												},
												total_value: {
													type: 'number',
													example: 12.3456,
												},
												merchandiser_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												merchandiser_name: {
													type: 'string',
													example: 'merchandiser',
												},
												factory_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												factory_name: {
													type: 'string',
													example: 'ABC',
												},
												bank_uuid: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												bank_name: {
													type: 'string',
													example: 'Bangladesh Bank',
												},
												bank_swift_code: {
													type: 'string',
													example: 'BB',
												},
												bank_address: {
													type: 'string',
													example: 'address',
												},
												factory_address: {
													type: 'string',
													example: 'address',
												},
												validity: {
													type: 'string',
													example: '2021-12-12',
												},
												payment: {
													type: 'string',
													example: 'paid',
												},
												created_by: {
													type: 'string',
													example: 'igD0v9DIJQhJeet',
												},
												created_by_name: {
													type: 'string',
													example: 'John Doe',
												},
												created_at: {
													type: 'string',
													format: 'date-time',
													example:
														'2024-01-01 00:00:00',
												},
												update_at: {
													type: 'string',
													format: 'date-time',
													example:
														'2024-01-01 00:00:00',
												},
												remarks: {
													type: 'string',
													example: 'remarks',
												},
											},
										},
									},
								},
							},
						},
					},
				},
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
				{
					name: 'lc_number',
					in: 'path',
					description: 'Lc to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: '123456',
				},
			],

			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pi_ids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'PI24-0001',
										},
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'ABC',
									},
									total_value: {
										type: 'number',
										example: 12.3456,
									},
									file_no: {
										type: 'string',
										example: '123456',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									lc_date: {
										type: 'string',
										example: '2021-12-12',
									},
									payment_value: {
										type: 'number',
										example: 12.3456,
									},
									payment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ldbc_fdc: {
										type: 'string',
										example: 'ldbc_fdc',
									},
									acceptance_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									maturity_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									commercial_executive: {
										type: 'string',
										example: 'commercial_executive',
									},
									party_bank: {
										type: 'string',
										example: 'party_bank',
									},
									production_complete: {
										type: 'integer',
										example: 1,
									},
									lc_cancel: {
										type: 'integer',
										example: 1,
									},
									handover_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									shipment_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									expiry_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									ud_no: {
										type: 'string',
										example: 'ud_no',
									},
									ud_received: {
										type: 'string',
										example: 'ud_received',
									},
									at_sight: {
										type: 'string',
										example: 'at_sight',
									},
									amd_date: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									amd_count: {
										type: 'integer',
										example: 1,
									},
									problematical: {
										type: 'integer',
										example: 1,
									},
									epz: {
										type: 'integer',
										example: 1,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
			},
		},
	},
};

// * Commercial Pi* //

export const pathCommercialPi = {
	'/commercial/pi': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get all pis',
			description: 'All pis',
			responses: {
				200: {
					description: 'Returns a all pis',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'string',
										example: 'PI24-0001',
									},
									lc_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									order_info_uuids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'marketing',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'party',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'merchandiser',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'ABC',
									},
									bank_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bank_name: {
										type: 'string',
										example: 'Bangladesh Bank',
									},

									bank_swift_code: {
										type: 'string',
										example: 'BB',
									},
									bank_address: {
										type: 'string',
										example: 'address',
									},
									factory_address: {
										type: 'string',
										example: 'address',
									},
									validity: {
										type: 'string',
										example: '2021-12-12',
									},
									payment: {
										type: 'string',
										example: 'paid',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'Manager',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['commercial.pi'],
			summary: 'Create a pi',
			description: 'Create a pi',
			// operationId: "addPet",
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/pi',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/pi',
						},
					},
				},

				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/pi/{uuid}': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get a pi',
			description: ' Get a pi by uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
		put: {
			tags: ['commercial.pi'],
			summary: 'Update a pi',
			description: 'Update a pi by uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'pi to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/pi',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.pi'],
			summary: 'Delete a pi',
			description: 'Delete a pi by uuid',
			//operationId: "deletePet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi to delete',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi/by/{pi_uuid}': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get a pi by pi_uuid',
			description: ' Get a pi by pi_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'pi_uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'string',
										example: 'PI24-0001',
									},
									lc_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									order_info_uuids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'marketing',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'party',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'merchandiser',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'ABC',
									},
									bank_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bank_name: {
										type: 'string',
										example: 'Bangladesh Bank',
									},

									bank_swift_code: {
										type: 'string',
										example: 'BB',
									},
									bank_address: {
										type: 'string',
										example: 'address',
									},
									factory_address: {
										type: 'string',
										example: 'address',
									},
									validity: {
										type: 'string',
										example: '2021-12-12',
									},
									payment: {
										type: 'string',
										example: 'paid',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'Manager',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi/details/{pi_uuid}': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get a pi details by pi_uuid',
			description: ' Get a pi details by pi_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'pi_uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'string',
										example: 'PI24-0001',
									},
									lc_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									order_info_uuids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'marketing',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'party',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'merchandiser',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'ABC',
									},
									bank_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bank_name: {
										type: 'string',
										example: 'Bangladesh Bank',
									},

									bank_swift_code: {
										type: 'string',
										example: 'BB',
									},
									bank_address: {
										type: 'string',
										example: 'address',
									},
									factory_address: {
										type: 'string',
										example: 'address',
									},
									validity: {
										type: 'string',
										example: '2021-12-12',
									},
									payment: {
										type: 'string',
										example: 'paid',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
									pi_entry: {
										type: 'object',
										properties: {
											uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											pi_uuid: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											pi_number: {
												type: 'string',
												example: '123456',
											},
											pi_date: {
												type: 'string',
												example: '2021-12-12',
											},
											amount: {
												type: 'number',
												example: 12.3456,
											},
											created_by: {
												type: 'string',
												example: 'igD0v9DIJQhJeet',
											},
											created_by_name: {
												type: 'string',
												example: 'John Doe',
											},
											user_designation: {
												type: 'string',
												example: 'Manager',
											},
											user_department: {
												type: 'string',
												example: 'HR',
											},
											created_at: {
												type: 'string',
												format: 'date-time',
												example: '2024-01-01 00:00:00',
											},
											update_at: {
												type: 'string',
												format: 'date-time',
												example: '2024-01-01 00:00:00',
											},
											remarks: {
												type: 'string',
												example: 'remarks',
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi-lc-uuid/{pi_uuid}': {
		put: {
			tags: ['commercial.pi'],
			summary: 'Update a pi put lc',
			description: 'Update a pi put lc by pi_uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'pi_uuid',
					in: 'path',
					description: 'pi to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								lc_uuid: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},
	'/commercial/pi-lc-null/{pi_uuid}': {
		put: {
			tags: ['commercial.pi'],
			summary: 'Update a pi put lc to null',
			description: 'Update a pi put lc to null by pi_uuid',
			//operationId: "updatePet",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'pi_uuid',
					in: 'path',
					description: 'pi to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
	},

	'/commercial/pi-lc/{lc_uuid}': {
		get: {
			tags: ['commercial.pi'],
			summary: 'Get a pi by lc_uuid',
			description: ' Get a pi by lc_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'lc_uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									id: {
										type: 'string',
										example: 'PI24-0001',
									},
									lc_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									lc_number: {
										type: 'string',
										example: '123456',
									},
									order_info_uuids: {
										type: 'array',
										items: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
									},
									marketing_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									marketing_name: {
										type: 'string',
										example: 'marketing',
									},
									party_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									party_name: {
										type: 'string',
										example: 'party',
									},
									merchandiser_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									merchandiser_name: {
										type: 'string',
										example: 'merchandiser',
									},
									factory_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									factory_name: {
										type: 'string',
										example: 'ABC',
									},
									bank_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									bank_name: {
										type: 'string',
										example: 'Bangladesh Bank',
									},
									bank_swift_code: {
										type: 'string',
										example: 'BB',
									},
									bank_address: {
										type: 'string',
										example: 'address',
									},
									factory_address: {
										type: 'string',
										example: 'address',
									},
									validity: {
										type: 'string',
										example: '2021-12-12',
									},
									payment: {
										type: 'string',
										example: 'paid',
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
};

// * Commercial Pi_Entry* //

export const pathCommercialPiEntry = {
	'/commercial/pi-entry': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get all pi_entries',
			description: 'All pi_entries',
			responses: {
				200: {
					description: 'Returns a all pi_entries',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/commercial/pi_entry',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['commercial.pi_entry'],
			summary: 'Create a pi_entry',
			description: 'Create a pi_entry',
			consumes: ['application/json'],
			produces: ['application/json'],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/pi_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/commercial/pi_entry',
						},
					},
				},
				405: {
					description: 'Invalid input',
				},
			},
		},
	},

	'/commercial/pi-entry/{uuid}': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get a pi_entry',
			description: ' Get a pi_entry by uuid',
			//operationId: "getPiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi_entry to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi_entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi_entry not found',
				},
			},
		},
		put: {
			tags: ['commercial.pi_entry'],
			summary: 'Update a pi_entry',
			description: 'Update a pi_entry by uuid',
			//operationId: "updatePiEntryByUuid",
			consume: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'pi_entry to update',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/commercial/pi_entry',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi_entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi_entry not found',
				},
				405: {
					description: 'Validation exception',
				},
			},
		},
		delete: {
			tags: ['commercial.pi_entry'],
			summary: 'Delete a pi_entry',
			description: 'Delete a pi_entry by uuid',
			//operationId: "deletePiEntryByUuid",
			produces: ['application/json'],
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					description: 'Pi_entry to delete',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/commercial/pi_entry',
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi_entry not found',
				},
			},
		},
	},
	'/commercial/pi-entry/by/{pi_uuid}': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get a pi_entry by pi_uuid',
			description: ' Get a pi_entry by pi_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'pi_uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pi_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									pi_number: {
										type: 'string',
										example: '123456',
									},
									pi_date: {
										type: 'string',
										example: '2021-12-12',
									},
									amount: {
										type: 'number',
										example: 12.3456,
									},
									created_by: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									created_by_name: {
										type: 'string',
										example: 'John Doe',
									},
									user_designation: {
										type: 'string',
										example: 'Manager',
									},
									user_department: {
										type: 'string',
										example: 'HR',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									update_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									remarks: {
										type: 'string',
										example: 'remarks',
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi-entry/details/by/{order_info_uuid}': {
		get: {
			tags: ['commercial.pi_entry'],
			summary: 'Get a pi_entry by order_info_uuid',
			description: ' Get a pi_entry by order_info_uuid',
			//operationId: "getPet",
			produces: ['application/json'],
			parameters: [
				{
					name: 'order_info_uuid',
					in: 'path',
					description: 'Pi to get',
					required: true,
					type: 'string',
					format: 'uuid',
					example: 'igD0v9DIJQhJeet',
				},
			],
			responses: {
				200: {
					description: 'Successful operation',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									sfg_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_info_uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									order_number: {
										type: 'string',
										example: 'Z24-0001',
									},
									item_description: {
										type: 'string',
										example: 'T-Shirt',
									},
									style: {
										type: 'string',
										example: 'St-1',
									},
									color: {
										type: 'string',
										example: 'Red',
									},
									size: {
										type: 'number',
										example: 10,
									},
									quantity: {
										type: 'number',
										example: 100,
									},
									given_pi_quantity: {
										type: 'number',
										example: 100,
									},
									max_quantity: {
										type: 'number',
										example: 100,
									},
									pi_quantity: {
										type: 'number',
										example: 100,
									},
									balance_quantity: {
										type: 'number',
										example: 100,
									},
									is_checked: {
										type: 'boolean',
										example: true,
									},
								},
							},
						},
					},
				},
				400: {
					description: 'Invalid UUID supplied',
				},
				404: {
					description: 'Pi not found',
				},
			},
		},
	},
	'/commercial/pi/details/by/order-info-ids/{order_info_uuids}/{party_uuid}/{marketing_uuid}':
		{
			get: {
				tags: ['commercial.pi_entry'],
				summary: 'Get a pi_entry by order_info_uuids',
				description: ' Get a pi_entry by order_info_uuids',
				//operationId: "getPet",
				produces: ['application/json'],
				parameters: [
					{
						name: 'order_info_uuids',
						in: 'path',
						description: 'Order Info Uuid',
						required: true,
						type: 'string',
						format: 'uuid',
						example: 'J3Au9M73Zb9saxj',
					},
					{
						name: 'party_uuid',
						in: 'path',
						description: 'Party Uuid',
						required: true,
						type: 'string',
						format: 'uuid',
						example: 'cf-daf86b3eedf1',
					},
					{
						name: 'marketing_uuid',
						in: 'path',
						description: 'Marketing Uuid',
						required: true,
						type: 'string',
						format: 'uuid',
						example: 'j14NcevenyrWSei',
					},
				],
				responses: {
					200: {
						description: 'Successful operation',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										uuid: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
										sfg_uuid: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
										order_info_uuid: {
											type: 'string',
											example: 'igD0v9DIJQhJeet',
										},
										order_number: {
											type: 'string',
											example: 'Z24-0001',
										},
										item_description: {
											type: 'string',
											example: 'T-Shirt',
										},
										style: {
											type: 'string',
											example: 'St-1',
										},
										color: {
											type: 'string',
											example: 'Red',
										},
										size: {
											type: 'number',
											example: 10,
										},
										quantity: {
											type: 'number',
											example: 100,
										},
										given_pi_quantity: {
											type: 'number',
											example: 100,
										},
										max_quantity: {
											type: 'number',
											example: 100,
										},
										pi_quantity: {
											type: 'number',
											example: 100,
										},
										balance_quantity: {
											type: 'number',
											example: 100,
										},
										is_checked: {
											type: 'boolean',
											example: true,
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Invalid UUID supplied',
					},
					404: {
						description: 'Pi not found',
					},
				},
			},
		},
};

export const pathCommercial = {
	...pathCommercialBank,
	...pathCommercialLc,
	...pathCommercialPi,
	...pathCommercialPiEntry,
};
