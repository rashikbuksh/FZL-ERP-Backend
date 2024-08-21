//* ./schema.js#info

export const defLabDipInfo = {
	type: 'object',
	required: ['uuid', 'name', 'order_info_uuid', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'integer',
			example: 1,
		},
		name: {
			type: 'string',
			example: 'Lab Dip 1',
		},
		order_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		lab_status: {
			type: 'string',
			example: 'Pending',
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
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
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'LabDip/Info',
	},
};

export const defLabDipRecipe = {
	type: 'object',
	required: ['uuid', 'lab_dip_info_uuid', 'name', 'created_by', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		id: {
			type: 'integer',
			example: 1,
		},
		lab_dip_info_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		name: {
			type: 'string',
			example: 'Recipe 1',
		},
		approved: {
			type: 'integer',
			example: 0,
		},
		created_by: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		status: {
			type: 'integer',
			example: 0,
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
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'LabDip/Recipe',
	},
};

export const defLabDipRecipeEntry = {
	type: 'object',
	required: ['uuid', 'recipe_uuid', 'color', 'quantity', 'created_at'],
	properties: {
		uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		recipe_uuid: {
			type: 'string',
			example: 'igD0v9DIJQhJeet',
		},
		color: {
			type: 'string',
			example: 'Red',
		},
		quantity: {
			type: 'number',
			example: 10.0,
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
		remarks: {
			type: 'string',
			example: 'Remarks',
		},
	},
	xml: {
		name: 'LabDip/RecipeEntry',
	},
};

// * Marge All
export const defLabDip = {
	info: defLabDipInfo,
	recipe: defLabDipRecipe,
	recipe_entry: defLabDipRecipeEntry,
};

// * Tag

export const tagLabDip = [
	{
		name: 'lab_dip.info',
		description: 'Everything about info of Lab dip',
		externalDocs: {
			description: 'Find out more about Lab dip',
			url: 'http://swagger.io',
		},
	},
	{
		name: 'lab_dip.recipe',
		description: 'Operations about recipe of Lab dip',
	},
	{
		name: 'lab_dip.recipe_entry',
		description: 'Operations about recipe entry of Lab dip',
	},
];
