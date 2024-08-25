// * Thread Machine * //

export const pathThreadMachine = {
	'/thread/machine': {
		get: {
			tags: ['thread.machine'],
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
			tags: ['thread.machine'],
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
			tags: ['thread.machine'],
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
			tags: ['thread.machine'],
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
			tags: ['thread.machine'],
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
			tags: ['thread.count_length'],
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
									$ref: '#/definitions/thread/count_length',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.count_length'],
			summary: 'Create Thread Count Length',
			description: 'Create Thread Count Length',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/count_length',
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
								$ref: '#/definitions/thread/count_length',
							},
						},
					},
				},
			},
		},
	},
	'/thread/count-length/{uuid}': {
		get: {
			tags: ['thread.count_length'],
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
								$ref: '#/definitions/thread/count_length',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.count_length'],
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
							$ref: '#/definitions/thread/count_length',
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
								$ref: '#/definitions/thread/count_length',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.count_length'],
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
								$ref: '#/definitions/thread/count_length',
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
			tags: ['thread.order_info'],
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
									$ref: '#/definitions/thread/order_info',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.order_info'],
			summary: 'Create Thread Order Info',
			description: 'Create Thread Order Info',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_info',
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
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-info/{uuid}': {
		get: {
			tags: ['thread.order_info'],
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
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.order_info'],
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
							$ref: '#/definitions/thread/order_info',
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
								$ref: '#/definitions/thread/order_info',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.order_info'],
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
								$ref: '#/definitions/thread/order_info',
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
			tags: ['thread.order_entry'],
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
									$ref: '#/definitions/thread/order_entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.order_entry'],
			summary: 'Create Thread Order Entry',
			description: 'Create Thread Order Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/order_entry',
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
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/order-entry/{uuid}': {
		get: {
			tags: ['thread.order_entry'],
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
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.order_entry'],
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
							$ref: '#/definitions/thread/order_entry',
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
								$ref: '#/definitions/thread/order_entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.order_entry'],
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
								$ref: '#/definitions/thread/order_entry',
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
			tags: ['thread.batch_entry'],
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
									$ref: '#/definitions/thread/batch_entry',
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ['thread.batch_entry'],
			summary: 'Create Thread Batch Entry',
			description: 'Create Thread Batch Entry',
			requestBody: {
				content: {
					'application/json': {
						schema: {
							$ref: '#/definitions/thread/batch_entry',
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
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},
	},
	'/thread/batch-entry/{uuid}': {
		get: {
			tags: ['thread.batch_entry'],
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
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},
		put: {
			tags: ['thread.batch_entry'],
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
							$ref: '#/definitions/thread/batch_entry',
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
								$ref: '#/definitions/thread/batch_entry',
							},
						},
					},
				},
			},
		},

		delete: {
			tags: ['thread.batch_entry'],
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
								$ref: '#/definitions/thread/batch_entry',
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
			tags: ['thread.batch'],
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
			tags: ['thread.batch'],
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
			tags: ['thread.batch'],
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
			tags: ['thread.batch'],
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
			tags: ['thread.batch'],
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
