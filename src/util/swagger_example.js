const getDescriptionByCode = (code) => {
	let description = '';
	switch (code) {
		case 200:
			description = 'Successful Operation';
			break;

		case 400:
			description = 'Bad Request / Invalid UUID supplied';
			break;

		case 404:
			description = 'Not Found';
			break;

		case 405:
			description = 'Invalid input';
			break;

		default:
			description = 'Invalid Code: ' + code;
			break;
	}

	return description;
};

const SE = {
	string: (example = '') => ({
		type: 'string',
		example,
	}),

	uuid: (example = 'igD0v9DIJQhJeet') => ({
		type: 'string',
		example,
	}),

	number: (example = 0.0) => ({
		type: 'number',
		example,
	}),

	integer: (example = 0) => ({
		type: 'integer',
		example,
	}),
	boolean: (example = false) => ({
		type: 'boolean',
		example,
	}),

	date_time: () => ({
		type: 'string',
		format: 'date-time',
		example: '2021-01-01 00:00:00',
	}),

	array: (items = {}) => ({
		type: 'array',
		items,
	}),

	// * Others
	xml: (name = '') => ({ name }),

	// * Parameters
	parameter_params: (
		description = 'GET DATA',
		name = 'uuid',
		format = 'uuid',
		example = 'igD0v9DIJQhJeet'
	) => ({
		name: name,
		in: 'path',
		required: true,
		type: 'string',
		format: format,
		description,
		example: example,
	}),

	// Function definition
	parameter_query: (
		description = 'GET DATA',
		name = 'uuid',
		enumVal = ['']
	) => ({
		name: name,
		in: 'query',
		description: description,
		required: false,
		type: 'array',
		items: {
			type: 'string',
			enum: enumVal,
			default: enumVal[0],
		},
		collectionFormat: 'multi',
	}),

	parameter_schema_ref: (description = 'POST DATA', path = '') => ({
		in: 'body',
		name: 'body',
		description,
		required: true,
		schema: {
			$ref: '#/definitions/' + path,
		},
	}),

	// * requestBody
	requestBody: (properties = {}, required = []) => {
		return {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties,
						required,
					},
				},
			},
		};
	},

	requestBody_schema_ref: (path = '') => {
		return {
			content: {
				'application/json': {
					schema: {
						$ref: '#/definitions/' + path,
					},
				},
			},
		};
	},

	// * Response
	response: (code) => {
		return { description: getDescriptionByCode(code) };
	},

	response_schema: (code, properties) => {
		return {
			description: getDescriptionByCode(code),
			...SE.requestBody(properties),
		};
	},

	sub_response_schema: (properties) => {
		return {
			type: 'object',
			properties,
		};
	},

	response_schema_ref: (code, path) => {
		let base_path = '#/definitions/';

		return {
			description: getDescriptionByCode(code),
			content: {
				'application/json': {
					schema: {
						type: 'array',
						items: {
							$ref: base_path + path,
						},
					},
				},
			},
		};
	},
};

// * Swagger Example: Definition -> SED
const SED = ({ properties, required, xml }) => ({
	type: 'object',
	properties,
	required,
	xml: SE.xml(xml),
});

export default SE;

export { SED };
