import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as dieCastingOperations from "./query/die_casting.js";
import * as dieCastingProductionOperations from "./query/die_casting_production.js";
import * as dieCastingTransactionOperations from "./query/die_casting_transaction.js";
import * as stockOperations from "./query/stock.js";

const sliderRouter = Router();

// --------------------- STOCK ---------------------

export const pathSliderStock = {
	"/slider/stock": {
		get: {
			tags: ["slider.stock"],
			summary: "Get all stock",
			responses: {
				200: {
					description: "Success",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/slider/stock",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["slider.stock"],
			summary: "create a stock",
			description: "",
			// operationId: "addPet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be added to the slider.stock",
					required: true,
					schema: {
						$ref: "#/definitions/slider/stock",
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
								$ref: "#/definitions/slider/stock",
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
	"/slider/stock/{uuid}": {
		get: {
			tags: ["slider.stock"],
			summary: "Gets a stock",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: "stock to get",
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
					description: "Stock not found",
				},
			},
		},
		put: {
			tags: ["slider.stock"],
			summary: "Update an existing stock",
			description: "",
			// operationId: "updatePet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: "Stock to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be updated to the slider.stock",
					required: true,
					schema: {
						$ref: "#/definitions/slider/stock",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Stock not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["slider.stock"],
			summary: "Deletes a stock",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "stockUuid",
					in: "path",
					description: "Stock to delete",
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
					description: "Stock not found",
				},
			},
		},
	},
};

// --------------------- STOCK ROUTES ---------------------

sliderRouter.get("/stock", stockOperations.selectAll);
sliderRouter.get("/stock/:uuid", validateUuidParam(), stockOperations.select);
sliderRouter.post("/stock", stockOperations.insert);
sliderRouter.put("/stock/:uuid", stockOperations.update);
sliderRouter.delete(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.remove
);

// --------------------- DIE CASTING ---------------------

export const pathSliderDieCasting = {
	"/slider/die-casting": {
		get: {
			tags: ["slider.die-casting"],
			summary: "Get all die casting",
			responses: {
				200: {
					description: "Success",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/slider/die-casting",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["slider.die-casting"],
			summary: "create a die casting",
			description: "",
			// operationId: "addPet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be added to the slider.die-casting",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting",
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
								$ref: "#/definitions/slider/die-casting",
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
	"/slider/die-casting/{uuid}": {
		get: {
			tags: ["slider.die-casting"],
			summary: "Gets a die casting",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingUuid",
					in: "path",
					description: "die casting to get",
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
					description: "Die casting not found",
				},
			},
		},
		put: {
			tags: ["slider.die-casting"],
			summary: "Update an existing die casting",
			description: "",
			// operationId: "updatePet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingUuid",
					in: "path",
					description: "Die casting to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be updated to the slider.die-casting",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Die casting not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["slider.die-casting"],
			summary: "Deletes a die casting",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingUuid",
					in: "path",
					description: "Die casting to delete",
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
					description: "Die casting not found",
				},
			},
		},
	},
};

// --------------------- DIE CASTING ROUTES ---------------------

sliderRouter.get("/die-casting", dieCastingOperations.selectAll);
sliderRouter.get(
	"/die-casting/:uuid",
	validateUuidParam(),
	dieCastingOperations.select
);
sliderRouter.post("/die-casting", dieCastingOperations.insert);
sliderRouter.put("/die-casting/:uuid", dieCastingOperations.update);
sliderRouter.delete(
	"/die-casting/:uuid",
	validateUuidParam(),
	dieCastingOperations.remove
);

// --------------------- DIE CASTING PRODUCTION ---------------------

export const pathSliderDieCastingProduction = {
	"/slider/die-casting-production": {
		get: {
			tags: ["slider.die-casting-production"],
			summary: "Get all die casting production",
			responses: {
				200: {
					description: "Success",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/slider/die-casting-production",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["slider.die-casting-production"],
			summary: "create a die casting production",
			description: "",
			// operationId: "addPet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be added to the slider.die-casting-production",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting-production",
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
								$ref: "#/definitions/slider/die-casting-production",
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
	"/slider/die-casting-production/{uuid}": {
		get: {
			tags: ["slider.die-casting-production"],
			summary: "Gets a die casting production",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingProductionUuid",
					in: "path",
					description: "die casting production to get",
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
					description: "Die casting production not found",
				},
			},
		},
		put: {
			tags: ["slider.die-casting-production"],
			summary: "Update an existing die casting production",
			description: "",
			// operationId: "updatePet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingProductionUuid",
					in: "path",
					description: "Die casting production to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be updated to the slider.die-casting-production",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting-production",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Die casting production not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["slider.die-casting-production"],
			summary: "Deletes a die casting production",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingProductionUuid",
					in: "path",
					description: "Die casting production to delete",
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
					description: "Die casting production not found",
				},
			},
		},
	},
};

// --------------------- DIE CASTING PRODUCTION ROUTES ---------------------

sliderRouter.get(
	"/die-casting-production",
	dieCastingProductionOperations.selectAll
);
sliderRouter.get(
	"/die-casting-production/:uuid",
	validateUuidParam(),
	dieCastingProductionOperations.select
);
sliderRouter.post(
	"/die-casting-production",
	dieCastingProductionOperations.insert
);
sliderRouter.put(
	"/die-casting-production/:uuid",
	dieCastingProductionOperations.update
);
sliderRouter.delete(
	"/die-casting-production/:uuid",
	validateUuidParam(),
	dieCastingProductionOperations.remove
);

// --------------------- DIE CASTING TRANSACTION ---------------------

export const pathSliderDieCastingTransaction = {
	"/slider/die-casting-transaction": {
		get: {
			tags: ["slider.die-casting-transaction"],
			summary: "Get all die casting transaction",
			responses: {
				200: {
					description: "Success",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/slider/die-casting-transaction",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["slider.die-casting-transaction"],
			summary: "create a die casting transaction",
			description: "",
			// operationId: "addPet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be added to the slider.die-casting-transaction",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting-transaction",
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
								$ref: "#/definitions/slider/die-casting-transaction",
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
	"/slider/die-casting-transaction/{uuid}": {
		get: {
			tags: ["slider.die-casting-transaction"],
			summary: "Gets a die casting transaction",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingTransactionUuid",
					in: "path",
					description: "die casting transaction to get",
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
					description: "Die casting transaction not found",
				},
			},
		},
		put: {
			tags: ["slider.die-casting-transaction"],
			summary: "Update an existing die casting transaction",
			description: "",
			// operationId: "updatePet",
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingTransactionUuid",
					in: "path",
					description: "Die casting transaction to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"User object that needs to be updated to the slider.die-casting-transaction",
					required: true,
					schema: {
						$ref: "#/definitions/slider/die-casting-transaction",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Die casting transaction not found",
				},
				405: {
					description: "Validation exception",
				},
			},
		},
		delete: {
			tags: ["slider.die-casting-transaction"],
			summary: "Deletes a die casting transaction",
			description: "",
			// operationId: "deletePet",
			produces: ["application/json"],
			parameters: [
				{
					name: "dieCastingTransactionUuid",
					in: "path",
					description: "Die casting transaction to delete",
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
					description: "Die casting transaction not found",
				},
			},
		},
	},
};

// --------------------- DIE CASTING TRANSACTION ROUTES ---------------------

sliderRouter.get(
	"/die-casting-transaction",
	dieCastingTransactionOperations.selectAll
);
sliderRouter.get(
	"/die-casting-transaction/:uuid",
	validateUuidParam(),
	dieCastingTransactionOperations.select
);
sliderRouter.post(
	"/die-casting-transaction",
	dieCastingTransactionOperations.insert
);
sliderRouter.put(
	"/die-casting-transaction/:uuid",
	dieCastingTransactionOperations.update
);
sliderRouter.delete(
	"/die-casting-transaction/:uuid",
	validateUuidParam(),
	dieCastingTransactionOperations.remove
);

export const pathSlider = {
	...pathSliderStock,
	...pathSliderDieCasting,
	...pathSliderDieCastingProduction,
	...pathSliderDieCastingTransaction,
};

export { sliderRouter };
