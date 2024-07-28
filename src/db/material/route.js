import { desc } from "drizzle-orm";
import { response, Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import { description } from "../purchase/schema.js";
import * as infoOperations from "./query/info.js";
import * as sectionOperations from "./query/section.js";
import * as stockOperations from "./query/stock.js";
import * as trxOperations from "./query/trx.js";
import * as typeOperations from "./query/type.js";
import * as usedOperations from "./query/used.js";
import { type } from "./schema.js";

const materialRouter = Router();

// info routes
export const pathMaterialInfo = {
	"material/info": {
		get: {
			tags: ["material.info"],
			summary: "Get all material info",
			description: "Get all material info",
			response: {
				200: {
					description: "Returns all material info",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/info",
									},
								},
							},
						},
					},
				},
			},
		},

		post: {
			tags: ["material.info"],
			summary: "Create a new material info",
			description: "Create a new material info",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material info object that needs to be added to the material.info",
					required: true,
					schema: {
						$ref: "#/definitions/material/info",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/info",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/info/{uuid}": {
		get: {
			tags: ["material.info"],
			summary: "Get material info by uuid",
			description: "Get material info by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "infoUuid",
					in: "path",
					description: " material info to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material info not found",
				},
			},
		},
		put: {
			tags: ["material.info"],
			summary: "Update an existing material info",
			description: "Update an existing material info",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "infoUuid",
					in: "path",
					description: "material info to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material info object that needs to be updated in the material.info",
					required: true,
					schema: {
						$ref: "#/definitions/material/info",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material info not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.info"],
			summary: "Delete a material info",
			description: "Delete a material info",
			produces: ["application/json"],
			parameters: [
				{
					name: "infoUuid",
					in: "path",
					description: "material info to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material info not found",
				},
			},
		},
	},
};

materialRouter.get("/info", infoOperations.selectAll);
materialRouter.get("/info/:uuid", validateUuidParam(), infoOperations.select);
materialRouter.post("/info", infoOperations.insert);
materialRouter.put("/info/:uuid", infoOperations.update);
materialRouter.delete(
	"/info/:uuid",
	validateUuidParam(),
	infoOperations.remove
);

// section routes
export const pathMaterialSection = {
	"material/section": {
		get: {
			tags: ["material.section"],
			summary: "Get all material section",
			description: "Get all material section",
			response: {
				200: {
					description: "Returns all material section",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/section",
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["material.section"],
			summary: "Create a new material section",
			description: "Create a new material section",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material section object that needs to be added to the material.section",
					required: true,
					schema: {
						$ref: "#/definitions/material/section",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/section",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/section/{uuid}": {
		get: {
			tags: ["material.section"],
			summary: "Get material section by uuid",
			description: "Get material section by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "sectionUuid",
					in: "path",
					description: " material section to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material section not found",
				},
			},
		},
		put: {
			tags: ["material.section"],
			summary: "Update an existing material section",
			description: "Update an existing material section",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "sectionUuid",
					in: "path",
					description: "material section to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material section object that needs to be updated in the material.section",
					required: true,
					schema: {
						$ref: "#/definitions/material/section",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material section not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.section"],
			summary: "Delete a material section",
			description: "Delete a material section",
			produces: ["application/json"],
			parameters: [
				{
					name: "sectionUuid",
					in: "path",
					description: "material section to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material section not found",
				},
			},
		},
	},
};

materialRouter.get("/section", sectionOperations.selectAll);
materialRouter.get(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.select
);
materialRouter.post("/section", sectionOperations.insert);
materialRouter.put("/section/:uuid", sectionOperations.update);
materialRouter.delete(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.remove
);

// stock routes
export const pathMaterialStock = {
	"material/stock": {
		get: {
			tags: ["material.stock"],
			summary: "Get all material stock",
			description: "Get all material stock",
			response: {
				200: {
					description: "Returns all material stock",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/stock",
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["material.stock"],
			summary: "Create a new material stock",
			description: "Create a new material stock",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material stock object that needs to be added to the material.stock",
					required: true,
					schema: {
						$ref: "#/definitions/material/stock",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/stock",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/stock/{uuid}": {
		get: {
			tags: ["material.stock"],
			summary: "Get material stock by uuid",
			description: "Get material stock by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: " material stock to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material stock not found",
				},
			},
		},
		put: {
			tags: ["material.stock"],
			summary: "Update an existing material stock",
			description: "Update an existing material stock",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: "material stock to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material stock object that needs to be updated in the material.stock",
					required: true,
					schema: {
						$ref: "#/definitions/material/stock",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material stock not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.stock"],
			summary: "Delete a material stock",
			description: "Delete a material stock",
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: "material stock to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material stock not found",
				},
			},
		},
	},
};

materialRouter.get("/stock", stockOperations.selectAll);
materialRouter.get("/stock/:uuid", validateUuidParam(), stockOperations.select);
materialRouter.post("/stock", stockOperations.insert);
materialRouter.put("/stock/:uuid", stockOperations.update);
materialRouter.delete(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.remove
);

// trx routes
export const pathMaterialTrx = {
	"material/trx": {
		get: {
			tags: ["material.trx"],
			summary: "Get all material trx",
			description: "Get all material trx",
			response: {
				200: {
					description: "Returns all material trx",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/trx",
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["material.trx"],
			summary: "Create a new material trx",
			description: "Create a new material trx",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material trx object that needs to be added to the material.trx",
					required: true,
					schema: {
						$ref: "#/definitions/material/trx",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/trx",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/trx/{uuid}": {
		get: {
			tags: ["material.trx"],
			summary: "Get material trx by uuid",
			description: "Get material trx by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "trxUuid",
					in: "path",
					description: " material trx to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material trx not found",
				},
			},
		},
		put: {
			tags: ["material.trx"],
			summary: "Update an existing material trx",
			description: "Update an existing material trx",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "trxUuid",
					in: "path",
					description: "material trx to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material trx object that needs to be updated in the material.trx",
					required: true,
					schema: {
						$ref: "#/definitions/material/trx",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material trx not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.trx"],
			summary: "Delete a material trx",
			description: "Delete a material trx",
			produces: ["application/json"],
			parameters: [
				{
					name: "trxUuid",
					in: "path",
					description: "material trx to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material trx not found",
				},
			},
		},
	},
};

materialRouter.get("/trx", trxOperations.selectAll);
materialRouter.get("/trx/:uuid", validateUuidParam(), trxOperations.select);
materialRouter.post("/trx", trxOperations.insert);
materialRouter.put("/trx/:uuid", trxOperations.update);
materialRouter.delete("/trx/:uuid", validateUuidParam(), trxOperations.remove);

// type routes
export const pathMaterialType = {
	"material/type": {
		get: {
			tags: ["material.type"],
			summary: "Get all material type",
			description: "Get all material type",
			response: {
				200: {
					description: "Returns all material type",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/type",
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["material.type"],
			summary: "Create a new material type",
			description: "Create a new material type",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material type object that needs to be added to the material.type",
					required: true,
					schema: {
						$ref: "#/definitions/material/type",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/type",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/type/{uuid}": {
		get: {
			tags: ["material.type"],
			summary: "Get material type by uuid",
			description: "Get material type by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "typeUuid",
					in: "path",
					description: " material type to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material type not found",
				},
			},
		},
		put: {
			tags: ["material.type"],
			summary: "Update an existing material type",
			description: "Update an existing material type",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "typeUuid",
					in: "path",
					description: "material type to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material type object that needs to be updated in the material.type",
					required: true,
					schema: {
						$ref: "#/definitions/material/type",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material type not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.type"],
			summary: "Delete a material type",
			description: "Delete a material type",
			produces: ["application/json"],
			parameters: [
				{
					name: "typeUuid",
					in: "path",
					description: "material type to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material type not found",
				},
			},
		},
	},
};

materialRouter.get("/type", typeOperations.selectAll);
materialRouter.get("/type/:uuid", validateUuidParam(), typeOperations.select);
materialRouter.post("/type", typeOperations.insert);
materialRouter.put("/type/:uuid", typeOperations.update);
materialRouter.delete(
	"/type/:uuid",
	validateUuidParam(),
	typeOperations.remove
);

// used routes
export const pathMaterialUsed = {
	"material/used": {
		get: {
			tags: ["material.used"],
			summary: "Get all material used",
			description: "Get all material used",
			response: {
				200: {
					description: "Returns all material used",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									thing: {
										$ref: "#/definitions/material/used",
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["material.used"],
			summary: "Create a new material used",
			description: "Create a new material used",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Material used object that needs to be added to the material.used",
					required: true,
					schema: {
						$ref: "#/definitions/material/used",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "object",
						properties: {
							thing: {
								$ref: "#/definitions/material/used",
							},
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"material/used/{uuid}": {
		get: {
			tags: ["material.used"],
			summary: "Get material used by uuid",
			description: "Get material used by uuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "usedUuid",
					in: "path",
					description: " material used to get",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material used not found",
				},
			},
		},
		put: {
			tags: ["material.used"],
			summary: "Update an existing material used",
			description: "Update an existing material used",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "usedUuid",
					in: "path",
					description: "material used to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Material used object that needs to be updated in the material.used",
					required: true,
					schema: {
						$ref: "#/definitions/material/used",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material used not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["material.used"],
			summary: "Delete a material used",
			description: "Delete a material used",
			produces: ["application/json"],
			parameters: [
				{
					name: "usedUuid",
					in: "path",
					description: "material used to delete",
					required: true,
					type: "string",
					format: "uuid",
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Material used not found",
				},
			},
		},
	},
};

materialRouter.get("/used", usedOperations.selectAll);
materialRouter.get("/used/:uuid", validateUuidParam(), usedOperations.select);
materialRouter.post("/used", usedOperations.insert);
materialRouter.put("/used/:uuid", usedOperations.update);
materialRouter.delete(
	"/used/:uuid",
	validateUuidParam(),
	usedOperations.remove
);

export const pathMaterial = {
	...pathMaterialInfo,
	...pathMaterialSection,
	...pathMaterialStock,
	...pathMaterialTrx,
	...pathMaterialType,
	...pathMaterialUsed,
};
export { materialRouter };
