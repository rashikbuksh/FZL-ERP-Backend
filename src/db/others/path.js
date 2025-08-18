import SE from '../../util/swagger_example.js';

const pathPublic = {
	'/other/machine/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all machines',
			description: 'All machines',
			operationId: 'getAllMachines',
			responses: {
				200: {
					description: 'Returns a all machines.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'machine 1',
									},
									max_capacity: {
										type: 'number',
										example: 10,
									},
									min_capacity: {
										type: 'number',
										example: 10,
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/machine-with-slot/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all machines',
			description: 'All machines',
			operationId: 'getAllBookedMachines',
			parameters: [
				SE.parameter_query(
					'production_date',
					'production_date',
					'2021-01-01'
				),
			],
			responses: {
				200: {
					description: 'Returns a all machines.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'machine 1',
									},
									max_capacity: {
										type: 'number',
										example: 10,
									},
									min_capacity: {
										type: 'number',
										example: 10,
									},
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
			parameters: [
				SE.parameter_query('marketing', 'marketing', [SE.uuid()]),
				SE.parameter_query('item_for', 'item_for', [
					'zipper',
					'thread',
					'all',
				]),
				SE.parameter_query('is_cash', 'is_cash', ['true', 'false']),
				SE.parameter_query('has_factory', 'has_factory', [
					'true',
					'false',
				]),
				SE.parameter_query('is_pi', 'is_pi', ['true', 'false']),
				SE.parameter_query('own_uuid', 'own_uuid', [SE.uuid()]),
			],
			responses: {
				200: {
					description: 'Returns a all parties.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
								type: 'object',
								properties: {
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
	'/other/buyer/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all buyers',
			description: 'All buyers',
			operationId: 'getAllBuyers',
			responses: {
				200: {
					description: 'Returns a all buyers.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/merchandiser/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get filtered merchandisers by party',
			description: 'Filtered merchandisers by party',
			operationId: 'getFilteredMerchandisers',
			parameters: [
				{
					name: 'party_uuid',
					in: 'path',
					description: "party's uuid",
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'Returns a all merchandisers.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/factory/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get filtered factories by party',
			description: 'Filtered factories by party',
			operationId: 'getFilteredFactories',
			parameters: [
				{
					name: 'party_uuid',
					in: 'path',
					description: "party's uuid",
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'Returns a all factories.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/marketing/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all marketing',
			description: 'All marketing',
			operationId: 'getAllMarketing',
			responses: {
				200: {
					description: 'Returns a all marketing.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/order/info/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order info',
			description: 'All order info',
			operationId: 'getAllOrderInfo',
			parameters: [
				SE.parameter_query('page', 'page', ['challan']),
				SE.parameter_query('is_sample', 'is_sample', ['true', 'false']),
				SE.parameter_query('item_for', 'item_for', [
					'full',
					'slider',
					'tape',
				]),
				SE.parameter_query('party_name', 'party_name', [
					'true',
					'false',
				]),
				SE.parameter_query('from_date', 'from_date', '2021-01-01'),
				SE.parameter_query('to_date', 'to_date', '2021-01-01'),
				SE.parameter_query('own_uuid', 'own_uuid', '2ggcphnwHGzEUGy'),
				SE.parameter_query('total_qty', 'total_qty', ['true', 'false']),
				SE.parameter_query('is_slider_needed', 'is_slider_needed', [
					true,
					false,
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					value: SE.uuid(),
					label: SE.string('Z24-0001'),
				}),
			},
		},
	},
	'/other/order/zipper-thread/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order zipper thread',
			description: 'All order zipper thread',
			operationId: 'getAllOrderZipperThread',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2021-01-01'),
				SE.parameter_query('to_date', 'to_date', '2021-01-01'),
				SE.parameter_query(
					'page',
					'page',
					[
						'production_statement',
						'production_statement_accounts',
						'challan_pdf',
					],
					true
				),
				SE.parameter_query('own_uuid', 'own_uuid', '2ggcphnwHGzEUGy'),
				SE.parameter_query(
					'is_description_needed',
					'is_description_needed',
					['true', 'false']
				),
			],
			responses: {
				200: {
					description: 'Returns a all order zipper thread.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/order-properties/by/{type_name}': {
		get: {
			tags: ['others'],
			summary: 'get all order properties',
			description: 'All order properties',
			operationId: 'getAllOrderProperties',
			parameters: [
				{
					name: 'type_name',
					in: 'path',
					description: 'type of order properties',
					required: true,
					type: 'string',
					example: 'item',
				},
				SE.parameter_query('sort', 'sort', ['asc', 'desc']),
			],
			responses: {
				200: {
					description: 'Returns a all order properties.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'nylon' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order/entry/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order entry',
			description: 'All order entry',
			operationId: 'getAllOrderEntry',
			responses: {
				200: {
					description: 'Returns a all order entry.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid('2ggcphnw'),
									label: SE.string(
										'Z24-0001 ⇾ N-5-OE-SP ⇾ st1 ⇾ black ⇾ 1000 ⇾ 1000'
									),
									can_trf_quantity: SE.number(10),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathPurchase = {
	'/other/vendor/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all vendors',
			description: 'All vendors',
			operationId: 'getAllVendors',
			parameters: [
				SE.parameter_query('store_type', 'store_type', [
					'rm',
					'accessories',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					value: SE.string('2ggcphnwHGzEUGy'),
					label: SE.string('vendor 1'),
				}),
			},
		},
	},
};

const pathMaterial = {
	'/other/material-section/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all material sections',
			description: 'All material sections',
			operationId: 'getAllMaterialSections',
			parameters: [
				SE.parameter_query('store_type', 'store_type', [
					'rm',
					'accessories',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					value: SE.string('2ggcphnwHGzEUGy'),
					label: SE.string('section 1'),
				}),
			},
		},
	},
	'/other/material-type/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all material types',
			description: 'All material types',
			operationId: 'getAllMaterialTypes',
			parameters: [
				SE.parameter_query(
					'store_type',
					'store_type',
					['rm', 'accessories'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					value: SE.string('2ggcphnwHGzEUGy'),
					label: SE.string('type 1'),
				}),
			},
		},
	},
	'/other/material/value/label/unit/quantity': {
		get: {
			tags: ['others'],
			summary: 'get all materials',
			description: 'All materials',
			operationId: 'getAllMaterials',
			parameters: [SE.parameter_query('type', 'type', ['dyes'])],
			responses: {
				200: SE.response_schema(200, {
					value: SE.string('2ggcphnwHGzEUGy'),
					label: SE.string('material 1'),
					unit: SE.string('kg'),
					stock: SE.number(10),
				}),
			},
		},
	},
};

const pathCommercial = {
	'/other/bank/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all banks',
			description: 'All banks',
			operationId: 'getAllBanks',
			responses: {
				200: {
					description: 'Returns all banks.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('igD0v9DIJQhJeet'),
									label: SE.string('Bank-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/lc/value/label/{party_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get all LCs',
			description: 'All LCs',
			operationId: 'getAllLCs',
			parameters: [
				SE.parameter_query(
					'party_uuid',
					'party_uuid',
					'2ggcphnwHGzEUGy'
				),
			],
			responses: {
				200: {
					description: 'Returns all LCs.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('igD0v9DIJQhJeet'),
									label: SE.string('LC-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/pi/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all PIs',
			description: 'All PIs',
			operationId: 'getAllPIs',
			parameters: [
				SE.parameter_query('is_update', 'is_update', [true, false]),
				SE.parameter_query('party_uuid', 'party_uuid', [SE.uuid()]),
				SE.parameter_query('page', 'page', ['pi', 'lc']),
			],
			responses: {
				200: {
					description: 'Returns all PIs.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('igD0v9DIJQhJeet'),
									label: SE.string('PI24-0001'),
									pi_bank: SE.string('AB BANK (PVT) LTD'),
									pi_value: SE.number(1800.0),
									order_numbers: SE.string('{Z24-0002}'),
									marketing_name: SE.string('Mr Shanto'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathZipper = {
	'/other/tape-coil/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all tape coils',
			description: 'All tape coils',
			operationId: 'getAllTapeCoils',
			responses: {
				200: {
					description: 'Returns a all tape coils.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
	'/other/order/order_description_uuid/by/{order_number}': {
		get: {
			tags: ['others'],
			summary: 'get order description uuid by order number',
			description: 'Order description uuid by order number',
			operationId: 'getOrderDescriptionUuid',
			parameters: [
				SE.parameter_params(
					'order_number',
					'order_number',
					'string',
					'Z24-0001'
				),
				SE.parameter_query(
					'marketing_uuid',
					'marketing_uuid',
					'2ggcphnwHGzEUGy'
				),
			],
			responses: {
				200: {
					description: 'Returns a order description uuid.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									order_info_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									reference_order_info_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									order_description_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									buyer_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									buyer_name: {
										type: 'string',
										example: 'John',
									},
									party_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									party_name: {
										type: 'string',
										example: 'John',
									},
									marketing_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									marketing_name: {
										type: 'string',
										example: 'John',
									},
									merchandiser_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									merchandiser_name: {
										type: 'string',
										example: 'John',
									},
									factory_uuid: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									factory_name: {
										type: 'string',
										example: 'John',
									},
									is_sample: {
										type: 'integer',
										example: 1,
									},
									is_bill: {
										type: 'integer',
										example: 1,
									},
									is_cash: {
										type: 'integer',
										example: 1,
									},
									marketing_priority: {
										type: 'string',
										example: '',
									},
									factory_priority: {
										type: 'string',
										example: '',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order-number-for-pi-zipper/value/label/{marketing_uuid}/{party_uuid}':
		{
			get: {
				tags: ['others'],
				summary: 'get order number for pi',
				description: 'Order number for pi',
				operationId: 'getOrderNumberForPi',
				parameters: [
					SE.parameter_params(
						'marketing_uuid',
						'marketing_uuid',
						'2ggcphnwHGzEUGy'
					),
					SE.parameter_params(
						'party_uuid',
						'party_uuid',
						'2ggcphnwHGzEUGy'
					),
					SE.parameter_query('is_cash', 'is_cash', [true, false]),
					SE.parameter_query('pi_uuid', 'pi_uuid', '2ggcphnwHGzEUGy'),
				],
				responses: {
					200: {
						description: 'Returns a order number.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										value: SE.string('2ggcphnwHGzEUGy'),
										label: SE.string('Z24-0001'),
									},
								},
							},
						},
					},
				},
			},
		},
	'/other/order/order-description-store/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order descriptions for store',
			description: 'All order descriptions for store',
			operationId: 'getAllOrderDescriptionsForStore',
			parameters: [],
			responses: {
				200: {
					description: 'Returns a all order descriptions.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('2ggcphnwHGzEUGy'),
									label: SE.string('Z24-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order/description/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all order descriptions',
			description: 'All order descriptions',
			operationId: 'getAllOrderDescriptions',
			parameters: [
				SE.parameter_query('item', 'item', [
					'all',
					'nylon',
					'without-nylon',
				]),
				SE.parameter_query('tape_received', 'tape_received', [
					'false',
					'true',
				]),
				SE.parameter_query('swatch_approved', 'swatch_approved', [
					'false',
					'true',
				]),
				SE.parameter_query('dyed_tape_required', 'dyed_tape_required', [
					'false',
					'true',
				]),
				SE.parameter_query('is_balance', 'is_balance', [
					'false',
					'true',
				]),
				SE.parameter_query('is_update', 'is_update', ['true', 'false']),
				SE.parameter_query('is_slider_needed', 'is_slider_needed', [
					'true',
					'false',
				]),
				SE.parameter_query('type', 'type', ['all']),
				SE.parameter_query('od_uuid', 'od_uuid', [SE.uuid()]),
			],
			responses: {
				200: {
					description: 'Returns a all order descriptions.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('2ggcphnwHGzEUGy'),
									label: SE.string(
										'Z24-0001 ⇾ N-5-OE-SP ⇾ 10'
									),
									item_name: SE.string('Nylon'),
									tape_received: SE.number(10),
									tape_transferred: SE.number(10),
									total_size: SE.number(10),
									total_quantity: SE.number(10),
									top: SE.number(10),
									bottom: SE.number(10),
									dyed_per_kg_meter: SE.number(10),
									stock: SE.number(10),
								},
							},
						},
					},
				},
			},
		},
	},
	// '/other/order/order-description/value/label/{item_name}/{zipper_number}': {
	// 	get: {
	// 		tags: ['others'],
	// 		summary: 'get order description by item uuid',
	// 		description: 'Order description by item uuid',
	// 		operationId: 'getOrderDescriptionByItemUuid',
	// 		parameters: [
	// 			{
	// 				name: 'item_name',
	// 				in: 'path',
	// 				required: true,
	// 				type: 'string',
	// 				format: 'uuid',
	// 				example: '2ggcphnwHGzEUGy',
	// 			},
	// 		],
	// 		responses: {
	// 			200: {
	// 				description: 'Returns a order description.',
	// 				content: {
	// 					'application/json': {
	// 						schema: {
	// 							type: 'object',
	// 							properties: {
	// 								value: SE.string('2ggcphnwHGzEUGy'),
	// 								label: SE.string('Z24-0001'),
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// },

	'/other/order/order-description/value/label/by/{coil_uuid}': {
		get: {
			tags: ['others'],
			summary: 'get order description by coil uuid',
			description: 'Order description by coil uuid',
			operationId: 'getOrderDescriptionByCoilUuid',
			parameters: [
				SE.parameter_params('coil_uuid', 'coil_uuid'),
				SE.parameter_query('is_slider_needed', 'is_slider_needed', [
					'true',
					'false',
				]),
			],
			responses: {
				200: {
					description: 'Returns a order description.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('2ggcphnwHGzEUGy'),
									label: SE.string('Z24-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/zipper/finishing-batch/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all finishing batches',
			description: 'All finishing batches',
			operationId: 'getAllFinishingBatches',
			responses: {
				200: {
					description: 'Returns a all finishing batches.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.string('2ggcphnwHGzEUGy'),
									label: SE.string('batch 1'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathHr = {
	'/other/department/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all departments',
			description: 'All departments',
			operationId: 'getAllDepartments',
			responses: {
				200: {
					description: 'Returns a all departments.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'Admin' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/hr/user/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all HR users',
			description: 'All HR users',
			operationId: 'getAllHRUsers',
			parameters: [
				SE.parameter_query('designation', 'designation', [
					'driver',
					'executive',
				]),
				SE.parameter_query('department', 'department', [
					'admin',
					'hr',
					'thread',
				]),
			],
			responses: {
				200: {
					description: 'Returns a all HR users.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: { type: 'string', example: 'John' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/designation/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all designation',
			description: 'All Designation',
			operationId: 'getAllDepartment',
			responses: {
				200: {
					description: 'Returns a all Designation.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Admin'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathLabDip = {
	'/other/lab-dip/recipe/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all lab dip recipes',
			description: 'All lab dip recipes',
			operationId: 'getAllLabDipRecipes',
			parameters: [
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					'2ggcphnwHGzEUGy'
				),
				SE.parameter_query('info_uuid', 'info_uuid', 'false'),
				SE.parameter_query('bleaching', 'bleaching', [1, 0]),
				SE.parameter_query('approved', 'approved', [1, 0]),
			],
			responses: {
				200: {
					description: 'Returns a all lab dip recipes.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'recipe 1',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/lab-dip/shade-recipe/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all shade recipes',
			description: 'All shade recipes',
			operationId: 'getAllShadeRecipes',
			parameters: [
				SE.parameter_query(
					'thread_order_info_uuid',
					'thread_order_info_uuid',
					'2ggcphnwHGzEUGy'
				),
				SE.parameter_query('bleaching', 'bleaching', [1, 0]),
			],
			responses: {
				200: {
					description: 'Returns a all shade recipes.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'recipe 1',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/lab-dip/info/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all lab dip info',
			description: 'All lab dip info',
			operationId: 'getAllLabDipInfo',
			responses: {
				200: {
					description: 'Returns a all lab dip info.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('LDI24-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathSlider = {
	'/other/slider-item-name/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all sliders',
			description: 'All sliders',
			operationId: 'getAllSliders',
			responses: {
				200: {
					description: 'Returns a all sliders.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'cap --> N - 5 - OE - SP',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/slider/stock-with-order-description/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all slider stock with order description',
			description: 'All slider stock with order description',
			operationId: 'getAllSliderStockWithOrderDescription',
			parameters: [
				SE.parameter_query('section', 'section', ['assembly_stock']),
			],
			responses: {
				200: {
					description:
						'Returns a all slider stock with order description.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Z24-0001 ⇾ N-5-OE-SP'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathThread = {
	'/other/thread/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all threads',
			description: 'All threads',
			operationId: 'getAllThreads',
			parameters: [
				SE.parameter_query('page', 'page', ['challan']),
				SE.parameter_query('is_sample', 'is_sample', ['true', 'false']),
				SE.parameter_query('recipe_required', 'recipe_required', [
					'true',
					'false',
				]),
				SE.parameter_query('party_name', 'party_name', [
					'true',
					'false',
				]),
				SE.parameter_query('total_qty', 'total_qty', ['true', 'false']),
			],
			responses: {
				200: {
					description: 'Returns a all threads.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Thread 1'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/order-number-for-pi-thread/value/label/{marketing_uuid}/{party_uuid}':
		{
			get: {
				tags: ['others'],
				summary: 'get all thread order info',
				description: 'All thread order info',
				operationId: 'getAllThreadOrderInfo',
				parameters: [
					SE.parameter_params(
						'marketing_uuid',
						'marketing_uuid',
						'2ggcphnwHGzEUGy'
					),
					SE.parameter_params(
						'party_uuid',
						'party_uuid',
						'2ggcphnwHGzEUGy'
					),
					SE.parameter_query('is_cash', 'is_cash', [true, false]),
					SE.parameter_query('pi_uuid', 'pi_uuid', '2ggcphnwHGzEUGy'),
				],
				responses: {
					200: {
						description: 'Returns a all thread order info.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										value: SE.uuid(),
										label: SE.string('TO24-0001'),
									},
								},
							},
						},
					},
				},
			},
		},
	'/other/thread/count-length/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all thread count length',
			description: 'All thread count length',
			operationId: 'getAllThreadCountLength',
			responses: {
				200: {
					description: 'Returns a all thread count length.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: '150D/2',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/thread/batch/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all thread batch',
			description: 'All thread batch',
			operationId: 'getAllThreadBatch',
			responses: {
				200: {
					description: 'Returns a all thread batch.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'TB24-0001',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/thread/dyes-category/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all thread dyes category',
			description: 'All thread dyes category',
			operationId: 'getAllThreadDyesCategory',
			responses: {
				200: {
					description: 'Returns a all thread dyes category.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '2ggcphnwHGzEUGy',
									},
									label: {
										type: 'string',
										example: 'category 1',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/slider/die-casting/by-type/{type}': {
		get: {
			tags: ['others'],
			summary: 'get all die casting',
			description: 'All die casting',
			operationId: 'getAllDieCasting',
			parameters: [SE.parameter_params('type', 'type', 'string', 'body')],
			responses: {
				200: {
					description: 'Returns a all die casting.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Die Casting 1'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathDelivery = {
	'/other/delivery/packing-list-by-order-info/value/label/{order_info_uuid}':
		{
			get: {
				tags: ['others'],
				summary: 'get all packing list by order info',
				description: 'All packing list by order info',
				operationId: 'getAllPackingListByOrderInfo',
				parameters: [
					SE.parameter_params(
						'order_info_uuid',
						'order_info_uuid',
						'uuid'
					),
					SE.parameter_query(
						'challan_uuid',
						'challan_uuid',
						'2ggcphnwHGzEUGy'
					),
					SE.parameter_query('received', 'received', [true, false]),
					SE.parameter_query('item_for', 'item_for', [
						'zipper',
						'thread',
						'tape',
						'slider',
						'sample_zipper',
						'sample_thread',
					]),
				],
				responses: {
					200: {
						description:
							'Returns a all packing list by order info.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										value: SE.uuid(),
										label: SE.string('PL24-0001'),
									},
								},
							},
						},
					},
				},
			},
		},
	'/other/delivery/vehicle/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all vehicles',
			description: 'All vehicles',
			operationId: 'getAllVehicles',
			responses: {
				200: {
					description: 'Returns a all vehicles.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('Vehicle 1'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/delivery/carton/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all cartons',
			description: 'All cartons',
			operationId: 'getAllCartons',
			responses: {
				200: {
					description: 'Returns a all cartons.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('10*10*10'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/delivery/challan/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all challans',
			description: 'All challans',
			operationId: 'getAllChallans',
			parameters: [
				SE.parameter_query('get_pass', 'get_pass', ['true', 'false']),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: {
					description: 'Returns a all challans.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('CH24-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
	'/other/delivery/packing-list/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all packing list',
			description: 'All packing list',
			operationId: 'getAllPackingList',
			parameters: [
				SE.parameter_query('is_received', 'is_received', [
					'true',
					' false',
				]),
			],
			responses: {
				200: {
					description: 'Returns a all packing list.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									value: SE.uuid(),
									label: SE.string('PL24-0001'),
								},
							},
						},
					},
				},
			},
		},
	},
};

const pathMaintain = {
	'/other/maintain/section-machine/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all maintain',
			description: 'All maintain',
			operationId: 'getAllMaintain',
			responses: {
				200: SE.response_schema(200, {
					value: SE.uuid('2ggcphnw'),
					label: SE.string('maintain 1'),
				}),
			},
		},
	},
	'/other/maintain/issue/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all maintain issues',
			description: 'All maintain issues',
			operationId: 'getAllMaintainIssues',
			responses: {
				200: SE.response_schema(200, {
					value: SE.uuid('2ggcphnw'),
					label: SE.string('MT23-0001'),
				}),
			},
		},
	},
};

const pathAccounts = {
	'/other/accounts/head/value/label': {
		get: {
			tags: ['others'],
			summary: 'get all accounts heads',
			description: 'All accounts heads',
			operationId: 'getAllAccountsHeads',
			responses: {
				200: SE.response_schema(200, {
					value: SE.uuid('2ggcphnw'),
					label: SE.string('accounts head 1'),
				}),
			},
		},
	},
};

export {
	pathMaintain,
	pathDelivery,
	pathThread,
	pathZipper,
	pathHr,
	pathLabDip,
	pathSlider,
	pathCommercial,
	pathPublic,
	pathPurchase,
	pathMaterial,
	pathAccounts,
};
