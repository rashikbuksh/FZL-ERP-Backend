import express, { json, urlencoded } from "express";
import { SERVER_PORT } from "./lib/secret.js";
import { VerifyToken } from "./middleware/auth.js";
import route from "./routes/index.js";
import cors from "./util/cors.js";
// import cors from "@util/cors.js";

const server = express();

server.use(cors);
server.use(urlencoded({ extended: true }));
server.use(json());

// jwt token. If the token is valid, it will be stored in req.user
server.use(VerifyToken);
server.use("/uploads", express.static("uploads"));

server.use(route);

// listen
server.listen(SERVER_PORT, () => {
	console.log("Server listening on port: " + SERVER_PORT);
});

export default server;
