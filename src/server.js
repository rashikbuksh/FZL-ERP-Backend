import express, { json, urlencoded } from "express";
import { SERVER_PORT } from "./lib/secret.js";
import { VerifyToken } from "./middleware/auth.js";
import route from "./routes/index.js";
import cors from "./util/cors.js";
// import cors from "@util/cors.js";

const server = express();

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

server.use(cors);
server.use(urlencoded({ extended: true }));
server.use(json());

// jwt token. If the token is valid, it will be stored in req.user
server.use(VerifyToken);
server.use("/uploads", express.static("uploads"));

server.use(route);

// Swagger options
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "FZL API",
			version: "1.0.0",
			description: "FZL API Documentation",
		},
		servers: [
			{
				url: "http://localhost:3005",
			},
		],
	},
	apis: ["src/routes/index.js"],
};

// Swagger
const specs = swaggerJSDoc(options);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// listen
server.listen(SERVER_PORT, () => {
	console.log("Server listening on port: " + SERVER_PORT);
});

export default server;
