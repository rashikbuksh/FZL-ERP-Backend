// * Thread Machine * //

export const pathThreadMachine = {
	'/thread/machine': {
		get: {
			tags: ['Thread Machine'],
			summary: 'Get all Thread Machine',
			description: 'Get all Thread Machine',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/machine',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Machine'],
			summary: 'Create Thread Machine',
			description: 'Create Thread Machine',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/machine',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
	},
	'/thread/machine/{uuid}': {
		get: {
			tags: ['Thread Machine'],
			summary: 'Get Thread Machine',
			description: 'Get Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Machine'],
			summary: 'Update Thread Machine',
			description: 'Update Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/machine',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
		delete: {
			tags: ['Thread Machine'],
			summary: 'Delete Thread Machine',
			description: 'Delete Thread Machine',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/machine',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Count Length * //

export const pathThreadCountLength = {
	'/thread/count-length': {
		get: {
			tags: ['Thread Count Length'],
			summary: 'Get all Thread Count Length',
			description: 'Get all Thread Count Length',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/count-length',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Count Length'],
			summary: 'Create Thread Count Length',
			description: 'Create Thread Count Length',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/count-length',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count-length',
							},
						},
					},
				},
			},
		},
	},
	'/thread/count-length/{uuid}': {
		get: {
			tags: ['Thread Count Length'],
			summary: 'Get Thread Count Length',
			description: 'Get Thread Count Length',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count-length',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Count Length'],
			summary: 'Update Thread Count Length',
			description: 'Update Thread Count Length',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/count-length',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count-length',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['Thread Count Length'],
			summary: 'Delete Thread Count Length',
			description: 'Delete Thread Count Length',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/count-length',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Order Info * //

export const pathThreadOrderInfo = {
	'/thread/order-info': {
		get: {
			tags: ['Thread Order Info'],
			summary: 'Get all Thread Order Info',
			description: 'Get all Thread Order Info',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/order-info',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Order Info'],
			summary: 'Create Thread Order Info',
			description: 'Create Thread Order Info',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order-info',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-info',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-info/{uuid}': {
		get: {
			tags: ['Thread Order Info'],
			summary: 'Get Thread Order Info',
			description: 'Get Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-info',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Order Info'],
			summary: 'Update Thread Order Info',
			description: 'Update Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/order-info',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-info',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['Thread Order Info'],
			summary: 'Delete Thread Order Info',
			description: 'Delete Thread Order Info',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-info',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Order Entry * //

export const pathThreadOrderEntry = {
	'/thread/order-entry': {
		get: {
			tags: ['Thread Order Entry'],
			summary: 'Get all Thread Order Entry',
			description: 'Get all Thread Order Entry',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/order-entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Order Entry'],
			summary: 'Create Thread Order Entry',
			description: 'Create Thread Order Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order-entry',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-entry/{uuid}': {
		get: {
			tags: ['Thread Order Entry'],
			summary: 'Get Thread Order Entry',
			description: 'Get Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Order Entry'],
			summary: 'Update Thread Order Entry',
			description: 'Update Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/order-entry',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['Thread Order Entry'],
			summary: 'Delete Thread Order Entry',
			description: 'Delete Thread Order Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/order-entry',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Batch Entry * //

export const pathThreadBatchEntry = {
	'/thread/batch-entry': {
		get: {
			tags: ['Thread Batch Entry'],
			summary: 'Get all Thread Batch Entry',
			description: 'Get all Thread Batch Entry',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/batch-entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Batch Entry'],
			summary: 'Create Thread Batch Entry',
			description: 'Create Thread Batch Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch-entry',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch-entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch-entry/{uuid}': {
		get: {
			tags: ['Thread Batch Entry'],
			summary: 'Get Thread Batch Entry',
			description: 'Get Thread Batch Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch-entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Batch Entry'],
			summary: 'Update Thread Batch Entry',
			description: 'Update Thread Batch Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/batch-entry',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch-entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['Thread Batch Entry'],
			summary: 'Delete Thread Batch Entry',
			description: 'Delete Thread Batch Entry',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch-entry',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread Batch * //

export const pathThreadBatch = {
	'/thread/batch': {
		get: {
			tags: ['Thread Batch'],
			summary: 'Get all Thread Batch',
			description: 'Get all Thread Batch',
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/thread/batch',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['Thread Batch'],
			summary: 'Create Thread Batch',
			description: 'Create Thread Batch',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch',
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch/{uuid}': {
		get: {
			tags: ['Thread Batch'],
			summary: 'Get Thread Batch',
			description: 'Get Thread Batch',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['Thread Batch'],
			summary: 'Update Thread Batch',
			description: 'Update Thread Batch',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
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
							$ref: '#/definitions/thread/batch',
						},
					},
				},
			},

			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['Thread Batch'],
			summary: 'Delete Thread Batch',
			description: 'Delete Thread Batch',
			parameters: [
				{
					name: 'uuid',
					in: 'path',
					required: true,
					schema: {
						type: 'string',
						format: 'uuid',
					},
				},
			],
			responses: {
				201: {
					description: 'Success',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/thread/batch',
							},
						},
					},
				},
			},
		},
	},
};

// * Thread * //

export const pathThread = {
	...pathThreadMachine,
	...pathThreadCountLength,
	...pathThreadOrderInfo,
	...pathThreadOrderEntry,
	...pathThreadBatchEntry,
	...pathThreadBatch,
};
