import SE, { SED } from '../../../util/swagger_example.js';

export const defLabDipInfo = SED({
	required: [
		'uuid',
		'name',
		'order_info_uuid',
		'thread_order_info_uuid',
		'lab_status',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		id: SE.integer(1),
		name: SE.string('Lab Dip 1'),
		order_info_uuid: SE.uuid(),
		thread_order_info_uuid: SE.uuid(),
		lab_status: SE.integer(0),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/Info',
});

export const defLabDipInfoEntry = SED({
	required: [
		'uuid',
		'lab_dip_info_uuid',
		'recipe_uuid',
		'approved',
		'approved_date',
		'created_by',
		'created_at',
	],
	properties: {
		uuid: SE.uuid(),
		lab_dip_info_uuid: SE.uuid(),
		recipe_uuid: SE.uuid(),
		approved: SE.integer(0),
		approved_date: SE.date_time(),
		created_by: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/InfoEntry',
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
		sub_streat: SE.string('Sub Streat 1'),
		bleaching: SE.string('bleach'),
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
		material_uuid: SE.uuid(),
		created_at: SE.date_time(),
		updated_at: SE.date_time(),
		remarks: SE.string('remarks'),
	},
	xml: 'LabDip/RecipeEntry',
});

// * Marge All
export const defLabDip = {
	info: defLabDipInfo,
	info_entry: defLabDipInfoEntry,
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
	{
		name: 'lab_dip.info_entry',
		description: 'Everything about Lab dip info entry',
	},
];
