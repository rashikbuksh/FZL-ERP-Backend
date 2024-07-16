import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as descriptionOperations from "./query/description.js";
import * as entryOperations from "./query/entry.js";
import * as vendorOperations from "./query/vendor.js";

const purchaseRouter = Router();

// Vendor
const pathPurchaseVendor = {
	"/purchase/vendor": {
		get: {
			summary: "Get all vendors",
			tags: ["purchase.vendor"],
			operationId: "getVendors",
			parameters: [],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/purchase/vendor",
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: "Create a vendor",
			tags: ["purchase.vendor"],
			operationId: "createVendor",
			parameters: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/vendor",
						},
					},
				},
			},
			responses: {
				201: {
					description: "Created",
				},
			},
		},
	},
	"/purchase/vendor/{uuid}": {
		get: {
			summary: "Get a vendor",
			tags: ["purchase.vendor"],
			operationId: "getVendor",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								$ref: "#/definitions/purchase/vendor",
							},
						},
					},
				},
			},
		},
		put: {
			summary: "Update a vendor",
			tags: ["purchase.vendor"],
			operationId: "updateVendor",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/vendor",
						},
					},
				},
			},
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
		delete: {
			summary: "Delete a vendor",
			tags: ["purchase.vendor"],
			operationId: "deleteVendor",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
	},
};

// Vendor routes
purchaseRouter.get("/vendor", vendorOperations.selectAll);
purchaseRouter.get(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.select
);
purchaseRouter.post("/vendor", vendorOperations.insert);
purchaseRouter.put("/vendor/:uuid", vendorOperations.update);
purchaseRouter.delete(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.remove
);

// Description

const pathPurchaseDescription = {
	"/purchase/description": {
		get: {
			summary: "Get all descriptions",
			tags: ["purchase.description"],
			operationId: "getDescriptions",
			parameters: [],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/purchase/description",
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: "Create a description",
			tags: ["purchase.description"],
			operationId: "createDescription",
			parameters: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/description",
						},
					},
				},
			},
			responses: {
				201: {
					description: "Created",
				},
			},
		},
	},
	"/purchase/description/{uuid}": {
		get: {
			summary: "Get a description",
			tags: ["purchase.description"],
			operationId: "getDescription",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								$ref: "#/definitions/purchase/description",
							},
						},
					},
				},
			},
		},
		put: {
			summary: "Update a description",
			tags: ["purchase.description"],
			operationId: "updateDescription",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/description",
						},
					},
				},
			},
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
		delete: {
			summary: "Delete a description",
			tags: ["purchase.description"],
			operationId: "deleteDescription",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
	},
};

// Description routes
purchaseRouter.get("/description", descriptionOperations.selectAll);
purchaseRouter.get(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.select
);
purchaseRouter.post("/description", descriptionOperations.insert);
purchaseRouter.put("/description/:uuid", descriptionOperations.update);

purchaseRouter.delete(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.remove
);

// Entry

const pathPurchaseEntry = {
	"/purchase/entry": {
		get: {
			summary: "Get all entries",
			tags: ["purchase.entry"],
			operationId: "getEntries",
			parameters: [],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/definitions/purchase/entry",
								},
							},
						},
					},
				},
			},
		},
		post: {
			summary: "Create an entry",
			tags: ["purchase.entry"],
			operationId: "createEntry",
			parameters: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/entry",
						},
					},
				},
			},
			responses: {
				201: {
					description: "Created",
				},
			},
		},
	},
	"/purchase/entry/{uuid}": {
		get: {
			summary: "Get an entry",
			tags: ["purchase.entry"],
			operationId: "getEntry",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				200: {
					description: "OK",
					content: {
						"application/json": {
							schema: {
								$ref: "#/definitions/purchase/entry",
							},
						},
					},
				},
			},
		},
		put: {
			summary: "Update an entry",
			tags: ["purchase.entry"],
			operationId: "updateEntry",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/definitions/purchase/entry",
						},
					},
				},
			},
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
		delete: {
			summary: "Delete an entry",
			tags: ["purchase.entry"],
			operationId: "deleteEntry",
			parameters: [
				{
					name: "uuid",
					in: "path",
					required: true,
					schema: {
						type: "string",
						format: "uuid",
					},
				},
			],
			responses: {
				204: {
					description: "No Content",
				},
			},
		},
	},
};

// Entry routes
purchaseRouter.get("/entry", entryOperations.selectAll);
purchaseRouter.get("/entry/:uuid", validateUuidParam(), entryOperations.select);
purchaseRouter.post("/entry", entryOperations.insert);
purchaseRouter.put("/entry/:uuid", entryOperations.update);
purchaseRouter.delete(
	"/entry/:uuid",
	validateUuidParam(),
	entryOperations.remove
);

export const pathPurchase = {
	...pathPurchaseVendor,
	...pathPurchaseDescription,
	...pathPurchaseEntry,
};

export { purchaseRouter };
