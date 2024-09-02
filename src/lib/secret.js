import dotenv from 'dotenv';
dotenv.config();

// process.env
const {
	DB_HOST,
	DB_USER,
	DB_PASS,
	DB_NAME,
	SERVER_PORT,
	DB_POSTGRES_PORT,
	PRIVATE_KEY,
	SALT,
	SERVER_URL,
	PRODUCTION_URL,
} = process.env;

export {
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_POSTGRES_PORT,
	DB_USER,
	PRIVATE_KEY,
	SALT,
	SERVER_PORT,
	SERVER_URL,
	PRODUCTION_URL,
};
