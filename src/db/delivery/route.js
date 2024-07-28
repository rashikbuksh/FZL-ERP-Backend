import { desc, sum } from "drizzle-orm";
import { response, Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import { type } from "../material/schema.js";
import { properties } from "../public/schema.js";
import { description } from "../purchase/schema.js";
import * as challanOperations from "./query/challan.js";
import * as challanEntryOperations from "./query/challan_entry.js";
import * as packingListOperations from "./query/packing_list.js";
import * as packingListEntryOperations from "./query/packing_list_entry.js";

const deliveryRouter = Router();

// packing_list routes
export const pathDeliveryPackingList = {
	"/delivery/packing-list": {
		get: {
			tags: ["delivery.packing-list"],
			summary: "Get all packing lists",
			description: "Get all packing lists",
			// operationId: "getPackingList",
			responses: {
				200: {
					description: "Return list of packing lists",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/delivery/packing_list",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["delivery.packing-list"],
			summary: "Create a new packing list",
			description: "Create a new packing list",
			// operationId: "createPackingList",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Packing list object that needs to be added to the delivery.packing_list",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/packing_list",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "array",
						items: {
							$ref: "#/definitions/delivery/packing_list",
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"/delivery/packing-list/{uuid}": {
		get: {
			tags: ["delivery.packing-list"],
			summary: "Get a packing list by uuid",
			description: "Get a packing list by uuid",
			// operationId: "getPackingListByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "PackingListUuid",
					in: "path",
					description: " packing list to get",
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
					description: "Packing list not found",
				},
			},
		},
		put: {
			tags: ["delivery.packing-list"],
			summary: "Update a packing list by uuid",
			description: "Update a packing list by uuid",
			// operationId: "updatePackingListByUuid",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					name: "PackingListUuid",
					in: "path",
					description: " packing list to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Packing list object that needs to be updated to the delivery.packing_list",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/packing_list",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Packing list not found",
				},
				405: { description: "Validation exception" },
			},
		},
		delete: {
			tags: ["delivery.packing-list"],
			summary: "Delete a packing list by uuid",
			description: "Delete a packing list by uuid",
			// operationId: "deletePackingListByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "PackingListUuid",
					in: "path",
					description: "packing list to delete",
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
					description: "Packing list not found",
				},
			},
		},
	},
};

deliveryRouter.get("/packing-list", packingListOperations.selectAll);
deliveryRouter.get(
	"/packing-list/:uuid",
	validateUuidParam(),
	packingListOperations.select
);
deliveryRouter.post("/packing-list", packingListOperations.insert);
deliveryRouter.put("/packing-list/:uuid", packingListOperations.update);
deliveryRouter.delete(
	"/packing-list/:uuid",
	validateUuidParam(),
	packingListOperations.remove
);

// packing_list_entry routes
export const pathDeliveryPackingListEntry = {
	"/delivery/packing-list-entry": {
		get: {
			tags: ["delivery.packing-list-entry"],
			summary: "Get all packing list entries",
			description: "Get all packing list entries",
			// operationId: "getPackingListEntry",
			responses: {
				200: {
					description: "Return list of packing list entries",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/delivery/packing_list_entry",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["delivery.packing-list-entry"],
			summary: "Create a new packing list entry",
			description: "Create a new packing list entry",
			// operationId: "createPackingListEntry",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Packing list entry object that needs to be added to the delivery.packing_list_entry",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/packing_list_entry",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "array",
						items: {
							$ref: "#/definitions/delivery/packing_list_entry",
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"/delivery/packing-list-entry/{uuid}": {
		get: {
			tags: ["delivery.packing-list-entry"],
			summary: "Get a packing list entry by uuid",
			description: "Get a packing list entry by uuid",
			// operationId: "getPackingListEntryByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "PackingListEntryUuid",
					in: "path",
					description: " packing list entry to get",
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
					description: "Packing list entry not found",
				},
			},
		},
		put: {
			tags: ["delivery.packing-list-entry"],
			summary: "Update a packing list entry by uuid",
			description: "Update a packing list entry by uuid",
			// operationId: "updatePackingListEntryByUuid",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					name: "PackingListEntryUuid",
					in: "path",
					description: " packing list entry to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Packing list entry object that needs to be updated to the delivery.packing_list_entry",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/packing_list_entry",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Packing list entry not found",
				},
				405: { description: "Validation exception" },
			},
		},
		delete: {
			tags: ["delivery.packing-list-entry"],
			summary: "Delete a packing list entry by uuid",
			description: "Delete a packing list entry by uuid",
			// operationId: "deletePackingListEntryByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "PackingListEntryUuid",
					in: "path",
					description: "packing list entry to delete",
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
					description: "Packing list entry not found",
				},
			},
		},
	},
};

deliveryRouter.get("/packing-list-entry", packingListEntryOperations.selectAll);
deliveryRouter.get(
	"/packing-list-entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.select
);
deliveryRouter.post("/packing-list-entry", packingListEntryOperations.insert);
deliveryRouter.put(
	"/packing-list-entry/:uuid",
	packingListEntryOperations.update
);
deliveryRouter.delete(
	"/packing-list-entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.remove
);

// challan routes
export const pathDeliveryChallan = {
	"/delivery/challan": {
		get: {
			tags: ["delivery.challan"],
			summary: "Get all challans",
			description: "Get all challans",
			// operationId: "getChallan",
			responses: {
				200: {
					description: "Return list of challans",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/delivery/challan",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["delivery.challan"],
			summary: "Create a new challan",
			description: "Create a new challan",
			// operationId: "createChallan",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Challan object that needs to be added to the delivery.challan",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/challan",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "array",
						items: {
							$ref: "#/definitions/delivery/challan",
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"/delivery/challan/{uuid}": {
		get: {
			tags: ["delivery.challan"],
			summary: "Get a challan by uuid",
			description: "Get a challan by uuid",
			// operationId: "getChallanByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "ChallanUuid",
					in: "path",
					description: " challan to get",
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
					description: "Challan not found",
				},
			},
		},
		put: {
			tags: ["delivery.challan"],
			summary: "Update a challan by uuid",
			description: "Update a challan by uuid",
			// operationId: "updateChallanByUuid",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					name: "ChallanUuid",
					in: "path",
					description: " challan to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Challan object that needs to be updated to the delivery.challan",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/challan",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Challan not found",
				},
				405: { description: "Validation exception" },
			},
		},
		delete: {
			tags: ["delivery.challan"],
			summary: "Delete a challan by uuid",
			description: "Delete a challan by uuid",
			// operationId: "deleteChallanByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "ChallanUuid",
					in: "path",
					description: "challan to delete",
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
					description: "Challan not found",
				},
			},
		},
	},
};

deliveryRouter.get("/challan", challanOperations.selectAll);
deliveryRouter.get(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.select
);
deliveryRouter.post("/challan", challanOperations.insert);
deliveryRouter.put("/challan/:uuid", challanOperations.update);
deliveryRouter.delete(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.remove
);

// challan_entry routes
export const pathDeliveryChallanEntry = {
	"/delivery/challan-entry": {
		get: {
			tags: ["delivery.challan-entry"],
			summary: "Get all challan entries",
			description: "Get all challan entries",
			// operationId: "getChallanEntry",
			responses: {
				200: {
					description: "Return list of challan entries",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/delivery/challan_entry",
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ["delivery.challan-entry"],
			summary: "Create a new challan entry",
			description: "Create a new challan entry",
			// operationId: "createChallanEntry",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					in: "body",
					name: "body",
					description:
						"Challan entry object that needs to be added to the delivery.challan_entry",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/challan_entry",
					},
				},
			],
			responses: {
				200: {
					description: "successful operation",
					schema: {
						type: "array",
						items: {
							$ref: "#/definitions/delivery/challan_entry",
						},
					},
				},
				405: {
					description: "Invalid input",
				},
			},
		},
	},
	"/delivery/challan-entry/{uuid}": {
		get: {
			tags: ["delivery.challan-entry"],
			summary: "Get a challan entry by uuid",
			description: "Get a challan entry by uuid",
			// operationId: "getChallanEntryByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "ChallanEntryUuid",
					in: "path",
					description: " challan entry to get",
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
					description: "Challan entry not found",
				},
			},
		},
		put: {
			tags: ["delivery.challan-entry"],
			summary: "Update a challan entry by uuid",
			description: "Update a challan entry by uuid",
			// operationId: "updateChallanEntryByUuid",
			consumes: "application/json",
			produces: "application/json",
			parameters: [
				{
					name: "ChallanEntryUuid",
					in: "path",
					description: " challan entry to update",
					required: true,
					type: "string",
					format: "uuid",
				},
				{
					in: "body",
					name: "body",
					description:
						"Challan entry object that needs to be updated to the delivery.challan_entry",
					required: true,
					schema: {
						$ref: "#/definitions/delivery/challan_entry",
					},
				},
			],
			responses: {
				400: {
					description: "Invalid UUID supplied",
				},
				404: {
					description: "Challan entry not found",
				},
				405: { description: "Validation exception" },
			},
		},
		delete: {
			tags: ["delivery.challan-entry"],
			summary: "Delete a challan entry by uuid",
			description: "Delete a challan entry by uuid",
			// operationId: "deleteChallanEntryByUuid",
			produces: ["application/json"],
			parameters: [
				{
					name: "ChallanEntryUuid",
					in: "path",
					description: "challan entry to delete",
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
					description: "Challan entry not found",
				},
			},
		},
	},
};

deliveryRouter.get("/challan-entry", challanEntryOperations.selectAll);
deliveryRouter.get(
	"/challan-entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.select
);
deliveryRouter.post("/challan-entry", challanEntryOperations.insert);
deliveryRouter.put("/challan-entry/:uuid", challanEntryOperations.update);
deliveryRouter.delete(
	"/challan-entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.remove
);
export const pathDelivery = {
	...pathDeliveryPackingList,
	...pathDeliveryPackingListEntry,
	...pathDeliveryChallan,
	...pathDeliveryChallanEntry,
};

export { deliveryRouter };
