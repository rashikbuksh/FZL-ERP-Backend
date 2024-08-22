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
			description = 'Invalid Code';
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

	integer: (example = 0) => ({
		type: 'integer',
		example,
	}),

	date_time: () => ({
		type: 'string',
		format: 'date-time',
		example: '2021-01-01 00:00:00',
	}),

	// * Others
	xml: (name = '') => ({ name }),

	// * Parameters
	parameter_uuid: (description = 'GET DATA') => ({
		name: 'uuid',
		in: 'path',
		required: true,
		type: 'string',
		format: 'uuid',
		description,
		example: 'J3Au9M73Zb9saxj',
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

	response_schema_ref: (code, path) => {
		let base_path = '#/definitions/';

		return {
			description: getDescriptionByCode(code),
			schema: {
				type: 'array',
				items: {
					$ref: base_path + path,
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
