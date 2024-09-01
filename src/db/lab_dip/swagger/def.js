import SE, { SED } from '../../../util/swagger_example.js';
//* ./schema.js#info
export const defLabDipInfo = SED({
	required: ['uuid', 'name', 'order_info_uuid', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		name: SE.string('Lab Dip 1'),
		order_info_uuid: SE.uuid(),
		lab_status: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/Info',
});

export const defLabDipRecipe = SED({
	required: ['uuid', 'lab_dip_info_uuid', 'name', 'created_by', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		lab_dip_info_uuid: SE.uuid(),
		name: SE.string('Recipe 1'),
		approved: SE.integer(0),
		created_by: SE.uuid(),
		status: SE.integer(0),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/Recipe',
});

export const defLabDipRecipeEntry = SED({
	required: ['uuid', 'recipe_uuid', 'color', 'quantity', 'created_at'],
	properties: {
		uuid: SE.uuid(),
		recipe_uuid: SE.uuid(),
		color: SE.string('Red'),
		quantity: SE.number(10),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/RecipeEntry',
});

// * Shade Recipe * //
export const defShadeRecipe = SED({
	required: ['uuid', 'name'],
	properties: {
		uuid: SE.uuid(),
		name: SE.string('Shade Recipe 1'),
		sub_streat: SE.string('Sub Streat 1'),
		lab_status: SE.number(0),
		bleaching: SE.string('bleach'),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/ShareRecipe',
});

// * Shade Recipe Entry * //
export const defShadeRecipeEntry = SED({
	required: [
		'uuid',
		'shade_recipe_uuid',
		'material_uuid',
		'quantity',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		shade_recipe_uuid: SE.uuid(),
		material_uuid: SE.uuid(),
		quantity: SE.number(10),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/ShareRecipeEntry',
});

// * Marge All
export const defLabDip = {
	info: defLabDipInfo,
	recipe: defLabDipRecipe,
	recipe_entry: defLabDipRecipeEntry,
	shade_recipe: defShadeRecipe,
	shade_recipe_entry: defShadeRecipeEntry,
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
	{
		name: 'lab_dip.shade_recipe',
		description: 'Operations about share recipe of Thread',
	},
	{
		name: 'lab_dip.shade_recipe_entry',
		description: 'Operations about share recipe entry of Thread',
	},
];
