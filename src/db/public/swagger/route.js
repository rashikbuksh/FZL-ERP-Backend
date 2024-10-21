import SE from '../../../util/swagger_example.js';
// * Public Buyer * //
const pathPublicBuyer = {
	'/public/public/buyer': {
		get: {
			summary: 'Get all buyers',
			tags: ['public.buyer'],
			operationId: 'getBuyers',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/buyer',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a buyer',
			tags: ['public.buyer'],
			operationId: 'createBuyer',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/buyer',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/buyer/{uuid}': {
		get: {
			summary: 'Get a buyer',
			tags: ['public.buyer'],
			operationId: 'getBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/buyer',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a buyer',
			tags: ['public.buyer'],
			operationId: 'updateBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/buyer',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a buyer',
			tags: ['public.buyer'],
			operationId: 'deleteBuyer',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the buyer',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Factory * //
const pathPublicFactory = {
	'/public/factory': {
		get: {
			summary: 'Get all factories',
			tags: ['public.factory'],
			operationId: 'getFactories',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
									},
									party_uuid: {
										type: 'string',
									},
									party_name: {
										type: 'string',
									},
									name: {
										type: 'string',
									},
									email: {
										type: 'string',
									},
									phone: {
										type: 'string',
									},
									address: {
										type: 'string',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a factory',
			tags: ['public.factory'],
			operationId: 'createFactory',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/factory',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/factory/{uuid}': {
		get: {
			summary: 'Get a factory',
			tags: ['public.factory'],
			operationId: 'getFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/factory',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a factory',
			tags: ['public.factory'],
			operationId: 'updateFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/factory',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a factory',
			tags: ['public.factory'],
			operationId: 'deleteFactory',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the factory',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Marketing * //

const pathPublicMarketing = {
	'/public/marketing': {
		get: {
			summary: 'Get all marketing',
			tags: ['public.marketing'],
			operationId: 'getMarketings',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/marketing',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a marketing',
			tags: ['public.marketing'],
			operationId: 'createMarketing',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/marketing',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/marketing/{uuid}': {
		get: {
			summary: 'Get a marketing',
			tags: ['public.marketing'],
			operationId: 'getMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/marketing',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a marketing',
			tags: ['public.marketing'],
			operationId: 'updateMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/marketing',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a marketing',
			tags: ['public.marketing'],
			operationId: 'deleteMarketing',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the marketing',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Merchandiser * //
const pathPublicMerchandiser = {
	'/public/merchandiser': {
		get: {
			summary: 'Get all merchandisers',
			tags: ['public.merchandiser'],
			operationId: 'getMerchandisers',
			parameters: [
				SE.parameter_query('search', 'q', []),
				SE.parameter_query('_page', '_page', []),
				SE.parameter_query('_limit', '_limit', []),
				SE.parameter_query('_sort', '_sort', []),
				SE.parameter_query('_order', '_order', []),
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
									},
									party_uuid: {
										type: 'string',
									},
									party_name: {
										type: 'string',
									},
									name: {
										type: 'string',
									},
									email: {
										type: 'string',
									},
									phone: {
										type: 'string',
									},
									address: {
										type: 'string',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'createMerchandiser',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/merchandiser',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/merchandiser/{uuid}': {
		get: {
			summary: 'Get a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'getMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								properties: {
									uuid: {
										type: 'string',
									},
									party_uuid: {
										type: 'string',
									},
									party_name: {
										type: 'string',
									},
									name: {
										type: 'string',
									},
									email: {
										type: 'string',
									},
									phone: {
										type: 'string',
									},
									address: {
										type: 'string',
									},
									created_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
										format: 'date-time',
										example: '2024-01-01 00:00:00',
									},
								},
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'updateMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/merchandiser',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a merchandiser',
			tags: ['public.merchandiser'],
			operationId: 'deleteMerchandiser',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the merchandiser',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Party * //
const pathPublicParty = {
	'/public/party': {
		get: {
			summary: 'Get all parties',
			tags: ['public.party'],
			operationId: 'getParties',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/party',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a party',
			tags: ['public.party'],
			operationId: 'createParty',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/party',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/party/{uuid}': {
		get: {
			summary: 'Get a party',
			tags: ['public.party'],
			operationId: 'getParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/party',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a party',
			tags: ['public.party'],
			operationId: 'updateParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/party',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a party',
			tags: ['public.party'],
			operationId: 'deleteParty',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the party',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Properties * //
const pathPublicProperties = {
	'/public/properties': {
		get: {
			summary: 'Get all properties',
			tags: ['public.properties'],
			operationId: 'getProperties',
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item_for: {
										type: 'string',
										example: 'tape_making',
									},
									type: {
										type: 'string',
										example: 'type',
									},
									name: {
										type: 'string',
										example: 'prop 1',
									},
									short_name: {
										type: 'string',
										example: 'p1',
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
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
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
			summary: 'Create a properties',
			tags: ['public.properties'],
			operationId: 'createProperties',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/properties',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/properties/{uuid}': {
		get: {
			summary: 'Get a properties',
			tags: ['public.properties'],
			operationId: 'getProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										example: 'igD0v9DIJQhJeet',
									},
									item_for: {
										type: 'string',
										example: 'tape_making',
									},
									type: {
										type: 'string',
										example: 'type',
									},
									name: {
										type: 'string',
										example: 'prop 1',
									},
									short_name: {
										type: 'string',
										example: 'p1',
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
										example: '2024-01-01 00:00:00',
									},
									updated_at: {
										type: 'string',
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
		put: {
			summary: 'Update a properties',
			tags: ['public.properties'],
			operationId: 'updateProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
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
								item_for: {
									type: 'string',
									example: 'tape_making',
								},
								type: {
									type: 'string',
									example: 'type',
								},
								name: {
									type: 'string',
									example: 'prop 1',
								},
								short_name: {
									type: 'string',
									example: 'p1',
								},
								created_by: {
									type: 'string',
									example: 'igD0v9DIJQhJeet',
								},
								created_at: {
									type: 'string',
									example: '2024-01-01 00:00:00',
								},
								updated_at: {
									type: 'string',
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
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a properties',
			tags: ['public.properties'],
			operationId: 'deleteProperties',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the properties',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

// * Public Section * //
const pathPublicSection = {
	'/public/section': {
		get: {
			summary: 'Get all sections',
			tags: ['public.section'],
			operationId: 'getSections',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/section',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a section',
			tags: ['public.section'],
			operationId: 'createSection',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/section',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/section/{uuid}': {
		get: {
			summary: 'Get a section',
			tags: ['public.section'],
			operationId: 'getSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/section',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a section',
			tags: ['public.section'],
			operationId: 'updateSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/section',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a section',
			tags: ['public.section'],
			operationId: 'deleteSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

export const publicMachine = {
	'/public/machine': {
		get: {
			summary: 'Get all sections',
			tags: ['public.machine'],
			operationId: 'getSections',
			parameters: [],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/public/machine',
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: 'Create a machine',
			tags: ['public.machine'],
			operationId: 'createSection',
			parameters: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/machine',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Created',
				},
			},
		},
	},
	'/public/machine/{uuid}': {
		get: {
			summary: 'Get a machine',
			tags: ['public.machine'],
			operationId: 'getSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the machine',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/public/machine',
							},
						},
					},
				},
			},
		},
		put: {
			summary: 'Update a machine',
			tags: ['public.machine'],
			operationId: 'updatemachine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the section',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/public/machine',
						},
					},
				},
			},
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
		delete: {
			summary: 'Delete a machine',
			tags: ['public.machine'],
			operationId: 'deleteSection',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					description: 'uuid of the machine',
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				204: {
					description: 'No Content',
				},
			},
		},
	},
};

export const pathPublic = {
	...pathPublicBuyer,
	...pathPublicFactory,
	...pathPublicMarketing,
	...pathPublicMerchandiser,
	...pathPublicParty,
	...pathPublicProperties,
	...pathPublicSection,
	...publicMachine,
};
