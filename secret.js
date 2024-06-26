import dotenv from "dotenv";
dotenv.config();

// process.env
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, DB_POSTGRES_PORT } =
	process.env;

export { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_POSTGRES_PORT, DB_USER };
