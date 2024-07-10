import swaggerJSDoc from "swagger-jsdoc";
import { SERVER_URL } from "./lib/secret.js";

const swaggerSpec = swaggerJSDoc({
	failOnErrors: true,
	definition: {
		openapi: "3.0.0",
		info: {
			title: "FZL API",
			version: "1.0.0",
			description: "FZL API Documentation",
		},
		servers: [{ url: SERVER_URL, description: "Dev" }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["src/db/*/route.js"],
});

export default swaggerSpec;
